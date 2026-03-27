export default function LogosStrip() {
  return (
    <div className="flex items-center border-y border-border px-16 py-8 max-[1024px]:flex-col max-[1024px]:items-start max-[1024px]:gap-3 max-[1024px]:px-4">
      <span className="mr-10 shrink-0 whitespace-nowrap text-xs font-semibold uppercase tracking-[.1em] text-ink-soft max-[1024px]:mr-0">Trusted by</span>
      <div className="flex flex-wrap items-center gap-12">
        <span className="font-syne text-[15px] font-bold tracking-tight text-ink opacity-20">Lumière Events</span>
        <span className="font-syne text-[15px] font-bold tracking-tight text-ink opacity-20">SnapCo Studios</span>
        <span className="font-syne text-[15px] font-bold tracking-tight text-ink opacity-20">Bloom Agency</span>
        <span className="font-syne text-[15px] font-bold tracking-tight text-ink opacity-20">Flashwave</span>
        <span className="font-syne text-[15px] font-bold tracking-tight text-ink opacity-20">Noir Collective</span>
        <span className="font-syne text-[15px] font-bold tracking-tight text-ink opacity-20">Studio Eight</span>
      </div>
    </div>
  );
}
