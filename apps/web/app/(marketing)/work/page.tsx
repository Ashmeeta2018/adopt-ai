import { AmbientOrbs, EmberText, Eyebrow, NeuralMesh, SiteFooter, SiteNav } from '@adopt-ai/ui-web';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Work — Adopt AI',
  description: 'Real agents, real results. Case studies from teams that moved faster by automating the work that slowed them down.',
};

interface CaseCard {
  slug: string;
  caseNumber: string;
  sector: string;
  team: string;
  headline: string;
  headlineAccent: string;
  headlineAfter?: string;
  heroStat: string;
  heroStatLabel: string;
  payback: string;
  chrome: string;
}

const cards: CaseCard[] = [
  {
    slug: 'apex-regional-logistics',
    caseNumber: '0001',
    sector: 'Logistics',
    team: '35 people',
    headline: 'A 35-person logistics team got ',
    headlineAccent: '22 hours a week back',
    headlineAfter: ' — in two weeks.',
    heroStat: '22h',
    heroStatLabel: 'saved per week',
    payback: '6 weeks',
    chrome: 'Inbound coordination · Shipped May 2026',
  },
  {
    slug: 'harlow-reid-advisory',
    caseNumber: '0002',
    sector: 'Professional Services',
    team: '22 people',
    headline: 'A 22-person advisory firm stopped doing ',
    headlineAccent: 'two hours of copy-paste',
    headlineAfter: ' before every client call.',
    heroStat: '40h',
    heroStatLabel: 'saved per week',
    payback: '7 weeks',
    chrome: 'Client data prep · Shipped Apr 2026',
  },
];

export default function WorkPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteNav current="work" />

      <section className="px-14 py-24">
        <div className="mx-auto max-w-[1280px]">
          <Eyebrow className="mb-5">Work</Eyebrow>
          <h1
            className="max-w-[860px] font-display"
            style={{ fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1.0 }}
          >
            Real agents.{' '}
            <EmberText>Real results.</EmberText>
          </h1>
          <p className="mt-6 max-w-[540px] text-[18px] leading-[1.6] text-ink/65">
            Teams that moved faster by automating the work that slowed them down.
            Every case study is a real engagement — two-week build, results in weeks, not quarters.
          </p>
        </div>
      </section>

      <section className="px-14 pb-32">
        <div className="mx-auto max-w-[1280px] space-y-6">
          {cards.map((card) => (
            <Link key={card.slug} href={`/work/${card.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-3xl border border-hairline bg-ink transition-all duration-200 hover:border-accent/40">
                <NeuralMesh dark style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
                <AmbientOrbs intensity={0.5} dark />
                <div className="relative grid grid-cols-1 gap-8 p-10 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="mb-4 flex items-center gap-4">
                      <span className="font-mono text-eyebrow uppercase tracking-[0.22em] text-cream/40">
                        {card.caseNumber}
                      </span>
                      <span className="font-mono text-eyebrow uppercase tracking-[0.22em] text-accent">
                        {card.sector}
                      </span>
                      <span className="font-mono text-eyebrow uppercase tracking-[0.22em] text-cream/40">
                        {card.team}
                      </span>
                    </div>
                    <h2
                      className="max-w-[640px] font-display text-cream"
                      style={{ fontSize: 36, letterSpacing: '-0.03em', lineHeight: 1.1 }}
                    >
                      {card.headline}
                      <EmberText>{card.headlineAccent}</EmberText>
                      {card.headlineAfter ?? ''}
                    </h2>
                    <p className="mt-4 font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/40">
                      {card.chrome}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-6 md:items-end">
                    <div className="text-right">
                      <div
                        className="font-display font-semibold leading-none text-cream"
                        style={{ fontSize: 56, letterSpacing: '-0.04em' }}
                      >
                        {card.heroStat}
                      </div>
                      <div className="mt-1 font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/40">
                        {card.heroStatLabel}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cream/50 transition-colors group-hover:text-accent">
                      Read case study <span className="ml-1">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter dark={false} />
    </main>
  );
}
