# Landing Page — Wireframe

> Makieta architektury informacji LP. Sekcja po sekcji.
> Format: markdown wireframe z annotacjami dla UI designera.

---

## Global Rules

- No navigation bar (single-goal page)
- No outbound links (keep on page until convert)
- Max 2 CTA placements (Hero + Final) — same action
- Mobile-first (organic social = 70%+ mobile)
- Single column on mobile

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 1: HERO                            │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  yourcast [logo]                                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              [BADGE: "Limited early access"]          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│         A podcast no one else will ever hear.               │
│                    (H1 — headline)                          │
│                                                             │
│    A hyper-personalized podcast with only the things you    │
│    actually care about. Generated daily, just for you.      │
│                (subheadline — 1-2 lines)                    │
│                                                             │
│           ┌──────────────────────────────┐                  │
│           │  [email field]  │ Join the waitlist │           │
│           └──────────────────────────────┘                  │
│           Just a launch update once we go live soon.        │
│                                                             │
│                                                             │
│              ┌─────────────────────┐                        │
│              │                     │                        │
│              │   [APP MOCKUP]      │                        │
│              │   Episode screen    │                        │
│              │   with topics,      │                        │
│              │   duration, play    │                        │
│              │                     │                        │
│              └─────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Element | Content |
|---------|---------|
| Badge | Limited early access |
| H1 | A podcast no one else will ever hear. |
| Subheadline | A hyper-personalized podcast with only the things you actually care about. Generated daily, just for you. |
| CTA button | Join the waitlist |
| Micro-copy | Just a launch update once we go live soon. |
| Visual | App mockup: episode screen showing topic list + duration + play button |

### Designer Notes

- Badge above headline — small pill shape, accent color
- H1: large, bold, centered
- Subheadline: regular weight, muted color, 1-2 lines. Simple product explanation under the hook.
- CTA: inline form (email input + button) — high contrast button
- Mockup: positioned below CTA, angled or floating with subtle shadow
- Everything above fold on desktop; headline + CTA above fold on mobile
- Consider subtle gradient or abstract background — not flat white

### Alternative Headlines (for A/B testing later)

- A: "Your news. Your depth. Your daily podcast."
- B: "Stop scrolling 10 apps. Start listening to one."
- C: "A podcast no one else will ever hear." ← current pick

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 2: PROBLEM                         │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    Hundreds of tabs, newsletters, and feeds                 │
│    screaming for your attention.                            │
│                  (H2 — large, bold)                         │
│                                                             │
│    They all have one thing in common:                       │
│    you don't have time for them.                            │
│              (follow-up line — emphasized)                  │
│                                                             │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│  │ X │ │YT │ │Red│ │IG │ │FB │ │Sub│ │RSS│ │TT │         │
│  │⁽²⁴⁾│ │⁽⁹⁹⁾│ │⁽¹⁷⁾│ │⁽⁴³⁾│ │⁽¹²⁾│ │⁽⁶⁸⁾│ │⁽³¹⁾│ │⁽⁵⁶⁾│         │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘         │
│    (platform icons with unread notification badges)         │
│                                                             │
│    What if someone could cut through the noise              │
│    and deliver only what actually matters —                 │
│    every day, exactly the way you like it?                  │
│              (transition line → next section)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Element | Content |
|---------|---------|
| H2 | Hundreds of tabs, newsletters, and feeds screaming for your attention. |
| Agitate line | They all have one thing in common: you don't have time for them. |
| Platform icons | X (24), YouTube (99), Reddit (17), Instagram (43), Facebook (12), Substack (68), RSS (31), TikTok (56) — each with red unread badge |
| Transition | What if someone could cut through the noise and deliver only what actually matters — every day, exactly the way you like it? |

### Designer Notes

- Dark/contrasting background — visual break from Hero
- H2: large, bold, centered
- "You don't have time" line: slightly larger or different color — emotional punch
- Platform icons: horizontal row of recognizable logos, each with red notification badge (different numbers 12-99). Grayscale icons, red badges — instantly triggers "unread anxiety"
- Consider: slight random rotation on each icon to feel chaotic/overwhelming
- Transition line at bottom: lighter weight, serves as bridge to Section 3
- No CTA here — this section builds tension, next section resolves it

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 3: HOW IT WORKS                    │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Here's how it works.                           │
│                   (H2 — centered)                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ① Define your areas of interest                    │   │
│  │     What do you want to track? What do you want     │   │
│  │     to learn about? We'll handle the rest.          │   │
│  │                                                     │   │
│  │          [PHONE MOCKUP: topic + mode picker]        │   │
│  │                                                     │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  ② We source, filter, and write                     │   │
│  │     AI scans hundreds of sources, cuts the noise,   │   │
│  │     and writes a script tailored to your depth      │   │
│  │     and style.                                      │   │
│  │                                                     │   │
│  │          [ILLUSTRATION: sources → funnel → script]  │   │
│  │                                                     │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  ③ Every morning, hit play                          │   │
│  │     Your unique podcast is ready. One tap and       │   │
│  │     you're listening — no one else gets this        │   │
│  │     episode.                                        │   │
│  │                                                     │   │
│  │          [PHONE MOCKUP: "Your episode is ready"]    │   │
│  │                                                     │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  ④ You give feedback, we get smarter                │   │
│  │     Optionally rate episodes or react to segments.  │   │
│  │     The more you tell us, the better your next      │   │
│  │     episode gets.                                   │   │
│  │                                                     │   │
│  │          [PHONE MOCKUP: feedback UI]                │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Element | Content |
|---------|---------|
| H2 | Here's how it works. |
| Step 1 title | Define your areas of interest |
| Step 1 body | What do you want to track? What do you want to learn about? We'll handle the rest. |
| Step 2 title | We source, filter, and write |
| Step 2 body | AI scans hundreds of sources, cuts the noise, and writes a script tailored to your depth and style. |
| Step 3 title | Every morning, hit play |
| Step 3 body | Your unique podcast is ready. One tap and you're listening — no one else gets this episode. |
| Step 4 title | You give feedback, we get smarter |
| Step 4 body | Optionally rate episodes or react to segments. The more you tell us, the better your next episode gets. |

### Designer Notes

- Light background — contrast with dark Problem section above
- **Sticky phone mockup in center** — on scroll, the phone stays fixed and its screen content transitions between steps (parallax/scroll-triggered animation)
- Steps slide in from below as user scrolls, phone content updates to match
- Each step: large number + title (bold) + body (regular) flanking the phone
- Phone mockup screens:
  - Step 1: topic/interest picker + mode selector (news reader vs reportage)
  - Step 2: visual of sources funneling into a script/episode
  - Step 3: "Your episode is ready" notification/play screen
  - Step 4: post-episode feedback UI (optional rating/reactions)
- On mobile: phone mockup above, steps below (no sticky — just sequential)
- Keep body copy to 1-2 lines max per step

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 4: DEMO / PREVIEW                  │
## └─────────────────────────────────────────────┘

`[SKIPPED — no demo asset yet. Revisit when video/audio sample available.]`

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 5: DIFFERENTIATORS                 │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│            Not another AI summary tool. Or aggregator.      │
│                    (H2 — centered)                          │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  🎙 Written,          │  │  🧠 Hyper-           │        │
│  │  not curated          │  │  personalized         │        │
│  │                       │  │                       │        │
│  │  We don't pick from   │  │  Not just topics —    │        │
│  │  existing podcasts.   │  │  your trusted sources, │       │
│  │  We write yours from  │  │  people to follow,    │        │
│  │  scratch, every day.  │  │  angles, and depth    │        │
│  │                       │  │  per topic.           │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  📡 Multi-source,    │  │  🎵 Production       │        │
│  │  one place            │  │  quality              │        │
│  │                       │  │                       │        │
│  │  Pulls from RSS,      │  │  Background music,    │        │
│  │  newsletters, data    │  │  natural transitions, │        │
│  │  feeds, search APIs   │  │  source citations.    │        │
│  │  — you stop           │  │  Sounds like a real   │        │
│  │  tab-hopping.         │  │  show.                │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Element | Content |
|---------|---------|
| H2 | Not another AI summary tool. Or aggregator. |
| Card 1 title | Written, not curated |
| Card 1 body | We don't pick from existing podcasts. We write yours from scratch, every day. |
| Card 2 title | Hyper-personalized, not just "pick your topics" |
| Card 2 body | We go deeper: your trusted sources, specific people to follow, angles you care about, depth per topic. Not just what — but how, from whom, and how deep. |
| Card 3 title | Multi-source, one place |
| Card 3 body | Pulls from RSS, newsletters, data feeds, search APIs — you stop tab-hopping. |
| Card 4 title | Production quality |
| Card 4 body | Background music, natural transitions, source citations. Sounds like a real show. |

### Designer Notes

- 2x2 card grid on desktop, vertical stack on mobile
- Each card: icon/emoji + title (bold) + body (2 lines max)
- Subtle border or light background on cards — not heavy drop shadows
- H2 should feel slightly provocative — addressing the "is this just NotebookLM?" objection
- Optional: small "vs" comparison line under headline (e.g. "Here's what makes this different") — only if H2 feels too abrupt alone
- Light or neutral background — let cards carry the visual weight

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 6: PERSONALIZATION PROOF           │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         We don't personalize. We hyper-personalize.         │
│                    (H2 — centered, bold)                    │
│                                                             │
│         You set the direction. We tune 26 dials.            │
│                    (supporting line)                        │
│                                                             │
│    No knobs, no settings pages. Just tell us what           │
│    you care about — the system figures out the rest.        │
│              (supporting line)                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  CONTENT         what you hear                      │   │
│  │  ──────────────────────────────────────────         │   │
│  │  Topics · Sources · Depth · Niche level ·           │   │
│  │  Serendipity · Recency · Diversity                  │   │
│  │                                                     │   │
│  │  SHAPE           how it's structured                │   │
│  │  ──────────────────────────────────────────         │   │
│  │  Format · Segment length · Perspectives ·           │   │
│  │  Transitions · Narrative style · Pacing             │   │
│  │                                                     │   │
│  │  DELIVERY        how it sounds                      │   │
│  │  ──────────────────────────────────────────         │   │
│  │  Voice · Energy · Warmth · Humor ·                  │   │
│  │  Formality · Music style                            │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│    All of this adapts automatically as you listen.          │
│    You just press play. Every morning.                      │
│              (closing line — reassurance)                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Element | Content |
|---------|---------|
| H2 | We don't personalize. We hyper-personalize. |
| Supporting line 1 | You set the direction. We tune 26 dials. |
| Supporting line 2 | No knobs, no settings pages. Just tell us what you care about — the system figures out the rest. |
| Axis 1 | **Content** — what you hear: topics, sources, depth, niche level, serendipity, recency, diversity |
| Axis 2 | **Shape** — how it's structured: format, segment length, perspectives, transitions, narrative style, pacing |
| Axis 3 | **Delivery** — how it sounds: voice, energy, warmth, humor, formality, music style |
| Closing line | All of this adapts automatically as you listen. You just press play. |

### Designer Notes

- Visual: 3 horizontal bands or rows (Content / Shape / Delivery) — each with a label, subtitle, and parameter tags
- Parameter tags: pill-shaped chips (like Figma tags or Spotify genre pills)
- Consider subtle animation: tags gently shift/rearrange on scroll to suggest "tuning"
- Key message: the USER doesn't touch these — the system does. Emphasize magic, not complexity
- Closing line anchors the section: "you just press play" = zero effort for the user
- Background: slight gradient or texture — this section should feel premium/techy but accessible

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 7: SOCIAL PROOF                    │
## └─────────────────────────────────────────────┘

`[SKIPPED — no testimonials/social proof available yet. Revisit after beta launch.]`

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 8: FAQ                             │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Questions? We got you.                         │
│                    (H2 — centered)                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ▸ Is this just AI-generated slop?                   │   │
│  │    ──────────────────────────────────────────────    │   │
│  │    [collapsed — expands on click]                    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ▸ Why can't I just do this with ChatGPT?            │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ▸ What sources does it use?                         │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ▸ How long are the episodes?                        │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ▸ When is launch?                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Question | Answer |
|----------|--------|
| Is this just AI-generated slop? | No. We use premium voice synthesis, music production, and source-cited scripts. Every story links to its original source. It's built to sound like a human-produced show — not a robot reading articles. |
| Why can't I just do this with ChatGPT? | You could summarize one article. But real-time multi-source aggregation, daily automation, production-quality audio, and a system that learns your preferences over weeks? That's a pipeline, not a prompt. |
| What sources does it use? | Hundreds of RSS feeds, newsletters, search APIs, and data feeds. You can also request specific sources or people to track. |
| How long are the episodes? | You decide — from 2-minute headline scans to 20-minute deep dives. |
| When is launch? | We're in private beta now. Join the waitlist and we'll invite you as spots open. |

### Designer Notes

- Accordion/collapsible format — only question visible by default, answer expands on tap
- 5 questions max — don't overload
- Clean, simple typography — no cards or fancy styling needed
- Light background, full-width on mobile
- Questions should use conversational tone (the way a skeptic would ask)

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 9: MEET THE TEAM                   │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Built by people who get it.                    │
│                    (H2 — centered)                          │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐│
│  │                          │  │                          ││
│  │  [photo]                 │  │  [photo]                 ││
│  │                          │  │                          ││
│  │  Daniel Woźniak          │  │  Bartek Krawczyk         ││
│  │  Product & Design        │  │  AI & Engineering        ││
│  │                          │  │                          ││
│  │  [2-3 sentence bio]      │  │  [2-3 sentence bio]      ││
│  │                          │  │                          ││
│  │  [LinkedIn] [X]          │  │  [LinkedIn] [X]          ││
│  │                          │  │                          ││
│  └──────────────────────────┘  └──────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Element | Content |
|---------|---------|
| H2 | Built by people who get it. |
| Person 1 name | Daniel Woźniak |
| Person 1 role | Product & Design |
| Person 1 bio | Podcast & news junkie, fighting daily with his FOMO while trying to understand what is really going on around the world. |
| Person 1 links | [LinkedIn](https://www.linkedin.com/in/daniel-a-wozniak) |
| Person 2 name | Bartek Krawczyk |
| Person 2 role | AI & Engineering |
| Person 2 bio | Crazy about building difficult things — but even crazier about the quality of what we want to deliver for you. |
| Person 2 links | [LinkedIn](https://www.linkedin.com/in/bart-krawczyk/) |

### Designer Notes

- Two-column card layout, centered
- Photo: circular crop, professional but approachable
- Name: bold. Role: muted color. Bio: regular weight, short.
- Social icons: small, bottom of each card
- Background: neutral/light — human section should feel warm
- H2: "Built by people who get it" — signals credibility + relatability (we have the same problem)

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 10: PRICING                        │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Early access is free.                          │
│                    (H2 — centered)                          │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐│
│  │                          │  │                          ││
│  │  CLOSED BETA             │  │  PREMIUM (coming soon)   ││
│  │  ────────────────        │  │  ────────────────        ││
│  │                          │  │                          ││
│  │  Free                    │  │  $?/mo                   ││
│  │                          │  │                          ││
│  │  ✓ Full personalized     │  │  Everything in Beta, +   ││
│  │    podcast experience    │  │                          ││
│  │  ✓ All sources           │  │  ✓ Longer episodes       ││
│  │  ✓ Preference learning   │  │  ✓ Multiple daily casts  ││
│  │  ✓ Daily delivery        │  │  ✓ Learning mode         ││
│  │                          │  │  ✓ Multiple podcasts     ││
│  │  In exchange for your    │  │    with different         ││
│  │  feedback.               │  │    cadence and vibe       ││
│  │                          │  │                          ││
│  │  [Join the waitlist]     │  │  [Notify me]             ││
│  │                          │  │                          ││
│  └──────────────────────────┘  └──────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Element | Content |
|---------|---------|
| H2 | Early access is free. |
| Tier 1 name | Closed Beta |
| Tier 1 price | Free |
| Tier 1 features | Full personalized podcast experience · All sources · Preference learning · Daily delivery |
| Tier 1 condition | In exchange for your feedback. |
| Tier 1 CTA | Join the waitlist |
| Tier 2 name | Premium (coming soon) |
| Tier 2 price | TBD |
| Tier 2 features | Everything in Beta + Longer episodes · Multiple podcasts with different cadence and vibe · Learning mode · Premium voices |
| Tier 2 CTA | Notify me |

### Designer Notes

- Two-column card layout (side by side desktop, stacked mobile)
- Beta card: highlighted/accented border — this is the active offer
- Premium card: muted/greyed slightly — "coming soon" feel
- "In exchange for your feedback" should feel like a fair deal, not a catch
- Keep premium features speculative — placeholder for now
- CTA on Beta card = same action as Hero (waitlist). Premium = secondary/ghost button

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 11: FINAL CTA                      │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         Your personalized podcast is waiting.               │
│                    (H2 — centered)                          │
│                                                             │
│           ┌──────────────────────────────┐                  │
│           │  [email field]  │ Join the waitlist │           │
│           └──────────────────────────────┘                  │
│           Just a launch update once we go live soon.        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Element | Content |
|---------|---------|
| H2 | Your personalized podcast is waiting. |
| CTA button | Join the waitlist |
| Micro-copy | Just a launch update once we go live soon. |

### Designer Notes

- Visually distinct background (accent color or dark) — stands out as final push
- Same form as Hero — email + button, identical action
- Short and confident — no re-explaining the product at this point
- Optional: repeat waitlist counter if available ("Join X others")

---

## ┌─────────────────────────────────────────────┐
## │  SECTION 12: FOOTER                         │
## └─────────────────────────────────────────────┘

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  yourcast [logo]                                            │
│                                                             │
│  Built by Bartek & Daniel                                   │
│                                                             │
│  [X icon]  [LinkedIn icon]                                  │
│                                                             │
│  Privacy Policy · Contact                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Copy

| Element | Content |
|---------|---------|
| Logo | yourcast |
| Team | Built by Bartek & Daniel |
| Social links | X, LinkedIn |
| Legal | Privacy Policy · Contact |

### Designer Notes

- Minimal, single row on desktop
- No navigation links — just credibility and legal
- Muted colors, small type — don't compete with Final CTA above
