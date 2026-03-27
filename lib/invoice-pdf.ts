/**
 * Server-side invoice PDF generator using PDFKit.
 * Returns a Buffer containing the PDF bytes.
 * Import only in server-side code (API routes, webhooks).
 */

import { PLAN_ITEMS, ADDON_ITEMS } from '@/lib/pricing';

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

export interface InvoiceRecord {
  id: string;
  reference_id: string;
  plan_key: string;
  addons: string[];
  billing_cycle: string; // 'annual' | 'quadrimester'
  total_amount: number;
  status: string;
  created_at: string;
  expires_at: string;
  organization?: { name: string } | null;
  booth?: { location: string } | null;
}

export async function generateInvoicePdf(invoice: InvoiceRecord): Promise<Buffer> {
  // Dynamic import keeps it out of the browser bundle
  const PDFDocument = (await import('pdfkit')).default;

  const companyName = invoice.organization?.name ?? 'Personal';
  const locationName = invoice.booth?.location ?? '';
  const invoiceDate = new Date(invoice.created_at);
  const dueDate = new Date(invoice.expires_at);
  const billingText = invoice.billing_cycle === 'annual' ? '1 Year (Annual)' : '4 Months';

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Build line items
  const planItem = PLAN_ITEMS[invoice.plan_key];
  const addonItemsMeta = (invoice.addons || [])
    .map((key) => ADDON_ITEMS[key])
    .filter(Boolean);

  const totalAddonAmount = addonItemsMeta.reduce(
    (sum, a) => sum + a.amount * (invoice.billing_cycle === 'annual' ? 12 * 0.8 : 4),
    0
  );
  const planAmount = invoice.total_amount - totalAddonAmount;

  const lineItems: { name: string; amount: number }[] = [
    { name: planItem?.name ?? 'Subscription Plan', amount: planAmount },
    ...addonItemsMeta.map((a) => ({
      name: a.name,
      amount: a.amount * (invoice.billing_cycle === 'annual' ? 12 * 0.8 : 4),
    })),
  ];

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 60, bottom: 60, left: 50, right: 50 },
    info: { Title: `Invoice ${invoice.reference_id}`, Author: 'Framr Studio' },
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  await new Promise<void>((resolve, reject) => {
    doc.on('end', resolve);
    doc.on('error', reject);

    const pageW = doc.page.width;
    const marginL = 50;
    const contentW = pageW - marginL * 2;

    const orange = '#FF6600';
    const black = '#111827';
    const gray = '#6B7280';

    // ── Header ──────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(24).fillColor(black).text('Invoice', marginL, 55);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(orange)
      .text('FRAMR STUDIO', marginL, 55, { align: 'right', width: contentW });
    doc.font('Helvetica').fontSize(8).fillColor(gray)
      .text('photobooth platform', marginL, 75, { align: 'right', width: contentW });

    // Status badge
    const isPaid = invoice.status === 'PAID';
    doc.roundedRect(pageW - marginL - 52, 90, 52, 16, 3)
      .fillColor(isPaid ? '#D1FAE5' : '#FEF3C7').fill();
    doc.font('Helvetica-Bold').fontSize(7.5)
      .fillColor(isPaid ? '#10B981' : '#D97706')
      .text(isPaid ? 'PAID' : 'PENDING', pageW - marginL - 52, 96, { width: 52, align: 'center' });

    // ── Invoice meta ─────────────────────────────────────────
    let y = 98;
    const labelX = marginL;
    const valueX = marginL + 95;

    [
      { label: 'Invoice number', value: invoice.reference_id },
      { label: 'Date of issue',  value: fmt(invoiceDate) },
      { label: 'Date due',       value: fmt(dueDate) },
    ].forEach(({ label, value }) => {
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(gray).text(label, labelX, y);
      doc.font('Helvetica').fontSize(8.5).fillColor(black).text(value, valueX, y);
      y += 13;
    });

    // ── Divider ──────────────────────────────────────────────
    y += 10;
    doc.moveTo(marginL, y).lineTo(marginL + contentW, y).strokeColor('#E5E7EB').lineWidth(0.5).stroke();
    y += 12;

    // ── Two-column addresses ─────────────────────────────────
    const col2X = marginL + contentW / 2;

    doc.font('Helvetica-Bold').fontSize(8).fillColor(gray)
      .text('FROM', labelX, y).text('BILL TO', col2X, y);
    y += 12;

    doc.font('Helvetica-Bold').fontSize(10).fillColor(black)
      .text('Framr Studio, Inc.', labelX, y)
      .text(companyName.toUpperCase(), col2X, y);

    doc.font('Helvetica').fontSize(8.5).fillColor(gray)
      .text('Jakarta Selatan, Indonesia', labelX, y + 13)
      .text('billing@framr.studio', labelX, y + 25)
      .text(locationName, col2X, y + 13);

    y += 48;

    // ── Amount due heading ───────────────────────────────────
    doc.moveTo(marginL, y).lineTo(marginL + contentW, y).strokeColor('#E5E7EB').lineWidth(0.5).stroke();
    y += 10;
    doc.font('Helvetica-Bold').fontSize(13).fillColor(black)
      .text(`${formatRupiah(invoice.total_amount)} due ${fmt(dueDate)}`, marginL, y);
    y += 22;

    // ── Table header ─────────────────────────────────────────
    doc.roundedRect(marginL, y, contentW, 20, 2).fillColor('#F9FAFB').fill();
    doc.font('Helvetica-Bold').fontSize(8).fillColor(gray);
    doc.text('DESCRIPTION', marginL + 4, y + 6.5);
    doc.text('PERIOD', marginL + 240, y + 6.5);
    doc.text('QTY', marginL + 320, y + 6.5);
    doc.text('UNIT PRICE', marginL + 360, y + 6.5);
    doc.text('AMOUNT', marginL, y + 6.5, { width: contentW - 4, align: 'right' });
    y += 24;

    // ── Table rows ───────────────────────────────────────────
    lineItems.forEach((item) => {
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(black).text(item.name, marginL + 4, y);
      doc.font('Helvetica').fontSize(8.5).fillColor(gray)
        .text(billingText, marginL + 240, y)
        .text('1', marginL + 324, y)
        .text(formatRupiah(item.amount), marginL + 360, y);
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(black)
        .text(formatRupiah(item.amount), marginL, y, { width: contentW - 4, align: 'right' });
      y += 24;
      doc.moveTo(marginL, y - 4).lineTo(marginL + contentW, y - 4).strokeColor('#F3F4F6').lineWidth(0.3).stroke();
    });

    // ── Totals ───────────────────────────────────────────────
    y += 8;
    const totW = contentW * 0.42;
    const totX = marginL + contentW - totW;

    const drawRow = (label: string, value: string, bold = false) => {
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(bold ? 10 : 9)
        .fillColor(bold ? black : gray)
        .text(label, totX, y)
        .text(value, totX, y, { width: totW, align: 'right' });
      y += 15;
    };

    drawRow('Subtotal', formatRupiah(invoice.total_amount));
    drawRow('PPN (0%)', 'Rp 0');
    doc.moveTo(totX, y).lineTo(totX + totW, y).strokeColor(black).lineWidth(0.8).stroke();
    y += 8;
    drawRow('Amount due', formatRupiah(invoice.total_amount), true);

    // ── Footer ───────────────────────────────────────────────
    const footerY = doc.page.height - 52;
    doc.moveTo(marginL, footerY).lineTo(marginL + contentW, footerY).strokeColor('#E5E7EB').lineWidth(0.4).stroke();
    doc.font('Helvetica').fontSize(8).fillColor(gray)
      .text('For billing questions visit  ', marginL, footerY + 10, { continued: true })
      .fillColor(orange)
      .text('https://dash.framr.studio/support', { link: 'https://dash.framr.studio/support', underline: true });

    doc.end();
  });

  return Buffer.concat(chunks);
}
