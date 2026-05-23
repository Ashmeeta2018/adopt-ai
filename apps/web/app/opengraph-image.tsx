/**
 * Default OpenGraph image — used by any route that doesn't have its own
 * opengraph-image.tsx closer to the route segment.
 *
 * Covers: /, /pricing, /services, /about, /work, /resources, /blog, /book, /contact
 */

import { ImageResponse } from 'next/og';

import {
  OGShell,
  OG_WIDTH,
  OG_HEIGHT,
  buildFontOptions,
  loadDisplayFont,
} from '@/lib/og';

export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function DefaultOGImage() {
  const fontData = await loadDisplayFont();
  const fontFamily = fontData ? 'Sora' : 'system-ui';

  return new ImageResponse(
    <OGShell
      title="Real automation. Real SMB budgets."
      eyebrow="Adopt AI · AI Automation Agency"
      badge="Fixed price · No per-seat fees"
      badgeColor="#2BAE5C"
      fontFamily={fontFamily}
    />,
    {
      ...size,
      fonts: buildFontOptions(fontData),
    },
  );
}
