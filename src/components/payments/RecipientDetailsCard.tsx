'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import { networkOptions } from '../../lib/constants';

export default function RecipientDetailsCard() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState<Option | null>(networkOptions[0]);
  const [note, setNote] = useState('');

  return (
    <Card aria-label="Recipient details">
      <div className="flex flex-col items-center space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-accent">Recipient details</h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter the details of who you’re sending crypto to
          </p>
        </div>

        {/* Name */}
        <div className="w-[512px]">
          <label className="text-sm text-accent font-medium mb-2 block">Recipient name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full h-[60px] rounded-[30px] border border-[#E0E0E0] px-6 focus:outline-none"
          />
        </div>

        {/* Wallet Address */}
        <div className="w-[512px]">
          <label className="text-sm text-accent font-medium mb-2 block">Wallet address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x4f3...9a21"
            className="w-full h-[60px] rounded-[30px] border border-[#E0E0E0] px-6 focus:outline-none font-mono"
          />
        </div>

        {/* Network */}
        <div className="w-[512px]">
          <label className="text-sm text-accent font-medium mb-2 block">Network</label>
          <div className="h-[60px] rounded-[30px] border border-[#E0E0E0] px-6 bg-white flex items-center">
            <Dropdown
              className="w-full"
              value={network}
              options={networkOptions}
              onChange={setNetwork}
              placeholder="Select network"
              triggerBgClass="bg-transparent"
              triggerBorderClass="border-transparent"
              popoverWidth="w-[320px]"
              align="center"
              triggerFullHeight
              hideCaret
            />
          </div>
        </div>

        {/* Note */}
        <div className="w-[512px]">
          <label className="text-sm text-accent font-medium mb-2 block">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What is this transfer for?"
            className="w-full min-h-[96px] rounded-[20px] border border-[#E0E0E0] px-6 py-4 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="absolute left-[64px] right-[64px] bottom-[28px]">
        <Button ariaLabel="Continue">Continue</Button>
      </div>
    </Card>
  );
}
