// site/motion-prod.jsx — Production-grade motion pieces.
// Three concepts at delivery fidelity (1920×1080 reference frame):
//   A · Mark Reveal       — looping hero film, 6s
//   C · Agent In Action   — 4-scene product explainer, ~28s loop
//   E · Customer Voice    — testimonial frame with lower thirds (B-roll placeholder)

// ════════════════════════════════════════════════════════════
// A · MARK REVEAL — looping hero film
// Scene: black void → expanding rings → mark fades up with bloom → tagline.
// ════════════════════════════════════════════════════════════

function MarkReveal({ size = 1, label = true }) {
  // size is a uniform scalar (1 = full 1920×1080 reference)
  const W = 1920 * size, H = 1080 * size;
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `radial-gradient(80% 70% at 50% 50%, ${BRAND.smoke} 0%, ${BRAND.void} 75%)`,
      overflow: 'hidden',
    }}>
      {/* deep ember vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(40% 40% at 50% 50%, ${BRAND.burgundy}55, transparent 70%)`,
        animation: 'mr-vignette 6s ease-in-out infinite',
        mixBlendMode: 'screen',
      }} />

      {/* particle field — drifting embers */}
      {Array.from({ length: 60 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280 / 233280;
        const x = seed * 100;
        const y = ((seed * 7 + 0.3) % 1) * 100;
        const s = 1 + seed * 2.5;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: s, height: s, borderRadius: '50%',
            background: i % 3 === 0 ? BRAND.glow : i % 3 === 1 ? BRAND.accent : BRAND.cream,
            opacity: 0.4 + seed * 0.4,
            filter: 'blur(0.3px)',
            animation: `mr-float ${8 + seed * 8}s ease-in-out infinite`,
            animationDelay: `${seed * -10}s`,
            boxShadow: `0 0 ${6 + s * 4}px ${i % 3 === 0 ? BRAND.glow : BRAND.accent}`,
          }} />
        );
      })}

      {/* expanding rings — concentric, staggered */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 80, height: 80, marginLeft: -40, marginTop: -40,
          borderRadius: '50%', border: `1.5px solid ${BRAND.accent}`,
          opacity: 0,
          animation: 'mr-ring 6s ease-out infinite',
          animationDelay: `${i * 1.2}s`,
        }} />
      ))}

      {/* dotted orbit ring */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 520 * size, height: 520 * size,
        marginLeft: -260 * size, marginTop: -260 * size,
        border: `1px dashed ${BRAND.glow}40`,
        borderRadius: '50%',
        animation: 'mr-spin 40s linear infinite',
      }} />

      {/* the mark — bloomed and pulsing */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'mr-mark 6s ease-in-out infinite',
      }}>
        <div style={{
          position: 'absolute', inset: -30, borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND.accent}55, transparent 60%)`,
          filter: `blur(${40 * size}px)`,
        }} />
        <img src="assets/adopt-ai-mark.png" width={320 * size}
          style={{
            display: 'block', position: 'relative',
            filter: `drop-shadow(0 0 ${60 * size}px ${BRAND.accent}aa)`,
          }} alt="" />
      </div>

      {/* tagline reveal (bottom) */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: `${10 * size}%`,
        textAlign: 'center', color: BRAND.cream,
        animation: 'mr-tag 6s ease-in-out infinite',
        opacity: 0,
      }}>
        <div style={{
          fontFamily: FONTS.display, fontWeight: 600, fontSize: 64 * size,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'inline-flex', gap: 24 * size, lineHeight: 1,
        }}>
          <span>ADOPT</span>
          <span style={emberText()}>AI</span>
        </div>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 18 * size, color: 'rgba(248,244,238,0.7)',
          letterSpacing: '0.32em', marginTop: 18 * size, textTransform: 'uppercase',
        }}>
          Turn AI into your competitive advantage
        </div>
      </div>

      {/* corner timecode (cinematic chrome) */}
      {label && (
        <>
          <div style={{
            position: 'absolute', left: 24 * size, top: 24 * size, display: 'flex', gap: 10 * size, alignItems: 'center',
            fontFamily: FONTS.mono, fontSize: 12 * size, color: 'rgba(248,244,238,0.7)', letterSpacing: '0.18em',
          }}>
            <span style={{
              width: 8 * size, height: 8 * size, borderRadius: '50%', background: BRAND.accent,
              boxShadow: `0 0 12px ${BRAND.accent}`, animation: 'mr-rec 1.2s ease-in-out infinite',
            }} />
            <span>REC · A001_C001</span>
          </div>
          <div style={{
            position: 'absolute', right: 24 * size, top: 24 * size,
            fontFamily: FONTS.mono, fontSize: 12 * size, color: 'rgba(248,244,238,0.6)', letterSpacing: '0.2em',
          }}>1920 × 1080  ·  24FPS  ·  PRORES 422</div>
          <div style={{
            position: 'absolute', left: 24 * size, bottom: 24 * size,
            fontFamily: FONTS.mono, fontSize: 11 * size, color: 'rgba(248,244,238,0.5)', letterSpacing: '0.2em',
          }}>A · MARK REVEAL · 06.00s LOOP</div>
        </>
      )}

      <style>{`
        @keyframes mr-vignette {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes mr-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${15 * size}px, -${30 * size}px); }
        }
        @keyframes mr-ring {
          0% { width: 80px; height: 80px; margin-left: -40px; margin-top: -40px; opacity: 0; border-width: 2px; }
          15% { opacity: 0.9; }
          100% { width: ${900 * size}px; height: ${900 * size}px; margin-left: -${450 * size}px; margin-top: -${450 * size}px; opacity: 0; border-width: 0.5px; }
        }
        @keyframes mr-spin { 100% { transform: rotate(360deg); } }
        @keyframes mr-mark {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          25% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          75% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
        }
        @keyframes mr-tag {
          0%, 30% { opacity: 0; transform: translateY(${20 * size}px); }
          50%, 75% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(0); }
        }
        @keyframes mr-rec { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// C · AGENT IN ACTION — 4-scene product explainer, 28s loop
// Each scene is 6s, plus 1s crossfade = a continuous narrative.
//   1) Email arrives (the problem)
//   2) Agent reads + classifies (the work)
//   3) Routes to systems (the value)
//   4) Metrics tick up (the proof)
// ════════════════════════════════════════════════════════════

function AgentInAction({ size = 1 }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `linear-gradient(180deg, ${BRAND.smoke}, ${BRAND.void})`,
      overflow: 'hidden', fontFamily: FONTS.body, color: BRAND.cream,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        background: `radial-gradient(50% 40% at 50% 60%, ${BRAND.burgundy}66, transparent 70%)`,
      }} />

      {/* ─── Scene 1: Inbox flooding ─── */}
      <div style={{ position: 'absolute', inset: 0, animation: 'aia-scene 28s ease-in-out infinite' }}>
        <div style={{ position: 'absolute', inset: 0, padding: 60 * size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 14 * size, color: BRAND.glow, letterSpacing: '0.2em', marginBottom: 24 * size }}>
            SCENE 01 · INBOUND
          </div>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 72 * size, letterSpacing: '-0.035em', textAlign: 'center', lineHeight: 1, maxWidth: 1200 * size }}>
            Carrier email floods<br/>your <span style={emberText()}>operations team</span>.
          </div>
          {/* falling email cards */}
          <div style={{ marginTop: 40 * size, display: 'flex', gap: 14 * size, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100 * size }}>
            {['CarrierX · ETA delay #88241', 'AP · Invoice #112-A reconcile', 'Support · Refund Q from customer', 'Ops · BOL exception batch-44', 'CarrierY · Pickup confirmation', 'AP · Vendor invoice batch-08'].map((m, i) => (
              <div key={i} style={{
                padding: `${10 * size}px ${16 * size}px`, borderRadius: 10 * size,
                background: 'rgba(248,244,238,0.06)',
                border: `1px solid ${BRAND.hairlineDark}`,
                fontFamily: FONTS.mono, fontSize: 12 * size, color: 'rgba(248,244,238,0.85)',
                animation: `aia-emailDrop 1.4s ease-out forwards`,
                animationDelay: `${i * 0.18}s`,
                opacity: 0, transform: 'translateY(-30px)',
              }}>{m}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Scene 2: Agent classifies ─── */}
      <div style={{ position: 'absolute', inset: 0, animation: 'aia-scene 28s ease-in-out infinite', animationDelay: '-21s' }}>
        <div style={{ position: 'absolute', inset: 0, padding: 60 * size, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 40 * size }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12 * size, color: BRAND.glow, letterSpacing: '0.2em' }}>INCOMING</div>
            {[{ from: 'CarrierX', subj: 'ETA delay #88241', conf: '0.97', tag: 'eta-update' },
              { from: 'AP',       subj: 'Invoice #112-A',   conf: '0.94', tag: 'ap-route' },
              { from: 'Support',  subj: 'Refund question',  conf: '0.89', tag: 'cx-tier1' }].map((m, i) => (
              <div key={i} style={{
                marginTop: 12 * size, padding: `${14 * size}px ${18 * size}px`, borderRadius: 12 * size,
                background: 'rgba(248,244,238,0.06)', border: `1px solid ${BRAND.hairlineDark}`,
                textAlign: 'left', maxWidth: 360 * size, marginLeft: 'auto',
              }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 12 * size, color: BRAND.glow, letterSpacing: '0.06em' }}>{m.from}</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 14 * size, marginTop: 4, color: BRAND.cream }}>{m.subj}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8, fontFamily: FONTS.mono, fontSize: 11 * size, color: 'rgba(248,244,238,0.5)' }}>
                  <span>conf={m.conf}</span>
                  <span style={{ color: BRAND.accent }}>→ {m.tag}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Agent core (the mark + spinning rings) */}
          <div style={{ position: 'relative', width: 260 * size, height: 260 * size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `2px solid ${BRAND.accent}55`, animation: 'aia-spin 4s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 20 * size, borderRadius: '50%',
              border: `1px dashed ${BRAND.glow}66`, animation: 'aia-spin 6s linear infinite reverse',
            }} />
            <div style={{
              position: 'absolute', inset: 40 * size, borderRadius: '50%',
              background: `radial-gradient(circle, ${BRAND.accent}33, transparent 70%)`,
              filter: 'blur(20px)',
            }} />
            <img src="assets/adopt-ai-mark.png" width={120 * size} alt=""
              style={{ position: 'relative', filter: `drop-shadow(0 0 ${30 * size}px ${BRAND.accent}aa)` }} />
            <div style={{
              position: 'absolute', bottom: -36 * size, left: '50%', transform: 'translateX(-50%)',
              fontFamily: FONTS.mono, fontSize: 11 * size, color: BRAND.glow, letterSpacing: '0.24em', whiteSpace: 'nowrap',
            }}>intake-agent-v4</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 44 * size, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              Reads. Classifies.<br/><span style={emberText()}>Routes in 412 ms.</span>
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 17 * size, color: 'rgba(248,244,238,0.65)', marginTop: 18 * size, lineHeight: 1.5, maxWidth: 360 * size }}>
              Every message goes through your golden eval — confidence-gated, audit-logged, reversible.
            </div>
          </div>
        </div>
      </div>

      {/* ─── Scene 3: Routes to systems ─── */}
      <div style={{ position: 'absolute', inset: 0, animation: 'aia-scene 28s ease-in-out infinite', animationDelay: '-14s' }}>
        <div style={{ position: 'absolute', inset: 0, padding: 60 * size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 14 * size, color: BRAND.glow, letterSpacing: '0.2em', marginBottom: 24 * size }}>
            SCENE 03 · ROUTING
          </div>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 60 * size, letterSpacing: '-0.035em', textAlign: 'center', lineHeight: 1, maxWidth: 1200 * size }}>
            Each one lands in <span style={emberText()}>exactly the right system</span>.
          </div>
          <div style={{
            marginTop: 56 * size, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 * size,
            width: '85%', maxWidth: 1280 * size,
          }}>
            {[
              { sys: 'TMS', tag: 'CarrierX → eta-queue', c: BRAND.accent },
              { sys: 'QuickBooks', tag: 'AP-Invoice → batch', c: BRAND.glow },
              { sys: 'Zendesk', tag: 'Support → tier-1', c: BRAND.amber },
              { sys: 'Slack', tag: 'Low-conf → #review', c: BRAND.gold },
            ].map((r, i) => (
              <div key={i} style={{
                padding: `${22 * size}px ${20 * size}px`, borderRadius: 16 * size,
                background: `linear-gradient(180deg, ${r.c}22, transparent)`,
                border: `1px solid ${r.c}55`,
                animation: 'aia-routeIn 6s ease-out infinite',
                animationDelay: `${i * 0.5}s`,
              }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11 * size, color: r.c, letterSpacing: '0.2em' }}>0{i+1} ROUTED</div>
                <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 24 * size, letterSpacing: '-0.02em', marginTop: 12 * size }}>{r.sys}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 12 * size, color: 'rgba(248,244,238,0.65)', marginTop: 6 * size }}>{r.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Scene 4: Metrics tick up ─── */}
      <div style={{ position: 'absolute', inset: 0, animation: 'aia-scene 28s ease-in-out infinite', animationDelay: '-7s' }}>
        <div style={{ position: 'absolute', inset: 0, padding: 60 * size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 14 * size, color: BRAND.glow, letterSpacing: '0.2em', marginBottom: 18 * size }}>
            SCENE 04 · THIS WEEK
          </div>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 56 * size, letterSpacing: '-0.035em', textAlign: 'center', lineHeight: 1, marginBottom: 48 * size }}>
            Your team got <span style={emberText()}>118 hours</span> back.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 * size, width: '80%', maxWidth: 1280 * size }}>
            {[
              ['14,235', 'messages routed', BRAND.accent],
              ['99.4%',  'success rate',    BRAND.glow],
              ['118 h',  'time reclaimed',  BRAND.amber],
              ['$3.7k',  'cost reduced',    BRAND.gold],
            ].map(([v, l, c], i) => (
              <div key={l} style={{
                padding: `${24 * size}px`, borderRadius: 18 * size,
                background: 'rgba(36,21,16,0.6)',
                border: `1px solid ${BRAND.hairlineDark}`,
                animation: 'aia-tick 6s ease-out infinite',
                animationDelay: `${i * 0.4}s`,
                opacity: 0,
              }}>
                <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 56 * size, letterSpacing: '-0.04em', color: c, lineHeight: 1 }}>{v}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11 * size, color: 'rgba(248,244,238,0.55)', letterSpacing: '0.2em', marginTop: 12 * size, textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cinematic chrome */}
      <div style={{
        position: 'absolute', left: 24 * size, top: 24 * size, display: 'flex', gap: 10 * size, alignItems: 'center',
        fontFamily: FONTS.mono, fontSize: 12 * size, color: 'rgba(248,244,238,0.7)', letterSpacing: '0.18em',
      }}>
        <span style={{
          width: 8 * size, height: 8 * size, borderRadius: '50%', background: BRAND.accent,
          boxShadow: `0 0 12px ${BRAND.accent}`, animation: 'aia-blink 1.2s infinite',
        }} />
        <span>SEEDANCE 2.0 PREVIS · 28s LOOP</span>
      </div>
      <div style={{
        position: 'absolute', left: 24 * size, bottom: 24 * size,
        fontFamily: FONTS.mono, fontSize: 11 * size, color: 'rgba(248,244,238,0.5)', letterSpacing: '0.2em',
      }}>C · AGENT IN ACTION · APEX LOGISTICS</div>
      <div style={{
        position: 'absolute', right: 24 * size, bottom: 24 * size,
        fontFamily: FONTS.mono, fontSize: 11 * size, color: 'rgba(248,244,238,0.5)', letterSpacing: '0.2em',
      }}>VOICEOVER · LICENSED SCORE · DELIVERABLE: MP4 / WEBM</div>

      {/* progress bar */}
      <div style={{
        position: 'absolute', left: 24 * size, right: 24 * size, bottom: 56 * size, height: 2 * size,
        background: 'rgba(248,244,238,0.15)', borderRadius: 2 * size, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: '25%',
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.glow})`,
          animation: 'aia-progress 28s linear infinite',
        }} />
      </div>

      <style>{`
        @keyframes aia-scene {
          0%, 22% { opacity: 1; }
          25%, 100% { opacity: 0; }
        }
        @keyframes aia-emailDrop {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes aia-spin { 100% { transform: rotate(360deg); } }
        @keyframes aia-routeIn {
          0% { opacity: 0; transform: translateY(20px); }
          15% { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes aia-tick {
          0% { opacity: 0; transform: scale(0.9); }
          20% { opacity: 1; transform: scale(1); }
          100% { opacity: 1; }
        }
        @keyframes aia-blink { 50% { opacity: 0.3; } }
        @keyframes aia-progress { 0% { width: 0; } 100% { width: 100%; } }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// E · CUSTOMER VOICE — testimonial frame
// 16:9 with ember-vignette background, talking-head silhouette,
// branded lower-thirds, customer quote that animates in chunks.
// ════════════════════════════════════════════════════════════

function CustomerVoice({ size = 1 }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: BRAND.void, overflow: 'hidden', fontFamily: FONTS.body,
    }}>
      {/* Backdrop — ember light from upper right */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(85% 75% at 78% 30%, ${BRAND.burgundy}aa 0%, ${BRAND.smoke} 45%, ${BRAND.void} 90%)`,
      }} />
      {/* Subtle film grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
        backgroundImage: `radial-gradient(rgba(248,244,238,0.8) 1px, transparent 1px)`,
        backgroundSize: '3px 3px',
      }} />

      {/* Abstract "respondent" — branded illustration, not a stock-photo proxy */}
      <div style={{
        position: 'absolute', right: '7%', top: '50%', transform: 'translateY(-50%)',
        width: 460 * size, height: 540 * size,
      }}>
        {/* outer ember halo */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND.accent}40 0%, transparent 60%)`,
          filter: `blur(${40 * size}px)`,
        }} />
        {/* dotted orbit */}
        <div style={{
          position: 'absolute', inset: 40 * size, borderRadius: '50%',
          border: `1px dashed ${BRAND.glow}55`,
          animation: 'cv-orbit 30s linear infinite',
        }} />
        {/* inner orbit */}
        <div style={{
          position: 'absolute', inset: 90 * size, borderRadius: '50%',
          border: `1px solid ${BRAND.accent}33`,
          animation: 'cv-orbit 45s linear infinite reverse',
        }} />
        {/* core gradient disc */}
        <div style={{
          position: 'absolute', inset: 140 * size, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${BRAND.accent} 0%, ${BRAND.burgundy} 50%, ${BRAND.smoke} 100%)`,
          boxShadow: `0 30px 80px -20px rgba(168,42,40,0.6), inset 20px 0 60px rgba(255,255,255,0.08)`,
        }} />
        {/* orbital nodes */}
        {[0, 72, 144, 216, 288].map((deg, i) => {
          const r = (460 * size - 80 * size) / 2;
          const a = (deg * Math.PI) / 180;
          const cx = 230 * size + r * Math.cos(a);
          const cy = 270 * size + r * Math.sin(a);
          return (
            <div key={i} style={{
              position: 'absolute', left: cx - 4 * size, top: cy - 4 * size,
              width: 8 * size, height: 8 * size, borderRadius: '50%',
              background: i % 2 === 0 ? BRAND.accent : BRAND.glow,
              boxShadow: `0 0 ${12 * size}px ${i % 2 === 0 ? BRAND.accent : BRAND.glow}`,
              animation: `cv-pulse 2.4s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }} />
          );
        })}
        {/* the mark, centered */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="assets/adopt-ai-mark-cream.png" width={180 * size} alt=""
            style={{ filter: `drop-shadow(0 0 ${24 * size}px rgba(0,0,0,0.5))`, opacity: 0.95 }} />
        </div>
        {/* label badge — "voice of customer" */}
        <div style={{
          position: 'absolute', bottom: -8 * size, left: '50%', transform: 'translateX(-50%)',
          padding: `${8 * size}px ${16 * size}px`, borderRadius: 999,
          background: 'rgba(15,8,5,0.78)',
          border: `1px solid ${BRAND.hairlineDark}`,
          fontFamily: FONTS.mono, fontSize: 11 * size, color: BRAND.glow, letterSpacing: '0.22em',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>Voice of Customer · 0001</div>
      </div>

      {/* Quote — animates in chunks; big editorial italic */}
      <div style={{
        position: 'absolute', left: '6%', top: '13%', maxWidth: 780 * size,
        color: BRAND.cream,
      }}>
        <Eyebrow color={BRAND.glow} style={{ marginBottom: 22 * size }}>Customer · Apex Regional Logistics</Eyebrow>
        {/* big open quote glyph */}
        <div style={{
          fontFamily: FONTS.editorial, fontStyle: 'italic', fontSize: 200 * size, lineHeight: 0.6,
          color: BRAND.accent, opacity: 0.35, marginBottom: -40 * size, height: 80 * size,
        }}>&ldquo;</div>
        <div style={{
          fontFamily: FONTS.editorial, fontStyle: 'italic', fontWeight: 400,
          fontSize: 68 * size, letterSpacing: '-0.025em', lineHeight: 1.08,
        }}>
          <span style={{ display: 'inline-block', opacity: 0, animation: 'cv-chunk 16s ease-out infinite', animationDelay: '0s' }}>I didn&rsquo;t want </span>
          <span style={{ display: 'inline-block', opacity: 0, animation: 'cv-chunk 16s ease-out infinite', animationDelay: '1.4s' }}>a tool. </span>
          <span style={{ display: 'inline-block', opacity: 0, animation: 'cv-chunk 16s ease-out infinite', animationDelay: '3s' }}>I wanted </span>
          <span style={{ display: 'inline-block', opacity: 0, animation: 'cv-chunk 16s ease-out infinite', animationDelay: '4.4s' }}>my </span>
          <span style={{ display: 'inline-block', opacity: 0, animation: 'cv-chunk 16s ease-out infinite', animationDelay: '5s' }}><span style={emberText()}>Tuesday</span> </span>
          <span style={{ display: 'inline-block', opacity: 0, animation: 'cv-chunk 16s ease-out infinite', animationDelay: '6.4s' }}>back.</span>
          <br/>
          <span style={{ display: 'inline-block', opacity: 0, animation: 'cv-chunk 16s ease-out infinite', animationDelay: '8s', fontSize: 44 * size, lineHeight: 1.3, marginTop: 12 * size }}>
            Two weeks later, I had it.
          </span>
        </div>
      </div>

      {/* Lower-third name card */}
      <div style={{
        position: 'absolute', left: '6%', bottom: '10%',
        display: 'flex', alignItems: 'center', gap: 18 * size,
        animation: 'cv-name 16s ease-out infinite', animationDelay: '0.5s', opacity: 0,
      }}>
        <div style={{ width: 4 * size, height: 60 * size, background: `linear-gradient(180deg, ${BRAND.accent}, ${BRAND.glow})`, borderRadius: 4 }} />
        <div>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 26 * size, letterSpacing: '-0.02em', color: BRAND.cream }}>Director of Operations</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 13 * size, color: 'rgba(248,244,238,0.6)', letterSpacing: '0.16em', marginTop: 4 * size, textTransform: 'uppercase' }}>
            Apex Regional Logistics  ·  35 people  ·  Orlando, FL
          </div>
        </div>
      </div>

      {/* Cinematic chrome */}
      <div style={{
        position: 'absolute', left: 24 * size, top: 24 * size, display: 'flex', gap: 10 * size, alignItems: 'center',
        fontFamily: FONTS.mono, fontSize: 12 * size, color: 'rgba(248,244,238,0.7)', letterSpacing: '0.18em',
      }}>
        <span style={{
          width: 8 * size, height: 8 * size, borderRadius: '50%', background: BRAND.accent,
          boxShadow: `0 0 12px ${BRAND.accent}`, animation: 'cv-blink 1.2s infinite',
        }} />
        <span>REC · INT-OPS-001 · TAKE 02</span>
      </div>
      <div style={{
        position: 'absolute', right: 24 * size, top: 24 * size,
        fontFamily: FONTS.mono, fontSize: 12 * size, color: 'rgba(248,244,238,0.6)', letterSpacing: '0.2em',
      }}>00:00:14 / 00:01:32  ·  90s SOCIAL CUT</div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', left: 24 * size, right: 24 * size, bottom: 36 * size, height: 3 * size,
        background: 'rgba(248,244,238,0.15)', borderRadius: 2,
      }}>
        <div style={{
          height: '100%', width: '14%',
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.glow})`,
          animation: 'cv-progress 16s linear infinite',
        }} />
      </div>
      <div style={{
        position: 'absolute', left: 24 * size, bottom: 16 * size,
        fontFamily: FONTS.mono, fontSize: 11 * size, color: 'rgba(248,244,238,0.5)', letterSpacing: '0.2em',
      }}>E · CUSTOMER VOICE · BRANDED ILLUSTRATION (NO STOCK PHOTOGRAPHY NEEDED)</div>

      <style>{`
        @keyframes cv-chunk {
          0%, 5% { opacity: 0; transform: translateY(${10 * size}px); }
          15%, 75% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; }
        }
        @keyframes cv-name {
          0%, 8% { opacity: 0; transform: translateX(-${20 * size}px); }
          20%, 80% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; }
        }
        @keyframes cv-blink { 50% { opacity: 0.3; } }
        @keyframes cv-orbit { 100% { transform: rotate(360deg); } }
        @keyframes cv-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.5; } }
        @keyframes cv-progress { 0% { width: 0; } 100% { width: 100%; } }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Production showcase — three frames + production-brief sidebar
// ════════════════════════════════════════════════════════════

function MotionProduction() {
  const pieces = [
    {
      letter: 'A', t: 'Mark Reveal',
      dur: '6s · seamless loop',
      where: 'Home hero (cinematic variant)',
      tools: 'Seedance 2.0 · After Effects · Octane',
      brief: 'The mark wakes up. Black void → rings expand outward → mark blooms with ember glow → tagline reveals. One shot, no narration. Loops perfectly so it can sit behind the hero as ambient motion.',
      el: <MarkReveal size={0.45} />,
    },
    {
      letter: 'C', t: 'Agent In Action',
      dur: '28s explainer · with VO',
      where: 'Services page + LinkedIn / YouTube ad',
      tools: 'Seedance 2.0 · ScreenFlow capture · ElevenLabs VO',
      brief: 'Four-scene narrative. Email floods → agent reads & classifies → routes to TMS / QuickBooks / Zendesk → metrics tick up. Live screen capture composited with motion-graphic overlays. The hero film for the entire site.',
      el: <AgentInAction size={0.45} />,
    },
    {
      letter: 'E', t: 'Customer Voice',
      dur: '90s reel · 30s social cut',
      where: 'Case study page · sales deck · LinkedIn',
      tools: 'Studio shoot · 4K 50mm · branded grade',
      brief: 'One customer, one chair, ember lighting. Lower-thirds in our type system, quote pulled in chunks, branded color grade. We shoot once per customer; one quarter = three reels. Single source of social-proof footage.',
      el: <CustomerVoice size={0.45} />,
    },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background: `radial-gradient(120% 80% at 50% 0%, ${BRAND.smoke}, ${BRAND.void} 70%)`,
      padding: '56px 56px 40px', color: BRAND.cream,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
        <div>
          <Eyebrow color={BRAND.glow}>Motion production · the recommended set</Eyebrow>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 40, letterSpacing: '-0.03em', marginTop: 8 }}>
            Three pieces. <span style={emberText()}>One quarter.</span> Full content engine.
          </div>
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(248,244,238,0.55)', letterSpacing: '0.12em', maxWidth: 420, textAlign: 'right' }}>
          THESE ARE 1920×1080 PREVIS · FINAL DELIVERY MP4 / WEBM + WEBP POSTERS · SEEDANCE 2.0 PIPELINE
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {pieces.map((p) => (
          <div key={p.letter} style={{
            display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24,
            background: 'rgba(36,21,16,0.5)',
            border: `1px solid ${BRAND.hairlineDark}`, borderRadius: 22,
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
              {p.el}
            </div>
            <div style={{ padding: '36px 36px 32px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <div style={{
                  fontFamily: FONTS.display, fontWeight: 600, fontSize: 64, letterSpacing: '-0.04em',
                  ...emberText(), lineHeight: 1,
                }}>{p.letter}</div>
                <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 30, letterSpacing: '-0.025em' }}>{p.t}</div>
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11.5, color: BRAND.glow, letterSpacing: '0.18em', marginTop: 10, textTransform: 'uppercase' }}>
                {p.dur}
              </div>
              <div style={{ fontSize: 14.5, color: 'rgba(248,244,238,0.75)', lineHeight: 1.6, marginTop: 16, textWrap: 'pretty' }}>
                {p.brief}
              </div>
              <Hairline dark style={{ margin: '20px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 10, fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(248,244,238,0.6)', letterSpacing: '0.06em' }}>
                  <span style={{ color: 'rgba(248,244,238,0.35)', minWidth: 70 }}>WHERE</span>{p.where}
                </div>
                <div style={{ display: 'flex', gap: 10, fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(248,244,238,0.6)', letterSpacing: '0.06em' }}>
                  <span style={{ color: 'rgba(248,244,238,0.35)', minWidth: 70 }}>PIPELINE</span>{p.tools}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Production timeline */}
      <div style={{
        marginTop: 32, padding: 28, background: 'rgba(36,21,16,0.5)',
        border: `1px solid ${BRAND.hairlineDark}`, borderRadius: 22,
      }}>
        <Eyebrow color={BRAND.glow}>Quarterly production calendar — recommended cadence</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 18 }}>
          {[
            { wk: 'WK 01–02', what: 'Mark Reveal',     who: 'Seedance + AE',   cost: '$2.8k' },
            { wk: 'WK 03–05', what: 'Agent In Action', who: 'Capture + Comp',  cost: '$8.5k' },
            { wk: 'WK 06–08', what: 'Customer Voice',  who: 'Studio shoot',    cost: '$4.2k' },
            { wk: 'WK 09–12', what: 'Cuts + iteration',who: 'Edit + grade',    cost: '$2k' },
          ].map((s) => (
            <div key={s.wk} style={{ padding: 18, borderRadius: 14, border: `1px solid ${BRAND.hairlineDark}`, background: 'rgba(15,8,5,0.4)' }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.accent, letterSpacing: '0.18em' }}>{s.wk}</div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 18, letterSpacing: '-0.02em', marginTop: 8 }}>{s.what}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(248,244,238,0.55)', letterSpacing: '0.04em', marginTop: 6 }}>{s.who}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: BRAND.glow, marginTop: 12 }}>{s.cost}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, padding: '14px 18px', borderRadius: 12, background: `linear-gradient(90deg, ${BRAND.burgundy}, ${BRAND.accent})`, color: BRAND.cream, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 18, letterSpacing: '-0.02em' }}>
            One quarter · three pieces · full content engine
          </div>
          <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 26, letterSpacing: '-0.03em' }}>
            ≈ $17.5k all-in
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MarkReveal, AgentInAction, CustomerVoice, MotionProduction, VOScript });

// ════════════════════════════════════════════════════════════
// VO SCRIPT — production doc for Agent In Action (28s explainer)
// Scene-by-scene voiceover + on-screen text + production notes.
// ════════════════════════════════════════════════════════════

function VOScript() {
  const scenes = [
    {
      n: '01', t: '0:00–0:07', label: 'INBOX FLOOD',
      vo: 'Every Monday, a thousand emails. Carriers, vendors, customers — all needing routing, all needing a person to read them.',
      ost: 'Carrier email floods your operations team.',
      shots: ['Wide on inbox — cards drop in', 'Cards stack faster than viewer can read'],
      music: 'Tense build · sub bass ducks under VO',
    },
    {
      n: '02', t: '0:07–0:14', label: 'THE AGENT',
      vo: 'Adopt AI builds one thing: a coordinator that never sleeps. It reads every message, figures out what kind it is, and routes it — usually inside a second.',
      ost: 'Reads. Classifies. Routes in under a second.',
      shots: ['Push in on agent core — mark glows', 'Three sample emails pass through, get tagged'],
      music: 'Pad swells · arpeggio enters',
    },
    {
      n: '03', t: '0:14–0:21', label: 'ROUTING',
      vo: 'It posts invoices to QuickBooks. Drops support tickets in Zendesk. Pings a human in Slack when it\u2019s not sure. All in tools you already use.',
      ost: 'Each one lands in exactly the right system.',
      shots: ['Four tool cards light up in sequence', 'Routing lines animate from agent core'],
      music: 'Arpeggio climbs · breath of brass',
    },
    {
      n: '04', t: '0:21–0:28', label: 'OUTCOME',
      vo: 'For one customer, that\u2019s twenty-two hours back every week. Two weeks to build. Six weeks to pay back. Pick one workflow — we\u2019ll handle the rest.',
      ost: 'Your team got 22 hours back this week.',
      shots: ['Four metrics tick up in sequence', 'Logo lockup — CTA card · "Book a call"'],
      music: 'Resolves to warm sustain · CTA chime',
    },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background: `linear-gradient(180deg, ${BRAND.smoke}, ${BRAND.void})`,
      padding: '48px 56px', color: BRAND.cream, fontFamily: FONTS.body,
    }}>
      {/* Header strip — looks like a production slate */}
      <div style={{
        padding: '20px 24px', borderRadius: 14,
        background: 'rgba(36,21,16,0.6)',
        border: `1px solid ${BRAND.hairlineDark}`,
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 24, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.glow, letterSpacing: '0.2em' }}>VOICEOVER SCRIPT · v0.4</div>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 26, letterSpacing: '-0.025em', marginTop: 4 }}>
            C &middot; Agent In Action
          </div>
        </div>
        {[
          ['DURATION', '28s · loops'],
          ['DELIVERABLE', 'MP4 / WEBM 1080p'],
          ['VO TALENT', 'F · 30s · warm · US'],
          ['STATUS', 'READY TO RECORD'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(248,244,238,0.5)', letterSpacing: '0.18em' }}>{k}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: BRAND.cream, marginTop: 4, letterSpacing: '0.04em' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Scene rows */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {scenes.map((s, i) => (
          <div key={s.n} style={{
            display: 'grid', gridTemplateColumns: '0.5fr 0.7fr 2.6fr 1.4fr 1.2fr',
            gap: 24, padding: '24px 28px',
            background: 'rgba(36,21,16,0.5)',
            border: `1px solid ${BRAND.hairlineDark}`, borderRadius: 16,
            alignItems: 'flex-start',
          }}>
            {/* number + label */}
            <div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 38, letterSpacing: '-0.03em', ...emberText() }}>{s.n}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.glow, letterSpacing: '0.18em', marginTop: 4 }}>{s.label}</div>
            </div>
            {/* timecode */}
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(248,244,238,0.45)', letterSpacing: '0.18em' }}>TC</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 16, color: BRAND.cream, marginTop: 6, letterSpacing: '0.04em' }}>{s.t}</div>
            </div>
            {/* VO */}
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: BRAND.accent, letterSpacing: '0.2em' }}>VOICEOVER</div>
              <div style={{ fontFamily: FONTS.editorial, fontStyle: 'italic', fontSize: 19, lineHeight: 1.4, color: BRAND.cream, marginTop: 8, letterSpacing: '-0.005em' }}>
                &ldquo;{s.vo}&rdquo;
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: BRAND.glow, letterSpacing: '0.2em', marginTop: 16 }}>ON-SCREEN TEXT</div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 15, color: 'rgba(248,244,238,0.85)', marginTop: 6 }}>
                {s.ost}
              </div>
            </div>
            {/* Shots */}
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(248,244,238,0.55)', letterSpacing: '0.2em' }}>SHOTS</div>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {s.shots.map((sh, j) => (
                  <div key={j} style={{ fontSize: 12.5, color: 'rgba(248,244,238,0.7)', lineHeight: 1.5, display: 'flex', gap: 8 }}>
                    <span style={{ color: BRAND.accent }}>{j + 1}.</span><span>{sh}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Music */}
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(248,244,238,0.55)', letterSpacing: '0.2em' }}>MUSIC</div>
              <div style={{ fontSize: 12.5, color: 'rgba(248,244,238,0.7)', marginTop: 8, lineHeight: 1.5 }}>{s.music}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes footer */}
      <div style={{
        marginTop: 20, padding: '20px 24px', borderRadius: 14,
        background: 'rgba(36,21,16,0.5)',
        border: `1px solid ${BRAND.hairlineDark}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32,
      }}>
        {[
          ['VOICE DIRECTION',
            'Calm, conversational. Like a peer explaining over coffee, not a sales pitch. No urgency, no enthusiasm spikes. The math speaks for itself.'],
          ['BRAND RULES',
            'No jargon (no "VPC", no "p95", no "eval suite"). Numbers spoken in full ("twenty-two hours", not "22 hours"). Always end on the customer, never on us.'],
          ['ALTS TO RECORD',
            'Three: hero 28s, 15s cut for LinkedIn, 6s bumper. Same VO talent. Captures generic enough to pair with future case studies.'],
        ].map(([h, body]) => (
          <div key={h}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: BRAND.glow, letterSpacing: '0.18em' }}>{h}</div>
            <div style={{ fontSize: 13.5, color: 'rgba(248,244,238,0.72)', lineHeight: 1.55, marginTop: 8 }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
