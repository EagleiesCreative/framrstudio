export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase-server';
import { generateInvoicePdf } from '@/lib/invoice-pdf';
import { clerkClient } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

/**
 * Xendit sends subscription payment events here.
 * Supported events:
 *   - subscription.cycle.succeeded  → mark PAID, store PDF, email user
 *   - subscription.cycle.failed     → mark FAILED
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Xendit webhook token
    const xenditToken = req.headers.get('x-callback-token');
    if (xenditToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      console.warn('/api/webhooks/xendit: Invalid callback token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { event, data } = body;

    console.log(`/api/webhooks/xendit event=${event}`, JSON.stringify(body).slice(0, 400));

    // 2. Find matching invoice by xendit_subscription_id
    const xenditSubscriptionId = data?.subscription_id ?? data?.id;

    if (!xenditSubscriptionId) {
      console.warn('/api/webhooks/xendit: No subscription_id in payload');
      return NextResponse.json({ received: true });
    }

    const { data: invoice, error: findError } = await (supabase as any)
      .from('invoices')
      .select('*, organization:organizations(id, name), booth:booths(location)')
      .eq('xendit_subscription_id', xenditSubscriptionId)
      .single();

    if (findError || !invoice) {
      console.warn('/api/webhooks/xendit: Invoice not found for', xenditSubscriptionId);
      return NextResponse.json({ received: true });
    }

    // 3. Handle each event type
    if (event === 'subscription.cycle.succeeded' || event === 'payment.succeeded') {
      await handlePaymentSucceeded(invoice);
    } else if (event === 'subscription.cycle.failed' || event === 'payment.failed') {
      await (supabase as any)
        .from('invoices')
        .update({ status: 'FAILED' })
        .eq('id', invoice.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('/api/webhooks/xendit POST error', err);
    // Always return 200 to Xendit so it doesn't retry on our bugs
    return NextResponse.json({ received: true });
  }
}

async function handlePaymentSucceeded(invoice: any) {
  const invoiceId: string = invoice.id;
  const orgId: string = invoice.organization_id;

  // ── 3a. Update invoice status ─────────────────────────────
  await (supabase as any)
    .from('invoices')
    .update({ status: 'PAID' })
    .eq('id', invoiceId);

  // Update org subscription
  await (supabase as any)
    .from('organizations')
    .update({
      subscription_plan: invoice.plan_key,
      subscription_status: 'active',
      subscription_expires_at: invoice.expires_at,
    })
    .eq('id', orgId);

  // ── 3b. Generate PDF ──────────────────────────────────────
  let pdfBuffer: Buffer | null = null;
  let pdfStorageUrl: string | null = null;

  try {
    pdfBuffer = await generateInvoicePdf({ ...invoice, status: 'PAID' });

    // ── 3c. Upload to Supabase Storage ────────────────────────
    const storagePath = `${orgId}/${invoiceId}.pdf`;
    const { error: uploadError } = await (supabase as any)
      .storage
      .from('invoices')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('/api/webhooks/xendit: Storage upload error', uploadError);
    } else {
      // Create a signed URL valid for 10 years (approx)
      const { data: signedData } = await (supabase as any)
        .storage
        .from('invoices')
        .createSignedUrl(storagePath, 60 * 60 * 24 * 365 * 10);

      pdfStorageUrl = signedData?.signedUrl ?? null;

      if (pdfStorageUrl) {
        await (supabase as any)
          .from('invoices')
          .update({ pdf_url: pdfStorageUrl })
          .eq('id', invoiceId);
      }
    }
  } catch (pdfErr) {
    console.error('/api/webhooks/xendit: PDF generation error', pdfErr);
  }

  // ── 3d. Look up billing email from Clerk ──────────────────
  let billingEmail: string | null = null;
  let recipientName = invoice.organization?.name ?? 'Customer';

  try {
    const client = await clerkClient();
    const memberships = await client.organizations.getOrganizationMembershipList({ organizationId: orgId });
    // Find the admin member to send to
    const adminMember = memberships.data.find(
      (m) => m.role === 'org:admin'
    );
    if (adminMember?.publicUserData?.userId) {
      const user = await client.users.getUser(adminMember.publicUserData.userId);
      billingEmail = user.emailAddresses[0]?.emailAddress ?? null;
      recipientName = [user.firstName, user.lastName].filter(Boolean).join(' ') || recipientName;
    }
  } catch (clerkErr) {
    console.error('/api/webhooks/xendit: Clerk lookup error', clerkErr);
  }

  // ── 3e. Send email via Resend ──────────────────────────────
  if (billingEmail) {
    try {
      const invoiceDate = new Date(invoice.created_at);
      const dueDate = new Date(invoice.expires_at);
      const fmt = (d: Date) =>
        d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const formatRupiah = (v: number) => `Rp ${new Intl.NumberFormat('id-ID').format(v)}`;

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://framr.studio';
      const invoiceUrl = `${siteUrl}/checkout/invoice/${invoiceId}`;

      const attachments: any[] = [];
      if (pdfBuffer) {
        attachments.push({
          filename: `invoice-${invoice.reference_id}.pdf`,
          content: pdfBuffer.toString('base64'),
        });
      }

      await resend.emails.send({
        from: 'Framr Studio Billing <billing@framr.studio>',
        to: billingEmail,
        subject: `Invoice ${invoice.reference_id} - Payment Confirmed`,
        attachments,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${invoice.reference_id}</title>
</head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:28px 36px;">
              <span style="font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.5px;">FRAMR</span>
              <span style="font-size:22px;font-weight:700;color:#FF6600;letter-spacing:-0.5px;">STUDIO</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 24px;">
              <p style="margin:0 0 6px;font-size:13px;color:#6B7280;">Payment confirmed</p>
              <h1 style="margin:0 0 24px;font-size:26px;font-weight:700;color:#111827;">
                ${formatRupiah(invoice.total_amount)}
              </h1>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
                <tr style="background:#F9FAFB;">
                  <td style="padding:12px 16px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;">Invoice number</td>
                  <td style="padding:12px 16px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;">Date</td>
                  <td style="padding:12px 16px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;">Due date</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:13px;color:#111827;font-weight:600;">${invoice.reference_id}</td>
                  <td style="padding:14px 16px;font-size:13px;color:#374151;">${fmt(invoiceDate)}</td>
                  <td style="padding:14px 16px;font-size:13px;color:#374151;">${fmt(dueDate)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:0 36px 36px;">
              <p style="margin:0 0 18px;font-size:13px;color:#374151;line-height:1.6;">
                Thank you, <strong>${recipientName}</strong>! Your subscription is now active. 
                Your invoice PDF is attached to this email. You can also view it online anytime.
              </p>
              <a href="${invoiceUrl}"
                style="display:inline-block;background:#111827;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;">
                View Invoice Online
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #E5E7EB;padding:20px 36px;background:#F9FAFB;">
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Questions? Visit 
                <a href="https://dash.framr.studio/support" style="color:#FF6600;">dash.framr.studio/support</a>
                &nbsp;·&nbsp; Framr Studio, Jakarta Selatan, Indonesia
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim(),
      });

      console.log(`/api/webhooks/xendit: Email sent to ${billingEmail} for invoice ${invoiceId}`);
    } catch (emailErr) {
      console.error('/api/webhooks/xendit: Resend email error', emailErr);
    }
  }
}
