// site/mobile.jsx — Mobile app: client portal (iOS-style)
// Screens: splash/login, dashboard, agent detail, weekly report, notifications, profile.
// Each screen is 390×844 (iPhone 14) — laid out horizontally inside one artboard.

const SCREEN_W = 390;
const SCREEN_H = 844;

function PhoneFrame({ children, label, sub, bg = BRAND.cream, dark = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: SCREEN_W + 16, height: SCREEN_H + 16, padding: 8, borderRadius: 56,
        background: dark ? '#0A0A0A' : '#2A1F19',
        boxShadow: '0 30px 80px -20px rgba(61,26,15,0.35), inset 0 0 0 1.5px rgba(255,255,255,0.05)',
        position: 'relative',
      }}>
        <div style={{
          width: SCREEN_W, height: SCREEN_H, borderRadius: 48, overflow: 'hidden',
          background: bg, position: 'relative',
        }}>
          {/* notch */}
          <div style={{
            position: 'absolute', left: '50%', top: 14, transform: 'translateX(-50%)',
            width: 110, height: 32, borderRadius: 999, background: '#000',
            zIndex: 50,
          }} />
          {/* status bar */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: 54, padding: '18px 30px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 49,
            fontFamily: FONTS.body, fontSize: 14, fontWeight: 600,
            color: dark ? BRAND.cream : BRAND.ink,
          }}>
            <span>9:41</span>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
              <span>5G</span><span>􀋨</span><span style={{ marginLeft: 4 }}>􀛪</span>
            </span>
          </div>
          {children}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.accent, letterSpacing: '0.18em' }}>{label}</div>
        {sub && <div style={{ fontFamily: FONTS.body, fontSize: 12, color: 'rgba(248,244,238,0.55)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

// Tab bar (bottom)
function TabBar({ active = 'home', dark = false }) {
  const items = [
    { id: 'home', l: 'Home', g: '◇' },
    { id: 'agents', l: 'Agents', g: '◈' },
    { id: 'reports', l: 'Reports', g: '◢' },
    { id: 'alerts', l: 'Alerts', g: '◉' },
    { id: 'me', l: 'You', g: '○' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: '12px 22px 28px',
      background: dark ? 'rgba(15,8,5,0.92)' : 'rgba(248,244,238,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${dark ? BRAND.hairlineDark : BRAND.hairline}`,
      display: 'flex', justifyContent: 'space-around',
    }}>
      {items.map((it) => (
        <div key={it.id} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: active === it.id ? BRAND.accent : (dark ? 'rgba(248,244,238,0.5)' : 'rgba(61,26,15,0.5)'),
        }}>
          <div style={{ fontSize: 20, lineHeight: 1 }}>{it.g}</div>
          <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>{it.l}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Screen 1: Login / splash ──────────────────────────────
function MobileLogin() {
  return (
    <PhoneFrame label="01 · Sign in" sub="With biometric + SSO" bg={BRAND.void} dark>
      <div style={{ position: 'absolute', inset: 0 }}>
        <AmbientOrbs intensity={0.9} dark />
        <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%,-50%)', opacity: 0.6 }}>
          <AmbientRings size={420} dark />
        </div>
      </div>
      <div style={{ position: 'relative', padding: '120px 30px 30px', display: 'flex', flexDirection: 'column', height: '100%', color: BRAND.cream }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <img src="assets/adopt-ai-mark.png" width={96} alt="" />
        </div>
        <Eyebrow color={BRAND.glow} style={{ textAlign: 'center' }}>CLIENT PORTAL</Eyebrow>
        <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 32, letterSpacing: '-0.025em', textAlign: 'center', marginTop: 14, lineHeight: 1.1 }}>
          Welcome back,<br/>Maya.
        </div>
        <div style={{ fontSize: 13, color: 'rgba(248,244,238,0.65)', textAlign: 'center', marginTop: 12 }}>
          Apex Global Logistics · Director of Ops
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            padding: '16px 18px', borderRadius: 14,
            background: 'rgba(248,244,238,0.06)', border: `1px solid ${BRAND.hairlineDark}`,
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: BRAND.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>􀎽</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 14 }}>Use Face ID</div>
              <div style={{ fontSize: 11.5, color: 'rgba(248,244,238,0.6)', marginTop: 2 }}>Faster sign in</div>
            </div>
            <div style={{ fontSize: 18, color: BRAND.glow }}>→</div>
          </div>
          <Button variant="ghost" dark size="md" style={{ justifyContent: 'center' }}>Continue with SSO (Okta)</Button>
        </div>

        <div style={{ marginTop: 22, fontFamily: FONTS.mono, fontSize: 9.5, color: 'rgba(248,244,238,0.4)', letterSpacing: '0.18em', textAlign: 'center' }}>
          SOC 2 · ISO 27001 · HIPAA · END-TO-END ENCRYPTED
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── Screen 2: Dashboard ───────────────────────────────────
function MobileDashboard() {
  return (
    <PhoneFrame label="02 · Dashboard" sub="Live agent status">
      <div style={{ position: 'absolute', inset: 0, padding: '64px 0 100px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '8px 22px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(61,26,15,0.55)', letterSpacing: '0.16em' }}>WED · MAY 22</div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 26, letterSpacing: '-0.025em', marginTop: 2 }}>Good afternoon, Maya.</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 14, background: BRAND.ink, color: BRAND.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.display, fontWeight: 600, fontSize: 13 }}>ML</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <AgentPill label="3 LIVE" />
            <AgentPill label="0 ALERTS" status="queue" />
          </div>
        </div>

        {/* Hero metric card */}
        <div style={{ padding: '0 22px' }}>
          <div style={{
            borderRadius: 22, padding: 22,
            background: `linear-gradient(135deg, ${BRAND.burgundy}, ${BRAND.accent} 60%, ${BRAND.glow})`,
            color: BRAND.cream, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -30, top: -30, opacity: 0.35 }}>
              <AmbientRings size={220} dark />
            </div>
            <Eyebrow color="rgba(255,248,240,0.8)">THIS WEEK · MAY 15–22</Eyebrow>
            <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 56, letterSpacing: '-0.04em', marginTop: 10, lineHeight: 1 }}>445.5h</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, opacity: 0.85, marginTop: 6 }}>Human-hours reallocated · ↑ 12% vs last week</div>
            {/* mini sparkline */}
            <svg viewBox="0 0 200 40" width="100%" height="40" style={{ marginTop: 14 }}>
              <path d="M 0 30 L 20 26 L 40 28 L 60 22 L 80 18 L 100 24 L 120 14 L 140 16 L 160 10 L 180 8 L 200 4"
                fill="none" stroke="rgba(255,248,240,0.95)" strokeWidth="1.8" />
              <circle cx="200" cy="4" r="3" fill="#fff" />
            </svg>
          </div>
        </div>

        {/* Agent list */}
        <div style={{ padding: '24px 22px 0', flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <Eyebrow>Your agents · 3</Eyebrow>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.accent, letterSpacing: '0.12em' }}>ALL →</div>
          </div>
          {[
            { n: 'intake-agent-v4', s: 'Email coordination', m: '14,235 / day', up: '99.43%', c: BRAND.accent },
            { n: 'invoice-recon-v2', s: 'AP reconciliation', m: '4,110 / day', up: '98.9%', c: BRAND.glow },
            { n: 'support-router-v1', s: 'CX triage', m: '32,901 / day', up: '97.2%', c: BRAND.amber },
          ].map((a) => (
            <div key={a.n} style={{
              padding: 16, borderRadius: 16, background: BRAND.paper,
              border: `1px solid ${BRAND.hairline}`, marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `linear-gradient(140deg, ${a.c}, ${BRAND.smoke})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: BRAND.cream, fontFamily: FONTS.mono, fontSize: 14,
              }}>◈</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 500, color: BRAND.ink }}>{a.n}</div>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2BAE5C', boxShadow: `0 0 0 3px #2BAE5C33` }} />
                </div>
                <div style={{ fontSize: 12, color: 'rgba(61,26,15,0.6)', marginTop: 2 }}>{a.s}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.55)', letterSpacing: '0.06em' }}>
                  <span>{a.m}</span>
                  <span style={{ color: BRAND.accent }}>{a.up}</span>
                </div>
              </div>
              <div style={{ fontSize: 16, color: 'rgba(61,26,15,0.4)' }}>›</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="home" />
    </PhoneFrame>
  );
}

// ─── Screen 3: Agent detail ────────────────────────────────
function MobileAgent() {
  return (
    <PhoneFrame label="03 · Agent detail" sub="intake-agent-v4 live feed" bg={BRAND.void} dark>
      <div style={{ position: 'absolute', inset: 0, padding: '64px 0 100px', display: 'flex', flexDirection: 'column', overflow: 'hidden', color: BRAND.cream }}>
        <AmbientOrbs intensity={0.4} dark />
        <div style={{ position: 'relative', padding: '8px 22px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 18 }}>‹</div>
            <Eyebrow color={BRAND.glow}>YOUR AGENTS</Eyebrow>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 500 }}>intake-agent-v4</div>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2BAE5C', boxShadow: '0 0 0 4px rgba(43,174,92,0.25)' }} />
          </div>
          <div style={{ fontSize: 13, color: 'rgba(248,244,238,0.65)', marginTop: 4 }}>Apex Global Logistics · Inbound coordination</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 18 }}>
            {[
              ['14,235', '24h tasks'],
              ['99.43%', 'success'],
              ['412ms', 'p95 latency'],
            ].map(([v, l]) => (
              <div key={l} style={{ padding: '12px 12px', borderRadius: 12, background: 'rgba(248,244,238,0.06)', border: `1px solid ${BRAND.hairlineDark}` }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 18, fontWeight: 500 }}>{v}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 9.5, color: 'rgba(248,244,238,0.55)', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini chart */}
        <div style={{ position: 'relative', padding: '4px 22px 8px' }}>
          <Eyebrow color="rgba(248,244,238,0.6)" style={{ marginBottom: 8 }}>Throughput · 24h</Eyebrow>
          <div style={{ height: 80, background: 'rgba(248,244,238,0.04)', border: `1px solid ${BRAND.hairlineDark}`, borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 300 80" width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="m3-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={BRAND.accent} stopOpacity="0.5" />
                  <stop offset="1" stopColor={BRAND.accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0 70 L 25 60 L 50 55 L 75 40 L 100 48 L 125 30 L 150 38 L 175 26 L 200 18 L 225 28 L 250 22 L 275 14 L 300 10 L 300 80 L 0 80 Z"
                fill="url(#m3-grad)" />
              <path d="M 0 70 L 25 60 L 50 55 L 75 40 L 100 48 L 125 30 L 150 38 L 175 26 L 200 18 L 225 28 L 250 22 L 275 14 L 300 10"
                fill="none" stroke={BRAND.glow} strokeWidth="1.6" />
            </svg>
          </div>
        </div>

        {/* Live feed */}
        <div style={{ position: 'relative', padding: '16px 22px 0', flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Eyebrow color="rgba(248,244,238,0.6)">Live · last 60s</Eyebrow>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: BRAND.accent, letterSpacing: '0.16em' }}>▶ STREAMING</div>
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, lineHeight: 1.7, color: 'rgba(248,244,238,0.8)' }}>
            {[
              ['12:04:14', '✓', 'msg/c4a-9192 → carrier-eta · routed', 'rgba(248,244,238,0.7)'],
              ['12:04:12', '✓', 'msg/c4a-9191 → carrier-eta · routed', 'rgba(248,244,238,0.7)'],
              ['12:04:09', '✓', 'msg/c4a-9190 → ap-invoices · PO #88241', 'rgba(248,244,238,0.7)'],
              ['12:04:06', '⚙', 'msg/c4a-9189 → human-review · low conf.', BRAND.gold],
              ['12:04:04', '✓', 'msg/c4a-9188 → support-tier1 · auto-reply', 'rgba(248,244,238,0.7)'],
              ['12:04:02', '✓', 'msg/c4a-9187 → carrier-eta · routed', 'rgba(248,244,238,0.7)'],
              ['12:03:58', '✓', 'msg/c4a-9186 → support-tier1', 'rgba(248,244,238,0.7)'],
            ].map(([t, st, msg, c], i) => (
              <div key={i} style={{ display: 'flex', gap: 10, color: c, opacity: 1 - i * 0.07 }}>
                <span style={{ color: 'rgba(248,244,238,0.4)' }}>{t}</span>
                <span style={{ color: st === '⚙' ? BRAND.gold : '#2BAE5C', minWidth: 10 }}>{st}</span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabBar active="agents" dark />
    </PhoneFrame>
  );
}

// ─── Screen 4: Weekly report ───────────────────────────────
function MobileReport() {
  return (
    <PhoneFrame label="04 · Weekly report" sub="May 15–22 · Apex Logistics">
      <div style={{ position: 'absolute', inset: 0, padding: '64px 0 100px', overflow: 'hidden' }}>
        <div style={{ padding: '8px 22px 14px' }}>
          <Eyebrow>Weekly performance</Eyebrow>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 26, letterSpacing: '-0.025em', marginTop: 4 }}>May 15 – May 22</div>
          <div style={{ fontSize: 13, color: 'rgba(61,26,15,0.6)', marginTop: 2 }}>Apex Global Logistics</div>
        </div>

        {/* Big numbers */}
        <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: 16, borderRadius: 16, background: BRAND.paper, border: `1px solid ${BRAND.hairline}` }}>
            <Eyebrow color={BRAND.accent}>HOURS SAVED</Eyebrow>
            <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 36, letterSpacing: '-0.03em', marginTop: 8, ...emberText() }}>445.5</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.5)', marginTop: 4, letterSpacing: '0.1em' }}>↑ 12% VS LAST WK</div>
          </div>
          <div style={{ padding: 16, borderRadius: 16, background: BRAND.paper, border: `1px solid ${BRAND.hairline}` }}>
            <Eyebrow color={BRAND.accent}>COST REDUCED</Eyebrow>
            <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 36, letterSpacing: '-0.03em', marginTop: 8, color: BRAND.ink }}>$17.8k</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.5)', marginTop: 4, letterSpacing: '0.1em' }}>↑ 8% VS LAST WK</div>
          </div>
        </div>

        {/* Pipeline rows */}
        <div style={{ padding: '20px 22px 0' }}>
          <Eyebrow style={{ marginBottom: 10 }}>By pipeline</Eyebrow>
          {[
            ['Email Intake', '14,235', '99.4%', '118h', BRAND.accent, 0.85],
            ['Invoice Recon', '4,110', '98.9%', '82h', BRAND.glow, 0.55],
            ['Support Router', '32,901', '97.2%', '245h', BRAND.amber, 1],
          ].map((row) => (
            <div key={row[0]} style={{
              padding: 16, marginBottom: 10, borderRadius: 14,
              background: BRAND.paper, border: `1px solid ${BRAND.hairline}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 16 }}>{row[0]}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: row[4] }}>{row[3]} saved</div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 6, fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(61,26,15,0.55)' }}>
                <span>{row[1]} tasks</span><span>{row[2]} success</span>
              </div>
              <div style={{ height: 6, background: 'rgba(61,26,15,0.06)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ width: `${row[5]*100}%`, height: '100%', background: `linear-gradient(90deg, ${row[4]}, ${BRAND.glow})` }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 22px 0', display: 'flex', gap: 10 }}>
          <Button variant="dark" size="sm" style={{ flex: 1, justifyContent: 'center' }}>Export PDF</Button>
          <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: 'center' }}>Share</Button>
        </div>
      </div>
      <TabBar active="reports" />
    </PhoneFrame>
  );
}

// ─── Screen 5: Notifications / alerts ──────────────────────
function MobileAlerts() {
  return (
    <PhoneFrame label="05 · Alerts" sub="Drift, cost + ops">
      <div style={{ position: 'absolute', inset: 0, padding: '64px 0 100px', overflow: 'hidden' }}>
        <div style={{ padding: '8px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Eyebrow>Notifications</Eyebrow>
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 24, letterSpacing: '-0.025em', marginTop: 4 }}>Alerts & updates</div>
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.accent, letterSpacing: '0.12em' }}>CLEAR</div>
        </div>

        {/* Today */}
        <div style={{ padding: '0 22px' }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.45)', letterSpacing: '0.18em', marginBottom: 8 }}>TODAY · MAY 22</div>
          {[
            { tag: 'OPS', color: BRAND.glow, t: 'Weekly report ready', d: 'Your May 15–22 report is available. 445.5h saved · $17.8k cost reduction.', time: '9:30a' },
            { tag: 'DRIFT', color: BRAND.accent, t: 'intake-agent-v4 confidence drift', d: 'P95 confidence dipped to 0.91 on "billing-dispute" intent. We\'re investigating.', time: '7:14a' },
            { tag: 'TEAM', color: BRAND.gold, t: 'Tomás scheduled a sync', d: 'Quarterly capability review · Fri May 24 · 11:00 ET', time: '6:02a' },
          ].map((a) => (
            <div key={a.t} style={{
              padding: 14, borderRadius: 14, marginBottom: 8,
              background: BRAND.paper, border: `1px solid ${BRAND.hairline}`,
              display: 'flex', gap: 12,
            }}>
              <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: a.color }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: a.color, letterSpacing: '0.2em' }}>{a.tag}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(61,26,15,0.45)', letterSpacing: '0.06em' }}>{a.time}</div>
                </div>
                <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 15, letterSpacing: '-0.015em', marginTop: 4 }}>{a.t}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(61,26,15,0.68)', marginTop: 4, lineHeight: 1.45 }}>{a.d}</div>
              </div>
            </div>
          ))}

          <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.45)', letterSpacing: '0.18em', margin: '16px 0 8px' }}>EARLIER</div>
          {[
            ['BUILD', 'invoice-recon-v2 deployed', 'New ERP write-back rules · 6 days ago', BRAND.amber],
            ['OPS', 'Eval suite passed', 'support-router-v1 · 7 days ago · 40/40 checks', BRAND.glow],
          ].map(([k, t, d, c]) => (
            <div key={t} style={{ padding: '12px 14px', borderBottom: `1px solid ${BRAND.hairline}` }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: c, letterSpacing: '0.18em' }}>{k}</div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 14, marginTop: 4 }}>{t}</div>
              <div style={{ fontSize: 12, color: 'rgba(61,26,15,0.6)', marginTop: 2 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="alerts" />
    </PhoneFrame>
  );
}

// ─── Screen 6: Profile / settings ──────────────────────────
function MobileProfile() {
  return (
    <PhoneFrame label="06 · Profile" sub="Account · billing · team">
      <div style={{ position: 'absolute', inset: 0, padding: '64px 0 100px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '18px 22px 24px', textAlign: 'center' }}>
          <div style={{
            width: 76, height: 76, borderRadius: 24,
            background: `linear-gradient(140deg, ${BRAND.accent}, ${BRAND.burgundy})`,
            color: BRAND.cream, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONTS.display, fontWeight: 600, fontSize: 28, letterSpacing: '-0.02em',
          }}>ML</div>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 22, marginTop: 14, letterSpacing: '-0.02em' }}>Maya Lindqvist</div>
          <div style={{ fontSize: 13, color: 'rgba(61,26,15,0.65)', marginTop: 2 }}>Director of Operations · Apex Logistics</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <AgentPill label="STUDIO PLAN" status="queue" />
          </div>
        </div>

        {/* Sections */}
        {[
          ['Account', [
            ['Profile', '𝐀'],
            ['Notifications', '𝐁'],
            ['Security & 2FA', '𝐂'],
          ]],
          ['Workspace', [
            ['Team members', '8 active'],
            ['API keys', '4 keys'],
            ['Billing', 'Lift · $5,800 · annual'],
            ['Audit log', '14 days'],
          ]],
          ['Support', [
            ['Contact your architect', 'Tomás Costa →'],
            ['Open ticket', ''],
            ['Documentation', ''],
          ]],
        ].map(([h, items]) => (
          <div key={h} style={{ padding: '0 22px 12px' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.45)', letterSpacing: '0.2em', margin: '8px 6px 8px' }}>{h.toUpperCase()}</div>
            <div style={{ background: BRAND.paper, border: `1px solid ${BRAND.hairline}`, borderRadius: 14, overflow: 'hidden' }}>
              {items.map(([t, r], i) => (
                <div key={t} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: i < items.length - 1 ? `1px solid ${BRAND.hairline}` : 'none',
                }}>
                  <div style={{ fontSize: 14, color: BRAND.ink }}>{t}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: r === 'Tomás Costa →' ? BRAND.accent : 'rgba(61,26,15,0.55)', letterSpacing: '0.06em' }}>{r} ›</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ padding: '4px 22px' }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(61,26,15,0.4)', letterSpacing: '0.16em', textAlign: 'center', marginTop: 8 }}>
            ADOPT AI · v2.4.1 · BUILD 88241
          </div>
        </div>
      </div>
      <TabBar active="me" />
    </PhoneFrame>
  );
}

// ─── Composite: full mobile app artboard ───────────────────
function MobileAppShowcase() {
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background: `radial-gradient(120% 80% at 50% 0%, ${BRAND.smoke} 0%, ${BRAND.void} 70%)`,
      padding: '56px 56px 40px',
      color: BRAND.cream,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
        <div>
          <Eyebrow color={BRAND.glow}>Mobile · iOS client portal</Eyebrow>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 36, letterSpacing: '-0.03em', marginTop: 8 }}>
            Six screens. The whole portal in your pocket.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <AgentPill label="iPhone 14 · 390×844" dark />
          <AgentPill label="iOS 17 · light + dark" dark />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        <MobileLogin />
        <MobileDashboard />
        <MobileAgent />
        <MobileReport />
        <MobileAlerts />
        <MobileProfile />
      </div>
    </div>
  );
}

Object.assign(window, {
  PhoneFrame, TabBar,
  MobileLogin, MobileDashboard, MobileAgent, MobileReport, MobileAlerts, MobileProfile,
  MobileAppShowcase,
});
