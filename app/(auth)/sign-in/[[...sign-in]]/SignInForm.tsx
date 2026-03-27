'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type SignInFormProps = {
  onSuccessRedirect?: string;
};

export default function SignInForm({ onSuccessRedirect = '/pricing' }: SignInFormProps) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    setErrorMessage('');

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: onSuccessRedirect,
      });
    } catch (error: unknown) {
      const fallbackMessage = 'Unable to start Google sign in.';
      const clerkMessage =
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: Array<{ message?: string }> }).errors) &&
        (error as { errors: Array<{ message?: string }> }).errors[0]?.message;

      setErrorMessage(clerkMessage || fallbackMessage);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push(onSuccessRedirect);
      } else {
        // Handle other statuses like 'needs_first_factor', etc.
        console.log('Sign in result:', result);
        setErrorMessage('Check your credentials or verify your account.');
      }
    } catch (error: unknown) {
      const fallbackMessage = 'Unable to sign in. Please check your credentials.';
      const clerkMessage =
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: Array<{ message?: string }> }).errors) &&
        (error as { errors: Array<{ message?: string }> }).errors[0]?.message;

      setErrorMessage(clerkMessage || fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
      <button 
        className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] text-sm font-semibold text-[var(--ink)] transition-all hover:border-[var(--ink-soft)] hover:bg-[var(--off)] disabled:cursor-not-allowed disabled:opacity-65" 
        type="button" 
        onClick={handleGoogleSignIn} 
        disabled={!isLoaded || isSubmitting}
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.7-4.1 9.7-9.9 0-.7-.1-1.2-.2-1.9H12Z" />
          <path fill="#34A853" d="M3.1 7.3l3.2 2.3C7.1 7.8 9.3 6.2 12 6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 8.1 2 4.8 4.2 3.1 7.3Z" />
          <path fill="#4A90E2" d="M12 22c2.6 0 4.8-.9 6.4-2.4l-3-2.4c-.8.6-2 1.1-3.4 1.1-4 0-5.3-2.4-5.5-3.6l-3.2 2.5C4.9 19.8 8.1 22 12 22Z" />
          <path fill="#FBBC05" d="M3.1 16.7l3.2-2.5c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7L3.1 8.3C2.4 9.7 2 10.8 2 12s.4 2.3 1.1 4.7Z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="my-0.5 flex items-center gap-3 text-xs text-[var(--ink-soft)] before:h-px before:flex-1 before:bg-[var(--border)] before:content-[''] after:h-px after:flex-1 after:bg-[var(--border)] after:content-['']">
        <span>or</span>
      </div>

      <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="email">Email address</label>
      <input
        id="email"
        type="email"
        className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
        placeholder="rafiqul@company.com"
        value={emailAddress}
        onChange={(event) => setEmailAddress(event.target.value)}
        required
      />

      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="password">Password</label>
        <button 
          type="button"
          onClick={() => router.push('/forgot-password')}
          className="text-xs font-semibold text-[var(--accent)] hover:underline"
        >
          Forgot password?
        </button>
      </div>
      <input
        id="password"
        type="password"
        className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {errorMessage ? <p className="mt-0.5 text-[13px] text-[var(--error)]">{errorMessage}</p> : null}

      <button
        className="mt-1.5 h-11 cursor-pointer rounded-[10px] border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--white)] transition-all hover:bg-[#4a4edc] disabled:cursor-not-allowed disabled:opacity-65"
        type="submit"
        disabled={isSubmitting || !isLoaded || !emailAddress || !password}
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
