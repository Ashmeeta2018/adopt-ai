import { Button, EmberText, Eyebrow, Hairline, SiteFooter, SiteNav } from '@adopt-ai/ui-web';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Five disciplines, one delivery team that stays on the pager.',
};

const services = [
  {
    num: '01',
    name: 'Workflow Agents',
    price: 'From $2,400 · 2–3 weeks',
    bullets: [
      'One workflow, one agent, integrated with the tools your team already uses',
      'Confidence gating with explicit Slack escalation on uncertainty',
      'Plain-English runbook your team owns after hand-off',
      '90 days of us on the pager included',
    ],
  },
  {
    num: '02',
    name: 'Document & Invoice Intelligence',
    price: 'From $3,600 · 3–4 weeks',
    bullets: [
      'Extracts line items from PDFs, scans, and emailed invoices',
      'Posts straight to QuickBooks, NetSuite, or your ledger of record',
      'Audit trail per invoice — every field traceable to the source',
      'Edge-case review queue so weird vendors do not stop your close',
    ],
  },
  {
    num: '03',
    name: 'Customer Support Router',
    price: 'From $2,800 · 3 weeks',
    bullets: [
      'Reads incoming tickets and routes them to the right human or system',
      'Drafts first-response replies in your tone, never auto-sends',
      'Cuts time-to-first-response by 80%',
      'Plugs into Zendesk, Intercom, Help Scout, or just an inbox',
    ],
  },
  {
    num: '04',
    name: 'Custom Model Fine-tuning',
    price: 'From $12,000 · 8–10 weeks',
    bullets: [
      'For when an off-the-shelf model is not enough',
      'We curate the dataset, run the fine-tunes, deliver the model',
      'Deployed into your account, never on shared infrastructure',
      'A real benchmark on your data before we declare it done',
    ],
  },
  {
    num: '05',
    name: 'Agent Operations',
    price: 'From $149 / mo · Continuous',
    bullets: [
      'We watch the dashboards, you keep shipping',
      'Drift detection on confidence, accuracy, latency',
      'Monthly written report — outcomes, costs, fixes',
      'On-call rotation, real humans, real pager',
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteNav current="services" />
      <section className="relative px-14 py-32">
        <div className="mx-auto max-w-[1280px]">
          <Eyebrow className="mb-5">Services</Eyebrow>
          <h1
            className="max-w-[1080px] font-display"
            style={{ fontSize: 88, letterSpacing: '-0.045em', lineHeight: 0.98 }}
          >
            Five disciplines, one delivery team that{' '}
            <EmberText>stays on the pager.</EmberText>
          </h1>
          <p className="mt-8 max-w-[640px] text-[19px] leading-[1.55] text-ink/65">
            Each engagement starts with a two-week scoping sprint, ships in 4–8 weeks, then
            ninety days of co-operation before hand-off. Fixed-price.
          </p>
        </div>
      </section>

      {services.map((s, i) => (
        <section
          key={s.num}
          className={i % 2 === 0 ? 'bg-paper px-14 py-20' : 'bg-cream px-14 py-20'}
        >
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 md:grid-cols-[1fr_2fr_1fr]">
            <div>
              <div className="font-mono text-eyebrow uppercase tracking-[0.18em] text-accent">
                {s.num}
              </div>
              <h2
                className="mt-3 font-display"
                style={{ fontSize: 44, letterSpacing: '-0.035em', lineHeight: 1.05 }}
              >
                {s.name}
              </h2>
            </div>
            <ul className="space-y-3 text-[17px] leading-[1.6] text-ink/75">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2 inline-block h-1 w-3 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <div className="font-mono text-eyebrow uppercase tracking-[0.18em] text-ink/55">
                {s.price}
              </div>
              <Link href="/book">
                <Button variant="dark">Discuss this</Button>
              </Link>
            </div>
          </div>
          {i < services.length - 1 && <Hairline />}
        </section>
      ))}

      <SiteFooter dark={false} />
    </main>
  );
}
