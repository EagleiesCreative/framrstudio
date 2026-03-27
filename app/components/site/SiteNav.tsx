'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

type SiteNavProps = {
  isPricingPage?: boolean;
};

export default function SiteNav({ isPricingPage = false }: SiteNavProps) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!clerkEnabled) {
    return (
      <nav className="sticky top-0 z-[100] flex h-[68px] items-center justify-between border-b border-border bg-white/90 px-16 backdrop-blur-[16px] max-[1024px]:h-auto max-[1024px]:flex-col max-[1024px]:gap-3 max-[1024px]:px-4 max-[1024px]:py-3">
        <Link href="/" className="font-syne text-xl font-extrabold tracking-tight text-ink no-underline">
          framr<span className="text-accent">.</span>studio
        </Link>
        <ul className="flex list-none gap-8 max-[1024px]:flex-wrap max-[1024px]:justify-center max-[1024px]:gap-5">
          <li><Link href="/#features" className="text-sm font-medium text-ink-soft no-underline transition-colors hover:text-ink">Features</Link></li>
          <li><Link href="/#how" className="text-sm font-medium text-ink-soft no-underline transition-colors hover:text-ink">How it works</Link></li>
          <li><Link href="/pricing" className="text-sm font-medium text-ink-soft no-underline transition-colors hover:text-ink">Pricing</Link></li>
          <li><Link href="/#faq" className="text-sm font-medium text-ink-soft no-underline transition-colors hover:text-ink">FAQ</Link></li>
        </ul>
        <div className="flex items-center gap-2.5">
          <Link href="/sign-in" className="inline-block cursor-pointer rounded-[100px] border border-border-strong bg-transparent px-5 py-2 text-sm font-medium tracking-[.01em] text-ink-mid no-underline transition-all hover:bg-off hover:text-ink">Log in</Link>
          <Link href="/sign-up" className="inline-block cursor-pointer rounded-[100px] border border-ink bg-ink px-5 py-2 text-sm font-medium tracking-[.01em] text-white no-underline transition-all hover:-translate-y-px hover:bg-[#1a1a2e] hover:shadow-[0_4px_16px_rgba(13,13,18,0.2)]">Get started →</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-[100] flex h-[68px] items-center justify-between border-b border-border bg-white/90 px-16 backdrop-blur-[16px] max-[1024px]:h-auto max-[1024px]:flex-col max-[1024px]:gap-3 max-[1024px]:px-4 max-[1024px]:py-3">
      <Link href="/" className="font-syne text-xl font-extrabold tracking-tight text-ink no-underline">
        framr<span className="text-accent">.</span>studio
      </Link>
      <ul className="flex list-none gap-8 max-[1024px]:flex-wrap max-[1024px]:justify-center max-[1024px]:gap-5">
        <li><Link href="/#features" className="text-sm font-medium text-ink-soft no-underline transition-colors hover:text-ink">Features</Link></li>
        <li><Link href="/#how" className="text-sm font-medium text-ink-soft no-underline transition-colors hover:text-ink">How it works</Link></li>
        <li><Link href="/pricing" className="text-sm font-medium text-ink-soft no-underline transition-colors hover:text-ink">Pricing</Link></li>
        <li><Link href="/#faq" className="text-sm font-medium text-ink-soft no-underline transition-colors hover:text-ink">FAQ</Link></li>
      </ul>
      <div className="flex items-center gap-2.5">
        <SignedOut>
          <Link href="/sign-in" className="inline-block cursor-pointer rounded-[100px] border border-border-strong bg-transparent px-5 py-2 text-sm font-medium tracking-[.01em] text-ink-mid no-underline transition-all hover:bg-off hover:text-ink">Log in</Link>
          <Link href="/sign-up" className="inline-block cursor-pointer rounded-[100px] border border-ink bg-ink px-5 py-2 text-sm font-medium tracking-[.01em] text-white no-underline transition-all hover:-translate-y-px hover:bg-[#1a1a2e] hover:shadow-[0_4px_16px_rgba(13,13,18,0.2)]">Get started →</Link>
        </SignedOut>
        <SignedIn>
          {!isPricingPage && (
            <Link href="/pricing" className="inline-block cursor-pointer rounded-[100px] border border-ink bg-ink px-5 py-2 text-sm font-medium tracking-[.01em] text-white no-underline transition-all hover:-translate-y-px hover:bg-[#1a1a2e] hover:shadow-[0_4px_16px_rgba(13,13,18,0.2)]">
              Pricing →
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
