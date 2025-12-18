'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Convert' },
  { href: '/recipient', label: 'Recipient' },
  { href: '/send', label: 'Send ETH' },
];

export default function PageNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex justify-center">
      <div className="flex gap-2 rounded-full bg-[#F2F2F2] p-1">
        {links.map((l) => {
          const active = pathname === l.href;

          return (
            <Link
              key={l.href}
              href={l.href}
              className={`min-w-[120px] px-4 py-2 text-center rounded-full text-sm font-medium transition ${
                active ? 'bg-accent text-white' : 'text-accent hover:bg-white/70'
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
