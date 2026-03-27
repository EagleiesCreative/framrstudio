export default function TestimonialsSection() {
  return (
    <section className="px-16 pb-24 pt-0 max-[1024px]:px-4">
      <div className="mb-14 text-center">
        <div className="mb-5 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.1em] text-accent before:h-[2px] before:w-5 before:rounded before:bg-accent before:content-['']">Testimonials</div>
        <h2 className="font-syne text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.25] text-ink">Founders love Framr Studio</h2>
      </div>
      <div className="mx-auto grid max-w-[1040px] grid-cols-3 gap-4 max-[1024px]:grid-cols-1">
        <div className="rounded-[20px] border border-border bg-off p-8 transition-shadow hover:shadow-sm">
          <div className="mb-4 text-[13px] tracking-[2px] text-[#F59E0B]">★★★★★</div>
          <div className="mb-6 text-[15px] leading-[1.7] text-ink">"We launched our photobooth startup in 3 weeks. Framr Studio handled everything — templates, sharing, analytics. It just works."</div>
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,theme(colors.accent),#8B8FFF)] font-syne text-sm font-extrabold text-white">SA</div><div><div className="text-sm font-semibold text-ink">Sofia Andreou</div><div className="text-xs text-ink-soft">Founder, Lumière Photo Booths</div></div></div>
        </div>
        <div className="rounded-[20px] border border-border bg-off p-8 transition-shadow hover:shadow-sm">
          <div className="mb-4 text-[13px] tracking-[2px] text-[#F59E0B]">★★★★★</div>
          <div className="mb-6 text-[15px] leading-[1.7] text-ink">"The AI background removal alone changed how we pitch to corporate clients. It's a premium feature that closes deals."</div>
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,theme(colors.accent2),#FF9AB8)] font-syne text-sm font-extrabold text-white">ML</div><div><div className="text-sm font-semibold text-ink">Marcus Leite</div><div className="text-xs text-ink-soft">CEO, SnapCo Studios</div></div></div>
        </div>
        <div className="rounded-[20px] border border-border bg-off p-8 transition-shadow hover:shadow-sm">
          <div className="mb-4 text-[13px] tracking-[2px] text-[#F59E0B]">★★★★★</div>
          <div className="mb-6 text-[15px] leading-[1.7] text-ink">"We run 20+ events a month and Framr's analytics finally showed us what's driving growth. Worth every cent of the Professional plan."</div>
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#27AE60,#6FCF97)] font-syne text-sm font-extrabold text-white">JT</div><div><div className="text-sm font-semibold text-ink">Jamie Thornton</div><div className="text-xs text-ink-soft">Director, Bloom Agency</div></div></div>
        </div>
      </div>
    </section>
  );
}
