/**
 * React Native flavour of the design tokens.
 * Consumed by apps/mobile through a ThemeProvider — never hex-code in screens.
 */

import { colors, emberStops, hairlines } from './colors';
import { containers, motion, pagePadding, radii, shadows, spacing } from './spacing';
import { fontFamilies, typeScale } from './typography';

/** Native shadow shape (iOS) — Android falls back to elevation. */
const native = {
  colors,
  hairlines,
  emberStops,
  spacing,
  radii,
  pagePadding,
  containers,
  motion,
  fonts: {
    display: 'Sora',
    body: 'Inter',
    mono: 'IBMPlexMono',
    editorial: 'InstrumentSerif',
  },
  type: typeScale,
  shadow: {
    cardLight: {
      shadowColor: '#3D1A0F',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.18,
      shadowRadius: 60,
      elevation: 6,
    },
    cardDark: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.45,
      shadowRadius: 60,
      elevation: 10,
    },
    cta: {
      shadowColor: '#A82A28',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 22,
      elevation: 6,
    },
  },
  /** Original web shadow strings, kept for reference. */
  webShadowStrings: shadows,
  fontFamilies,
} as const;

export const nativeTokens = native;
export type NativeTokens = typeof native;
