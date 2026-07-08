import { EmberText, Eyebrow } from '@adopt-ai/ui-web';

const steps = [
  {
    num: '01',
    title: 'Discover',
    body: 'Two-week scoping. We sit with whoever is closest to the problem and read the actual emails or invoices or tickets eating their day.',
  },
  {
    num: '02',
    title: 'Build',
    body: 'Three to eight focused weeks. One agent, in your stack, integrated with the tools your team already touches.',
  },
  {
    num: '03',
    title: 'Operate',
    body: '30 to 90 days of us on the pager. Real responsibility, not a hand-wave hand-off. We watch the metrics, we tune.',
  },
  {
    num: '04',
    title: 'Hand off',
    body: 'Plain-English runbooks. The team that lives with it after us actually understands what is running and how to change it.',
  },
];

export function Approach() {
  return (
    <section className="bg-linear-to-b from-void to-obsidian text-cream px-14 py-32">
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow tone="glow" className="mb-5">
          How a project goes
        </Eyebrow>
        <h2
          className="font-display max-w-[1100px] font-medium"
          style={{ fontSize: 56, letterSpacing: '-0.035em', lineHeight: 1.05 }}
        >
          No pilots. No PowerPoints. <EmberText>Just one shipped agent</EmberText> in six weeks or
          less.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-4">
          {steps.map((s) => (
            <article
              key={s.num}
              className="border-accent border-b-hairline-dark border-b border-t-2 pb-10 pt-6"
            >
              <div className="text-eyebrow text-glow font-mono uppercase tracking-[0.18em]">
                {s.num}
              </div>
              <h3
                className="font-display mt-3"
                style={{ fontSize: 32, letterSpacing: '-0.025em', lineHeight: 1.1 }}
              >
                {s.title}
              </h3>
              <p className="text-cream/65 mt-4 text-[15.5px] leading-[1.6]">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
