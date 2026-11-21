import { Button, EmberText, Eyebrow, Hairline, SiteFooter, SiteNav } from '@adopt-ai/ui-web';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Five disciplines, one delivery team that stays on the pager. Plus four monthly packages for local businesses.',
};

interface Service {
  num: string;
  name: string;
  price: string;
  bullets: string[];
}

const services: Service[] = [
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

const localServices: Service[] = [
  {
    num: '01',
    name: 'Local Presence',
    price: '$1,500 setup · $499 / mo',
    bullets: [
      'A fast, mobile-friendly website that you own',
      'Three short videos a month for your site and social accounts',
      'Social posts written and scheduled for you',
      'Google Business Profile filled in and kept current',
    ],
  },
  {
    num: '02',
    name: 'AI Receptionist & Lead Follow-up',
    price: '$2,500 setup · $599 / mo',
    bullets: [
      'Answers the questions customers ask most, in your words',
      'Books appointments straight into your calendar',
      'Follows up with every new lead, so none go cold',
      'For non-medical businesses — patient information needs a different setup',
    ],
  },
  {
    num: '03',
    name: 'Content Engine',
    price: '$750–1,500 / mo · By volume',
    bullets: [
      'Short videos, posts and articles every month, in your voice',
      'Made with AI help, checked by a person before anything goes out',
      'Priced by how much you want each month',
      'A monthly report on what went out and how it did',
    ],
  },
  {
    num: '04',
    name: 'AI Visibility',
    price: '$399–799 / mo',
    bullets: [
      'Google Business Profile complete, accurate and active',
      'Help asking for reviews, and a reply to every one',
      'Your name, address and phone the same on every directory that matters',
      'A monthly check of what ChatGPT, Perplexity and Google say about you',
    ],
  },
];

interface ServiceRowProps {
  service: Service;
  index: number;
  last: boolean;
  heading: 'h2' | 'h3';
}

function ServiceRow({ service, index, last, heading: Heading }: ServiceRowProps) {
  return (
    <section className={index % 2 === 0 ? 'bg-paper px-14 py-20' : 'bg-cream px-14 py-20'}>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 md:grid-cols-[1fr_2fr_1fr]">
        <div>
          <div className="text-eyebrow text-accent font-mono uppercase tracking-[0.18em]">
            {service.num}
          </div>
          <Heading
            className="font-display mt-3"
            style={{ fontSize: 44, letterSpacing: '-0.035em', lineHeight: 1.05 }}
          >
            {service.name}
          </Heading>
        </div>
        <ul className="text-ink/75 space-y-3 text-[17px] leading-[1.6]">
          {service.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="bg-accent mt-2 inline-block h-1 w-3 rounded-full" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="text-eyebrow text-ink/55 font-mono uppercase tracking-[0.18em]">
            {service.price}
          </div>
          <Link href="/book">
            <Button variant="dark">Discuss this</Button>
          </Link>
        </div>
      </div>
      {!last && <Hairline />}
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteNav current="services" />
      <section className="relative px-14 py-32">
        <div className="mx-auto max-w-[1280px]">
          <Eyebrow className="mb-5">Services</Eyebrow>
          <h1
            className="font-display max-w-[1080px]"
            style={{ fontSize: 88, letterSpacing: '-0.045em', lineHeight: 0.98 }}
          >
            Five disciplines, one delivery team that <EmberText>stays on the pager.</EmberText>
          </h1>
          <p className="text-ink/65 mt-8 max-w-[640px] text-[19px] leading-[1.55]">
            Each engagement starts with a two-week scoping sprint, ships in 4–8 weeks, then ninety
            days of co-operation before hand-off. Fixed-price.
          </p>
        </div>
      </section>

      {services.map((s, i) => (
        <ServiceRow
          key={s.name}
          service={s}
          index={i}
          last={i === services.length - 1}
          heading="h2"
        />
      ))}

      <section id="local-business" className="border-hairline scroll-mt-24 border-t px-14 py-28">
        <div className="mx-auto max-w-[1280px]">
          <Eyebrow className="mb-5">Local Business Growth</Eyebrow>
          <h2
            className="font-display max-w-[1080px]"
            style={{ fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1.02 }}
          >
            Run a local business? <EmberText>Get found, get booked.</EmberText>
          </h2>
          <p className="text-ink/65 mt-8 max-w-[640px] text-[19px] leading-[1.55]">
            Four monthly packages for owner-run businesses. Start with one or combine them. You keep
            ownership of your website, your Google Business Profile and every account we set up.
          </p>
        </div>
      </section>

      {localServices.map((s, i) => (
        <ServiceRow
          key={s.name}
          service={s}
          index={i}
          last={i === localServices.length - 1}
          heading="h3"
        />
      ))}

      <SiteFooter dark={false} />
    </main>
  );
}
