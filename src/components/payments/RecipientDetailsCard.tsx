// src/app/recipient/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { stepOneSchema, stepTwoSchema } from '@lib/schema';
import Card from '@components/ui/Card';
import Dropdown from '@components/ui/Dropdown';
import { bankOptions } from '@lib/constants';
import Image from 'next/image';

export default function RecipientPage() {
  const router = useRouter();

  // step: 1 -> bank/account, 2 -> contact
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state
  const [bank, setBank] = useState<Option | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [stepOneErrors, setStepOneErrors] = useState<Record<string, string>>({});
  const [resolving, setResolving] = useState(false);

  // Step 2 state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [stepTwoErrors, setStepTwoErrors] = useState<Record<string, string>>({});

  // UI / toast state
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3500);
  }

  // readiness booleans
  const canProceedToStep2 = useMemo(() => {
    // local quick check: bank selected + 10-digit account
    return Boolean(bank) && /^\d{10}$/.test(accountNumber) && !resolving;
  }, [bank, accountNumber, resolving]);

  const canSubmit = useMemo(() => {
    const parsed = stepTwoSchema.safeParse({ email, phone });
    return parsed.success;
  }, [email, phone]);

  // Auto-resolve account name when bank + valid 10-digit account present.
  useEffect(() => {
    if (!bank || !/^\d{10}$/.test(accountNumber)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResolvedName(null);
      setResolving(false);
      return;
    }

    let cancelled = false;
    setResolving(true);

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      // Mock: even-last-digit => ODUTUGA GBEKE, else ALICE OLU
      const last = accountNumber[accountNumber.length - 1];
      const name = /[02468]/.test(last) ? 'ODUTUGA GBEKE' : 'ALICE OLU';
      setResolvedName(name);
      setResolving(false);
    }, 650);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [bank, accountNumber]);

  // cleanup toast timer
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Handlers
  function handleBack() {
    if (step === 2) {
      setStep(1);
      setStepTwoErrors({});
      return;
    }
    router.back();
  }

  function handleBankChange(opt: Option) {
    setBank(opt);
    // reset dependent fields on bank change
    setAccountNumber('');
    setResolvedName(null);
    setResolving(false);
    setStepOneErrors({});
  }

  function handleAccountNumberChange(value: string) {
    const digits = value.replace(/[^\d]/g, '').slice(0, 10);
    setAccountNumber(digits);

    // clear accountNumber error if present
    setStepOneErrors((prev) => {
      if (!prev || !prev.accountNumber) return prev;
      const copy = { ...prev };
      delete copy.accountNumber;
      return copy;
    });

    if (!/^\d{10}$/.test(digits)) {
      setResolvedName(null);
      setResolving(false);
    }
  }

  function handleBottomNext() {
    // Step 1: validate and step to Step 2
    if (step === 1) {
      const result = stepOneSchema.safeParse({
        bankId: bank?.id ?? '',
        accountNumber,
      });

      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.issues.forEach((i) => {
          errs[i.path[0] as string] = i.message;
        });
        setStepOneErrors(errs);
        showToast('Please fix the errors above', 'error');
        return;
      }

      setStepOneErrors({});
      if (resolving) {
        showToast('Still resolving account name — please wait', 'error');
        return;
      }

      setStep(2);
      return;
    }

    // Step 2: validate & submit
    if (!canSubmit) {
      const errs: Record<string, string> = {};
      const r2 = stepTwoSchema.safeParse({ email, phone });
      if (!r2.success) {
        r2.error.issues.forEach((i) => {
          errs[i.path[0] as string] = i.message;
        });
      } else {
        errs.general = 'Please check the fields';
      }
      setStepTwoErrors(errs);
      showToast('Please fix the errors above', 'error');
      return;
    }

    setStepTwoErrors({});

    // build payload and navigate (or replace with API call)
    const payload = {
      bankId: bank?.id ?? null,
      bankLabel: bank?.label ?? null,
      accountNumber,
      accountName: resolvedName,
      email: email || null,
      phone: phone ? `+234${phone}` : null,
    };

    console.info('Recipient details submitted:', payload);
    showToast('Recipient details submitted', 'success');

    // Navigate to /send with query params (change destination if you prefer)
    const params = new URLSearchParams({
      bankId: payload.bankId ?? '',
      bankLabel: payload.bankLabel ?? '',
      accountNumber: payload.accountNumber,
      accountName: payload.accountName ?? '',
      email: payload.email ?? '',
      phone: payload.phone ?? '',
    });

    router.push(`/send?${params.toString()}`);
  }

  return (
    <div className="relative min-h-[560px]">
      {/* toast */}
      {toast && (
        <div
          aria-live="polite"
          className={`fixed top-6 right-6 z-50 rounded-md px-4 py-2 shadow-md text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <Card aria-label="recipient details card" className="mx-auto max-w-[720px]">
        <div className="flex flex-col items-start space-y-6 pl-6 pr-6">
          {/* header */}
          <div className="w-full flex items-center justify-between">
            <button
              aria-label="Back"
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="#013941"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="text-center flex-1">
              <h1 className="text-lg font-semibold text-accent">Recipient details</h1>
            </div>

            <div style={{ width: 40 }} />
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <div className="w-full max-w-[640px]">
                <label className="text-sm text-accent font-medium mb-2 block">Bank</label>
                <div className="h-[56px] rounded-[28px] border border-[#E0E0E0] px-4 bg-white flex items-center">
                  <Dropdown
                    value={bank ?? null}
                    options={bankOptions as Option[]}
                    onChange={(opt) => handleBankChange(opt as Option)}
                    placeholder="Select an option"
                    hideCaret
                    align="left"
                    triggerBgClass="bg-transparent"
                    triggerBorderClass="border-transparent"
                    popoverBgClass="bg-white"
                    popoverBorderClass="border-[#E0E0E0]"
                    popoverWidth="w-[464px]"
                    triggerFullHeight
                    applyClassToTrigger={false}
                  />
                </div>
                {stepOneErrors.bankId && (
                  <p className="text-xs text-red-500 mt-1">{stepOneErrors.bankId}</p>
                )}
              </div>

              <div className="w-full max-w-[640px]">
                <label className="text-sm text-accent font-medium mb-2 block">Account number</label>
                <input
                  value={accountNumber}
                  onChange={(e) => handleAccountNumberChange(e.target.value)}
                  placeholder="Enter your account number"
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full h-[56px] rounded-[28px] border border-[#E0E0E0] px-6 focus:outline-none"
                />
                {stepOneErrors.accountNumber && (
                  <p className="text-xs text-red-500 mt-1">{stepOneErrors.accountNumber}</p>
                )}
              </div>

              <div className="w-full max-w-[640px] mt-1">
                <div className="text-sm text-accent font-medium mb-2">Account name</div>
                <div className="h-[56px] rounded-[28px] bg-[#F4F4F4] flex items-center px-6 text-accent">
                  {resolving ? 'Resolving...' : (resolvedName ?? '—')}
                </div>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div className="w-full max-w-[640px]">
                <label className="text-sm text-accent font-medium mb-2 block">
                  Recipient email
                </label>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStepTwoErrors((prev) => {
                      if (!prev || !prev.email) return prev;
                      const copy = { ...prev };
                      delete copy.email;
                      return copy;
                    });
                  }}
                  placeholder="Enter recipient email"
                  className="w-full h-[56px] rounded-[28px] border border-[#E0E0E0] px-6 focus:outline-none"
                />
                {stepTwoErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{stepTwoErrors.email}</p>
                )}
              </div>

              <div className="w-full max-w-[640px]">
                <label className="text-sm text-accent font-medium mb-2 block">
                  Recipient phone number
                </label>
                <div className="flex items-center h-[56px] rounded-[28px] border border-[#E0E0E0] px-4 gap-3">
                  <div className="flex items-center gap-2 pr-4 h-[56px] border-r border-[#E0E0E0]">
                    <span className="text-sm text-accent">+234</span>
                    <Image
                      src="/assets/ngn.png"
                      alt="NG"
                      width={20}
                      height={20}
                      className="rounded-full h-5 w-5"
                    />
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^\d]/g, '');
                      setPhone(digits);
                      setStepTwoErrors((prev) => {
                        if (!prev || !prev.phone) return prev;
                        const copy = { ...prev };
                        delete copy.phone;
                        return copy;
                      });
                    }}
                    placeholder="000-000-00000"
                    maxLength={10}
                    className="flex-1 h-full focus:outline-none"
                  />
                </div>
                {stepTwoErrors.phone && (
                  <p className="text-xs text-red-500 mt-1">{stepTwoErrors.phone}</p>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Bottom CTA */}
      <div className="absolute left-[64px] right-[64px] bottom-[28px]">
        <button
          type="button"
          onClick={handleBottomNext}
          disabled={step === 1 ? !canProceedToStep2 : !canSubmit}
          aria-disabled={step === 1 ? !canProceedToStep2 : !canSubmit}
          className={`w-full h-[56px] rounded-[30px] font-medium ${
            (step === 1 ? canProceedToStep2 : canSubmit)
              ? 'bg-[#013941] text-white'
              : 'bg-[#013941] opacity-60 cursor-not-allowed text-white'
          }`}
        >
          {step === 1 ? (resolving ? 'Resolving…' : 'Next') : 'Submit'}
        </button>
      </div>
    </div>
  );
}
