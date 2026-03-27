import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--off)] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[var(--white)] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[var(--border-strong)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-green-100/80 text-green-600 ring-8 ring-green-50">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mb-3 font-[var(--font-syne)] text-[26px] font-bold tracking-tight text-[var(--ink)]">
          Payment Successful!
        </h1>
        <p className="mb-8 text-[15px] leading-relaxed text-[var(--ink-soft)]">
          Your subscription has been activated successfully. You can now access all features for your booth.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[var(--accent)] px-6 text-[15px] font-semibold text-[var(--white)] shadow-[0_4px_14px_0_rgba(91,95,238,0.39)] transition-all hover:bg-[#4a4edc] hover:shadow-[0_6px_20px_rgba(91,95,238,0.23)] hover:-translate-y-[1px]"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
