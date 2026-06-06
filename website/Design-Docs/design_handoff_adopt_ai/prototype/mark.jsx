// Neural-A logo mark + brand atoms. Themed.
//
// Themes pass through a single object; everything else (artboards, palettes)
// reads from it. Backgrounds, inks, dividers, grids all derive from the
// theme so dark and warm-light modes coexist.

const THEMES = {
  sunrise:  { id: 'sunrise',  name: 'Sunrise',  isDark: false,
              bg: '#F2E8D5', surface: '#FBF3E2', deep: '#1F1410',
              soft: 'rgba(31,20,16,0.66)', faint: 'rgba(31,20,16,0.42)',
              line: 'rgba(194,65,12,0.20)', grid: 'rgba(194,65,12,0.08)',
              accent: '#C2410C', glow: '#E89A4A' },
  apricot:  { id: 'apricot',  name: 'Apricot',  isDark: false,
              bg: '#FBE7D2', surface: '#FFF1DD', deep: '#2A1610',
              soft: 'rgba(42,22,16,0.66)', faint: 'rgba(42,22,16,0.4)',
              line: 'rgba(219,100,53,0.22)', grid: 'rgba(219,100,53,0.08)',
              accent: '#DB6435', glow: '#F0B660' },
  ivory:    { id: 'ivory',    name: 'Ivory',    isDark: false,
              bg: '#F4F0E6', surface: '#FBF8EE', deep: '#1A1612',
              soft: 'rgba(26,22,18,0.64)', faint: 'rgba(26,22,18,0.42)',
              line: 'rgba(180,83,9,0.18)', grid: 'rgba(180,83,9,0.07)',
              accent: '#B45309', glow: '#E0A668' },
  sand:     { id: 'sand',     name: 'Sand',     isDark: false,
              bg: '#E8DECB', surface: '#F4E9D2', deep: '#22170F',
              soft: 'rgba(34,23,15,0.65)', faint: 'rgba(34,23,15,0.42)',
              line: 'rgba(176,82,18,0.22)', grid: 'rgba(176,82,18,0.08)',
              accent: '#B05212', glow: '#D99055' },
  midnight: { id: 'midnight', name: 'Midnight', isDark: true,
              bg: '#0B0F19', surface: '#0F1422', deep: '#F5F7FA',
              soft: 'rgba(245,247,250,0.66)', faint: 'rgba(245,247,250,0.42)',
              line: 'rgba(37,99,255,0.22)', grid: 'rgba(37,99,255,0.07)',
              accent: '#2563FF', glow: '#00D1FF' },

  // ─── New directions ───────────────────────────────────────
  forest:   { id: 'forest',   name: 'Forest',   isDark: false,
              bg: '#EDEFE6', surface: '#F6F7EE', deep: '#102015',
              soft: 'rgba(16,32,21,0.66)', faint: 'rgba(16,32,21,0.42)',
              line: 'rgba(22,101,52,0.22)', grid: 'rgba(22,101,52,0.07)',
              accent: '#166534', glow: '#65A55C' },
  cobalt:   { id: 'cobalt',   name: 'Cobalt',   isDark: false,
              bg: '#E8ECF2', surface: '#F3F5FA', deep: '#0B1424',
              soft: 'rgba(11,20,36,0.66)', faint: 'rgba(11,20,36,0.42)',
              line: 'rgba(29,78,216,0.22)', grid: 'rgba(29,78,216,0.07)',
              accent: '#1D4ED8', glow: '#38BDF8' },
  plum:     { id: 'plum',     name: 'Plum',     isDark: false,
              bg: '#F2EBF1', surface: '#FAF4F8', deep: '#1F0F1C',
              soft: 'rgba(31,15,28,0.66)', faint: 'rgba(31,15,28,0.42)',
              line: 'rgba(157,23,77,0.22)', grid: 'rgba(157,23,77,0.07)',
              accent: '#9D174D', glow: '#E879B1' },
  graphite: { id: 'graphite', name: 'Graphite', isDark: false,
              bg: '#E8E8E6', surface: '#F4F4F2', deep: '#111111',
              soft: 'rgba(17,17,17,0.66)', faint: 'rgba(17,17,17,0.42)',
              line: 'rgba(17,17,17,0.20)', grid: 'rgba(17,17,17,0.06)',
              accent: '#111111', glow: '#6B7280' },
  void:     { id: 'void',     name: 'Void',     isDark: true,
              bg: '#0A0A0A', surface: '#0F0F10', deep: '#FAFAF7',
              soft: 'rgba(250,250,247,0.66)', faint: 'rgba(250,250,247,0.42)',
              line: 'rgba(255,213,79,0.22)', grid: 'rgba(255,213,79,0.06)',
              accent: '#FFD54F', glow: '#FFFFFF' },

  // ─── Premium (from brand brief) ──────────────────────────
  // Warm Ivory canvas, Deep Midnight ink, Intelligence Orange → Human Coral gradient.
  premium:  { id: 'premium',  name: 'Premium (Light)',  isDark: false,
              bg: '#F8F4EC', surface: '#FFFFFF', deep: '#0B1020',
              soft: 'rgba(11,16,32,0.66)', faint: 'rgba(11,16,32,0.42)',
              line: 'rgba(11,16,32,0.14)', grid: 'rgba(11,16,32,0.05)',
              accent: '#FF7A00', glow: '#FF4D6D', gold: '#FFC145',
              slate: '#18233A' },
  premiumDark: { id: 'premiumDark', name: 'Premium (Dark)', isDark: true,
              bg: '#0B1020', surface: '#18233A', deep: '#F8F4EC',
              soft: 'rgba(248,244,236,0.72)', faint: 'rgba(248,244,236,0.46)',
              line: 'rgba(255,122,0,0.22)', grid: 'rgba(255,122,0,0.07)',
              accent: '#FF7A00', glow: '#FF4D6D', gold: '#FFC145',
              slate: '#18233A' },

  // ─── Circuit (navy + cyan + green) ───────────────────────
  circuit:     { id: 'circuit',     name: 'Circuit',      isDark: false,
              bg: '#F4F7F9', surface: '#FFFFFF', deep: '#1E3D6E',
              soft: 'rgba(30,61,110,0.70)', faint: 'rgba(30,61,110,0.42)',
              line: 'rgba(43,176,218,0.22)', grid: 'rgba(43,176,218,0.07)',
              accent: '#2BB0DA', glow: '#2BAE5C',
              navy: '#1E3D6E' },
  circuitDark: { id: 'circuitDark', name: 'Circuit Dark', isDark: true,
              bg: '#0A1A2E', surface: '#102441', deep: '#E8F4F9',
              soft: 'rgba(232,244,249,0.70)', faint: 'rgba(232,244,249,0.46)',
              line: 'rgba(43,176,218,0.30)', grid: 'rgba(43,176,218,0.08)',
              accent: '#2BB0DA', glow: '#2BAE5C',
              navy: '#1E3D6E' },

  // ─── Ember (warm metallic — the primary brand palette) ───
  // Deep red → orange → amber gradient, dark-brown ink, cream canvas.
  ember:   { id: 'ember',   name: 'Ember',   isDark: false,
              bg: '#F8F4EE', surface: '#FFFFFF', deep: '#3D1A0F',
              soft: 'rgba(61,26,15,0.72)', faint: 'rgba(61,26,15,0.46)',
              line: 'rgba(217,70,44,0.22)', grid: 'rgba(217,70,44,0.08)',
              accent: '#D9462C', glow: '#E67E22', gold: '#C68A1F',
              burgundy: '#A82A28',
              gradientStops: ['#A82A28', '#D9462C', '#E67E22', '#D6912A', '#C68A1F'] },
  emberDark: { id: 'emberDark', name: 'Ember Dark', isDark: true,
              bg: '#1A0F08', surface: '#241510', deep: '#F8F4EE',
              soft: 'rgba(248,244,238,0.72)', faint: 'rgba(248,244,238,0.46)',
              line: 'rgba(230,126,34,0.30)', grid: 'rgba(230,126,34,0.08)',
              accent: '#E67E22', glow: '#D6912A', gold: '#C68A1F',
              burgundy: '#A82A28',
              gradientStops: ['#A82A28', '#D9462C', '#E67E22', '#D6912A', '#C68A1F'] },
};

// ────────────────────────────────────────────────────────────
// NeuralA — the geometric mark. 64-unit grid; 5 nodes + 2 limbs + flow arcs.
// ────────────────────────────────────────────────────────────
function NeuralA({
  size = 96,
  theme = THEMES.sunrise,
  variant = 'neural',          // 'neural' | 'stroke' | 'solid'
  construction = false,
  gradient = true,
}) {
  const apex = [32, 8], lFoot = [8, 56], rFoot = [56, 56], cbL = [20.75, 38], cbR = [43.25, 38];
  const gid = React.useId().replace(/[^a-z0-9]/gi, '');
  const stroke = theme.accent;
  const nodeFill = gradient ? `url(#g-${gid})` : theme.accent;
  const nodeCore = theme.surface;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`g-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.accent} />
          <stop offset="1" stopColor={theme.glow} />
        </linearGradient>
        <radialGradient id={`rg-${gid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={theme.glow} stopOpacity={theme.isDark ? 0.42 : 0.28} />
          <stop offset="1" stopColor={theme.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {construction && (
        <g opacity={theme.isDark ? 0.35 : 0.55}>
          <g stroke={theme.accent} strokeWidth="0.15" opacity="0.5">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v${i}`} x1={i * 8} y1="0" x2={i * 8} y2="64" />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 8} x2="64" y2={i * 8} />
            ))}
          </g>
          <g stroke={theme.accent} strokeWidth="0.35" fill="none">
            <line x1="0" y1="62" x2="64" y2="62" />
            <line x1="0" y1="60" x2="0" y2="64" />
            <line x1="64" y1="60" x2="64" y2="64" />
            <line x1="62" y1="0" x2="62" y2="64" />
            <line x1="60" y1="0" x2="64" y2="0" />
            <line x1="60" y1="64" x2="64" y2="64" />
          </g>
          <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="3" fill={theme.accent}>
            <text x="32" y="62" textAnchor="middle" dy="-0.5" style={{ paintOrder: 'stroke', stroke: theme.bg, strokeWidth: 0.6 }}>64</text>
            <text x="62" y="32" textAnchor="middle" transform="rotate(-90 62 32)" dy="-0.5" style={{ paintOrder: 'stroke', stroke: theme.bg, strokeWidth: 0.6 }}>64</text>
          </g>
        </g>
      )}

      {gradient && variant !== 'stroke' && (
        <circle cx="32" cy="20" r="22" fill={`url(#rg-${gid})`} />
      )}

      {variant === 'solid' && (
        <g>
          <path d={`M ${apex[0]} ${apex[1]} L ${rFoot[0]} ${rFoot[1]} L ${cbR[0] + 4.5} ${cbR[1] + 7} L ${cbL[0] - 4.5} ${cbR[1] + 7} L ${lFoot[0]} ${lFoot[1]} Z`} fill={nodeFill} opacity="0.16" />
          <path d={`M ${apex[0]} ${apex[1]} L ${lFoot[0] + 6} ${lFoot[1]} L ${cbL[0] + 0.5} ${cbL[1] + 2} L ${cbR[0] - 0.5} ${cbR[1] + 2} L ${rFoot[0] - 6} ${rFoot[1]} L ${rFoot[0]} ${rFoot[1]} L ${apex[0]} ${apex[1] + 6} L ${lFoot[0]} ${lFoot[1]} Z`} fill={nodeFill} />
        </g>
      )}

      {(variant === 'neural' || variant === 'stroke') && (
        <g fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M ${lFoot[0]} ${lFoot[1]} L ${apex[0]} ${apex[1]} L ${rFoot[0]} ${rFoot[1]}`} />
          <path d={`M ${cbL[0]} ${cbL[1]} L ${cbR[0]} ${cbR[1]}`} />
        </g>
      )}

      {variant === 'neural' && (
        <g fill="none" stroke={`url(#g-${gid})`} strokeWidth="1.4" strokeLinecap="round" opacity="0.9">
          <path d="M 6 58 C 14 30, 26 6, 32 4 C 38 6, 50 30, 58 58" />
          <path d="M 14 44 C 22 36, 42 36, 50 44" strokeDasharray="0.1 2.6" opacity="0.7" />
        </g>
      )}

      {variant === 'neural' && (
        <g>
          {[apex, lFoot, rFoot, cbL, cbR].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="3.2" fill={nodeCore} stroke={nodeFill} strokeWidth="1.6" />
              <circle cx={x} cy={y} r="1.1" fill={theme.glow} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// HeadMark — finalized corporate mark (raster). Profile silhouette with
// internal circuit traces in the brand gradient, ringed by an orange circle.
// Rendered from assets/adopt-ai-mark.png; props kept for API compatibility.
// ────────────────────────────────────────────────────────────
function HeadMark({
  size = 120,
  theme = THEMES.sunrise,
  variant = 'solid',         // 'solid' | 'outline' (ignored — image is fixed)
  showCircuits = true,       // ignored — image is fixed
  gradient = true,           // ignored — image is fixed
}) {
  // Native size 1024×624 (head-only crop from brand PDF); preserve aspect.
  const aspect = 624 / 1024;
  return (
    <img
      src="assets/adopt-ai-mark.png"
      alt="Adopt AI"
      width={size}
      height={Math.round(size * aspect)}
      style={{ display: 'block', objectFit: 'contain', userSelect: 'none' }}
      draggable={false}
    />
  );
}

// Legacy SVG implementation kept as _HeadMarkSVG in case future variants
// need a vector head; intentionally unused.
function _HeadMarkSVG({
  size = 120,
  theme = THEMES.sunrise,
  variant = 'solid',
  showCircuits = true,
  gradient = true,
}) {
  const gid = React.useId().replace(/[^a-z0-9]/gi, '');
  const t = theme;
  const fill = gradient ? `url(#hg-${gid})` : t.accent;
  const wire = t.surface;
  const isOutline = variant === 'outline';

  // Profile silhouette path, clockwise from top of crown.
  const headPath = [
    'M 148 18',
    // crown → forehead → brow
    'C 105 14, 65 35, 55 95',
    'C 53 105, 50 112, 46 116',
    // brow ridge → nose bridge → nose tip
    'C 40 121, 32 128, 28 138',
    // tip → under nose
    'C 26 145, 35 152, 50 152',
    // upper lip
    'C 56 156, 60 158, 58 162',
    // mouth → lower lip
    'C 56 168, 56 174, 60 178',
    // lower lip → chin
    'C 62 184, 64 190, 70 198',
    // chin → under jaw
    'C 75 204, 84 210, 95 212',
    // jaw → top of neck
    'C 105 215, 115 218, 116 226',
    'L 118 240',
    // bottom of frame → back of neck
    'L 175 240',
    'L 175 175',
    // back of head curve
    'C 175 145, 200 130, 195 90',
    'C 191 50, 185 25, 148 18',
    'Z',
  ].join(' ');

  const circuitStrokeColor = isOutline ? t.accent : wire;

  return (
    <svg width={size} height={size * (240 / 220)} viewBox="0 0 220 240" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`hg-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.accent} />
          <stop offset="1" stopColor={t.glow} />
        </linearGradient>
        <clipPath id={`hc-${gid}`}>
          <path d={headPath} />
        </clipPath>
      </defs>

      {isOutline
        ? <path d={headPath} fill="none" stroke={t.accent} strokeWidth="3" strokeLinejoin="round" />
        : <path d={headPath} fill={fill} />}

      {showCircuits && (
        <g clipPath={`url(#hc-${gid})`}>
          {/* traces — orthogonal, rounded joins */}
          <g stroke={circuitStrokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isOutline ? 0.9 : 0.96}>
            <path d="M 90 50 L 130 50 L 130 40" />
            <path d="M 130 50 L 158 50 L 158 70" />
            <path d="M 90 50 L 90 85 L 130 85" />
            <path d="M 130 85 L 162 85 L 162 102" />
            <path d="M 130 85 L 130 112" />
            <path d="M 130 112 L 105 112 L 105 138" />
            <path d="M 130 112 L 157 112 L 157 130" />
            <path d="M 90 85 L 90 132 L 80 132" />
            <path d="M 80 132 L 80 162" />
            <path d="M 105 138 L 130 138 L 130 158" />
            <path d="M 130 158 L 108 158 L 108 178" />
            <path d="M 157 130 L 157 152 L 140 152" />
          </g>
          {/* nodes */}
          <g fill={circuitStrokeColor}>
            <circle cx="130" cy="40" r="3" />
            <circle cx="90" cy="50" r="3" />
            <circle cx="158" cy="70" r="3.5" />
            <circle cx="162" cy="102" r="3" />
            <circle cx="105" cy="112" r="3" />
            <circle cx="157" cy="130" r="3" />
            <circle cx="157" cy="152" r="3" />
            <circle cx="140" cy="152" r="2.5" />
            <circle cx="105" cy="138" r="2.5" />
            <circle cx="130" cy="158" r="3" />
            <circle cx="108" cy="178" r="3" />
            <circle cx="80" cy="132" r="3" />
            <circle cx="80" cy="162" r="3" />
          </g>
          {/* central hub + glow ring + bright core */}
          <circle cx="130" cy="85" r="11" fill="none" stroke={circuitStrokeColor} strokeWidth="1" opacity="0.45" />
          <circle cx="130" cy="85" r="6" fill={circuitStrokeColor} />
          <circle cx="130" cy="85" r="2.2" fill={t.glow} />
        </g>
      )}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Logotype — six lockup styles. The default ('profile') is the head
// silhouette stacked over "ADOPT AI" caps. Other styles still use NeuralA.
// horizontal lockup with an emphasis hit on "AI". 'stacked' is the hero
// block form. 'integrated' embeds the mark as the leading A. 'wordmark'
// drops the mark entirely. 'badge' is a compact circular monogram.
// ────────────────────────────────────────────────────────────
function Logotype({
  theme = THEMES.sunrise,
  size = 28,
  style = 'profile',
  markVariant = 'neural',
  gradient = true,
}) {
  const t = theme;
  const accentText = {
    background: `linear-gradient(90deg, ${(t.gradientStops || [t.accent, t.glow]).join(', ')})`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  };

  // 'profile' — head mark stacked over ADOPT AI caps (new default).
  if (style === 'profile') {
    const head = size * 4.2;
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.6 }}>
        <HeadMark size={head} theme={t} gradient={gradient}
          variant={markVariant === 'stroke' ? 'outline' : 'solid'} />
        <div style={{
          fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: size,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: t.deep,
          display: 'inline-flex', gap: size * 0.55, lineHeight: 1,
        }}>
          <span>ADOPT</span>
          <span style={accentText}>AI</span>
        </div>
      </div>
    );
  }

  // 'profile-inline' — head mark to the left of ADOPT AI caps. For headers,
  // business cards, app sidebars — anywhere the stacked form is too tall.
  if (style === 'profile-inline') {
    const head = size * 2.4;
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.6 }}>
        <HeadMark size={head} theme={t} gradient={gradient}
          variant={markVariant === 'stroke' ? 'outline' : 'solid'} />
        <div style={{
          fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: size,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: t.deep,
          display: 'inline-flex', gap: size * 0.5, lineHeight: 1,
        }}>
          <span>ADOPT</span>
          <span style={accentText}>AI</span>
        </div>
      </div>
    );
  }

  if (style === 'wordmark') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'baseline',
        fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: size,
        letterSpacing: '-0.045em', lineHeight: 1, color: t.deep,
      }}>
        <span>Adopt</span>
        <span style={{ ...accentText, marginLeft: size * 0.16 }}>AI.</span>
      </div>
    );
  }

  if (style === 'stacked') {
    // Block lockup — mark left, ADOPT small-caps over big AI hero.
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.55, color: t.deep }}>
        <NeuralA size={size * 2.6} theme={t} variant={markVariant} gradient={gradient} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: size * 0.08, lineHeight: 1 }}>
          <div style={{
            fontFamily: theme.fontDisplay, fontWeight: 500, fontSize: size * 0.62,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: t.soft,
          }}>
            Adopt
          </div>
          <div style={{
            fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: size * 2.05,
            letterSpacing: '-0.05em', display: 'flex', alignItems: 'baseline', gap: size * 0.12,
          }}>
            <span style={accentText}>AI</span>
            <span style={{
              width: size * 1.6, height: 2,
              background: `linear-gradient(90deg, ${(t.gradientStops || [t.accent, t.glow]).join(', ')})`,
              alignSelf: 'center', borderRadius: 2,
              transform: `translateY(${-size * 0.18}px)`,
            }} />
          </div>
        </div>
      </div>
    );
  }

  if (style === 'integrated') {
    // The mark IS the leading "A" of Adopt. Cap height matched to font.
    // Sora cap-height ≈ 0.72 em; mark visual cap ≈ size * 1.0.
    const markSize = size * 1.34;
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 0, color: t.deep,
        fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: size,
        letterSpacing: '-0.04em', lineHeight: 1,
      }}>
        <NeuralA size={markSize} theme={t} variant={markVariant} gradient={gradient} />
        <span style={{ marginLeft: -size * 0.06 }}>dopt</span>
        <span style={{ marginLeft: size * 0.22 }}>
          <span style={accentText}>AI</span>
        </span>
      </div>
    );
  }

  if (style === 'badge') {
    // Compact circular badge — Neural A inside a tinted disc with a hairline.
    return (
      <div style={{
        width: size * 2.4, height: size * 2.4, borderRadius: '50%',
        background: t.isDark ? 'rgba(245,247,250,0.04)' : 'rgba(194,65,12,0.06)',
        border: `1px solid ${t.line}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <NeuralA size={size * 1.55} theme={t} variant={markVariant} gradient={gradient} />
        <svg width={size * 2.4} height={size * 2.4} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <path id={`circ-${size}`} d="M 50 50 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0" />
          </defs>
          <text fontFamily="ui-monospace, monospace" fontSize="5.2" fill={t.soft} letterSpacing="0.34em">
            <textPath href={`#circ-${size}`} startOffset="0%">ADOPT · AI · AUTOMATION · SYSTEMS · </textPath>
          </text>
        </svg>
      </div>
    );
  }

  // 'lockup' (default) — refined inline lockup with strong AI hit.
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.48, color: t.deep }}>
      <NeuralA size={size * 1.4} theme={t} variant={markVariant} gradient={gradient} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: size * 0.18, lineHeight: 1 }}>
        <span style={{
          fontFamily: theme.fontDisplay, fontWeight: 500, fontSize: size,
          letterSpacing: '-0.025em',
        }}>Adopt</span>
        <span style={{
          fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: size * 1.08,
          letterSpacing: '-0.04em', ...accentText,
        }}>AI</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// BlueprintBG — themed grid backdrop.
// ────────────────────────────────────────────────────────────
function BlueprintBG({ theme, density = 32, style, children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: theme.surface,
      backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
      backgroundSize: `${density}px ${density}px`,
      ...style,
    }}>
      {children}
    </div>
  );
}

Object.assign(window, { NeuralA, HeadMark, Logotype, BlueprintBG, THEMES });

// ─── Font pairings — display + body + mono ──────────────────
const FONT_PAIRINGS = {
  premium:   { id: 'premium',   name: 'Premium (Satoshi)',
               display: "'Satoshi', system-ui, sans-serif", body: "'Inter', sans-serif",
               mono: "'JetBrains Mono', ui-monospace, monospace",
               note: 'Satoshi · Inter — premium, calm, enterprise' },
  geometric: { id: 'geometric', name: 'Geometric',
               display: "'Sora', sans-serif", body: "'Inter', sans-serif",
               mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
               note: 'Sora · Inter — clean, modern, tech-forward' },
  editorial: { id: 'editorial', name: 'Editorial',
               display: "'Instrument Serif', Georgia, serif", body: "'Inter', sans-serif",
               mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
               note: 'Instrument Serif · Inter — premium, considered' },
  tech:      { id: 'tech',      name: 'Tech',
               display: "'Space Grotesk', sans-serif", body: "'IBM Plex Mono', ui-monospace, monospace",
               mono: "'IBM Plex Mono', ui-monospace, monospace",
               note: 'Space Grotesk · IBM Plex Mono — engineering-led' },
  swiss:     { id: 'swiss',     name: 'Swiss',
               display: "'Manrope', sans-serif", body: "'Manrope', sans-serif",
               mono: "'JetBrains Mono', ui-monospace, monospace",
               note: 'Manrope — quiet, neutral, monolith' },
  expressive:{ id: 'expressive',name: 'Expressive',
               display: "'Fraunces', Georgia, serif", body: "'DM Sans', sans-serif",
               mono: "'JetBrains Mono', ui-monospace, monospace",
               note: 'Fraunces · DM Sans — warm, distinctive' },
  product:   { id: 'product',   name: 'Product',
               display: "'DM Sans', sans-serif", body: "'DM Sans', sans-serif",
               mono: "'JetBrains Mono', ui-monospace, monospace",
               note: 'DM Sans — friendly, software-ready' },
};
Object.assign(window, { FONT_PAIRINGS });
