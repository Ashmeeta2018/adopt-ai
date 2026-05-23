// app.jsx — Adopt AI brand identity canvas (themed)
// Tweaks:
//   - theme: warm/light variants + dark midnight
//   - wordmark style: lockup, stacked, integrated, badge, wordmark
//   - mark variant: neural, stroke, solid
//   - gradient on/off, grid density, per-artboard visibility

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "themeId": "ember",
  "pairingId": "premium",
  "wordmarkStyle": "lockup",
  "markVariant": "neural",
  "gradient": true,
  "gridDensity": 32,
  "showHero": true,
  "showWordmarks": true,
  "showConstruction": true,
  "showVariants": true,
  "showColor": true,
  "showType": true,
  "showVoice": true,
  "showBizCard": true,
  "showSocial": true,
  "showIcons": true,
  "showAppUI": true,
  "showImagery": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const baseTheme = THEMES[t.themeId] || THEMES.sunrise;
  const pairing = FONT_PAIRINGS[t.pairingId] || FONT_PAIRINGS.geometric;
  // Merge the active font pairing into the theme so every artboard reads
  // theme.fontDisplay / theme.fontBody and recomposes automatically.
  const theme = { ...baseTheme, fontDisplay: pairing.display, fontBody: pairing.body, fontMono: pairing.mono };

  // Drive the design-canvas viewport bg from the theme so dark mode goes dark
  // and warm modes adopt a matching canvas color (slightly deeper than the
  // artboard surface so artboards still stand off the grid).
  const canvasBg = theme.isDark ? '#080B12' : theme.bg;

  // Common props for artboards
  const ab = {
    theme,
    markVariant: t.markVariant,
    wordmarkStyle: t.wordmarkStyle,
    gradient: t.gradient,
    density: t.gridDensity,
  };

  return (
    <>
      <DesignCanvas style={{ background: canvasBg, color: theme.deep }}>
        <DCSection id="cover" title="Cover" subtitle="One image to introduce the brand">
          {t.showHero && (
            <DCArtboard id="hero" label="Brand cover" width={1600} height={900}>
              <AB_Hero {...ab} />
            </DCArtboard>
          )}
        </DCSection>

        <DCSection id="logotype" title="Logotype" subtitle="Five lockups for one mark">
          {t.showWordmarks && (
            <DCArtboard id="wordmarks" label="Wordmark lockups" width={1400} height={820}>
              <AB_Wordmarks {...ab} />
            </DCArtboard>
          )}
          {t.showConstruction && (
            <DCArtboard id="primary" label="Primary mark" width={1200} height={720}>
              <AB_PrimaryMark {...ab} />
            </DCArtboard>
          )}
          {t.showVariants && (
            <DCArtboard id="variants" label="Mark variants" width={1200} height={720}>
              <AB_MarkVariants {...ab} />
            </DCArtboard>
          )}
        </DCSection>

        <DCSection id="system" title="System" subtitle="Color, type, voice">
          {t.showColor && (
            <DCArtboard id="color" label="Color" width={1400} height={780}>
              <AB_Color {...ab} />
            </DCArtboard>
          )}
          {t.showType && (
            <DCArtboard id="type" label="Typography" width={1400} height={820}>
              <AB_Type {...ab} />
            </DCArtboard>
          )}
          {t.showVoice && (
            <DCArtboard id="voice" label="Voice" width={1200} height={780}>
              <AB_Voice {...ab} />
            </DCArtboard>
          )}
        </DCSection>

        <DCSection id="apps" title="Applications" subtitle="Where the brand actually lives">
          {t.showBizCard && (
            <DCArtboard id="bizcard" label="Business card" width={1200} height={720}>
              <AB_BizCard {...ab} />
            </DCArtboard>
          )}
          {t.showSocial && (
            <DCArtboard id="social" label="LinkedIn banner" width={1400} height={620}>
              <AB_Social {...ab} />
            </DCArtboard>
          )}
          {t.showIcons && (
            <DCArtboard id="icons" label="Iconography" width={1200} height={720}>
              <AB_Icons {...ab} />
            </DCArtboard>
          )}
          {t.showAppUI && (
            <DCArtboard id="app" label="Product · console" width={1500} height={900}>
              <AB_AppUI {...ab} />
            </DCArtboard>
          )}
          {t.showImagery && (
            <DCArtboard id="imagery" label="Imagery" width={1300} height={760}>
              <AB_Imagery {...ab} />
            </DCArtboard>
          )}
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks · Adopt AI">
        <TweakSection label="Typography" />
        <TweakSelect
          label="Font pairing"
          value={t.pairingId}
          options={Object.keys(FONT_PAIRINGS).map((id) => ({ value: id, label: FONT_PAIRINGS[id].name }))}
          onChange={(v) => setTweak('pairingId', v)}
        />

        <TweakSection label="Theme" />
        <TweakSelect
          label="Palette"
          value={t.themeId}
          options={Object.keys(THEMES).map((id) => ({ value: id, label: THEMES[id].name }))}
          onChange={(v) => setTweak('themeId', v)}
        />
        <TweakColor
          label="Quick swatch"
          value={[theme.bg, theme.accent, theme.glow]}
          options={Object.values(THEMES).map((th) => [th.bg, th.accent, th.glow])}
          onChange={(v) => {
            const found = Object.values(THEMES).find((th) => th.bg === v[0] && th.accent === v[1]);
            if (found) setTweak('themeId', found.id);
          }}
        />

        <TweakSection label="Logotype" />
        <TweakSelect
          label="Wordmark style"
          value={t.wordmarkStyle}
          options={[
            { value: 'lockup',     label: 'Lockup (default)' },
            { value: 'stacked',    label: 'Stacked hero' },
            { value: 'integrated', label: 'Integrated A' },
            { value: 'badge',      label: 'Circular badge' },
            { value: 'wordmark',   label: 'Wordmark only' },
          ]}
          onChange={(v) => setTweak('wordmarkStyle', v)}
        />
        <TweakRadio
          label="Mark variant"
          value={t.markVariant}
          options={['neural', 'stroke', 'solid']}
          onChange={(v) => setTweak('markVariant', v)}
        />
        <TweakToggle label="Signature gradient" value={t.gradient} onChange={(v) => setTweak('gradient', v)} />

        <TweakSection label="Canvas" />
        <TweakSlider label="Grid density" value={t.gridDensity} min={16} max={64} step={4} unit="px"
          onChange={(v) => setTweak('gridDensity', v)} />

        <TweakSection label="Artboards" />
        {[
          ['showHero',         'Cover'],
          ['showWordmarks',    'Wordmarks'],
          ['showConstruction', 'Primary mark'],
          ['showVariants',     'Variants'],
          ['showColor',        'Color'],
          ['showType',         'Typography'],
          ['showVoice',        'Voice'],
          ['showBizCard',      'Business card'],
          ['showSocial',       'Social banner'],
          ['showIcons',        'Iconography'],
          ['showAppUI',        'Product UI'],
          ['showImagery',      'Imagery'],
        ].map(([k, label]) => (
          <TweakToggle key={k} label={label} value={t[k]} onChange={(v) => setTweak(k, v)} />
        ))}
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
