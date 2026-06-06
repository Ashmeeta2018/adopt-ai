import { AmbientOrbs, BrandMark, NeuralMesh } from '@adopt-ai/ui-web';

import type { PostFrontmatter } from '@/lib/blog';
import { PostMeta } from './PostMeta';

interface PostHeroProps extends PostFrontmatter {
  /** Omit the hero image (e.g. when a custom image exists). */
  hideImage?: boolean;
}

export function PostHero({
  title,
  date,
  category,
  readMinutes,
  dek,
  hideImage = false,
}: PostHeroProps) {
  return (
    <header className="px-14 pb-16 pt-24">
      <div className="mx-auto max-w-[840px]">
        <PostMeta date={date} category={category} readMinutes={readMinutes} className="mb-5" />
        <h1
          className="font-display font-medium text-ink"
          style={{ fontSize: 56, letterSpacing: '-0.035em', lineHeight: 1.05 }}
        >
          {title}
        </h1>
        <p className="mt-7 max-w-[640px] text-[19px] leading-[1.55] text-ink/65">{dek}</p>
      </div>

      {!hideImage && (
        <div
          className="relative mx-auto mt-14 max-w-[1280px] overflow-hidden rounded-3xl"
          style={{ aspectRatio: '16 / 7' }}
        >
          {/* Ember gradient hero image — matches the blog listing card style */}
          <div className="absolute inset-0 bg-ember-cta" />
          <NeuralMesh dark style={{ position: 'absolute', inset: 0, opacity: 0.35 }} />
          <AmbientOrbs intensity={0.8} dark />
          <div className="absolute inset-0 flex items-center justify-center">
            <BrandMark size={130} withType={false} mono dark />
          </div>
          {/* Chrome label matching the case study treatment */}
          <div className="absolute bottom-6 left-6 font-mono text-eyebrow uppercase tracking-[0.18em] text-cream/65">
            {category} · Adopt AI field notes
          </div>
        </div>
      )}
    </header>
  );
}
