// Artboards for Adopt AI brand identity canvas — themed.
// Every artboard takes a `theme` object (from window.THEMES) plus the
// shared knobs (markVariant, wordmarkStyle, gradient, density).

// ─── shared atoms ───────────────────────────────────────────
function Caps({ theme, children, style }) {
  return (
    <span style={{
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: theme.faint, ...style,
    }}>{children}</span>
  );
}
function CornerTick({ corner = 'tl', color }) {
  const m = {
    tl: { top: 8, left: 8, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    tr: { top: 8, right: 8, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` },
    bl: { bottom: 8, left: 8, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    br: { bottom: 8, right: 8, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` },
  }[corner];
  return <div style={{ position: 'absolute', width: 14, height: 14, ...m }} />;
}
function ArtboardChrome({ theme, label }) {
  const tick = theme.line;
  return (
    <>
      <CornerTick corner="tl" color={tick} />
      <CornerTick corner="tr" color={tick} />
      <CornerTick corner="bl" color={tick} />
      <CornerTick corner="br" color={tick} />
      {label && (
        <div style={{ position: 'absolute', top: 14, right: 18 }}>
          <Caps theme={theme}>{label}</Caps>
        </div>
      )}
    </>
  );
}

// ─── 1. Primary Mark (with construction) ────────────────────
function AB_PrimaryMark({ theme, markVariant, gradient, density }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="01 · Primary Mark" />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '48px 56px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 64 }}>
          {/* head mark with construction frame */}
          <div style={{ position: 'relative', width: 360, height: 392 }}>
            {/* construction frame */}
            <svg viewBox="0 0 220 240" width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <g stroke={theme.accent} strokeWidth="0.5" opacity="0.32" fill="none">
                {Array.from({ length: 12 }, (_, i) => (
                  <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="240" />
                ))}
                {Array.from({ length: 13 }, (_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 20} x2="220" y2={i * 20} />
                ))}
              </g>
              <g stroke={theme.accent} strokeWidth="0.7" fill="none" opacity="0.55">
                <line x1="0" y1="234" x2="220" y2="234" />
                <line x1="0" y1="231" x2="0" y2="237" />
                <line x1="220" y1="231" x2="220" y2="237" />
                <line x1="214" y1="0" x2="214" y2="240" />
                <line x1="211" y1="0" x2="217" y2="0" />
                <line x1="211" y1="240" x2="217" y2="240" />
              </g>
              <g fontFamily="ui-monospace, monospace" fontSize="6" fill={theme.accent}>
                <text x="110" y="234" textAnchor="middle" dy="-2">220</text>
                <text x="214" y="120" textAnchor="middle" transform="rotate(-90 214 120)" dy="-2">240</text>
              </g>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeadMark size={300} theme={theme} variant={markVariant === 'stroke' ? 'outline' : 'solid'} gradient={gradient} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 320 }}>
            <Caps theme={theme}>Construction</Caps>
            <div style={{ fontFamily: theme.fontDisplay, fontSize: 24, fontWeight: 500, color: theme.deep, lineHeight: 1.25, letterSpacing: '-0.015em' }}>
              The Adopt AI head.<br />Human profile, neural interior.
            </div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 13.5, color: theme.soft, lineHeight: 1.55 }}>
              A stylized profile faces forward into the work. Twelve circuit nodes and a glowing
              central hub trace the inside — automation made human. Drawn on a 220 × 240 grid;
              circuit traces sit on 5-unit increments.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 }}>
              {[['Grid', '220×240'], ['Stroke', '2u'], ['Nodes', '12 + hub'], ['Min size', '32px']].map(([k, v]) => (
                <div key={k} style={{ borderTop: `1px solid ${theme.line}`, paddingTop: 6 }}>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: theme.faint }}>{k}</div>
                  <div style={{ fontFamily: theme.fontDisplay, fontSize: 16, color: theme.deep, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. Mark variants ───────────────────────────────────────
function AB_MarkVariants({ theme, gradient, density, wordmarkStyle }) {
  const items = [
    { key: 'solid',   t: 'Solid',     note: 'Primary. Use everywhere there is room.' },
    { key: 'outline', t: 'Outline',   note: 'Reverse on photographs / dark surfaces.' },
    { key: 'plain',   t: 'No traces', note: 'Silhouette only — favicons, dense UI.' },
    { key: 'wm',      t: 'Wordmark',  note: 'Inline lockup. Press / email signatures.' },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="02 · Mark Lockups" />
      <div style={{ position: 'absolute', inset: '48px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {items.map((it) => (
          <div key={it.key} style={{ position: 'relative', border: `1px solid ${theme.line}`, borderRadius: 8, display: 'flex', flexDirection: 'column', background: theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.35)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, minHeight: 220 }}>
              {it.key === 'wm' && <Logotype theme={theme} size={20} style="profile-inline" gradient={gradient} />}
              {it.key === 'solid' && <HeadMark size={140} theme={theme} variant="solid" gradient={gradient} />}
              {it.key === 'outline' && <HeadMark size={140} theme={theme} variant="outline" gradient={gradient} />}
              {it.key === 'plain' && <HeadMark size={140} theme={theme} variant="solid" gradient={gradient} showCircuits={false} />}
            </div>
            <div style={{ borderTop: `1px solid ${theme.line}`, padding: '14px 16px', minHeight: 88 }}>
              <Caps theme={theme} style={{ color: theme.accent, opacity: 0.95 }}>{it.t}</Caps>
              <div style={{ fontFamily: theme.fontBody, fontSize: 12.5, color: theme.soft, marginTop: 6, lineHeight: 1.45 }}>{it.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 3. Color system ────────────────────────────────────────
function AB_Color({ theme, density }) {
  // Show the THIS-theme palette: deep, accent, glow, surface/bg, neutral
  const swatches = [
    { name: 'Deep Ink',     hex: theme.deep,    role: 'Headlines · primary type · contrast' },
    { name: 'Brand Accent', hex: theme.accent,  role: 'CTAs · interactive · brand voice' },
    { name: 'Glow',         hex: theme.glow,    role: 'Highlight · gradient anchor · joy' },
    { name: 'Canvas',       hex: theme.bg,      role: 'Page background · negative space' },
    { name: 'Surface',      hex: theme.surface, role: 'Cards · panels · raised UI' },
  ];
  const dark = theme.isDark;
  const valColor = (hex) => {
    // pick legible text color for the swatch
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.62 ? 'rgba(31,20,16,0.78)' : 'rgba(255,255,255,0.85)';
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="03 · Color System" />
      <div style={{ position: 'absolute', inset: '48px 56px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ fontFamily: theme.fontDisplay, fontSize: 34, fontWeight: 500, color: theme.deep, letterSpacing: '-0.025em' }}>Color</div>
          <div style={{ fontFamily: theme.fontBody, fontSize: 13.5, color: theme.soft, marginTop: 6 }}>
            A warm operational palette. Deep ink as voice, accent as action, glow as joy.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {swatches.map((c) => (
            <div key={c.name} style={{ borderRadius: 10, border: `1px solid ${theme.line}`, overflow: 'hidden', background: theme.surface }}>
              <div style={{ height: 180, background: c.hex, position: 'relative', borderBottom: c.hex.toLowerCase() === theme.surface.toLowerCase() ? `1px solid ${theme.line}` : 'none' }}>
                <div style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: 'ui-monospace, monospace', fontSize: 10, color: valColor(c.hex), letterSpacing: '0.02em' }}>{c.hex.toUpperCase()}</div>
              </div>
              <div style={{ padding: '14px 14px 18px' }}>
                <div style={{ fontFamily: theme.fontDisplay, fontSize: 15, fontWeight: 500, color: theme.deep, letterSpacing: '-0.01em' }}>{c.name}</div>
                <div style={{ fontFamily: theme.fontBody, fontSize: 11.5, color: theme.soft, marginTop: 8, lineHeight: 1.45 }}>{c.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div style={{ borderRadius: 10, border: `1px solid ${theme.line}`, overflow: 'hidden' }}>
            <div style={{ height: 92, background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, left: 16, fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.14em' }}>SIGNATURE GRADIENT · 90°</div>
              <div style={{ position: 'absolute', bottom: 10, left: 16, fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'rgba(31,20,16,0.72)' }}>{theme.accent.toUpperCase()} → {theme.glow.toUpperCase()}</div>
            </div>
          </div>
          <div style={{ borderRadius: 10, border: `1px solid ${theme.line}`, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, background: theme.surface }}>
            <Caps theme={theme} style={{ color: theme.accent }}>Contrast</Caps>
            <div style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.soft }}>{dark ? 'Platinum on Midnight · 16.4:1 · AAA' : 'Deep Ink on Canvas · 12.8:1 · AAA'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 4. Typography ──────────────────────────────────────────
function AB_Type({ theme, density }) {
  const accentText = {
    background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="04 · Typography" />
      <div style={{ position: 'absolute', inset: '48px 56px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <Caps theme={theme}>H1 · Display Bold · 64 / −2%</Caps>
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 64, lineHeight: 1.02, letterSpacing: '-0.025em', color: theme.deep, marginTop: 10 }}>
              Turn AI into your<br />
              <span style={accentText}>competitive advantage.</span>
            </div>
          </div>
          <div>
            <Caps theme={theme}>H2 · Display SemiBold · 40</Caps>
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 600, fontSize: 40, lineHeight: 1.1, color: theme.deep, marginTop: 8, letterSpacing: '-0.015em' }}>
              Automation that earns its keep.
            </div>
          </div>
          <div>
            <Caps theme={theme}>H3 · Display Medium · 28</Caps>
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 500, fontSize: 28, color: theme.deep, marginTop: 8, letterSpacing: '-0.005em' }}>
              Where small teams meet enterprise tooling.
            </div>
          </div>
          <div>
            <Caps theme={theme}>Body · Text Regular · 16</Caps>
            <p style={{ fontFamily: theme.fontBody, fontSize: 16, color: theme.soft, lineHeight: 1.6, marginTop: 8, maxWidth: 540 }}>
              Adopt AI installs intelligent automation across operations — invoicing, support,
              lead routing, reporting — so the work moves while you sleep, and your team is
              freed to do what only humans can.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, borderLeft: `1px solid ${theme.line}`, paddingLeft: 32 }}>
          <div>
            <Caps theme={theme}>Primary · Display</Caps>
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 96, color: theme.deep, lineHeight: 1, letterSpacing: '-0.04em', marginTop: 8 }}>Aa</div>
            <div style={{ fontFamily: theme.fontDisplay, fontSize: 22, color: theme.deep, marginTop: 4 }}>{(theme.fontDisplay || '').replace(/['"]/g, '').split(',')[0]}</div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 11.5, color: theme.faint, marginTop: 4 }}>Display · Headings · Brand voice</div>
            <div style={{ fontFamily: theme.fontDisplay, fontSize: 13, color: theme.soft, marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 300 }}>Light</span>
              <span style={{ fontWeight: 400 }}>Regular</span>
              <span style={{ fontWeight: 500 }}>Medium</span>
              <span style={{ fontWeight: 600 }}>SemiBold</span>
              <span style={{ fontWeight: 700 }}>Bold</span>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${theme.line}`, paddingTop: 20 }}>
            <Caps theme={theme}>Secondary · Text</Caps>
            <div style={{ fontFamily: theme.fontBody, fontWeight: 600, fontSize: 96, color: theme.deep, lineHeight: 1, letterSpacing: '-0.04em', marginTop: 8 }}>Aa</div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 22, color: theme.deep, marginTop: 4 }}>{(theme.fontBody || '').replace(/['"]/g, '').split(',')[0]}</div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 11.5, color: theme.faint, marginTop: 4 }}>Text · Body · UI · Documentation</div>
          </div>
          <div style={{ borderTop: `1px solid ${theme.line}`, paddingTop: 14 }}>
            <Caps theme={theme}>Caption · Text Medium · 14</Caps>
            <div style={{ fontFamily: theme.fontBody, fontWeight: 500, fontSize: 14, color: theme.soft, marginTop: 8 }}>
              AI Automation · Workflow Systems · Business Intelligence
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 5. Voice & Messaging ───────────────────────────────────
const PILLARS = [
  ['Simplicity',     'AI made practical.'],
  ['Transformation', 'Replace manual workflows with intelligent systems.'],
  ['Edge',           'AI adoption becomes a business advantage.'],
  ['Scalability',    'Systems that grow with the business.'],
  ['Productivity',   'Automate the repetitive. Free the strategic.'],
];

function AB_Voice({ theme, density }) {
  const accentText = {
    background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="05 · Voice & Messaging" />
      <div style={{ position: 'absolute', inset: '56px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Caps theme={theme}>Tagline</Caps>
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 600, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.03em', color: theme.deep, marginTop: 16 }}>
              Turn AI into your{' '}
              <span style={accentText}>competitive advantage.</span>
            </div>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Caps theme={theme}>Alternates</Caps>
              {[
                'Practical AI. Real Results.',
                'Human-Centered Automation.',
                'AI Adoption Made Practical.',
                'Transform Work Intelligently.',
                'Smarter Operations Through AI.',
              ].map((t) => (
                <div key={t} style={{ fontFamily: theme.fontDisplay, fontSize: 19, color: theme.soft, letterSpacing: '-0.005em' }}>{t}</div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
            <div>
              <Caps theme={theme}>Sound like</Caps>
              <div style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.soft, marginTop: 6, lineHeight: 1.6 }}>
                Intelligent · Calm · Strategic<br />Confident · Practical · Human
              </div>
            </div>
            <div>
              <Caps theme={theme} style={{ color: '#B91C1C' }}>Not</Caps>
              <div style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.faint, marginTop: 6, lineHeight: 1.6, textDecoration: 'line-through', textDecorationColor: 'rgba(185,28,28,0.55)' }}>
                Overhype · Jargon soup<br />Aggressive · Robotic
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${theme.line}`, paddingLeft: 32 }}>
          <Caps theme={theme} style={{ marginBottom: 16 }}>Messaging pillars</Caps>
          {PILLARS.map(([k, v], i) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '38px 1fr', gap: 16, padding: '18px 0', borderBottom: i < PILLARS.length - 1 ? `1px solid ${theme.line}` : 'none' }}>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: theme.accent, paddingTop: 6 }}>0{i + 1}</div>
              <div>
                <div style={{ fontFamily: theme.fontDisplay, fontSize: 22, fontWeight: 500, color: theme.deep, letterSpacing: '-0.015em' }}>{k}</div>
                <div style={{ fontFamily: theme.fontBody, fontSize: 13.5, color: theme.soft, marginTop: 4, lineHeight: 1.55 }}>{v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 6. Business card (front + back) ────────────────────────
function BizCardFront({ theme, markVariant, wordmarkStyle, gradient }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: theme.surface,
      borderRadius: 10, overflow: 'hidden',
      boxShadow: theme.isDark
        ? `0 30px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px ${theme.line} inset`
        : `0 24px 50px -22px rgba(60,30,10,0.30), 0 0 0 1px ${theme.line} inset`,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 80% at 110% -20%, ${theme.accent}38, transparent 50%), radial-gradient(80% 60% at -10% 120%, ${theme.glow}30, transparent 55%)` }} />
      <div style={{ position: 'absolute', top: 28, left: 28 }}>
        <Logotype theme={theme} size={14} style="profile-inline" markVariant={markVariant} gradient={gradient} />
      </div>
      <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: theme.fontDisplay, fontWeight: 600, fontSize: 18, color: theme.deep, letterSpacing: '0.02em' }}>ASHOK BHATTA</div>
          <div style={{ fontFamily: theme.fontBody, fontSize: 11, color: theme.soft, marginTop: 4 }}>Founder &amp; AI Automation Strategist</div>
        </div>
        <div style={{ textAlign: 'right', fontFamily: 'ui-monospace, monospace', fontSize: 9.5, color: theme.soft, lineHeight: 1.7, letterSpacing: '0.04em' }}>
          <div>adopt.ai</div>
          <div>ashok@adopt.ai</div>
          <div>+1 415 555 0142</div>
        </div>
      </div>
    </div>
  );
}
function BizCardBack({ theme }) {
  const accentText = {
    background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  };
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: theme.surface, borderRadius: 10, overflow: 'hidden',
      boxShadow: theme.isDark
        ? `0 30px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px ${theme.line} inset`
        : `0 24px 50px -22px rgba(60,30,10,0.30), 0 0 0 1px ${theme.line} inset`,
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} viewBox="0 0 420 240" preserveAspectRatio="none">
        <defs>
          <radialGradient id={`bcg-${theme.id}`} cx="70%" cy="50%" r="60%">
            <stop offset="0" stopColor={theme.glow} stopOpacity="0.30" />
            <stop offset="1" stopColor={theme.glow} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="420" height="240" fill={`url(#bcg-${theme.id})`} />
        <g stroke={theme.accent} strokeWidth="0.4" opacity="0.32">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="240" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 60} x2="420" y2={i * 60} />
          ))}
        </g>
        <g fill={theme.accent}>
          {[[60,60],[120,180],[240,60],[300,120],[360,180],[180,120]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="2.4" />
          ))}
        </g>
        <g stroke={theme.accent} strokeWidth="0.8" fill="none" opacity="0.7">
          <path d="M60 60 L 240 60 L 300 120 L 360 180" />
          <path d="M120 180 L 180 120 L 300 120" />
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Caps theme={theme} style={{ color: theme.accent }}>Adopt AI</Caps>
        <div style={{ fontFamily: theme.fontDisplay, fontWeight: 500, fontSize: 26, lineHeight: 1.18, color: theme.deep, letterSpacing: '-0.025em' }}>
          Turn AI into your<br />
          <span style={accentText}>competitive advantage.</span>
        </div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9.5, color: theme.soft, letterSpacing: '0.08em' }}>
          AI AUTOMATION · WORKFLOW SYSTEMS · BUSINESS INTELLIGENCE
        </div>
      </div>
    </div>
  );
}
function AB_BizCard({ theme, markVariant, wordmarkStyle, gradient, density }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="06 · Business Card · 3.5 × 2 in" />
      <div style={{ position: 'absolute', inset: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center' }}>
          <div style={{ aspectRatio: '7 / 4', transform: 'rotate(-2.5deg)' }}>
            <BizCardFront theme={theme} markVariant={markVariant} wordmarkStyle={wordmarkStyle} gradient={gradient} />
          </div>
          <div style={{ aspectRatio: '7 / 4', transform: 'rotate(2.5deg)' }}>
            <BizCardBack theme={theme} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 8 }}>
          {[
            ['Stock',  '32pt natural cotton'],
            ['Finish', 'Matte + spot UV on mark'],
            ['Foil',   'Optional copper foil'],
            ['Bleed',  '0.125 in safe area'],
          ].map(([k, v]) => (
            <div key={k} style={{ borderTop: `1px solid ${theme.line}`, paddingTop: 8 }}>
              <Caps theme={theme}>{k}</Caps>
              <div style={{ fontFamily: theme.fontBody, fontSize: 12.5, color: theme.soft, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 7. Social banner ───────────────────────────────────────
function AB_Social({ theme, markVariant, wordmarkStyle, gradient, density }) {
  const accentText = {
    background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="07 · LinkedIn Banner · 1584 × 396" />
      <div style={{ position: 'absolute', inset: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 1', borderRadius: 10, overflow: 'hidden', background: theme.surface, boxShadow: theme.isDark ? `0 30px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px ${theme.line} inset` : `0 30px 60px -25px rgba(60,30,10,0.35), 0 0 0 1px ${theme.line} inset` }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(50% 90% at 78% 50%, ${theme.glow}38, transparent 60%), radial-gradient(40% 90% at 8% 50%, ${theme.accent}48, transparent 60%)` }} />
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} preserveAspectRatio="none" viewBox="0 0 1584 396">
            <g stroke={theme.accent} strokeWidth="0.4" opacity="0.3">
              {Array.from({ length: 33 }).map((_, i) => <line key={i} x1={i*48} y1="0" x2={i*48} y2="396" />)}
              {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i*48} x2="1584" y2={i*48} />)}
            </g>
            <g stroke={theme.accent} strokeWidth="1.3" fill="none" opacity="0.85">
              <path d="M 0 240 C 280 240, 360 110, 700 110 S 1300 320, 1584 320" />
              <path d="M 0 290 C 280 290, 360 200, 700 200 S 1300 80, 1584 80" opacity="0.45" strokeDasharray="2 6" />
            </g>
          </svg>
          <div style={{ position: 'absolute', inset: 0, padding: '0 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
            <Logotype theme={theme} size={18} style="profile-inline" markVariant={markVariant} gradient={gradient} />
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 600, fontSize: 46, color: theme.deep, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
              AI automation systems for{' '}
              <span style={accentText}>modern businesses.</span>
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: theme.soft, letterSpacing: '0.16em' }}>
              WORKFLOW AUTOMATION  ·  AI INTEGRATION  ·  INTELLIGENT OPERATIONS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 8. Iconography ─────────────────────────────────────────
function Icon({ children, color }) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
function AB_Icons({ theme, density }) {
  const icons = [
    { name: 'Automation', svg: (<><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>) },
    { name: 'Workflow',   svg: (<><rect x="3" y="4" width="6" height="6" rx="1.5" /><rect x="15" y="4" width="6" height="6" rx="1.5" /><rect x="9" y="14" width="6" height="6" rx="1.5" /><path d="M9 7h6M6 10v4M18 10v4M12 10v4" /></>) },
    { name: 'Insight',    svg: (<><path d="M4 19h16" /><path d="M6 15l4-5 3 3 5-7" /><circle cx="6" cy="15" r="1" fill={theme.accent} /><circle cx="18" cy="6" r="1" fill={theme.accent} /></>) },
    { name: 'Integration',svg: (<><circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" /><path d="M9 12h6" /></>) },
    { name: 'Agent',      svg: (<><circle cx="12" cy="9" r="4" /><path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" /><circle cx="10.5" cy="9" r="0.5" fill={theme.accent} /><circle cx="13.5" cy="9" r="0.5" fill={theme.accent} /></>) },
    { name: 'Secure',     svg: (<><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>) },
    { name: 'Scale',      svg: (<><path d="M4 20V8M10 20V4M16 20v-8M22 20v-4" /></>) },
    { name: 'Sync',       svg: (<><path d="M20 11A8 8 0 006 6l-2 2" /><path d="M4 13a8 8 0 0014 5l2-2" /><path d="M4 4v4h4M20 20v-4h-4" /></>) },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="08 · Iconography" />
      <div style={{ position: 'absolute', inset: '48px 56px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontFamily: theme.fontDisplay, fontWeight: 500, fontSize: 28, color: theme.deep, letterSpacing: '-0.02em' }}>Iconography</div>
          <div style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.soft, marginTop: 4 }}>
            Outline · 1.5 px stroke · 24 px grid · rounded caps &amp; joins.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {icons.map((ic) => (
            <div key={ic.name} style={{ border: `1px solid ${theme.line}`, borderRadius: 10, padding: '22px 18px', display: 'flex', alignItems: 'center', gap: 16, background: theme.surface }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, background: `linear-gradient(135deg, ${theme.accent}18, ${theme.glow}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.line}` }}>
                <Icon color={theme.accent}>{ic.svg}</Icon>
              </div>
              <div>
                <div style={{ fontFamily: theme.fontDisplay, fontSize: 15, fontWeight: 500, color: theme.deep }}>{ic.name}</div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: theme.faint, marginTop: 2 }}>ic-{ic.name.toLowerCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 9. Product UI snippet ──────────────────────────────────
function AB_AppUI({ theme, markVariant, wordmarkStyle, gradient, density }) {
  const isDark = theme.isDark;
  const chrome = isDark ? theme.surface : '#FFFFFF';
  const subChrome = isDark ? 'rgba(11,15,25,0.6)' : theme.surface;
  const fg = theme.deep, soft = theme.soft, faint = theme.faint, line = theme.line;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="09 · Product · Automation Console" />
      <div style={{ position: 'absolute', inset: '48px', display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', background: chrome, boxShadow: isDark ? `0 30px 80px -30px rgba(0,0,0,0.6), 0 0 0 1px ${line} inset` : `0 30px 70px -28px rgba(60,30,10,0.32), 0 0 0 1px ${line} inset`, display: 'grid', gridTemplateColumns: '224px 1fr' }}>
          <div style={{ background: subChrome, borderRight: `1px solid ${line}`, padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Logotype theme={theme} size={12} style="profile-inline" markVariant={markVariant} gradient={gradient} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              {['Workflows', 'Agents', 'Integrations', 'Runs', 'Insights', 'Settings'].map((n, i) => (
                <div key={n} style={{
                  padding: '8px 12px', borderRadius: 8,
                  background: i === 0 ? `${theme.accent}1c` : 'transparent',
                  color: i === 0 ? fg : soft,
                  fontFamily: theme.fontBody, fontSize: 13, fontWeight: i === 0 ? 500 : 400,
                  border: i === 0 ? `1px solid ${theme.accent}3a` : '1px solid transparent',
                }}>{n}</div>
              ))}
            </div>
            <div style={{ marginTop: 'auto', borderTop: `1px solid ${line}`, paddingTop: 14 }}>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, color: faint, letterSpacing: '0.14em' }}>USAGE · MAY</div>
              <div style={{ height: 4, borderRadius: 4, background: isDark ? 'rgba(245,247,250,0.08)' : 'rgba(0,0,0,0.06)', marginTop: 8, overflow: 'hidden' }}>
                <div style={{ width: '64%', height: '100%', background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})` }} />
              </div>
              <div style={{ fontFamily: theme.fontBody, fontSize: 11, color: soft, marginTop: 6 }}>6,400 / 10,000 runs</div>
            </div>
          </div>
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: faint, letterSpacing: '0.14em' }}>WORKSPACE · NORTHWIND COFFEE</div>
                <div style={{ fontFamily: theme.fontDisplay, fontSize: 28, fontWeight: 600, color: fg, marginTop: 4, letterSpacing: '-0.02em' }}>Workflows</div>
              </div>
              <button style={{ background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})`, border: 0, color: isDark ? theme.bg : '#FFFFFF', padding: '10px 16px', borderRadius: 8, fontFamily: theme.fontDisplay, fontWeight: 600, fontSize: 13 }}>+ New automation</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                ['Active runs',  '128',  '+12%'],
                ['Hours saved',  '342h', '+ this week'],
                ['Error rate',   '0.4%', '−0.2 pts'],
              ].map(([k, v, d]) => (
                <div key={k} style={{ border: `1px solid ${line}`, borderRadius: 10, padding: '14px 16px', background: isDark ? 'rgba(245,247,250,0.02)' : 'rgba(255,255,255,0.6)' }}>
                  <div style={{ fontFamily: theme.fontBody, fontSize: 12, color: soft }}>{k}</div>
                  <div style={{ fontFamily: theme.fontDisplay, fontSize: 26, fontWeight: 600, color: fg, marginTop: 6, letterSpacing: '-0.02em' }}>{v}</div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: theme.accent, marginTop: 4, letterSpacing: '0.08em' }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, border: `1px solid ${line}`, borderRadius: 10, padding: '14px 16px', overflow: 'hidden', background: isDark ? 'transparent' : 'rgba(255,255,255,0.6)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr 0.9fr 0.7fr', gap: 12, padding: '6px 4px', borderBottom: `1px solid ${line}` }}>
                {['Workflow', 'Trigger', 'Last run', 'Status'].map((h) => (
                  <div key={h} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: faint, letterSpacing: '0.14em' }}>{h}</div>
                ))}
              </div>
              {[
                ['Invoice follow-ups', 'Stripe · unpaid 7d', '2m ago',  'live'],
                ['Lead enrichment',    'Webform · submit',   '11m ago', 'live'],
                ['Support triage',     'Gmail · new',        'just now','live'],
                ['Weekly ops report',  'Cron · Mon 9a',      '2d ago',  'idle'],
                ['Inventory restock',  'Shopify · low',      '38m ago', 'live'],
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr 0.9fr 0.7fr', gap: 12, padding: '12px 4px', borderBottom: i < 4 ? `1px solid ${line}` : 'none', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 8, background: r[3] === 'live' ? theme.accent : theme.faint, boxShadow: r[3] === 'live' ? `0 0 8px ${theme.accent}` : 'none' }} />
                    <div style={{ fontFamily: theme.fontDisplay, fontSize: 14, color: fg }}>{r[0]}</div>
                  </div>
                  <div style={{ fontFamily: theme.fontBody, fontSize: 12.5, color: soft }}>{r[1]}</div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: soft }}>{r[2]}</div>
                  <div>
                    <span style={{
                      fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '3px 8px', borderRadius: 4,
                      color: r[3] === 'live' ? theme.accent : soft,
                      background: r[3] === 'live' ? `${theme.accent}1a` : (isDark ? 'rgba(245,247,250,0.05)' : 'rgba(0,0,0,0.04)'),
                      border: `1px solid ${r[3] === 'live' ? theme.accent + '40' : line}`,
                    }}>{r[3]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 10. Imagery direction ──────────────────────────────────
function ImageSlot({ label, theme, aspect = '4 / 3', tone = 'product' }) {
  return (
    <div style={{
      position: 'relative', aspectRatio: aspect, borderRadius: 10, overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${theme.accent}10 0 10px, ${theme.accent}04 10px 20px), ${theme.surface}`,
      border: `1px dashed ${theme.accent}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', padding: 12 }}>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: theme.accent, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{tone}</div>
        <div style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.soft, marginTop: 6 }}>{label}</div>
      </div>
    </div>
  );
}
function AB_Imagery({ theme, density }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="10 · Imagery Direction" />
      <div style={{ position: 'absolute', inset: '48px 56px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 500, fontSize: 28, color: theme.deep, letterSpacing: '-0.02em' }}>Imagery</div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.soft, marginTop: 4 }}>
              Executive · technological · operational. No cartoon robots, no neon cyberpunk, no cheap 3D renders.
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 12, flex: 1 }}>
          <ImageSlot label="Founder portrait · workshop setting" theme={theme} aspect="3 / 4" tone="portrait" />
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
            <ImageSlot label="Product UI · dashboard close-up" theme={theme} aspect="4 / 3" tone="product" />
            <ImageSlot label="Office · team in working session" theme={theme} aspect="4 / 3" tone="team" />
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
            <ImageSlot label="Architecture · abstract diagram" theme={theme} aspect="4 / 3" tone="diagram" />
            <ImageSlot label="Macro detail · keyboard / hands" theme={theme} aspect="4 / 3" tone="detail" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, fontFamily: theme.fontBody, fontSize: 12, color: theme.soft }}>
          <div><span style={{ color: theme.accent, fontWeight: 600 }}>✓</span> Natural light · muted palette · operational settings</div>
          <div><span style={{ color: '#B91C1C', fontWeight: 600 }}>✕</span> Generic stock photography · floating brains · gradients on faces</div>
        </div>
      </div>
    </div>
  );
}

// ─── 11. Wordmark gallery (NEW) ─────────────────────────────
// Showcases the lockup options around the head mark.
function AB_Wordmarks({ theme, density, markVariant, gradient }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="0 · Wordmark Lockups" />
      <div style={{ position: 'absolute', inset: '48px 56px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <div style={{ fontFamily: theme.fontDisplay, fontWeight: 500, fontSize: 28, color: theme.deep, letterSpacing: '-0.02em' }}>Logotype</div>
          <div style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.soft, marginTop: 4, maxWidth: 600 }}>
            One mark, several lockups. Pick the form that fits the space — the system stays
            recognizable across them.
          </div>
        </div>

        {/* primary row: profile stacked + profile inline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 12 }}>
          <div style={{ border: `1px solid ${theme.line}`, borderRadius: 12, background: theme.surface, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, minHeight: 320 }}>
            <Logotype theme={theme} size={22} style="profile" gradient={gradient} />
            <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Caps theme={theme} style={{ color: theme.accent }}>Stacked · primary</Caps>
              <div style={{ fontFamily: theme.fontBody, fontSize: 11.5, color: theme.faint }}>Cover, banner, deck title</div>
            </div>
          </div>
          <div style={{ border: `1px solid ${theme.line}`, borderRadius: 12, background: theme.surface, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, minHeight: 320 }}>
            <Logotype theme={theme} size={28} style="profile-inline" gradient={gradient} />
            <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Caps theme={theme} style={{ color: theme.accent }}>Inline</Caps>
              <div style={{ fontFamily: theme.fontBody, fontSize: 11.5, color: theme.faint }}>Header, biz card, sidebar</div>
            </div>
          </div>
        </div>

        {/* secondary row: head only + wordmark only + circular badge */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ border: `1px solid ${theme.line}`, borderRadius: 12, background: theme.surface, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 180 }}>
            <HeadMark size={120} theme={theme} gradient={gradient} variant={markVariant === 'stroke' ? 'outline' : 'solid'} />
            <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Caps theme={theme} style={{ color: theme.accent }}>Mark only</Caps>
              <div style={{ fontFamily: theme.fontBody, fontSize: 11.5, color: theme.faint }}>Favicons, avatars</div>
            </div>
          </div>
          <div style={{ border: `1px solid ${theme.line}`, borderRadius: 12, background: theme.surface, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 180 }}>
            <div style={{
              fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 34,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: theme.deep,
              display: 'inline-flex', gap: 18, lineHeight: 1,
            }}>
              <span>ADOPT</span>
              <span style={{
                background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}>AI</span>
            </div>
            <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Caps theme={theme} style={{ color: theme.accent }}>Wordmark only</Caps>
              <div style={{ fontFamily: theme.fontBody, fontSize: 11.5, color: theme.faint }}>Press, footers</div>
            </div>
          </div>
          <div style={{ border: `1px solid ${theme.line}`, borderRadius: 12, background: theme.surface, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 180 }}>
            {/* circular badge with HeadMark inside */}
            <div style={{
              width: 150, height: 150, borderRadius: '50%',
              background: theme.isDark ? 'rgba(245,247,250,0.04)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${theme.line}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <HeadMark size={92} theme={theme} gradient={gradient} variant={markVariant === 'stroke' ? 'outline' : 'solid'} />
              <svg width="150" height="150" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
                <defs>
                  <path id={`circ-${theme.id}`} d="M 50 50 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0" />
                </defs>
                <text fontFamily="ui-monospace, monospace" fontSize="5.2" fill={theme.soft} letterSpacing="0.34em">
                  <textPath href={`#circ-${theme.id}`} startOffset="0%">ADOPT · AI · AUTOMATION · SYSTEMS · </textPath>
                </text>
              </svg>
            </div>
            <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Caps theme={theme} style={{ color: theme.accent }}>Badge</Caps>
              <div style={{ fontFamily: theme.fontBody, fontSize: 11.5, color: theme.faint }}>Seals, stamps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 12. Hero/cover slide ───────────────────────────────────
function AB_Hero({ theme, markVariant, wordmarkStyle, gradient, density }) {
  const accentText = {
    background: `linear-gradient(90deg, ${(theme.gradientStops || [theme.accent, theme.glow]).join(', ')})`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4, background: theme.bg }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
        backgroundSize: `${density}px ${density}px`,
        maskImage: 'radial-gradient(circle at 30% 50%, black, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at 30% 50%, black, transparent 80%)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(80% 60% at 92% 18%, ${theme.accent}28, transparent 50%), radial-gradient(70% 50% at 8% 110%, ${theme.glow}28, transparent 55%)` }} />
      <ArtboardChrome theme={theme} label="00 · Brand Cover" />
      <div style={{ position: 'absolute', inset: '64px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Logotype theme={theme} size={16} style="profile-inline" markVariant={markVariant} gradient={gradient} />
          <div style={{ textAlign: 'right' }}>
            <Caps theme={theme}>Brand identity · v3.0</Caps>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: theme.faint, marginTop: 6, letterSpacing: '0.14em' }}>MAY 2026</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ maxWidth: '64%' }}>
            <Caps theme={theme}>For modern small businesses</Caps>
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 96, lineHeight: 0.96, letterSpacing: '-0.04em', color: theme.deep, marginTop: 18 }}>
              Turn AI<br />into your{' '}
              <span style={accentText}>competitive<br />advantage.</span>
            </div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 16, color: theme.soft, maxWidth: 540, marginTop: 24, lineHeight: 1.6 }}>
              Adopt AI installs intelligent automation across operations — invoicing, support, lead routing,
              reporting — so the work moves and your team is freed to do what only humans can.
            </div>
          </div>
          <div style={{ flexShrink: 0, opacity: 0.98, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
            <HeadMark size={300} theme={theme} variant={markVariant === 'stroke' ? 'outline' : 'solid'} gradient={gradient} />
            <div style={{
              fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 22,
              letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.deep,
              display: 'inline-flex', gap: 12, lineHeight: 1,
            }}>
              <span>ADOPT</span>
              <span style={accentText}>AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AB_Hero, AB_PrimaryMark, AB_MarkVariants, AB_Wordmarks, AB_Color, AB_Type, AB_Voice,
  AB_BizCard, AB_Social, AB_Icons, AB_AppUI, AB_Imagery,
});

// ─── Logo Concepts — six original directions ────────────────
function AB_LogoConcepts({ theme, density, gradient, conceptId, onPick }) {
  const ids = Object.keys(CONCEPT_MARKS);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="00 · Logo Concepts" />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '52px 60px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 600, fontSize: 36, color: theme.deep, letterSpacing: '-0.02em' }}>
              Six directions for the mark
            </div>
            <div style={{ fontFamily: theme.fontDisplay, fontWeight: 400, fontSize: 16, color: theme.soft, marginTop: 6 }}>
              Each is an original take on the “AI adoption” thesis. Tap a card or use the Tweaks panel to set the primary mark.
            </div>
          </div>
          <Caps theme={theme}>Concepts · 01–06</Caps>
        </div>

        <div style={{
          flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)', gap: 22,
        }}>
          {ids.map((id, i) => {
            const note = CONCEPT_NOTES[id];
            const active = id === conceptId;
            return (
              <div key={id}
                onClick={() => onPick && onPick(id)}
                style={{
                  position: 'relative', borderRadius: 10, overflow: 'hidden',
                  background: theme.isDark ? 'rgba(245,247,250,0.025)' : 'rgba(255,255,255,0.55)',
                  border: `1px solid ${active ? theme.accent : theme.line}`,
                  boxShadow: active ? `0 0 0 3px ${theme.accent}22, 0 18px 40px -22px ${theme.accent}55` : 'none',
                  display: 'flex', flexDirection: 'column', cursor: onPick ? 'pointer' : 'default',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}>
                {/* index badge */}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  fontFamily: 'ui-monospace, monospace', fontSize: 10,
                  letterSpacing: '0.18em', color: theme.faint,
                }}>
                  0{i + 1}
                </div>
                {active && (
                  <div style={{
                    position: 'absolute', top: 10, right: 12,
                    fontFamily: 'ui-monospace, monospace', fontSize: 10,
                    letterSpacing: '0.18em', color: theme.accent,
                  }}>
                    ● PRIMARY
                  </div>
                )}

                {/* mark */}
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '24px 16px 12px',
                }}>
                  <ConceptMark id={id} size={130} theme={theme} gradient={gradient} />
                </div>

                {/* meta */}
                <div style={{ padding: '14px 18px 18px', borderTop: `1px solid ${theme.line}` }}>
                  <div style={{
                    fontFamily: theme.fontDisplay, fontWeight: 600, fontSize: 18,
                    color: theme.deep, letterSpacing: '-0.01em',
                  }}>
                    {note.name}
                  </div>
                  <div style={{
                    fontFamily: 'ui-monospace, monospace', fontSize: 10,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: theme.accent, marginTop: 4,
                  }}>
                    {note.tag}
                  </div>
                  <div style={{
                    fontFamily: theme.fontBody, fontSize: 12, lineHeight: 1.45,
                    color: theme.soft, marginTop: 8,
                  }}>
                    {note.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Lockup gallery — every concept rendered as a horizontal lockup ──
function AB_ConceptLockups({ theme, density, gradient, conceptId }) {
  const ids = Object.keys(CONCEPT_MARKS);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <BlueprintBG theme={theme} density={density} />
      <ArtboardChrome theme={theme} label="00b · Concept Lockups" />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '52px 64px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: theme.fontDisplay, fontWeight: 600, fontSize: 30, color: theme.deep, letterSpacing: '-0.02em' }}>
            Side-by-side · each concept as a wordmark
          </div>
          <div style={{ fontFamily: theme.fontDisplay, fontWeight: 400, fontSize: 15, color: theme.soft, marginTop: 4 }}>
            Same word, six different stories. Useful for picking the one that reads cleanly at signature scale.
          </div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {ids.map((id) => {
            const active = id === conceptId;
            const note = CONCEPT_NOTES[id];
            return (
              <div key={id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '22px 28px',
                background: theme.isDark ? 'rgba(245,247,250,0.025)' : 'rgba(255,255,255,0.55)',
                border: `1px solid ${active ? theme.accent : theme.line}`,
                borderRadius: 8,
              }}>
                <ConceptLockup id={id} size={26} theme={theme} gradient={gradient} />
                <div style={{ textAlign: 'right' }}>
                  <Caps theme={theme}>{note.name}</Caps>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AB_LogoConcepts, AB_ConceptLockups });
