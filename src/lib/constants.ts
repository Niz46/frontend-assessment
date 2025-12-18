export const currencyOptions: Option[] = [
  { id: 'eth', label: 'ETH', meta: 'Ethereum', icon: '/assets/ETH.png' },
  { id: 'btc', label: 'BTC', meta: 'Bitcoin', icon: '/assets/BTC.png' },
  { id: 'ngn', label: 'NGN', meta: 'Nigerian Naira', icon: '/assets/ngn.png' },
  { id: 'usdt-celo', label: 'USDT', meta: 'USDT - CELO', icon: '/assets/coin.png' },
];

export const walletOptions: Option[] = [
  { id: 'metamask', label: 'Metamask', icon: '/assets/metamask.png' },
  { id: 'rainbow', label: 'Rainbow', icon: '/assets/rainbom.png' },
  { id: 'walletconnect', label: 'WalletConnect', icon: '/assets/walletconnect.png' },
  {
    id: 'otherwallet',
    label: 'Other Crypto Wallets(Binance, Coinbase, Bybit etc)',
    icon: '/assets/Wallet.png',
  },
];

export const tabs: { id: TabId; label: string }[] = [
  { id: 'cryptoToCash', label: 'Crypto to cash' },
  { id: 'cashToCrypto', label: 'Cash to crypto' },
  { id: 'cryptoLoan', label: 'Crypto to fiat loan' },
];
