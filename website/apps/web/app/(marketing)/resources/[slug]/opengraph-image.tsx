/**
 * Per-resource OpenGraph image for /resources/[slug].
 *
 * Shows: resource type + format eyebrow, resource title, type badge.
 * Badge colour matches the type accent used on the resource listing cards.
 */

import { ImageResponse } from 'next/og';

import {
  OGShell,
  OG_WIDTH,
  OG_HEIGHT,
  buildFontOptions,
  loadDisplayFont,
} from '@/lib/og';
import { getAllResourceSummaries, getResource } from '@/lib/resources';
import type { ResourceType } from '@/lib/resources';

export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

// Pre-renders one image per resource at build time.
export function generateStaticParams() {
  return getAllResourceSummaries().map((r) => ({ slug: r.slug }));
}

/**
 * Hex accent per resource type — mirrors typeAccentClass in lib/resources.ts
 * but as actual hex values for use in ImageResponse inline styles.
 */
const TYPE_ACCENT: Record<ResourceType, string> = {
  Whitepaper: '#D9462C', // accent
  Playbook:   '#E67E22', // glow
  Template:   '#D6912A', // amber
  Talk:       '#2BAE5C', // success
  Code:       '#D9462C', // accent
  Guide:      '#A82A28', // burgundy
};

export default async function ResourceOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) {
    return new Response('Resource not found', { status: 404 });
  }

  const fontData = await loadDisplayFont();
  const fontFamily = fontData ? 'Sora' : 'system-ui';

  const eyebrow = `${resource.type} · ${resource.format}`;
  const badgeColor = TYPE_ACCENT[resource.type] ?? '#D9462C';

  return new ImageResponse(
    <OGShell
      title={resource.title}
      eyebrow={eyebrow}
      badge={resource.type}
      badgeColor={badgeColor}
      fontFamily={fontFamily}
    />,
    {
      ...size,
      fonts: buildFontOptions(fontData),
    },
  );
}
