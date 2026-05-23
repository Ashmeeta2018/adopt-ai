/**
 * Adopt AI — color tokens.
 * Source of truth: Design-Docs/design_handoff_adopt_ai/01-brand-tokens.md
 */

export const colors = {
  // Light surfaces
  cream: '#F8F4EE',
  paper: '#FFFFFF',

  // Dark surfaces
  ink: '#3D1A0F',
  void: '#0F0805',
  obsidian: '#1A0F08',
  smoke: '#241510',

  // Ember accent system (the signature)
  burgundy: '#A82A28',
  accent: '#D9462C',
  glow: '#E67E22',
  amber: '#D6912A',
  gold: '#C68A1F',

  // Status (used in agent pills and alerts)
  success: '#2BAE5C',
  warning: '#D6912A',
  error: '#D9462C',
} as const;

export const hairlines = {
  light: 'rgba(61, 26, 15, 0.12)',
  dark: 'rgba(248, 244, 238, 0.14)',
} as const;

/** The 5-stop ember gradient — used on logo, primary CTAs, hero text. */
export const emberStops = [
  colors.burgundy,
  colors.accent,
  colors.glow,
  colors.amber,
  colors.gold,
] as const;

export const emberGradient = (angle = '90deg') =>
  `linear-gradient(${angle}, ${emberStops.join(', ')})`;

export type Color = keyof typeof colors;
