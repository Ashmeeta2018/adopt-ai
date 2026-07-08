import { AmbientOrbs, Button, EmberText, Eyebrow, SiteFooter, SiteNav } from '@adopt-ai/ui-web';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Fixed-price. Built for SMBs. Real automation, real budgets.',
};

const tiers = [
  {
    name: 'Spark',
    build: '$2,400',
    operate: '+ $149 / mo',
    sub: 'One agent · 2 weeks',
    cta: 'Start a Spark project',
    dark: false,
    flag: null,
  },
  {
    name: 'Lift',
    build: '$5,800',
    operate: '+ $499 / mo',
    sub: 'Up to 3 agents · 5–6 weeks',
    cta: 'Talk to an architect',
    dark: true,
    flag: 'Most chosen',
  },
  {
    name: 'Scale',
    build: 'from $12,000',
    operate: '+ retainer from $799 / mo',
    sub: 'Custom · 8–12 weeks',
    cta: 'Request a scoping call',
    dark: false,
    flag: null,
  },
];

export default function PricingPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteNav current="pricing" />
      <section className="relative px-14 py-32">
        <AmbientOrbs intensity={0.25} />
        <div className="relative mx-auto max-w-[1080px] text-center">
          <Eyebrow className="mb-5">Pricing · Fixed-price · Built for SMBs</Eyebrow>
          <h1
            className="font-display"
            style={{ fontSize: 88, letterSpacing: '-0.045em', lineHeight: 0.98 }}
          >
            Real automation. <EmberText>Real budgets.</EmberText>
          </h1>
        </div>
      </section>

      <section className="px-14 pb-32">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-7 lg:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.name}
              className={
                t.dark
                  ? 'border-hairline-dark bg-ink text-cream relative rounded-3xl border p-8'
                  : 'border-hairline bg-paper relative rounded-3xl border p-8'
              }
            >
              {t.flag && (
                <div className="bg-ember-cta text-eyebrow text-cream absolute -top-3 left-8 rounded-full px-3 py-1 font-mono uppercase tracking-[0.18em]">
                  {t.flag}
                </div>
              )}
              <h3 className="font-display text-[44px] font-medium tracking-tight">{t.name}</h3>
              <div className="font-display mt-6 text-[28px] font-medium">{t.build}</div>
              <div className={t.dark ? 'text-cream/65 mt-1' : 'text-ink/65 mt-1'}>{t.operate}</div>
              <div className={t.dark ? 'text-cream/65 mt-6' : 'text-ink/65 mt-6'}>{t.sub}</div>
              <div className="mt-10">
                <Link href="/book" className="block">
                  <Button variant={t.dark ? 'primary' : 'dark'} className="w-full">
                    {t.cta}
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-hairline border-t px-14 py-24">
        <div className="mx-auto max-w-[1080px] text-center">
          <h2 className="font-display text-[48px] tracking-[-0.035em]">
            The average Spark pays back in under <EmberText>eight weeks</EmberText>.
          </h2>
          <div className="text-eyebrow text-ink/60 mt-10 flex flex-wrap justify-center gap-x-16 gap-y-6 font-mono uppercase tracking-[0.18em]">
            <span>15+ hrs/wk saved</span>
            <span>8 wks avg payback</span>
            <span>$0 per-seat fees</span>
          </div>
        </div>
      </section>

      <SiteFooter dark={false} />
    </main>
  );
}
