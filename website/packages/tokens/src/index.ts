/**
 * @adopt-ai/tokens
 * Single source of truth for Adopt AI design tokens. Consumed by both
 * apps/web (via tailwind-preset) and apps/mobile (via native StyleSheet map).
 *
 * Source: Design-Docs/design_handoff_adopt_ai/01-brand-tokens.md
 */

export * from './colors';
export * from './typography';
export * from './spacing';

import { colors, emberGradient, emberStops, hairlines } from './colors';
import { fontFamilies, fontVariables, typeScale } from './typography';
import { containers, motion, pagePadding, radii, shadows, spacing } from './spacing';

export const tokens = {
  colors,
  hairlines,
  emberStops,
  emberGradient,
  fontFamilies,
  fontVariables,
  typeScale,
  spacing,
  pagePadding,
  radii,
  shadows,
  motion,
  containers,
} as const;

export type Tokens = typeof tokens;
