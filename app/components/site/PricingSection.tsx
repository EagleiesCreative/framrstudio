'use client';

import Link from 'next/link';
import { useState } from 'react';

type PricingSectionProps = {
  id?: string;
};

export default function PricingSection({ id = 'pricing' }: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const planPrices = {
    growth: 350000,
    professional: 650000,
    panoramicPlus: 800000,
  };

  const getDisplayPrice = (value: number) => {
    const amount = isAnnual ? Math.round(value * 0.9) : value;
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const billingParam = isAnnual ? 'annual' : 'monthly';

  const planCycleText = isAnnual ? 'per month, billed annually' : 'per month, billed monthly';

  const optionBaseClass = 'block w-full rounded-[100px] border px-[13px] py-[13px] text-center text-sm font-semibold no-underline transition-all';
  const optionInactiveClass = 'border-[var(--border)] bg-[var(--off)] text-[var(--ink)] hover:border-[var(--border-strong)] hover:bg-[var(--off2)]';

  return (
    <section className="px-16 py-24 max-[1024px]:px-4" id={id}>
      <div className="mb-12 text-center">
        <div className="mb-6 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent before:h-0.5 before:w-5 before:rounded before:bg-accent before:content-['']">Pricing</div>
        <h2 className="font-syne text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.25] text-ink">Simple, startup-friendly pricing</h2>
        <p className="mx-auto mt-4 max-w-[420px] text-[17px] text-ink-soft">Start free. Scale as you grow. No surprise fees.</p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-[100px] border border-border bg-off p-1">
            <button className={`rounded-[100px] px-5 py-2 text-[13px] font-semibold transition-all ${!isAnnual ? 'bg-white text-ink shadow-sm' : 'text-ink-soft'}`} type="button" onClick={() => setIsAnnual(false)}>Monthly</button>
            <button className={`rounded-[100px] px-5 py-2 text-[13px] font-semibold transition-all ${isAnnual ? 'bg-white text-ink shadow-sm' : 'text-ink-soft'}`} type="button" onClick={() => setIsAnnual(true)}>Annual <span className="ml-1.5 rounded-[100px] bg-[#EAF9F1] px-2 py-0.5 text-[11px] font-bold text-[#1A8A4A]">Save 10%</span></button>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-fit grid-cols-3 gap-6 max-[1024px]:grid-cols-1">
        <div className="relative rounded-3xl border-[1.5px] border-border bg-white px-9 py-9 transition-all w-fit hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-ink-soft">Growth</div>
          <div className="mb-3 flex items-baseline gap-2"><span className="text-xl font-semibold text-ink">Rp</span><span className="font-syne text-5xl font-extrabold leading-[1.4] text-ink">{getDisplayPrice(planPrices.growth)}</span></div>
          <div className="mb-8 text-[13px] text-ink-soft">{planCycleText}</div>
          <p className="mb-8 text-sm leading-[1.6] text-ink-soft">Perfect for solo operators just getting started with their first booths.</p>
          <hr className="mb-6 border-0 border-t border-border" />
          <ul className="mb-8 flex list-none flex-col gap-3">
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> Up to 3 events/month</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> 500 photos per event</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> 10 template designs</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> QR + email sharing</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> Basic analytics</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> 1 user seat</li>
          </ul>
          <Link href={`/checkout?plan=growth&billing=${billingParam}`} className={`${optionBaseClass} ${optionInactiveClass}`}>Start free trial</Link>
        </div>
        <div className="relative rounded-3xl border-[1.5px] border-accent bg-white px-9 py-9 shadow-[0_0_0_1px_theme(colors.accent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_theme(colors.accent),var(--shadow-md)]">
          <div className="absolute left-1/2 top-[-14px] -translate-x-1/2 whitespace-nowrap rounded-[100px] bg-accent px-4 py-1 text-[11px] font-bold uppercase tracking-[.08em] text-white">Most Popular</div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-accent">Professional</div>
          <div className="mb-3 flex items-baseline gap-2"><span className="text-xl font-semibold text-ink">Rp</span><span className="font-syne text-[48px] font-extrabold leading-[1.4] text-ink">{getDisplayPrice(planPrices.professional)}</span></div>
          <div className="mb-8 text-[13px] text-ink-soft">{planCycleText}</div>
          <p className="mb-8 text-sm leading-[1.6] text-ink-soft">For growing studios running multiple events and needing premium tools.</p>
          <hr className="mb-6 border-0 border-t border-border" />
          <ul className="mb-8 flex list-none flex-col gap-3">
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span> Unlimited events</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span> Unlimited photos</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span> 100+ premium templates</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span> SMS, QR &amp; email sharing</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span> AI background removal</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span> Boomerang &amp; GIF mode</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span> Full analytics suite</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span> 5 user seats</li>
          </ul>
          <Link href={`/checkout?plan=professional&billing=${billingParam}`} className={`${optionBaseClass} border-accent bg-accent text-white hover:bg-[#4a4edc] hover:shadow-[0_4px_16px_rgba(91,95,238,.35)]`}>Start free trial</Link>
        </div>
        <div className="relative rounded-3xl border-[1.5px] border-border bg-white px-9 py-9 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-ink-soft">Panoramic+</div>
          <div className="mb-3 flex items-baseline gap-2"><span className="text-xl font-semibold text-ink">Rp</span><span className="font-syne text-[48px] font-extrabold leading-[1.4] text-ink">{getDisplayPrice(planPrices.panoramicPlus)}</span></div>
          <div className="mb-8 text-[13px] text-ink-soft">{planCycleText}</div>
          <p className="mb-8 text-sm leading-[1.6] text-ink-soft">For agencies and enterprises needing 360° capabilities and white-label control.</p>
          <hr className="mb-6 border-0 border-t border-border" />
          <ul className="mb-8 flex list-none flex-col gap-3">
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> Everything in Professional</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> 360° panoramic booth mode</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> Multi-camera sync</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> Full white-label branding</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> Priority support &amp; SLA</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> API access &amp; webhooks</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> Unlimited seats</li>
            <li className="flex items-start gap-2.5 text-sm text-ink-mid"><span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent">✓</span> Dedicated account manager</li>
          </ul>
          <Link href={`/checkout?plan=panoramic-plus&billing=${billingParam}`} className={`${optionBaseClass} ${optionInactiveClass}`}>Contact sales</Link>
        </div>
      </div>

      <div className="mt-20 text-center">
        <h2 className="font-syne text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.25] text-ink">Available Add-ons</h2>
        <p className="mx-auto mt-4 max-w-[420px] text-[17px] text-ink-soft">Enhance your plan. One-time purchase, assigned to 1 booth permanently.</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-[1040px] grid-cols-3 gap-6 max-[1024px]:grid-cols-1">
        <div className="flex h-full flex-col rounded-3xl border-[1.5px] border-border bg-white px-9 py-9 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-ink-soft">Voucher System</div>
          <div className="mb-3 flex items-baseline gap-2"><span className="text-base font-semibold text-ink">Rp</span><span className="font-syne text-[30px] font-extrabold leading-[1.4] text-ink">500,000</span></div>
          <div className="mb-8 text-[13px] text-ink-soft">One-time purchase / 1 booth</div>
          <p className="mb-8 text-sm leading-[1.6] text-ink-soft">Generate promotional vouchers and easily validate them at your booth events.</p>
          <Link href={`/checkout?plan=professional&addons=voucher-system&billing=${billingParam}`} className={`${optionBaseClass} mt-auto ${optionInactiveClass}`}>Add to plan</Link>
        </div>

        <div className="flex h-full flex-col rounded-3xl border-[1.5px] border-border bg-white px-9 py-9 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-ink-soft">Live Mode Streaming</div>
          <div className="mb-3 flex items-baseline gap-2"><span className="text-base font-semibold text-ink">Rp</span><span className="font-syne text-[30px] font-extrabold leading-[1.4] text-ink">1,000,000</span></div>
          <div className="mb-8 text-[13px] text-ink-soft">One-time purchase / 1 booth</div>
          <p className="mb-8 text-sm leading-[1.6] text-ink-soft">Stream the photobooth gallery directly to an external screen or monitor over the network.</p>
          <Link href={`/checkout?plan=professional&addons=live-mode-streaming&billing=${billingParam}`} className={`${optionBaseClass} mt-auto ${optionInactiveClass}`}>Add to plan</Link>
        </div>

        <div className="flex h-full flex-col rounded-3xl border-[1.5px] border-border bg-white px-9 py-9 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-ink-soft">Multiangle View</div>
          <div className="mb-3 flex items-baseline gap-2"><span className="text-base font-semibold text-ink">Rp</span><span className="font-syne text-[30px] font-extrabold leading-[1.4] text-ink">1,500,000</span></div>
          <div className="mb-8 text-[13px] text-ink-soft">One-time purchase / 1 booth</div>
          <p className="mb-8 text-sm leading-[1.6] text-ink-soft">Capture from multiple synchronized cameras simultaneously to create stunning spatial assets.</p>
          <Link href={`/checkout?plan=professional&addons=multiangle-view&billing=${billingParam}`} className={`${optionBaseClass} mt-auto ${optionInactiveClass}`}>Add to plan</Link>
        </div>
      </div>
    </section>
  );
}
