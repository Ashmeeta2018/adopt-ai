import {
  AmbientOrbs,
  BrandMark,
  Button,
  EmberText,
  Eyebrow,
  NeuralMesh,
  SiteFooter,
  SiteNav,
} from '@adopt-ai/ui-web';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CaseStudy {
  slug: string;
  caseNumber: string;
  clientLabel: string;
  headline: string;
  headlineAccent: string;
  headlineAfter?: string;
  sector: string;
  team: string;
  tier: string;
  build: string;
  payback: string;
  chrome: string;
  problemBody: string;
  pullQuote: string;
  pullAttrib: string;
  builtBody: string;
  builtWith: string;
  shapeNote: string;
  metrics: { label: string; value: string; accent?: boolean }[];
  math: { label: string; value: string }[];
  netReturn: string;
  heroVideo?: string;
}

const cases: Record<string, CaseStudy> = {
  'apex-regional-logistics': {
    slug: 'apex-regional-logistics',
    caseNumber: '0001',
    clientLabel: 'Apex Regional Logistics',
    headline: 'A 35-person logistics team got ',
    headlineAccent: '22 hours a week back',
    headlineAfter: ' — in two weeks.',
    sector: 'Logistics',
    team: '35 people',
    tier: 'Spark',
    build: '2 weeks',
    payback: '6 weeks',
    chrome: 'Apex Regional · Inbound coordination · Shipped May 2026',
    problemBody:
      'Three coordinators were drowning in carrier email — 38% YoY growth had outpaced the team. The Director of Ops did not need a chatbot. She needed a dispatcher that could read every message, decide what it was, and route it to the right tool before her people read the second-most-important one.',
    pullQuote: "I didn't want a tool. I wanted my Tuesday back.",
    pullAttrib: 'Director of Operations · Apex Regional',
    builtBody:
      'One agent in front of Outlook and their TMS. Intent classification with a 90% confidence gate, escalation to a Slack channel below threshold, full audit log per message. Two-week build, deployed inside their own AWS account.',
    builtWith: 'Outlook · their TMS · Slack · hosted in their AWS account',
    shapeNote:
      "One agent. One workflow. Two weeks to ship. We don't do six-month transformations.",
    metrics: [
      { label: 'Hours saved / wk', value: '22', accent: true },
      { label: 'Emails / wk', value: '1,540' },
      { label: 'Accuracy', value: '97%' },
      { label: 'Payback', value: '6 wks' },
    ],
    math: [
      { label: 'Spark build', value: '$2,400' },
      { label: '2 months operate ($149 × 2)', value: '$298' },
      { label: 'Total 8 weeks', value: '$2,698' },
      { label: 'Hours reclaimed (22h × 8 wks)', value: '176 hrs' },
      { label: 'Value @ $42/hr', value: '$7,392' },
    ],
    netReturn: '+$4,694',
  },

  'harlow-reid-advisory': {
    slug: 'harlow-reid-advisory',
    caseNumber: '0002',
    clientLabel: 'Harlow & Reid Advisory',
    headline: 'A 22-person advisory firm stopped doing ',
    headlineAccent: 'two hours of copy-paste',
    headlineAfter: ' before every client call.',
    sector: 'Professional Services',
    team: '22 people',
    tier: 'Spark',
    build: '3 weeks',
    payback: '7 weeks',
    chrome: 'Harlow & Reid · Client data prep · Shipped Apr 2026',
    problemBody:
      'Eight senior advisors each managed 15–20 clients across different portals, spreadsheets, and email threads. Every quarterly review started the same way: two hours of manual data-pulling before any real work could happen. The Managing Partner didn\'t want a dashboard. She wanted her best people doing the work only they could do.',
    pullQuote: "The portal sprint used to eat my whole Monday morning. Now my brief is just there.",
    pullAttrib: 'Managing Partner · Harlow & Reid Advisory',
    builtBody:
      'One agent per client data source. It logs into 14 portals on a nightly schedule, pulls the latest figures, normalises the schema, and drops a pre-filled review brief into each client folder in SharePoint — ready before the advisor opens their laptop. Three-week build, deployed on their Azure tenant. No new credentials to manage; it uses each advisor\'s existing SSO.',
    builtWith: 'SharePoint · 14 client portals · Azure hosted',
    shapeNote:
      "One agent. Fourteen portals. Three weeks to ship. We don't do six-month transformations.",
    metrics: [
      { label: 'Hours saved / wk', value: '40', accent: true },
      { label: 'Client portals', value: '14' },
      { label: 'Accuracy', value: '99%' },
      { label: 'Payback', value: '7 wks' },
    ],
    math: [
      { label: 'Spark build', value: '$2,400' },
      { label: '2 months operate ($149 × 2)', value: '$298' },
      { label: 'Total 7 weeks', value: '$2,698' },
      { label: 'Hours reclaimed (40h × 7 wks)', value: '280 hrs' },
      { label: 'Value @ $68/hr (blended advisory rate)', value: '$19,040' },
    ],
    netReturn: '+$16,342',
  },
};

export function generateStaticParams() {
  return Object.keys(cases).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = cases[slug];
  if (!c) {
    return { title: 'Case study' };
  }
  return {
    title: `${c.sector} case study`,
    description: `Adopt AI case study — ${c.sector}, ${c.team}.`,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = cases[slug];
  if (!c) {
    notFound();
  }

  return (
    <main className="bg-cream text-ink">
      <SiteNav current="work" />

      <section className="px-14 py-24">
        <div className="mx-auto max-w-[1280px]">
          <Eyebrow className="mb-5">
            Case study · {c.caseNumber} · {c.clientLabel}
          </Eyebrow>
          <h1
            className="max-w-[1080px] font-display"
            style={{ fontSize: 72, letterSpacing: '-0.04em', lineHeight: 0.98 }}
          >
            {c.headline}
            <EmberText>{c.headlineAccent}</EmberText>
            {c.headlineAfter ?? ''}
          </h1>

          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-hairline pt-8 md:grid-cols-5">
            <Meta label="Sector" value={c.sector} />
            <Meta label="Team size" value={c.team} />
            <Meta label="Tier" value={c.tier} />
            <Meta label="Build" value={c.build} />
            <Meta label="Payback" value={c.payback} />
          </div>
        </div>
      </section>

      <section className="px-14 pb-20">
        <div className="relative mx-auto aspect-[16/6] max-w-[1280px] overflow-hidden rounded-3xl bg-ink">
          {c.heroVideo ? (
            <video
              src={c.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <NeuralMesh dark style={{ position: 'absolute', inset: 0 }} />
              <AmbientOrbs intensity={1} dark />
              <div className="absolute inset-0 flex items-center justify-center">
                <BrandMark size={140} mono dark withType={false} />
              </div>
            </>
          )}
          <div className="absolute bottom-6 left-6 font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/65">
            {c.chrome}
          </div>
        </div>
      </section>

      <section className="border-t border-hairline px-14 py-20">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 md:grid-cols-4">
          {c.metrics.map((m) => (
            <Metric key={m.label} label={m.label} value={m.value} accent={!!m.accent} />
          ))}
        </div>
      </section>

      <section className="px-14 pb-32">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 md:grid-cols-[1fr_2.5fr]">
          <aside className="md:sticky md:top-24 md:self-start">
            <Eyebrow className="mb-4">The shape of it</Eyebrow>
            <p className="text-[15.5px] leading-[1.6] text-ink/65">
              {c.shapeNote}
            </p>
            <div className="my-7 h-px bg-hairline" />
            <div className="font-mono text-eyebrow uppercase tracking-[0.18em] text-ink/55">
              Built with
            </div>
            <p className="mt-2 text-[14px] text-ink/65">
              {c.builtWith}
            </p>
          </aside>

          <div>
            <h2 className="font-display text-[48px] tracking-[-0.035em]">The problem</h2>
            <p className="mt-6 text-[19px] leading-[1.55] text-ink/75">{c.problemBody}</p>

            <blockquote className="my-14 border-l-2 border-accent pl-6">
              <p
                className="font-editorial italic"
                style={{ fontSize: 36, lineHeight: 1.2, letterSpacing: '-0.01em' }}
              >
                &ldquo;{c.pullQuote}&rdquo;
              </p>
              <p className="mt-3 font-mono text-eyebrow uppercase tracking-[0.18em] text-ink/55">
                {c.pullAttrib}
              </p>
            </blockquote>

            <h2 className="font-display text-[48px] tracking-[-0.035em]">What we built</h2>
            <p className="mt-6 text-[19px] leading-[1.55] text-ink/75">{c.builtBody}</p>

            <h2 className="mt-16 font-display text-[48px] tracking-[-0.035em]">The math</h2>
            <table className="mt-8 w-full border-t border-hairline text-left">
              <tbody>
                {c.math.map((row) => (
                  <tr key={row.label} className="border-b border-hairline">
                    <td className="py-4 text-[15px] text-ink/65">{row.label}</td>
                    <td className="py-4 text-right font-mono text-[16px]">{row.value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-5 font-display text-[20px] font-medium">
                    Net return in {c.payback}
                  </td>
                  <td className="py-5 text-right font-display text-[24px] font-medium text-accent">
                    {c.netReturn}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-12">
              <Link href="/book">
                <Button variant="primary">Start a project like this</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter dark={false} />
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-eyebrow uppercase tracking-[0.18em] text-ink/55">
        {label}
      </div>
      <div className="mt-2 font-display text-[20px]">{value}</div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div
        className={
          accent
            ? 'font-display font-semibold text-accent'
            : 'font-display font-semibold text-ink'
        }
        style={{ fontSize: 48, letterSpacing: '-0.035em', lineHeight: 1 }}
      >
        {value}
      </div>
      <div className="mt-3 font-mono text-eyebrow uppercase tracking-[0.18em] text-ink/55">
        {label}
      </div>
    </div>
  );
}
