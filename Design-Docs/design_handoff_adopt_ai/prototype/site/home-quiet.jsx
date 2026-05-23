// site/home-quiet.jsx — Home variant A: Quiet Enterprise
// Restrained, type-led, lots of whitespace. Light cream surface.

function HomeQuiet({ hero, density = 'regular' }) {
  const pad = density === 'compact' ? 56 : density === 'airy' ? 96 : 72;
  const sectionGap = density === 'compact' ? 96 : density === 'airy' ? 160 : 128;
  const heroCopy = hero || {
    eyebrow: 'AI AUTOMATION SYSTEMS · EST. 2024',
    headline: 'Turn AI into your\ncompetitive advantage.',
    sub: 'We design, ship, and run production-grade automation for enterprise teams. Not pilots. Not demos. Systems that pay back in 90 days.',
  };

  return (
    <div style={{ background: BRAND.cream, color: BRAND.ink, fontFamily: FONTS.body }}>
      <SiteNav current="home" sticky={false} />

      {/* HERO ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', padding: `${pad * 1.5}px ${pad}px ${pad * 1.5}px`, overflow: 'hidden' }}>
        <AmbientOrbs intensity={0.35} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <Eyebrow style={{ marginBottom: 28 }}>{heroCopy.eyebrow}</Eyebrow>
            <h1 data-comment-anchor="home-quiet-headline" style={{
              fontFamily: FONTS.display, fontWeight: 500, fontSize: 88,
              letterSpacing: '-0.045em', lineHeight: 0.98, margin: 0,
              color: BRAND.ink, whiteSpace: 'pre-line', textWrap: 'pretty',
            }}>
              {heroCopy.headline.split('\n').map((l, i) => (
                <div key={i}>
                  {i === 1 ? <span style={emberText()}>{l}</span> : l}
                </div>
              ))}
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: 'rgba(61,26,15,0.7)', maxWidth: 560, marginTop: 32 }}>
              {heroCopy.sub}
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
              <Button variant="dark" size="lg">Book a discovery call</Button>
              <Button variant="ghost" size="lg">See our work</Button>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 48 }}>
              <AgentPill label="445.5 hrs reallocated this week" />
              <AgentPill label="$17,820 saved" status="queue" />
            </div>
          </div>
          {/* Mark with rings */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 460 }}>
            <AmbientRings size={460} />
            <img src="assets/adopt-ai-mark.png" alt="" width={240}
              style={{ position: 'absolute', filter: 'drop-shadow(0 24px 60px rgba(168,42,40,0.3))' }} />
          </div>
        </div>
      </div>

      {/* TRUSTED BY ─────────────────────────────────────────── */}
      <div style={{ padding: `40px ${pad}px`, borderTop: `1px solid ${BRAND.hairline}`, borderBottom: `1px solid ${BRAND.hairline}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 56, justifyContent: 'space-between' }}>
          <Eyebrow color="rgba(61,26,15,0.5)">Trusted by ops teams at</Eyebrow>
          {['APEX LOGISTICS', 'NORTHWIND', 'HELIX BIO', 'STRATA FIN', 'OAKMONT', 'IRONLEDGER'].map((n) => (
            <div key={n} style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 14, letterSpacing: '0.18em', color: 'rgba(61,26,15,0.45)' }}>{n}</div>
          ))}
        </div>
      </div>

      {/* SERVICES ─────────────────────────────────────────── */}
      <div style={{ padding: `${sectionGap}px ${pad}px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <div style={{ maxWidth: 640 }}>
            <Eyebrow style={{ marginBottom: 16 }}>What we build · 05</Eyebrow>
            <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 56, letterSpacing: '-0.035em', margin: 0, lineHeight: 1.05 }}>
              Five production-ready automation systems, ready to deploy.
            </h2>
          </div>
          <Button variant="ghost">All services</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {[
            { n: '01', t: 'Workflow Agents', d: 'Replace repetitive ops with agents that read inboxes, files, and tickets. Email intake, scheduling, internal routing.', m: '14,235 queries / wk' },
            { n: '02', t: 'Document & Invoice Intelligence', d: 'OCR + LLM reconciliation across vendors, ERPs, and ledgers. Catches what your AP team can\'t.', m: '98.9% audit accuracy' },
            { n: '03', t: 'Customer Support Router', d: 'Intelligent triage layer in front of your existing CX stack. Cuts first-response by 80%.', m: '32,901 interactions' },
            { n: '04', t: 'Custom Model Fine-tuning', d: 'Domain LLMs trained on your data, your tone, your edge cases. Runs in your VPC.', m: 'SOC 2 · ISO 27001' },
          ].map((s) => (
            <div key={s.n} style={{
              padding: 36, borderRadius: 18, background: BRAND.paper,
              border: `1px solid ${BRAND.hairline}`,
              transition: 'transform .2s, box-shadow .2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.accent, letterSpacing: '0.16em' }}>{s.n}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(61,26,15,0.4)', letterSpacing: '0.12em' }}>{s.m}</div>
              </div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 30, letterSpacing: '-0.025em', marginTop: 80, lineHeight: 1.1 }}>{s.t}</div>
              <div style={{ fontSize: 15, color: 'rgba(61,26,15,0.7)', lineHeight: 1.55, marginTop: 14 }}>{s.d}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: BRAND.accent, letterSpacing: '0.12em', marginTop: 32, textTransform: 'uppercase' }}>Read playbook →</div>
            </div>
          ))}
        </div>
      </div>

      {/* CASE STUDY ────────────────────────────────────────── */}
      <div style={{ background: BRAND.ink, color: BRAND.cream, padding: `${sectionGap}px ${pad}px`, position: 'relative', overflow: 'hidden' }}>
        <AmbientOrbs intensity={0.4} dark />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <Eyebrow color={BRAND.glow} style={{ marginBottom: 20 }}>Featured · Apex Global Logistics</Eyebrow>
            <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 56, letterSpacing: '-0.035em', margin: 0, lineHeight: 1.05 }}>
              From 14,000 emails / week to <span style={emberText()}>118 hours back</span> for the ops team.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(248,244,238,0.7)', marginTop: 28, maxWidth: 520 }}>
              We replaced Apex's inbound coordination layer with an intake agent that reads, classifies,
              and routes carrier and customer email. Six weeks. Zero new headcount.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
              <Button variant="primary">Read the case study</Button>
              <Button variant="ghost" dark>Watch 90s walkthrough</Button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <Metric value="445.5" label="Hours reallocated / wk" accent dark />
            <Metric value="$17.8k" label="Cost reduction / wk" dark />
            <Metric value="99.4%" label="Intake success rate" dark />
            <Metric value="6 wks" label="Time to production" dark />
          </div>
        </div>
      </div>

      {/* HOW WE WORK ──────────────────────────────────────── */}
      <div style={{ padding: `${sectionGap}px ${pad}px` }}>
        <Eyebrow style={{ marginBottom: 16 }}>How we work</Eyebrow>
        <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 56, letterSpacing: '-0.035em', margin: '0 0 56px', maxWidth: 800, lineHeight: 1.05 }}>
          Three sprints. One signed-off, shipping system.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { n: '01', t: 'Scope & wire', d: 'Two-week discovery: map the workflow, score the ROI, propose the architecture. You get a fixed-price brief.' },
            { n: '02', t: 'Build in your VPC', d: 'Four-to-eight weeks of focused build. You see every PR. Models, prompts, evals — all yours.' },
            { n: '03', t: 'Run, tune, hand off', d: 'We operate the system for 90 days, then hand it to your team with full runbooks and dashboards.' },
          ].map((s) => (
            <div key={s.n} style={{ borderTop: `2px solid ${BRAND.accent}`, paddingTop: 22 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.accent, letterSpacing: '0.18em' }}>STEP {s.n}</div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', marginTop: 18 }}>{s.t}</div>
              <div style={{ fontSize: 15, color: 'rgba(61,26,15,0.7)', lineHeight: 1.6, marginTop: 12 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA ─────────────────────────────────────────────── */}
      <div style={{ padding: `40px ${pad}px ${sectionGap}px` }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 24, padding: '80px 64px',
          background: `linear-gradient(120deg, ${BRAND.burgundy}, ${BRAND.accent} 50%, ${BRAND.glow})`,
          color: BRAND.cream,
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, opacity: 0.25 }}>
            <AmbientRings size={420} dark />
          </div>
          <Eyebrow color="rgba(255,248,240,0.7)" style={{ marginBottom: 18 }}>Ready when you are</Eyebrow>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 64, letterSpacing: '-0.04em', margin: 0, lineHeight: 1.02, maxWidth: 760 }}>
            Talk to an architect, not a salesperson.
          </h2>
          <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
            <Button variant="dark" size="lg">Book a 30-min discovery</Button>
            <Button variant="ghost" dark size="lg">Download capability deck</Button>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

Object.assign(window, { HomeQuiet });
