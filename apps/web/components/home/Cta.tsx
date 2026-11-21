import { AmbientOrbs, Button, EmberText, Eyebrow } from '@adopt-ai/ui-web';
import Link from 'next/link';

export function Cta() {
  return (
    <section className="bg-void text-cream relative overflow-hidden px-14 py-32">
      <AmbientOrbs intensity={0.7} dark />
      <div className="relative mx-auto max-w-[920px] text-center">
        <Eyebrow tone="glow" className="mb-6">
          Ready when you are
        </Eyebrow>
        <h2
          className="font-display"
          style={{ fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1.02 }}
        >
          Pick one workflow. <EmberText>We&rsquo;ll handle the rest.</EmberText>
        </h2>
        <p className="text-cream/70 mx-auto mt-7 max-w-[640px] text-[19px] leading-[1.55]">
          A 30-minute call. We&rsquo;ll tell you whether what you&rsquo;re after is a fit, what it
          would cost, and roughly how long it would take. No deck, no pitch.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Link href="/book">
            <Button variant="primary" size="lg">
              Book a 30-min call
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" dark size="lg">
              See pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
