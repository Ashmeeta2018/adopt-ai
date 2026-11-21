import {
  AmbientOrbs,
  BrandMark,
  Button,
  Eyebrow,
  NeuralMesh,
  SiteFooter,
  SiteNav,
} from '@adopt-ai/ui-web';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

import type { Metadata } from 'next';

import { RelatedResources } from '@/components/resources/RelatedResources';
import { ResourceCta } from '@/components/resources/ResourceCta';
import { getAllResourceSummaries, getRelatedResources, getResource } from '@/lib/resources';
import { typeAccentClass } from '@/lib/resources';

// ── Static generation ─────────────────────────────────────────

export function generateStaticParams() {
  return getAllResourceSummaries().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return { title: 'Resource not found' };

  return {
    title: resource.title,
    description: resource.dek,
    openGraph: {
      type: 'article',
      title: resource.title,
      description: resource.dek,
      publishedTime: resource.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
      description: resource.dek,
    },
  };
}

// ── MDX component overrides ───────────────────────────────────

const mdxComponents = {
  a: ({
    href,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  },
} as const;

// ── Page ──────────────────────────────────────────────────────

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) {
    notFound();
  }

  const related = getRelatedResources(slug, 3);
  const accentClass = typeAccentClass[resource.type];

  const { content } = await compileMDX({
    source: resource.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'github-dark-dimmed',
              keepBackground: false,
              defaultLang: { block: 'typescript', inline: 'typescript' },
            },
          ],
        ],
      },
    },
  });

  return (
    <main className="bg-cream text-ink">
      <SiteNav current="resources" />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="px-14 pb-14 pt-24">
        <div className="mx-auto max-w-[840px]">
          <div className={`text-eyebrow mb-4 font-mono uppercase tracking-[0.18em] ${accentClass}`}>
            {resource.type} · {resource.format}
          </div>
          <h1
            className="font-display text-ink font-medium"
            style={{ fontSize: 56, letterSpacing: '-0.035em', lineHeight: 1.05 }}
          >
            {resource.title}
          </h1>
          <p className="text-ink/65 mt-6 max-w-[600px] text-[19px] leading-[1.55]">
            {resource.dek}
          </p>

          {/* Primary CTA — visible at the top for downloads and external links */}
          <div className="mt-9">
            <ResourceCta
              type={resource.type}
              downloadLabel={resource.downloadLabel}
              downloadUrl={resource.downloadUrl}
              externalLabel={resource.externalLabel}
              externalUrl={resource.externalUrl}
            />
          </div>
        </div>

        {/* Ember hero card */}
        <div
          className="relative mx-auto mt-14 max-w-[1280px] overflow-hidden rounded-3xl"
          style={{ aspectRatio: '16 / 6' }}
        >
          <div className="bg-ember-cta absolute inset-0" />
          <NeuralMesh dark style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
          <AmbientOrbs intensity={0.7} dark />
          <div className="absolute inset-0 flex items-center justify-center">
            <BrandMark size={120} withType={false} mono dark />
          </div>
          <div className="text-eyebrow text-cream/60 absolute bottom-6 left-6 font-mono uppercase tracking-[0.18em]">
            {resource.type} · Adopt AI
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="px-14 pb-32">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 lg:grid-cols-[1fr_280px]">
          {/* Prose */}
          <article className="prose max-w-none">
            {content}

            {/* Inline CTA at the bottom of the content */}
            <hr />
            <div className="not-prose mt-10 flex flex-wrap items-center gap-4">
              <ResourceCta
                type={resource.type}
                downloadLabel={resource.downloadLabel}
                downloadUrl={resource.downloadUrl}
                externalLabel={resource.externalLabel}
                externalUrl={resource.externalUrl}
              />
              <Link href="/resources">
                <Button variant="ghost">← All resources</Button>
              </Link>
            </div>
          </article>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {/* Resource card */}
            <div className="border-hairline bg-paper shadow-card-light rounded-2xl border p-6">
              <Eyebrow className="mb-3">This resource</Eyebrow>
              <div
                className={`mt-2 font-mono text-[11px] uppercase tracking-[0.18em] ${accentClass}`}
              >
                {resource.type}
              </div>
              <h3 className="font-display mt-2 text-[17px] leading-snug">{resource.title}</h3>
              <div className="bg-hairline my-5 h-px" />
              <ResourceCta
                type={resource.type}
                downloadLabel={resource.downloadLabel}
                downloadUrl={resource.downloadUrl}
                externalLabel={resource.externalLabel}
                externalUrl={resource.externalUrl}
                stack
              />
            </div>

            {/* Project CTA */}
            <div className="border-hairline bg-paper mt-6 rounded-2xl border p-6">
              <Eyebrow className="mb-3">Ready to build?</Eyebrow>
              <p className="text-ink/60 text-[13px] leading-[1.55]">
                Fixed price. No per-seat fees. Most projects pay back in under 8 weeks.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link href="/book">
                  <Button variant="primary" className="w-full">
                    Start a project
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost" className="w-full">
                    See pricing
                  </Button>
                </Link>
              </div>
            </div>

            {/* Related resources */}
            {related.length > 0 && (
              <div className="mt-8">
                <RelatedResources resources={related} />
              </div>
            )}
          </aside>
        </div>
      </div>

      <SiteFooter dark={false} />
    </main>
  );
}
