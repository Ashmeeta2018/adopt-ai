/**
 * CSS variable strings — injected at the root of apps/web for runtime token access.
 */

import { colors, hairlines } from './colors';
import { motion } from './spacing';

export const cssVariables = `:root {
  --color-cream: ${colors.cream};
  --color-paper: ${colors.paper};
  --color-ink: ${colors.ink};
  --color-void: ${colors.void};
  --color-obsidian: ${colors.obsidian};
  --color-smoke: ${colors.smoke};
  --color-burgundy: ${colors.burgundy};
  --color-accent: ${colors.accent};
  --color-glow: ${colors.glow};
  --color-amber: ${colors.amber};
  --color-gold: ${colors.gold};
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-error: ${colors.error};
  --hairline: ${hairlines.light};
  --hairline-dark: ${hairlines.dark};
  --motion-hover: ${motion.hover.duration}ms ${motion.hover.easing};
  --motion-modal-enter: ${motion.modalEnter.duration}ms ${motion.modalEnter.easing};
}`;
