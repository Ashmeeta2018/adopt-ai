/**
 * Adopt AI — typography tokens.
 * Source of truth: Design-Docs/design_handoff_adopt_ai/01-brand-tokens.md
 */

export const fontFamilies = {
  display: 'Sora, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
  editorial: '"Instrument Serif", Georgia, serif',
} as const;

export const fontVariables = {
  display: '--font-display',
  body: '--font-body',
  mono: '--font-mono',
  editorial: '--font-editorial',
} as const;

/**
 * Full type scale from `01-brand-tokens.md`.
 * Tuple shape: [fontSizePx, fontWeight, letterSpacingEm, lineHeight]
 */
export const typeScale = {
  cinemaHero: { size: 124, weight: 600, tracking: -0.055, leading: 0.92 },
  ctaHeadline: { size: 96, weight: 500, tracking: -0.05, leading: 0.98 },
  sectionHero: { size: 88, weight: 500, tracking: -0.045, leading: 0.98 },
  pageH1: { size: 80, weight: 500, tracking: -0.04, leading: 0.98 },
  caseH1: { size: 72, weight: 500, tracking: -0.04, leading: 0.98 },
  sectionH2Lg: { size: 64, weight: 500, tracking: -0.04, leading: 1.02 },
  sectionH2: { size: 56, weight: 500, tracking: -0.035, leading: 1.05 },
  sectionH2Sm: { size: 48, weight: 500, tracking: -0.035, leading: 1.05 },
  tileHeading: { size: 44, weight: 500, tracking: -0.035, leading: 1.05 },
  stepHeading: { size: 32, weight: 500, tracking: -0.025, leading: 1.05 },
  bodyH3: { size: 28, weight: 500, tracking: -0.025, leading: 1.05 },
  mobileHeading: { size: 26, weight: 500, tracking: -0.025, leading: 1.05 },
  faqQuestion: { size: 22, weight: 500, tracking: -0.02, leading: 1.18 },
  lead: { size: 19, weight: 400, tracking: 0, leading: 1.55 },
  body: { size: 17, weight: 400, tracking: 0, leading: 1.6 },
  bodySm: { size: 15.5, weight: 400, tracking: 0, leading: 1.6 },
  ui: { size: 14, weight: 400, tracking: 0, leading: 1.5 },
  caption: { size: 13, weight: 400, tracking: 0, leading: 1.5 },
  monoMetric: { size: 12, weight: 500, tracking: 0.06, leading: 1.6 },
  eyebrow: { size: 11, weight: 500, tracking: 0.18, leading: 1.4 },
} as const;

export type TypeRole = keyof typeof typeScale;
