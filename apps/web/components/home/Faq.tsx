import { Eyebrow, Hairline } from '@adopt-ai/ui-web';

const qa = [
  {
    q: 'How do you keep our data safe?',
    a: 'Your data stays in your cloud. We deploy into your VPC or your own account, and the agent only ever touches the systems you give it credentials for.',
  },
  {
    q: "What happens if it doesn't work?",
    a: 'We will tell you before we take the project. If we cannot show you the math on how it pays back in eight weeks or less, we will not start.',
  },
  {
    q: 'Can we cancel?',
    a: 'Yes. Operate fees are month-to-month with thirty days notice. Build is a fixed price, paid against milestones.',
  },
  {
    q: 'Do you sell software or services?',
    a: 'We build agents that live in your stack. There is no SaaS license, no per-seat fee, no platform tax.',
  },
  {
    q: 'How small a team can use this?',
    a: 'We work with teams from twelve to two hundred and forty people. Smaller than that, an off-the-shelf tool is usually a better answer — we will say so.',
  },
  {
    q: 'What if our edge case is too weird?',
    a: 'That is usually where the value is. Weird is fine — bring it on the call.',
  },
];

export function Faq() {
  return (
    <section className="bg-void px-14 py-32 text-cream">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 md:grid-cols-[1fr_1.5fr]">
        <div>
          <Eyebrow tone="glow" className="mb-5">
            Honest answers
          </Eyebrow>
          <h2
            className="font-display"
            style={{ fontSize: 56, letterSpacing: '-0.035em', lineHeight: 1.05 }}
          >
            The questions every small team asks us first.
          </h2>
          <p className="mt-6 max-w-[380px] text-[17px] leading-[1.6] text-cream/65">
            We will not dodge any of these on a sales call either. If you have a sharper
            version of one of them, bring it.
          </p>
        </div>

        <div>
          {qa.map((row, i) => (
            <div key={row.q}>
              <div className="py-6">
                <h3 className="font-display text-[22px] leading-[1.18] tracking-[-0.02em]">
                  {row.q}
                </h3>
                <p className="mt-3 max-w-[640px] text-[15.5px] leading-[1.6] text-cream/65">
                  {row.a}
                </p>
              </div>
              {i < qa.length - 1 && <Hairline dark />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
