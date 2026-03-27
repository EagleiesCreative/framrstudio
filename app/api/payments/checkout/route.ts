import { NextResponse, NextRequest } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase-server";
import { PLAN_ITEMS, ADDON_ITEMS } from "@/lib/pricing";
import { createSubscriptionPlan, createOrGetXenditCustomer } from "@/lib/xendit";
import { getOrCreateOrganization } from "@/lib/org-helper";

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { boothId, company, planKey, addons, billing } = body;

    const finalOrgId = await getOrCreateOrganization(userId, orgId, company);

    // Get user details from Clerk for Xendit customer creation
    const client = await clerkClient();
    const backendUser = await client.users.getUser(userId);
    const userEmail = backendUser.emailAddresses[0]?.emailAddress || '';
    const userName = [backendUser.firstName, backendUser.lastName].filter(Boolean).join(' ') || 'Customer';

    if (!finalOrgId) {
      return NextResponse.json({ error: "Failed to resolve organization" }, { status: 500 });
    }

    if (!planKey || !PLAN_ITEMS[planKey]) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    if (!boothId || boothId === 'create-new') {
      return NextResponse.json({ error: "Invalid booth selected" }, { status: 400 });
    }

    // 2. Compute Pricing exactly as the frontend
    const selectedPlan = PLAN_ITEMS[planKey];
    const validAddonKeys = addons ? addons.filter((a: string) => ADDON_ITEMS[a]) : [];
    
    const billingMultiplier = billing === 'annual' ? 12 : 4;
    const discountFactor = billing === 'annual' ? 0.8 : 1.0;
    
    const discountedPlanAmount = Math.round(selectedPlan.amount * billingMultiplier * discountFactor);
    const xenditItems = [
      {
        type: 'DIGITAL_SERVICE',
        name: selectedPlan.name,
        net_unit_amount: discountedPlanAmount,
        quantity: 1,
      }
    ];

    let totalAmount = discountedPlanAmount;

    for (const addonKey of validAddonKeys) {
      const addon = ADDON_ITEMS[addonKey];
      const addonPrice = Math.round(addon.amount * billingMultiplier * discountFactor);
      totalAmount += addonPrice;
      xenditItems.push({
        type: 'DIGITAL_SERVICE',
        name: addon.name,
        net_unit_amount: addonPrice,
        quantity: 1,
      });
    }

    // 3. Create or get Xendit customer
    const xenditCustomer = await createOrGetXenditCustomer({
      reference_id: userId,
      email: userEmail,
      given_names: userName,
    });
    const xenditCustomerId = xenditCustomer?.id;

    // 4. Create Subscription in Xendit
    const referenceId = `sub-${boothId}-${Date.now()}`;
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const invoiceId = crypto.randomUUID();

    // 5. Create Subscription Plan in Xendit
    const subscriptionResponse = await createSubscriptionPlan({
      reference_id: referenceId,
      customer_id: xenditCustomerId,
      amount: totalAmount,
      interval: 'MONTH',
      interval_count: billingMultiplier,
      items: xenditItems,
      success_return_url: `${origin}/checkout/invoice/${invoiceId}?payment_status=success`,
      failure_return_url: `${origin}/checkout/invoice/${invoiceId}?payment_status=failed`
    });

    console.log("Xendit Subscription Response:", JSON.stringify(subscriptionResponse));

    let checkoutUrl = null;
    if (subscriptionResponse.actions && Array.isArray(subscriptionResponse.actions)) {
      const authAction = subscriptionResponse.actions.find((a: any) => a.action === 'AUTH_URL' || a.action_type === 'AUTH_URL' || a.url);
      if (authAction) {
        checkoutUrl = authAction.url;
      }
    }

    // Fallback if there's an explicit checkout_url property at the root
    if (!checkoutUrl && subscriptionResponse.checkout_url) {
      checkoutUrl = subscriptionResponse.checkout_url;
    }

    if (!checkoutUrl) {
      console.error("Missing checkout URL in Xendit response", subscriptionResponse);
      return NextResponse.json({ error: "Failed to generate checkout link from payment provider" }, { status: 500 });
    }

    // 6. Save Invoice to Database
    const { data: invoiceRecord, error: invoiceError } = await (supabase as any)
      .from('invoices')
      .insert({
        id: invoiceId, // Preset ID
        organization_id: finalOrgId,
        booth_id: boothId || null,
        reference_id: referenceId,
        xendit_subscription_id: subscriptionResponse.id,
        checkout_url: checkoutUrl,
        plan_key: planKey,
        addons: addons || [],
        billing_cycle: billing,
        total_amount: totalAmount,
        status: 'PENDING',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .select('id')
      .single();

    if (invoiceError || !invoiceRecord) {
      console.error("Failed to save invoice to Supabase:", invoiceError);
      return NextResponse.json({ error: "Failed to record invoice locally" }, { status: 500 });
    }

    return NextResponse.json({ 
      invoiceId: invoiceRecord.id, // Return actual invoice
      checkoutUrl,
      items: xenditItems,
      totalAmount
    });

  } catch (err: any) {
    console.error("/api/payments/checkout POST error", err);
    return NextResponse.json({
      error: err.message || "Internal server error"
    }, { status: 500 });
  }
}
