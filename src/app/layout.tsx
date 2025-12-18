// src/app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import PageNav from '@components/ui/PageNav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Frontend Assessment',
  description: 'Crypto checkout flow UI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* black background + centered container used by all pages */}
        <main className="min-h-screen bg-black flex items-center justify-center p-6">
          {/* The white rounded parent container that holds the shared PageNav */}
          <div>
            {/* Parent navbar for all pages */}
            <PageNav />

            {/* Page content will render below the navbar */}
            <div className="mt-6">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}
