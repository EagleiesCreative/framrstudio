export default function FeaturesSection() {
  return (
    <section className="px-16 py-24 max-[1024px]:px-4" id="features">
      <div className="mb-14 text-center">
        <div className="mb-5 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.1em] text-accent before:h-[2px] before:w-5 before:rounded before:bg-accent before:content-['']">Features</div>
        <h2 className="font-syne text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.4] text-ink">Everything a modern photobooth<br />startup needs</h2>
        <p className="mx-auto mt-4 max-w-[480px] text-center text-[17px] font-normal leading-[1.65] text-ink-soft">
          Tools built for speed, scale, and a seamless experience — from your first event to your hundredth.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-[1024px]:grid-cols-1">
        <div className="row-span-2 flex flex-col rounded-radius border border-border bg-off px-9 py-10 transition-shadow hover:shadow-md">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] bg-accent-light text-[22px]">🎨</div>
          <div className="mb-2.5 font-syne text-lg font-bold text-ink">Custom Template Builder</div>
          <p className="text-sm leading-[1.7] text-ink-soft">Drag-and-drop layouts, brand overlays, and custom frames. Design a photo experience that looks completely on-brand for every client.</p>
          <div className="mt-8 flex min-h-[180px] flex-1 items-center justify-center rounded-[14px] border border-border bg-white p-5">
            <div className="grid w-full grid-cols-2 gap-2">
              <div className="relative aspect-[3/4] rounded-[10px] border-2 border-accent bg-[linear-gradient(135deg,#E8EDFF,#C7D0FF)] text-lg flex items-center justify-center">🧑‍🤝‍🧑<span className="absolute right-1.5 top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span></div>
              <div className="aspect-[3/4] rounded-[10px] border-2 border-transparent bg-[linear-gradient(135deg,#FFE8F0,#FFBED4)] text-lg flex items-center justify-center">🎉</div>
              <div className="aspect-[3/4] rounded-[10px] border-2 border-transparent bg-[linear-gradient(135deg,#FFF8E8,#FFE4A0)] text-lg flex items-center justify-center">💑</div>
              <div className="aspect-[3/4] rounded-[10px] border-2 border-transparent bg-[linear-gradient(135deg,#E8FFF4,#B8F5D8)] text-lg flex items-center justify-center">🥳</div>
            </div>
          </div>
        </div>
        <div className="rounded-radius border border-border bg-white p-8 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#FFE8F0] text-[22px]">✨</div>
          <div className="mb-2.5 font-syne text-lg font-bold text-ink">AI Enhancements</div>
          <p className="text-sm leading-[1.7] text-ink-soft">Background removal, skin smoothing, and live filters — all processed on-device, instantly.</p>
        </div>
        <div className="rounded-radius border border-ink bg-ink p-8 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/10 text-[22px]">📲</div>
          <div className="mb-2.5 font-syne text-lg font-bold text-white">Instant Sharing</div>
          <p className="text-sm leading-[1.7] text-white/50">QR codes, SMS, and email delivery in seconds. Guests leave with their photos — your brand in their pocket.</p>
        </div>
        <div className="rounded-radius border border-border bg-white p-8 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#E8FFF4] text-[22px]">📊</div>
          <div className="mb-2.5 font-syne text-lg font-bold text-ink">Analytics Dashboard</div>
          <p className="text-sm leading-[1.7] text-ink-soft">Track shares, prints, and engagement across every event to optimize and grow your business.</p>
        </div>
        <div className="rounded-radius border border-border bg-white p-8 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#FFFAE8] text-[22px]">🎥</div>
          <div className="mb-2.5 font-syne text-lg font-bold text-ink">Boomerang &amp; GIF Mode</div>
          <p className="text-sm leading-[1.7] text-ink-soft">Give guests something shareable beyond stills. Looping videos and animated GIFs built right in.</p>
        </div>
      </div>
    </section>
  );
}
