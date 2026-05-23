import type { CSSProperties } from 'react';

interface NeuralMeshProps {
  rows?: number;
  cols?: number;
  dark?: boolean;
  style?: CSSProperties;
}

/** Subtle dotted lattice with deterministic pseudo-random connecting lines. */
export function NeuralMesh({ rows = 8, cols = 14, dark = false, style }: NeuralMeshProps) {
  const w = cols * 28;
  const h = rows * 28;

  const nodes: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nodes.push([c * 28 + 14, r * 28 + 14]);
    }
  }

  const lines: Array<[[number, number], [number, number]]> = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 18; i++) {
    const a = Math.floor(rnd() * nodes.length);
    const b = Math.floor(rnd() * nodes.length);
    const na = nodes[a];
    const nb = nodes[b];
    if (a !== b && na && nb) {
      lines.push([na, nb]);
    }
  }

  const dot = dark ? 'rgba(248,244,238,0.18)' : 'rgba(61,26,15,0.16)';
  const link = dark ? 'rgba(230,126,34,0.22)' : 'rgba(217,70,44,0.18)';

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      style={style}
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke={link} strokeWidth="0.6" opacity="0.6">
        {lines.map(([a, b], i) => (
          <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        ))}
      </g>
      <g fill={dot}>
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.2" />
        ))}
      </g>
    </svg>
  );
}
