'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function SendEthCard() {
  const [amount, setAmount] = useState('0.00');

  const fee = 0.0021;
  const total = Number(amount || 0) + fee;

  return (
    <Card aria-label="Send ETH">
      <div className="flex flex-col items-center space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-accent">Send ETH</h2>
          <p className="text-sm text-gray-400 mt-1">Send ETH to the address below</p>
        </div>

        {/* Amount */}
        <div className="w-[512px] h-[112px] rounded-[30px] border border-[#E0E0E0] p-6">
          <div className="text-sm text-gray-500">Amount</div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="0.00"
            inputMode="decimal"
            className="w-full bg-transparent text-[28px] font-semibold text-accent focus:outline-none mt-2"
          />
        </div>

        {/* Address (readonly) */}
        <div className="w-[512px]">
          <div className="text-sm text-gray-500 mb-2">Recipient address</div>
          <div className="h-[60px] rounded-[30px] border border-[#E0E0E0] px-6 flex items-center font-mono text-sm text-accent">
            0x4f3A98c3E21D9B7C0f8A91D....
          </div>
        </div>

        {/* Breakdown */}
        <div className="w-[512px] rounded-[20px] bg-[#F7F7F7] p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Network fee</span>
            <span className="text-accent">{fee} ETH</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-accent">Total</span>
            <span className="text-accent">{total.toFixed(4)} ETH</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="absolute left-[64px] right-[64px] bottom-[28px]">
        <Button ariaLabel="Send ETH">Send ETH</Button>
      </div>
    </Card>
  );
}
