// site/atoms.jsx — shared atoms for Adopt AI site + app
// Brand: ember palette (cream + ember gradient), Sora/Inter
// Logo: assets/adopt-ai-mark.png (extracted from brand PDF)

const BRAND = {
  // Light surfaces
  cream:    '#F8F4EE',
  paper:    '#FFFFFF',
  // Dark surfaces
  ink:      '#3D1A0F',
  void:     '#0F0805',
  obsidian: '#1A0F08',
  smoke:    '#241510',
  // Accent system
  burgundy: '#A82A28',
  accent:   '#D9462C', // intelligence orange
  glow:     '#E67E22', // human coral
  amber:    '#D6912A',
  gold:     '#C68A1F',
  // Utility
  hairline: 'rgba(61,26,15,0.12)',
  hairlineDark: 'rgba(248,244,238,0.14)',
  // Gradient stops
  stops:    ['#A82A28', '#D9462C', '#E67E22', '#D6912A', '#C68A1F'],
};

const FONTS = {
  display: "'Sora', system-ui, sans-serif",
  body:    "'Inter', system-ui, sans-serif",
  mono:    "'IBM Plex Mono', ui-monospace, monospace",
  editorial: "'Instrument Serif', Georgia, serif",
};

// ─── primitives ─────────────────────────────────────────────

function emberText(stops = BRAND.stops, angle = '90deg') {
  return {
    background: `linear-gradient(${angle}, ${stops.join(', ')})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };
}

function Eyebrow({ children, color = BRAND.accent, style }) {
  return (
    <div style={{
      fontFamily: FONTS.mono, fontSize: 11, color,
      letterSpacing: '0.22em', textTransform: 'uppercase',
      ...style,
    }}>{children}</div>
  );
}

function Button({ children, variant = 'primary', size = 'md', icon, style, dark = false }) {
  const sizes = {
    sm: { px: 14, py: 8, fs: 13 },
    md: { px: 18, py: 12, fs: 14 },
    lg: { px: 24, py: 16, fs: 15 },
  };
  const s = sizes[size];
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: `${s.py}px ${s.px}px`,
    fontFamily: FONTS.display, fontWeight: 500, fontSize: s.fs,
    letterSpacing: '-0.005em',
    borderRadius: 999, cursor: 'pointer', userSelect: 'none',
    transition: 'transform .15s, box-shadow .15s',
  };
  if (variant === 'primary') {
    return (
      <div style={{
        ...base,
        background: `linear-gradient(120deg, ${BRAND.burgundy}, ${BRAND.accent} 45%, ${BRAND.glow})`,
        color: '#FFF8F0',
        boxShadow: '0 8px 22px -8px rgba(168,42,40,0.55), inset 0 1px 0 rgba(255,255,255,0.25)',
        ...style,
      }}>
        {children}
        {icon !== undefined ? icon : <span style={{ fontSize: s.fs + 1, marginLeft: 2 }}>→</span>}
      </div>
    );
  }
  if (variant === 'ghost') {
    return (
      <div style={{
        ...base,
        background: 'transparent',
        color: dark ? BRAND.cream : BRAND.ink,
        border: `1px solid ${dark ? BRAND.hairlineDark : BRAND.hairline}`,
        ...style,
      }}>{children}{icon}</div>
    );
  }
  if (variant === 'dark') {
    return (
      <div style={{
        ...base,
        background: BRAND.ink,
        color: BRAND.cream,
        ...style,
      }}>{children}{icon !== undefined ? icon : <span style={{ fontSize: s.fs + 1 }}>→</span>}</div>
    );
  }
  return null;
}

// ─── Logo + brand block ─────────────────────────────────────

function BrandMark({ size = 36, withType = true, dark = false, tagline = false, mono = false }) {
  // Pick the right asset for the surface:
  //   - light bg, color   → primary (orange gradient)
  //   - dark bg, color    → primary (gradient pops on dark)
  //   - light bg + mono   → ink mono
  //   - dark bg + mono    → cream mono
  const src = mono
    ? (dark ? 'assets/adopt-ai-mark-cream.png' : 'assets/adopt-ai-mark-ink.png')
    : 'assets/adopt-ai-mark.png';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.4 }}>
      <img src={src} alt="Adopt AI"
        width={size} height={Math.round(size * 624 / 1024)}
        style={{ display: 'block', objectFit: 'contain', userSelect: 'none' }}
        draggable={false}
      />
      {withType && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div style={{
            fontFamily: FONTS.display, fontWeight: 700, fontSize: size * 0.42,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: dark ? BRAND.cream : BRAND.ink,
            display: 'inline-flex', gap: size * 0.18,
          }}>
            <span>ADOPT</span>
            <span style={emberText()}>AI</span>
          </div>
          {tagline && (
            <div style={{
              fontFamily: FONTS.mono, fontSize: size * 0.21,
              color: dark ? 'rgba(248,244,238,0.55)' : 'rgba(61,26,15,0.55)',
              letterSpacing: '0.18em', marginTop: size * 0.18, textTransform: 'uppercase',
            }}>Turn AI into your advantage</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Nav (web) ──────────────────────────────────────────────

function SiteNav({ dark = false, current = 'home', sticky = true, glass = false }) {
  const ink = dark ? BRAND.cream : BRAND.ink;
  const soft = dark ? 'rgba(248,244,238,0.66)' : 'rgba(61,26,15,0.66)';
  const items = ['Services', 'Work', 'Resources', 'Blog', 'About', 'Pricing'];
  return (
    <div style={{
      position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 50,
      padding: '20px 56px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: glass ? (dark ? 'rgba(15,8,5,0.55)' : 'rgba(248,244,238,0.65)') : 'transparent',
      backdropFilter: glass ? 'blur(16px) saturate(140%)' : 'none',
      WebkitBackdropFilter: glass ? 'blur(16px) saturate(140%)' : 'none',
      borderBottom: glass ? `1px solid ${dark ? BRAND.hairlineDark : BRAND.hairline}` : 'none',
    }}>
      <BrandMark size={30} dark={dark} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 28,
        fontFamily: FONTS.body, fontSize: 14, color: soft }}>
        {items.map((it) => (
          <div key={it} style={{
            color: it.toLowerCase() === current ? ink : soft,
            fontWeight: it.toLowerCase() === current ? 600 : 450,
          }}>{it}</div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontFamily: FONTS.body, fontSize: 14, color: soft }}>Sign in</div>
        <Button size="sm" variant={dark ? 'primary' : 'dark'}>Book a call</Button>
      </div>
    </div>
  );
}

// ─── Footer ─────────────────────────────────────────────────

function SiteFooter({ dark = true }) {
  const ink = dark ? BRAND.cream : BRAND.ink;
  const soft = dark ? 'rgba(248,244,238,0.6)' : 'rgba(61,26,15,0.62)';
  const faint = dark ? 'rgba(248,244,238,0.42)' : 'rgba(61,26,15,0.42)';
  const line = dark ? BRAND.hairlineDark : BRAND.hairline;
  const cols = [
    ['Services', ['Workflow agents', 'Support routing', 'Document intelligence', 'Custom fine-tuning', 'Integration']],
    ['Company',  ['About', 'Careers', 'Press', 'Contact', 'Client portal']],
    ['Resources', ['Whitepapers', 'Blog', 'Playbooks', 'Pricing', 'Security']],
  ];
  return (
    <div style={{
      background: dark ? BRAND.void : BRAND.cream,
      color: ink, padding: '80px 56px 36px',
      fontFamily: FONTS.body,
      borderTop: `1px solid ${line}`,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 56 }}>
        <div>
          <BrandMark size={36} dark={dark} />
          <div style={{ fontSize: 14, color: soft, marginTop: 22, maxWidth: 320, lineHeight: 1.55 }}>
            Turn AI into your competitive advantage. We design, ship, and run
            production-grade automation systems for enterprise teams.
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: faint, marginTop: 28, letterSpacing: '0.12em' }}>
            500 ENTERPRISE WAY, SUITE 100 · ORLANDO, FL 32801
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: faint, marginTop: 6, letterSpacing: '0.12em' }}>
            HELLO@ADOPTAI.COM · +1 (555) 382-3830
          </div>
        </div>
        {cols.map(([h, links]) => (
          <div key={h}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: ink, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18 }}>{h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map((l) => (
                <div key={l} style={{ fontSize: 14, color: soft }}>{l}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 64, paddingTop: 24, borderTop: `1px solid ${line}`,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: FONTS.mono, fontSize: 11, color: faint, letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        <div>© 2026 Adopt AI Agency Ltd. · Master kit v1.0</div>
        <div style={{ display: 'flex', gap: 28 }}>
          <span>Terms</span><span>Privacy</span><span>Security</span><span>SOC 2 Type II</span>
        </div>
      </div>
    </div>
  );
}

// ─── Decorative — orbs, rings, mesh (the "3D / Seedance" flavour) ───

function AmbientOrbs({ intensity = 1, dark = false, seed = 0, style }) {
  // Three blurred radial gradients that drift slowly. Pure CSS, no canvas.
  const o = intensity;
  const aOpa = dark ? 0.55 : 0.42;
  const orbs = [
    { left: '-8%',  top: '-12%', size: 620, c1: BRAND.burgundy, c2: BRAND.accent,   o: 0.55 * aOpa, dur: 28 },
    { left: '62%',  top: '-18%', size: 720, c1: BRAND.glow,     c2: BRAND.amber,    o: 0.50 * aOpa, dur: 34 },
    { left: '38%',  top:  '52%', size: 580, c1: BRAND.accent,   c2: BRAND.gold,     o: 0.40 * aOpa, dur: 40 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style }}>
      {orbs.map((or, i) => (
        <div key={i} style={{
          position: 'absolute', left: or.left, top: or.top,
          width: or.size, height: or.size,
          background: `radial-gradient(circle at 35% 35%, ${or.c1} 0%, ${or.c2} 35%, transparent 70%)`,
          filter: `blur(${dark ? 70 : 88}px)`,
          opacity: or.o * o,
          animation: `orbDrift${i} ${or.dur}s ease-in-out infinite alternate`,
          mixBlendMode: dark ? 'screen' : 'multiply',
        }} />
      ))}
      <style>{`
        @keyframes orbDrift0 { 0%{transform:translate(0,0)} 100%{transform:translate(60px,40px)} }
        @keyframes orbDrift1 { 0%{transform:translate(0,0)} 100%{transform:translate(-50px,30px)} }
        @keyframes orbDrift2 { 0%{transform:translate(0,0)} 100%{transform:translate(30px,-40px)} }
      `}</style>
    </div>
  );
}

function AmbientRings({ size = 480, dark = false, style }) {
  // Concentric rings + dotted orbital arcs. Rotates slowly.
  const stroke = dark ? 'rgba(248,244,238,0.10)' : 'rgba(61,26,15,0.10)';
  const accentStroke = dark ? 'rgba(230,126,34,0.35)' : 'rgba(217,70,44,0.35)';
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'ringSpin 80s linear infinite',
      }}>
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              {BRAND.stops.map((c, i) => (
                <stop key={i} offset={i / (BRAND.stops.length - 1)} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="95" fill="none" stroke={stroke} strokeWidth="0.4" />
          <circle cx="100" cy="100" r="78" fill="none" stroke={stroke} strokeWidth="0.4" />
          <circle cx="100" cy="100" r="60" fill="none" stroke={accentStroke} strokeWidth="0.6" strokeDasharray="0.6 4" />
          <circle cx="100" cy="100" r="42" fill="none" stroke="url(#ring-grad)" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.8" />
          {/* orbit nodes */}
          {[
            [95, 0], [78, 60], [60, 120], [42, 200], [95, 280],
          ].map(([r, deg], i) => {
            const a = (deg * Math.PI) / 180;
            const x = 100 + r * Math.cos(a);
            const y = 100 + r * Math.sin(a);
            return <circle key={i} cx={x} cy={y} r="1.6" fill="url(#ring-grad)" />;
          })}
        </svg>
      </div>
      <style>{`
        @keyframes ringSpin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
        @keyframes ringSpinRev { 0%{transform:rotate(0)} 100%{transform:rotate(-360deg)} }
      `}</style>
    </div>
  );
}

function NeuralMesh({ rows = 8, cols = 14, dark = false, style }) {
  // A subtle dotted lattice with random connecting lines. Pure SVG.
  const w = cols * 28, h = rows * 28;
  const nodes = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    nodes.push([c * 28 + 14, r * 28 + 14]);
  }
  const dot = dark ? 'rgba(248,244,238,0.18)' : 'rgba(61,26,15,0.16)';
  const link = dark ? 'rgba(230,126,34,0.22)' : 'rgba(217,70,44,0.18)';
  // Deterministic pseudo-random links
  const lines = [];
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 18; i++) {
    const a = Math.floor(rnd() * nodes.length);
    const b = Math.floor(rnd() * nodes.length);
    if (a !== b) lines.push([nodes[a], nodes[b]]);
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" style={style} preserveAspectRatio="xMidYMid slice">
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

function FloatingChip({ children, x, y, rot = 0, delay = 0, dark = false }) {
  // Glassy floating data chip — used inside cinematic hero
  return (
    <div style={{
      position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`,
      padding: '10px 14px', borderRadius: 12,
      background: dark ? 'rgba(36,21,16,0.7)' : 'rgba(255,255,255,0.7)',
      border: `1px solid ${dark ? BRAND.hairlineDark : BRAND.hairline}`,
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      boxShadow: dark
        ? '0 18px 40px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)'
        : '0 18px 40px -20px rgba(61,26,15,0.25), inset 0 1px 0 rgba(255,255,255,0.6)',
      fontFamily: FONTS.body, fontSize: 12,
      color: dark ? BRAND.cream : BRAND.ink,
      animation: `chipFloat 7s ease-in-out infinite alternate`,
      animationDelay: `${delay}s`,
      whiteSpace: 'nowrap', zIndex: 5,
    }}>
      {children}
      <style>{`@keyframes chipFloat { 0%{transform:translateY(0) rotate(${rot}deg)} 100%{transform:translateY(-10px) rotate(${rot}deg)} }`}</style>
    </div>
  );
}

// Live "agent running" pill — used across home variants
function AgentPill({ label, status = 'running', count, dark = false }) {
  const dotColor = status === 'running' ? '#2BAE5C' : status === 'queue' ? BRAND.gold : BRAND.accent;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', borderRadius: 999,
      background: dark ? 'rgba(248,244,238,0.06)' : 'rgba(61,26,15,0.04)',
      border: `1px solid ${dark ? BRAND.hairlineDark : BRAND.hairline}`,
      fontFamily: FONTS.mono, fontSize: 11.5, letterSpacing: '0.06em',
      color: dark ? BRAND.cream : BRAND.ink,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: dotColor,
        boxShadow: `0 0 0 3px ${dotColor}33`,
        animation: 'agentPulse 1.4s ease-in-out infinite',
      }} />
      {label}
      {count !== undefined && <span style={{ opacity: 0.5, marginLeft: 4 }}>· {count}</span>}
      <style>{`@keyframes agentPulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  );
}

// Mock metric stat
function Metric({ value, label, accent = false, dark = false }) {
  return (
    <div>
      <div style={{
        fontFamily: FONTS.display, fontWeight: 600, fontSize: 56, lineHeight: 1,
        letterSpacing: '-0.04em',
        ...(accent ? emberText() : { color: dark ? BRAND.cream : BRAND.ink }),
      }}>{value}</div>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 11,
        color: dark ? 'rgba(248,244,238,0.55)' : 'rgba(61,26,15,0.55)',
        letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 10,
      }}>{label}</div>
    </div>
  );
}

// Card with subtle gradient border
function GlassCard({ children, dark = false, style, padding = 28 }) {
  return (
    <div style={{
      position: 'relative', padding,
      background: dark
        ? 'linear-gradient(180deg, rgba(36,21,16,0.85), rgba(26,15,8,0.7))'
        : 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75))',
      border: `1px solid ${dark ? BRAND.hairlineDark : BRAND.hairline}`,
      borderRadius: 18,
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      boxShadow: dark
        ? '0 24px 60px -20px rgba(0,0,0,0.45)'
        : '0 24px 60px -28px rgba(61,26,15,0.18)',
      ...style,
    }}>{children}</div>
  );
}

// Bento divider (gradient hairline)
function Hairline({ dark = false, style }) {
  return (
    <div style={{
      height: 1,
      background: dark
        ? `linear-gradient(90deg, transparent, ${BRAND.hairlineDark}, transparent)`
        : `linear-gradient(90deg, transparent, ${BRAND.hairline}, transparent)`,
      ...style,
    }} />
  );
}

Object.assign(window, {
  BRAND, FONTS,
  emberText, Eyebrow, Button,
  BrandMark, SiteNav, SiteFooter,
  AmbientOrbs, AmbientRings, NeuralMesh,
  FloatingChip, AgentPill, Metric, GlassCard, Hairline,
});
