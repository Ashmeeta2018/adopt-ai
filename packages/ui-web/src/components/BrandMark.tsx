import type { CSSProperties } from 'react';

import { cn } from '../utils/cn';

interface BrandMarkProps {
  size?: number;
  /** Show the "ADOPT AI" wordmark next to the mark. */
  withType?: boolean;
  /** Show the tagline under the wordmark. */
  tagline?: boolean;
  /** True on dark surfaces — adjusts wordmark colour. Mark itself adapts via `mono`. */
  dark?: boolean;
  /** Use the mono variant of the mark (no gradient). */
  mono?: boolean;
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
  assetBase = '/brand',
  className,
  style,
}: BrandMarkProps) {
  const src = mono
    ? `${assetBase}/${dark ? 'adopt-ai-mark-cream.png' : 'adopt-ai-mark-ink.png'}`
    : `${assetBase}/adopt-ai-mark.png`;

  return (
    <div
      className={cn('inline-flex items-center', className)}
      style={{ gap: size * 0.4, ...style }}
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
            style={{ fontSize: size * 0.42, gap: size * 0.18 }}
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
