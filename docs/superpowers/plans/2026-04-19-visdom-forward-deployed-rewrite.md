# Visdom Forward-Deployed Rewrite Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Visdom landing page from a product-led SaaS pitch into a forward-deployed consulting capability page while preserving the Astro stack, visual language, and working outbound links.

**Architecture:** Keep the current Astro page assembly and component-oriented structure, but replace the product-led content sections with custom Astro markup for the approved eight-section narrative. Preserve the existing light theme, fonts, and utility classes, and only adjust section-level styling where the new layout needs additional structure.

**Tech Stack:** Astro 6, React 19 integration, Tailwind CSS 4, `@virtuslab/visdom-ui` where still useful, static content in `.astro` and `.tsx` files.

---

## Chunk 1: Page Structure And Navigation

### Task 1: Update top-level page wiring

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/NavWithBrand.tsx`
- Modify: `src/layouts/Layout.astro`

- [ ] Update `src/pages/index.astro` to assemble the new section order and remove obsolete product-led sections.
- [ ] Update `src/components/NavWithBrand.tsx` so the preserved nav labels point at the new section anchors.
- [ ] Update `src/layouts/Layout.astro` title, description, and unfurl text so metadata matches the new positioning.

## Chunk 2: Section Rewrite

### Task 2: Implement the new narrative sections

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/components/Pillars.astro`
- Modify: `src/components/Solutions.astro`
- Modify: `src/components/BlogSeries.astro`
- Modify: `src/components/AiRadar.astro`
- Modify: `src/components/MaturityRef.astro`
- Modify: `src/components/CtaSection.astro`

- [ ] Rewrite `src/components/Hero.astro` as the new forward-deployed hero with trust strip and revised CTAs.
- [ ] Rewrite `src/components/Pillars.astro` as the “What we see going wrong” section.
- [ ] Rewrite `src/components/Solutions.astro` to contain “How we are different”, “How we engage”, and “The kit we bring”.
- [ ] Rewrite `src/components/BlogSeries.astro` as the combined thesis section with Matrix methodology plus article series.
- [ ] Update `src/components/AiRadar.astro` subtitle framing while preserving the current stats and dashboard link.
- [ ] Rewrite `src/components/MaturityRef.astro` as the final “Start the conversation” CTA section.
- [ ] Remove or neutralize any now-redundant CTA wrapper in `src/components/CtaSection.astro`.

## Chunk 3: Styling And Documentation

### Task 3: Add any necessary section-level styling and document the rewrite

**Files:**
- Modify: `src/styles/global.css`
- Create: `BEFORE_AFTER.md`

- [ ] Add only the CSS utilities needed for the new layouts while preserving the existing visual language.
- [ ] Write `BEFORE_AFTER.md` with a concise section-by-section mapping from the old page to the new page.

## Chunk 4: Verification

### Task 4: Verify the site builds cleanly

**Files:**
- No source changes expected

- [ ] Run `npm run build` from the repo root.
- [ ] Confirm the site renders without build errors and note any content or layout issues that still need follow-up.
