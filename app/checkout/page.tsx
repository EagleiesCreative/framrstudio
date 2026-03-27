import Link from 'next/link';
import CheckoutBillingForm from '@/app/checkout/CheckoutBillingForm';
import SiteFooter from '@/app/components/site/SiteFooter';
import SiteNav from '@/app/components/site/SiteNav';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase-server';

import { PLAN_ITEMS, ADDON_ITEMS, PLAN_KEYS, ADDON_KEYS } from '@/lib/pricing';

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

type CheckoutPageProps = {
  searchParams: Promise<{
    item?: string;
    plan?: string;
    addons?: string;
    billing?: string;
  }>;
};

import { getOrCreateOrganization } from '@/lib/org-helper';
import { redirect } from 'next/navigation';

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Defensively get the organization ID or the first available one to load booths
  const finalOrgId = await getOrCreateOrganization(userId, orgId);

  let booths: { id: string; name: string; booth_code: string }[] = [];
  if (finalOrgId) {
    const { data } = await supabase
      .from('booths')
      .select('id, name, booth_code')
      .eq('organization_id', finalOrgId)
      .order('created_at', { ascending: false });

    if (data) {
      booths = data;
    }
  }

  const { item, plan, addons, billing } = await searchParams;

  const legacyPlan = item && PLAN_KEYS.includes(item) ? item : undefined;
  const legacyAddon = item && ADDON_KEYS.includes(item) ? item : undefined;

  const selectedPlanKey = plan && PLAN_KEYS.includes(plan) ? plan : (legacyPlan ?? 'professional');
  const selectedBilling = billing === '4-months' ? '4-months' : 'annual';

  const selectedAddonKeys = Array.from(
    new Set(
      (addons ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter((value) => ADDON_KEYS.includes(value))
        .concat(legacyAddon ? [legacyAddon] : []),
    ),
  );

  const selectedPlan = PLAN_ITEMS[selectedPlanKey];
  const selectedAddons = selectedAddonKeys.map((key) => ADDON_ITEMS[key]);
  
  // Calculate amounts based on billing cycle
  const billingMultiplier = selectedBilling === 'annual' ? 12 : 4;
  const discountFactor = selectedBilling === 'annual' ? 0.8 : 1.0;
  
  const discountedPlanAmount = Math.round(selectedPlan.amount * billingMultiplier * discountFactor);
  const totalAddonsAmount = selectedAddons.reduce((sum, addon) => sum + Math.round(addon.amount * billingMultiplier * discountFactor), 0);
  const total = discountedPlanAmount + totalAddonsAmount;

  const createHref = (nextPlan: string, nextAddons: string[], nextBilling: '4-months' | 'annual' = selectedBilling) => {
    const params = new URLSearchParams();
    params.set('plan', nextPlan);
    params.set('billing', nextBilling);

    if (nextAddons.length > 0) {
      params.set('addons', nextAddons.join(','));
    }

    return `/checkout?${params.toString()}`;
  };

  const planOptions = PLAN_KEYS;
  const addonOptions = ADDON_KEYS;

  return (
    <>
      <SiteNav />
      <main className="px-16 py-16 max-[1024px]:px-4 max-[1024px]:py-10">
        <section className="mb-10 text-center">
          <div className="mb-[18px] inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.1em] text-[var(--accent)] before:h-[2px] before:w-5 before:rounded before:bg-[var(--accent)] before:content-['']">Checkout</div>
          <h2 className="font-[var(--font-syne)] text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-1.5px] text-[var(--ink)]">Complete your purchase</h2>
          <p className="mt-3 text-[var(--ink-soft)]">Review your order details and continue to payment.</p>
        </section>

        <section className="mx-auto grid max-w-[1040px] grid-cols-[1.45fr_1fr] gap-5 max-[1024px]:grid-cols-1">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--white)] p-7 shadow-[var(--shadow-sm)]">
            <h3 className="mb-[18px] font-[var(--font-syne)] text-[22px] tracking-[-0.5px]">Choose package</h3>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--ink-soft)]">Billing cycle</p>
              <div className="grid grid-cols-2 gap-2.5 max-[1024px]:grid-cols-1">
                <Link
                  href={createHref(selectedPlanKey, selectedAddonKeys, '4-months')}
                  className={`flex items-center justify-between gap-3.5 rounded-md border px-3 py-2.5 no-underline transition-all ${selectedBilling === '4-months'
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--ink)]'
                    : 'border-[var(--border)] bg-[var(--off)] text-[var(--ink)] hover:border-[var(--border-strong)] hover:bg-[var(--off2)]'
                    }`}
                >
                  <span className="text-sm font-semibold">4 Months</span>
                  <strong className="text-[13px] text-[var(--ink-mid)]">Standard rate</strong>
                </Link>
                <Link
                  href={createHref(selectedPlanKey, selectedAddonKeys, 'annual')}
                  className={`flex items-center justify-between gap-3.5 rounded-md border px-3 py-2.5 no-underline transition-all ${selectedBilling === 'annual'
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--ink)]'
                    : 'border-[var(--border)] bg-[var(--off)] text-[var(--ink)] hover:border-[var(--border-strong)] hover:bg-[var(--off2)]'
                    }`}
                >
                  <span className="text-sm font-semibold">Annual</span>
                  <strong className="text-[13px] text-[var(--ink-mid)]">Save 20%</strong>
                </Link>
              </div>

              <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--ink-soft)]">Plans</p>
              <div className="grid grid-cols-1 gap-2.5">
                {planOptions.map((option) => {
                  const optionItem = PLAN_ITEMS[option];
                  const isActive = selectedPlanKey === option;
                  const optionAmount = selectedBilling === 'annual'
                    ? Math.round(optionItem.amount * 12 * 0.8)
                    : Math.round(optionItem.amount * 4);

                  return (
                    <Link
                      key={option}
                      href={createHref(option, selectedAddonKeys)}
                      className={`flex items-center justify-between gap-3.5 rounded-md border px-3 py-2.5 no-underline transition-all ${isActive
                        ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--ink)]'
                        : 'border-[var(--border)] bg-[var(--off)] text-[var(--ink)] hover:border-[var(--border-strong)] hover:bg-[var(--off2)]'
                        }`}
                    >
                      <span className="text-sm font-semibold">{optionItem.name}</span>
                      <strong className="text-[13px] text-[var(--ink-mid)]">{`${formatRupiah(optionAmount)} / ${selectedBilling === 'annual' ? 'year' : '4 months'}`}</strong>
                    </Link>
                  );
                })}
              </div>

              <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--ink-soft)]">Add-ons</p>
              <div className="grid grid-cols-1 gap-2.5">
                {addonOptions.map((option) => {
                  const optionItem = ADDON_ITEMS[option];
                  const isActive = selectedAddonKeys.includes(option);

                  const nextAddons = isActive
                    ? selectedAddonKeys.filter((key) => key !== option)
                    : [...selectedAddonKeys, option];
                    
                  const optionAddonAmount = selectedBilling === 'annual'
                    ? Math.round(optionItem.amount * 12 * 0.8)
                    : Math.round(optionItem.amount * 4);

                  return (
                    <Link
                      key={option}
                      href={createHref(selectedPlanKey, nextAddons)}
                      className={`flex items-center justify-between gap-3.5 rounded-md border px-3 py-2.5 no-underline transition-all ${isActive
                        ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--ink)]'
                        : 'border-[var(--border)] bg-[var(--off)] text-[var(--ink)] hover:border-[var(--border-strong)] hover:bg-[var(--off2)]'
                        }`}
                    >
                      <span className="text-sm font-semibold">{optionItem.name}</span>
                      <strong className="text-[13px] text-[var(--ink-mid)]">{`${formatRupiah(optionAddonAmount)} / ${selectedBilling === 'annual' ? 'year' : '4 months'}`}</strong>
                    </Link>
                  );
                })}
              </div>
            </div>

            <CheckoutBillingForm 
              booths={booths} 
              planKey={selectedPlanKey} 
              addons={selectedAddonKeys} 
              billing={selectedBilling} 
            />
          </div>

          <aside className="h-fit rounded-3xl border border-[var(--border)] bg-[var(--white)] p-7 shadow-[var(--shadow-sm)]">
            <h3 className="mb-[18px] font-[var(--font-syne)] text-[22px] tracking-[-0.5px]">Order summary</h3>
            <div className="mb-2.5 flex justify-between gap-[18px] text-sm text-[var(--ink-soft)]">
              <span>Product</span>
              <strong className="text-right text-[var(--ink)]">{selectedPlan.name}</strong>
            </div>
            <div className="mb-2.5 flex justify-between gap-[18px] text-sm text-[var(--ink-soft)]">
              <span></span>
              <strong className="text-right text-[var(--ink)]">{formatRupiah(discountedPlanAmount)}</strong>
            </div>
            <div className="mb-2.5 flex justify-between gap-[18px] text-sm text-[var(--ink-soft)]">
              <span>Type</span>
              <strong className="text-right text-[var(--ink)]">{selectedAddonKeys.length > 0 ? 'Plan + Add-ons' : 'Plan'}</strong>
            </div>
            <div className="mb-2.5 flex justify-between gap-[18px] text-sm text-[var(--ink-soft)]">
              <span>Billing</span>
              <strong className="text-right text-[var(--ink)]">{selectedBilling === 'annual' ? 'Annual (20% off)' : 'Every 4 Months'}</strong>
            </div>
            <p className="mt-1 text-sm leading-[1.65] text-[var(--ink-mid)]">{selectedPlan.description}</p>

            {selectedAddons.length > 0 && (
              <>
                <hr className="my-6 border-0 border-t border-[var(--border)]" />
                <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--ink-soft)]">Selected add-ons</p>
                <div className="mt-2 flex flex-col gap-2">
                  {selectedAddons.map((addon) => {
                    const addonPrice = selectedBilling === 'annual'
                      ? Math.round(addon.amount * 12 * 0.8)
                      : Math.round(addon.amount * 4);
                    return (
                      <div key={addon.name} className="mb-0 flex justify-between gap-[18px] text-sm text-[var(--ink-soft)]">
                        <span>{addon.name}</span>
                        <strong className="text-right text-[var(--ink)]">{formatRupiah(addonPrice)}</strong>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <hr className="my-6 border-0 border-t border-[var(--border)]" />

            <div className="mt-1 flex items-end justify-between">
              <span className="text-sm text-[var(--ink-soft)]">Total</span>
              <strong className="font-[var(--font-syne)] text-[34px] leading-none tracking-[-1px] text-[var(--ink)]">{formatRupiah(total)}</strong>
            </div>
            {selectedBilling === 'annual' && (
              <p className="mt-2 text-[13px] text-[var(--ink-soft)]">Includes 20% annual discount.</p>
            )}
            <p className="mt-2 text-[13px] text-[var(--ink-soft)]">{selectedPlan.note}</p>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
