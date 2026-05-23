# 01 · Brand Tokens

Drop these straight into your `tailwind.config.ts`, `theme.css`, or design tokens file. Every value is final.

---

## 🎨 Colors

### Surfaces

| Token | Hex | Usage |
|---|---|---|
| `cream` | `#F8F4EE` | Light page surface |
| `paper` | `#FFFFFF` | Card surface on cream |
| `ink` | `#3D1A0F` | Primary dark text on cream |
| `void` | `#0F0805` | Dark page surface (homepage, portal) |
| `obsidian` | `#1A0F08` | Card surface on void |
| `smoke` | `#241510` | Elevated card on void / gradient end |

### Ember accent system (the signature)

| Token | Hex | Usage |
|---|---|---|
| `burgundy` | `#A82A28` | Gradient start, darkest accent |
| `accent` | `#D9462C` | **Primary brand** — buttons, links, focus rings |
| `glow` | `#E67E22` | Secondary accent, glows on dark |
| `amber` | `#D6912A` | Tertiary, used in tiles |
| `gold` | `#C68A1F` | Quaternary, used in pricing flags |

### Signature ember gradient (used on logo, primary CTAs, hero text)

```css
background: linear-gradient(
  90deg,
  #A82A28 0%,
  #D9462C 25%,
  #E67E22 50%,
  #D6912A 75%,
  #C68A1F 100%
);
```

For text:
```css
.ember-text {
  background: linear-gradient(90deg, #A82A28, #D9462C, #E67E22, #D6912A, #C68A1F);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

### Hairlines (borders)

| Token | Value | Usage |
|---|---|---|
| `hairline` | `rgba(61, 26, 15, 0.12)` | On light surfaces |
| `hairlineDark` | `rgba(248, 244, 238, 0.14)` | On dark surfaces |

### Status colors (used in agent pills, alerts)

| Status | Hex | Notes |
|---|---|---|
| Running / success | `#2BAE5C` | Green dot |
| Queued / warning | `#D6912A` | Amber (matches our `amber` token) |
| Error | `#D9462C` | Uses our primary accent — never invent red |

---

## ✍️ Typography

### Font families (load all four — Google Fonts)

```ts
// Next.js example
import { Sora, Inter, IBM_Plex_Mono, Instrument_Serif } from 'next/font/google';

export const sora = Sora({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-display' });
export const inter = Inter({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-body' });
export const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-mono' });
export const serif = Instrument_Serif({ subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'], variable: '--font-editorial' });
```

### Roles

| Role | Family | When to use |
|---|---|---|
| **Display** | Sora | All headlines, page titles, big numbers, buttons, primary nav |
| **Body** | Inter | Paragraphs, descriptions, form fields, secondary nav |
| **Mono** | IBM Plex Mono | Eyebrows, labels, metrics, code, "REC" chrome, timestamps |
| **Editorial** | Instrument Serif (italic) | Pull quotes and customer testimonials — sparingly |

### Type scale

| Size (px) | Use | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| 124 | Cinematic hero headline | 600 | -0.055em | 0.92 |
| 96 | CTA headline | 500 | -0.05em | 0.98 |
| 88 | Section hero | 500 | -0.045em | 0.98 |
| 80 | Page H1 | 500 | -0.04em | 0.98 |
| 72 | Case study H1 | 500 | -0.04em | 0.98 |
| 64 | Section H2 (large) | 500 | -0.04em | 1.02 |
| 56 | Section H2 | 500 | -0.035em | 1.05 |
| 48 | Section H2 (small) / About H1 | 500 | -0.035em | 1.05 |
| 44 | Tile heading | 500 | -0.035em | 1.05 |
| 32 | Step heading | 500 | -0.025em | 1.05 |
| 28 | Body H3 | 500 | -0.025em | 1.05 |
| 26 | Mobile heading | 500 | -0.025em | 1.05 |
| 22 | FAQ question, mobile card title | 500 | -0.02em | 1.18 |
| 19 | Lead paragraph | 400 | normal | 1.55 |
| 17 | Body text | 400 | normal | 1.6 |
| 15.5 | Secondary body | 400 | normal | 1.6 |
| 14 | UI text | 400 | normal | 1.5 |
| 13 | Caption, table cell | 400 | normal | 1.5 |
| 12 | Mono metric, mono caption | 500 | 0.06em | 1.6 |
| 11 | Eyebrow, mono label | 500 | 0.18em uppercase | 1.4 |

### Eyebrow (the mono caps label, used everywhere)

```jsx
<div style={{
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#D9462C', // accent
}}>Section · 03</div>
```

---

## 📏 Spacing

8px base grid. Common values:

| Token | px | Usage |
|---|---|---|
| `xs` | 4 | Inline gaps |
| `sm` | 8 | Tight gaps |
| `md` | 14–16 | Standard gaps |
| `lg` | 24 | Card padding (sm), button gap |
| `xl` | 32 | Card padding (md) |
| `2xl` | 48 | Section gap (sm) |
| `3xl` | 64 | Card padding (lg), section gap (md) |
| `4xl` | 80 | Section gap (lg) |
| `5xl` | 96 | Section gap (xl) |
| `6xl` | 128 | Page section gap (default) |
| `7xl` | 160 | Page section gap (airy) |

### Page padding

| Density | Side padding | Section gap |
|---|---|---|
| Compact | 56px | 96px |
| **Regular (default)** | **72px** | **128px** |
| Airy | 96px | 160px |

### Card padding

| Card type | Padding |
|---|---|
| Service tile (bento) | 28–36px |
| Pricing card | 32px |
| FAQ row | 22px (vertical) |
| Glass card (metric) | 26px |
| Form field | 12–14px |

---

## 🟦 Radii

| Token | px | Usage |
|---|---|---|
| `sm` | 8 | Blockquote |
| `md` | 12 | Form fields, small badges |
| `lg` | 16 | Service tiles, small cards |
| `xl` | 18 | Resource cards |
| `2xl` | 22 | Pricing cards, hero tiles |
| `3xl` | 24 | Hero image containers, CTA card |
| `full` | 9999 | Pills, buttons, status dots |

---

## 🌑 Shadows

```css
/* Glass card on light surface */
.shadow-card-light {
  box-shadow: 0 24px 60px -28px rgba(61, 26, 15, 0.18);
}

/* Glass card on dark surface */
.shadow-card-dark {
  box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.45);
}

/* Primary CTA button */
.shadow-cta {
  box-shadow:
    0 8px 22px -8px rgba(168, 42, 40, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

/* Hero mark drop-shadow */
.shadow-mark {
  filter: drop-shadow(0 24px 60px rgba(168, 42, 40, 0.3));
}
```

---

## 🌀 Motion timing

| Use | Duration | Easing |
|---|---|---|
| Hover/state transitions | 150ms | ease-out |
| Modal/sheet enter | 220ms | cubic-bezier(0.2, 0.7, 0.3, 1) |
| Modal/sheet exit | 180ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Ambient orb drift | 28–40s | ease-in-out, infinite alternate |
| Ring spin (slow) | 60–80s | linear, infinite |
| Agent pulse | 1.4s | ease-in-out, infinite |
| Mark reveal (hero loop) | 6s | ease-in-out, infinite |

---

## 🎯 Components — primary atoms

### Button — Primary

```jsx
// Primary CTA — ember gradient
<button className="
  inline-flex items-center gap-2
  px-[18px] py-3
  font-display font-medium text-[14px] tracking-tight
  text-[#FFF8F0]
  rounded-full
  bg-gradient-to-r from-[#A82A28] via-[#D9462C] to-[#E67E22]
  shadow-[0_8px_22px_-8px_rgba(168,42,40,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]
  hover:scale-[1.02] transition
">
  Book a 30-min call
  <span className="ml-0.5">→</span>
</button>
```

### Button — Dark (alt primary on light surfaces)

```jsx
<button className="
  inline-flex items-center gap-2
  px-[18px] py-3
  font-display font-medium text-[14px]
  text-[#F8F4EE] bg-[#3D1A0F]
  rounded-full
">Read the case study →</button>
```

### Button — Ghost

```jsx
<button className="
  inline-flex items-center gap-2
  px-[18px] py-3
  font-display font-medium text-[14px]
  text-[#3D1A0F] bg-transparent
  border border-[rgba(61,26,15,0.12)]
  rounded-full
">See all services</button>
```

Three sizes: sm (px=14 py=8 fs=13), md (default), lg (px=24 py=16 fs=15).

### Eyebrow (mono caps label)

```jsx
<span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#D9462C]">
  Section · 03
</span>
```

### Agent Pill (live status indicator)

```jsx
<div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-full
  bg-[rgba(248,244,238,0.06)] border border-[rgba(248,244,238,0.14)]
  font-mono text-[11.5px] tracking-[0.06em] text-[#F8F4EE]">
  <span className="w-[7px] h-[7px] rounded-full bg-[#2BAE5C]
    shadow-[0_0_0_3px_rgba(43,174,92,0.2)] animate-pulse" />
  6 SMB teams live
</div>
```

### Floating Chip (used in cinematic hero)

```jsx
<div className="absolute px-3.5 py-2.5 rounded-xl
  bg-[rgba(36,21,16,0.7)] border border-[rgba(248,244,238,0.14)]
  backdrop-blur-md
  font-body text-[12px] text-[#F8F4EE]
  shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]
  animate-[chipFloat_7s_ease-in-out_infinite_alternate]">
  📨 14k carrier emails routed last week
</div>
```

---

## 🧬 Logo usage rules

| Asset | When | Min size | Clear space |
|---|---|---|---|
| `mark.png` (color, transparent) | On light surfaces | 28px | ¼ of mark height on all sides |
| `mark-cream.png` (cream knockout) | On dark / ember-gradient surfaces | 28px | same |
| `mark-ink.png` (mono dark) | On light + need high contrast / single-color print | 28px | same |
| Lockup files (`lockup-*.png`) | Long-form contexts where the wordmark belongs alongside | 80px | ½ of mark height |

**Never:**
- Tint the color mark (it has its own ember gradient — leave it alone)
- Put the color mark on top of any of the ember gradient surfaces (use `mark-cream` instead)
- Stretch, rotate, or add effects beyond `drop-shadow`
- Recreate the mark in SVG (use the PNG — it's part of the brand)

---

## 📐 Container max-widths

| Width | Use |
|---|---|
| 1080px | Hero headlines, page H1 |
| 1100px | Approach/principles headlines |
| 720px | Resource/blog featured cards |
| 640px | Lead paragraphs, CTA supporting copy |
| 560px | Hero subcopy, service tile descriptions |
| 380px | Sidebar copy, FAQ intro |
| 320px | Service tile max width on small cards |
