import { emberStops } from '@adopt-ai/tokens';
import type { CSSProperties } from 'react';

interface AmbientRingsProps {
  size?: number;
  dark?: boolean;
  style?: CSSProperties;
}

/** Concentric rings + dotted orbital arcs. Slow rotation. */
export function AmbientRings({ size = 480, dark = false, style }: AmbientRingsProps) {
  const stroke = dark ? 'rgba(248,244,238,0.10)' : 'rgba(61,26,15,0.10)';
  const accentStroke = dark ? 'rgba(230,126,34,0.35)' : 'rgba(217,70,44,0.35)';

  const orbitNodes: [number, number][] = [
    [95, 0],
    [78, 60],
    [60, 120],
    [42, 200],
    [95, 280],
  ];

  return (
    <div
      aria-hidden="true"
      style={{ position: 'relative', width: size, height: size, ...style }}
    >
      <div
        className="absolute inset-0"
        style={{ animation: 'ringSpin 80s linear infinite' }}
      >
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              {emberStops.map((c, i) => (
                <stop key={i} offset={i / (emberStops.length - 1)} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="95" fill="none" stroke={stroke} strokeWidth="0.4" />
          <circle cx="100" cy="100" r="78" fill="none" stroke={stroke} strokeWidth="0.4" />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke={accentStroke}
            strokeWidth="0.6"
            strokeDasharray="0.6 4"
          />
          <circle
            cx="100"
            cy="100"
            r="42"
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            opacity="0.8"
          />
          {orbitNodes.map(([r, deg], i) => {
            const a = (deg * Math.PI) / 180;
            const x = 100 + r * Math.cos(a);
            const y = 100 + r * Math.sin(a);
            return <circle key={i} cx={x} cy={y} r="1.6" fill="url(#ring-grad)" />;
          })}
        </svg>
      </div>
    </div>
  );
}
