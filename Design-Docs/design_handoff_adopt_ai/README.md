# Adopt AI — Design Handoff

A complete design system + page-by-page spec for the Adopt AI marketing website and iOS client portal.

---

## 📦 About these files

The HTML/JSX files in `prototype/` are **design references** — interactive prototypes built in vanilla React + Babel-in-the-browser to demonstrate the intended look, layout, copy, and behavior. **They are not production code.**

**Your job:** recreate these designs in a real production stack. Recommended:
- **Marketing site:** Next.js 15 (App Router) + Tailwind CSS + shadcn/ui — picks up Sora/Inter/IBM Plex Mono cleanly, MDX for blog/resources, server components for performance.
- **iOS client portal:** SwiftUI (native) or React Native + Expo if you want one codebase for iOS/Android.

If you have an existing codebase, ignore those recommendations and use what you already have — the designs translate cleanly to any modern stack.

---

## 🎨 Fidelity

**Hi-fi pixel-perfect.** Every color, type ramp, spacing token, and interaction is final. Exact hex values, font sizes, line heights, and animation timings are documented in this README — match them precisely.

The two areas with intentional placeholders:
1. **Customer testimonial portrait** — the design uses an abstract branded illustration (orbital rings + the logo mark) instead of stock photography. Keep this treatment. Replace with real customer footage only once you actually film a customer.
2. **Case study writeup** — uses one fictional customer ("Apex Regional Logistics"). Replace with your first real customer's story when ready.

---

## 📁 Folder map

```
design_handoff_adopt_ai/
├── README.md                       ← this file
├── 01-brand-tokens.md              ← colors, type, spacing, shadows
├── 02-page-inventory.md            ← page-by-page spec (copy, components, behavior)
├── 03-mobile-app-spec.md           ← iOS portal screens
├── 04-motion-production.md         ← the three motion pieces, VO scripts
├── assets/
│   └── logo/
│       ├── adopt-ai-mark.png       ← primary (color, transparent bg) — head only
│       ├── adopt-ai-mark-cream.png ← for dark surfaces (cream knockout)
│       ├── adopt-ai-mark-ink.png   ← for light surfaces (dark mono)
│       ├── adopt-ai-lockup.png     ← head + "ADOPT AI" wordmark + tagline
│       ├── adopt-ai-lockup-cream.png
│       └── adopt-ai-lockup-ink.png
└── prototype/
    ├── Adopt AI Site.html          ← OPEN THIS to see the website design
    ├── Adopt AI Brand Identity.html ← OPEN THIS to see the brand system
    ├── app.jsx                     ← website main composition
    ├── site/
    │   ├── atoms.jsx               ← shared components (Button, Nav, Footer, etc.)
    │   ├── home-cinematic.jsx      ← THE homepage (single direction)
    │   ├── pages.jsx               ← services, case study, resources, blog
    │   ├── pages2.jsx              ← about, pricing, contact, portal login
    │   ├── mobile.jsx              ← iOS portal — 6 screens
    │   ├── motion-prod.jsx         ← motion pieces + VO script
    │   └── motion-lab.jsx          ← additional motion exploration (reference only)
    ├── design-canvas.jsx           ← infra (the design tool wrapper — ignore)
    ├── tweaks-panel.jsx            ← infra (Tweaks toolbar — ignore)
    ├── mark.jsx                    ← brand system definitions (colors, type pairings)
    ├── artboards.jsx               ← brand identity artboards
    └── mark-concepts.jsx           ← unused mark exploration (reference only)
```

**To see the designs:** open `prototype/Adopt AI Site.html` in a browser. Pan/zoom the canvas to navigate between sections. Open `Adopt AI Brand Identity.html` for the brand system view.

---

## 🏗️ Tech stack recommendation

### Marketing site (`adoptai.com`)
- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS (with custom config matching tokens in `01-brand-tokens.md`)
- **UI primitives:** shadcn/ui (Button, Dialog, Sheet)
- **Fonts:** `next/font/google` for Sora, Inter, IBM Plex Mono, Instrument Serif
- **Animations:** Framer Motion for the ambient orbs, mark reveal, and on-scroll reveals
- **Blog/Resources:** MDX with `next-mdx-remote`
- **Forms:** React Hook Form + Zod
- **CMS (optional, when ready):** Sanity or Contentlayer for blog posts and case studies
- **Hosting:** Vercel

### Client portal (web)
- **Framework:** Same Next.js app, behind `/portal` route
- **Auth:** NextAuth.js with Okta + magic link providers (matches the portal design)
- **Backend:** Whatever you're already using; portal just reads agent metrics

### Mobile (iOS client portal)
- **Framework:** SwiftUI (recommended for native feel + smaller team) OR React Native + Expo
- **State:** SwiftData (SwiftUI) or Zustand (RN)
- **API:** Same backend as web portal

---

## 🎯 What's been designed

### Brand system
- Logo in 6 variants (3 mark + 3 lockup, light/dark/mono surfaces)
- Ember color palette (5-stop gradient + supporting neutrals)
- Type pairing: Sora (display) · Inter (body) · IBM Plex Mono (mono) · Instrument Serif (editorial accent)

### Marketing site — 9 page templates
1. **Home** — cinematic dark hero with the brand mark, services bento, case study, FAQ, CTA
2. **Services** — 5 service pillars with bullets, price, time-to-ship per pillar
3. **Case study** — Apex Regional Logistics (one example, replace with real)
4. **Resources** — playbook library (featured whitepaper + grid)
5. **Blog** — field notes (featured post + recent list)
6. **About** — small studio story, principles, "right fit / not a fit" comparison (no team grid)
7. **Pricing** — Spark / Lift / Scale tiers with comparison table + FAQ
8. **Contact** — book a working session form
9. **Client portal login** — dark glassmorphic sign-in card

### Mobile iOS client portal — 6 screens
1. Sign in (Face ID + SSO)
2. Dashboard (live agent status + this-week metric)
3. Agent detail (live feed + throughput chart)
4. Weekly report (metrics + pipeline breakdown)
5. Notifications / alerts
6. Profile / settings

### Motion production — 3 pieces (with VO script)
1. **A · Mark Reveal** — 6s looping hero film
2. **C · Agent In Action** — 28s product explainer with full voiceover script
3. **E · Customer Voice** — 90s testimonial template (branded illustration, no stock photography)

---

## 💰 Pricing (final)

These appear throughout the site — if they change, update consistently across:
`site/pages2.jsx` (PagePricing), `site/pages.jsx` (PageServices, PageCaseStudy), `site/home-cinematic.jsx` (bento tile + FAQ), `site/mobile.jsx` (profile billing line).

| Tier | Build | Operate | Sub |
|---|---|---|---|
| **Spark** | $2,400 one-time | + $149 / mo | One agent · 2 weeks |
| **Lift** | $5,800 one-time | + $499 / mo | Up to 3 agents · 5–6 weeks |
| **Scale** | from $12,000 | + retainer from $799 / mo | Custom multi-agent · 8–12 weeks |

---

## ✉️ Brand voice cheatsheet

When writing new copy, follow these rules — they're the difference between sounding like Adopt AI and sounding generic:

- **No jargon:** never say VPC, p95, eval suite, golden dataset, RLHF, drift KL. Use plain English even when describing technical things.
- **No fake enterprise vibe:** no Fortune-500 marquees, no "transform your organization" language.
- **Numbers in full when spoken:** "twenty-two hours", "two thousand four hundred dollars".
- **Outcome first, never our process:** lead with what the customer got, not what we did.
- **Customer is the hero, not us:** "Maya got her Tuesday back" not "We built an agent."
- **Honest, not aggressive:** the FAQ explicitly says "if we can't show you the math, we won't take the project." Stay in that register.

---

## 🚀 Next steps if you're building this in Claude Code

1. Open `prototype/Adopt AI Site.html` in a browser. Get familiar with every page.
2. Read `01-brand-tokens.md` and `02-page-inventory.md`.
3. Set up a new Next.js project. Copy tokens from `01-brand-tokens.md` into your Tailwind config.
4. Build the **atoms first** (`Button`, `Eyebrow`, `BrandMark`, `AmbientOrbs`, `AgentPill`, `Metric`, `GlassCard`, `Hairline`). Match the prototype exactly.
5. Build the **layout primitives** (`SiteNav`, `SiteFooter`) and verify on a blank page.
6. Build pages in this order: Home → Pricing → Contact → Services → Case Study → About → Resources → Blog → Portal Login.
7. Mobile app is independent — can be built in parallel by another developer.

When you (or your Claude Code session) needs more context on any specific element, the prototype HTML files contain the canonical answer — open them and inspect the source.

---

**Questions or gaps?** The prototype is the source of truth. If the README and the prototype disagree, trust the prototype.
