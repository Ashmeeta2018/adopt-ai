/**
 * Shared utilities for opengraph-image.tsx route handlers.
 *
 * Font strategy: fetch Sora Medium from Google Fonts on first render, cache the
 * ArrayBuffer for the lifetime of the serverless instance. Falls back to
 * system-ui if the fetch fails so OG images never 500.
 */

import type { ReactElement } from 'react';

// ── Constants ─────────────────────────────────────────────────

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Brand colours — duplicated here so this file is self-contained
// (cannot import from packages/tokens inside an edge-compatible module).
const C = {
  cream: '#F8F4EE',
  ink: '#3D1A0F',
  void: '#0F0805',
  obsidian: '#1A0F08',
  smoke: '#241510',
  burgundy: '#A82A28',
  accent: '#D9462C',
  glow: '#E67E22',
  amber: '#D6912A',
} as const;

// ── Font loading ──────────────────────────────────────────────

/** Module-level cache — lives for the lifetime of the serverless instance. */
let _fontCache: ArrayBuffer | null | undefined = undefined;

async function fetchDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    // Step 1: ask Google Fonts for the CSS that includes the font file URL.
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Sora:wght@500&display=block',
      {
        headers: {
          // Desktop UA → Google returns WOFF2, which Satori (next/og) supports.
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 86400 }, // Next.js data cache: refresh once per day
      },
    ).then((r) => r.text());

    // Step 2: extract the font binary URL from the CSS response.
    const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
    if (!match?.[1]) throw new Error('Font URL not found in Google Fonts CSS');

    // Step 3: download the font data.
    return await fetch(match[1], { next: { revalidate: 86400 } }).then((r) =>
      r.arrayBuffer(),
    );
  } catch (err) {
    // Non-fatal: OG images fall back to system-ui.
    console.warn('[og] Sora font unavailable, falling back to system-ui:', err);
    return null;
  }
}

/**
 * Returns the Sora Medium font binary (cached after first call).
 * Returns null when the CDN is unreachable — callers must handle that.
 */
export async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  if (_fontCache !== undefined) return _fontCache;
  _fontCache = await fetchDisplayFont();
  return _fontCache;
}

/** Builds the `fonts` option array for `new ImageResponse(...)`. */
export function buildFontOptions(
  data: ArrayBuffer | null,
): { name: string; data: ArrayBuffer; weight: 500; style: 'normal' }[] {
  if (!data) return [];
  return [{ name: 'Sora', data, weight: 500, style: 'normal' }];
}

// ── Title sizing ───────────────────────────────────────────────

/** Picks a font-size that keeps the title on ≤ 3 lines at 1200px wide. */
export function titleFontSize(title: string): number {
  if (title.length <= 30) return 80;
  if (title.length <= 50) return 68;
  if (title.length <= 70) return 56;
  if (title.length <= 90) return 46;
  return 38;
}

// ── OGShell — the shared canvas ───────────────────────────────

interface OGShellProps {
  /** Main headline — the post title or resource title. */
  title: string;
  /** Mono eyebrow above the title — e.g. "Engineering · 8 min read". */
  eyebrow: string;
  /** Small badge shown at bottom-left — e.g. "Playbook". */
  badge?: string;
  /** Accent colour for the badge dot and eyebrow text. */
  badgeColor?: string;
  /**
   * Font-family string. Pass 'Sora' when the font data was loaded
   * successfully; otherwise 'system-ui' is used as a fallback.
   */
  fontFamily?: string;
}

/**
 * The shared visual shell for all OG images.
 *
 * Produces a 1200×630 dark ember canvas with:
 *   - Two ambient radial glows (top-right orange, bottom-left red)
 *   - Brand mark (ember square + "ADOPT AI" wordmark)
 *   - Eyebrow + title content area (vertically centred)
 *   - Footer: optional badge + "adoptai.com"
 */
export function OGShell({
  title,
  eyebrow,
  badge,
  badgeColor = C.accent,
  fontFamily = 'system-ui',
}: OGShellProps): ReactElement {
  const fs = titleFontSize(title);

  return (
    <div
      style={{
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        // Dark ember gradient — smoke → obsidian → smoke → burgundy
        background: `linear-gradient(135deg, ${C.void} 0%, ${C.obsidian} 35%, ${C.smoke} 68%, ${C.burgundy} 100%)`,
        padding: '56px 72px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient glow 1 — upper-right ember */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -60,
          width: 560,
          height: 560,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(230,126,34,0.30) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />
      {/* ── Ambient glow 2 — lower-left red */}
      <div
        style={{
          position: 'absolute',
          bottom: -120,
          left: '30%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(217,70,44,0.22) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Brand mark ──────────────────────────────────────── */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 1 }}
      >
        {/* Ember square mark */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${C.accent}, ${C.glow})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: C.cream,
              fontSize: 17,
              fontWeight: 700,
              fontFamily,
            }}
          >
            A
          </span>
        </div>
        {/* Wordmark */}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(248,244,238,0.55)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          ADOPT AI
        </span>
      </div>

      {/* ── Content (vertically centred) ────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          paddingRight: 96,
          zIndex: 1,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 15,
            fontWeight: 500,
            color: `rgba(230,126,34,0.88)`,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          {eyebrow}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily,
            fontSize: fs,
            fontWeight: 500,
            color: C.cream,
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
          }}
        >
          {title}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {/* Badge (optional) */}
        {badge ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(248,244,238,0.07)',
              border: '1px solid rgba(248,244,238,0.10)',
              borderRadius: 6,
              padding: '5px 12px',
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: badgeColor,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                color: 'rgba(248,244,238,0.50)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              {badge}
            </span>
          </div>
        ) : (
          <div />
        )}

        {/* Domain */}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            color: 'rgba(248,244,238,0.28)',
            letterSpacing: '0.10em',
          }}
        >
          adoptai.com
        </span>
      </div>
    </div>
  );
}
