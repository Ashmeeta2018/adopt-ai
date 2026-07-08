import { cn } from '../utils/cn';

import type { ReactNode } from 'react';

interface FloatingChipProps {
  children: ReactNode;
  x: string;
  y: string;
  rot?: number;
  delay?: number;
  dark?: boolean;
}

/** Glassy floating "data" chip used inside the cinematic hero. */
export function FloatingChip({
  children,
  x,
  y,
  rot = 0,
  delay = 0,
  dark = false,
}: FloatingChipProps) {
  return (
    <div
      className={cn(
        'font-body absolute whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[12px]',
        'backdrop-blur-md',
        dark
          ? 'border-hairline-dark text-cream border bg-[rgba(36,21,16,0.7)]'
          : 'border-hairline text-ink border bg-white/70',
      )}
      style={{
        left: x,
        top: y,
        transform: `rotate(${rot}deg)`,
        boxShadow: dark
          ? '0 18px 40px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 18px 40px -20px rgba(61,26,15,0.25), inset 0 1px 0 rgba(255,255,255,0.6)',
        animation: `chipFloat 7s ease-in-out ${delay}s infinite alternate`,
        zIndex: 5,
      }}
    >
      {children}
      <style>{`@keyframes chipFloat { 0%{transform:translateY(0) rotate(${rot}deg)} 100%{transform:translateY(-10px) rotate(${rot}deg)} }`}</style>
    </div>
  );
}
