import { Eyebrow } from '@adopt-ai/ui-web';

const phrases = [
  "The room we're in",
  'Built for teams of 12–240 people',
  'Working with 6 SMB ops teams today',
  'Logistics · healthcare · finops · e-commerce',
] as const;

export function SocialProofStrip() {
  return (
    <div className="border-y border-hairline-dark px-14 py-10">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-x-10 gap-y-3 font-display text-[17px] text-cream/55">
        <Eyebrow tone="glow">In the room</Eyebrow>
        {phrases.map((p, i) => (
          <span key={p} className="flex items-center gap-x-10">
            {i > 0 && <span aria-hidden className="h-3 w-px bg-hairline-dark" />}
            <span>{p}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
