# Pipeline Tour v3 — Tabs + Detail Panel

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Replace the v2 token-traveling animation (which overlapped station content) with a click-driven tabs interface. 5 compact tabs in a row, single detail panel below showing the active step's sub + long description + badge. Autoplay-by-default with click-to-control + hover-pause.

**Predecessor:** v2 ships at `870dd1b`. v3 starts from there. The v2 code (token, sparks, stage-pulse, etc.) is fully replaced — this is a UI-paradigm shift, not an additive layer.

**Verification:** `npm run build` per task; final visual check + deploy.

---

## File targets

- Modify: `src/components/PipelineTour.astro` — full rewrite of markup, styles, and a new `<script>` block.

---

## Task 14: Rewrite markup + styles (static, step 1 default)

**Goal:** Replace v2 markup and CSS. After this task the component renders 5 tabs with tab 1 styled "active" and only step 1's detail pane visible, no JS yet. Visually matches the design even without scripting (no-JS fallback).

- [ ] **Step 1: Replace the entire frontmatter stations array**

Open `src/components/PipelineTour.astro`. Replace the existing `const stations = [ ... ]` block with this version that includes a `body` field per station (the longer copy):

```astro
---
const stations = [
  {
    id: 'context',
    title: 'Context Fabric',
    sub: 'Agents read the ground truth',
    badge: 'blast radius: 12 files',
    body: "Agents hallucinate because your repo is a black box. Visdom gives agents, and every reviewer, deterministic answers to who owns this, what breaks if I change it, where this pattern already exists. Review rework drops. Refactors stop turning into incident retros.",
    icon: '<path d="M2 4 h12 M2 8 h12 M2 12 h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  },
  {
    id: 'dev',
    title: 'Development',
    sub: 'Agent + engineer co-author',
    badge: '+47 −12',
    body: "Engineers and agents co-author the change against the same context, conventions, and audit trail — instead of prompts living in Slack and context being re-invented every session.",
    icon: '<path d="M6 4 L2 8 L6 12 M10 4 L14 8 L10 12" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'review',
    title: 'Code Review',
    sub: 'VCR pre-reviews in CI',
    badge: '0 critical · $0.10',
    body: "VCR catches boundary violations, security holes, and performance regressions before they hit production. Seniors only open the PRs that actually need them. Runs in your CI, ~$0.10 per PR, no SaaS.",
    icon: '<path d="M1 8 C 4 3, 12 3, 15 8 C 12 13, 4 13, 1 8 Z" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4" fill="none"/>',
  },
  {
    id: 'tests',
    title: 'Testing',
    sub: 'Architecture · property · mutation',
    badge: '73% mutation',
    body: "When AI writes both code and tests, line coverage stops meaning anything. Architecture gates, property-based, and mutation testing catch the computation bugs hiding behind 90% green CI, and the architectural drift your team already voted against.",
    icon: '<path d="M6 2 v4 L3 13 a1.5 1.5 0 0 0 1.4 2 h7.2 A1.5 1.5 0 0 0 13 13 L10 6 V2 M5 2 h6" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'ci',
    title: 'Machine CI',
    sub: 'Pipeline at agent speed',
    badge: '5m vs 45m',
    body: "Your CI takes 45 minutes. An AI agent iterates 50× per hour. We re-architect pipelines to machine speed — the same 88% build-time reduction we have shipped on production JVM fleets.",
    icon: '<path d="M9 1 L3 9 h4 L7 15 l6-8 h-4 z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
  },
];
---
```

- [ ] **Step 2: Replace the markup inside `.pt-figure`**

The whole `<figure class="pt-figure fade-up"> ... </figure>` block in the current file is replaced by:

```astro
    <figure class="pt-figure fade-up">
      <div class="pt-stage" data-active="1">
        <p class="pt-stage-label">Pipeline</p>

        <div class="pt-tabs" role="tablist" aria-label="Visdom pipeline steps">
          {stations.map((s, i) => (
            <button
              type="button"
              class={`pt-tab${i === 0 ? ' is-active' : ''}`}
              data-step={i + 1}
              role="tab"
              aria-selected={i === 0 ? 'true' : 'false'}
              aria-controls={`pt-pane-${s.id}`}
              id={`pt-tab-${s.id}`}
            >
              <span class="pt-tab-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" set:html={s.icon}></svg>
              </span>
              <span class="pt-tab-title">{s.title}</span>
              <span class="pt-tab-check" aria-hidden="true">✓</span>
            </button>
          ))}
          <span class="pt-destination" aria-hidden="true">→ prod</span>
        </div>

        <div class="pt-detail">
          {stations.map((s, i) => (
            <div
              class={`pt-detail-pane${i === 0 ? ' is-active' : ''}`}
              data-step={i + 1}
              role="tabpanel"
              id={`pt-pane-${s.id}`}
              aria-labelledby={`pt-tab-${s.id}`}
              hidden={i !== 0}
            >
              <div class="pt-detail-head">
                <h3 class="pt-detail-title">{s.title}</h3>
                <span class="pt-detail-sub">{s.sub}</span>
                <span class="pt-detail-badge">{s.badge}</span>
              </div>
              <p class="pt-detail-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      <figcaption class="sr-only">
        Visdom pipeline: a code change moves through Context Fabric, development, code review, testing, and machine-speed CI.
      </figcaption>
    </figure>
```

(Note: the `data-active="1"` attribute on `.pt-stage` is the source of truth for which step is selected; CSS will react to it. Default is step 1.)

- [ ] **Step 3: Replace the entire `<style>` block**

Delete the current style block contents (all v1+v2 keyframes, ports, token, wire, sparks, destination, stage-pulse, etc.) and replace with this complete v3 stylesheet:

```css
  .pipeline-tour { padding-top: 3rem; padding-bottom: 3rem; }
  .pt-head { max-width: 48rem; margin-bottom: 1.75rem; }

  .pt-figure { margin: 0; }

  .pt-stage {
    position: relative;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 22px;
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

  /* === Tabs row === */

  .pt-tabs {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr)) auto;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
  }

  /* Background connector line spanning the row, behind tabs. */
  .pt-tabs::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% - 8px);
    height: 1.5px;
    background: rgba(16, 185, 129, 0.18);
    z-index: 0;
  }

  /* Active progress fill — width set via --pt-progress on .pt-stage. */
  .pt-tabs::after {
    content: '';
    position: absolute;
    left: 0;
    top: calc(50% - 8px);
    height: 2px;
    width: var(--pt-progress, 10%);
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.85), rgba(16, 185, 129, 0.55));
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.45);
    transition: width 0.5s cubic-bezier(0.65, 0, 0.35, 1);
    z-index: 0;
  }

  .pt-tab {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    padding: 14px 14px 14px 14px;
    background: var(--color-bg);
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    text-align: left;
    font: inherit;
    color: var(--color-text);
    cursor: pointer;
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease,
      background 0.25s ease,
      transform 0.25s ease;
  }

  .pt-tab:hover {
    border-color: rgba(16, 185, 129, 0.45);
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.08);
  }

  .pt-tab:focus-visible {
    outline: 2px solid var(--color-emerald);
    outline-offset: 3px;
  }

  .pt-tab.is-active {
    border-color: rgba(16, 185, 129, 0.6);
    background: linear-gradient(180deg, rgba(16, 185, 129, 0.06), rgba(16, 185, 129, 0.12));
    box-shadow: 0 6px 22px rgba(16, 185, 129, 0.16);
    transform: translateY(-1px);
  }

  .pt-tab-icon {
    width: 18px;
    height: 18px;
    color: var(--color-text-muted);
    flex-shrink: 0;
    display: inline-flex;
    transition: color 0.25s ease;
  }
  .pt-tab.is-active .pt-tab-icon,
  .pt-tab.is-completed .pt-tab-icon { color: var(--color-emerald-dark); }

  .pt-tab-icon svg { width: 100%; height: 100%; display: block; }

  .pt-tab-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pt-tab-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-emerald-dark);
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    opacity: 0;
    transform: scale(0.7);
    transition: opacity 0.25s ease, transform 0.25s ease;
  }
  .pt-tab.is-completed .pt-tab-check,
  .pt-tab.is-active .pt-tab-check {
    opacity: 1;
    transform: scale(1);
  }
  .pt-tab.is-active .pt-tab-check {
    /* Active step shows a hollow dot rather than a check until completed. */
    background: rgb(16, 185, 129);
    color: #ffffff;
  }

  /* Destination chip */
  .pt-destination {
    position: relative;
    z-index: 1;
    align-self: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--color-bg);
    border: 1px solid rgba(16, 185, 129, 0.35);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-emerald-dark);
    opacity: 0.55;
    transition: opacity 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
    white-space: nowrap;
  }
  .pt-stage[data-active="5"] .pt-destination {
    opacity: 1;
    background: linear-gradient(180deg, rgba(16, 185, 129, 0.06), rgba(16, 185, 129, 0.12));
    box-shadow: 0 0 16px rgba(16, 185, 129, 0.25);
  }

  /* === Detail panel === */

  .pt-detail {
    position: relative;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    background: var(--color-surface);
    padding: 22px 24px;
    min-height: 168px;
  }

  .pt-detail-pane[hidden] { display: none; }
  .pt-detail-pane {
    /* Smooth swap when the controller toggles `hidden`. */
    animation: pt-detail-fade 0.35s ease;
  }
  @keyframes pt-detail-fade {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pt-detail-head {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .pt-detail-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .pt-detail-sub {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--color-text-secondary);
    letter-spacing: 0.02em;
  }

  .pt-detail-badge {
    justify-self: end;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--color-bg);
    border: 1px solid rgba(16, 185, 129, 0.3);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-emerald-dark);
  }

  .pt-detail-body {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.95rem;
    line-height: 1.65;
  }

  /* === Mobile === */

  @media (max-width: 900px) {
    .pt-tabs {
      grid-template-columns: 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }
    .pt-tabs::before, .pt-tabs::after { display: none; }
    .pt-destination { justify-self: start; margin-top: 4px; }
    .pt-detail-head { grid-template-columns: 1fr; gap: 6px; }
    .pt-detail-badge { justify-self: start; }
  }

  /* === Reduced motion === */

  @media (prefers-reduced-motion: reduce) {
    .pt-tab,
    .pt-tab-check,
    .pt-tab-icon,
    .pt-detail-pane,
    .pt-tabs::after,
    .pt-destination {
      transition: none;
      animation: none !important;
    }
    .pt-tab.is-active { transform: none; }
  }
```

- [ ] **Step 4: Build**

Run `npm run build`. Must succeed.

- [ ] **Step 5: Commit**

```bash
git add src/components/PipelineTour.astro
git commit -m "refactor(tour): tabs + detail panel layout (no JS yet, step 1 default)"
```

---

## Task 15: JS interactivity (autoplay + click + hover)

**Goal:** Add a vanilla `<script>` to the component implementing: click any tab to switch, autoplay 4s per step, pause on hover/focus, 8s cooldown after manual click before autoplay resumes, respect `prefers-reduced-motion`.

- [ ] **Step 1: Append a `<script>` block at the end of `src/components/PipelineTour.astro`**

After the closing `</style>` tag, before the end of file, add:

```html
<script>
  (() => {
    const tour = document.querySelector('.pipeline-tour');
    if (!tour) return;

    const stage = tour.querySelector('.pt-stage');
    const tabs = Array.from(tour.querySelectorAll('.pt-tab'));
    const panes = Array.from(tour.querySelectorAll('.pt-detail-pane'));
    if (!stage || tabs.length === 0 || panes.length === 0) return;

    const TOTAL = tabs.length;
    const STEP_MS = 4000;
    const COOLDOWN_MS = 8000;
    const PROGRESS = ['10%', '30%', '50%', '70%', '90%'];

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current = 1;
    let autoplayTimer = null;
    let cooldownTimer = null;
    let inCooldown = false;
    let userInside = false;

    function setStep(n) {
      current = n;
      stage.dataset.active = String(n);
      stage.style.setProperty('--pt-progress', PROGRESS[n - 1]);
      tabs.forEach((tab) => {
        const i = parseInt(tab.dataset.step, 10);
        const isActive = i === n;
        const isCompleted = i < n;
        tab.classList.toggle('is-active', isActive);
        tab.classList.toggle('is-completed', isCompleted);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      panes.forEach((pane) => {
        const i = parseInt(pane.dataset.step, 10);
        const isActive = i === n;
        pane.classList.toggle('is-active', isActive);
        if (isActive) {
          pane.removeAttribute('hidden');
        } else {
          pane.setAttribute('hidden', '');
        }
      });
    }

    function startAutoplay() {
      if (reducedMotion || inCooldown || userInside) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(() => {
        const next = current >= TOTAL ? 1 : current + 1;
        setStep(next);
      }, STEP_MS);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function beginCooldown() {
      inCooldown = true;
      stopAutoplay();
      if (cooldownTimer) window.clearTimeout(cooldownTimer);
      cooldownTimer = window.setTimeout(() => {
        inCooldown = false;
        startAutoplay();
      }, COOLDOWN_MS);
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const i = parseInt(tab.dataset.step, 10);
        setStep(i);
        beginCooldown();
      });
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        let next = current + dir;
        if (next < 1) next = TOTAL;
        if (next > TOTAL) next = 1;
        setStep(next);
        const target = tabs.find((t) => parseInt(t.dataset.step, 10) === next);
        if (target) target.focus();
        beginCooldown();
      });
    });

    stage.addEventListener('mouseenter', () => {
      userInside = true;
      stopAutoplay();
    });
    stage.addEventListener('mouseleave', () => {
      userInside = false;
      startAutoplay();
    });
    stage.addEventListener('focusin', () => {
      userInside = true;
      stopAutoplay();
    });
    stage.addEventListener('focusout', (e) => {
      if (!stage.contains(e.relatedTarget)) {
        userInside = false;
        startAutoplay();
      }
    });

    // Init: ensure step 1 is consistent and start autoplay.
    setStep(1);
    startAutoplay();
  })();
</script>
```

(IIFE keeps the variables out of the global scope. Astro emits this script with default deferred behavior.)

- [ ] **Step 2: Build**

Run `npm run build`. Must succeed.

- [ ] **Step 3: Commit**

```bash
git add src/components/PipelineTour.astro
git commit -m "feat(tour): tab click + autoplay + hover-pause interactivity"
```

---

## Task 16: Final review + deploy

- [ ] **Step 1: Build clean**

Run `npm run build`. No errors, no warnings.

- [ ] **Step 2: Self-review checklist**

- [ ] 5 tab buttons render (no token, no wire-through-content).
- [ ] Tab 1 is active by default; remaining tabs are dim with no ✓.
- [ ] Detail panel below shows step 1 content.
- [ ] Connector line behind tabs has a small emerald active fill.
- [ ] `→ prod` chip sits at the right of the tabs row.
- [ ] On hover/focus over a non-step-1 tab, it gains an emerald hover border.
- [ ] After autoplay (or on click of tab N): the active tab moves, prior tabs gain ✓, detail panel swaps with a soft fade.
- [ ] When tab 5 is active, `→ prod` chip lights up.
- [ ] On a reduced-motion environment, no autoplay; user controls navigation by click/keyboard.

- [ ] **Step 3: Push**

```bash
git push origin master
```

- [ ] **Step 4: Verify deploy**

```bash
gh run list --workflow=deploy.yml --limit 1
```
