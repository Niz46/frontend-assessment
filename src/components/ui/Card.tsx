// src/components/ui/Card.tsx
'use client';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
};

export default function Card({ children, className = '', ...rest }: Props) {
  return (
    <div
      {...rest}
      // exact card size and border per your figma values
      className={`relative w-[640px] h-[758px] rounded-[30px] border border-[#CCF6E5] bg-white ${className}`}
    >
      {/* inner container adds left/right padding similar to your screenshot */}
      <div className="absolute inset-0 px-[64px] pt-[40px] pb-[32px]">{children}</div>
    </div>
  );
}
