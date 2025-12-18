// src/components/payments/SendEthCard.tsx
'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatEth } from '../../lib/utils';
import Image from 'next/image';

export default function SendEthCard() {
  const router = useRouter();
  const search = useSearchParams();

  // Recipient info from query params (passed by /recipient or convert page)
  const bankId = search.get('bankId') ?? '';
  const bankLabel = search.get('bankLabel') ?? '';
  const accountNumber = search.get('accountNumber') ?? '';
  const accountName = search.get('accountName') ?? '';

  // amount pulled from convert page (query param "amount"), fallback 100
  const initialAmount = (() => {
    const q = search.get('amount');
    if (!q) return 100;
    const n = Number(q);
    return Number.isFinite(n) && n > 0 ? n : 100;
  })();

  const [amount] = useState<number>(initialAmount);
  const fee = 0.0021;
  const total = useMemo(() => amount + fee, [amount]);

  // toast state
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  function showToast(text: string, type: 'success' | 'error' = 'success') {
    setToast({ text, type });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3000);
  }

  // copy helper
  async function copyToClipboard(text: string, label = 'Copied') {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label}`, 'success');
    } catch {
      showToast('Unable to copy', 'error');
    }
  }

  function handleSend() {
    // basic validation
    if (!Number.isFinite(amount) || amount <= 0) {
      showToast('Invalid amount', 'error');
      router.push('/recipient');
    }

    // navigate to confirmation page with params
    const params = new URLSearchParams({
      amount: String(amount),
      fee: String(fee),
      total: String(total),
      bankId,
      bankLabel,
      accountNumber,
      accountName,
    });
    router.push(`/convert?${params.toString()}`);
  }

  return (
    <div className="min-h-[640px] flex items-center justify-center bg-black/90">
      {/* toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-6 right-6 z-50 rounded-md px-4 py-2 text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.text}
        </div>
      )}

      {/* outer card: pixel container 640 x 640 */}
      <div
        style={{
          width: 640,
          height: 640,
          borderRadius: 30,
          background: '#FFFFFF',
          border: '1px solid #CCF6E5',
        }}
        className="relative"
      >
        {/* inner content padding to match screenshot */}
        <div className="px-[64px] pt-[28px]">
          {/* header row */}
          <div className="flex items-center justify-between mb-[24px]">
            {/* back button */}
            <button
              onClick={() => router.back()}
              aria-label="Back"
              className="p-2 rounded-full hover:bg-gray-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="#013941"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* title centered */}
            <div className="flex-1 text-center">
              <h1 className="text-[20px] font-medium leading-[100%]" style={{ color: '#013941' }}>
                Send ETH to the address below
              </h1>
            </div>

            <div style={{ width: 40 }} />
          </div>

          {/* address pill (centered) — 250x40 with exact colors/border */}
          <div className="flex justify-center mb-[24px]">
            <div
              style={{
                width: 250,
                height: 40,
                borderRadius: 30,
                background: '#E6FBF2',
                border: '1px solid #CCF6E5',
                paddingLeft: 16,
                paddingRight: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <div
                className="text-sm font-medium"
                style={{ color: '#013941', maxWidth: 180 }}
                title={accountNumber || 'No recipient address'}
              >
                {accountNumber ? accountNumber : 'No recipient address'}
              </div>

              <button
                onClick={() => copyToClipboard(accountNumber || '', 'Address copied')}
                aria-label="Copy address"
                className="p-1 rounded"
                title="Copy address"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 9H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4"
                    stroke="#013941"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="9"
                    y="3"
                    width="11"
                    height="11"
                    rx="2"
                    stroke="#013941"
                    strokeWidth="1.4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* account details container 512 x 144 */}
          <div
            style={{
              width: 512,
              height: 144,
              background: '#F7F7F7',
              borderRadius: 10,
              paddingTop: 16,
              paddingRight: 24,
              paddingBottom: 16,
              paddingLeft: 24,
            }}
            className="mx-auto"
          >
            {/* Amount row */}
            <div
              className="flex items-center justify-between mb-4"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.02)', paddingBottom: 12 }}
            >
              <div className="text-sm" style={{ color: '#374151' }}>
                Amount to send
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm font-medium" style={{ color: '#013941' }}>
                  {formatEth(amount)} ETH
                </div>

                <button
                  onClick={() => copyToClipboard(`${formatEth(amount)} ETH`, 'Amount copied')}
                  aria-label="Copy amount"
                  className="p-1 rounded"
                  title="Copy amount"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 9H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4"
                      stroke="#013941"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="9"
                      y="3"
                      width="11"
                      height="11"
                      rx="2"
                      stroke="#013941"
                      strokeWidth="1.4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Network row */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm" style={{ color: '#374151' }}>
                Network
              </div>
              <div className="text-sm font-medium" style={{ color: '#013941' }}>
                ETH
              </div>
            </div>

            {/* Wallet row */}
            <div className="flex items-center justify-between">
              <div className="text-sm" style={{ color: '#374151' }}>
                Wallet
              </div>
              <div className="text-sm font-medium" style={{ color: '#013941' }}>
                Other
              </div>
            </div>
          </div>

          {/* Only-send informational line — 512x40 */}
          <div className="mt-[24px] flex justify-center">
            <div
              style={{ width: 512, height: 40 }}
              className="text-sm flex items-center gap-3 text-[#374151] leading-tight"
            >
              {/* icon - fixed size, won't shrink */}
              <Image
                src="/Vector.png"
                alt="Info"
                width={16}
                height={16}
                className="flex-shrink-0"
              />

              {/* text - wraps if needed and aligns with the icon center */}
              <div>
                Only send <span className="text-[#013941] font-medium">{'{USDT}'}</span> to this
                address. Ensure the sender is on the{' '}
                <span className="text-[#013941] font-medium">{'{CELO}'}</span> network otherwise you
                might lose your deposit.
              </div>
            </div>
          </div>
        </div>

        {/* CTA anchored to match screenshot -> absolute inside the 640x640 container */}
        <div style={{ position: 'absolute', left: 64, right: 64, bottom: 28 }}>
          <button
            type="button"
            onClick={handleSend}
            aria-label="I have sent it"
            style={{
              width: 512,
              height: 60,
              borderRadius: 30,
              background: '#013941',
            }}
            className="text-white font-medium"
          >
            I have sent it
          </button>
        </div>
      </div>
    </div>
  );
}
