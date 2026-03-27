"use client";

import { useState } from 'react';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      title: 'Create your event',
      description: 'Name your event, pick your layout, and choose a template. Takes under two minutes.',
    },
    {
      title: 'Customize your branding',
      description: 'Add your logo, colors, and overlays. Real-time preview shows exactly what guests will see.',
    },
    {
      title: 'Go live & capture',
      description: "Connect your camera or use your tablet's built-in. Framr handles capture and processing automatically.",
    },
    {
      title: 'Share & review results',
      description: 'Guests share instantly via QR. You get a full analytics report after every session.',
    },
  ];

  return (
    <section className="px-16 py-24 max-[1024px]:px-4" id="how">
      <div className="grid grid-cols-2 items-center gap-20 max-[1024px]:grid-cols-1 max-[1024px]:gap-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.1em] text-accent before:h-[2px] before:w-5 before:rounded before:bg-accent before:content-['']">How it works</div>
          <h2 className="font-syne text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.25] text-ink">Up and running in<br />minutes, not days</h2>
          <div className="mt-10 flex flex-col">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === activeStep;

              return (
                <div
                  key={step.title}
                  className="cursor-pointer border-b border-border py-6 last:border-b-0"
                  onMouseEnter={() => setActiveStep(stepNumber)}
                >
                  <div className="flex gap-5">
                    <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                      isActive
                        ? 'border-accent bg-accent text-white'
                        : 'border-border-strong text-ink-soft'
                    }`}>{stepNumber}</div>
                    <div>
                      <div className={`mb-2 font-syne text-base font-bold transition-colors ${isActive ? 'text-ink' : 'text-ink-soft'}`}>
                        {step.title}
                      </div>
                      <div className="text-sm leading-[1.65] text-ink-soft">{step.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-off p-9 shadow-md">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-off px-4 py-3 text-xs font-semibold text-ink-soft">
              <span className="inline-flex items-center"><span className="mr-1.5 inline-block h-[7px] w-[7px] animate-pulse rounded-full bg-[#27AE60]" />Live Preview</span>
              <span className="font-semibold text-accent">2×2 Grid</span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-5">
              <div className="aspect-[3/4] rounded-lg bg-[linear-gradient(145deg,#E8EDFF,#C7D0FF)] text-[22px] flex items-center justify-center">😄</div>
              <div className="aspect-[3/4] rounded-lg bg-[linear-gradient(145deg,#FFE8F0,#FFBED4)] text-[22px] flex items-center justify-center">🎊</div>
              <div className="aspect-[3/4] rounded-lg bg-[linear-gradient(145deg,#E8FFF4,#B8F5D8)] text-[22px] flex items-center justify-center">💃</div>
              <div className="aspect-[3/4] rounded-lg bg-[linear-gradient(145deg,#FFF8E8,#FFE4A0)] text-[22px] flex items-center justify-center">🥂</div>
            </div>
            <div className="flex items-center justify-between border-t border-border px-5 py-3.5 text-xs">
              <span className="font-medium text-ink-soft">Session: <strong className="text-ink">Wedding Co.</strong></span>
              <button className="cursor-pointer rounded-[100px] border-none bg-accent px-3.5 py-1.5 text-xs font-semibold text-white">Share via QR</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-[14px] border border-border bg-white p-4">
              <div className="font-syne text-[22px] font-extrabold text-ink">14s</div>
              <div className="mt-0.5 text-xs text-ink-soft">Avg. setup time</div>
            </div>
            <div className="rounded-[14px] border border-accent/20 bg-accent-light p-4">
              <div className="font-syne text-[22px] font-extrabold text-accent">∞</div>
              <div className="mt-0.5 text-xs text-accent/70">Events per month</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
