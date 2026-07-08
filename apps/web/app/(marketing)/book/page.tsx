import { AmbientOrbs, Eyebrow, SiteFooter, SiteNav } from '@adopt-ai/ui-web';

import type { Metadata } from 'next';

import { CalEmbed } from '@/components/book/CalEmbed';

export const metadata: Metadata = {
  title: 'Book a call — Adopt AI',
  description:
    "A 30-minute working session. We'll tell you whether what you're after is a fit, what it would cost, and roughly how long it would take. No deck, no pitch.",
};

export default function BookPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteNav />

      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-14 pb-16 pt-28">
        <AmbientOrbs intensity={0.2} />
        <div className="relative mx-auto max-w-[720px] text-center">
          <Eyebrow className="mb-4">30 minutes · No deck</Eyebrow>
          <h1
            className="font-display text-ink font-medium"
            style={{ fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1.03 }}
          >
            Let&rsquo;s talk about your workflow.
          </h1>
          <p className="text-ink/65 mx-auto mt-6 max-w-[540px] text-[19px] leading-[1.55]">
            We&rsquo;ll tell you whether what you&rsquo;re after is a fit, what it would cost, and
            roughly how long it would take. One conversation, no follow-up unless you ask.
          </p>

          {/* Three trust chips */}
          <div className="text-eyebrow text-ink/45 mt-8 flex flex-wrap justify-center gap-3 font-mono uppercase tracking-[0.18em]">
            <span className="border-hairline bg-paper rounded-full border px-4 py-1.5">
              Fixed price · no surprises
            </span>
            <span className="border-hairline bg-paper rounded-full border px-4 py-1.5">
              8 wk avg payback
            </span>
            <span className="border-hairline bg-paper rounded-full border px-4 py-1.5">
              $0 per-seat fees
            </span>
          </div>
        </div>
      </section>

      {/* ── Cal.com embed ─────────────────────────────────────────── */}
      <section className="px-14 pb-32">
        <div className="mx-auto max-w-[1080px]">
          {/* Container height keeps the widget fully visible without scrolling. */}
          <div
            className="border-hairline bg-paper shadow-card-light overflow-hidden rounded-3xl border"
            style={{ minHeight: 700 }}
          >
            <CalEmbed />
          </div>

          <p className="text-eyebrow text-ink/35 mt-6 text-center font-mono uppercase tracking-[0.18em]">
            Prefer async? &nbsp;
            <a href="/contact" className="hover:text-accent underline decoration-dotted">
              Send a message instead
            </a>
          </p>
        </div>
      </section>

      <SiteFooter dark={false} />
    </main>
  );
}
