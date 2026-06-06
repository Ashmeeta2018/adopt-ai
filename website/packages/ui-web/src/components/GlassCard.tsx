import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../utils/cn';

interface GlassCardProps {
  children: ReactNode;
  dark?: boolean;
  variant?: 'light' | 'dark';
  padding?: number;
  className?: string;
  style?: CSSProperties;
}

export function GlassCard({
  children,
  dark = false,
  variant,
  padding = 28,
  className,
  style,
}: GlassCardProps) {
  const isDark = dark || variant === 'dark';
  return (
    <div
      className={cn(
        'relative rounded-xl border backdrop-blur-md',
        isDark
          ? 'border-hairline-dark shadow-card-dark'
          : 'border-hairline shadow-card-light',
        className,
      )}
      style={{
        padding,
        background: isDark
          ? 'linear-gradient(180deg, rgba(36,21,16,0.85), rgba(26,15,8,0.7))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75))',
        borderRadius: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
