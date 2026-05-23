import { colors } from '@adopt-ai/tokens';
import type { CSSProperties } from 'react';

interface AmbientOrbsProps {
  /** 0..1. Use ~0.4 for subtle backgrounds, 1 for the cinematic hero. */
  intensity?: number;
  dark?: boolean;
  style?: CSSProperties;
}

/**
 * Three blurred radial gradients that drift slowly. Pure CSS, no canvas.
 * Matches `Design-Docs/.../atoms.jsx#AmbientOrbs`.
 */
export function AmbientOrbs({ intensity = 1, dark = false, style }: AmbientOrbsProps) {
  const baseOpacity = dark ? 0.55 : 0.42;
  const orbs = [
    { left: '-8%', top: '-12%', size: 620, c1: colors.burgundy, c2: colors.accent, o: 0.55, dur: '28s' },
    { left: '62%', top: '-18%', size: 720, c1: colors.glow, c2: colors.amber, o: 0.5, dur: '34s' },
    { left: '38%', top: '52%', size: 580, c1: colors.accent, c2: colors.gold, o: 0.4, dur: '40s' },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={style}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={dark ? 'mix-blend-screen' : 'mix-blend-multiply'}
          style={{
            position: 'absolute',
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle at 35% 35%, ${orb.c1} 0%, ${orb.c2} 35%, transparent 70%)`,
            filter: `blur(${dark ? 70 : 88}px)`,
            opacity: orb.o * baseOpacity * intensity,
            animation: `orbDrift${i} ${orb.dur} ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes orbDrift0 { 0%{transform:translate(0,0)} 100%{transform:translate(60px,40px)} }
        @keyframes orbDrift1 { 0%{transform:translate(0,0)} 100%{transform:translate(-50px,30px)} }
        @keyframes orbDrift2 { 0%{transform:translate(0,0)} 100%{transform:translate(30px,-40px)} }
      `}</style>
    </div>
  );
}
