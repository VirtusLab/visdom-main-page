# Targeted Consistency Remodel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Diagnosis section to a short typographic "thesis + 3 reasons" layout and make the whole landing page consistent: uniform unnumbered section labels, verb+object CTA buttons, thinned Solutions badges, a narrative bridge for MaturityRef, a clickable ArchitectureFlow stepper, and dead-code cleanup.

**Architecture:** Static Astro site (`src/pages/index.astro` composes section components from `src/components/`). All changes are markup/copy/CSS inside existing components plus one component rewrite (Pillars becomes Diagnosis) and one small JS addition (stepper click handlers inside the existing GSAP ScrollTrigger script).

**Tech Stack:** Astro 6, Tailwind 4 utility classes mixed with scoped `<style>` blocks, GSAP ScrollTrigger, shared classes from `src/styles/global.css` (`.section-label`, `.section-title`, `.fade-up`, `.btn-pill`).

**Spec:** `docs/superpowers/specs/2026-06-11-consistency-remodel-design.md`

**Verification model:** This is a static marketing page with no test suite. Each task verifies with `npm run build` (catches broken imports/syntax) and a visual pass on `npm run dev` (http://localhost:4321). Commit after each task.

**Note on `docs/` commits:** `docs/` is gitignored; superpowers files are committed with `git add -f` (established practice in this repo).

---

### Task 1: Diagnosis section (rewrite Pillars as Diagnosis)

**Files:**
- Create: `src/components/Diagnosis.astro`
- Modify: `src/pages/index.astro:8` (import), `src/pages/index.astro:23` (usage)
- Delete: `src/components/Pillars.astro`

- [ ] **Step 1: Create `src/components/Diagnosis.astro`**

```astro
---
const reasons = [
  {
    key: 'Context',
    copy: 'Prompts live in Slack. Every session starts from zero.',
  },
  {
    key: 'Review',
    copy: 'Every PR waits for the same two seniors. Agents made the queue longer.',
  },
  {
    key: 'Trust',
    copy: 'No trail, no attribution. Legal says "not yet" because there is nothing to audit.',
  },
];
---
<section class="section diagnosis-section">
  <div class="container">
    <div class="fade-up diagnosis-head">
      <p class="section-label">The Diagnosis</p>
      <h2 class="section-title">The tools changed. The system didn't.</h2>
      <p class="diagnosis-lead">
        Every team we meet bought Copilot, Cursor, or a Claude subscription. Commits went up. Lead time barely moved.
      </p>
    </div>

    <div class="fade-up diagnosis-body">
      <p class="diagnosis-kicker">Three reasons the number doesn't move:</p>
      <ol class="diagnosis-reasons" role="list">
        {reasons.map((r, i) => (
          <li class="diagnosis-reason">
            <span class="diagnosis-reason-n">{String(i + 1).padStart(2, '0')}</span>
            <span class="diagnosis-reason-key">{r.key}</span>
            <p class="diagnosis-reason-copy">{r.copy}</p>
          </li>
        ))}
      </ol>
      <p class="diagnosis-bridge">Here is the system that moves it. <span aria-hidden="true">&darr;</span></p>
    </div>
  </div>
</section>

<style>
  .diagnosis-section {
    padding-top: 2.5rem;
    background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%);
  }

  .diagnosis-head {
    max-width: 48rem;
  }

  .diagnosis-lead {
    margin-top: 1.25rem;
    font-size: 1.125rem;
    line-height: 1.65;
    color: var(--color-text-secondary);
  }

  .diagnosis-body {
    max-width: 46rem;
    margin-top: 3rem;
  }

  .diagnosis-kicker {
    margin: 0 0 2rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .diagnosis-reasons {
    display: grid;
    gap: 2rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .diagnosis-reason {
    display: grid;
    grid-template-columns: 2.5rem 7.5rem minmax(0, 1fr);
    gap: 1rem;
    align-items: baseline;
  }

  .diagnosis-reason-n {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--color-text-muted);
  }

  .diagnosis-reason-key {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #b45309;
  }

  .diagnosis-reason-copy {
    margin: 0;
    font-size: 1.2rem;
    line-height: 1.6;
    color: var(--color-text);
  }

  .diagnosis-bridge {
    margin: 3rem 0 0;
    font-size: 1.05rem;
    color: var(--color-text-secondary);
  }

  @media (max-width: 640px) {
    .diagnosis-reason {
      grid-template-columns: 2.5rem minmax(0, 1fr);
    }

    .diagnosis-reason-copy {
      grid-column: 2;
    }
  }
</style>
```

- [ ] **Step 2: Update `src/pages/index.astro`**

Replace line 8:

```astro
import Pillars from '../components/Pillars.astro';
```

with:

```astro
import Diagnosis from '../components/Diagnosis.astro';
```

Replace line 23:

```astro
    <Pillars />
```

with:

```astro
    <Diagnosis />
```

- [ ] **Step 3: Delete the old component**

Run: `rm src/components/Pillars.astro`

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build completes with no errors (an unresolved `Pillars` import would fail here).

- [ ] **Step 5: Visual check**

Run `npm run dev`, open http://localhost:4321, scroll to the second section. Expected: label "THE DIAGNOSIS" (no "§ 01"), title, 2-sentence lead, kicker, three rows (01 CONTEXT, 02 REVIEW, 03 TRUST) with amber keywords, bridge line with a down arrow. No cards, no Before/After columns. Check mobile width (~375px): keyword and copy stack under the index.

- [ ] **Step 6: Commit**

```bash
git add src/components/Diagnosis.astro src/pages/index.astro
git rm src/components/Pillars.astro
git commit -m "feat(diagnosis): typographic thesis + 3 reasons replaces before/after columns"
```

---

### Task 2: Uniform section labels (drop § and numbers)

**Files:**
- Modify: `src/components/ArchitectureFlow.astro:96`
- Modify: `src/components/OrchestratorShowcase.astro:29`
- Modify: `src/components/OrchestratorUseCases.astro:87`
- Modify: `src/components/CtaSection.astro:7`

(Diagnosis already conforms after Task 1. Already conforming, do not touch: Solutions "Operating model" / "Engagement model" / "Platform components", ClientResults "Proof", BlogSeries "Public writing", AiRadar "AI Radar · Live Feed", Faq "FAQ". Hero deliberately has no label.)

- [ ] **Step 1: ArchitectureFlow.astro line 96**

Replace:

```astro
    <p class="section-label">§ 02 · How a change flows</p>
```

with:

```astro
    <p class="section-label">How a change flows</p>
```

- [ ] **Step 2: OrchestratorShowcase.astro line 29**

Replace:

```astro
      <p class="section-label">§ 03 · The Orchestrator</p>
```

with:

```astro
      <p class="section-label">The Orchestrator</p>
```

- [ ] **Step 3: OrchestratorUseCases.astro line 87**

Replace:

```astro
      <p class="section-label">§ 04 · Orchestrator at work <span class="uc-proto">concept preview</span></p>
```

with:

```astro
      <p class="section-label">Orchestrator at work <span class="uc-proto">concept preview</span></p>
```

- [ ] **Step 4: CtaSection.astro line 7**

Replace:

```astro
        <p class="section-label">§ Next move</p>
```

with:

```astro
        <p class="section-label">Next move</p>
```

- [ ] **Step 5: Verify no § remains in live components**

Run: `grep -rn '§' src/ | grep -v PipelineTour`
Expected: no output (PipelineTour still matches until Task 7 deletes it).

- [ ] **Step 6: Commit**

```bash
git add src/components/ArchitectureFlow.astro src/components/OrchestratorShowcase.astro src/components/OrchestratorUseCases.astro src/components/CtaSection.astro
git commit -m "polish(labels): uniform unnumbered section labels across the page"
```

---

### Task 3: CTA verb pattern (verb + object everywhere)

**Files:**
- Modify: `src/components/Hero.astro:34`
- Modify: `src/components/AiRadar.astro:63`
- Modify: `src/components/BlogSeries.astro:15,27,39`
- Modify: `src/components/CtaSection.astro:19,27,34`

(Already conforming, do not touch: OrchestratorShowcase "Book a demo", Solutions "Read: ..." / "Read the reference", MaturityRef "Read the article".)

- [ ] **Step 1: Hero.astro line 34**

Replace:

```astro
          <a href="#engage" class="btn-pill btn-primary">How we engage -&gt;</a>
```

with:

```astro
          <a href="#engage" class="btn-pill btn-primary">See how we engage -&gt;</a>
```

- [ ] **Step 2: AiRadar.astro line 63**

Replace the button text `Open dashboard -&gt;` with `Open the dashboard -&gt;` (same line, same attributes):

```astro
          <a href="https://visdom-ai-maturity-matrix.pages.dev/dashboard" target="_blank" rel="noopener" class="btn-pill btn-primary radar-cta">Open the dashboard -&gt;</a>
```

- [ ] **Step 3: BlogSeries.astro lines 15, 27, 39**

Replace all three occurrences of:

```js
    linkLabel: 'Read latest article',
```

with:

```js
    linkLabel: 'Read the latest article',
```

- [ ] **Step 4: CtaSection.astro buttons**

Line 19, replace `Book a session -&gt;` with `Book a working session -&gt;`:

```astro
          <a href="mailto:visdom@virtuslab.com?subject=Working%20session%20request" class="btn-pill btn-primary">Book a working session -&gt;</a>
```

Line 27, replace `Take the assessment -&gt;` with `Run the Matrix -&gt;`:

```astro
          <a href="https://visdom-ai-maturity-matrix.pages.dev/workshop" target="_blank" rel="noopener" class="btn-pill btn-outline">Run the Matrix -&gt;</a>
```

Line 34, replace `Browse on GitHub -&gt;` with `Read the code -&gt;`:

```astro
          <a href="https://github.com/VirtusLab" target="_blank" rel="noopener" class="btn-pill btn-outline">Read the code -&gt;</a>
```

- [ ] **Step 5: Visual check**

On the dev server confirm the three CTA cards still read naturally (card titles "Run the Matrix yourself" and "Read the code" now echo their buttons; that is intended).

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/components/AiRadar.astro src/components/BlogSeries.astro src/components/CtaSection.astro
git commit -m "copy(cta): verb + object pattern for every button"
```

---

### Task 4: Solutions badge thinning

**Files:**
- Modify: `src/components/Solutions.astro` (six tag-row divs, approx lines 185-189, 208-212, 247-251, 310-315, 334-339, 442-445)

Rule from spec: keep only informative tags ("Coming Soon" inside the two h3s at lines 177 and 429 stays). Delete the six decorative tag rows. Do NOT touch `fabric-core-tag` (line 141) or `sandbox-agent-tag` (line 349); those are diagram internals.

- [ ] **Step 1: Delete the six tag-row blocks**

Each is a `<div class="flex flex-wrap gap-2 mb-6">...</div>` containing only `.tag` spans. Delete these exact blocks:

Component 01 (Context Fabric):

```astro
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag bg-blue/10 text-blue border border-blue/20">Open Source</span>
              <span class="tag bg-emerald/10 text-emerald border border-emerald/20">MCP Server</span>
              <span class="tag bg-purple/10 text-purple border border-purple/20">CLI</span>
            </div>
```

Component 02 (Code Review):

```astro
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag bg-purple/10 text-purple border border-purple/20">Architecture</span>
              <span class="tag bg-amber/10 text-amber border border-amber/20">Security</span>
              <span class="tag bg-blue/10 text-blue border border-blue/20">Performance</span>
            </div>
```

Component 03 (Testing):

```astro
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag bg-blue/10 text-blue border border-blue/20">ArchUnit</span>
              <span class="tag bg-purple/10 text-purple border border-purple/20">Property-Based</span>
              <span class="tag bg-amber/10 text-amber border border-amber/20">Mutation Testing</span>
            </div>
```

Component 04 (Governance):

```astro
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag bg-emerald/10 text-emerald border border-emerald/20">Tracing</span>
              <span class="tag bg-purple/10 text-purple border border-purple/20">Audit Trail</span>
              <span class="tag bg-amber/10 text-amber border border-amber/20">EU AI Act</span>
              <span class="tag bg-blue/10 text-blue border border-blue/20">Auto-Evaluation</span>
            </div>
```

Component 05 (Security):

```astro
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag bg-emerald/10 text-emerald border border-emerald/20">Isolation</span>
              <span class="tag bg-blue/10 text-blue border border-blue/20">Policy Guardrails</span>
              <span class="tag bg-purple/10 text-purple border border-purple/20">Zero Blast Radius</span>
              <span class="tag bg-amber/10 text-amber border border-amber/20">Aikido AppSec</span>
            </div>
```

Component 06 (Machine CI):

```astro
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag bg-purple/10 text-purple border border-purple/20">Gradle</span>
              <span class="tag bg-amber/10 text-amber border border-amber/20">Performance</span>
            </div>
```

(If indentation differs slightly in components 04-06, match the actual file content; the rule is: the whole wrapper div goes.)

- [ ] **Step 2: Verify**

Run: `grep -c 'class="tag ' src/components/Solutions.astro`
Expected: `2` (only the two "Coming Soon" tags remain).

- [ ] **Step 3: Visual check**

Dev server: each platform component block now reads number, title, paragraph(s), button. Spacing intact (paragraphs above carry their own `mb-6`).

- [ ] **Step 4: Commit**

```bash
git add src/components/Solutions.astro
git commit -m "polish(solutions): drop decorative tag rows, keep coming-soon only"
```

---

### Task 5: MaturityRef narrative bridge

**Files:**
- Modify: `src/components/MaturityRef.astro` (add head block above the React component, add styles)

Note (conscious spec adjustment): the spec asks for label + h2 + lead, but the embedded React component already renders its own h2 ("Where does your organization stand?"). To avoid a duplicate heading, the bridge adds only the label and the lead; the React h2 serves as the section title.

- [ ] **Step 1: Add the head block**

In `src/components/MaturityRef.astro`, insert BEFORE the `<MaturityRefReact ... />` element:

```astro
<section class="matrix-head" aria-label="Maturity model">
  <div class="container">
    <p class="section-label">Maturity model</p>
    <p class="matrix-head-lead">
      The framework we scope every engagement with: it shows where your SDLC stands today, and what the first two weeks should target.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Add styles**

Inside the existing `<style>` block of `MaturityRef.astro`, add at the top:

```css
  .matrix-head {
    padding: 4rem 0 0;
    background: var(--color-bg);
    text-align: center;
  }

  .matrix-head-lead {
    margin: 0 auto;
    max-width: 38rem;
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
```

- [ ] **Step 3: Visual check**

Dev server: between FAQ and the Matrix there is now a centered "MATURITY MODEL" label and one lead sentence, then the React component's own heading. If the React component's top border line visually cuts between the lead and the heading in a jarring way, reduce `.matrix-head` bottom gap by adding `padding-bottom: 0.5rem` and re-check.

- [ ] **Step 4: Commit**

```bash
git add src/components/MaturityRef.astro
git commit -m "feat(maturity): section label and narrative bridge above the matrix"
```

---

### Task 6: Clickable ArchitectureFlow stepper

**Files:**
- Modify: `src/components/ArchitectureFlow.astro:367-377` (stepper markup), styles near line 605, script near line 797

The stepper is driven by a GSAP ScrollTrigger scrub on `.af-track` (`start: 'top top'`, `end: 'bottom bottom'`, `onUpdate` maps progress to the active step). Clicking step `i` must scroll the window to the scroll position corresponding to progress `(i + 0.5) / steps`. In reduced-motion/compact mode there is no scrub and all steps are expanded, so handlers are attached only in the scrub branch.

- [ ] **Step 1: Make each step head a button**

Replace lines 367-377:

```astro
      <ol class="af-steps" role="list">
        {captions.map((c, i) => (
          <li class={`af-step${i === 0 ? ' is-active' : ''}`} data-step={i}>
            <span class="af-step-head">
              <span class="af-step-n">{c.n}</span>
              <span class="af-step-t">{c.t}</span>
            </span>
            <span class="af-step-d">{c.d}</span>
          </li>
        ))}
      </ol>
```

with:

```astro
      <ol class="af-steps" role="list">
        {captions.map((c, i) => (
          <li class={`af-step${i === 0 ? ' is-active' : ''}`} data-step={i}>
            <button type="button" class="af-step-btn" aria-label={`Show step ${c.n}: ${c.t}`}>
              <span class="af-step-head">
                <span class="af-step-n">{c.n}</span>
                <span class="af-step-t">{c.t}</span>
              </span>
            </button>
            <span class="af-step-d">{c.d}</span>
          </li>
        ))}
      </ol>
```

- [ ] **Step 2: Button styles**

In the `<style>` block, directly after the `.af-step.is-active` rule (line 611), add:

```css
  .af-step-btn {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
    background: none;
    border: 0;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }
  .af-step:hover { opacity: 1; }
```

(`.af-step` dims inactive steps via opacity; the hover rule is the click affordance.)

- [ ] **Step 3: Click handlers in the scrub branch**

In the `<script>` block, inside the `else` branch (non-reduced, non-compact), after the line `tl.to({}, { duration: 0.8 });` and before `setActive(0);`, add:

```js
      // clicking a step scrolls the page to that stage of the scrub
      captions.forEach((c, i) => {
        const btn = c.querySelector('.af-step-btn');
        if (!btn) return;
        btn.addEventListener('click', () => {
          const st = tl.scrollTrigger;
          const target = st.start + (st.end - st.start) * ((i + 0.5) / steps);
          window.scrollTo({ top: target, behavior: 'smooth' });
        });
      });
```

(`st.start` / `st.end` are read at click time, so resize-driven recalculation is picked up automatically.)

- [ ] **Step 4: Verify in browser**

Dev server, desktop width: click step 08 "Ship to production". Expected: the page smooth-scrolls, the diagram reveals through to the ship stage, step 08 highlights, the reticle lands on the ship box. Click step 01: scrolls back, step 01 highlights. Keyboard: Tab reaches each step, Enter activates it. Narrow window below 900px: steps are all expanded and clicks do nothing (by design).

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 6: Commit**

```bash
git add src/components/ArchitectureFlow.astro
git commit -m "feat(architecture-flow): stepper items click-scroll to their stage"
```

---

### Task 7: Dead code cleanup

**Files:**
- Delete: `src/components/PipelineTour.astro`, `src/components/SolutionCard.astro`, `src/components/SeriesCard.astro`

Pre-verified: nothing outside these files references them (`grep -rn "PipelineTour\|SolutionCard\|SeriesCard" src/` matches only the files themselves). `Terminal.astro` IS used inside Solutions and stays.

- [ ] **Step 1: Delete**

```bash
git rm src/components/PipelineTour.astro src/components/SolutionCard.astro src/components/SeriesCard.astro
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove dead PipelineTour, SolutionCard, SeriesCard components"
```

---

### Task 8: Final verification

- [ ] **Step 1: No § anywhere**

Run: `grep -rn '§' src/`
Expected: no output, exit code 1.

- [ ] **Step 2: Serif accent rule**

Run: `grep -rn 'serif-accent' src/components/`
Expected: at most one match per component, each inside an h2/h1. (Known compliant: Hero, OrchestratorShowcase, OrchestratorUseCases.) Fix any violation by removing the extra accent span (keep the text, drop the wrapper).

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Full visual pass**

`npm run dev`, scroll the entire page top to bottom at desktop and ~375px width. Checklist: Diagnosis is short and typographic; every label style matches; stepper clicks work; Solutions blocks have no tag rows; Maturity bridge present; all buttons verb+object; no layout regressions in untouched sections (Hero, Results, Blog, Radar, FAQ).
