import { BrandMark, Button, Eyebrow, SiteFooter, SiteNav } from '@adopt-ai/ui-web';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

import { getAllPostSummaries, getPost, getRelatedPosts } from '@/lib/blog';
import { PostHero } from '@/components/blog/PostHero';
import { RelatedPosts } from '@/components/blog/RelatedPosts';

// ── Static generation ─────────────────────────────────────────

export async function generateStaticParams() {
  return getAllPostSummaries().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Post not found' };

  return {
    title: post.title,
    description: post.dek,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.dek,
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.dek,
    },
  };
}

// ── MDX component overrides ───────────────────────────────────
// The prose wrapper handles most typography. These overrides handle
// elements that need Adopt AI-specific treatments beyond CSS.

const mdxComponents = {
  // Callout blockquote — retains the editorial italic treatment via CSS.
  // No overrides needed; the prose CSS handles it.

  // Linked headings aren't needed at post length, but anchors could be
  // added here later: h2: (props) => <h2 id={...} {...props} />.

  // External links open in a new tab.
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(slug, 3);

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              // "houston" is a deep dark theme that complements the ember palette.
              // Alternatives: 'github-dark-dimmed', 'poimandres', 'one-dark-pro'
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
      <SiteNav current="blog" />

      <PostHero
        title={post.title}
        date={post.date}
        category={post.category}
        readMinutes={post.readMinutes}
        dek={post.dek}
      />

      {/* ── Two-column body ─────────────────────────────────── */}
      <div className="px-14 pb-32">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 lg:grid-cols-[1fr_300px]">

          {/* Main prose */}
          <article
            className="prose max-w-none"
            /* suppress Tailwind's default max-width on .prose */
          >
            {content}

            {/* Post footer */}
            <hr />
            <div className="not-prose mt-10 flex flex-wrap items-center gap-4">
              <Link href="/book">
                <Button variant="primary">Book a 30-min call</Button>
              </Link>
              <Link href="/blog">
                <Button variant="ghost">← All field notes</Button>
              </Link>
            </div>
          </article>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-hairline bg-paper p-7 shadow-card-light">
              {/* Brand mark */}
              <div className="mb-5 flex justify-center">
                <BrandMark size={40} withType={false} />
              </div>

              <Eyebrow className="mb-3 text-center">Adopt AI</Eyebrow>
              <p className="text-center text-[13px] leading-[1.55] text-ink/60">
                We build AI agents for small and mid-sized businesses. Fixed price. No per-seat fees.
              </p>

              <div className="my-6 h-px bg-hairline" />

              <Link href="/book" className="block">
                <Button variant="primary" className="w-full">
                  Start a project
                </Button>
              </Link>
              <Link href="/pricing" className="mt-3 block">
                <Button variant="ghost" className="w-full">
                  See pricing
                </Button>
              </Link>
            </div>

            {/* Related posts — pushed below the card */}
            {related.length > 0 && (
              <div className="mt-10">
                <RelatedPosts posts={related} />
              </div>
            )}
          </aside>
        </div>
      </div>

      <SiteFooter dark={false} />
    </main>
  );
}
