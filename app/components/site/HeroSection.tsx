export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-16 pb-[100px] pt-[120px] text-center max-[1024px]:px-4 max-[1024px]:pb-20 max-[1024px]:pt-24">
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(theme(colors.border)_1px,transparent_1px),linear-gradient(90deg,theme(colors.border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_20%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_20%,transparent_100%)]" />
      <div className="relative z-[1]">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-white/50 px-4 py-2 text-xs font-semibold tracking-wide text-ink backdrop-blur-sm">
          <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
          AI background removal & live filters now available
        </div>
        <h1 className="mx-auto mb-8 max-w-[1040px] font-syne text-[clamp(32px,7vw,72px)] font-extrabold leading-[1.4] text-ink">
          Photobooth software built to <span className="relative inline-block rounded-full bg-accent px-6 py-1 tracking-normal text-white">scale</span> your business
        </h1>
        <p className="mx-auto mb-11 max-w-[540px] text-[18px] leading-[1.65] text-ink-soft">
          The all-in-one platform for startups and studios launching, growing, and automating photobooth services.
        </p>
        <div className="mb-4 flex flex-wrap justify-center gap-3">
          <a href="/pricing" className="inline-block rounded-[100px] border border-accent bg-accent px-7 py-[13px] text-[15px] font-semibold text-white no-underline transition-all hover:-translate-y-px hover:bg-[#4a4edc] hover:shadow-[0_4px_20px_rgba(91,95,238,.35)]">Start free trial →</a>
          <a href="#how" className="inline-block rounded-[100px] border border-border-strong bg-transparent px-7 py-[13px] text-[15px] font-semibold text-ink-mid no-underline transition-all hover:bg-off hover:text-ink">See a demo</a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 text-[13px] text-ink-soft">
          <span className="flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#EAFAF1] text-[9px] font-bold text-[#27AE60]">✓</span> No credit card required</span>
          <span className="flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#EAFAF1] text-[9px] font-bold text-[#27AE60]">✓</span> 14-day free trial</span>
          <span className="flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#EAFAF1] text-[9px] font-bold text-[#27AE60]">✓</span> Cancel anytime</span>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-[960px] overflow-hidden rounded-3xl border border-border-strong bg-white shadow-[var(--shadow-lg),0_0_0_1px_rgba(91,95,238,.06)]">
        <div className="flex items-center gap-3 border-b border-border bg-off px-5 py-3.5">
          <div className="flex gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" /></div>
          <div className="mx-auto max-w-[280px] flex-1 rounded-lg border border-border bg-white px-3.5 py-1 text-center text-xs text-ink-soft">app.framrstudio.com/dashboard</div>
        </div>
        <div className="grid min-h-[380px] grid-cols-[220px_1fr] max-[768px]:grid-cols-1">
          <div className="border-r border-border bg-off px-4 py-6 max-[768px]:border-b max-[768px]:border-r-0">
            <div className="mb-7 px-2 font-syne text-sm font-extrabold text-ink">framr<span className="text-accent">.</span>studio</div>
            <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[.1em] text-ink-soft">Workspace</div>
            <div className="mb-0.5 flex items-center gap-2.5 rounded-[10px] bg-white px-2.5 py-2 text-[13px] font-medium text-ink shadow-sm"><span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-accent-light text-xs">📸</span> Gallery</div>
            <div className="mb-0.5 flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13px] font-medium text-ink-soft"><span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-off2 text-xs">🎨</span> Templates</div>
            <div className="mb-0.5 flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13px] font-medium text-ink-soft"><span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-off2 text-xs">📊</span> Analytics</div>
            <div className="mb-0.5 flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13px] font-medium text-ink-soft"><span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-off2 text-xs">🔗</span> Share</div>
            <div className="mb-0.5 flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13px] font-medium text-ink-soft"><span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-off2 text-xs">⚙️</span> Settings</div>
            <div className="mt-6 rounded-xl bg-accent-light px-3 py-3.5 text-left">
              <div className="mb-1 text-[11px] font-bold tracking-[.04em] text-accent">LIVE SESSION</div>
              <div className="font-syne text-xl font-extrabold text-ink">32</div>
              <div className="text-[11px] text-ink-soft">photos captured</div>
            </div>
          </div>
          <div className="flex flex-col gap-5 p-7">
            <div className="flex items-center justify-between">
              <div className="font-syne text-lg font-bold text-ink">Session Gallery</div>
              <div className="flex items-center gap-1 rounded-[100px] bg-[#EAF9F1] px-2.5 py-1 text-[11px] font-semibold text-[#1A8A4A] before:content-['●'] before:text-[8px]">Session live</div>
            </div>
            <div className="grid grid-cols-4 gap-2.5 max-[640px]:grid-cols-2">
              <div className="aspect-[3/4] rounded-xl bg-[linear-gradient(145deg,#E8EDFF,#C7D0FF)] text-[22px] flex items-center justify-center">🧑‍🤝‍🧑</div>
              <div className="aspect-[3/4] rounded-xl bg-[linear-gradient(145deg,#FFE8F0,#FFBED4)] text-[22px] flex items-center justify-center">🎉</div>
              <div className="aspect-[3/4] rounded-xl bg-[linear-gradient(145deg,#E8FFF4,#B8F5D8)] text-[22px] flex items-center justify-center">💑</div>
              <div className="aspect-[3/4] rounded-xl bg-[linear-gradient(145deg,#FFF8E8,#FFE9B8)] text-[22px] flex items-center justify-center">🥳</div>
            </div>
            <div className="grid grid-cols-3 gap-2.5 max-[640px]:grid-cols-1">
              <div className="rounded-xl border border-border bg-off px-4 py-3.5 text-left"><div className="font-syne text-[22px] font-extrabold leading-tight text-ink">32</div><div className="mt-0.5 text-[11px] text-ink-soft">Photos taken</div></div>
              <div className="rounded-xl border border-border bg-off px-4 py-3.5 text-left"><div className="font-syne text-[22px] font-extrabold leading-tight text-ink">18</div><div className="mt-0.5 text-[11px] text-ink-soft">QR shares</div></div>
              <div className="rounded-xl border border-border bg-off px-4 py-3.5 text-left"><div className="font-syne text-[22px] font-extrabold leading-tight text-ink">4</div><div className="mt-0.5 text-[11px] text-ink-soft">Templates used</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
