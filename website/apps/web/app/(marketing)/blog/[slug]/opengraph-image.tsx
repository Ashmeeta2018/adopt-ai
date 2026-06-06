/**
 * Per-post OpenGraph image for /blog/[slug].
 *
 * Shows: category eyebrow, post title, read-time badge.
 * Statically generated at build time alongside the post pages via
 * generateStaticParams (inherited from the parent segment).
 */

import { ImageResponse } from 'next/og';

import {
  OGShell,
  OG_WIDTH,
  OG_HEIGHT,
  buildFontOptions,
  loadDisplayFont,
} from '@/lib/og';
import { getAllPostSummaries, getPost } from '@/lib/blog';

export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

// Pre-renders one image per post at build time.
export function generateStaticParams() {
  return getAllPostSummaries().map((p) => ({ slug: p.slug }));
}

export default async function BlogPostOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    // Returning a Response lets Next.js show a 404 for the image URL.
    return new Response('Post not found', { status: 404 });
  }

  const fontData = await loadDisplayFont();
  const fontFamily = fontData ? 'Sora' : 'system-ui';

  const eyebrow = `${post.category} · ${post.readMinutes} min read`;
  const badge = post.category;

  return new ImageResponse(
    <OGShell
      title={post.title}
      eyebrow={eyebrow}
      badge={badge}
      badgeColor="#D9462C"
      fontFamily={fontFamily}
    />,
    {
      ...size,
      fonts: buildFontOptions(fontData),
    },
  );
}
