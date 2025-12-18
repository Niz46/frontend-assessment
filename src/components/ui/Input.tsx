// src/components/ui/Input.tsx
import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
  className?: string;
};

export default function Input({ label, id, className = '', ...rest }: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={id} className="text-sm text-accent font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        {...rest}
        className={`w-full rounded-[30px] h-12 border border-[#E0E0E0] px-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-figmaInner bg-white ${className}`}
      />
    </div>
  );
}
