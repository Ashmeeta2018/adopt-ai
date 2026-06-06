// site/app.jsx — Adopt AI website + app showcase
// Composes design_canvas with home variants, sub-pages, motion lab, and mobile screens.

const SITE_TWEAKS = /*EDITMODE-BEGIN*/{
  "density": "regular",
  "motion": "cinematic",
  "heroCinematic": "Real automation.\nReal SMB budgets.",
  "showHomes": true,
  "showSubpages": true,
  "showMotion": true,
  "showMotionProd": true,
  "showMobile": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(SITE_TWEAKS);

  const heroCinematic = { eyebrow: 'ADOPT AI — AUTOMATION FOR GROWING TEAMS', headline: t.heroCinematic, sub: 'We design, ship, and run AI agents for small and mid-sized businesses. Fixed price. No per-seat fees. Most projects pay back in under 8 weeks.' };

  const W = 1440;
  const heightFor = (kind) => ({
    cinematic: 4400,
    services: 2400, caseStudy: 2200, resources: 2000, blog: 1600,
    about: 2400, pricing: 2400, contact: 1500, portal: 1100,
    motion: 1300,
    motionProd: 2400,
    voScript: 1200,
    mobile: 1200,
  }[kind]);

  return (
    <>
      <DesignCanvas style={{ background: '#0A0705', color: BRAND.cream }}>
        {t.showHomes && (
          <DCSection id="homes" title="Home — the one direction"
            subtitle="Cinematic for SMB. Tech-forward variant retired — too intimidating for non-technical buyers.">
            <DCArtboard id="home-cinematic" label="Cinematic studio — plain-English copy, SMB pricing, FAQ" width={W} height={heightFor('cinematic')}>
              <HomeCinematic hero={heroCinematic} density={t.density} motion={t.motion} />
            </DCArtboard>
          </DCSection>
        )}

        {t.showSubpages && (
          <DCSection id="marketing" title="Marketing site — sub pages"
            subtitle="Eight templates that share the same nav, footer, and visual system.">
            <DCArtboard id="services" label="Services — pillar deep dive" width={W} height={heightFor('services')}>
              <PageServices density={t.density} />
            </DCArtboard>
            <DCArtboard id="case-study" label="Case study — editorial long-form" width={W} height={heightFor('caseStudy')}>
              <PageCaseStudy density={t.density} />
            </DCArtboard>
            <DCArtboard id="resources" label="Resources — playbook library" width={W} height={heightFor('resources')}>
              <PageResources density={t.density} />
            </DCArtboard>
            <DCArtboard id="blog" label="Blog — field notes" width={W} height={heightFor('blog')}>
              <PageBlog density={t.density} />
            </DCArtboard>
            <DCArtboard id="about" label="About — small studio, no named team yet" width={W} height={heightFor('about')}>
              <PageAbout density={t.density} />
            </DCArtboard>
            <DCArtboard id="pricing" label="Pricing — Spark / Lift / Scale (SMB)" width={W} height={heightFor('pricing')}>
              <PagePricing density={t.density} />
            </DCArtboard>
            <DCArtboard id="contact" label="Contact — book a working session" width={W} height={heightFor('contact')}>
              <PageContact density={t.density} />
            </DCArtboard>
            <DCArtboard id="portal-login" label="Client portal — sign-in" width={W} height={heightFor('portal')}>
              <PagePortalLogin />
            </DCArtboard>
          </DCSection>
        )}

        {t.showMotion && (
          <DCSection id="motion" title="Motion lab — all six concepts"
            subtitle="Quick previews of every direction. Use these to compare before committing budget.">
            <DCArtboard id="motion-lab" label="Concepts A–F · quick previews" width={W} height={heightFor('motion')}>
              <MotionLab />
            </DCArtboard>
          </DCSection>
        )}

        {t.showMotionProd && (
          <DCSection id="motion-prod" title="Motion production — the recommended three"
            subtitle="A · Mark Reveal hero film, C · Agent In Action explainer, E · Customer Voice testimonial. Full-fidelity previs.">
            <DCArtboard id="motion-mark" label="A · Mark Reveal — 1920×1080 hero film, 6s loop" width={1920} height={1080}>
              <MarkReveal />
            </DCArtboard>
            <DCArtboard id="motion-agent" label="C · Agent In Action — 28s explainer" width={1920} height={1080}>
              <AgentInAction />
            </DCArtboard>
            <DCArtboard id="motion-voice" label="E · Customer Voice — 90s testimonial frame" width={1920} height={1080}>
              <CustomerVoice />
            </DCArtboard>
            <DCArtboard id="motion-brief" label="Production brief · timeline · budget" width={W} height={heightFor('motionProd')}>
              <MotionProduction />
            </DCArtboard>
            <DCArtboard id="motion-voscript" label="VO script · Agent In Action · ready to record" width={W} height={heightFor('voScript')}>
              <VOScript />
            </DCArtboard>
          </DCSection>
        )}

        {t.showMobile && (
          <DCSection id="mobile" title="Mobile · iOS client portal"
            subtitle="The six screens your clients actually use — agent status, weekly reports, alerts.">
            <DCArtboard id="mobile-showcase" label="Six screens" width={2820} height={heightFor('mobile')}>
              <MobileAppShowcase />
            </DCArtboard>
          </DCSection>
        )}
      </DesignCanvas>

      <TweaksPanel title="Tweaks · Adopt AI Site">
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'regular', 'airy']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakRadio
          label="Motion"
          value={t.motion}
          options={['still', 'subtle', 'cinematic']}
          onChange={(v) => setTweak('motion', v)}
        />

        <TweakSection label="Hero copy" />
        <TweakText
          label="Headline"
          value={t.heroCinematic}
          onChange={(v) => setTweak('heroCinematic', v)}
        />

        <TweakSection label="Show / hide sections" />
        <TweakToggle label="Home directions" value={t.showHomes} onChange={(v) => setTweak('showHomes', v)} />
        <TweakToggle label="Marketing sub-pages" value={t.showSubpages} onChange={(v) => setTweak('showSubpages', v)} />
        <TweakToggle label="Motion lab (all six)" value={t.showMotion} onChange={(v) => setTweak('showMotion', v)} />
        <TweakToggle label="Motion production (A, C, E)" value={t.showMotionProd} onChange={(v) => setTweak('showMotionProd', v)} />
        <TweakToggle label="Mobile app" value={t.showMobile} onChange={(v) => setTweak('showMobile', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
