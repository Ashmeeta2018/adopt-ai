import type { CSSProperties } from 'react';

import { cn } from '../utils/cn';

interface BrandMarkProps {
  size?: number;
  /** Show the "ADOPT AI" wordmark next to (or below when stacked) the mark. */
  withType?: boolean;
  /** Show the tagline under the wordmark. */
  tagline?: boolean;
  /** True on dark surfaces — adjusts wordmark colour. Mark itself adapts via `mono`. */
  dark?: boolean;
  /** Use the mono variant of the mark (no gradient). */
  mono?: boolean;
  /** Stack wordmark below the mark instead of beside it. Wordmark is 3/4 the normal size. */
  stacked?: boolean;
  /** Override the gap (px) between mark and wordmark. Defaults to size * 0.2 (row) or size * 0.15 (stacked). */
  gap?: number;
  /** Path prefix where the logo PNGs live. Defaults to `/brand`. */
  assetBase?: string;
  className?: string;
  style?: CSSProperties;
}

export function BrandMark({
  size = 36,
  withType = true,
  tagline = false,
  dark = false,
  mono = false,
  stacked = false,
  gap,
  assetBase = '/brand',
  className,
  style,
}: BrandMarkProps) {
  const src = mono
    ? `${assetBase}/${dark ? 'adopt-ai-mark-cream.png' : 'adopt-ai-mark-ink.png'}`
    : `${assetBase}/adopt-ai-mark.png`;

  const resolvedGap = gap ?? (stacked ? size * 0.08 : size * 0.2);
  const wordmarkFontSize = stacked ? size * 0.105 : size * 0.42;

  return (
    <div
      className={cn(
        'inline-flex',
        stacked ? 'flex-col items-center' : 'items-center',
        className,
      )}
      style={{ gap: resolvedGap, ...style }}
    >
      <img
        src={src}
        alt="Adopt AI"
        width={size}
        height={Math.round((size * 624) / 1024)}
        draggable={false}
        className="block select-none object-contain"
      />
      {withType && (
        <div className="flex flex-col" style={{ lineHeight: 1 }}>
          <div
            className={cn(
              'inline-flex font-display font-bold uppercase tracking-[0.18em]',
              dark ? 'text-cream' : 'text-ink',
            )}
            style={{ fontSize: wordmarkFontSize, gap: wordmarkFontSize * 0.43 }}
          >
            <span>ADOPT</span>
            <span className="bg-ember bg-clip-text text-transparent">AI</span>
          </div>
          {tagline && (
            <div
              className={cn(
                'font-mono uppercase tracking-[0.18em]',
                dark ? 'text-cream/55' : 'text-ink/55',
              )}
              style={{ fontSize: size * 0.21, marginTop: size * 0.18 }}
            >
              Turn AI into your advantage
            </div>
          )}
        </div>
      )}
    </div>
  );
}
