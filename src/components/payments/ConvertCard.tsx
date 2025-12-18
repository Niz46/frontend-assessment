// src/components/payments/ConvertCard.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import { sanitizeNumberInput } from '../../lib/utils';
import { currencyOptions, walletOptions } from '../../lib/constants';

export default function ConvertCard() {
  const router = useRouter();

  // amounts stored as strings to keep user typing experience
  const [payAmt, setPayAmt] = useState('1.00');
  const [receiveAmt, setReceiveAmt] = useState('1.00');

  const [fromCurrency, setFromCurrency] = useState<Option | null>(currencyOptions[0]); // ETH
  const [toCurrency, setToCurrency] = useState<Option | null>(currencyOptions[2]); // NGN

  const [payFrom, setPayFrom] = useState<Option | null>(null);
  const [payTo, setPayTo] = useState<Option | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>('cryptoToCash');
  const [lastEdited, setLastEdited] = useState<'pay' | 'receive'>('pay');

  // mock exchange rates
  const rates = useMemo(
    () => ({
      'eth-ngn': 1200000,
      'btc-ngn': 18000000,
      'usdt-celo-ngn': 1200,
    }),
    []
  );

  const isFiat = (id?: string | null) => id === 'ngn';
  const formatAmount = (value: number, currencyId?: string | null) => {
    if (!Number.isFinite(value)) return '0.00';
    return isFiat(currencyId) ? value.toFixed(2) : value.toFixed(6).replace(/\.?0+$/, '');
  };

  const getRate = (fromId?: string | null, toId?: string | null) => {
    if (!fromId || !toId) return 1;
    if (fromId === toId) return 1;
    if (fromId === 'eth' && toId === 'ngn') return rates['eth-ngn'];
    if (fromId === 'btc' && toId === 'ngn') return rates['btc-ngn'];
    if ((fromId === 'usdt-celo' || fromId === 'usdt') && toId === 'ngn')
      return rates['usdt-celo-ngn'];
    if (fromId === 'ngn' && toId === 'eth') return 1 / (rates['eth-ngn'] ?? 1);
    if (fromId === 'ngn' && toId === 'btc') return 1 / (rates['btc-ngn'] ?? 1);
    if (fromId === 'ngn' && (toId === 'usdt-celo' || toId === 'usdt'))
      return 1 / (rates['usdt-celo-ngn'] ?? 1);

    if (
      (fromId === 'eth' || fromId === 'btc' || fromId === 'usdt-celo') &&
      (toId === 'eth' || toId === 'btc' || toId === 'usdt-celo')
    ) {
      const fromToNgn =
        fromId === 'eth'
          ? rates['eth-ngn']
          : fromId === 'btc'
            ? rates['btc-ngn']
            : rates['usdt-celo-ngn'];
      const toToNgn =
        toId === 'eth'
          ? rates['eth-ngn']
          : toId === 'btc'
            ? rates['btc-ngn']
            : rates['usdt-celo-ngn'];
      if (!fromToNgn || !toToNgn) return 1;
      return (fromToNgn ?? 1) / (toToNgn ?? 1);
    }

    return 1;
  };

  useEffect(() => {
    if (activeTab === 'cryptoToCash') {
      setFromCurrency(currencyOptions.find((c) => c.id === 'eth') ?? currencyOptions[0]);
      setToCurrency(currencyOptions.find((c) => c.id === 'ngn') ?? currencyOptions[2]);
    } else if (activeTab === 'cashToCrypto') {
      setFromCurrency(currencyOptions.find((c) => c.id === 'ngn') ?? currencyOptions[2]);
      setToCurrency(currencyOptions.find((c) => c.id === 'eth') ?? currencyOptions[0]);
    } else {
      setFromCurrency(currencyOptions.find((c) => c.id === 'eth') ?? currencyOptions[0]);
      setToCurrency(currencyOptions.find((c) => c.id === 'ngn') ?? currencyOptions[2]);
    }
    setPayAmt('1.00');
    setReceiveAmt('1.00');
    setLastEdited('pay');
  }, [activeTab]);

  useEffect(() => {
    if (lastEdited !== 'pay') return;
    const fromId = fromCurrency?.id;
    const toId = toCurrency?.id;
    const raw = parseFloat(payAmt || '0') || 0;
    const rate = getRate(fromId, toId);
    const received = raw * (rate ?? 1);
    setReceiveAmt(formatAmount(received, toId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payAmt, fromCurrency, toCurrency, lastEdited]);

  useEffect(() => {
    if (lastEdited !== 'receive') return;
    const fromId = fromCurrency?.id;
    const toId = toCurrency?.id;
    const raw = parseFloat(receiveAmt || '0') || 0;
    const rate = getRate(fromId, toId);
    const paid = rate ? raw / rate : raw;
    setPayAmt(formatAmount(paid, fromId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveAmt, fromCurrency, toCurrency, lastEdited]);

  // ROUTE -> recipient page
  function handleConvertNow() {
    // For a demo flow: push to /recipient (no payload)
    router.push('/recipient');
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'cryptoToCash', label: 'Crypto to cash' },
    { id: 'cashToCrypto', label: 'Cash to crypto' },
    { id: 'cryptoLoan', label: 'Crypto to fiat loan' },
  ];

  return (
    <Card aria-label="Crypto convert card">
      {/* NAV */}
      <div className="flex justify-center">
        <div
          className="w-[392px] h-[34px] rounded-full bg-[#F2F2F2] flex items-center gap-2 px-2"
          role="tablist"
        >
          {tabs.map((t) => {
            const isActive = t.id === activeTab;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(t.id)}
                className={`h-[34px] min-w-[120px] flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                  isActive ? 'bg-accent text-white min-w-[123px]' : 'text-accent bg-transparent'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* inputs */}
      <div className="mt-[34px] flex flex-col items-center space-y-6">
        <div className="w-[512px] h-[112px] rounded-[30px] border border-[#E0E0E0] bg-white p-6">
          <div className="text-sm text-gray-500">You pay</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-4" style={{ width: 464 }}>
              <input
                aria-label="You pay amount"
                value={payAmt}
                onChange={(e) => {
                  setLastEdited('pay');
                  setPayAmt(sanitizeNumberInput(e.target.value));
                }}
                className="w-full bg-transparent text-[28px] font-semibold text-accent placeholder-gray-300 focus:outline-none"
                inputMode="decimal"
                placeholder="0.00"
              />
            </div>
            <div className="ml-4">
              <Dropdown
                compact
                compactWidth="w-[100px]"
                value={fromCurrency}
                options={currencyOptions}
                onChange={(o) => setFromCurrency(o)}
                placeholder="ETH"
                ariaLabel="Select pay currency"
              />
            </div>
          </div>
        </div>

        <div className="w-[512px] h-[112px] rounded-[30px] border border-[#E0E0E0] bg-white p-6">
          <div className="text-sm text-gray-500">You receive</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-4" style={{ width: 464 }}>
              <input
                aria-label="You receive amount"
                value={receiveAmt}
                onChange={(e) => {
                  setLastEdited('receive');
                  setReceiveAmt(sanitizeNumberInput(e.target.value));
                }}
                className="w-full bg-transparent text-[28px] font-semibold text-accent placeholder-gray-300 focus:outline-none"
                inputMode="decimal"
                placeholder="0.00"
              />
            </div>
            <div className="ml-4">
              <Dropdown
                compact
                compactWidth="w-[100px]"
                value={toCurrency}
                options={currencyOptions}
                onChange={(o) => setToCurrency(o)}
                placeholder="NGN"
                ariaLabel="Select receive currency"
              />
            </div>
          </div>
        </div>

        <div className="w-[512px]">
          <div className="text-sm text-accent font-medium mb-2">Pay from</div>
          <div className="h-[60px] rounded-[30px] border border-[#E0E0E0] flex items-center px-6 bg-white">
            <div className="w-full">
              <Dropdown
                applyClassToTrigger
                className="w-full h-full text-left"
                triggerFullHeight
                hideCaret
                triggerBgClass="bg-transparent"
                triggerBorderClass="border-transparent"
                popoverBgClass="bg-white"
                popoverBorderClass="border-[#E0E0E0]"
                popoverWidth="w-[464px]"
                align="left"
                value={payFrom}
                options={walletOptions}
                onChange={(o) => setPayFrom(o)}
                placeholder="Select an option"
                ariaLabel="Pay from wallet"
              />
            </div>
          </div>
        </div>

        <div className="w-[512px]">
          <div className="text-sm text-accent font-medium mb-2">Pay to</div>
          <div className="h-[60px] rounded-[30px] border border-[#E0E0E0] flex items-center px-6 bg-white">
            <div className="w-full">
              <Dropdown
                applyClassToTrigger
                className="w-full h-full text-left"
                triggerFullHeight
                hideCaret
                triggerBgClass="bg-transparent"
                triggerBorderClass="border-transparent"
                popoverBgClass="bg-white"
                popoverBorderClass="border-[#E0E0E0]"
                popoverWidth="w-[464px]"
                align="left"
                value={payTo}
                options={walletOptions}
                onChange={(o) => setPayTo(o)}
                placeholder="Select an option"
                ariaLabel="Pay to"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="absolute left-[64px] right-[64px] mt-14">
        <div className="w-full">
          <Button onClick={handleConvertNow} ariaLabel="Convert now">
            {activeTab === 'cashToCrypto'
              ? 'Buy crypto'
              : activeTab === 'cryptoLoan'
                ? 'Request loan'
                : 'Convert now'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
