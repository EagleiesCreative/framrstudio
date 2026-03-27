import Link from 'next/link';
import SignUpForm from './SignUpForm';

export default function Page() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!clerkEnabled) {
    return (
      <section className="flex min-h-screen items-stretch justify-stretch bg-[#d2d4db] p-0">
        <div className="block min-h-screen w-full max-w-[560px] bg-[#f4f5f7] p-6">
          <div className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--white)] p-7 text-center shadow-[var(--shadow-md)]">
            <h2>Signup is not configured yet</h2>
            <p className="mx-auto mt-[14px] max-w-[440px] text-center text-[17px] leading-[1.65] text-[var(--ink-soft)]">
              404 Credential not found. Please contact the administrator.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-stretch justify-stretch bg-[#d2d4db] p-0">
      <div className="grid min-h-screen w-full grid-cols-2 gap-6 bg-[#f4f5f7] p-6 max-[1024px]:grid-cols-1 max-[1024px]:p-4">
        <div className="flex flex-col rounded-[14px] bg-[#f4f5f7] px-7 py-[22px]">
          <div className="flex items-center gap-2">
            <img src="/framr-icon.svg" alt="Framr Studio" className="w-8 h-8" />
            <span className="font-[var(--font-syne)] text-[22px] font-bold tracking-tight text-[#1f2f78]">Framr Studio</span>
          </div>

          <div className="mx-auto mt-[58px] w-full max-w-[420px] max-[1024px]:mt-6">
            <div className="mb-[18px] text-left">
              <h2 className="text-[42px] tracking-[-1.5px]">Get Started Now</h2>
              <p className="mt-1.5 text-sm text-[var(--ink-soft)]">Enter your credentials to access your account</p>
            </div>

            <SignUpForm onSuccessRedirect="/pricing" />

            <p className="mt-[18px] text-left text-sm text-[var(--ink-soft)]">
              Have an account? <Link href="/sign-in">Sign in</Link>
            </p>
          </div>

          <p className="mt-auto pt-4 text-center text-xs text-[var(--ink-soft)]">2026 Framr, All right reserved</p>
        </div>

        <aside className="flex flex-col rounded-2xl bg-[linear-gradient(160deg,#4958e8_0%,#3b45c9_100%)] px-14 pb-[42px] pt-[72px] text-[var(--white)] max-[1024px]:hidden">
          <h3 className="max-w-[520px] text-[46px] leading-[1.1] tracking-[-1px]">The simplest way to manage your workforce</h3>
          <p className="mt-2.5 text-sm text-[rgba(255,255,255,.8)]">Enter your credentials to access your account</p>

          <div className="mt-[42px] rounded-[14px] border border-[rgba(13,13,18,.08)] bg-[rgba(255,255,255,.93)] p-4 text-[var(--ink)]">
            <div className="mb-3 flex justify-between text-xs text-[var(--ink-soft)]">
              <span>Dashboard</span>
              <span>Team overview</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--off)] p-3">
                <small>Productive Time / Day</small>
                <strong className="font-[var(--font-syne)] text-xl tracking-[-0.5px]">12.4 hr</strong>
              </div>
              <div className="flex flex-col gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--off)] p-3">
                <small>Focused Time</small>
                <strong className="font-[var(--font-syne)] text-xl tracking-[-0.5px]">8.5 hr</strong>
              </div>
              <div className="flex flex-col gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--off)] p-3">
                <small>Tasks</small>
                <strong className="font-[var(--font-syne)] text-xl tracking-[-0.5px]">96</strong>
              </div>
              <div className="flex flex-col gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--off)] p-3">
                <small>Active Teams</small>
                <strong className="font-[var(--font-syne)] text-xl tracking-[-0.5px]">11</strong>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-[22px] text-[13px] text-[rgba(255,255,255,.8)]">
            <span>WeChat</span>
            <span>Booking.com</span>
            <span>Google</span>
            <span>Spotify</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
