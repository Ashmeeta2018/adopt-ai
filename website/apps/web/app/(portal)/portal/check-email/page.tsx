import { AmbientOrbs, AmbientRings, BrandMark, Eyebrow, GlassCard } from '@adopt-ai/ui-web';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check your email',
  description: 'We sent a sign-in link to your email address.',
};

export default function CheckEmailPage() {
  return (
    <main className="bg-void text-cream relative min-h-screen overflow-hidden">
      <AmbientOrbs intensity={1} dark />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-85">
        <AmbientRings size={920} dark />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="mb-10 flex flex-col items-center gap-4">
          <BrandMark size={80} withType={false} />
          <Eyebrow tone="glow">Client Portal</Eyebrow>
        </div>

        <GlassCard dark padding={36} className="w-full max-w-[460px]">
          <h1 className="font-display text-cream text-[40px] tracking-[-0.03em]">Check your email.</h1>
          <p className="text-cream/65 mt-3 text-[15px]">
            We sent a sign-in link to your email address. It expires in 10 minutes.
          </p>
          <p className="text-cream/65 mt-2 text-[15px]">
            Didn&apos;t get it? Check your spam folder or{' '}
            <Link href="/portal" className="text-accent underline underline-offset-4">
              try again
            </Link>
            .
          </p>
        </GlassCard>

        <p className="text-eyebrow text-cream/40 mt-12 font-mono uppercase tracking-[0.18em]">
          SOC 2 Type II &middot; ISO 27001 &middot; HIPAA &middot; &copy; 2026 Adopt AI
        </p>
      </div>
    </main>
  );
}
