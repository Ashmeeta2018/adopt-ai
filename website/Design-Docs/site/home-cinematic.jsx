// site/home-cinematic.jsx — Home variant B: Cinematic Studio
// Dark, full-bleed, 3D hero with rings/orbs, bold editorial type.

function HomeCinematic({ hero, density = 'regular', motion = 'cinematic' }) {
  const pad = density === 'compact' ? 56 : density === 'airy' ? 96 : 72;
  const sectionGap = density === 'compact' ? 96 : density === 'airy' ? 160 : 128;
  const heroCopy = hero || {
    eyebrow: 'ADOPT AI — WORKFLOW INTELLIGENCE STUDIO',
    headline: 'AI that ships.\nNot AI that demos.',
    sub: 'A workflow intelligence studio for growing teams. We design the system, fine-tune the models, write the runbooks, and stay on the pager — at SMB prices.',
  };

  return (
    <div style={{ background: BRAND.void, color: BRAND.cream, fontFamily: FONTS.body, position: 'relative' }}>
      {/* base grid texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(248,244,238,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(248,244,238,0.025) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <SiteNav dark current="home" sticky={false} />

      {/* HERO ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', minHeight: 820, padding: `${pad}px ${pad}px ${pad * 1.5}px`, overflow: 'hidden' }}>
        <AmbientOrbs intensity={motion === 'still' ? 0.5 : 1} dark />
        {/* big rings behind */}
        <div style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)', opacity: 0.85 }}>
          <AmbientRings size={920} dark />
        </div>
        {/* secondary spinning ring */}
        <div style={{
          position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)',
          animation: motion === 'still' ? 'none' : 'ringSpin 60s linear infinite reverse',
          width: 640, height: 640,
        }}>
          <svg viewBox="0 0 200 200" width="640" height="640">
            <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(230,126,34,0.18)" strokeWidth="0.4" strokeDasharray="1 6" />
          </svg>
        </div>

        {/* Floating data chips around the mark */}
        {motion !== 'still' && (
          <>
            <FloatingChip x="14%" y="22%" rot={-4} dark>📨 14k carrier emails routed last week</FloatingChip>
            <FloatingChip x="74%" y="18%" rot={3}  delay={1.5} dark>⚡ most replies in under a second</FloatingChip>
            <FloatingChip x="10%" y="68%" rot={-2} delay={2.5} dark>🔒 SOC 2 · your data stays in your cloud</FloatingChip>
            <FloatingChip x="78%" y="68%" rot={4}  delay={3.5} dark>💰 $3.7k saved this week · Apex Logistics</FloatingChip>
          </>
        )}

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 1080, margin: '40px auto 0' }}>
          <Eyebrow color={BRAND.glow} style={{ marginBottom: 32 }}>{heroCopy.eyebrow}</Eyebrow>
          <h1 data-comment-anchor="home-cinematic-headline" style={{
            fontFamily: FONTS.display, fontWeight: 600, fontSize: 124,
            letterSpacing: '-0.055em', lineHeight: 0.92, margin: 0,
            whiteSpace: 'pre-line', textWrap: 'pretty',
          }}>
            {heroCopy.headline.split('\n').map((l, i) => (
              <div key={i} style={i === 1 ? emberText() : {}}>{l}</div>
            ))}
          </h1>
          <p style={{ fontSize: 21, lineHeight: 1.5, color: 'rgba(248,244,238,0.7)', maxWidth: 620, margin: '36px auto 0' }}>
            {heroCopy.sub}
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 44, justifyContent: 'center' }}>
            <Button variant="primary" size="lg">Start a project</Button>
            <Button variant="ghost" dark size="lg" icon={<span style={{ marginLeft: 6 }}>↓</span>}>Watch the reel</Button>
          </div>
          <div style={{ marginTop: 56, display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
            <AgentPill label="6 SMB teams live" dark />
            <AgentPill label="$0 per-seat fees" status="queue" dark />
            <AgentPill label="Cancel monthly anytime" dark />
          </div>
        </div>
      </div>

      {/* MARQUEE — clients ─────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BRAND.hairlineDark}`, borderBottom: `1px solid ${BRAND.hairlineDark}`, padding: '40px 56px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48, flexWrap: 'wrap', fontFamily: FONTS.display, fontWeight: 500, fontSize: 17, color: 'rgba(248,244,238,0.55)', textAlign: 'center' }}>
          <Eyebrow color={BRAND.glow}>The room we're in</Eyebrow>
          <div>Built for teams of <span style={{ color: BRAND.cream }}>12–240 people</span></div>
          <div style={{ width: 1, height: 18, background: BRAND.hairlineDark }} />
          <div>Working with <span style={{ color: BRAND.cream }}>6 SMB ops teams</span> today</div>
          <div style={{ width: 1, height: 18, background: BRAND.hairlineDark }} />
          <div>Logistics · healthcare · finops · e-commerce</div>
        </div>
      </div>

      {/* BENTO SERVICES ─────────────────────────────────────── */}
      <div style={{ position: 'relative', padding: `${sectionGap}px ${pad}px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <div style={{ maxWidth: 720 }}>
            <Eyebrow color={BRAND.glow} style={{ marginBottom: 16 }}>What we build</Eyebrow>
            <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 64, letterSpacing: '-0.04em', margin: 0, lineHeight: 1.02 }}>
              Five workflows.<br/><span style={emberText()}>One small studio.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(248,244,238,0.7)', marginTop: 18, maxWidth: 560, lineHeight: 1.55 }}>
              Pick one workflow eating most of someone's day. We design the agent,
              connect it to the tools you already use, and stay on it for the first 90 days.
            </p>
          </div>
          <Button variant="ghost" dark>See all services →</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: 200, gap: 16 }}>
          {/* Large primary tile */}
          <div style={{
            gridColumn: 'span 3', gridRow: 'span 2',
            background: `linear-gradient(135deg, ${BRAND.burgundy} 0%, ${BRAND.accent} 50%, ${BRAND.glow} 100%)`,
            borderRadius: 24, padding: 36, position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ position: 'absolute', right: -60, bottom: -60, opacity: 0.3 }}>
              <AmbientRings size={420} dark />
            </div>
            <div>
              <Eyebrow color="rgba(255,248,240,0.7)">Most chosen</Eyebrow>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 44, letterSpacing: '-0.035em', marginTop: 12, lineHeight: 1.05 }}>
                An agent that reads your inbox like a senior ops lead — and routes it where it belongs.
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '0.16em', color: 'rgba(255,248,240,0.78)' }}>SPARK · FROM $4,800 · 3 WEEKS</div>
              <div style={{ fontSize: 28 }}>→</div>
            </div>
          </div>

          {/* Medium tiles */}
          {[
            { c: 3, r: 1, t: 'Invoice & document extraction',  m: 'Posts straight to QuickBooks / NetSuite', d: BRAND.smoke },
            { c: 2, r: 1, t: 'Custom AI on your data',          m: 'Trained on your tone, your edge cases', d: BRAND.smoke },
            { c: 1, r: 1, t: 'Quality checks',                  m: 'Tested before launch', d: BRAND.obsidian },
            { c: 3, r: 1, t: 'Customer support triage',         m: 'Cuts first-response by 80%', d: BRAND.smoke },
          ].map((tile, i) => (
            <div key={i} style={{
              gridColumn: `span ${tile.c}`, gridRow: `span ${tile.r}`,
              background: tile.d, borderRadius: 24, padding: 28,
              border: `1px solid ${BRAND.hairlineDark}`,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              position: 'relative', overflow: 'hidden',
            }}>
              <Eyebrow color={BRAND.glow}>0{i+2}</Eyebrow>
              <div>
                <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.025em', lineHeight: 1.15 }}>{tile.t}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(248,244,238,0.55)', letterSpacing: '0.14em', marginTop: 10, textTransform: 'uppercase' }}>{tile.m}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CASE STUDY — editorial ───────────────────────────── */}
      <div style={{ padding: `${sectionGap}px ${pad}px`, position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <Eyebrow color={BRAND.glow}>Case · 0001 / Apex Global Logistics</Eyebrow>
            <h2 style={{ fontFamily: FONTS.editorial, fontStyle: 'italic', fontWeight: 400, fontSize: 96, letterSpacing: '-0.04em', margin: '24px 0 0', lineHeight: 0.95 }}>
              "By week six it was reading the inbox better than I do."
            </h2>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, color: 'rgba(248,244,238,0.55)', marginTop: 32, letterSpacing: '0.04em' }}>
              <strong style={{ color: BRAND.cream }}>Maya Lindqvist</strong>, Director of Operations · Apex Global Logistics
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
              <Metric value="14k" label="Emails / wk handled" accent dark />
              <Metric value="118h" label="Saved / wk" dark />
              <Metric value="6 wks" label="To production" dark />
            </div>
            <Button variant="primary" size="lg" style={{ marginTop: 40 }}>Read the build log</Button>
          </div>
          <div style={{
            position: 'relative', aspectRatio: '4 / 5', borderRadius: 24, overflow: 'hidden',
            background: `linear-gradient(160deg, ${BRAND.burgundy}, ${BRAND.smoke})`,
          }}>
            <NeuralMesh dark style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
            <AmbientOrbs intensity={0.8} dark />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="assets/adopt-ai-mark-cream.png" width={260} style={{ filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.5))' }} alt="" />
            </div>
            <div style={{ position: 'absolute', left: 24, top: 24, fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(248,244,238,0.7)', letterSpacing: '0.18em' }}>
              REC · 03:42 / 09:18
            </div>
            <div style={{ position: 'absolute', right: 24, top: 24, display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.accent, boxShadow: `0 0 12px ${BRAND.accent}` }} />
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.cream, letterSpacing: '0.18em' }}>LIVE</span>
            </div>
            <div style={{ position: 'absolute', left: 24, bottom: 24, fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(248,244,238,0.7)', letterSpacing: '0.14em' }}>
              APEX-LOG · SPRINT 04 · BUILD LOG
            </div>
          </div>
        </div>
      </div>

      {/* APPROACH / SHOWREEL strip ────────────────────────── */}
      <div style={{
        padding: `${sectionGap}px ${pad}px`, position: 'relative',
        background: `linear-gradient(180deg, ${BRAND.void}, ${BRAND.obsidian})`,
        borderTop: `1px solid ${BRAND.hairlineDark}`,
        borderBottom: `1px solid ${BRAND.hairlineDark}`,
      }}>
        <Eyebrow color={BRAND.glow}>How a project goes</Eyebrow>
        <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 72, letterSpacing: '-0.045em', margin: '20px 0 64px', lineHeight: 0.98, maxWidth: 1100 }}>
          No pilots. No PowerPoints. Just <span style={emberText()}>one shipped agent</span> in six weeks or less.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { n: '01', t: 'Discover', d: 'Two-week scoping. We map the workflow, talk to whoever actually does the job, and write a fixed-price brief.' },
            { n: '02', t: 'Build',    d: 'Three to eight focused weeks. You see weekly demos. The agent runs in your cloud, on your data.' },
            { n: '03', t: 'Operate',  d: '30 to 90 days of us on the pager, while your team learns the system. Cancel the monthly anytime.' },
            { n: '04', t: 'Hand off', d: 'Plain-English runbooks, dashboards, training. The system becomes yours — fully — with no lock-in.' },
          ].map((s) => (
            <div key={s.n}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.glow, letterSpacing: '0.18em' }}>STEP / {s.n}</div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 32, letterSpacing: '-0.025em', marginTop: 16 }}>{s.t}</div>
              <div style={{ fontSize: 15, color: 'rgba(248,244,238,0.65)', lineHeight: 1.6, marginTop: 12 }}>{s.d}</div>
              <Hairline dark style={{ marginTop: 24 }} />
            </div>
          ))}
        </div>
      </div>

      {/* OBJECTIONS / FAQ */}
      <div style={{ padding: `${sectionGap}px ${pad}px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 80 }}>
          <div>
            <Eyebrow color={BRAND.glow} style={{ marginBottom: 18 }}>Honest answers</Eyebrow>
            <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 48, letterSpacing: '-0.035em', margin: 0, lineHeight: 1.05 }}>
              The questions every small team asks us first.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(248,244,238,0.65)', marginTop: 18, lineHeight: 1.6, maxWidth: 380 }}>
              We&rsquo;ve been on the other side of these conversations. Here&rsquo;s what we&rsquo;d want to know before signing anything.
            </p>
          </div>
          <div>
            {[
              ['Can we actually afford this?', 'A Spark project is $2,400 — about what most local teams pay a part-timer in three weeks. Most pay back in under 8 weeks. If we can\u2019t show you the math, we won\u2019t take the project.'],
              ['What if it doesn\u2019t work?', 'Every project has a written success criteria in the brief. If we miss it, we keep working at no extra cost until we hit it — or you don\u2019t pay the final invoice.'],
              ['Will we be locked in?', 'No. You own the code, the model, the prompts, the data. Cancel the monthly operate plan anytime. After 90 days the system is fully yours.'],
              ['We\u2019re only 14 people. Are we too small?', 'No — our smallest customer is 12 people. SMBs are who we built this for. The Spark tier is designed for one workflow, one team, one outcome.'],
              ['Where does our data live?', 'In your cloud account. Models train and run in your AWS / GCP / Azure tenancy. We never see your customer data in our systems.'],
              ['What if our needs are seasonal?', 'You can pause the operate plan up to 4 months a year. Common for retail, accounting firms, education — you only pay when the agent is needed.'],
            ].map(([q, a]) => (
              <div key={q} style={{
                padding: '22px 0', borderTop: `1px solid ${BRAND.hairlineDark}`,
              }}>
                <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em', color: BRAND.cream }}>{q}</div>
                <div style={{ fontSize: 15.5, color: 'rgba(248,244,238,0.7)', lineHeight: 1.6, marginTop: 8 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', padding: `${sectionGap}px ${pad}px`, textAlign: 'center', overflow: 'hidden' }}>
        <AmbientOrbs intensity={0.9} dark />
        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
          <Eyebrow color={BRAND.glow} style={{ marginBottom: 24 }}>Ready when you are</Eyebrow>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 96, letterSpacing: '-0.05em', margin: 0, lineHeight: 0.98 }}>
            Pick one workflow. <span style={emberText()}>We’ll handle the rest.</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(248,244,238,0.75)', marginTop: 24, maxWidth: 640, marginInline: 'auto', lineHeight: 1.55 }}>
            A 30-minute call. We’ll tell you whether what you’re after is a fit, what it would cost, and roughly how long it would take. No deck, no pitch.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 40 }}>
            <Button variant="primary" size="lg">Book a 30-min call</Button>
            <Button variant="ghost" dark size="lg">See pricing</Button>
          </div>
        </div>
      </div>

      <SiteFooter dark />
    </div>
  );
}

Object.assign(window, { HomeCinematic });
