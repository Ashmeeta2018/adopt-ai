import Link from 'next/link';

import {
  AgentPill,
  AmbientOrbs,
  AmbientRings,
  Button,
  EmberText,
  Eyebrow,
  FloatingChip,
} from '@adopt-ai/ui-web';

export function HeroCinematic() {
  return (
    <section className="relative overflow-hidden px-[72px] pb-[108px] pt-[72px] md:min-h-[820px]">
      <AmbientOrbs intensity={1} dark />

      {/* Concentric rings centered behind the headline */}
      <div className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 opacity-85">
        <AmbientRings size={920} dark />
      </div>

      {/* Secondary reverse-spinning ring */}
      <div
        className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 animate-ring-spin-reverse"
        style={{ width: 640, height: 640 }}
      >
        <svg viewBox="0 0 200 200" width={640} height={640}>
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="rgba(230,126,34,0.18)"
            strokeWidth="0.4"
            strokeDasharray="1 6"
          />
        </svg>
      </div>

      <FloatingChip x="14%" y="22%" rot={-4} dark>
        <span aria-hidden>📨</span> 14k carrier emails routed last week
      </FloatingChip>
      <FloatingChip x="74%" y="18%" rot={3} delay={1.5} dark>
        <span aria-hidden>⚡</span> most replies in under a second
      </FloatingChip>
      <FloatingChip x="10%" y="68%" rot={-2} delay={2.5} dark>
        <span aria-hidden>🔒</span> SOC 2 · your data stays in your cloud
      </FloatingChip>
      <FloatingChip x="78%" y="68%" rot={4} delay={3.5} dark>
        <span aria-hidden>💰</span> $3.7k saved this week · Apex Logistics
      </FloatingChip>

      <div className="relative mx-auto mt-10 max-w-[1080px] text-center">
        <Eyebrow tone="glow" className="mb-8">
          Adopt AI — automation for growing teams
        </Eyebrow>

        <h1
          className="font-display font-semibold text-cream"
          style={{ fontSize: 124, letterSpacing: '-0.055em', lineHeight: 0.92 }}
        >
          <div>Real automation.</div>
          <EmberText as="div">Real SMB budgets.</EmberText>
        </h1>

        <p className="mx-auto mt-9 max-w-[620px] text-[21px] leading-[1.5] text-cream/70">
          We design, ship, and run AI agents for small and mid-sized businesses. Fixed price.
          No per-seat fees. Most projects pay back in under 8 weeks.
        </p>

        <div className="mt-11 flex flex-wrap justify-center gap-3.5">
          <Link href="/book">
            <Button variant="primary" size="lg">
              Start a project
            </Button>
          </Link>
          <Button
            variant="ghost"
            dark
            size="lg"
            trailingIcon={<span className="ml-1.5">↓</span>}
          >
            Watch the reel
          </Button>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <AgentPill label="6 SMB teams live" dark />
          <AgentPill label="$0 per-seat fees" status="queue" dark />
          <AgentPill label="Cancel monthly anytime" dark />
        </div>
      </div>
    </section>
  );
}
