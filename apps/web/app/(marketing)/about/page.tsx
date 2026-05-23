import { AmbientOrbs, AmbientRings, BrandMark, EmberText, Eyebrow, SiteFooter, SiteNav } from '@adopt-ai/ui-web';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'A small studio that ships agents. No pilots, no PowerPoints.',
};

const principles = [
  {
    title: 'No pilots',
    body: 'We don’t do six-month explorations. If we can’t ship something useful in eight weeks we won’t take it.',
  },
  {
    title: 'Fixed price',
    body: 'Budget on day one, scope on day one, ship on day one. No timesheets, no scope-creep invoices.',
  },
  {
    title: 'Your VPC',
    body: 'Agents run in your cloud account, with your data, behind your IAM. We never aggregate, we never look.',
  },
  {
    title: 'On the pager',
    body: 'For 90 days post-ship we are on the rotation. Real responsibility, not a hand-wave hand-off.',
  },
  {
    title: 'Quiet over loud',
    body: 'We don’t buy attention. We send a monthly note with what we shipped and what we learned. That is the marketing.',
  },
];

const rightFit = [
  '12–240 people, growing',
  'One workflow eating someone’s day',
  'You can articulate the outcome you want',
  'You will give us read access to the systems involved',
  'You’re tired of demos that don’t survive contact with production',
];

const notFit = [
  'You want a six-month transformation',
  'You want a chatbot for your website',
  'Your IT team won’t let us into a sandbox',
  'You expect a per-seat SaaS license',
  'You want us to also pick your CRM',
];

export default function AboutPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteNav current="about" />

      <section className="relative px-14 py-32">
        <AmbientOrbs intensity={0.3} />
        <div className="relative mx-auto max-w-[1080px]">
          <div className="flex items-center gap-12">
            <BrandMark size={120} withType={false} />
            <AmbientRings size={220} />
          </div>
          <Eyebrow className="mt-12">About</Eyebrow>
          <h1
            className="mt-3 font-display"
            style={{ fontSize: 48, letterSpacing: '-0.035em', lineHeight: 1.05 }}
          >
            <EmberText>A small studio</EmberText> that ships agents.
          </h1>
        </div>
      </section>

      <section className="px-14 py-24">
        <div className="mx-auto max-w-[920px]">
          <Eyebrow className="mb-5">Why we exist</Eyebrow>
          <blockquote
            className="font-editorial italic"
            style={{ fontSize: 44, lineHeight: 1.2, letterSpacing: '-0.015em' }}
          >
            &ldquo;Most AI work in 2025 stops at the demo. We were tired of decks that
            didn&rsquo;t survive contact with production — so we started shipping
            instead.&rdquo;
          </blockquote>
        </div>
      </section>

      <section className="border-t border-hairline bg-paper px-14 py-24">
        <div className="mx-auto max-w-[1280px]">
          <Eyebrow className="mb-5">Five principles</Eyebrow>
          <h2 className="font-display text-[56px] tracking-[-0.035em]">How we work</h2>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-5">
            {principles.map((p) => (
              <div key={p.title}>
                <h3 className="font-display text-[22px]">{p.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-ink/65">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-14 py-32">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-7 md:grid-cols-2">
          <article className="rounded-3xl border border-hairline bg-paper p-10">
            <Eyebrow className="mb-4">Right fit</Eyebrow>
            <h3 className="font-display text-[32px]">When we say yes</h3>
            <ul className="mt-6 space-y-3 text-[15.5px] leading-[1.6] text-ink/75">
              {rightFit.map((r) => (
                <li key={r} className="flex gap-3">
                  <span className="mt-2 inline-block h-1 w-3 rounded-full bg-success" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-3xl border border-hairline bg-ink p-10 text-cream">
            <Eyebrow tone="glow" className="mb-4">
              Not a fit
            </Eyebrow>
            <h3 className="font-display text-[32px]">When we tell you no</h3>
            <ul className="mt-6 space-y-3 text-[15.5px] leading-[1.6] text-cream/65">
              {notFit.map((r) => (
                <li key={r} className="flex gap-3">
                  <span className="mt-2 inline-block h-1 w-3 rounded-full bg-accent" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <SiteFooter dark={false} />
    </main>
  );
}
