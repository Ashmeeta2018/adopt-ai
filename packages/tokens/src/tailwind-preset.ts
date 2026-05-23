/**
 * Tailwind preset consumed by apps/web/tailwind.config.ts.
 * Keeps every hex / size / timing inside packages/tokens.
 */

import type { Config } from 'tailwindcss';

import { colors, hairlines } from './colors';
import { radii, shadows, spacing } from './spacing';
import { typeScale } from './typography';

const px = (n: number) => `${n}px`;

const fontSizeMap = Object.fromEntries(
  Object.entries(typeScale).map(([role, t]) => [
    role,
    [
      px(t.size),
      {
        lineHeight: String(t.leading),
        letterSpacing: `${t.tracking}em`,
        fontWeight: String(t.weight),
      },
    ],
  ]),
) as Config['theme'] extends infer T
  ? T extends { fontSize?: infer F }
    ? F
    : never
  : never;

export const adoptAiPreset = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        ...colors,
        hairline: hairlines.light,
        'hairline-dark': hairlines.dark,
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        editorial: ['var(--font-editorial)', 'Georgia', 'serif'],
      },
      fontSize: fontSizeMap,
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, px(v)])),
      borderRadius: Object.fromEntries(
        Object.entries(radii).map(([k, v]) => [k, k === 'full' ? '9999px' : px(v)]),
      ),
      boxShadow: {
        'card-light': shadows.cardLight,
        'card-dark': shadows.cardDark,
        cta: shadows.cta,
        mark: shadows.mark,
      },
      backgroundImage: {
        ember: `linear-gradient(90deg, ${colors.burgundy}, ${colors.accent}, ${colors.glow}, ${colors.amber}, ${colors.gold})`,
        'ember-cta': `linear-gradient(120deg, ${colors.burgundy}, ${colors.accent} 45%, ${colors.glow})`,
      },
      keyframes: {
        ringSpin: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        chipFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        orbDrift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(40px, -30px)' },
        },
        agentPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'ring-spin': 'ringSpin 60s linear infinite',
        'ring-spin-reverse': 'ringSpin 80s linear infinite reverse',
        'chip-float': 'chipFloat 7s ease-in-out infinite alternate',
        'orb-drift': 'orbDrift 34s ease-in-out infinite alternate',
        'agent-pulse': 'agentPulse 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Partial<Config>;
