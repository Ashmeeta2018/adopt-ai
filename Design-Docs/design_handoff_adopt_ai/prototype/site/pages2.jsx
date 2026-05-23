// site/pages2.jsx — About, Pricing, Contact, Portal Login

// ─── 5. ABOUT / STORY (no named team — we're a small studio) ───
function PageAbout({ density = 'regular' }) {
  const pad = density === 'compact' ? 56 : 72;
  return (
    <div style={{ background: BRAND.cream, color: BRAND.ink, fontFamily: FONTS.body }}>
      <SiteNav current="about" sticky={false} />
      <div style={{ position: 'relative', padding: `80px ${pad}px 64px`, overflow: 'hidden' }}>
        <AmbientOrbs intensity={0.3} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <Eyebrow style={{ marginBottom: 18 }}>About · Est. 2024 · Orlando, FL</Eyebrow>
            <h1 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 88, letterSpacing: '-0.045em', margin: 0, lineHeight: 0.98 }}>
              We're a small studio building AI that <span style={emberText()}>actually ships</span>.
            </h1>
            <p style={{ fontSize: 19, color: 'rgba(61,26,15,0.7)', marginTop: 28, maxWidth: 620, lineHeight: 1.55 }}>
              Adopt AI is a workflow intelligence studio for growing teams — small and mid-sized
              companies that want production-grade automation without an enterprise budget.
              We design the system, fine-tune the models, write the runbooks, and stay on the
              pager until your team is ready to take over.
            </p>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 380 }}>
            <AmbientRings size={380} />
            <img src="assets/adopt-ai-mark.png" width={200} style={{ position: 'absolute', filter: 'drop-shadow(0 24px 60px rgba(168,42,40,0.3))' }} alt="" />
          </div>
        </div>
      </div>

      {/* Story strip */}
      <div style={{ padding: `64px ${pad}px`, background: BRAND.paper, borderTop: `1px solid ${BRAND.hairline}`, borderBottom: `1px solid ${BRAND.hairline}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64 }}>
          <Eyebrow>Why we exist</Eyebrow>
          <div>
            <h2 style={{ fontFamily: FONTS.editorial, fontStyle: 'italic', fontWeight: 400, fontSize: 44, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.15, color: BRAND.ink }}>
              "Most AI work in 2025 stops at the demo. We were tired of decks that didn't survive contact with production — so we started shipping instead."
            </h2>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(61,26,15,0.55)', marginTop: 24, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              — Founder's note · April 2024
            </div>
          </div>
        </div>
      </div>

      {/* Principles */}
      <div style={{ padding: `80px ${pad}px` }}>
        <Eyebrow>How we work — five principles</Eyebrow>
        <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 48, letterSpacing: '-0.035em', margin: '14px 0 48px', maxWidth: 900, lineHeight: 1.05 }}>
          Built for shops that need <span style={emberText()}>outcomes</span>, not vendor lock-in.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28 }}>
          {[
            ['No pilots', 'No paid proofs-of-concept. We ship to production or we don\'t take the engagement.'],
            ['Fixed price', 'You know what you\'re paying before we start. No hourly billing, no surprise overages.'],
            ['Your VPC', 'Models run in your cloud account. You own the weights. We hand back keys, not lock-in.'],
            ['On the pager', 'We operate the system with you for 90 days post-launch, then hand it off — fully.'],
            ['Quiet over loud', 'No demo theatre. The dashboards tell the story; the savings show up on the P&L.'],
          ].map(([t, d], i) => (
            <div key={t}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.accent, letterSpacing: '0.2em' }}>0{i+1}</div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em', marginTop: 12 }}>{t}</div>
              <div style={{ fontSize: 14, color: 'rgba(61,26,15,0.7)', marginTop: 8, lineHeight: 1.55 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Who we work with */}
      <div style={{ padding: `40px ${pad}px 96px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'stretch' }}>
          <div style={{ padding: 40, borderRadius: 22, background: BRAND.paper, border: `1px solid ${BRAND.hairline}` }}>
            <Eyebrow color={BRAND.accent}>Right fit</Eyebrow>
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', marginTop: 12, lineHeight: 1.15 }}>You'll love working with us if…</div>
            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Your team is 10–500 people and growing',
                'You have one workflow eating most of an FTE\'s day',
                'You\'ve tried "an AI tool" and it didn\'t stick',
                'You want to own what gets built, not rent it',
                'You\'d rather pay $5k once than $200/seat/mo forever',
              ].map((p) => (
                <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, color: 'rgba(61,26,15,0.85)' }}>
                  <span style={{ color: BRAND.accent, marginTop: 2 }}>✓</span><span>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 40, borderRadius: 22, background: BRAND.ink, color: BRAND.cream, position: 'relative', overflow: 'hidden' }}>
            <AmbientOrbs intensity={0.3} dark />
            <div style={{ position: 'relative' }}>
              <Eyebrow color={BRAND.glow}>Not a fit (yet)</Eyebrow>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', marginTop: 12, lineHeight: 1.15 }}>We're probably wrong for you if…</div>
              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'You\'re looking for a 6-month "AI strategy" engagement',
                  'You want a chatbot bolted onto your website',
                  'Your data isn\'t in any system yet',
                  'You need 24/7 dedicated headcount on day one',
                  'You can\'t name the workflow you want to fix',
                ].map((p) => (
                  <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, color: 'rgba(248,244,238,0.85)' }}>
                    <span style={{ color: BRAND.glow, marginTop: 2 }}>—</span><span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

// ─── 6. PRICING — SMB-friendly tiers ──────────────────────
function PagePricing({ density = 'regular' }) {
  const pad = density === 'compact' ? 56 : 72;
  return (
    <div style={{ background: BRAND.cream, color: BRAND.ink, fontFamily: FONTS.body }}>
      <SiteNav current="pricing" sticky={false} />
      <div style={{ padding: `80px ${pad}px 48px`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <AmbientOrbs intensity={0.3} />
        <div style={{ position: 'relative' }}>
          <Eyebrow style={{ marginBottom: 22 }}>Pricing · Fixed-price · Built for SMBs</Eyebrow>
          <h1 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 84, letterSpacing: '-0.045em', margin: 0, lineHeight: 1, maxWidth: 980, marginLeft: 'auto', marginRight: 'auto' }}>
            Real automation. <span style={emberText()}>Real budgets</span>.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(61,26,15,0.7)', marginTop: 24, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>
            We charge once for the build, then a small monthly to keep the system healthy.
            No usage tax. No per-seat fees. Cancel the operate plan anytime.
          </p>
        </div>
      </div>

      {/* Tier cards */}
      <div style={{ padding: `40px ${pad}px 56px`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {[
          { t: 'Spark',  p: '$2,400', pSub: 'one-time build',
            recur: '+ $149 / mo operate',
            sub: 'One agent · 2 weeks',
            d: 'A single workflow done right. Inbox triage, invoice extraction, or appointment routing — pick one.',
            f: ['One production agent', 'Eval suite + runbook', '30 days operate included', 'Hosted in your cloud', 'Hand-off training'],
            cta: 'Start a Spark project', flag: '' },
          { t: 'Lift',   p: '$5,800', pSub: 'one-time build',
            recur: '+ $499 / mo operate',
            sub: 'Up to 3 agents · 5–6 weeks',
            d: 'A connected set of agents — most local teams replace a back-office function entirely with this.',
            f: ['Up to 3 production agents', 'Shared eval + observability', '90 days operate included', 'Slack + email integrations', 'Quarterly review'],
            cta: 'Talk to an architect', flag: 'Most chosen' },
          { t: 'Scale',  p: 'From $12,000', pSub: 'custom scope',
            recur: '+ retainer from $799 / mo',
            sub: 'Custom · 8–12 weeks',
            d: 'Multi-agent system + light fine-tuning. For teams replacing a whole function or department.',
            f: ['Multi-agent system', 'Domain-tuned model (optional)', 'Embedded for 90 days', 'Source code + weights yours', 'SLA + on-call'],
            cta: 'Request a scoping call', flag: '' },
        ].map((tier, i) => (
          <div key={tier.t} style={{
            position: 'relative', borderRadius: 22, padding: 32,
            background: i === 1 ? BRAND.ink : BRAND.paper,
            color: i === 1 ? BRAND.cream : BRAND.ink,
            border: `1px solid ${i === 1 ? BRAND.hairlineDark : BRAND.hairline}`,
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            {tier.flag && (
              <div style={{ position: 'absolute', top: 18, right: 18, padding: '4px 10px', borderRadius: 999, background: BRAND.accent, color: BRAND.cream, fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '0.18em' }}>
                {tier.flag.toUpperCase()}
              </div>
            )}
            <Eyebrow color={i === 1 ? BRAND.glow : BRAND.accent}>{tier.sub}</Eyebrow>
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 38, letterSpacing: '-0.03em', marginTop: 14 }}>{tier.t}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 16 }}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 52, letterSpacing: '-0.04em', ...(i !== 1 ? emberText() : {}) }}>{tier.p}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: i === 1 ? 'rgba(248,244,238,0.55)' : 'rgba(61,26,15,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tier.pSub}</div>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: i === 1 ? 'rgba(248,244,238,0.72)' : 'rgba(61,26,15,0.72)', letterSpacing: '0.04em', marginTop: 6 }}>{tier.recur}</div>
            <div style={{ fontSize: 14, color: i === 1 ? 'rgba(248,244,238,0.7)' : 'rgba(61,26,15,0.7)', marginTop: 14, lineHeight: 1.55 }}>{tier.d}</div>
            <Hairline dark={i === 1} style={{ margin: '22px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {tier.f.map((f) => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: i === 1 ? 'rgba(248,244,238,0.85)' : 'rgba(61,26,15,0.85)' }}>
                  <span style={{ color: BRAND.accent }}>◆</span>{f}
                </div>
              ))}
            </div>
            <Button variant={i === 1 ? 'primary' : 'dark'} size="md" style={{ marginTop: 28, width: '100%', justifyContent: 'center' }}>{tier.cta}</Button>
          </div>
        ))}
      </div>

      {/* ROI helper */}
      <div style={{ padding: `0 ${pad}px 64px` }}>
        <div style={{
          background: BRAND.paper, border: `1px solid ${BRAND.hairline}`, borderRadius: 18,
          padding: 32, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'center',
        }}>
          <div>
            <Eyebrow color={BRAND.accent}>Quick math</Eyebrow>
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', marginTop: 10, lineHeight: 1.2 }}>
              The average Spark pays back in <span style={emberText()}>under 8 weeks</span>.
            </div>
            <div style={{ fontSize: 14, color: 'rgba(61,26,15,0.7)', marginTop: 10, lineHeight: 1.55, maxWidth: 540 }}>
              Most SMB workflows we automate save 15–30 hours of focused work per week.
              At $50/hr fully-loaded labor, that's $3k–$6k saved monthly — usually more than the operate fee, in the first month.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, textAlign: 'center' }}>
            {[['15+', 'hrs / wk saved'], ['8 wks', 'avg payback'], ['$0', 'per-seat fees']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 36, letterSpacing: '-0.03em', ...emberText() }}>{v}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.55)', letterSpacing: '0.16em', marginTop: 6, textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div style={{ padding: `0 ${pad}px 96px` }}>
        <Eyebrow style={{ marginBottom: 16 }}>What's actually included</Eyebrow>
        <div style={{ background: BRAND.paper, border: `1px solid ${BRAND.hairline}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            padding: '14px 28px', background: 'rgba(61,26,15,0.04)', borderBottom: `1px solid ${BRAND.hairline}`,
            fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(61,26,15,0.55)', letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>
            <div></div><div>Spark</div><div>Lift</div><div>Scale</div>
          </div>
          {[
            ['Production agents',       '1',       'up to 3', 'multi'],
            ['Eval suite + runbook',    '✓',       '✓',       '✓'],
            ['Hosted in your cloud',    '✓',       '✓',       '✓'],
            ['Operate period included', '30 days', '90 days', 'Embedded'],
            ['Slack + email hooks',     '—',       '✓',       '✓'],
            ['Domain-tuned model',      '—',       '—',       '✓'],
            ['Quarterly review',        '—',       '✓',       '✓'],
            ['On-call SLA',             '—',       'Shared',  'Dedicated'],
            ['Source + weights yours',  '✓',       '✓',       '✓'],
          ].map((row, i) => (
            <div key={row[0]} style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
              padding: '18px 28px', borderBottom: i < 8 ? `1px solid ${BRAND.hairline}` : 'none',
              fontSize: 14, color: 'rgba(61,26,15,0.85)',
            }}>
              <div>{row[0]}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13 }}>{row[1]}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: BRAND.accent }}>{row[2]}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13 }}>{row[3]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: `0 ${pad}px 96px` }}>
        <Eyebrow>Common questions</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
          {[
            ['Do you do hourly or T&M?', 'No. Every engagement is fixed-price with a written scope. If the scope changes mid-build, we re-quote together.'],
            ['What if it doesn\'t work?', 'The Spark and Lift builds include a written success criteria. If we miss it, we keep working at no extra cost until we hit it — or you don\'t pay the final invoice.'],
            ['Can we cancel the monthly?', 'Yes, anytime. The operate plan is monthly. After 90 days you also own everything: code, weights, prompts, runbooks.'],
            ['Do you support seasonal businesses?', 'Yes. We can pause the operate plan up to 4 months a year — useful if you only need the agent during certain seasons.'],
          ].map(([q, a]) => (
            <div key={q} style={{ padding: '22px 24px', borderRadius: 16, background: BRAND.paper, border: `1px solid ${BRAND.hairline}` }}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 17, letterSpacing: '-0.015em' }}>{q}</div>
              <div style={{ fontSize: 14, color: 'rgba(61,26,15,0.7)', marginTop: 8, lineHeight: 1.6 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

// ─── 7. CONTACT / BOOK A CALL ──────────────────────────────
function PageContact({ density = 'regular' }) {
  const pad = density === 'compact' ? 56 : 72;
  return (
    <div style={{ background: BRAND.cream, color: BRAND.ink, fontFamily: FONTS.body }}>
      <SiteNav current="contact" sticky={false} />
      <div style={{ padding: `80px ${pad}px 64px`, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80 }}>
        <div>
          <Eyebrow style={{ marginBottom: 18 }}>Contact · Book a working session</Eyebrow>
          <h1 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 72, letterSpacing: '-0.04em', margin: 0, lineHeight: 1 }}>
            Talk to an <span style={emberText()}>architect</span>, not a salesperson.
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(61,26,15,0.7)', marginTop: 24, maxWidth: 520, lineHeight: 1.55 }}>
            Tell us a bit about the workflow you'd like to automate. We'll come back within one business day with a fit assessment and a discovery slot.
          </p>

          <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 28 }}>
            {[
              ['Email', 'hello@adoptai.com', BRAND.accent],
              ['Phone', '+1 (555) 382-3830', BRAND.glow],
              ['Office', '500 Enterprise Way, Suite 100 · Orlando, FL 32801', BRAND.amber],
              ['Press', 'press@adoptai.com', BRAND.gold],
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'baseline' }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: c, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 18 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 64, display: 'flex', gap: 16 }}>
            <AgentPill label="Mon–Fri · 9a–6p ET" />
            <AgentPill label="Avg response · 4h" status="queue" />
          </div>
        </div>

        {/* Form card */}
        <div style={{ background: BRAND.paper, border: `1px solid ${BRAND.hairline}`, borderRadius: 24, padding: 36 }}>
          <Eyebrow color={BRAND.accent} style={{ marginBottom: 18 }}>Tell us about it</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              ['Your name', 'Sarah Atkinson'],
              ['Work email', 'sarah@apexlogistics.com'],
            ].map(([l, ph]) => (
              <div key={l}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>{l}</div>
                <div style={{ padding: '12px 14px', border: `1px solid ${BRAND.hairline}`, borderRadius: 10, background: BRAND.cream, fontSize: 14, color: 'rgba(61,26,15,0.55)' }}>{ph}</div>
              </div>
            ))}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Company</div>
              <div style={{ padding: '12px 14px', border: `1px solid ${BRAND.hairline}`, borderRadius: 10, background: BRAND.cream, fontSize: 14, color: 'rgba(61,26,15,0.55)' }}>Apex Global Logistics — Director of Operations</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Engagement</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Spark · $2,400', 'Lift · $5,800', 'Scale · from $12k', 'Not sure yet'].map((t, i) => (
                  <div key={t} style={{ padding: '8px 14px', borderRadius: 999, border: `1px solid ${i === 1 ? BRAND.accent : BRAND.hairline}`, background: i === 1 ? `${BRAND.accent}11` : 'transparent', fontSize: 13, color: i === 1 ? BRAND.accent : 'rgba(61,26,15,0.7)' }}>{t}</div>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(61,26,15,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>The workflow</div>
              <div style={{ padding: '14px 16px', border: `1px solid ${BRAND.hairline}`, borderRadius: 10, background: BRAND.cream, fontSize: 14, color: 'rgba(61,26,15,0.55)', minHeight: 110 }}>
                We get 14,000 carrier emails a week. Our coordinators spend most of the day routing instead of acting. We'd love to talk about whether an intake agent makes sense for us.
              </div>
            </div>
          </div>
          <Button variant="primary" size="lg" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>Request a working session</Button>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(61,26,15,0.5)', letterSpacing: '0.12em', marginTop: 14, textAlign: 'center' }}>
            WE NEVER SHARE YOUR EMAIL. EVER.
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

// ─── 8. CLIENT PORTAL LOGIN ────────────────────────────────
function PagePortalLogin({ density = 'regular' }) {
  return (
    <div style={{
      background: BRAND.void, color: BRAND.cream, fontFamily: FONTS.body,
      minHeight: 1100, position: 'relative', overflow: 'hidden',
    }}>
      <AmbientOrbs intensity={1} dark />
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', opacity: 0.5 }}>
        <AmbientRings size={920} dark />
      </div>

      <div style={{ position: 'relative', padding: '32px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BrandMark size={28} dark />
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 14, color: 'rgba(248,244,238,0.6)' }}>
          <span>Need help?</span>
          <Button variant="ghost" size="sm" dark>Open ticket →</Button>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 56px' }}>
        <div style={{
          width: 460, padding: 40, borderRadius: 24,
          background: 'rgba(36,21,16,0.7)',
          backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: `1px solid ${BRAND.hairlineDark}`,
          boxShadow: '0 30px 80px -30px rgba(0,0,0,0.6)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <img src="assets/adopt-ai-mark.png" width={80} alt="" />
          </div>
          <Eyebrow color={BRAND.glow} style={{ textAlign: 'center', marginBottom: 12 }}>Client Portal</Eyebrow>
          <h1 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 36, letterSpacing: '-0.03em', textAlign: 'center', margin: 0, lineHeight: 1.05 }}>
            Welcome back.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(248,244,238,0.65)', textAlign: 'center', marginTop: 8 }}>
            Sign in to monitor your agents, runs, and weekly reports.
          </p>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(248,244,238,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Work email</div>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(248,244,238,0.04)', border: `1px solid ${BRAND.hairlineDark}`, fontSize: 14 }}>sarah@apexlogistics.com</div>
            </div>
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(248,244,238,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Password</div>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(248,244,238,0.04)', border: `1px solid ${BRAND.hairlineDark}`, fontSize: 14, color: 'rgba(248,244,238,0.6)' }}>•••••••••••</div>
            </div>
          </div>
          <Button variant="primary" size="lg" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>Sign in</Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: BRAND.hairlineDark }} />
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(248,244,238,0.45)', letterSpacing: '0.2em' }}>OR</div>
            <div style={{ flex: 1, height: 1, background: BRAND.hairlineDark }} />
          </div>
          <Button variant="ghost" dark size="md" style={{ width: '100%', justifyContent: 'center' }}
            icon={<span style={{ marginLeft: 6 }}>↗</span>}>Continue with SSO (Okta)</Button>

          <div style={{ marginTop: 24, fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(248,244,238,0.45)', letterSpacing: '0.12em', textAlign: 'center' }}>
            FORGOT PASSWORD?    ·    REQUEST ACCESS
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 24, fontFamily: FONTS.mono, fontSize: 10.5, color: 'rgba(248,244,238,0.4)', letterSpacing: '0.18em', textAlign: 'center' }}>
        SOC 2 TYPE II  ·  ISO 27001  ·  HIPAA  ·  © 2026 ADOPT AI
      </div>
    </div>
  );
}

Object.assign(window, { PageAbout, PagePricing, PageContact, PagePortalLogin });
