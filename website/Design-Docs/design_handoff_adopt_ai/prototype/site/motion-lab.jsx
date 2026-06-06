// site/motion-lab.jsx — Six motion / 3D concepts for Adopt AI
// Live CSS-animated previews + descriptions of where each would fit.

// ─── concept A: cinematic mark reveal ──────────────────────
function MotionMarkReveal() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(80% 60% at 50% 50%, ${BRAND.smoke}, ${BRAND.void})`,
      overflow: 'hidden',
    }}>
      <AmbientOrbs intensity={0.7} dark />
      {/* Expanding rings */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 60, height: 60, marginLeft: -30, marginTop: -30,
          borderRadius: '50%', border: `1px solid ${BRAND.accent}`,
          opacity: 0,
          animation: `markRing 4s ease-out infinite`,
          animationDelay: `${i * 1}s`,
        }} />
      ))}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'markPulse 4s ease-in-out infinite',
      }}>
        <img src="assets/adopt-ai-mark.png" width={120}
          style={{ filter: 'drop-shadow(0 0 24px rgba(230,126,34,0.5))' }} alt="" />
      </div>
      <style>{`
        @keyframes markRing {
          0% { width: 60px; height: 60px; margin-left: -30px; margin-top: -30px; opacity: 0.8; }
          100% { width: 260px; height: 260px; margin-left: -130px; margin-top: -130px; opacity: 0; }
        }
        @keyframes markPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
      `}</style>
    </div>
  );
}

// ─── concept B: neural mesh flow ───────────────────────────
function MotionNeuralFlow() {
  // Animated particle traveling along circuit traces.
  const traces = [
    { d: 'M 30 60 L 120 60 L 120 30 L 220 30', dur: 3.5 },
    { d: 'M 30 120 L 90 120 L 90 90 L 180 90 L 180 130 L 250 130', dur: 4.2, delay: 0.8 },
    { d: 'M 30 200 L 70 200 L 70 170 L 140 170 L 140 220 L 250 220', dur: 5.0, delay: 1.5 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: BRAND.obsidian, overflow: 'hidden' }}>
      <svg viewBox="0 0 280 260" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ml-particle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={BRAND.accent} stopOpacity="0" />
            <stop offset="1" stopColor={BRAND.glow} stopOpacity="1" />
          </linearGradient>
        </defs>
        <g stroke="rgba(230,126,34,0.18)" strokeWidth="1.2" fill="none">
          {traces.map((tr, i) => <path key={i} d={tr.d} />)}
        </g>
        {/* nodes */}
        {[[30,60],[120,60],[120,30],[220,30],[30,120],[90,120],[90,90],[180,90],[180,130],[250,130],[30,200],[70,200],[70,170],[140,170],[140,220],[250,220]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill={BRAND.glow} opacity="0.6" />
        ))}
        {/* moving particles */}
        {traces.map((tr, i) => (
          <circle key={`p${i}`} r="4" fill={BRAND.accent}
            style={{ filter: `drop-shadow(0 0 8px ${BRAND.accent})` }}>
            <animateMotion dur={`${tr.dur}s`} repeatCount="indefinite" begin={`${tr.delay || 0}s`} path={tr.d} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur={`${tr.dur}s`} repeatCount="indefinite" begin={`${tr.delay || 0}s`} />
          </circle>
        ))}
      </svg>
    </div>
  );
}

// ─── concept C: agent-in-action ────────────────────────────
function MotionAgentInAction() {
  return (
    <div style={{
      position: 'absolute', inset: 0, padding: 18,
      background: `linear-gradient(180deg, ${BRAND.smoke}, ${BRAND.void})`,
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center',
      overflow: 'hidden',
    }}>
      {/* Inbox */}
      <div style={{ ...FONTS, fontFamily: FONTS.mono, fontSize: 9, color: 'rgba(248,244,238,0.8)' }}>
        <div style={{ color: BRAND.glow, marginBottom: 6, letterSpacing: '0.16em' }}>INBOX</div>
        {[
          { from: 'CarrierX', subj: 'ETA delay #88241', a: 0 },
          { from: 'AP', subj: 'Invoice #112-A', a: 0.4 },
          { from: 'Support', subj: 'Refund Q', a: 0.8 },
          { from: 'Ops', subj: 'BOL exception', a: 1.2 },
        ].map((m, i) => (
          <div key={i} style={{
            padding: '4px 6px', marginBottom: 3,
            background: 'rgba(248,244,238,0.06)', borderRadius: 4,
            opacity: 0,
            animation: `inboxIn 6s linear infinite`,
            animationDelay: `${m.a}s`,
          }}>
            <div style={{ color: BRAND.glow }}>{m.from}</div>
            <div style={{ opacity: 0.7 }}>{m.subj}</div>
          </div>
        ))}
      </div>

      {/* Agent core */}
      <div style={{ position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1px solid ${BRAND.accent}`, opacity: 0.35,
          animation: 'agentSpin 3s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: `1px dashed ${BRAND.glow}`, opacity: 0.6,
          animation: 'agentSpin 4s linear infinite reverse',
        }} />
        <img src="assets/adopt-ai-mark.png" width={42} alt="" />
      </div>

      {/* Routed outputs */}
      <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: 'rgba(248,244,238,0.8)' }}>
        <div style={{ color: BRAND.glow, marginBottom: 6, letterSpacing: '0.16em' }}>ROUTED →</div>
        {[
          { tag: '✓ eta', t: '→ TMS', a: 0.4 },
          { tag: '✓ inv', t: '→ AP queue', a: 0.8 },
          { tag: '✓ sup', t: '→ tier-1', a: 1.2 },
          { tag: '⚙ ops', t: '→ human', a: 1.6 },
        ].map((r, i) => (
          <div key={i} style={{
            padding: '4px 6px', marginBottom: 3,
            background: 'rgba(217,70,44,0.12)', border: `1px solid rgba(217,70,44,0.25)`,
            borderRadius: 4, opacity: 0,
            animation: `inboxIn 6s linear infinite`,
            animationDelay: `${r.a}s`,
          }}>
            <div style={{ color: r.tag.startsWith('⚙') ? BRAND.gold : BRAND.glow }}>{r.tag}</div>
            <div style={{ opacity: 0.7 }}>{r.t}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes agentSpin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
        @keyframes inboxIn {
          0% { opacity: 0; transform: translateX(-8px); }
          8%, 90% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

// ─── concept D: data rain ──────────────────────────────────
function MotionDataRain() {
  // Vertical "rain" of mono tokens, classifying as it falls into colored buckets at bottom.
  const cols = 14;
  const tokens = ['ETA', 'PO', 'BOL', 'REF', '$$', 'INV', 'CX', 'TKT', 'NEW', 'OK', '?'];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(180deg, ${BRAND.void}, ${BRAND.smoke})`,
      overflow: 'hidden',
    }}>
      {Array.from({ length: cols }).map((_, c) => (
        <div key={c} style={{
          position: 'absolute',
          left: `${(c / cols) * 100}%`,
          top: -40, width: `${100 / cols}%`,
          color: c % 3 === 0 ? BRAND.accent : c % 3 === 1 ? BRAND.glow : 'rgba(248,244,238,0.6)',
          fontFamily: FONTS.mono, fontSize: 10, lineHeight: 1.6, textAlign: 'center',
          animation: `dataRain ${6 + (c % 4)}s linear infinite`,
          animationDelay: `${c * 0.3}s`,
          opacity: 0.85,
        }}>
          {Array.from({ length: 16 }).map((_, k) => (
            <div key={k}>{tokens[(c + k) % tokens.length]}</div>
          ))}
        </div>
      ))}
      {/* gradient bucket at bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 38,
        background: `linear-gradient(180deg, transparent, ${BRAND.burgundy} 60%, ${BRAND.accent})`,
      }} />
      <style>{`
        @keyframes dataRain {
          0% { transform: translateY(0); }
          100% { transform: translateY(110%); }
        }
      `}</style>
    </div>
  );
}

// ─── concept E: customer testimonial placeholder ───────────
function MotionTestimonial() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BRAND.smoke, overflow: 'hidden' }}>
      {/* Placeholder "video" — gradient with a person silhouette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(60% 50% at 50% 60%, ${BRAND.burgundy}, ${BRAND.smoke} 65%)`,
      }} />
      <div style={{
        position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)',
        width: 180, height: 180, borderRadius: '50% 50% 0 0',
        background: `linear-gradient(180deg, ${BRAND.ink} 0%, ${BRAND.smoke} 100%)`,
      }} />
      {/* head circle */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 88, transform: 'translateX(-50%)',
        width: 80, height: 80, borderRadius: '50%',
        background: `radial-gradient(at 30% 30%, ${BRAND.ink} 0%, ${BRAND.void} 100%)`,
        boxShadow: '0 0 0 1px rgba(248,244,238,0.05)',
      }} />
      {/* play button */}
      <div style={{
        position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%, -50%)',
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(248,244,238,0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        animation: 'playPulse 2.4s ease-in-out infinite',
      }}>
        <div style={{
          width: 0, height: 0, marginLeft: 4,
          borderTop: '10px solid transparent',
          borderBottom: '10px solid transparent',
          borderLeft: `15px solid ${BRAND.accent}`,
        }} />
      </div>
      {/* lower-third caption */}
      <div style={{
        position: 'absolute', left: 18, right: 18, bottom: 12,
        fontFamily: FONTS.mono, fontSize: 9.5, color: 'rgba(248,244,238,0.9)', letterSpacing: '0.18em',
      }}>
        <div style={{ color: BRAND.glow }}>02:14 / 03:42</div>
        <div style={{ marginTop: 2, textTransform: 'uppercase' }}>"Six weeks. It just works." — customer</div>
      </div>
      <style>{`@keyframes playPulse { 0%,100%{transform:translate(-50%,-50%) scale(1);box-shadow:0 8px 24px rgba(0,0,0,.4)} 50%{transform:translate(-50%,-50%) scale(1.08);box-shadow:0 12px 32px rgba(217,70,44,.45)} }`}</style>
    </div>
  );
}

// ─── concept F: workflow visualization ─────────────────────
function MotionWorkflow() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BRAND.obsidian, overflow: 'hidden' }}>
      <svg viewBox="0 0 280 260" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="wl-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={BRAND.accent} />
            <stop offset="1" stopColor={BRAND.glow} />
          </linearGradient>
        </defs>
        {/* connecting lines */}
        <g stroke="url(#wl-grad)" strokeWidth="0.8" fill="none" opacity="0.5">
          <line x1="60" y1="60" x2="140" y2="100">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="220" y1="60" x2="140" y2="100">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="0.5s" />
          </line>
          <line x1="140" y1="100" x2="80" y2="180">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="1s" />
          </line>
          <line x1="140" y1="100" x2="200" y2="180">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="1.5s" />
          </line>
          <line x1="80" y1="180" x2="140" y2="220">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="2s" />
          </line>
          <line x1="200" y1="180" x2="140" y2="220">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="2.5s" />
          </line>
        </g>
        {/* nodes */}
        {[
          [60, 60, 'In: Email'],
          [220, 60, 'In: Slack'],
          [140, 100, 'Agent'],
          [80, 180, 'TMS'],
          [200, 180, 'AP'],
          [140, 220, 'Done'],
        ].map(([x, y, l], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="14" fill={BRAND.smoke} stroke={i === 2 ? BRAND.glow : BRAND.accent} strokeWidth="1.4">
              <animate attributeName="r" values="14;16;14" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
            </circle>
            <text x={x} y={y + 28} fontSize="8" fill="rgba(248,244,238,0.7)" textAnchor="middle" fontFamily={FONTS.mono}>{l}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── composite ─────────────────────────────────────────────
function MotionLab() {
  const concepts = [
    { key: 'A', t: 'Mark Reveal', el: <MotionMarkReveal />,
      where: 'Hero film · 4–6s', desc: 'The mark wakes up — orbital rings expand outward as the logo pulses. Use it once, as the first thing visitors see. Works as a looping ambient hero too.' },
    { key: 'B', t: 'Neural Flow', el: <MotionNeuralFlow />,
      where: 'Section transition · 8–12s', desc: 'Particles travel along circuit traces. Calm, looping, no narration. Good as a backdrop behind testimonials or pricing.' },
    { key: 'C', t: 'Agent In Action', el: <MotionAgentInAction />,
      where: 'Product explainer · 20–40s', desc: 'Three-panel: inbox on the left, agent in the middle, routed outputs on the right. Replace the SVG core with a real screen-recording of your console.' },
    { key: 'D', t: 'Data Rain', el: <MotionDataRain />,
      where: 'Ambient loop · 6–10s', desc: 'Falling tokens classify into a colored bucket. Use as a hero side panel or behind the services bento grid. Renders well at any size.' },
    { key: 'E', t: 'Customer Voice', el: <MotionTestimonial />,
      where: 'Case-study reel · 30–90s', desc: 'Talking-head video over an ember vignette, with mono lower-thirds. You shoot once per customer; we edit and grade to match the brand.' },
    { key: 'F', t: 'Workflow Trace', el: <MotionWorkflow />,
      where: 'Case-study asset · 8–15s', desc: 'Animated node graph of the customer\'s workflow. Pulses light up through the path as the narrator walks through it.' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden',
      background: `radial-gradient(120% 80% at 50% 0%, ${BRAND.smoke} 0%, ${BRAND.void} 70%)`,
      padding: '56px 56px 40px', color: BRAND.cream,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
        <div>
          <Eyebrow color={BRAND.glow}>Motion lab · Seedance 2.0 + after-effects</Eyebrow>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 36, letterSpacing: '-0.03em', marginTop: 8 }}>
            Six 3D / video directions. Pick the ones you want shot.
          </div>
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(248,244,238,0.55)', letterSpacing: '0.12em', maxWidth: 380, textAlign: 'right' }}>
          THESE ARE LIVE CSS PREVIEWS · FINAL DELIVERY WOULD BE MP4 / WEBM AT 1920×1080 OR 1080×1080
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {concepts.map((c) => (
          <div key={c.key} style={{
            background: 'rgba(36,21,16,0.6)',
            border: `1px solid ${BRAND.hairlineDark}`, borderRadius: 18,
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{ position: 'relative', aspectRatio: '16 / 11', overflow: 'hidden' }}>
              {c.el}
              <div style={{
                position: 'absolute', top: 12, left: 14, padding: '4px 8px',
                borderRadius: 999, background: 'rgba(15,8,5,0.7)',
                fontFamily: FONTS.mono, fontSize: 10, color: BRAND.glow, letterSpacing: '0.18em',
                border: `1px solid ${BRAND.hairlineDark}`,
              }}>{c.key} · {c.where}</div>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em' }}>{c.t}</div>
              <div style={{ fontSize: 13.5, color: 'rgba(248,244,238,0.68)', lineHeight: 1.55, marginTop: 8 }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  MotionMarkReveal, MotionNeuralFlow, MotionAgentInAction,
  MotionDataRain, MotionTestimonial, MotionWorkflow,
  MotionLab,
});
