import type { Metadata, Viewport } from 'next';

import { fontVars } from '@/lib/fonts';

import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Adopt AI — Real automation. Real SMB budgets.',
    template: '%s · Adopt AI',
  },
  description:
    'We design, ship, and run AI agents for small and mid-sized businesses. Fixed price. No per-seat fees. Most projects pay back in under 8 weeks.',
  openGraph: {
    type: 'website',
    siteName: 'Adopt AI',
    url: '/',
    title: 'Adopt AI',
    description:
      'We design, ship, and run AI agents for small and mid-sized businesses. Fixed price. No per-seat fees.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0F0805',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
