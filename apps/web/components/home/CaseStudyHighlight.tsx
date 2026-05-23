import { AmbientOrbs, BrandMark, Button, EmberText, Eyebrow, Metric, NeuralMesh } from '@adopt-ai/ui-web';
import Link from 'next/link';

export function CaseStudyHighlight() {
  return (
    <section className="border-t border-hairline-dark bg-void px-14 py-32 text-cream">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <Eyebrow tone="glow" className="mb-5">
            Case · 0001 / Apex Regional Logistics
          </Eyebrow>
          <p
            className="font-editorial italic text-cream"
            style={{ fontSize: 72, letterSpacing: '-0.02em', lineHeight: 1.05 }}
          >
            &ldquo;I didn&rsquo;t want a tool. I wanted my <EmberText>Tuesday back.</EmberText>&rdquo;
          </p>
          <p className="mt-6 font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/55">
            Director of Operations · Apex Regional Logistics
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-hairline-dark pt-10">
            <Metric value="14k" label="emails routed / wk" dark accent />
            <Metric value="118h" label="hours reclaimed" dark />
            <Metric value="6 wks" label="payback period" dark />
          </div>

          <Link href="/work/apex-regional-logistics" className="mt-12 inline-block">
            <Button variant="dark">Read the build log</Button>
          </Link>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-hairline-dark">
          <NeuralMesh dark style={{ position: 'absolute', inset: 0 }} />
          <AmbientOrbs intensity={0.7} dark />
          <div className="absolute inset-0 flex items-center justify-center">
            <BrandMark size={120} withType={false} mono dark />
          </div>
          <div className="absolute left-6 top-6 font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/70">
            Apex-Log · Sprint 04 · Build log
          </div>
          <div className="absolute bottom-6 left-6 flex items-center gap-3 font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/70">
            <span className="h-2 w-2 animate-agent-pulse rounded-full bg-accent" /> Live ·
            Rec 03:42 / 09:18
          </div>
        </div>
      </div>
    </section>
  );
}
