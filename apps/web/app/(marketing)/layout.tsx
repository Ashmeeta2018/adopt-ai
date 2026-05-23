import type { Metadata } from 'next';

import { CookieBanner } from '@/components/cookie-banner/CookieBanner';

export const metadata: Metadata = {
  // Marketing pages inherit defaults from the root layout.
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieBanner />
    </>
  );
}
