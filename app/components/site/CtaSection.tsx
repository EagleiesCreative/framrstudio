export default function CtaSection() {
  return (
    <div className="px-16 pb-[100px] pt-24 max-[1024px]:px-4">
      <div className="relative overflow-hidden rounded-[28px] border border-border bg-off px-20 py-24 text-center before:absolute before:left-[-80px] before:top-[-80px] before:h-[280px] before:w-[280px] before:rounded-full before:bg-[radial-gradient(circle,theme(colors.accent/0.12)_0%,transparent_70%)] before:content-[''] after:absolute after:bottom-[-80px] after:right-[-80px] after:h-[280px] after:w-[280px] after:rounded-full after:bg-[radial-gradient(circle,theme(colors.destructive/0.1)_0%,transparent_70%)] after:content-[''] max-[1024px]:px-6 max-[1024px]:py-12">
        <div className="relative z-[1] mb-5 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.1em] text-accent before:h-[2px] before:w-5 before:rounded before:bg-accent before:content-['']">Get started</div>
        <h2 className="relative z-[1] mx-auto mb-5 max-w-[580px] font-syne text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.25] text-ink">The smartest way to launch<br />your photobooth business</h2>
        <p className="relative z-[1] mb-11 text-[17px] text-ink-soft">Join 12,000+ studios. No credit card required.</p>
        <div className="relative z-[1] flex flex-wrap justify-center gap-3">
          <a href="/pricing" className="inline-block rounded-[100px] border border-accent bg-accent px-7 py-[13px] text-[15px] font-semibold text-white no-underline transition-all hover:-translate-y-px hover:bg-[#4a4edc] hover:shadow-[0_4px_20px_rgba(91,95,238,.35)]">Start free — it's on us →</a>
          <a href="#features" className="inline-block rounded-[100px] border border-border-strong bg-transparent px-7 py-[13px] text-[15px] font-semibold text-ink-mid no-underline transition-all hover:bg-off hover:text-ink">Explore features</a>
        </div>
      </div>
    </div>
  );
}
