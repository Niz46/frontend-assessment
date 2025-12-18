// src/app/page.tsx
import React from 'react';
import ConvertCard from '@components/payments/ConvertCard';
import PageNav from '@components/ui/PageNav';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <PageNav />
      <div className="mx-auto">
        <ConvertCard />
      </div>
    </main>
  );
}
