import type { CSSProperties } from 'react';

import { hairlines } from '@adopt-ai/tokens';

interface HairlineProps {
  dark?: boolean;
  style?: CSSProperties;
}

export function Hairline({ dark = false, style }: HairlineProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${dark ? hairlines.dark : hairlines.light}, transparent)`,
        ...style,
      }}
    />
  );
}
