export default function StatsBand() {
  return (
    <div className="mx-16 grid grid-cols-[1fr_auto] items-center gap-[60px] rounded-3xl bg-ink px-20 py-[72px] max-[1024px]:mx-4 max-[1024px]:grid-cols-1 max-[1024px]:gap-8 max-[1024px]:px-6 max-[1024px]:py-10">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.1em] text-white/35 before:h-[2px] before:w-5 before:rounded before:bg-white/35 before:content-['']">Results</div>
        <h2 className="max-w-[400px] font-syne text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.4] text-white">Numbers that<br />prove the point</h2>
        <p className="mt-4 text-base text-white/45">Join thousands of studios running events on Framr Studio every day.</p>
      </div>
      <div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
        <div className="min-w-[150px] rounded-2xl border border-white/10 bg-white/5 px-6 py-7"><div className="font-syne text-[44px] font-extrabold leading-[1.4] text-white">12<em className="not-italic text-accent">k</em></div><div className="mt-2 text-[13px] text-white/40">Active studios worldwide</div></div>
        <div className="min-w-[150px] rounded-2xl border border-white/10 bg-white/5 px-6 py-7"><div className="font-syne text-[44px] font-extrabold leading-[1.4] text-white">98<em className="not-italic text-accent">%</em></div><div className="mt-2 text-[13px] text-white/40">Uptime SLA guarantee</div></div>
        <div className="min-w-[150px] rounded-2xl border border-white/10 bg-white/5 px-6 py-7"><div className="font-syne text-[44px] font-extrabold leading-[1.4] text-white">3<em className="not-italic text-accent">×</em></div><div className="mt-2 text-[13px] text-white/40">Faster event setup</div></div>
        <div className="min-w-[150px] rounded-2xl border border-white/10 bg-white/5 px-6 py-7"><div className="font-syne text-[44px] font-extrabold leading-[1.4] text-white">4.9<em className="not-italic text-accent">★</em></div><div className="mt-2 text-[13px] text-white/40">Average studio rating</div></div>
      </div>
    </div>
  );
}
