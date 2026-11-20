import { Button, EmberText, Eyebrow } from '@adopt-ai/ui-web';
import Link from 'next/link';

interface Tile {
  span: string;
  bg: 'ember' | 'obsidian' | 'smoke';
  eyebrow?: string;
  title: string;
  sub?: string;
  meta?: string;
}

const tiles: Tile[] = [
  {
    span: 'md:col-span-3 md:row-span-2',
    bg: 'ember',
    eyebrow: 'Most chosen',
    title:
      'An agent that reads your inbox like a senior ops lead — and routes it where it belongs.',
    meta: 'Spark · from $2,400 · 2 weeks',
  },
  {
    span: 'md:col-span-3',
    bg: 'obsidian',
    title: 'Invoice & document extraction',
    sub: 'Posts straight to QuickBooks / NetSuite',
  },
  {
    span: 'md:col-span-2',
    bg: 'obsidian',
    title: 'Custom AI on your data',
    sub: 'Trained on your tone, your edge cases',
  },
  {
    span: 'md:col-span-1',
    bg: 'smoke',
    title: 'Quality checks',
    sub: 'Tested before launch',
  },
  {
    span: 'md:col-span-3',
    bg: 'obsidian',
    title: 'Customer support triage',
    sub: 'Cuts first-response by 80%',
  },
];

const bgClasses: Record<Tile['bg'], string> = {
  ember: 'bg-ember-cta text-cream shadow-cta border border-[rgba(255,255,255,0.08)]',
  obsidian: 'bg-obsidian text-cream border border-hairline-dark',
  smoke: 'bg-smoke text-cream border border-hairline-dark',
};

export function ServicesBento() {
  return (
    <section className="px-14 py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow tone="glow" className="mb-5">
              What we build
            </Eyebrow>
            <h2
              className="font-display text-cream font-medium"
              style={{ fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1.02 }}
            >
              Five workflows. <EmberText as="span">One small studio.</EmberText>
            </h2>
            <p className="text-cream/65 mt-6 max-w-[560px] text-[17px] leading-[1.6]">
              Pick one workflow eating most of someone&rsquo;s day. We design the agent, connect it
              to the tools you already use, and stay on it for the first 90 days.
            </p>
          </div>
          <Link href="/services">
            <Button variant="ghost" dark>
              See all services
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:auto-rows-[180px] md:grid-cols-6">
          {tiles.map((tile, i) => (
            <article
              key={i}
              className={`relative flex flex-col justify-between rounded-2xl p-7 ${tile.span} ${bgClasses[tile.bg]}`}
            >
              {tile.eyebrow && (
                <div className="text-eyebrow text-cream/85 font-mono uppercase tracking-[0.18em]">
                  {tile.eyebrow}
                </div>
              )}
              <div
                className="font-display font-medium"
                style={{
                  fontSize: tile.bg === 'ember' ? 44 : 28,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}
              >
                {tile.title}
              </div>
              {tile.sub && <p className="text-cream/65 mt-2 text-[15.5px]">{tile.sub}</p>}
              {tile.meta && (
                <div className="text-eyebrow text-cream/85 font-mono uppercase tracking-[0.18em]">
                  {tile.meta}
                </div>
              )}
            </article>
          ))}
        </div>

        <Link
          href="/services#local-business"
          className="bg-obsidian border-hairline-dark text-cream hover:border-accent focus-visible:ring-accent focus-visible:outline-hidden mt-4 flex flex-col gap-4 rounded-2xl border p-7 transition-colors focus-visible:ring-2 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="text-eyebrow text-cream/85 font-mono uppercase tracking-[0.18em]">
              Local Business Growth
            </div>
            <div
              className="font-display mt-3 font-medium"
              style={{ fontSize: 28, letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Run a local business? Website, videos, reviews, and a receptionist that follows up on
              every lead.
            </div>
          </div>
          <div className="text-eyebrow text-cream/85 shrink-0 font-mono uppercase tracking-[0.18em]">
            From $399 / mo →
          </div>
        </Link>
      </div>
    </section>
  );
}
