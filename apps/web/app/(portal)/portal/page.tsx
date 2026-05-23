import { AmbientOrbs, AmbientRings, BrandMark, Eyebrow } from '@adopt-ai/ui-web';
import type { Metadata } from 'next';

import { PortalLoginCard } from '@/components/portal/PortalLoginCard';

export const metadata: Metadata = {
  title: 'Client Portal',
  description: 'Sign in to monitor your agents, runs, and weekly reports.',
};

export default function PortalLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-void text-cream">
      <AmbientOrbs intensity={1} dark />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-85">
        <AmbientRings size={920} dark />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="mb-10 flex flex-col items-center gap-4">
          <BrandMark size={80} withType={false} />
          <Eyebrow tone="glow">Client Portal</Eyebrow>
        </div>

        <PortalLoginCard />

        <p className="mt-12 font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/40">
          SOC 2 Type II · ISO 27001 · HIPAA · © 2026 Adopt AI
        </p>
      </div>
    </main>
  );
}
