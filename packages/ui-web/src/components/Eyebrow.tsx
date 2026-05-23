import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../utils/cn';

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
        'font-mono text-eyebrow uppercase tracking-[0.22em]',
        toneClasses[tone],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
