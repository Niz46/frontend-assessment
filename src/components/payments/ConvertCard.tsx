// src/components/payments/ConvertCard.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Card from '../ui/Card';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import { sanitizeNumberInput } from '../../lib/utils';
import { currencyOptions, walletOptions } from '../../lib/constants';

export default function ConvertCard() {
  // amounts stored as strings to keep user typing experience
  const [payAmt, setPayAmt] = useState('1.00');
  const [receiveAmt, setReceiveAmt] = useState('1.00');

  const [fromCurrency, setFromCurrency] = useState<Option | null>(currencyOptions[0]); // ETH
  const [toCurrency, setToCurrency] = useState<Option | null>(currencyOptions[2]); // NGN

  const [payFrom, setPayFrom] = useState<Option | null>(null);
  const [payTo, setPayTo] = useState<Option | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>('cryptoToCash');
  const [lastEdited, setLastEdited] = useState<'pay' | 'receive'>('pay');

  // mock exchange rates: from -> to (price of 1 unit of 'from' in 'to')
  // we'll keep only a few common pairs. If pair not found, fallback to 1.
  const rates = useMemo(
    () => ({
      'eth-ngn': 1200000, // 1 ETH = 1,200,000 NGN (mock)
      'btc-ngn': 18000000, // 1 BTC = 18,000,000 NGN (mock)
      'usdt-celo-ngn': 1200, // 1 USDT ~= 1200 NGN (mock)
      // reverse handled by code (divide)
      // crypto<->crypto approximations (via NGN intermediary) will be computed dynamically
    }),
    []
  );

  // helper to format numbers per currency (fiat 2 decimals, crypto 6 decimals)
  const isFiat = (id?: string | null) => id === 'ngn';
  const formatAmount = (value: number, currencyId?: string | null) => {
    if (!Number.isFinite(value)) return '0.00';
    return isFiat(currencyId) ? value.toFixed(2) : value.toFixed(6).replace(/\.?0+$/, '');
  };

  // compute conversion rate from fromId -> toId (may use NGN as intermediary)
  const getRate = (fromId?: string | null, toId?: string | null) => {
    if (!fromId || !toId) return 1;
    if (fromId === toId) return 1;

    // direct mappings
    if (fromId === 'eth' && toId === 'ngn') return rates['eth-ngn'];
    if (fromId === 'btc' && toId === 'ngn') return rates['btc-ngn'];
    if ((fromId === 'usdt-celo' || fromId === 'usdt') && toId === 'ngn')
      return rates['usdt-celo-ngn'];

    // reverse direct
    if (fromId === 'ngn' && toId === 'eth') return 1 / (rates['eth-ngn'] ?? 1);
    if (fromId === 'ngn' && toId === 'btc') return 1 / (rates['btc-ngn'] ?? 1);
    if (fromId === 'ngn' && (toId === 'usdt-celo' || toId === 'usdt'))
      return 1 / (rates['usdt-celo-ngn'] ?? 1);

    // crypto-to-crypto via NGN (approx)
    if (
      (fromId === 'eth' || fromId === 'btc' || fromId === 'usdt-celo') &&
      (toId === 'eth' || toId === 'btc' || toId === 'usdt-celo')
    ) {
      // convert from -> NGN then NGN -> to
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

    // fallback
    return 1;
  };

  // update defaults when tab changes
  useEffect(() => {
    if (activeTab === 'cryptoToCash') {
      setFromCurrency(currencyOptions.find((c) => c.id === 'eth') ?? currencyOptions[0]);
      setToCurrency(currencyOptions.find((c) => c.id === 'ngn') ?? currencyOptions[2]);
    } else if (activeTab === 'cashToCrypto') {
      setFromCurrency(currencyOptions.find((c) => c.id === 'ngn') ?? currencyOptions[2]);
      setToCurrency(currencyOptions.find((c) => c.id === 'eth') ?? currencyOptions[0]);
    } else {
      // cryptoLoan keep same as cryptoToCash by default
      setFromCurrency(currencyOptions.find((c) => c.id === 'eth') ?? currencyOptions[0]);
      setToCurrency(currencyOptions.find((c) => c.id === 'ngn') ?? currencyOptions[2]);
    }

    // reset amounts to 1.00 when changing mode (keeps UI predictable)
    setPayAmt('1.00');
    setReceiveAmt('1.00');
    setLastEdited('pay');
  }, [activeTab]);

  // when user edits payAmt -> compute receiveAmt
  useEffect(() => {
    if (lastEdited !== 'pay') return;
    const fromId = fromCurrency?.id;
    const toId = toCurrency?.id;
    const raw = parseFloat(payAmt || '0') || 0;
    const rate = getRate(fromId, toId);
    // compute: receive = raw * rate
    const received = raw * (rate ?? 1);
    setReceiveAmt(formatAmount(received, toId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payAmt, fromCurrency, toCurrency, lastEdited]);

  // when user edits receiveAmt -> compute payAmt
  useEffect(() => {
    if (lastEdited !== 'receive') return;
    const fromId = fromCurrency?.id;
    const toId = toCurrency?.id;
    const raw = parseFloat(receiveAmt || '0') || 0;
    const rate = getRate(fromId, toId);
    // pay = receive / rate
    const paid = rate ? raw / rate : raw;
    setPayAmt(formatAmount(paid, fromId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveAmt, fromCurrency, toCurrency, lastEdited]);

  // UI helpers for tab styling
  const tabs: { id: TabId; label: string }[] = [
    { id: 'cryptoToCash', label: 'Crypto to cash' },
    { id: 'cashToCrypto', label: 'Cash to crypto' },
    { id: 'cryptoLoan', label: 'Crypto to fiat loan' },
  ];

  return (
    <Card aria-label="Crypto convert card">
      {/* NAVBAR */}
      <div className="flex justify-center">
        <div
          className="w-[392px] h-[34px] rounded-full bg-[#F2F2F2] flex items-center gap-2 px-2"
          role="tablist"
          aria-label="conversion modes"
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

      {/* inputs wrapper */}
      <div className="mt-[34px] flex flex-col items-center space-y-6">
        {/* You pay block - 512 x 112 */}
        <div
          className="w-[512px] h-[112px] rounded-[30px] border border-[#E0E0E0] bg-white p-6"
          role="group"
          aria-labelledby="you-pay-label"
        >
          <div id="you-pay-label" className="text-sm text-gray-500">
            You pay
          </div>

          <div className="mt-2 flex items-center justify-between">
            {/* LEFT: editable input area (flex-grow) */}
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

            {/* RIGHT: compact currency dropdown (fixed width ~100px) */}
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

        {/* You receive block - 512 x 112 */}
        <div
          className="w-[512px] h-[112px] rounded-[30px] border border-[#E0E0E0] bg-white p-6"
          role="group"
          aria-labelledby="you-receive-label"
        >
          <div id="you-receive-label" className="text-sm text-gray-500">
            You receive
          </div>

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

        {/* Pay from (select) - styled as input-like trigger */}
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

        {/* Pay to (select) - styled as input-like trigger */}
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

      {/* Big convert CTA anchored near bottom */}
      <div className="absolute left-[64px] right-[64px] mt-14">
        <div className="w-full">
          <Button ariaLabel="Convert now">
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
