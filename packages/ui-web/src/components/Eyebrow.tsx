import { cn } from '../utils/cn';

import type { CSSProperties, ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  /** Tone — defaults to ember accent. Use `glow` on dark surfaces for the cinematic hero. */
  tone?: 'accent' | 'glow' | 'ink' | 'cream' | 'muted';
  className?: string;
  style?: CSSProperties;
}

const toneClasses = {
  accent: 'text-accent',
  glow: 'text-glow',
  ink: 'text-ink',
  cream: 'text-cream',
  muted: 'text-ink/50',
} as const;

export function Eyebrow({ children, tone = 'accent', className, style }: EyebrowProps) {
  return (
    <div
      className={cn(
        'text-eyebrow font-mono uppercase tracking-[0.22em]',
        toneClasses[tone],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
