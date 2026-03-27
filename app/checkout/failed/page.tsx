import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CheckoutFailedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--off)] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[var(--white)] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[var(--border-strong)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-red-100/80 text-red-600 ring-8 ring-red-50">
          <XCircle className="h-10 w-10" />
        </div>
        <h1 className="mb-3 font-[var(--font-syne)] text-[26px] font-bold tracking-tight text-[var(--ink)]">
          Payment Failed
        </h1>
        <p className="mb-8 text-[15px] leading-relaxed text-[var(--ink-soft)]">
          We couldn't process your payment. Please ensure your payment details are correct or try a different payment method.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/checkout"
            className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[var(--accent)] px-6 text-[15px] font-semibold text-[var(--white)] shadow-[0_4px_14px_0_rgba(91,95,238,0.39)] transition-all hover:bg-[#4a4edc] hover:shadow-[0_6px_20px_rgba(91,95,238,0.23)] hover:-translate-y-[1px]"
          >
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-transparent px-6 text-[15px] font-semibold text-[var(--ink-soft)] transition-all hover:bg-[var(--lineSoft)]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
