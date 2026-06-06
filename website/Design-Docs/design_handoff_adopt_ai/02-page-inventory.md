# 02 · Page Inventory

Every marketing page documented in build order. Open `prototype/Adopt AI Site.html` alongside this file.

For each page you'll find:
- **What it is** — purpose + audience
- **Layout** — section-by-section structure
- **Copy** — exact text (this is final, ship as-is)
- **Components** — atoms used
- **Source file** — where to inspect the prototype

---

## 🏠 1. Home (`/`)

**Source:** `prototype/site/home-cinematic.jsx` (the only home variant — tech-forward was retired)

**Surface:** Dark — `#0F0805` (void) base with ember gradient accents.

### Sections (top to bottom)

#### 1.1 Nav
Sticky-less top nav, transparent over hero. `<SiteNav dark current="home" />`.
- Left: BrandMark (size 30, dark variant)
- Center: Services, Work, Resources, Blog, About, Pricing
- Right: "Sign in" link + "Book a call" primary button

#### 1.2 Hero (centered, ~820px tall)
- Background: ambient orbs (3 blurred radial gradients drifting on 28/34/40s loops) + large 920px concentric rings centered, slow rotation
- 4 floating glass chips at corners (these are the "data" feel):
  - `📨 14k carrier emails routed last week`
  - `⚡ most replies in under a second`
  - `🔒 SOC 2 · your data stays in your cloud`
  - `💰 $3.7k saved this week · Apex Logistics`
- Centered content:
  - Eyebrow: `ADOPT AI — AUTOMATION FOR GROWING TEAMS`
  - H1 (124px): `Real automation.\nReal SMB budgets.` (second line uses ember-text gradient)
  - Sub (21px): `We design, ship, and run AI agents for small and mid-sized businesses. Fixed price. No per-seat fees. Most projects pay back in under 8 weeks.`
  - CTAs: `Start a project` (primary) + `Watch the reel ↓` (ghost dark)
  - Three pills: `6 SMB teams live` · `$0 per-seat fees` · `Cancel monthly anytime`

#### 1.3 Social proof strip (replaces the fake-enterprise marquee)
- Bordered top + bottom, centered single-row layout
- Eyebrow + three short phrases separated by hairline dividers:
  - `The room we're in`
  - `Built for teams of 12–240 people`
  - `Working with 6 SMB ops teams today`
  - `Logistics · healthcare · finops · e-commerce`

#### 1.4 Services bento
- Eyebrow: `What we build`
- H2: `Five workflows. One small studio.` (gradient on second line)
- Sub: `Pick one workflow eating most of someone's day. We design the agent, connect it to the tools you already use, and stay on it for the first 90 days.`
- Right-aligned: `See all services →` ghost button
- 6-column bento grid:
  - **Large tile (3×2)** — ember gradient background, "Most chosen" eyebrow, headline `An agent that reads your inbox like a senior ops lead — and routes it where it belongs.`, price label `SPARK · FROM $2,400 · 2 WEEKS`
  - **Wide tile (3×1)** — `Invoice & document extraction` / `Posts straight to QuickBooks / NetSuite`
  - **Medium tile (2×1)** — `Custom AI on your data` / `Trained on your tone, your edge cases`
  - **Small tile (1×1)** — `Quality checks` / `Tested before launch`
  - **Wide tile (3×1)** — `Customer support triage` / `Cuts first-response by 80%`

#### 1.5 Case study highlight
- 2-column grid
- Left: Eyebrow `Case · 0001 / Apex Regional Logistics`, big italic headline (96px Instrument Serif), attribution `Director of Operations · Apex Regional Logistics`, 3-column metric strip (`14k · 118h · 6 wks` — these will be tightened when the case study itself is updated; main case study page is already updated), CTA `Read the build log`
- Right: 4:5 ratio dark card with neural mesh + ambient orbs + the brand mark (cream variant), with `REC · 03:42 / 09:18` + `LIVE` indicator + `APEX-LOG · SPRINT 04 · BUILD LOG` chrome

#### 1.6 Approach (How a project goes)
- Background: dark gradient between `void` and `obsidian`
- Eyebrow: `How a project goes`
- H2: `No pilots. No PowerPoints. Just one shipped agent in six weeks or less.` (gradient mid-sentence)
- 4-column grid:
  - `01 Discover` — Two-week scoping…
  - `02 Build` — Three to eight focused weeks…
  - `03 Operate` — 30 to 90 days of us on the pager…
  - `04 Hand off` — Plain-English runbooks…
- Each column has accent top border (2px solid `#D9462C`) + bottom hairline

#### 1.7 FAQ (Honest answers)
- 2-column grid (1fr / 1.5fr)
- Left: Eyebrow `Honest answers`, H2 `The questions every small team asks us first.`, intro paragraph
- Right: Six Q&A rows separated by hairlines. See `home-cinematic.jsx` line ~234 for exact strings.

#### 1.8 CTA
- Background: ambient orbs in `void`
- Centered: Eyebrow `Ready when you are`, H2 `Pick one workflow. We'll handle the rest.` (gradient on second sentence)
- Sub: `A 30-minute call. We'll tell you whether what you're after is a fit, what it would cost, and roughly how long it would take. No deck, no pitch.`
- CTAs: `Book a 30-min call` (primary) + `See pricing` (ghost dark)

#### 1.9 Footer
`<SiteFooter dark />` — 4 columns: brand block + (Services / Company / Resources), bottom bar with copyright + legal links.

---

## 🛠️ 2. Services (`/services`)

**Source:** `prototype/site/pages.jsx` → `PageServices`

**Surface:** Light cream `#F8F4EE`

### Sections

#### 2.1 Hero
- Background: subtle ambient orbs (intensity 0.25)
- Eyebrow `Services`
- H1 (88px): `Five disciplines, one delivery team that stays on the pager.` (gradient on "stays on the pager")
- Sub: `Each engagement starts with a two-week scoping sprint, ships in 4–8 weeks, then ninety days of co-operation before hand-off. Fixed-price.`

#### 2.2 Five service rows (alternating cream/paper backgrounds)

For each row: 3-column grid `[name | description | pricing]`.

1. **01 · Workflow Agents** — `From $2,400 · 2–3 weeks`
2. **02 · Document & Invoice Intelligence** — `From $3,600 · 3–4 weeks`
3. **03 · Customer Support Router** — `From $2,800 · 3 weeks`
4. **04 · Custom Model Fine-tuning** — `From $12,000 · 8–10 weeks`
5. **05 · Agent Operations** — `From $149 / mo · Continuous`

Each row has: 4-bullet "what's included" list + `Discuss this →` button.

Full descriptions in `pages.jsx`.

---

## 📐 3. Case Study (`/work/apex-regional-logistics`)

**Source:** `prototype/site/pages.jsx` → `PageCaseStudy`

**Surface:** Light cream.

### Sections

#### 3.1 Hero
- Eyebrow: `Case study · 0001 · Apex Regional Logistics`
- H1 (72px): `A 35-person logistics team got 22 hours a week back — in two weeks.` (gradient on the time figure)
- 5-column meta row: Sector / Team size / Tier / Build / Payback

#### 3.2 Hero image
- 16:6 ratio card with ember gradient + neural mesh + brand mark (cream variant)
- Chrome label: `APEX REGIONAL · INBOUND COORDINATION · SHIPPED MAY 2026`

#### 3.3 Metrics row
4 columns: `22h saved/wk` (accent) · `1,540 emails/wk` · `97% accuracy` · `6 wks payback`

#### 3.4 Story body (2-column: sidebar + main)

**Sidebar (sticky):**
- Eyebrow: `The shape of it`
- Paragraph: `One agent. One workflow. Two weeks to ship. We don't do six-month transformations…`
- Hairline divider
- "Built with" label + tools list: `Outlook · their TMS · Slack · hosted in their AWS account`

**Main column:**
1. **The problem** — Three coordinators drowning in carrier email, 38% YoY growth, didn't need a chatbot but a dispatcher
2. Pull quote: *"I didn't want a tool. I wanted my Tuesday back."* — Ops Director, Apex Regional
3. **What we built** — One agent in front of Outlook + TMS, intent classification, 90% confidence gate, Slack escalation
4. **The math** — Costs table:
   - Spark build: $2,400
   - 2 months operate ($149 × 2): $298
   - Total 8 weeks: $2,698
   - Hours reclaimed (22h × 8 wks): 176 hrs
   - Value @ $42/hr: $7,392
   - **Net return in 8 weeks: +$4,694**

---

## 📚 4. Resources (`/resources`)

**Source:** `pages.jsx` → `PageResources`

- Featured: Whitepaper card on dark "The Production Agent Playbook" with `Download free` CTA
- Sidebar: 3 secondary resources
- Library grid: 6 items × `WHITEPAPER / PLAYBOOK / TEMPLATE / TALK / CODE / GUIDE` categories

Full copy in source.

---

## ✍️ 5. Blog (`/blog`)

**Source:** `pages.jsx` → `PageBlog`

- Featured post (left): Image (placeholder = ember gradient + mark) + `May 18, 2026 · Engineering · 14 min` eyebrow + headline + dek
- Recent (right): 5 posts with category eyebrow + title only, separated by hairlines

---

## 👥 6. About (`/about`)

**Source:** `prototype/site/pages2.jsx` → `PageAbout`

**No named team grid** (you're a small studio and team would be fake).

### Sections
1. Hero with logo + ambient rings
2. **Why we exist** — Pull quote: *"Most AI work in 2025 stops at the demo. We were tired of decks that didn't survive contact with production — so we started shipping instead."*
3. **Five principles** — `No pilots / Fixed price / Your VPC / On the pager / Quiet over loud`
4. **Right fit / Not a fit** — Side-by-side comparison cards

---

## 💰 7. Pricing (`/pricing`)

**Source:** `pages2.jsx` → `PagePricing`

### Sections

#### 7.1 Hero
- Eyebrow: `Pricing · Fixed-price · Built for SMBs`
- H1: `Real automation. Real budgets.`

#### 7.2 Three tier cards

| | Spark | Lift ⭐ | Scale |
|---|---|---|---|
| Build | $2,400 | $5,800 | from $12,000 |
| Operate | + $149/mo | + $499/mo | + retainer from $799/mo |
| Sub | One agent · 2 wks | Up to 3 agents · 5–6 wks | Custom · 8–12 wks |
| Card style | White card | **Dark ink card** (the chosen tier) | White card |
| CTA | "Start a Spark project" | "Talk to an architect" | "Request a scoping call" |
| Flag | — | "MOST CHOSEN" | — |

#### 7.3 Quick-math strip
- Headline: `The average Spark pays back in under 8 weeks.`
- Stats: `15+ hrs/wk saved · 8 wks avg payback · $0 per-seat fees`

#### 7.4 Comparison table
9 rows × 4 columns (feature / Spark / Lift / Scale). Full table in source.

#### 7.5 FAQ
4 cards: hourly billing / what if it doesn't work / cancel monthly / seasonal businesses

---

## ✉️ 8. Contact (`/contact`)

**Source:** `pages2.jsx` → `PageContact`

2-column layout: Hero copy on left, form card on right.

**Form fields:**
- Your name + Work email (side by side)
- Company (full width)
- Engagement (pills: `Spark · $2,400 / Lift · $5,800 / Scale · from $12k / Not sure yet`)
- The workflow (textarea, 5 lines)
- Submit: `Request a working session` (primary, full width)
- Footer line: `WE NEVER SHARE YOUR EMAIL. EVER.`

**Right column copy block (contact info):**
- Email: hello@adoptai.com
- Phone: +1 (555) 382-3830
- Office: 500 Enterprise Way, Suite 100 · Orlando, FL 32801
- Press: press@adoptai.com

---

## 🔐 9. Client Portal Login (`/portal`)

**Source:** `pages2.jsx` → `PagePortalLogin`

- Full-page void background with ambient orbs + large central rings (920px)
- Centered 460px glassmorphic card:
  - Logo mark (80px)
  - Eyebrow `Client Portal`
  - H1: `Welcome back.`
  - Sub: `Sign in to monitor your agents, runs, and weekly reports.`
  - Email field → Password field → `Sign in` primary button
  - Divider with `OR`
  - `Continue with SSO (Okta) ↗` ghost button
  - Footer links: `FORGOT PASSWORD? · REQUEST ACCESS`
- Page footer: `SOC 2 TYPE II · ISO 27001 · HIPAA · © 2026 ADOPT AI`

---

## 🎬 What's NOT designed yet (when you're ready to expand)

- **Inside the client portal** — only login is mocked. The dashboard, agent detail page, weekly report, and settings exist as mobile screens (see `03-mobile-app-spec.md`) and can be adapted to web.
- **Individual blog post template** — only the listing is designed.
- **Individual resource detail** — only the listing.
- **Booking page** — the "Book a call" CTAs lead nowhere. Plug in Cal.com / Calendly / SavvyCal.
- **404 / error pages**
- **Cookie banner** — depending on your jurisdiction.

Build these in keeping with the established system. Or come back to me and I'll mock them.
