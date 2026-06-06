// site/pages.jsx — Marketing sub-pages (services, case study, resources, blog,
// about, pricing, contact, portal login). One file per section component.

// ─── 1. SERVICES — pillars + deep dive ──────────────────────
function PageServices({ density = 'regular' }) {
  const pad = density === 'compact' ? 56 : 72;
  return (
    <div style={{ background: BRAND.cream, color: BRAND.ink, fontFamily: FONTS.body }}>
      <SiteNav current="services" sticky={false} />
      <div style={{ padding: `80px ${pad}px 56px`, position: 'relative', overflow: 'hidden' }}>
        <AmbientOrbs intensity={0.25} />
        <Eyebrow style={{ marginBottom: 24 }}>Services</Eyebrow>
        <h1 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 88, letterSpacing: '-0.045em', margin: 0, lineHeight: 0.98, maxWidth: 1100 }}>
          Five disciplines, one delivery team that <span style={emberText()}>stays on the pager</span>.
        </h1>
        <p style={{ fontSize: 19, color: 'rgba(61,26,15,0.7)', marginTop: 24, maxWidth: 720, lineHeight: 1.55 }}>
          Each engagement starts with a two-week scoping sprint, ships in 4–8 weeks, then ninety days of co-operation before hand-off. Fixed-price.
        </p>
      </div>

      {/* Service blocks — each a deep dive */}
      {[
        { n: '01', t: 'Workflow Agents', d: 'Autonomous coordination for inboxes, Slack, tickets, files. They read, classify, route, and reply with the judgment of a senior ops lead.',
          bullets: ['Email + Slack + ticket triage', 'CRM / accounting / helpdesk write-back', 'Human-review on low confidence', 'Per-customer audit trail'],
          price: 'From $2,400', time: '2–3 weeks',
        },
        { n: '02', t: 'Document & Invoice Intelligence', d: 'OCR + LLM reconciliation across invoices, POs, contracts, lab reports. Replaces a back-office function, not a tool.',
          bullets: ['PO matching (multi-currency)', 'QuickBooks / NetSuite / Xero write-back', 'Variance + fraud detection', 'Closed-loop human review'],
          price: 'From $3,600', time: '3–4 weeks',
        },
        { n: '03', t: 'Customer Support Router', d: 'Intelligent triage layer in front of your existing CX stack. Cuts first-response by 80% without replacing your agents.',
          bullets: ['Tier-1 deflection + auto-reply', 'Sentiment-aware escalation', 'Knowledge-base RAG with citations', 'Zendesk / Intercom / HubSpot hooks'],
          price: 'From $2,800', time: '3 weeks',
        },
        { n: '04', t: 'Custom Model Fine-tuning', d: 'Domain models trained on your data, your tone, your edge cases. Runs in your cloud account. You own the weights.',
          bullets: ['Golden-dataset curation', 'LoRA + DPO fine-tuning', 'Eval suite with regression gates', 'Deploy to your cloud'],
          price: 'From $12,000', time: '8–10 weeks',
        },
        { n: '05', t: 'Agent Operations', d: 'Observability + alerts + on-call. The ongoing layer that keeps the system healthy after launch.',
          bullets: ['Drift, cost, latency alerts', 'Eval-on-prod (shadow traffic)', 'Business-hours on-call', 'Quarterly capability review'],
          price: 'From $149 / mo', time: 'Continuous',
        },
      ].map((s, i) => (
        <div key={s.n} style={{
          padding: `64px ${pad}px`,
          background: i % 2 === 0 ? BRAND.cream : BRAND.paper,
          borderTop: `1px solid ${BRAND.hairline}`,
          display: 'grid', gridTemplateColumns: '0.8fr 1.4fr 0.6fr', gap: 56,
        }}>
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.accent, letterSpacing: '0.2em' }}>SERVICE / {s.n}</div>
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 40, letterSpacing: '-0.03em', marginTop: 16, lineHeight: 1.05 }}>{s.t}</div>
          </div>
          <div>
            <p style={{ fontSize: 17, color: 'rgba(61,26,15,0.75)', lineHeight: 1.6, margin: 0 }}>{s.d}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
              {s.bullets.map((b) => (
                <div key={b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'rgba(61,26,15,0.8)' }}>
                  <span style={{ color: BRAND.accent, marginTop: 2 }}>◆</span><span>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(61,26,15,0.5)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Engagement</div>
            <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 28, marginTop: 8, ...emberText() }}>{s.price}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(61,26,15,0.55)', letterSpacing: '0.06em', marginTop: 6 }}>Typical: {s.time}</div>
            <Button variant="dark" size="sm" style={{ marginTop: 28 }}>Discuss this →</Button>
          </div>
        </div>
      ))}

      <SiteFooter />
    </div>
  );
}

// ─── 2. CASE STUDY — long-form editorial ─────────────────────
function PageCaseStudy({ density = 'regular' }) {
  const pad = density === 'compact' ? 56 : 72;
  return (
    <div style={{ background: BRAND.cream, color: BRAND.ink, fontFamily: FONTS.body }}>
      <SiteNav current="work" sticky={false} />
      <div style={{ padding: `64px ${pad}px 24px` }}>
        <Eyebrow style={{ marginBottom: 18 }}>Case study · 0001 · Apex Regional Logistics</Eyebrow>
        <h1 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 72, letterSpacing: '-0.04em', margin: 0, lineHeight: 0.98, maxWidth: 1080 }}>
          A 35-person logistics team got <span style={emberText()}>22 hours a week</span> back — in two weeks.
        </h1>
        <div style={{ display: 'flex', gap: 48, marginTop: 36, fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(61,26,15,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <div><div style={{ color: 'rgba(61,26,15,0.4)' }}>Sector</div><div style={{ marginTop: 4 }}>Regional logistics</div></div>
          <div><div style={{ color: 'rgba(61,26,15,0.4)' }}>Team size</div><div style={{ marginTop: 4 }}>35 people</div></div>
          <div><div style={{ color: 'rgba(61,26,15,0.4)' }}>Tier</div><div style={{ marginTop: 4 }}>Spark · $2,400</div></div>
          <div><div style={{ color: 'rgba(61,26,15,0.4)' }}>Build</div><div style={{ marginTop: 4 }}>2 weeks</div></div>
          <div><div style={{ color: 'rgba(61,26,15,0.4)' }}>Payback</div><div style={{ marginTop: 4 }}>6 weeks</div></div>
        </div>
      </div>

      {/* Hero image (placeholder) */}
      <div style={{ padding: `0 ${pad}px` }}>
        <div style={{
          position: 'relative', aspectRatio: '16 / 7', borderRadius: 24, overflow: 'hidden',
          background: `linear-gradient(135deg, ${BRAND.burgundy}, ${BRAND.accent} 60%, ${BRAND.glow})`,
        }}>
          <NeuralMesh dark style={{ position: 'absolute', inset: 0, opacity: 0.45 }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="assets/adopt-ai-mark-cream.png" width={220} style={{ filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.35))' }} alt="" />
          </div>
          <div style={{ position: 'absolute', left: 28, top: 24, ...{fontFamily: FONTS.mono}, fontSize: 11, color: 'rgba(255,248,240,0.8)', letterSpacing: '0.18em' }}>
            APEX REGIONAL · INBOUND COORDINATION · SHIPPED MAY 2026
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div style={{ padding: `64px ${pad}px 32px`, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
        <Metric value="22h" label="Saved per week" accent />
        <Metric value="1,540" label="Emails / wk handled" />
        <Metric value="97%" label="Routing accuracy" />
        <Metric value="6 wks" label="Payback" />
      </div>

      {/* Story — tight, three sections, SMB-scaled */}
      <div style={{ padding: `40px ${pad}px 64px`, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64 }}>
        <div style={{ alignSelf: 'flex-start', position: 'sticky', top: 32 }}>
          <Eyebrow style={{ marginBottom: 16 }}>The shape of it</Eyebrow>
          <div style={{ fontSize: 14.5, color: 'rgba(61,26,15,0.72)', lineHeight: 1.65, maxWidth: 320 }}>
            One agent. One workflow. Two weeks to ship.<br/><br/>
            We don&rsquo;t do six-month transformations. We pick the one workflow eating most of someone&rsquo;s day and replace it cleanly.
          </div>
          <Hairline style={{ margin: '28px 0' }} />
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(61,26,15,0.5)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Built with</div>
          <div style={{ fontSize: 13, color: 'rgba(61,26,15,0.7)', marginTop: 8, lineHeight: 1.65 }}>
            Outlook · their TMS · Slack · hosted in their AWS account
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', margin: 0 }}>The problem</h3>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(61,26,15,0.8)', marginTop: 14, textWrap: 'pretty' }}>
            Three coordinators at Apex Regional were spending most of their day routing carrier email &mdash; ETA changes, BOL exceptions, customer escalations. Volume was up 38% year-over-year. They didn&rsquo;t need a chatbot. They needed a dispatcher that never slept.
          </p>

          <blockquote style={{
            margin: '32px 0', padding: '22px 26px', borderLeft: `3px solid ${BRAND.accent}`,
            background: BRAND.paper, borderRadius: 8,
            fontFamily: FONTS.editorial, fontStyle: 'italic', fontSize: 24, lineHeight: 1.35, letterSpacing: '-0.015em', color: BRAND.ink,
          }}>
            &ldquo;I didn&rsquo;t want a tool. I wanted my Tuesday back.&rdquo;
            <div style={{ fontFamily: FONTS.body, fontStyle: 'normal', fontSize: 13, color: 'rgba(61,26,15,0.55)', marginTop: 14, letterSpacing: '0.06em' }}>
              &mdash; OPS DIRECTOR, APEX REGIONAL
            </div>
          </blockquote>

          <h3 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', marginTop: 32 }}>What we built</h3>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(61,26,15,0.8)', marginTop: 12 }}>
            One agent, sitting in front of their Outlook + TMS. It reads every inbound message, figures out the intent (ETA update, exception, billing, escalation), and drops it in the right queue with a drafted reply. Anything it&rsquo;s less than 90% sure of pings a coordinator in Slack within thirty seconds.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(61,26,15,0.8)', marginTop: 12 }}>
            <strong>Two weeks to build. One week of supervised handoff. We were off the pager by week four.</strong>
          </p>

          <h3 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', marginTop: 32 }}>The math</h3>
          <div style={{ marginTop: 16, padding: 24, background: BRAND.paper, border: `1px solid ${BRAND.hairline}`, borderRadius: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr auto', gap: 12, fontFamily: FONTS.mono, fontSize: 13, lineHeight: 1.8, color: 'rgba(61,26,15,0.85)' }}>
              <div>Spark build</div><div style={{ textAlign: 'right' }}>$2,400</div>
              <div>Two months operate ($149 &times; 2)</div><div style={{ textAlign: 'right' }}>$298</div>
              <div style={{ borderTop: `1px dashed ${BRAND.hairline}`, paddingTop: 6 }}>Total spent first 8 weeks</div>
              <div style={{ textAlign: 'right', borderTop: `1px dashed ${BRAND.hairline}`, paddingTop: 6 }}>$2,698</div>
              <div style={{ marginTop: 8 }}>Hours reclaimed (22 hrs/wk &times; 8 wks)</div>
              <div style={{ textAlign: 'right', marginTop: 8 }}>176 hrs</div>
              <div>At fully-loaded labor cost ($42/hr)</div>
              <div style={{ textAlign: 'right' }}>$7,392 value</div>
            </div>
            <Hairline style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 17, letterSpacing: '-0.015em' }}>Net return in 8 weeks</div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 28, letterSpacing: '-0.025em', ...emberText() }}>+$4,694</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(61,26,15,0.6)', marginTop: 14, lineHeight: 1.6 }}>
            By month three the agent had paid for itself twice over. Apex moved their two senior coordinators onto carrier-relationship work &mdash; the part of the job they actually liked.
          </p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

// ─── 3. RESOURCES / 4. BLOG ────────────────────────────────
function PageResources({ density = 'regular' }) {
  const pad = density === 'compact' ? 56 : 72;
  return (
    <div style={{ background: BRAND.cream, color: BRAND.ink, fontFamily: FONTS.body }}>
      <SiteNav current="resources" sticky={false} />
      <div style={{ padding: `80px ${pad}px 48px` }}>
        <Eyebrow style={{ marginBottom: 18 }}>Resources · The playbook library</Eyebrow>
        <h1 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 80, letterSpacing: '-0.04em', margin: 0, lineHeight: 1, maxWidth: 1100 }}>
          Field notes on shipping <span style={emberText()}>production-grade agents</span>.
        </h1>
      </div>
      {/* Featured */}
      <div style={{ padding: `0 ${pad}px 64px`, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
        <div style={{ borderRadius: 24, overflow: 'hidden', background: BRAND.ink, color: BRAND.cream, position: 'relative', minHeight: 420 }}>
          <AmbientOrbs intensity={0.7} dark />
          <div style={{ position: 'relative', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Eyebrow color={BRAND.glow}>Whitepaper · 28 pages</Eyebrow>
            <div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 44, letterSpacing: '-0.035em', lineHeight: 1.05 }}>
                The Production Agent Playbook
              </div>
              <div style={{ fontSize: 15, color: 'rgba(248,244,238,0.7)', marginTop: 16, maxWidth: 460 }}>
                The playbook we use to ship Spark and Lift projects — architecture, prompts, eval checks, runbooks. Free, no email required.
              </div>
              <Button variant="primary" size="md" style={{ marginTop: 28 }}>Download free</Button>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { t: 'The 7-question discovery script', m: 'Template · 12 min read' },
            { t: 'Eval suites that actually catch regressions', m: 'Playbook · 18 min' },
            { t: 'Buy-vs-build: when to bring an agent in-house', m: 'Guide · 22 min' },
          ].map((r) => (
            <div key={r.t} style={{ background: BRAND.paper, border: `1px solid ${BRAND.hairline}`, borderRadius: 18, padding: 24 }}>
              <Eyebrow color={BRAND.accent} style={{ marginBottom: 10 }}>{r.m}</Eyebrow>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{r.t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Library grid */}
      <div style={{ padding: `40px ${pad}px 96px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
          <Eyebrow>Library · 41 entries</Eyebrow>
          <div style={{ display: 'flex', gap: 12, ...{fontFamily: FONTS.mono}, fontSize: 12, color: 'rgba(61,26,15,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {['All', 'Whitepapers', 'Playbooks', 'Templates', 'Talks', 'Code'].map((t, i) => (
              <div key={t} style={{ padding: '6px 12px', borderRadius: 999, background: i === 0 ? BRAND.ink : 'transparent', color: i === 0 ? BRAND.cream : 'inherit' }}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            ['PLAYBOOK', 'Designing the human-review layer', 'Where confidence thresholds, escalation paths, and reviewer UX actually live.', '14 min'],
            ['TEMPLATE', 'The intake-agent eval suite', 'Forty checks we run before promoting any inbox agent to production.', 'Repo'],
            ['TALK', 'Why we stopped doing pilots', 'On the structural problem with 90-day proof-of-concept engagements.', '22 min'],
            ['CODE', 'Agent observability with OTel + Datadog', 'A drop-in tracing layer for LLM workflows. MIT-licensed.', 'Repo'],
            ['GUIDE', 'Fine-tuning for tone, not capability', 'Why most domain fine-tunes are solving the wrong problem.', '18 min'],
            ['WHITEPAPER', 'Owning your model weights', 'A buyer\'s guide to VPC-deployed LLMs and the legal layer behind them.', '24 pages'],
          ].map(([k, t, d, m]) => (
            <div key={t} style={{ background: BRAND.paper, border: `1px solid ${BRAND.hairline}`, borderRadius: 18, padding: 24, position: 'relative', minHeight: 220 }}>
              <Eyebrow color={BRAND.accent}>{k}</Eyebrow>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em', marginTop: 12, lineHeight: 1.18 }}>{t}</div>
              <div style={{ fontSize: 14, color: 'rgba(61,26,15,0.7)', marginTop: 10, lineHeight: 1.5 }}>{d}</div>
              <div style={{ position: 'absolute', bottom: 22, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...{fontFamily: FONTS.mono}, fontSize: 11, color: 'rgba(61,26,15,0.5)', letterSpacing: '0.14em' }}>
                <span>{m}</span><span style={{ color: BRAND.accent }}>READ →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function PageBlog({ density = 'regular' }) {
  const pad = density === 'compact' ? 56 : 72;
  return (
    <div style={{ background: BRAND.cream, color: BRAND.ink, fontFamily: FONTS.body }}>
      <SiteNav current="blog" sticky={false} />
      <div style={{ padding: `80px ${pad}px 32px` }}>
        <Eyebrow style={{ marginBottom: 16 }}>Field notes</Eyebrow>
        <h1 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 80, letterSpacing: '-0.04em', margin: 0, lineHeight: 1, maxWidth: 1100 }}>
          Build logs, mistakes, and the occasional <span style={emberText()}>hot take</span>.
        </h1>
      </div>
      {/* Featured */}
      <div style={{ padding: `40px ${pad}px 24px`, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 36 }}>
        <div>
          <div style={{ aspectRatio: '16 / 9', borderRadius: 18, background: `linear-gradient(135deg, ${BRAND.burgundy}, ${BRAND.glow})`, position: 'relative', overflow: 'hidden' }}>
            <NeuralMesh dark style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="assets/adopt-ai-mark-cream.png" width={140} alt="" />
            </div>
          </div>
          <Eyebrow style={{ marginTop: 24 }}>May 18, 2026 · Engineering · 14 min</Eyebrow>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 42, letterSpacing: '-0.03em', marginTop: 14, lineHeight: 1.05 }}>
            Why we burned every "AI agent framework" and started over.
          </div>
          <div style={{ fontSize: 17, color: 'rgba(61,26,15,0.72)', marginTop: 14, maxWidth: 760, lineHeight: 1.55 }}>
            Eighteen months in, we've shipped agents on LangChain, LangGraph, CrewAI, AutoGen, and our own. Here's what we learned, what we kept, and what we wrote from scratch.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            { c: 'Engineering', t: 'Evaluating evals: when your golden dataset becomes a liability', m: '8 min' },
            { c: 'Operations', t: 'The on-call rotation we wish we\'d set up in week one', m: '6 min' },
            { c: 'Field', t: 'Three things every enterprise procurement team will ask', m: '10 min' },
            { c: 'Engineering', t: 'Cost-per-task: the only LLM metric that matters', m: '5 min' },
            { c: 'Hot take', t: 'Stop calling it an "AI strategy." It\'s an ops strategy.', m: '4 min' },
          ].map((p) => (
            <div key={p.t} style={{ paddingBottom: 16, borderBottom: `1px solid ${BRAND.hairline}` }}>
              <Eyebrow color={BRAND.accent} style={{ marginBottom: 6 }}>{p.c} · {p.m}</Eyebrow>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 18, letterSpacing: '-0.015em', lineHeight: 1.25 }}>{p.t}</div>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

Object.assign(window, { PageServices, PageCaseStudy, PageResources, PageBlog });
