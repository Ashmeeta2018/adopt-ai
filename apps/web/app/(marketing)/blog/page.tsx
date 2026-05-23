import {
  AmbientOrbs,
  BrandMark,
  EmberText,
  Eyebrow,
  Hairline,
  NeuralMesh,
  SiteFooter,
  SiteNav,
} from '@adopt-ai/ui-web';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PostMeta } from '@/components/blog/PostMeta';
import { getAllPostSummaries } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Field notes from inside our customer projects.',
};

export default function BlogPage() {
  const posts = getAllPostSummaries();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const recent = posts.filter((p) => p.slug !== featured?.slug).slice(0, 5);

  return (
    <main className="bg-cream text-ink">
      <SiteNav current="blog" />

      <section className="px-14 pb-8 pt-24">
        <div className="mx-auto max-w-[1280px]">
          <Eyebrow className="mb-4">Field notes</Eyebrow>
          <h1
            className="max-w-[1100px] font-display"
            style={{ fontSize: 80, letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            Build logs, mistakes, and the occasional{' '}
            <EmberText>hot take</EmberText>.
          </h1>
        </div>
      </section>

      <section className="px-14 pb-32 pt-10">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-9 lg:grid-cols-[1.5fr_1fr]">
          {/* Featured post */}
          {featured && (
            <article>
              <Link href={`/blog/${featured.slug}`} className="group block">
                <div
                  className="relative overflow-hidden rounded-[18px]"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  <div className="absolute inset-0 bg-ember-cta" />
                  <NeuralMesh dark style={{ position: 'absolute', inset: 0, opacity: 0.35 }} />
                  <AmbientOrbs intensity={0.7} dark />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BrandMark size={120} withType={false} mono dark />
                  </div>
                </div>

                <PostMeta
                  date={featured.date}
                  category={featured.category}
                  readMinutes={featured.readMinutes}
                  className="mb-3 mt-6"
                />
                <h2
                  className="font-display font-medium transition-colors duration-150 group-hover:text-accent"
                  style={{ fontSize: 42, letterSpacing: '-0.03em', lineHeight: 1.05 }}
                >
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-[660px] text-[17px] leading-[1.6] text-ink/65">
                  {featured.dek}
                </p>
              </Link>
            </article>
          )}

          {/* Recent posts sidebar */}
          <aside>
            <Eyebrow className="mb-5">Recent</Eyebrow>
            {recent.map((post, i) => (
              <div key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block py-5">
                  <PostMeta
                    date={post.date}
                    category={post.category}
                    readMinutes={post.readMinutes}
                    className="mb-2"
                  />
                  <h3
                    className="font-display text-[18px] leading-snug tracking-[-0.015em]
                               transition-colors duration-150 group-hover:text-accent"
                  >
                    {post.title}
                  </h3>
                </Link>
                {i < recent.length - 1 && <Hairline />}
              </div>
            ))}
          </aside>
        </div>
      </section>

      <SiteFooter dark={false} />
    </main>
  );
}
