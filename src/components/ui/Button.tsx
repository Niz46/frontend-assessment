// src/components/ui/Button.tsx
import React from 'react';
type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
};
export default function Button({
  children,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
}: Props) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`w-full inline-flex items-center justify-center py-4 px-6 rounded-full bg-accent text-white text-base font-medium shadow-sm ${className}`}
    >
      {children}
    </button>
  );
}
