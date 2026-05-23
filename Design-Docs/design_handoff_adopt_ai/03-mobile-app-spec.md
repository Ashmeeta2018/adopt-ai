# 03 · Mobile App Spec (iOS Client Portal)

Six screens documented in build order. Open `prototype/Adopt AI Site.html` and scroll to the Mobile section, OR inspect `prototype/site/mobile.jsx` directly.

**Recommended stack:** SwiftUI (native iOS, smaller team) OR React Native + Expo (cross-platform). Spec is framework-agnostic.

**Device baseline:** iPhone 14 / 15 — 390 × 844 pt logical, 3x physical pixels.

---

## 🎨 Surface modes per screen

| Screen | Mode |
|---|---|
| 01 Sign in | Dark (ambient hero) |
| 02 Dashboard | Light |
| 03 Agent detail | Dark (live feed feels appropriate dark) |
| 04 Weekly report | Light |
| 05 Alerts | Light |
| 06 Profile | Light |

---

## 📱 Common layout primitives

### Status bar
54pt tall, content padded `[18, 30]`.
- Left: time `9:41` (font-body 14pt, semibold)
- Right: signal + wifi + battery glyphs

### Notch
110×32 pt rounded pill, centered horizontally, top: 14pt.

### Tab bar (bottom)
- Padding: `[12, 22, 28]`
- Background: `rgba(248,244,238,0.92)` (light) or `rgba(15,8,5,0.92)` (dark)
- Backdrop blur 20px, saturate 1.4
- 1px top border (hairline)
- 5 items: Home (◇), Agents (◈), Reports (◢), Alerts (◉), You (○)
- Each: 20pt glyph + 10pt label, accent color for active

For SwiftUI: use `TabView` with custom backgrounds. For RN: `@react-navigation/bottom-tabs` with blur layer.

---

## 1. Sign In

**Background:** void dark + ambient orbs + 420pt rings centered at top 40%.

### Content
- 96pt logo mark (color variant) — centered at top
- Eyebrow: `CLIENT PORTAL` (glow color)
- H1 (32pt, Sora 500): `Welcome back,\nMaya.`
- Sub (13pt, soft): `Apex Regional Logistics · Director of Ops`
- Flex spacer to push the next block to the bottom
- Glass card row: `Use Face ID` (with system icon + arrow)
- Ghost button: `Continue with SSO (Okta)`
- Footer mono caps: `SOC 2 · ISO 27001 · HIPAA · END-TO-END ENCRYPTED`

### Behavior
- Tap Face ID → trigger native biometric (LAContext on iOS)
- Tap SSO → open Okta OAuth flow in SFSafariViewController (iOS) or webview

---

## 2. Dashboard

**Background:** Light cream.

### Header (top, 8px padding)
- Mono caps date `WED · MAY 22`
- Greeting `Good afternoon, Maya.` (26pt Sora 500)
- Right: 36pt rounded avatar showing initials `ML` (ink bg, cream text)
- Below: two AgentPills: `3 LIVE` and `0 ALERTS`

### Hero metric card (immediately below header, 22px padded)
- Ember gradient background `linear-gradient(135deg, #A82A28, #D9462C 60%, #E67E22)`
- 22px rounded
- Ambient ring decoration at top-right corner (clipped)
- Eyebrow `THIS WEEK · MAY 15–22`
- Big number `445.5h` (56pt Sora 600 — note: in the SMB context this becomes `22h` to match the case study; current prototype shows the old number, update on implementation)
- Subline `Human-hours reallocated · ↑ 12% vs last week`
- Inline sparkline (SVG, 200×40 viewBox, white stroke 1.8px)

### Agent list (heading + 3 cards)
Each agent card:
- 42×42 rounded square with gradient background + agent glyph
- Mono agent name (e.g., `intake-agent-v4`)
- Green status dot
- Subtitle (description)
- Mono metric strip below: `14,235/day · 99.43%`
- Right chevron

### Behavior
- Tap agent card → push Agent Detail (screen 3)
- Pull-to-refresh on the scroll view → re-fetch metrics
- Hero card itself is tappable → push to a full weekly report (screen 4)

---

## 3. Agent Detail

**Background:** void dark + ambient orbs (intensity 0.4).

### Header
- Back chevron + eyebrow `YOUR AGENTS`
- Mono title `intake-agent-v4` (22pt) + green status dot
- Sub: `Apex Regional Logistics · Inbound coordination`
- 3-column metric grid (12pt padded glass tiles): `14,235 (24h tasks) · 99.43% (success) · 412ms (p95 latency)`

### Throughput chart
- 80pt tall card with subtle border
- 24h area chart: ember gradient fill + glow stroke
- Use real data when wired; placeholder is animated SVG path

### Live feed
- Eyebrow `Live · last 60s` + right `▶ STREAMING` indicator (accent color)
- Monospace log lines (11pt, line-height 1.7)
- Each line: timestamp (faint) · status icon (green ✓ or amber ⚙) · message (truncated)
- Older lines fade (opacity decreases 0.07 per row)

### Behavior
- New rows animate in at top (translateY + fade)
- Tap a line → push to a detail sheet showing the original message + the agent's classification + actions

---

## 4. Weekly Report

**Background:** Light cream.

### Header
- Eyebrow `Weekly performance`
- Title `May 15 – May 22` (26pt)
- Sub `Apex Regional Logistics`

### Big numbers (2-column grid)
- `HOURS SAVED · 445.5` (ember-gradient text) + `↑ 12% VS LAST WK` mono caption
- `COST REDUCED · $17.8k` + `↑ 8%` caption

### Pipeline breakdown
Three rows, each:
- Header: pipeline name + saved hours (color-coded)
- Sub: `14,235 tasks · 99.4% success`
- Progress bar with gradient fill (color → glow)
- Row colors: accent / glow / amber

### Action buttons
- `Export PDF` (dark, half-width)
- `Share` (ghost, half-width)

### Behavior
- Export PDF → generate a PDF on the device (use `UIPrintInteractionController` or `react-native-html-to-pdf`)
- Share → native share sheet
- Tap a pipeline row → drill into that pipeline's history

---

## 5. Alerts

**Background:** Light cream.

### Header
- Eyebrow `Notifications`
- Title `Alerts & updates`
- Right action: `CLEAR` (accent)

### Section: TODAY
Three alert cards, each:
- 4pt accent vertical bar (color = severity)
- Top row: TAG (caps) on left + time on right
- Title (Sora 500, 15pt)
- Body (12.5pt)
- Severity colors: glow / accent / gold

Three example tags: `OPS / DRIFT / TEAM`

### Section: EARLIER
Simpler rows (no card), divided by hairlines.

### Behavior
- Swipe-left on a card → mark read / delete (use system swipe actions)
- Pull-to-refresh
- Tap notification → relevant detail screen

---

## 6. Profile / Settings

**Background:** Light cream.

### Header (centered)
- 76pt rounded gradient avatar with initials
- Name (22pt Sora 500): `Maya Lindqvist`
- Sub: `Director of Operations · Apex Logistics`
- AgentPill: `STUDIO PLAN` (queued color)

### Sections (3 grouped lists)

**ACCOUNT**
- Profile, Notifications, Security & 2FA

**WORKSPACE**
- Team members → `8 active`
- API keys → `4 keys`
- Billing → `Lift · $5,800 · annual`
- Audit log → `14 days`

**SUPPORT**
- Contact your architect → `Tomás Costa →` (accent — your assigned PM)
- Open ticket
- Documentation

### Footer
Mono caps: `ADOPT AI · v2.4.1 · BUILD 88241`

### Behavior
- Each row is tappable, pushes a settings detail screen
- "Contact your architect" → opens a 1:1 chat or schedules a call

---

## 🎯 Out-of-scope (build later)

The mock currently doesn't show:
- Onboarding flow (3–4 screens for a new customer)
- Project creation / scope flow
- Document upload (for invoice extraction agents)
- Settings details (notifications preferences, 2FA setup)
- Native share dialog
- Empty states (zero alerts, zero agents, etc.)

These should match the design system established above. Come back to me when you need them mocked.
