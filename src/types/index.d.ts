type Option = {
  value: string;
  id: string;
  label: string;
  meta?: string;
  icon?: string;
};

type TabId = 'cryptoToCash' | 'cashToCrypto' | 'cryptoLoan';

type FormValues = z.infer<typeof formSchema>;
