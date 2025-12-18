export const currencyOptions: Option[] = [
  {
    id: 'eth',
    label: 'ETH',
    meta: 'Ethereum',
    icon: '/assets/ETH.png',
    value: '',
  },
  {
    id: 'btc',
    label: 'BTC',
    meta: 'Bitcoin',
    icon: '/assets/BTC.png',
    value: '',
  },
  {
    id: 'ngn',
    label: 'NGN',
    meta: 'Nigerian Naira',
    icon: '/assets/ngn.png',
    value: '',
  },
  {
    id: 'usdt-celo',
    label: 'USDT',
    meta: 'USDT - CELO',
    icon: '/assets/coin.png',
    value: '',
  },
];

export const walletOptions: Option[] = [
  {
    id: 'metamask',
    label: 'Metamask',
    icon: '/assets/metamask.png',
    value: '',
  },
  {
    id: 'rainbow',
    label: 'Rainbow',
    icon: '/assets/rainbom.png',
    value: '',
  },
  {
    id: 'walletconnect',
    label: 'WalletConnect',
    icon: '/assets/walletconnect.png',
    value: '',
  },
  {
    id: 'otherwallet',
    label: 'Other Crypto Wallets(Binance, Coinbase, Bybit etc)',
    icon: '/assets/Wallet.png',
    value: '',
  },
];

export const tabs: { id: TabId; label: string }[] = [
  { id: 'cryptoToCash', label: 'Crypto to cash' },
  { id: 'cashToCrypto', label: 'Cash to crypto' },
  { id: 'cryptoLoan', label: 'Crypto to fiat loan' },
];

export const bankOptions = [
  { id: 'access', label: 'Access Bank' },
  { id: 'gtb', label: 'GTBank' },
  { id: 'uba', label: 'UBA' },
  { id: 'zenith', label: 'Zenith Bank' },
  { id: 'fidelity', label: 'Fidelity Bank' },
];
