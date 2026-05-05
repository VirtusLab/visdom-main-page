# Visdom Pipeline Tour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-section animated SDLC tour that lives between Hero and Pillars on the Visdom landing page. A commit token travels through 5 stations (Context · Dev · Review · Tests · CI), each lighting up as the token passes.

**Architecture:** One self-contained Astro component (`PipelineTour.astro`) with pure CSS animation — no JavaScript. Token uses `offset-path`/`offset-distance` along an SVG-defined path; station active states are driven by staggered `animation-delay` on shared keyframes. Visual language inherits from `fabric-diagram` in `Solutions.astro`. Mobile uses a vertical re-layout via media query and a rotated path.

**Tech Stack:** Astro 6 (SSG), Tailwind v4 (theme tokens), CSS scoped styles, SVG. No new deps.

**Spec:** `docs/superpowers/specs/2026-05-05-pipeline-tour-design.md`

**Verification model:** This codebase has no test framework. Every task verifies via `npm run build` (must succeed) and `npm run dev` + browser check at `http://localhost:4321/visdom-main-page/` (visual inspection against the spec's ASCII mock and timeline).

---

## File Structure

| File                                         | Status   | Responsibility                                                |
|----------------------------------------------|----------|---------------------------------------------------------------|
| `src/components/PipelineTour.astro`          | Create   | The full animated section: markup + scoped CSS                |
| `src/pages/index.astro`                      | Modify   | Import + render `<PipelineTour />` between Hero and Pillars   |
| `src/components/Pillars.astro`               | Modify   | Renumber section label `§ 01 · The Diagnosis` → `§ 02 · ...`  |

No other components touch `§ NN` numbering (verified: `CtaSection.astro` uses unnumbered `§ Next move`).

---

## Task 1: Scaffold the component and wire it into the page

**Files:**
- Create: `src/components/PipelineTour.astro`
- Modify: `src/pages/index.astro` (add import + render)
- Modify: `src/components/Pillars.astro:23` (renumber label)

- [ ] **Step 1: Create `src/components/PipelineTour.astro` with semantic skeleton**

```astro
---
const stations = [
  { id: 'context',  title: 'Context Fabric', sub: 'Agents read the ground truth',       badge: 'blast radius: 12 files', stamp: '✓ ctx' },
  { id: 'dev',      title: 'Development',    sub: 'Agent + engineer co-author',         badge: '+47 −12',                stamp: '✓ dev' },
  { id: 'review',   title: 'Code Review',    sub: 'VCR pre-reviews in CI',              badge: '0 critical · $0.10',     stamp: '✓ review' },
  { id: 'tests',    title: 'Testing',        sub: 'Architecture · property · mutation', badge: '73% mutation',           stamp: '✓ tests' },
  { id: 'ci',       title: 'Machine CI',     sub: 'Pipeline at agent speed',            badge: '5m vs 45m',              stamp: '✓ shipped' },
];
---
<section class="section pipeline-tour" aria-labelledby="pipeline-tour-title">
  <div class="container">
    <div class="fade-up pt-head">
      <p class="section-label">§ 01 · How a change flows</p>
      <h2 id="pipeline-tour-title" class="section-title">One commit. Five stations. Machine speed.</h2>
    </div>

    <figure class="pt-figure fade-up" aria-hidden="true">
      <div class="pt-stage">
        {stations.map((s, i) => (
          <div class="pt-station" data-step={i + 1} id={`pt-station-${s.id}`}>
            <p class="pt-station-label">{s.title}</p>
            <p class="pt-station-sub">{s.sub}</p>
            <span class="pt-station-badge">{s.badge}</span>
          </div>
        ))}

        <svg class="pt-wire" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
          <path id="pt-path" d="M 50 40 L 950 40" />
        </svg>

        <div class="pt-token">
          <span class="pt-token-label">feat: pricing rule</span>
          {stations.map((s, i) => (
            <span class="pt-stamp" data-step={i + 1}>{s.stamp}</span>
          ))}
        </div>
      </div>

      <figcaption class="sr-only">
        Visdom pipeline: a code change moves through Context Fabric, development, code review, testing, and machine-speed CI.
      </figcaption>
    </figure>
  </div>
</section>

<style>
  .pipeline-tour { padding-top: 3rem; padding-bottom: 3rem; }
  .pt-head { max-width: 48rem; margin-bottom: 2rem; }

  .pt-figure { margin: 0; }
  .pt-stage {
    position: relative;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 28px 24px 80px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04);
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 16px;
  }

  .pt-station {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px;
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    background: var(--color-surface);
    position: relative;
  }
  .pt-station-label { font-size: 0.95rem; font-weight: 700; color: var(--color-text); margin: 0; }
  .pt-station-sub   { font-size: 0.8rem; color: var(--color-text-secondary); margin: 0; line-height: 1.4; }
  .pt-station-badge {
    margin-top: 6px;
    align-self: flex-start;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-muted);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    padding: 3px 8px;
  }

  .pt-wire { position: absolute; left: 24px; right: 24px; bottom: 50px; height: 24px; width: calc(100% - 48px); }
  .pt-wire path { stroke: rgba(16, 185, 129, 0.35); stroke-width: 1.25; fill: none; }

  .pt-token {
    position: absolute;
    left: 24px;
    bottom: 38px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid var(--color-border);
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-text);
    white-space: nowrap;
  }
  .pt-token-label { font-weight: 600; }
  .pt-stamp {
    color: var(--color-emerald-dark);
    font-size: 0.66rem;
    border-left: 1px solid var(--color-border-light);
    padding-left: 6px;
  }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }
</style>
```

This is a static, "all-on" skeleton — every station shows its content, every stamp is visible, token sits at the left. Animation comes later.

- [ ] **Step 2: Add the import and render in `src/pages/index.astro`**

Replace the existing imports + main block to include the new component between `Hero` and `Pillars`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import PipelineTour from '../components/PipelineTour.astro';
import Pillars from '../components/Pillars.astro';
import Solutions from '../components/Solutions.astro';
import ClientResults from '../components/ClientResults.astro';
import BlogSeries from '../components/BlogSeries.astro';
import AiRadar from '../components/AiRadar.astro';
import MaturityRef from '../components/MaturityRef.astro';
import Faq from '../components/Faq.astro';
import CtaSection from '../components/CtaSection.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
---
<Layout title="Visdom by VirtusLab - How We Build Agent-Ready SDLC with Enterprise Teams">
  <Nav />
  <main>
    <Hero />
    <PipelineTour />
    <Pillars />
    <Solutions />
    <ClientResults />
    <BlogSeries />
    <AiRadar />
    <MaturityRef />
    <Faq />
    <CtaSection />
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 3: Renumber Pillars label**

In `src/components/Pillars.astro` line 23, change `§ 01 · The Diagnosis` to `§ 02 · The Diagnosis`:

```astro
      <p class="section-label">§ 02 · The Diagnosis</p>
```

- [ ] **Step 4: Build to verify nothing broke**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Visual smoke check**

Run: `npm run dev`
Open: `http://localhost:4321/visdom-main-page/`
Verify:
- A new section appears between Hero and "The Diagnosis"
- Section title "One commit. Five stations. Machine speed." visible
- Five station cards visible in a row, each with title/sub/badge
- A horizontal line spans the card; a small `feat: pricing rule  ✓ ctx ✓ dev …` token sits at the left
- "The Diagnosis" now reads `§ 02`

Layout will be rough — that's fine. We're verifying the skeleton lands and renders.

- [ ] **Step 6: Commit**

```bash
git add src/components/PipelineTour.astro src/pages/index.astro src/components/Pillars.astro
git commit -m "feat: add Pipeline Tour skeleton between Hero and Pillars"
```

---

## Task 2: Polish the static layout to match fabric-diagram language

**Files:**
- Modify: `src/components/PipelineTour.astro` (CSS only)

Goal: get the static state looking like the ASCII mock — clean fabric-diagram-style card, proper spacing, station hover-quality polish, token positioned correctly under the wire.

- [ ] **Step 1: Tighten the stage container and add an outer mono caption**

In `src/components/PipelineTour.astro`, locate `.pt-stage` and add a wrapper hint above the stations. Replace the markup inside `.pt-figure` to add a label row:

```astro
    <figure class="pt-figure fade-up" aria-hidden="true">
      <div class="pt-stage">
        <p class="pt-stage-label">Pipeline</p>
        <div class="pt-stations">
          {stations.map((s, i) => (
            <div class="pt-station" data-step={i + 1} id={`pt-station-${s.id}`}>
              <p class="pt-station-label">{s.title}</p>
              <p class="pt-station-sub">{s.sub}</p>
              <span class="pt-station-badge">{s.badge}</span>
            </div>
          ))}
        </div>

        <svg class="pt-wire" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
          <path id="pt-path" d="M 50 40 L 950 40" />
        </svg>

        <div class="pt-token">
          <span class="pt-token-label">feat: pricing rule</span>
          {stations.map((s, i) => (
            <span class="pt-stamp" data-step={i + 1}>{s.stamp}</span>
          ))}
        </div>
      </div>

      <figcaption class="sr-only">
        Visdom pipeline: a code change moves through Context Fabric, development, code review, testing, and machine-speed CI.
      </figcaption>
    </figure>
```

- [ ] **Step 2: Replace the styles inside `<style>` with the polished version**

Replace the entire existing `<style>` block with:

```html
<style>
  .pipeline-tour { padding-top: 3rem; padding-bottom: 3rem; }
  .pt-head { max-width: 48rem; margin-bottom: 1.75rem; }

  .pt-figure { margin: 0; }

  .pt-stage {
    position: relative;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 18px 22px 92px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04);
  }

  .pt-stage-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin: 0 0 14px;
  }

  .pt-stations {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 14px;
  }

  .pt-station {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px;
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    background: var(--color-surface);
    position: relative;
    opacity: 0.6;
    transition: none;
  }
  .pt-station::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 12px 0 0 12px;
    background: rgba(16, 185, 129, 0);
    transition: none;
  }
  .pt-station-label {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
  }
  .pt-station-sub {
    font-size: 0.78rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.4;
    min-height: 2.2em;
  }
  .pt-station-badge {
    margin-top: 6px;
    align-self: flex-start;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--color-text-muted);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    padding: 3px 8px;
    opacity: 0;
  }

  .pt-wire {
    position: absolute;
    left: 22px;
    right: 22px;
    bottom: 56px;
    height: 28px;
    width: calc(100% - 44px);
  }
  .pt-wire path {
    stroke: rgba(16, 185, 129, 0.45);
    stroke-width: 1.25;
    fill: none;
  }

  .pt-token {
    position: absolute;
    left: 22px;
    bottom: 38px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid var(--color-border);
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-text);
    white-space: nowrap;
    will-change: offset-distance;
  }
  .pt-token-label { font-weight: 600; }
  .pt-stamp {
    color: var(--color-emerald-dark);
    font-size: 0.66rem;
    border-left: 1px solid var(--color-border-light);
    padding-left: 6px;
    opacity: 0;
  }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }
</style>
```

Notice the deliberate "off" defaults: stations dim (`opacity: 0.6`), badges hidden (`opacity: 0`), stamps hidden (`opacity: 0`). The animation in later tasks will reveal them.

- [ ] **Step 3: Build + visual check**

Run: `npm run build` then `npm run dev`.
Expected:
- Card rounded, white, soft border (matches fabric-diagram).
- "Pipeline" mono label top-left.
- Five station cards in equal columns, dimmed (60% opacity), badges invisible.
- Token at the very left, stamps not yet visible.
- Wire is a faint emerald line near the bottom of the card.

- [ ] **Step 4: Commit**

```bash
git add src/components/PipelineTour.astro
git commit -m "style: polish Pipeline Tour static layout to match fabric-diagram"
```

---

## Task 3: Animate the token along the wire

**Files:**
- Modify: `src/components/PipelineTour.astro` (CSS + one prop change on `.pt-token`)

Goal: token rides left → right over 7s, then holds 1s and resets. Fully responsive — no fixed-pixel travel distance. Uses CSS container queries on `.pt-stage` so the token's translation is measured from the stage's own width.

- [ ] **Step 1: Adjust `.pt-token` baseline so it can be translated**

In `src/components/PipelineTour.astro`, find the existing `.pt-token` rule (added in Task 2) and update it. We need to:
- keep `left: 22px` as the start position,
- remove any `right` constraint,
- give it `width: max-content` so transforms work against intrinsic width.

Replace the existing `.pt-token` block with:

```css
  .pt-token {
    position: absolute;
    left: 22px;
    bottom: 38px;
    width: max-content;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid var(--color-border);
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-text);
    white-space: nowrap;
    will-change: transform;
  }
```

- [ ] **Step 2: Make `.pt-stage` an inline-size container**

Find the existing `.pt-stage` rule and add `container-type: inline-size;` to it:

```css
  .pt-stage {
    position: relative;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 18px 22px 92px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04);
    container-type: inline-size;
  }
```

`container-type: inline-size` lets descendants use `100cqw` to mean "100% of this stage's inline size". Widely supported across modern browsers.

- [ ] **Step 3: Add the cycle variable and token keyframes**

Append at the end of the `<style>` block (just before `</style>`):

```css
  /* === Animation === */

  :root { --pt-cycle: 8s; }

  .pt-token {
    animation: pt-token-travel var(--pt-cycle) cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }

  @keyframes pt-token-travel {
    0%    { transform: translateX(0); }
    87.5% { transform: translateX(calc(100cqw - 100% - 44px)); }
    100%  { transform: translateX(calc(100cqw - 100% - 44px)); }
  }
```

How the math works: the token starts at `left: 22px`. Its end position should leave 22px of breathing room on the right. The translation needed is `stage_width - token_width - 44px` (44 = 22+22 paddings). In CSS: `100cqw` = stage width, `100%` (inside `transform: translateX`) = the token's own width.

`87.5%` of an 8s cycle = 7s (when the token reaches the right edge); 87.5%→100% holds the end state for the final 1s before looping.

- [ ] **Step 4: Build + visual check**

Run: `npm run build` then `npm run dev`.
Expected:
- Token at left at t=0.
- Over ~7 seconds, token slides smoothly from left to right of the card, ending with its right edge ~22px from the card's right edge.
- ~1 second hold at the end, then snap back to left and repeat.
- Token does not overflow the card on narrow or wide viewports.

If the token overshoots/undershoots, adjust the `44px` padding constant in the keyframe.

- [ ] **Step 5: Commit**

```bash
git add src/components/PipelineTour.astro
git commit -m "feat: animate Pipeline Tour token along the wire"
```

---

## Task 4: Stagger the station active states across the loop

**Files:**
- Modify: `src/components/PipelineTour.astro` (CSS only)

Goal: as the token reaches each station, the station's badge fades in, the station goes to full opacity with an emerald accent stripe, and stays "done" until the loop resets.

Timing reference (8s cycle, token at 0% start, 87.5% finish):
- Station 1 lights at ~17.5% (1.4s)
- Station 2 lights at ~35% (2.8s)
- Station 3 lights at ~52.5% (4.2s)
- Station 4 lights at ~70% (5.6s)
- Station 5 lights at ~87.5% (7s)
- All hold until 100%, then reset.

- [ ] **Step 1: Add per-station keyframes for opacity + accent stripe**

Append to the `<style>` block:

```css
  /* Station "light up" animation — runs for the full cycle so we control
     state at every keyframe. Each station gets a different `animation-delay:
     0s` but a different timeline by using a different keyframes set. */

  .pt-station { animation: var(--pt-cycle) linear infinite; }

  .pt-station[data-step="1"] { animation-name: pt-light-1; }
  .pt-station[data-step="2"] { animation-name: pt-light-2; }
  .pt-station[data-step="3"] { animation-name: pt-light-3; }
  .pt-station[data-step="4"] { animation-name: pt-light-4; }
  .pt-station[data-step="5"] { animation-name: pt-light-5; }

  .pt-station-badge { animation: var(--pt-cycle) linear infinite; }

  .pt-station[data-step="1"] .pt-station-badge { animation-name: pt-badge-1; }
  .pt-station[data-step="2"] .pt-station-badge { animation-name: pt-badge-2; }
  .pt-station[data-step="3"] .pt-station-badge { animation-name: pt-badge-3; }
  .pt-station[data-step="4"] .pt-station-badge { animation-name: pt-badge-4; }
  .pt-station[data-step="5"] .pt-station-badge { animation-name: pt-badge-5; }

  /* Station keyframes: dim → light at its trigger time → hold until cycle end → reset. */

  @keyframes pt-light-1 {
    0%, 16% { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); }
    18%     { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
    100%    { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
  }
  @keyframes pt-light-2 {
    0%, 33% { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); }
    35%     { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
    100%    { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
  }
  @keyframes pt-light-3 {
    0%, 50% { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); }
    52%     { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
    100%    { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
  }
  @keyframes pt-light-4 {
    0%, 68% { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); }
    70%     { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
    100%    { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
  }
  @keyframes pt-light-5 {
    0%, 85% { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); }
    87%     { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
    100%    { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); }
  }

  /* Badge keyframes: hidden → fade in at station's trigger → hold. */

  @keyframes pt-badge-1 {
    0%, 16%  { opacity: 0; }
    20%, 100%{ opacity: 1; }
  }
  @keyframes pt-badge-2 {
    0%, 33%  { opacity: 0; }
    37%, 100%{ opacity: 1; }
  }
  @keyframes pt-badge-3 {
    0%, 50%  { opacity: 0; }
    54%, 100%{ opacity: 1; }
  }
  @keyframes pt-badge-4 {
    0%, 68%  { opacity: 0; }
    72%, 100%{ opacity: 1; }
  }
  @keyframes pt-badge-5 {
    0%, 85%  { opacity: 0; }
    89%, 100%{ opacity: 1; }
  }
```

- [ ] **Step 2: Build + visual check**

Run: `npm run build` then `npm run dev`.
Expected:
- All stations start dim, no badges visible, token at left.
- ~1.4s in, station 1 lights up + its badge appears as the token reaches it.
- Each subsequent station lights at the right moment as the token passes underneath it.
- All five stations stay lit through the end of the loop.
- On loop restart (~8s mark), all stations snap back to dim and the cycle repeats cleanly.

If a station lights too early or late relative to the token, nudge the keyframe percentage by ±2.

- [ ] **Step 3: Commit**

```bash
git add src/components/PipelineTour.astro
git commit -m "feat: stagger station light-up across Pipeline Tour cycle"
```

---

## Task 5: Reveal stamps on the token at each station hit

**Files:**
- Modify: `src/components/PipelineTour.astro` (CSS only)

Goal: each `✓ ctx`, `✓ dev`, etc. fades in on the token at the moment the corresponding station activates.

- [ ] **Step 1: Add stamp keyframes**

Append to the `<style>` block:

```css
  .pt-stamp { animation: var(--pt-cycle) linear infinite; }

  .pt-stamp[data-step="1"] { animation-name: pt-stamp-1; }
  .pt-stamp[data-step="2"] { animation-name: pt-stamp-2; }
  .pt-stamp[data-step="3"] { animation-name: pt-stamp-3; }
  .pt-stamp[data-step="4"] { animation-name: pt-stamp-4; }
  .pt-stamp[data-step="5"] { animation-name: pt-stamp-5; }

  @keyframes pt-stamp-1 { 0%, 17% { opacity: 0; } 21%, 100% { opacity: 1; } }
  @keyframes pt-stamp-2 { 0%, 34% { opacity: 0; } 38%, 100% { opacity: 1; } }
  @keyframes pt-stamp-3 { 0%, 51% { opacity: 0; } 55%, 100% { opacity: 1; } }
  @keyframes pt-stamp-4 { 0%, 69% { opacity: 0; } 73%, 100% { opacity: 1; } }
  @keyframes pt-stamp-5 { 0%, 86% { opacity: 0; } 90%, 100% { opacity: 1; } }
```

- [ ] **Step 2: Build + visual check**

Run: `npm run build` then `npm run dev`.
Expected:
- Token starts with only `feat: pricing rule` visible.
- At each station hit, a new green stamp fades in on the token: `✓ ctx`, then `✓ dev`, then `✓ review`, then `✓ tests`, then `✓ shipped`.
- All five stamps visible by t=7s, hold until the cycle resets.

- [ ] **Step 3: Commit**

```bash
git add src/components/PipelineTour.astro
git commit -m "feat: reveal commit stamps on Pipeline Tour token at each station"
```

---

## Task 6: Mobile vertical layout

**Files:**
- Modify: `src/components/PipelineTour.astro` (CSS only)

Goal: below 900px the pipeline turns vertical: stations stack top→bottom, the token travels down a vertical wire, same animation timing.

- [ ] **Step 1: Add `@media (max-width: 900px)` block**

On mobile we hide the SVG wire and draw the vertical wire with a CSS pseudo-element on `.pt-stage`. The token translates along Y. We switch the stage to `container-type: size` so `100cqh` resolves.

Append to the `<style>` block, before the closing `</style>`:

```css
  @media (max-width: 900px) {
    .pt-stage {
      padding: 18px 18px 22px 56px;
      container-type: size;
    }

    .pt-stations {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    /* Hide the desktop SVG wire; replace with a CSS-drawn vertical line. */
    .pt-wire { display: none; }
    .pt-stage::before {
      content: '';
      position: absolute;
      left: 32px;
      top: 56px;
      bottom: 24px;
      width: 1px;
      background: rgba(16, 185, 129, 0.45);
    }

    .pt-token {
      left: 14px;
      right: auto;
      bottom: auto;
      top: 56px;
    }

    @keyframes pt-token-travel {
      0%    { transform: translateY(0); }
      87.5% { transform: translateY(calc(100cqh - 80px)); }
      100%  { transform: translateY(calc(100cqh - 80px)); }
    }
  }
```

`100cqh` resolves against the stage's measured height (because of `container-type: size`). The `80px` constant accounts for top inset (56px) + bottom safety (24px). Tune in step 2 if the token over- or under-shoots.

- [ ] **Step 2: Build + visual check**

Run: `npm run build` then `npm run dev`.
Open dev tools, switch to mobile viewport (e.g. 390×844).
Expected:
- Stations stack vertically, full width of the card minus left rail.
- A vertical wire runs along the left side of the card.
- Token starts at the top, travels down the wire, lighting each station as it passes.
- Total cycle still ~8 seconds.

If the token doesn't reach the last station, adjust the `100px` constant in `translateY`.

- [ ] **Step 3: Commit**

```bash
git add src/components/PipelineTour.astro
git commit -m "feat: vertical mobile layout for Pipeline Tour"
```

---

## Task 7: Accessibility — reduced motion, pause on hover/focus

**Files:**
- Modify: `src/components/PipelineTour.astro` (CSS only)

Goal: respect `prefers-reduced-motion`, pause everything on hover or keyboard focus inside the section.

- [ ] **Step 1: Add reduced-motion + pause rules**

Append to the `<style>` block before `</style>`:

```css
  /* Pause the entire tour when the user hovers the section or focuses
     a child element via keyboard. Saves the cycle position. */
  .pt-figure:hover .pt-token,
  .pt-figure:hover .pt-station,
  .pt-figure:hover .pt-station-badge,
  .pt-figure:hover .pt-stamp,
  .pt-figure:focus-within .pt-token,
  .pt-figure:focus-within .pt-station,
  .pt-figure:focus-within .pt-station-badge,
  .pt-figure:focus-within .pt-stamp {
    animation-play-state: paused;
  }

  /* Reduced motion: render the static "done" end state — no animation. */
  @media (prefers-reduced-motion: reduce) {
    .pt-token,
    .pt-station,
    .pt-station-badge,
    .pt-stamp {
      animation: none !important;
    }

    .pt-token {
      transform: translateX(calc(100cqw - 100% - 44px));
    }

    .pt-station {
      opacity: 1;
      box-shadow: 0 4px 18px rgba(16,185,129,0.12);
      border-color: rgba(16,185,129,0.45);
    }

    .pt-station-badge,
    .pt-stamp {
      opacity: 1;
    }
  }
```

- [ ] **Step 2: Verify pause-on-hover**

Run: `npm run dev`. Open the page, watch the animation, hover the card. Expected: animation freezes mid-cycle. Move mouse away → resumes.

- [ ] **Step 3: Verify reduced motion**

In Chrome DevTools: open Command Menu (Cmd+Shift+P) → "Show Rendering" → set "Emulate CSS media feature prefers-reduced-motion" to `reduce`. Reload.
Expected: token sits at the right edge with all stamps visible, all five stations active, no motion at all.

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add src/components/PipelineTour.astro
git commit -m "a11y: reduced-motion + pause-on-hover for Pipeline Tour"
```

---

## Task 8: Final review — visual polish pass and full-page smoke

**Files:**
- Modify: `src/components/PipelineTour.astro` (only if the visual review surfaces issues)

- [ ] **Step 1: Full-page review at desktop width**

Run: `npm run dev`. Open `http://localhost:4321/visdom-main-page/`.
Walk through:
- [ ] Hero loads as before.
- [ ] Pipeline Tour appears immediately below Hero, with `§ 01 · How a change flows` label.
- [ ] Cycle plays cleanly, loops without jank.
- [ ] Token never overflows the card.
- [ ] Stations light at the right time relative to the token.
- [ ] Pillars now reads `§ 02 · The Diagnosis`.
- [ ] Rest of page (Solutions, ClientResults, BlogSeries, AiRadar, MaturityRef, Faq, CtaSection, Footer) unchanged.

- [ ] **Step 2: Mobile review (DevTools, 390×844)**

- [ ] Stations stack vertically, full width.
- [ ] Token travels down, animation runs cleanly.
- [ ] No horizontal scroll on the page.

- [ ] **Step 3: Reduced-motion review (DevTools rendering panel)**

- [ ] No animation runs.
- [ ] All five stations visible as "done" with badges.
- [ ] Token at far right with all stamps.

- [ ] **Step 4: Final build**

Run: `npm run build`.
Expected: clean build, no errors, no new warnings.

- [ ] **Step 5: Fix any issues surfaced by reviews**

If anything looks off, tweak the relevant CSS (timing, padding, color values), rebuild, recheck. Each fix is a small commit:

```bash
git add src/components/PipelineTour.astro
git commit -m "fix: <describe the polish>"
```

- [ ] **Step 6: Final commit (if no fixes needed) — already shipped**

If the review pass needed no changes, this task closes itself. The feature is shipped at task 7's commit.

---

## Self-Review Checklist

After implementation, verify against the spec:

- [ ] Section sits between Hero and Pillars (`src/pages/index.astro` order).
- [ ] Visual language inherits from `fabric-diagram` — no new design primitives.
- [ ] 8-second loop with the timeline from the spec.
- [ ] All five stations + badges + stamps match the spec table verbatim.
- [ ] `prefers-reduced-motion: reduce` → fully static end state.
- [ ] Pause on hover and focus.
- [ ] Pure CSS — no `<script>` block in `PipelineTour.astro`.
- [ ] `§ 01` and `§ 02` labels are correct across the page.
