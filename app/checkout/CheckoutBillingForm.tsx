'use client';

import { useState, useEffect } from 'react';

function generateRandomBoothCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let letters = '';
  let digits = '';
  for (let i = 0; i < 4; i++) letters += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) digits += nums.charAt(Math.floor(Math.random() * nums.length));
  return `${letters}-${digits}`;
}

type CheckoutBillingFormProps = {
  booths?: { id: string; name: string; booth_code: string }[];
  planKey: string;
  addons: string[];
  billing: string;
};

export default function CheckoutBillingForm({ booths = [], planKey, addons, billing }: CheckoutBillingFormProps) {
  const [localBooths, setLocalBooths] = useState(booths);
  const [selectedBooth, setSelectedBooth] = useState('');
  const [newBoothName, setNewBoothName] = useState('');
  const [location, setLocation] = useState('');
  const [newBoothCode, setNewBoothCode] = useState('');
  const [company, setCompany] = useState('');
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedBooth === 'create-new' && !newBoothCode) {
      setNewBoothCode(generateRandomBoothCode());
    }
  }, [selectedBooth, newBoothCode]);

  return (
    <>
      <h3 className="mt-6 mb-[18px] font-[var(--font-syne)] text-[22px] tracking-[-0.5px]">Billing details</h3>
      <div className="grid grid-cols-2 gap-[14px] max-[1024px]:grid-cols-1">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-[var(--ink-mid)]">Full name</span>
          <input className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]" type="text" placeholder="Your full name" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-[var(--ink-mid)]">Email</span>
          <input className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]" type="email" placeholder="you@company.com" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-[var(--ink-mid)]">Company (optional)</span>
          <input 
            className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]" 
            type="text" 
            placeholder="Studio name" 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-[var(--ink-mid)]">Booth ID</span>
          <select
            className="h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]"
            value={selectedBooth}
            onChange={(event) => setSelectedBooth(event.target.value)}
          >
            <option value="">Select booth</option>
            {localBooths.map((booth) => (
              <option key={booth.id} value={booth.id}>
                {booth.name} ({booth.booth_code})
              </option>
            ))}
            <option value="create-new">+ Create new booth</option>
          </select>
        </label>
      </div>

      {selectedBooth === 'create-new' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(13,13,18,0.4)] p-4 backdrop-blur-sm">
          <div className="w-full max-w-[420px] rounded-2xl bg-[var(--white)] p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="mb-4 text-lg font-[var(--font-syne)] font-semibold text-[var(--ink)]">Create new booth</h3>
            
            <div className="flex flex-col gap-[14px]">
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-[var(--ink-mid)]">New booth name</span>
                <input 
                  className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]" 
                  type="text" 
                  placeholder="Example: Wedding Booth A" 
                  value={newBoothName}
                  onChange={(e) => setNewBoothName(e.target.value)}
                  autoFocus
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-[var(--ink-mid)]">Location</span>
                <input 
                  className="h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--white)] px-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(91,95,238,.12)]" 
                  type="text" 
                  placeholder="Example: Jakarta City Hall" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setSelectedBooth('')} 
                disabled={isModalSaving}
                className="rounded-[10px] px-4 py-2 text-sm font-semibold text-[var(--ink-soft)] transition-colors hover:bg-[var(--off)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={async () => {
                  if (!newBoothName || !location) {
                    setError('Please fill in both name and location');
                    return;
                  }
                  setIsModalSaving(true);
                  setError('');
                  try {
                    const res = await fetch('/api/booths', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: newBoothName,
                        booth_code: newBoothCode,
                        location,
                        company
                      })
                    });
                    const data = await res.json();
                    if (data.error) {
                      setError(data.error);
                    } else if (data.booth) {
                      setLocalBooths(prev => [data.booth, ...prev]);
                      setSelectedBooth(data.booth.id);
                    }
                  } catch (err) {
                    setError('Failed to create booth. Try again.');
                  } finally {
                    setIsModalSaving(false);
                  }
                }} 
                disabled={isModalSaving}
                className="rounded-[10px] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--white)] transition-colors hover:bg-[#4a4edc] disabled:opacity-50"
              >
                {isModalSaving ? 'Saving...' : 'Save booth'}
              </button>
            </div>
            {error && selectedBooth === 'create-new' && (
              <p className="mt-3 text-sm text-[var(--error)]">{error}</p>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-[var(--error)]">{error}</p>}

      <button 
        className="mt-5 h-11 w-full cursor-pointer rounded-[10px] border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--white)] transition-all hover:bg-[#4a4edc] disabled:opacity-50 disabled:cursor-not-allowed" 
        type="button" 
        onClick={async () => {
          if (!selectedBooth || selectedBooth === 'create-new') {
            setError('Please select a saved booth to proceed.');
            return;
          }
          
          setError('');
          setIsLoading(true);
          
          try {
            const response = await fetch('/api/payments/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                boothId: selectedBooth,
                company,
                planKey,
                addons,
                billing
              }),
            });
            
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setIsLoading(false);
      } else if (data.checkoutUrl) {
        // Redirect to the database-backed invoice page
        window.location.href = `/checkout/invoice/${data.invoiceId}`;
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setIsLoading(false);
    }
  }}
  disabled={isLoading}
>
  {isLoading ? 'Processing...' : 'Proceed to payment'}
      </button>
    </>
  );
}
