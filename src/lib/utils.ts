// numeric input sanitizer (allows numbers and one decimal point)
export const sanitizeNumberInput = (v: string) => {
  const cleaned = v.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length === 1) return parts[0].slice(0, 12);
  // keep only first dot and up to 8 decimals
  return `${parts[0].slice(0, 10)}.${parts.slice(1).join('').slice(0, 8)}`;
};

export function formatEth(value: number) {
  if (!Number.isFinite(value)) return '0';
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(6).replace(/\.?0+$/, '');
}
