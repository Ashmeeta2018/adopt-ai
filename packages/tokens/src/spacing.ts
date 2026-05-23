/**
 * Adopt AI — spacing, radii, shadows, motion.
 * Source of truth: Design-Docs/design_handoff_adopt_ai/01-brand-tokens.md
 *
 * 8px base grid. Page padding density: compact 56 / regular 72 / airy 96.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
  '6xl': 128,
  '7xl': 160,
} as const;

export const pagePadding = {
  compact: { side: 56, section: 96 },
  regular: { side: 72, section: 128 },
  airy: { side: 96, section: 160 },
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  '2xl': 22,
  '3xl': 24,
  full: 9999,
} as const;

export const shadows = {
  cardLight: '0 24px 60px -28px rgba(61, 26, 15, 0.18)',
  cardDark: '0 24px 60px -20px rgba(0, 0, 0, 0.45)',
  cta: '0 8px 22px -8px rgba(168, 42, 40, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
  mark: '0 24px 60px rgba(168, 42, 40, 0.3)',
} as const;

export const motion = {
  hover: { duration: 150, easing: 'ease-out' },
  modalEnter: { duration: 220, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
  modalExit: { duration: 180, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  orbDrift: { duration: 34000, easing: 'ease-in-out' },
  ringSpin: { duration: 60000, easing: 'linear' },
  agentPulse: { duration: 1400, easing: 'ease-in-out' },
  markReveal: { duration: 6000, easing: 'ease-in-out' },
} as const;

export const containers = {
  hero: 1080,
  approach: 1100,
  featuredCard: 720,
  leadCopy: 640,
  heroSubcopy: 560,
  sidebarCopy: 380,
  tileSm: 320,
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
