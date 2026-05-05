# Visdom Pipeline Tour v2 — Flashy Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Take the shipped Pipeline Tour (commit `1cc8756`) from "elegant" to "elegant-and-alive". Four buckets of upgrades:

- **D — Structural:** Wire connects stations (vertical-center, port-to-port) instead of running decoratively under them. Add icons inside stations.
- **A — Energy through the wire:** Active emerald trail traces token progress; token has soft pulsing halo; spark bursts at each station port on contact.
- **B — Cinematic station hits:** Station card scale-pulse on activation; badge slides up + fades in; stamp pops onto token (scale 0.7 → 1.05 → 1).
- **C — Final merge moment:** Destination dot ("→ prod") past station 5 lights up at end of cycle; the whole stage gets a single emerald glow pulse.

**Tech Stack:** Astro 6, scoped CSS, inline SVG. Pure CSS animation only — no JS.

**Predecessor:** v1 implementation across commits `fe86b82..1cc8756`. Spec: `docs/superpowers/specs/2026-05-05-pipeline-tour-design.md`. v1 plan: `docs/superpowers/plans/2026-05-05-pipeline-tour.md`. v2 directions agreed in conversation 2026-05-05.

**Verification:** No tests in repo. Each task verifies via `npm run build` + commit. Final task does end-to-end visual check + deploy.

---

## Task 9: Structural — wire connects stations, add icons

**Files:** Modify `src/components/PipelineTour.astro`.

Goal: move the wire from "decorative line under all cards" to "spine that connects stations". The wire runs at the **vertical-center** of the stations row. Each station has small emerald **ports** (left and right) that sit on the wire. The token rides the wire AT vertical-center (z-index above stations so it's visible passing through). Each station gets a small **icon** at top.

- [ ] **Step 1: Add icon SVGs to the `stations` frontmatter**

Open `src/components/PipelineTour.astro`. Replace the `stations` array in the frontmatter with this version that adds an `icon` (an inline SVG path string for a 16×16 viewBox, stroke-only, drawn with `currentColor`):

```astro
---
const stations = [
  {
    id: 'context',
    title: 'Context Fabric',
    sub: 'Agents read the ground truth',
    badge: 'blast radius: 12 files',
    stamp: '✓ ctx',
    // Layered fabric / database
    icon: '<path d="M2 4 h12 M2 8 h12 M2 12 h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  },
  {
    id: 'dev',
    title: 'Development',
    sub: 'Agent + engineer co-author',
    badge: '+47 −12',
    stamp: '✓ dev',
    // Code brackets <>
    icon: '<path d="M6 4 L2 8 L6 12 M10 4 L14 8 L10 12" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'review',
    title: 'Code Review',
    sub: 'VCR pre-reviews in CI',
    badge: '0 critical · $0.10',
    stamp: '✓ review',
    // Eye
    icon: '<path d="M1 8 C 4 3, 12 3, 15 8 C 12 13, 4 13, 1 8 Z" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4" fill="none"/>',
  },
  {
    id: 'tests',
    title: 'Testing',
    sub: 'Architecture · property · mutation',
    badge: '73% mutation',
    stamp: '✓ tests',
    // Flask
    icon: '<path d="M6 2 v4 L3 13 a1.5 1.5 0 0 0 1.4 2 h7.2 A1.5 1.5 0 0 0 13 13 L10 6 V2 M5 2 h6" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'ci',
    title: 'Machine CI',
    sub: 'Pipeline at agent speed',
    badge: '5m vs 45m',
    stamp: '✓ shipped',
    // Lightning bolt
    icon: '<path d="M9 1 L3 9 h4 L7 15 l6-8 h-4 z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
  },
];
---
```

- [ ] **Step 2: Update station markup to render icons + ports**

Find the `{stations.map((s, i) => ( ... ))}` block inside `.pt-stations`. Replace each station's contents to add an icon row at the top and two port elements (left and right):

```astro
          {stations.map((s, i) => (
            <div class="pt-station" data-step={i + 1} id={`pt-station-${s.id}`}>
              <span class="pt-port pt-port--left" aria-hidden="true"></span>
              <span class="pt-port pt-port--right" aria-hidden="true"></span>
              <div class="pt-station-head">
                <span class="pt-station-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" set:html={s.icon}></svg>
                </span>
                <p class="pt-station-label">{s.title}</p>
              </div>
              <p class="pt-station-sub">{s.sub}</p>
              <span class="pt-station-badge">{s.badge}</span>
            </div>
          ))}
```

(Note: `set:html` is Astro's idiom for unescaped HTML. The icon strings are author-controlled, not user input — safe.)

- [ ] **Step 3: Restructure the `<style>` block: wire to vertical-center, add ports, icons, gap, token reposition**

Inside the existing `<style>` block, modify these specific rules (do not touch animation keyframes added in earlier tasks unless explicitly noted):

(a) `.pt-stations` — bigger gap so the wire has visible "between-station" segments:

```css
  .pt-stations {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 26px;
  }
```

(b) `.pt-stage` padding — the wire now lives at vertical-center, so we don't need the big bottom padding for the token. Tighten:

```css
  .pt-stage {
    position: relative;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 18px 22px 22px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04);
    container-type: inline-size;
  }
```

(c) `.pt-station` — `overflow: visible` so ports show outside; bump `min-height` so cards have consistent height for the wire to traverse:

```css
  .pt-station {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px;
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    background: var(--color-surface);
    position: relative;
    overflow: visible;
    opacity: 0.6;
    transition: none;
    min-height: 132px;
  }
```

(d) Add new rules — station head row, icon, ports:

```css
  .pt-station-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
  }

  .pt-station-icon {
    width: 18px;
    height: 18px;
    color: var(--color-emerald-dark);
    flex-shrink: 0;
    display: inline-flex;
  }
  .pt-station-icon svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .pt-port {
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-bg);
    border: 1.5px solid rgba(16, 185, 129, 0.45);
    transform: translateY(-50%);
    z-index: 2;
    transition: none;
  }
  .pt-port--left { left: -17px; }
  .pt-port--right { right: -17px; }
```

(The `-17px` aligns the port roughly into the middle of the 26px gap between cards.)

(e) `.pt-wire` — move from bottom to vertical-center, span the full row, reduce top/bottom area:

```css
  .pt-wire {
    position: absolute;
    left: 22px;
    right: 22px;
    top: calc(18px + 66px); /* stage top padding + half of station min-height */
    transform: translateY(-50%);
    height: 4px;
    width: calc(100% - 44px);
    pointer-events: none;
  }
  .pt-wire path {
    stroke: rgba(16, 185, 129, 0.45);
    stroke-width: 1.5;
    fill: none;
  }
```

(f) `.pt-token` — repositioned to vertical-center; rides the wire at the same Y. Token z-index above stations so it stays visible passing through cards:

```css
  .pt-token {
    position: absolute;
    left: 22px;
    top: calc(18px + 66px);
    transform: translate(0, -50%);
    width: max-content;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-text);
    white-space: nowrap;
    will-change: transform;
    z-index: 3;
  }
```

(g) The old `pt-token-travel` keyframes (in Task 3) used `translateX(...)`. They now need to compose with the static `translate(0, -50%)`. Replace the keyframe block:

```css
  @keyframes pt-token-travel {
    0%    { transform: translate(0, -50%); }
    87.5% { transform: translate(calc(100cqw - 100% - 44px), -50%); }
    100%  { transform: translate(calc(100cqw - 100% - 44px), -50%); }
  }
```

(h) Reduced-motion translateX → translate composing with -50%:

In the `@media (prefers-reduced-motion: reduce)` block, change:

```css
    .pt-token {
      transform: translateX(calc(100cqw - 100% - 44px));
    }
```

to:

```css
    .pt-token {
      transform: translate(calc(100cqw - 100% - 44px), -50%);
    }
```

And inside the nested mobile reduced-motion block, change:

```css
      .pt-token {
        transform: translateY(calc(100cqh - 80px));
      }
```

to:

```css
      .pt-token {
        transform: translate(0, calc(100cqh - 80px));
      }
```

(i) Mobile `@media (max-width: 900px)` block — adjust ports to be top/bottom (vertical wire), reposition token, redo wire position:

Find the mobile media query and replace it with:

```css
  @media (max-width: 900px) {
    .pt-stage {
      padding: 18px 18px 22px 56px;
      container-type: size;
    }

    .pt-stations {
      grid-template-columns: 1fr;
      gap: 22px;
    }

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

    .pt-port--left, .pt-port--right { display: none; }

    .pt-token {
      left: 14px;
      top: 56px;
      right: auto;
      bottom: auto;
      transform: translate(0, 0);
    }

    @keyframes pt-token-travel {
      0%    { transform: translate(0, 0); }
      87.5% { transform: translate(0, calc(100cqh - 80px)); }
      100%  { transform: translate(0, calc(100cqh - 80px)); }
    }
  }
```

- [ ] **Step 4: Build**

Run: `npm run build` → must succeed.

- [ ] **Step 5: Commit**

```bash
git add src/components/PipelineTour.astro
git commit -m "feat(tour): wire connects stations, add icons + ports"
```

---

## Task 10: Energy through the wire — active fill, token halo, sparks

**Files:** Modify `src/components/PipelineTour.astro`.

Goal: make the wire feel *alive*. Three effects:
- **Active wire fill:** a saturated emerald overlay path that visually fills from left to the token's position over the cycle (animated `stroke-dashoffset`).
- **Token halo:** the token has a soft pulsing emerald glow (box-shadow) cycling 1s.
- **Spark at each port:** ports flash brighter (scale + glow) at the moment the token reaches them.

- [ ] **Step 1: Add a second SVG `<path>` inside `.pt-wire` for the active trail**

In the markup, find the existing `<svg class="pt-wire">` block and replace it with:

```astro
        <svg class="pt-wire" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true">
          <path id="pt-path" d="M 0 2 L 1000 2" />
          <path id="pt-path-active" d="M 0 2 L 1000 2" />
        </svg>
```

(`viewBox` shrunk to `1000 4` since the wire is now thin.)

- [ ] **Step 2: Style the active path with stroke-dasharray animation**

Append to the `<style>` block:

```css
  .pt-wire #pt-path-active {
    stroke: rgba(16, 185, 129, 0.95);
    stroke-width: 2;
    fill: none;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: pt-wire-fill var(--pt-cycle) cubic-bezier(0.65, 0, 0.35, 1) infinite;
    filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.55));
  }

  @keyframes pt-wire-fill {
    0%    { stroke-dashoffset: 1000; }
    87.5% { stroke-dashoffset: 0; }
    100%  { stroke-dashoffset: 0; }
  }
```

(The `viewBox` is 1000 wide; `stroke-dasharray: 1000` matches the path length, and offset goes from full-hidden to full-visible across the same 87.5% schedule as the token.)

- [ ] **Step 3: Token halo — pulsing emerald glow**

Append:

```css
  .pt-token {
    /* Existing animation declared in earlier task; we add a second one. */
    animation:
      pt-token-travel var(--pt-cycle) cubic-bezier(0.65, 0, 0.35, 1) infinite,
      pt-token-halo 1.6s ease-in-out infinite;
  }

  @keyframes pt-token-halo {
    0%, 100% { box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 0 rgba(16, 185, 129, 0.0); }
    50%      { box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 14px 2px rgba(16, 185, 129, 0.45); }
  }
```

The earlier `.pt-token { animation: pt-token-travel ... }` declaration at the bottom of the style block becomes redundant — find it and delete it (the new combined `animation:` shorthand here replaces it). To keep the diff clean: search for the existing line `animation: pt-token-travel var(--pt-cycle) cubic-bezier(0.65, 0, 0.35, 1) infinite;` (inside `.pt-token { ... }` further up — where Task 3 added it) and remove just that one line. The new combined animation block above takes precedence.

- [ ] **Step 4: Spark on ports at activation**

Append:

```css
  .pt-port { animation: var(--pt-cycle) linear infinite; }

  .pt-station[data-step="1"] .pt-port--left  { animation-name: pt-spark-1; }
  .pt-station[data-step="1"] .pt-port--right { animation-name: pt-spark-1b; }
  .pt-station[data-step="2"] .pt-port--left  { animation-name: pt-spark-2; }
  .pt-station[data-step="2"] .pt-port--right { animation-name: pt-spark-2b; }
  .pt-station[data-step="3"] .pt-port--left  { animation-name: pt-spark-3; }
  .pt-station[data-step="3"] .pt-port--right { animation-name: pt-spark-3b; }
  .pt-station[data-step="4"] .pt-port--left  { animation-name: pt-spark-4; }
  .pt-station[data-step="4"] .pt-port--right { animation-name: pt-spark-4b; }
  .pt-station[data-step="5"] .pt-port--left  { animation-name: pt-spark-5; }
  .pt-station[data-step="5"] .pt-port--right { animation-name: pt-spark-5b; }

  /* Spark macro: dim → flash at port entry → settle bright. */
  @keyframes pt-spark-1   { 0%, 16% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            18%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            22%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 6px 1px rgba(16,185,129,0.4); transform: translateY(-50%) scale(1); }
                            22.01%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
  @keyframes pt-spark-1b  { 0%, 19% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            21%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            25%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
  @keyframes pt-spark-2   { 0%, 33% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            35%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            39%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
  @keyframes pt-spark-2b  { 0%, 36% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            38%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            42%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
  @keyframes pt-spark-3   { 0%, 50% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            52%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            56%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
  @keyframes pt-spark-3b  { 0%, 53% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            55%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            59%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
  @keyframes pt-spark-4   { 0%, 68% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            70%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            74%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
  @keyframes pt-spark-4b  { 0%, 71% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            73%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            77%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
  @keyframes pt-spark-5   { 0%, 85% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            87%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            91%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
  @keyframes pt-spark-5b  { 0%, 88% { background: var(--color-bg); border-color: rgba(16,185,129,0.45); box-shadow: none; transform: translateY(-50%) scale(1); }
                            90%     { background: rgb(16,185,129);  border-color: rgb(16,185,129);     box-shadow: 0 0 12px 4px rgba(16,185,129,0.6); transform: translateY(-50%) scale(1.6); }
                            94%, 100% { background: rgb(16,185,129); border-color: rgb(16,185,129); box-shadow: 0 0 4px 0 rgba(16,185,129,0.3); transform: translateY(-50%) scale(1); } }
```

- [ ] **Step 5: Add ports/active-wire to the pause-on-hover and reduced-motion rules**

Find the existing pause-on-hover rule and the reduced-motion `@media` block. Add the `.pt-port` and `#pt-path-active` selectors so they pause/stop too.

In the pause block, replace it with:

```css
  .pt-figure:hover .pt-token,
  .pt-figure:hover .pt-station,
  .pt-figure:hover .pt-station-badge,
  .pt-figure:hover .pt-stamp,
  .pt-figure:hover .pt-port,
  .pt-figure:hover #pt-path-active,
  .pt-figure:focus-within .pt-token,
  .pt-figure:focus-within .pt-station,
  .pt-figure:focus-within .pt-station-badge,
  .pt-figure:focus-within .pt-stamp,
  .pt-figure:focus-within .pt-port,
  .pt-figure:focus-within #pt-path-active {
    animation-play-state: paused;
  }
```

In the reduced-motion media block, find:

```css
    .pt-token,
    .pt-station,
    .pt-station-badge,
    .pt-stamp {
      animation: none !important;
    }
```

Replace with:

```css
    .pt-token,
    .pt-station,
    .pt-station-badge,
    .pt-stamp,
    .pt-port,
    #pt-path-active {
      animation: none !important;
    }

    #pt-path-active {
      stroke-dashoffset: 0;
    }

    .pt-port {
      background: rgb(16, 185, 129);
      border-color: rgb(16, 185, 129);
    }
```

- [ ] **Step 6: Build + commit**

```bash
npm run build
git add src/components/PipelineTour.astro
git commit -m "feat(tour): active wire fill, token halo, port sparks"
```

---

## Task 11: Cinematic station hits — pulse, badge slide, stamp pop

**Files:** Modify `src/components/PipelineTour.astro`.

Goal: when a station activates, give it more *impact*:
- Station card briefly scales 1 → 1.04 → 1 (~250ms).
- Badge slides up (`translateY(8px)`) and fades in.
- Stamp on token "pops" into place: scale 0.7 → 1.05 → 1.

We do this by adding `transform`/`scale` to the existing `pt-light-N` keyframes and rewriting `pt-badge-N` and `pt-stamp-N` keyframes to compose `transform` with opacity.

- [ ] **Step 1: Update `pt-light-1..5` to add a scale pulse**

Find the 5 `@keyframes pt-light-N` blocks. Replace each with the version below — the dim segment now sets `transform: scale(1)`, and the activation moment adds a brief pulse (`scale(1.04)` at trigger, then back to `scale(1)` 2% later).

`pt-light-1` (replace existing):
```css
  @keyframes pt-light-1 {
    0%, 16%   { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); transform: scale(1); }
    18%       { opacity: 1.0; box-shadow: 0 6px 22px rgba(16,185,129,0.18); border-color: rgba(16,185,129,0.55); transform: scale(1.04); }
    22%       { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
    100%      { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
  }
```

`pt-light-2`:
```css
  @keyframes pt-light-2 {
    0%, 33%   { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); transform: scale(1); }
    35%       { opacity: 1.0; box-shadow: 0 6px 22px rgba(16,185,129,0.18); border-color: rgba(16,185,129,0.55); transform: scale(1.04); }
    39%       { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
    100%      { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
  }
```

`pt-light-3`:
```css
  @keyframes pt-light-3 {
    0%, 50%   { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); transform: scale(1); }
    52%       { opacity: 1.0; box-shadow: 0 6px 22px rgba(16,185,129,0.18); border-color: rgba(16,185,129,0.55); transform: scale(1.04); }
    56%       { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
    100%      { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
  }
```

`pt-light-4`:
```css
  @keyframes pt-light-4 {
    0%, 68%   { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); transform: scale(1); }
    70%       { opacity: 1.0; box-shadow: 0 6px 22px rgba(16,185,129,0.18); border-color: rgba(16,185,129,0.55); transform: scale(1.04); }
    74%       { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
    100%      { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
  }
```

`pt-light-5`:
```css
  @keyframes pt-light-5 {
    0%, 85%   { opacity: 0.6; box-shadow: none; border-color: var(--color-border-light); transform: scale(1); }
    87%       { opacity: 1.0; box-shadow: 0 6px 22px rgba(16,185,129,0.18); border-color: rgba(16,185,129,0.55); transform: scale(1.04); }
    91%       { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
    100%      { opacity: 1.0; box-shadow: 0 4px 18px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.45); transform: scale(1); }
  }
```

- [ ] **Step 2: Replace `pt-badge-N` keyframes with slide-up + fade**

Replace all 5 badge keyframes:

```css
  @keyframes pt-badge-1 {
    0%, 16%   { opacity: 0; transform: translateY(8px); }
    21%, 100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes pt-badge-2 {
    0%, 33%   { opacity: 0; transform: translateY(8px); }
    38%, 100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes pt-badge-3 {
    0%, 50%   { opacity: 0; transform: translateY(8px); }
    55%, 100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes pt-badge-4 {
    0%, 68%   { opacity: 0; transform: translateY(8px); }
    73%, 100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes pt-badge-5 {
    0%, 85%   { opacity: 0; transform: translateY(8px); }
    90%, 100% { opacity: 1; transform: translateY(0); }
  }
```

- [ ] **Step 3: Replace `pt-stamp-N` keyframes with scale-pop**

Replace all 5 stamp keyframes:

```css
  @keyframes pt-stamp-1 {
    0%, 17%   { opacity: 0; transform: scale(0.7); }
    20%       { opacity: 1; transform: scale(1.15); }
    24%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes pt-stamp-2 {
    0%, 34%   { opacity: 0; transform: scale(0.7); }
    37%       { opacity: 1; transform: scale(1.15); }
    41%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes pt-stamp-3 {
    0%, 51%   { opacity: 0; transform: scale(0.7); }
    54%       { opacity: 1; transform: scale(1.15); }
    58%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes pt-stamp-4 {
    0%, 69%   { opacity: 0; transform: scale(0.7); }
    72%       { opacity: 1; transform: scale(1.15); }
    76%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes pt-stamp-5 {
    0%, 86%   { opacity: 0; transform: scale(0.7); }
    89%       { opacity: 1; transform: scale(1.15); }
    93%, 100% { opacity: 1; transform: scale(1); }
  }
```

- [ ] **Step 4: Add `transform-origin: center` baseline to `.pt-stamp` so scale-pop is centered**

Find the existing `.pt-stamp` rule and update it (only changes are `transform-origin` and removing the static `opacity: 0`, since the keyframes now control it):

```css
  .pt-stamp {
    color: var(--color-emerald-dark);
    font-size: 0.66rem;
    border-left: 1px solid var(--color-border-light);
    padding-left: 6px;
    opacity: 0;
    transform-origin: center;
    display: inline-flex;
    align-items: center;
  }
```

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add src/components/PipelineTour.astro
git commit -m "feat(tour): cinematic hits — station pulse, badge slide, stamp pop"
```

---

## Task 12: Final merge moment — destination dot + card pulse

**Files:** Modify `src/components/PipelineTour.astro`.

Goal: at end of cycle, the change has *arrived*. Add a small destination element after station 5 and pulse the whole card once.

- [ ] **Step 1: Add a destination element to the markup**

Inside `.pt-stage`, add this just AFTER the last `.pt-stations` closing tag and before the `<svg class="pt-wire">` element:

```astro
        <div class="pt-destination" aria-hidden="true">
          <span class="pt-destination-dot"></span>
          <span class="pt-destination-label">→ prod</span>
        </div>
```

- [ ] **Step 2: Style the destination + the card pulse**

Append to the `<style>` block:

```css
  .pt-destination {
    position: absolute;
    right: 6px;
    top: calc(18px + 66px);
    transform: translate(0, -50%);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px 4px 4px;
    border-radius: 999px;
    background: var(--color-bg);
    border: 1px solid rgba(16, 185, 129, 0.35);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-emerald-dark);
    z-index: 1;
    opacity: 0.45;
    animation: pt-destination var(--pt-cycle) ease-out infinite;
  }

  .pt-destination-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.35);
    box-shadow: none;
    transition: none;
  }

  @keyframes pt-destination {
    0%, 84%   { opacity: 0.45; }
    87%       { opacity: 1; }
    91%       { opacity: 1; }
    100%      { opacity: 1; }
  }

  .pt-destination-dot { animation: pt-destination-dot var(--pt-cycle) ease-out infinite; }

  @keyframes pt-destination-dot {
    0%, 84%   { background: rgba(16, 185, 129, 0.35); box-shadow: none; transform: scale(1); }
    87%       { background: rgb(16, 185, 129);        box-shadow: 0 0 14px 4px rgba(16,185,129,0.55); transform: scale(1.4); }
    93%       { background: rgb(16, 185, 129);        box-shadow: 0 0 6px 1px rgba(16,185,129,0.35); transform: scale(1); }
    100%      { background: rgb(16, 185, 129);        box-shadow: 0 0 6px 1px rgba(16,185,129,0.35); transform: scale(1); }
  }

  /* Whole-stage glow pulse at the end of the cycle. */
  .pt-stage { animation: pt-stage-pulse var(--pt-cycle) ease-out infinite; }

  @keyframes pt-stage-pulse {
    0%, 84%   { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04); }
    87%       { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04), 0 0 0 6px rgba(16,185,129,0.12), 0 0 28px 4px rgba(16,185,129,0.18); }
    93%       { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04); }
    100%      { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04); }
  }
```

- [ ] **Step 3: Reserve room for the destination on the right of station 5**

The destination floats absolutely on the right edge. To avoid the token overrunning into it, reduce the token's travel distance. Find the desktop `pt-token-travel` keyframes and update the `87.5%` and `100%` stops to leave 80px on the right:

Replace:
```css
  @keyframes pt-token-travel {
    0%    { transform: translate(0, -50%); }
    87.5% { transform: translate(calc(100cqw - 100% - 44px), -50%); }
    100%  { transform: translate(calc(100cqw - 100% - 44px), -50%); }
  }
```

with:

```css
  @keyframes pt-token-travel {
    0%    { transform: translate(0, -50%); }
    87.5% { transform: translate(calc(100cqw - 100% - 124px), -50%); }
    100%  { transform: translate(calc(100cqw - 100% - 124px), -50%); }
  }
```

(124px = 44px paddings + ~80px for the destination chip.)

Also update the reduced-motion override (find the desktop reduced-motion `.pt-token { transform: translate(...) }` rule):

```css
    .pt-token {
      transform: translate(calc(100cqw - 100% - 124px), -50%);
    }
```

- [ ] **Step 4: Add `.pt-destination` to pause-on-hover and reduced-motion**

In the pause block, append `.pt-destination` and `.pt-destination-dot` and `.pt-stage` to the pause selector list:

```css
  .pt-figure:hover .pt-token,
  .pt-figure:hover .pt-station,
  .pt-figure:hover .pt-station-badge,
  .pt-figure:hover .pt-stamp,
  .pt-figure:hover .pt-port,
  .pt-figure:hover #pt-path-active,
  .pt-figure:hover .pt-destination,
  .pt-figure:hover .pt-destination-dot,
  .pt-figure:hover .pt-stage,
  .pt-figure:focus-within .pt-token,
  .pt-figure:focus-within .pt-station,
  .pt-figure:focus-within .pt-station-badge,
  .pt-figure:focus-within .pt-stamp,
  .pt-figure:focus-within .pt-port,
  .pt-figure:focus-within #pt-path-active,
  .pt-figure:focus-within .pt-destination,
  .pt-figure:focus-within .pt-destination-dot,
  .pt-figure:focus-within .pt-stage {
    animation-play-state: paused;
  }
```

In the reduced-motion `@media` block, extend the `animation: none !important` selector list:

```css
    .pt-token,
    .pt-station,
    .pt-station-badge,
    .pt-stamp,
    .pt-port,
    #pt-path-active,
    .pt-destination,
    .pt-destination-dot,
    .pt-stage {
      animation: none !important;
    }

    .pt-destination { opacity: 1; }
    .pt-destination-dot {
      background: rgb(16, 185, 129);
      box-shadow: 0 0 6px 1px rgba(16,185,129,0.35);
    }
```

- [ ] **Step 5: Mobile — destination element placement**

In the `@media (max-width: 900px)` block, append:

```css
    .pt-destination {
      right: auto;
      left: 4px;
      top: auto;
      bottom: 8px;
      transform: translate(0, 0);
    }
```

(Mobile destination sits at the bottom of the vertical wire. Token's mobile travel still ends at the bottom — no further adjustment needed because mobile layout uses `display: none` for the desktop wire and a different positioning system.)

- [ ] **Step 6: Build + commit**

```bash
npm run build
git add src/components/PipelineTour.astro
git commit -m "feat(tour): final merge moment — destination chip + card pulse"
```

---

## Task 13: Final review + deploy

- [ ] **Step 1: Full visual sanity check**

Run `npm run build`. Must succeed cleanly.

- [ ] **Step 2: Self-review checklist**

- [ ] Wire runs at vertical-center between/through stations.
- [ ] Each station shows an icon + title + sub + badge.
- [ ] Each station has small ports left/right that flash when token arrives.
- [ ] Token has soft pulsing halo throughout, rides the wire.
- [ ] Active emerald trail fills the wire as token moves.
- [ ] At each station hit: card pulses, badge slides up, stamp pops onto token.
- [ ] At end of cycle: destination chip "→ prod" lights up, card briefly glows.
- [ ] `prefers-reduced-motion: reduce` → all motion off, token at end position, all stations + ports + destination in their final lit state.
- [ ] Hover on the figure → all animations pause.
- [ ] Mobile (≤900px): vertical layout still works, destination chip at the bottom of the wire.

- [ ] **Step 3: Push to deploy**

```bash
git push origin master
```

This triggers the GitHub Pages deploy via `.github/workflows/deploy.yml`. URL: https://virtuslab.github.io/visdom-main-page/

- [ ] **Step 4: Verify run**

```bash
gh run list --workflow=deploy.yml --limit 1
```

Confirm the run started.
