// Six minimal "Connected A" monogram concepts for Adopt AI.
// Premium, geometric, scalable. No literal AI imagery — just elegant
// letterforms with subtle node references hinting at intelligence.

const CONCEPT_NOTES = {
  trinityA:   { name: 'Trinity A',
    tag:  'Three nodes, one shape',
    desc: 'The A built from three connected nodes — apex and two feet. The simplest possible expression of a system.' },
  geometricA: { name: 'Geometric A',
    tag:  'Pure letterform',
    desc: 'A two-stroke A with rounded caps and a single apex dot. Clean, scalable, unmistakable.' },
  bridgeA:    { name: 'Bridge A',
    tag:  'Adoption as connection',
    desc: 'The crossbar becomes a bridge of small nodes — a row of teams linked by AI. Quiet, technical.' },
  capsuleA:   { name: 'Capsule A',
    tag:  'Software-soft geometry',
    desc: 'Two stadium-shaped strokes lean together. Friendly, modern, ready for product UI.' },
  pathwayA:   { name: 'Pathway A',
    tag:  'Transformation through',
    desc: 'A solid A with a single gradient ribbon flowing through it — operations moving from current state to next.' },
  apexA:      { name: 'Apex A',
    tag:  'Open chevron with a north star',
    desc: 'Just the two strokes and a glowing apex node. The A as an arrow upward.' },
  circuitHead:{ name: 'Circuit Head',
    tag:  'Head + PCB traces in a ring',
    desc: 'Left-facing profile outlined inside a cyan ring, with circuit traces and green node taps emerging from the brain.' },
};

const CONCEPT_RATIO = {
  trinityA:    1.0,
  geometricA:  1.0,
  bridgeA:     1.0,
  capsuleA:    1.0,
  pathwayA:    1.0,
  apexA:       1.0,
  circuitHead: 1.0,
};

// ─────────────────────────────────────────────────────────────
// Shared geometry — A apex (50, 12), left foot (10, 88), right foot (90, 88)
// Crossbar from (30, 60) to (70, 60). 100×100 viewBox.
// ─────────────────────────────────────────────────────────────

// 1. Trinity A — three nodes connected by lines.
function TrinityAMark({ size = 120, theme, gradient = true }) {
  const gid = React.useId().replace(/[^a-z0-9]/gi, '');
  const fill = gradient ? `url(#tA-${gid})` : theme.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`tA-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.accent} />
          <stop offset="1" stopColor={theme.glow} />
        </linearGradient>
      </defs>
      <g stroke={fill} strokeWidth="3.6" strokeLinecap="round" fill="none">
        <line x1="50" y1="14" x2="14" y2="86" />
        <line x1="50" y1="14" x2="86" y2="86" />
        <line x1="30" y1="60" x2="70" y2="60" />
      </g>
      {/* nodes */}
      <g>
        {[[50, 14, 7], [14, 86, 7], [86, 86, 7], [30, 60, 4.5], [70, 60, 4.5]].map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={fill} />
            <circle cx={x} cy={y} r={r * 0.42} fill={theme.surface} />
          </g>
        ))}
      </g>
    </svg>
  );
}

// 2. Geometric A — pure outline letterform with rounded caps + apex dot.
function GeometricAMark({ size = 120, theme, gradient = true }) {
  const gid = React.useId().replace(/[^a-z0-9]/gi, '');
  const fill = gradient ? `url(#gA-${gid})` : theme.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`gA-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.accent} />
          <stop offset="1" stopColor={theme.glow} />
        </linearGradient>
      </defs>
      <g stroke={fill} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 14 86 L 50 18 L 86 86" />
        <path d="M 30 60 L 70 60" />
      </g>
      {/* apex node */}
      <circle cx="50" cy="18" r="6" fill={fill} />
      <circle cx="50" cy="18" r="2.4" fill={theme.surface} />
    </svg>
  );
}

// 3. Bridge A — outline A with crossbar of small connected dots.
function BridgeAMark({ size = 120, theme, gradient = true }) {
  const gid = React.useId().replace(/[^a-z0-9]/gi, '');
  const fill = gradient ? `url(#bA-${gid})` : theme.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`bA-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.accent} />
          <stop offset="1" stopColor={theme.glow} />
        </linearGradient>
      </defs>
      {/* legs */}
      <g stroke={fill} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 14 86 L 50 18 L 86 86" />
      </g>
      {/* bridge */}
      <line x1="30" y1="60" x2="70" y2="60" stroke={fill} strokeWidth="1.6" strokeDasharray="0.1 6" strokeLinecap="round" />
      <g>
        {[30, 40, 50, 60, 70].map((x, i) => (
          <circle key={i} cx={x} cy="60" r={i === 2 ? 4 : 3} fill={fill} />
        ))}
      </g>
    </svg>
  );
}

// 4. Capsule A — two stadium-rounded strokes.
function CapsuleAMark({ size = 120, theme, gradient = true }) {
  const gid = React.useId().replace(/[^a-z0-9]/gi, '');
  const fill = gradient ? `url(#cA-${gid})` : theme.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`cA-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.accent} />
          <stop offset="1" stopColor={theme.glow} />
        </linearGradient>
      </defs>
      {/* left leg as capsule */}
      <g stroke={fill} strokeWidth="14" strokeLinecap="round" fill="none">
        <line x1="50" y1="20" x2="18" y2="84" />
        <line x1="50" y1="20" x2="82" y2="84" />
      </g>
      {/* subtle bridge */}
      <line x1="33" y1="58" x2="67" y2="58" stroke={theme.surface} strokeWidth="3" strokeLinecap="round" opacity="0.95" />
    </svg>
  );
}

// 5. Pathway A — solid A with a single gradient ribbon flowing through it.
function PathwayAMark({ size = 120, theme, gradient = true }) {
  const gid = React.useId().replace(/[^a-z0-9]/gi, '');
  const fill = gradient ? `url(#pA-${gid})` : theme.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`pA-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.accent} />
          <stop offset="1" stopColor={theme.glow} />
        </linearGradient>
        <linearGradient id={`pAr-${gid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={theme.glow} />
          <stop offset="1" stopColor={theme.accent} />
        </linearGradient>
      </defs>
      {/* solid A — closed triangle with inner triangular cut */}
      <path d={[
        'M 50 12',
        'L 90 88',
        'L 74 88',
        'L 50 36',
        'L 26 88',
        'L 10 88',
        'Z',
      ].join(' ')} fill={theme.deep} />

      {/* gradient ribbon flowing through */}
      <path d="M 18 70 C 36 64, 64 76, 82 60" stroke={`url(#pAr-${gid})`} strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 6. Apex A — open chevron with a glowing north-star node.
function ApexAMark({ size = 120, theme, gradient = true }) {
  const gid = React.useId().replace(/[^a-z0-9]/gi, '');
  const fill = gradient ? `url(#aA-${gid})` : theme.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`aA-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.accent} />
          <stop offset="1" stopColor={theme.glow} />
        </linearGradient>
        <radialGradient id={`aAg-${gid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={theme.glow} stopOpacity="0.55" />
          <stop offset="1" stopColor={theme.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* halo */}
      <circle cx="50" cy="22" r="22" fill={`url(#aAg-${gid})`} />
      {/* chevron */}
      <g stroke={fill} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 14 86 L 50 22 L 86 86" />
      </g>
      {/* north-star node */}
      <circle cx="50" cy="22" r="8" fill={fill} />
      <circle cx="50" cy="22" r="3.4" fill={theme.surface} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. Circuit Head — left-facing profile inside a ring with PCB
//    traces and node taps. Uses theme.gradientStops when present
//    for a multi-stop ember gradient; falls back to accent/glow.
// ─────────────────────────────────────────────────────────────
function CircuitHeadMark({ size = 120, theme, gradient = true }) {
  const gid = React.useId().replace(/[^a-z0-9]/gi, '');
  const stops = theme.gradientStops || [theme.accent, theme.glow];
  const fill = gradient ? `url(#ch-${gid})` : theme.accent;
  const lineW = 2.6;
  const traceW = 1.7;
  const nodeR = 2.3;

  // Left-facing head profile outline (nose at left). Crown ~(70,18); nose ~(20,58); chin ~(50,92).
  const headPath = [
    'M 70 18',
    'C 56 18, 46 28, 44 46',
    'C 44 50, 40 52, 36 54',
    'C 30 56, 22 56, 20 60',
    'C 20 64, 28 66, 34 66',
    'C 36 70, 40 72, 38 74',
    'C 36 76, 40 78, 40 82',
    'C 42 88, 44 92, 50 94',
    'C 60 98, 74 100, 84 96',
    'C 96 90, 104 78, 104 64',
    'C 104 48, 100 30, 86 22',
    'C 80 18, 75 18, 70 18',
    'Z',
  ].join(' ');

  // Circuit traces inside the head — orthogonal with right-angle bends.
  const innerTraces = [
    'M 56 36 L 56 28 L 74 28',
    'M 56 36 L 70 36',
    'M 70 36 L 82 36 L 82 30',
    'M 56 46 L 78 46',
    'M 56 46 L 56 58',
    'M 56 58 L 76 58',
    'M 76 58 L 76 50',
    'M 56 58 L 56 70',
    'M 56 70 L 70 70',
    'M 56 70 L 56 80',
    'M 70 70 L 70 80',
    'M 78 46 L 90 46',
    'M 76 50 L 88 50 L 88 58',
    'M 70 80 L 80 80 L 80 86',
    'M 56 80 L 50 80 L 50 86',
    'M 40 64 L 44 64 L 44 72',
  ];

  // Traces extending beyond the head silhouette toward the outer ring.
  const outerTraces = [
    'M 74 28 L 74 20',
    'M 82 30 L 82 22',
    'M 90 46 L 100 46',
    'M 88 58 L 100 58',
    'M 80 86 L 86 92',
    'M 50 86 L 44 96',
  ];

  // Green-style node positions (small filled dots).
  const nodes = [
    // inside head — junctions + endpoints
    [56, 28, nodeR], [74, 28, nodeR], [82, 30, nodeR],
    [56, 36, nodeR], [56, 46, nodeR], [56, 58, nodeR + 0.6], [56, 70, nodeR], [56, 80, nodeR],
    [70, 36, nodeR - 0.3], [82, 36, nodeR],
    [76, 50, nodeR - 0.3], [78, 46, nodeR - 0.3], [88, 58, nodeR],
    [70, 70, nodeR - 0.3], [70, 80, nodeR - 0.3], [80, 86, nodeR],
    [50, 86, nodeR], [44, 72, nodeR - 0.3], [40, 64, nodeR - 0.3],
    // outside head — terminations on/near the ring
    [74, 20, nodeR + 0.4], [82, 22, nodeR + 0.4],
    [100, 46, nodeR + 0.4], [100, 58, nodeR + 0.4],
    [86, 92, nodeR + 0.4], [44, 96, nodeR + 0.4],
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`ch-${gid}`} x1="0" y1="0.05" x2="1" y2="0.95">
          {stops.map((c, i) => (
            <stop key={i} offset={(i / (stops.length - 1)) * 100 + '%'} stopColor={c} />
          ))}
        </linearGradient>
      </defs>

      {/* outer ring — broken with the gradient */}
      <circle cx="60" cy="60" r="54" fill="none"
        stroke={fill} strokeWidth={lineW + 0.4} strokeLinecap="round"
        strokeDasharray="180 8 90 6 60 6" transform="rotate(-90 60 60)" />

      {/* small ring-break nodes (give the dashed ring punctuation) */}
      <g fill={fill}>
        <circle cx="92" cy="34" r="3" />
        <circle cx="106" cy="74" r="3" />
        <circle cx="78" cy="112" r="3" />
        <circle cx="18" cy="84" r="3" />
        <circle cx="14" cy="44" r="3" />
      </g>

      {/* head silhouette — thick gradient outline only */}
      <path d={headPath} fill="none" stroke={fill} strokeWidth={lineW + 0.6}
        strokeLinejoin="round" strokeLinecap="round" />

      {/* circuit traces inside the head */}
      <g stroke={fill} strokeWidth={traceW} fill="none"
        strokeLinecap="round" strokeLinejoin="round">
        {innerTraces.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* circuit traces extending beyond the head */}
      <g stroke={fill} strokeWidth={traceW} fill="none"
        strokeLinecap="round" strokeLinejoin="round">
        {outerTraces.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* nodes — small filled dots */}
      <g fill={fill}>
        {nodes.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Concept registry
// ─────────────────────────────────────────────────────────────
const CONCEPT_MARKS = {
  trinityA:    TrinityAMark,
  geometricA:  GeometricAMark,
  bridgeA:     BridgeAMark,
  capsuleA:    CapsuleAMark,
  pathwayA:    PathwayAMark,
  apexA:       ApexAMark,
  circuitHead: CircuitHeadMark,
};

function ConceptMark({ id, ...rest }) {
  const Comp = CONCEPT_MARKS[id] || TrinityAMark;
  return <Comp {...rest} />;
}

// Wordmark lockup wrapping any concept mark on the left of "Adopt AI"
function ConceptLockup({ id, size = 26, theme, gradient = true, align = 'inline' }) {
  const Mark = CONCEPT_MARKS[id] || TrinityAMark;
  const accentText = {
    background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  };
  const wordmark = (
    <div style={{
      fontFamily: theme.fontDisplay, fontWeight: 900, fontSize: size,
      letterSpacing: '-0.035em', lineHeight: 1, color: theme.deep,
      display: 'inline-flex', alignItems: 'baseline', gap: size * 0.18,
    }}>
      <span>Adopt</span><span style={accentText}>AI</span>
    </div>
  );
  if (align === 'stacked') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.6 }}>
        <Mark size={size * 3.4} theme={theme} gradient={gradient} />
        {wordmark}
      </div>
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.55 }}>
      <Mark size={size * 1.7} theme={theme} gradient={gradient} />
      {wordmark}
    </div>
  );
}

Object.assign(window, {
  CONCEPT_MARKS, CONCEPT_NOTES, CONCEPT_RATIO, ConceptMark, ConceptLockup,
  TrinityAMark, GeometricAMark, BridgeAMark, CapsuleAMark, PathwayAMark, ApexAMark, CircuitHeadMark,
});
