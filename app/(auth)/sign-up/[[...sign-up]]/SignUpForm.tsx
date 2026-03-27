'use client';

import { useState, useEffect } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { ChevronDown } from 'lucide-react';

type SignUpFormProps = {
  onSuccessRedirect?: string;
};

export default function SignUpForm({ onSuccessRedirect = '/pricing' }: SignUpFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [formStep, setFormStep] = useState(1);

  // Business Detail states
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessRole, setBusinessRole] = useState('');
  const [address, setAddress] = useState('');
  const [referrer, setReferrer] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  
  // Location Data states
  const [provinces, setProvinces] = useState<{ id: string, name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string, name: string }[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Fetch Provinces on Step 2
  useEffect(() => {
    if (formStep === 2 && provinces.length === 0) {
      const fetchProvinces = async () => {
        setIsLoadingLocation(true);
        try {
          const res = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
          const data = await res.json();
          setProvinces(data);
        } catch (err) {
          console.error('Failed to fetch provinces', err);
        } finally {
          setIsLoadingLocation(false);
        }
      };
      fetchProvinces();
    }
  }, [formStep, provinces.length]);

  // Fetch Cities when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      const fetchCities = async () => {
        setIsLoadingLocation(true);
        try {
          const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`);
          const data = await res.json();
          setCities(data);
        } catch (err) {
          console.error('Failed to fetch regencies', err);
        } finally {
          setIsLoadingLocation(false);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedProvinceId]);

  const handleGoogleSignUp = async () => {
    if (!isLoaded) {
      return;
    }

    setErrorMessage('');

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: onSuccessRedirect,
      });
    } catch (error: unknown) {
      const fallbackMessage = 'Unable to start Google sign up.';
      const clerkMessage =
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: Array<{ message?: string }> }).errors) &&
        (error as { errors: Array<{ message?: string }> }).errors[0]?.message;

      setErrorMessage(clerkMessage || fallbackMessage);
    }
  };

  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }

    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);

    if (!hasNumber || !hasUpper || !hasLower) {
      setErrorMessage('Password must contain at least one number, one uppercase letter, and one lowercase letter.');
      setIsSubmitting(false);
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phoneNumber: phoneNumber || undefined,
        unsafeMetadata: {
          businessName,
          businessCategory,
          businessRole,
          businessAddress: address || undefined,
          referrer: referrer || undefined,
          country: 'Indonesia',
          province,
          city,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (error: unknown) {
      const fallbackMessage = 'Unable to create account right now.';
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

  const handleVerifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        window.location.href = onSuccessRedirect;
      } else {
        setErrorMessage('Verification is not complete yet.');
      }
    } catch (error: unknown) {
      const fallbackMessage = 'Invalid verification code. Please try again.';
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

  const renderTrackbar = () => (
    <div className="mb-6 flex items-center justify-between px-2">
      <div className="flex flex-col items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${formStep >= 1 ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--white)]' : 'border-[var(--border-strong)] bg-transparent text-[var(--ink-soft)]'}`}>
          1
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${formStep >= 1 ? 'text-[var(--accent)]' : 'text-[var(--ink-soft)]'}`}>Registration</span>
      </div>
      <div className={`h-0.5 flex-1 mx-4 transition-all ${formStep >= 2 ? 'bg-[var(--accent)]' : 'bg-[var(--border-strong)]'}`} />
      <div className="flex flex-col items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${formStep >= 2 ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--white)]' : 'border-[var(--border-strong)] bg-transparent text-[var(--ink-soft)]'}`}>
          2
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${formStep >= 2 ? 'text-[var(--accent)]' : 'text-[var(--ink-soft)]'}`}>Business</span>
      </div>
    </div>
  );

  if (pendingVerification) {
    return (
      <form className="flex flex-col gap-2.5" onSubmit={handleVerifyCode}>
        <div className="mb-2">
          <h2 className="text-xl font-bold text-[var(--ink)]">Verify your email</h2>
          <p className="text-sm text-[var(--ink-soft)]">We've sent a code to {emailAddress}</p>
        </div>
        <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="verification">Verification code</label>
        <input
          id="verification"
          type="text"
          className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(event) => setVerificationCode(event.target.value)}
          required
        />

        {errorMessage ? <p className="mt-0.5 text-[13px] text-[var(--error)]">{errorMessage}</p> : null}

        <button className="mt-1.5 h-11 cursor-pointer rounded-[10px] border border-[var(--ink)] bg-[var(--ink)] px-4 text-sm font-semibold text-[var(--white)] transition-all hover:bg-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-65" type="submit" disabled={isSubmitting || !isLoaded}>
          {isSubmitting ? 'Verifying...' : 'Verify email'}
        </button>
        <button 
          type="button" 
          onClick={() => setPendingVerification(false)}
          className="text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors mt-2"
        >
          Back to registration
        </button>
      </form>
    );
  }

  if (formStep === 2) {
    return (
      <form className="flex flex-col gap-2.5" onSubmit={handleCreateAccount}>
        {renderTrackbar()}
        
        <div className="mb-2">
          <h2 className="text-xl font-bold text-[var(--ink)]">Business Details</h2>
          <p className="text-sm text-[var(--ink-soft)]">Finalize your professional profile</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="businessName">Business Name</label>
            <input
              id="businessName"
              type="text"
              className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
              placeholder="Your Studio Name"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="businessCategory">Category</label>
            <div className="relative">
              <select
                id="businessCategory"
                className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)] appearance-none"
                value={businessCategory}
                onChange={(event) => setBusinessCategory(event.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="photography">Photography Studio</option>
                <option value="events">Event Organizer</option>
                <option value="retail">Retail / Mall</option>
                <option value="wedding">Wedding Venue</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[var(--ink-soft)]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="businessRole">Your Role</label>
          <div className="relative">
            <select
              id="businessRole"
              className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)] appearance-none"
              value={businessRole}
              onChange={(event) => setBusinessRole(event.target.value)}
              required
            >
              <option value="">Select your role</option>
              <option value="owner">Owner / Founder</option>
              <option value="manager">Manager</option>
              <option value="tech">Technical Lead</option>
              <option value="staff">Staff</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[var(--ink-soft)]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--off)] px-3 text-sm text-[var(--ink-soft)] outline-none cursor-not-allowed"
              value="Indonesia"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="referrer">How'd you find us?</label>
            <div className="relative">
              <select
                id="referrer"
                className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)] appearance-none"
                value={referrer}
                onChange={(event) => setReferrer(event.target.value)}
                required
              >
                <option value="">Select source</option>
                <option value="social">Social Media</option>
                <option value="search">Search Engine</option>
                <option value="friend">Friend / Colleague</option>
                <option value="ad">Advertisement</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[var(--ink-soft)]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="province">Province</label>
            <div className="relative">
              <select
                id="province"
                className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)] appearance-none"
                value={selectedProvinceId}
                onChange={(event) => {
                  const id = event.target.value;
                  setSelectedProvinceId(id);
                  const name = provinces.find(p => p.id === id)?.name || '';
                  setProvince(name);
                  setCity('');
                }}
                required
                disabled={isLoadingLocation}
              >
                <option value="">Select province</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[var(--ink-soft)]" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="city">City / Regency</label>
            <div className="relative">
              <select
                id="city"
                className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)] appearance-none"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                required
                disabled={!selectedProvinceId || isLoadingLocation}
              >
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[var(--ink-soft)]" />
            </div>
          </div>
        </div>

        <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="address">Addresses (Optional)</label>
        <textarea
          id="address"
          className="min-h-[80px] w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] p-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)] resize-none"
          placeholder="Detailed street address, building, unit number"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />

        {errorMessage ? <p className="mt-0.5 text-[13px] text-[var(--error)]">{errorMessage}</p> : null}

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => setFormStep(1)}
            className="h-11 flex-1 cursor-pointer rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-4 text-sm font-semibold text-[var(--ink)] transition-all hover:bg-[var(--off)]"
          >
            Back
          </button>
          <button
            className="h-11 flex-[2] cursor-pointer rounded-[10px] border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--white)] transition-all hover:bg-[#4a4edc] disabled:cursor-not-allowed disabled:opacity-65"
            type="submit"
            disabled={isSubmitting || !isLoaded || !businessName || !businessCategory || !businessRole || !province || !city || !referrer}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {renderTrackbar()}
      
      <button className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] text-sm font-semibold text-[var(--ink)] transition-all hover:border-[var(--ink-soft)] hover:bg-[var(--off)] disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={handleGoogleSignUp} disabled={!isLoaded || isSubmitting}>
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.7-4.1 9.7-9.9 0-.7-.1-1.2-.2-1.9H12Z" />
          <path fill="#34A853" d="M3.1 7.3l3.2 2.3C7.1 7.8 9.3 6.2 12 6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 8.1 2 4.8 4.2 3.1 7.3Z" />
          <path fill="#4A90E2" d="M12 22c2.6 0 4.8-.9 6.4-2.4l-3-2.4c-.8.6-2 1.1-3.4 1.1-4 0-5.3-2.4-5.5-3.6l-3.2 2.5C4.9 19.8 8.1 22 12 22Z" />
          <path fill="#FBBC05" d="M3.1 16.7l3.2-2.5c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7L3.1 8.3C2.4 9.7 2 10.8 2 12s.4 2.3 1.1 4.7Z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="my-0.5 flex items-center gap-3 text-xs text-[var(--ink-soft)] before:h-px before:flex-1 before:bg-[var(--border)] before:content-[''] after:h-px after:flex-1 after:bg-[var(--border)] after:content-['']"><span>or</span></div>

      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-2.5">
          <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
            placeholder="Rafiqul"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </div>
        <div className="flex-1 flex flex-col gap-2.5">
          <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            type="text"
            className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
            placeholder="Rahman"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </div>
      </div>

      <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="phoneNumber">Phone number</label>
      <input
        id="phoneNumber"
        type="tel"
        className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
        placeholder="+62 812 3456 7890"
        value={phoneNumber}
        onChange={(event) => setPhoneNumber(event.target.value)}
        required
      />

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
      </div>
      <input
        id="password"
        type="password"
        className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
        placeholder="Create a strong password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <div className='grid grid-cols-2 gap-2'>
        <div className="mt-1 flex flex-col gap-1 px-0.5">
          <div className={`flex items-center gap-2 text-[12px] transition-all ${password.length >= 8 ? 'text-[#10B981] font-medium' : 'text-[var(--ink-soft)]'}`}>
            <div className={`h-1.5 w-1.5 rounded-full transition-all ${password.length >= 8 ? 'bg-[#10B981]' : 'bg-[var(--border-strong)]'}`} />
            <span>At least 8 characters</span>
          </div>
          <div className={`flex items-center gap-2 text-[12px] transition-all ${/[0-9]/.test(password) ? 'text-[#10B981] font-medium' : 'text-[var(--ink-soft)]'}`}>
            <div className={`h-1.5 w-1.5 rounded-full transition-all ${/[0-9]/.test(password) ? 'bg-[#10B981]' : 'bg-[var(--border-strong)]'}`} />
            <span>Contains a number</span>
          </div>
        </div>
        <div className="mt-1 flex flex-col gap-1 px-0.5">
          <div className={`flex items-center gap-2 text-[12px] transition-all ${/[A-Z]/.test(password) ? 'text-[#10B981] font-medium' : 'text-[var(--ink-soft)]'}`}>
            <div className={`h-1.5 w-1.5 rounded-full transition-all ${/[A-Z]/.test(password) ? 'bg-[#10B981]' : 'bg-[var(--border-strong)]'}`} />
            <span>Contains uppercase</span>
          </div>
          <div className={`flex items-center gap-2 text-[12px] transition-all ${/[a-z]/.test(password) ? 'text-[#10B981] font-medium' : 'text-[var(--ink-soft)]'}`}>
            <div className={`h-1.5 w-1.5 rounded-full transition-all ${/[a-z]/.test(password) ? 'bg-[#10B981]' : 'bg-[var(--border-strong)]'}`} />
            <span>Contains lowercase</span>
          </div>
        </div>
      </div>

      <label className="text-[13px] font-semibold text-[var(--ink-mid)]" htmlFor="confirmPassword">Confirm Password</label>
      <input
        id="confirmPassword"
        type="password"
        className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
      />

      <label className="flex items-center gap-2 text-[13px] text-[var(--ink-mid)]" htmlFor="terms">
        <input
          id="terms"
          type="checkbox"
          checked={agreedToTerms}
          onChange={(event) => setAgreedToTerms(event.target.checked)}
          required
        />
        <span>I agree to the <a className="font-semibold text-[var(--ink-mid)]" href="#">Terms &amp; Privacy</a></span>
      </label>

      {errorMessage ? <p className="mt-0.5 text-[13px] text-[var(--error)]">{errorMessage}</p> : null}

      <button
        className="mt-1.5 h-11 cursor-pointer rounded-[10px] border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--white)] transition-all hover:bg-[#4a4edc] disabled:cursor-not-allowed disabled:opacity-65"
        type="button"
        onClick={() => setFormStep(2)}
        disabled={
          isSubmitting ||
          !isLoaded ||
          !agreedToTerms ||
          !firstName ||
          !lastName ||
          !phoneNumber ||
          !emailAddress ||
          password.length < 8 ||
          !/\d/.test(password) ||
          !/[A-Z]/.test(password) ||
          !/[a-z]/.test(password) ||
          password !== confirmPassword
        }
      >
        Next step
      </button>
    </div>
  );
}
