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
    title: 'An agent that reads your inbox like a senior ops lead — and routes it where it belongs.',
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
  ember:
    'bg-ember-cta text-[#fff8f0] shadow-cta border border-[rgba(255,255,255,0.08)]',
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
              className="font-display font-medium text-cream"
              style={{ fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1.02 }}
            >
              Five workflows.{' '}
              <EmberText as="span">One small studio.</EmberText>
            </h2>
            <p className="mt-6 max-w-[560px] text-[17px] leading-[1.6] text-cream/65">
              Pick one workflow eating most of someone&rsquo;s day. We design the agent,
              connect it to the tools you already use, and stay on it for the first 90 days.
            </p>
          </div>
          <Link href="/services">
            <Button variant="ghost" dark>
              See all services
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[180px]">
          {tiles.map((tile, i) => (
            <article
              key={i}
              className={`relative flex flex-col justify-between rounded-2xl p-7 ${tile.span} ${bgClasses[tile.bg]}`}
            >
              {tile.eyebrow && (
                <div className="font-mono text-eyebrow uppercase tracking-[0.18em] text-[#fff8f0]/85">
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
              {tile.sub && (
                <p className="mt-2 text-[15.5px] text-cream/65">{tile.sub}</p>
              )}
              {tile.meta && (
                <div className="font-mono text-eyebrow uppercase tracking-[0.18em] text-[#fff8f0]/85">
                  {tile.meta}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
