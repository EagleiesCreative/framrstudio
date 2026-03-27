"use client";

import { useState } from 'react';

export default function FaqSection() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const faqItems = [
    {
      question: 'Do I need special hardware to run Framr Studio?',
      answer:
        "Framr Studio runs on any Windows or macOS laptop or tablet. For best results we recommend a DSLR or mirrorless camera via USB, but your device's built-in webcam works great to get started.",
    },
    {
      question: 'Can I remove Framr branding from photos?',
      answer:
        'Yes — white-label branding is available on the Panoramic+ plan. Remove all Framr branding and present a fully seamless experience under your own studio name.',
    },
    {
      question: 'What happens when my free trial ends?',
      answer:
        "After 14 days you'll be asked to choose a plan. All your events and photos are preserved. You can downgrade or cancel with no penalty at any time — no awkward contracts.",
    },
    {
      question: 'Is 360° mode available on all plans?',
      answer:
        '360° panoramic booth mode is exclusive to the Panoramic+ plan. It supports multi-camera sync rigs and exports both 360 video clips and still panoramas.',
    },
    {
      question: 'Can I switch plans at any time?',
      answer:
        'Absolutely. Upgrade or downgrade from your account settings any time. Upgrades are instant, downgrades apply at your next billing cycle.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndexes((current) =>
      current.includes(index) ? current.filter((value) => value !== index) : [...current, index],
    );
  };

  return (
    <section className="bg-off px-16 py-24 max-[1024px]:px-4" id="faq">
      <div className="mx-auto max-w-[680px]">
        <div className="mb-2 text-center">
          <div className="mb-5 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.1em] text-accent before:h-[2px] before:w-5 before:rounded before:bg-accent before:content-['']">FAQ</div>
          <h2 className="font-syne text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.25] text-ink">Common questions</h2>
        </div>
        <div className="mt-12">
          {faqItems.map((item, index) => {
            const isOpen = openIndexes.includes(index);

            return (
              <div key={item.question} className="border-b border-border py-6">
                <button type="button" className="flex w-full cursor-pointer items-center justify-between gap-4 text-left" onClick={() => toggleFaq(index)}>
                  <span className="text-base font-medium text-ink">{item.question}</span>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-sm transition-all ${isOpen
                      ? 'rotate-45 border-accent bg-accent text-white'
                      : 'border-border-strong bg-white text-ink-soft'
                    }`}>
                    +
                  </div>
                </button>
                {isOpen && (
                  <div className="pt-4 text-sm leading-[1.7] text-ink-soft">{item.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
