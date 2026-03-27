export default function SiteFooter() {
  return (
    <footer className="border-t border-border px-16 pb-10 pt-[60px] max-[1024px]:px-4">
      <div className="mb-12 grid grid-cols-[1.8fr_1fr_1fr_1fr] gap-12 max-[1024px]:grid-cols-1">
        <div>
          <a href="/" className="mb-4 block font-syne text-lg font-extrabold tracking-tight text-ink no-underline">framr<span className="text-accent">.</span>studio</a>
          <p className="max-w-[260px] text-sm leading-[1.65] text-ink-soft">Professional photobooth software for modern startups, studios, and event businesses worldwide.</p>
        </div>
        <div>
          <h4 className="mb-5 text-[13px] font-semibold tracking-[.02em] text-ink">Product</h4>
          <ul className="flex list-none flex-col gap-3"><li><a href="/#features" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Features</a></li><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Templates</a></li><li><a href="/pricing" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Pricing</a></li><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Changelog</a></li><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Roadmap</a></li></ul>
        </div>
        <div>
          <h4 className="mb-5 text-[13px] font-semibold tracking-[.02em] text-ink">Company</h4>
          <ul className="flex list-none flex-col gap-3"><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">About</a></li><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Blog</a></li><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Careers</a></li><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Press</a></li></ul>
        </div>
        <div>
          <h4 className="mb-5 text-[13px] font-semibold tracking-[.02em] text-ink">Support</h4>
          <ul className="flex list-none flex-col gap-3"><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Help Center</a></li><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Community</a></li><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Status</a></li><li><a href="#" className="text-sm text-ink-soft no-underline transition-colors hover:text-ink">Contact</a></li></ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-8 text-[13px] text-ink-soft max-[1024px]:flex-col max-[1024px]:items-start max-[1024px]:gap-3">
        <span>© 2026 Framr Studio. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="text-[13px] text-ink-soft no-underline transition-colors hover:text-ink">Privacy Policy</a>
          <a href="#" className="text-[13px] text-ink-soft no-underline transition-colors hover:text-ink">Terms of Service</a>
          <a href="#" className="text-[13px] text-ink-soft no-underline transition-colors hover:text-ink">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}
