# 04 · Motion Production

Three pieces. One quarter. Full content engine.

**Recommended pipeline:** Seedance 2.0 for 3D / generative shots, After Effects for compositing + typography, plus a real studio shoot for the customer testimonial. The total quarterly budget is ~$17.5k.

Open `prototype/Adopt AI Site.html`, scroll to the Motion section, and you'll see live CSS-animated previs frames at 1920×1080 — these are what the final renders should look like.

---

## A · Mark Reveal

**Spec:** 6 seconds, seamless loop, 1920×1080 H.264/ProRes422.

**Where it lives:**
- Cinematic home hero (replaces the static mark + rings)
- Social media bumper at the end of any video
- Loading screen for the mobile app

**Visual:**
1. Black void, faint ember vignette pulsing
2. 5 expanding orbital rings appear from center, staggered by 1.2s
3. The mark blooms (scale 0.5 → 1 → 1.04) with ember-glow drop shadow
4. Tagline reveals at the bottom 10% (opacity + slight translate)
5. Loop point: mark scales back to 0.9, fades out, loop restarts

**Audio:** none (silent loop), OR optional 6s ambient pad that ducks under VO when combined with C.

**Pipeline:**
- Seedance 2.0: generate the ring expansions + particle field
- AE: composite the static mark PNG on top with bloom + drop-shadow
- Render: ProRes 422 (master) + H.264 + WebM (web)

---

## C · Agent In Action

**Spec:** 28 seconds total, ~7s per scene × 4 scenes, 1920×1080.

**Where it lives:**
- Services page hero
- LinkedIn ad (28s + a 15s cut)
- YouTube pre-roll
- Sales deck

**Audio:** licensed score (calm tension → resolve) + female VO talent (30s, warm, US accent). See VO script below.

**The four scenes:**

### Scene 01 · INBOX FLOOD (0:00–0:07)
- **On screen:** Cards stack into an inbox column faster than viewer can read. Tense piano pad enters.
- **Animation:** Each card drops in with a 0.18s stagger.
- **OST text:** `Carrier email floods your operations team.`

### Scene 02 · THE AGENT (0:07–0:14)
- **On screen:** Push in to the agent core (the brand mark) with two spinning ring overlays. Three sample emails pass through and get tagged with confidence scores.
- **OST text:** `Reads. Classifies. Routes in under a second.`
- **Music shift:** pad swells, arpeggio enters.

### Scene 03 · ROUTING (0:14–0:21)
- **On screen:** Four tool cards light up in sequence — TMS / QuickBooks / Zendesk / Slack — with routing lines animating out from the agent core.
- **OST text:** `Each one lands in exactly the right system.`
- **Music shift:** arpeggio climbs, brass enters.

### Scene 04 · OUTCOME (0:21–0:28)
- **On screen:** Four metric cards tick up: `14k routed · 99.4% · 118h saved · $3.7k`. Lockup + CTA card.
- **OST text:** `Your team got 22 hours back this week.` → `Book a call · adoptai.com`
- **Music:** resolves to a warm sustain + a single CTA chime.

### VO Script (final, ready to record)

| Scene | TC | VO line |
|---|---|---|
| 01 | 0:00–0:07 | "Every Monday, a thousand emails. Carriers, vendors, customers — all needing routing, all needing a person to read them." |
| 02 | 0:07–0:14 | "Adopt AI builds one thing: a coordinator that never sleeps. It reads every message, figures out what kind it is, and routes it — usually inside a second." |
| 03 | 0:14–0:21 | "It posts invoices to QuickBooks. Drops support tickets in Zendesk. Pings a human in Slack when it's not sure. All in tools you already use." |
| 04 | 0:21–0:28 | "For one customer, that's twenty-two hours back every week. Two weeks to build. Six weeks to pay back. Pick one workflow — we'll handle the rest." |

### VO direction
- **Tone:** Calm, conversational. Like a peer explaining over coffee, not a sales pitch.
- **Pace:** Slow. Let each sentence breathe. No urgency, no enthusiasm spikes.
- **Pronunciation:** Numbers in full ("twenty-two hours", "two thousand four hundred dollars"). Never "twenty-two h-r-s".
- **Trust word:** "Adopt AI" pronounced naturally — `əˈdɒpt eɪ aɪ`, no over-enunciation.

### Brand rules for any VO
- **No jargon:** never VPC, p95, eval suite, RLHF, drift.
- **No corporate words:** never "leverage", "synergy", "robust", "best-in-class", "industry-leading".
- **Always end on the customer:** the final line is what they got, not what we did.

### Alts to record (same session, same talent)
1. **28s hero** — the full version above
2. **15s LinkedIn cut** — scenes 02 + 04 only ("Adopt AI builds one thing… For one customer that's twenty-two hours back every week. Pick one workflow.")
3. **6s YouTube bumper** — just the closing line ("Pick one workflow. We'll handle the rest. adoptai.com.")

---

## E · Customer Voice

**Spec:** 90 seconds (3 internal cuts: 90s / 60s / 30s social), 1920×1080 OR vertical 1080×1920 for IG/TikTok.

**Where it lives:**
- Case study page hero
- Sales deck (used as proof point)
- LinkedIn organic post
- Cold email (15s version)

**The frame:** the design uses an abstract branded illustration (orbital rings + the brand mark + a gradient halo) as the visual anchor — **not stock photography**. When you actually shoot a customer, that footage replaces the illustration. Until then, the branded illustration ships.

### When you film a real customer

**Setup:**
- Studio shoot, 4K, 50mm lens, three-point lighting
- Background: solid dark with warm side light (matches the ember vignette in the design)
- Customer sits three-quarter angle to camera, eye level
- Audio: lavalier mic + room mic for safety

**The interview (60–90 min raw → 90s final):**
- 7 questions, ask all of them
- The questions matter less than the *answers you cut to*:
  1. What was your team doing before? (sets up problem)
  2. What was the breaking point? (emotion)
  3. What did Adopt AI build? (proof)
  4. Walk me through a typical Monday now. (specifics)
  5. What's the dollar impact? (math)
  6. What would you tell another small business owner considering this? (advocacy)
  7. **And the secret one — "Why us?"** (positioning, the gold quote)

**Edit approach:**
- Open on a single tight quote (8–12s) — usually #6 or #7
- Cut to context (#1) for 15s
- Build to the math (#5) — overlay the actual numbers on screen as they say them
- End on a one-liner of advocacy

**Lower-thirds:** use the design system (4pt gradient bar + Sora 500 26pt name + IBM Plex Mono 13pt role/company).

**Brand grade:** ember vignette (radial from upper-right), slight teal in the shadows, warm in the highlights. Match the design exactly.

---

## 📅 Quarterly production calendar

| Weeks | Piece | Pipeline | Budget |
|---|---|---|---|
| 1–2 | A · Mark Reveal | Seedance + AE | $2,800 |
| 3–5 | C · Agent In Action | Capture + comp + VO recording | $8,500 |
| 6–8 | E · Customer Voice | Studio shoot + edit + grade | $4,200 |
| 9–12 | Cuts + iteration | All three, social cuts, A/B variants | $2,000 |
| | | **Total** | **$17,500** |

**Notes:**
- Budget assumes a single agency or a hybrid of contractor + DIY. Adjust ±30% based on talent costs.
- The customer shoot is the biggest variable — if your first real customer is local you can DIY for ~$1,500. If they're remote and you fly out, double it.
- A and C can be done by one motion designer in parallel.

---

## 🎯 Deliverables checklist (when you greenlight production)

For each piece, get back:
- [ ] ProRes 422 master (1920×1080 @ 24fps)
- [ ] H.264 web cut (1920×1080)
- [ ] WebM web cut (1920×1080) — for the website
- [ ] H.264 vertical 1080×1920 (for Reels/TikTok/Shorts)
- [ ] H.264 square 1080×1080 (for LinkedIn/Instagram feed)
- [ ] 6s and 15s alt cuts (where applicable)
- [ ] Static WebP poster frame
- [ ] Captioned versions (SRT + burned-in caps for silent autoplay)
- [ ] Source AE / Premiere project file (so you can edit it later)
