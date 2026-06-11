# Targeted Consistency Remodel: Diagnosis Redesign + Page-Wide Label System

**Date:** 2026-06-11
**Status:** Approved

## Problem

Two signals from review of the live page:

1. The second section ("§ 01 · The Diagnosis", `src/components/Pillars.astro`) is too long and generic: 12 bullets (6 Before + 6 After) in identical rhythm, no hierarchy, no numbers. It is the largest wall of text in the top half of the page.
2. The page as a whole lacks consistency on three axes:
   - **Visual:** section numbering (§ 01-04) stops after Orchestrator Use Cases; later sections use unnumbered labels ("Operating model", "Proof") or none at all (MaturityRef). CTA section uses a hybrid "§ Next move".
   - **Narrative:** MaturityRef sits between FAQ and CTA with no heading and no bridge. The Diagnosis "After" column duplicates what sections 02-03 demonstrate.
   - **Tonal:** CTA button verbs vary with no pattern ("Book a demo", "Take the assessment", "Open dashboard"). Solutions is overloaded with colored badges/tags relative to the rest of the page.

## Decisions Made

- **Approach:** targeted remodel (not a full design-system pass, not a minimal copy polish).
- **Diagnosis format:** purely typographic "thesis + 3 reasons" layout. The Before/After card layout is abandoned.
- **Section labels:** remove § numbers everywhere; one uniform unnumbered label style across all sections.
- **AI Radar:** stays dark as-is. Only its label conforms to the new system. Explicitly out of scope otherwise.

## Design

### 1. Diagnosis section (rewrite `Pillars.astro`, rename to `Diagnosis.astro`)

Purely typographic: no cards, no columns, no divider pill. Roughly one third of the current length.

- Label: `The Diagnosis` (new uniform label style).
- Title: unchanged, "The tools changed. The system didn't."
- Lead: shortened to two sentences: "Every team we meet bought Copilot, Cursor, or a Claude subscription. Commits went up. Lead time barely moved."
- Kicker line: "Three reasons the number doesn't move:"
- Three items, each: mono index (01/02/03) + mono uppercase keyword in the amber "pain" accent + one or two sentences of concrete failure copy:
  - **01 CONTEXT:** Prompts live in Slack. Every session starts from zero.
  - **02 REVIEW:** Every PR waits for the same two seniors. Agents made the queue longer.
  - **03 TRUST:** No trail, no attribution. Legal says "not yet" because there is nothing to audit.
- Closing bridge, one line: "Here is the system that moves it." with a down-arrow glyph.
- The "After" column is removed entirely. Sections "How a change flows" and "The Orchestrator" immediately below are the answer; Diagnosis only frames the problem.
- Rationale for the quiet treatment: the section sits between the Hero panel and two heavily animated sections (ArchitectureFlow SVG, OrchestratorShowcase stage). A typographic section gives the page breathing room.
- Update the import and usage in `src/pages/index.astro` (`Pillars` becomes `Diagnosis`).

### 2. Uniform section label system (all sections)

One pattern: existing `.section-label` style (mono, uppercase), short noun phrase, **no § prefix, no numbers**.

| Section (component) | Label |
|---|---|
| Hero | none (page header, deliberate exception) |
| Diagnosis | `The Diagnosis` |
| ArchitectureFlow | `How a change flows` |
| OrchestratorShowcase | `The Orchestrator` |
| OrchestratorUseCases | `Orchestrator at work` (+ existing "concept preview" tag stays) |
| Solutions | `Operating model` (already conforms) |
| ClientResults | `Proof` (already conforms) |
| BlogSeries | `Public writing` (add if missing in markup) |
| AiRadar | `AI Radar · Live feed` (already conforms) |
| MaturityRef | `Maturity model` (new, see section 4) |
| Faq | `FAQ` (already conforms) |
| CtaSection | `Next move` (drop the `§ ` prefix) |

### 3. Solutions: targeted quieting (no structural rewrite)

- Thin out colored badges/tags on the six platform component blocks: keep only tags that carry information (e.g. "coming soon"); drop decorative ones.
- Align the labels of the three sub-sections (Operating model, How we engage, The platform we bring) to the uniform label style.
- No copy rewrite beyond this.

### 4. MaturityRef: narrative bridge

The section gets a full heading like every other section:

- Label: `Maturity model`
- Title (h2) + one-sentence lead tying the Matrix to the rest of the page: it is the framework used to scope every engagement (where the client is today, what Foundation targets).
- The existing React component and the "Companion publication" card stay as-is below the new heading.

### 5. CTA verb pattern

All buttons follow "verb + object" with the consistent arrow suffix already in use:

- "Book a working session"
- "Run the Matrix"
- "Read the code"
- "Open the dashboard"
- "Read the latest article"
- "See how we engage"

Applies to: Hero, OrchestratorShowcase, AiRadar, BlogSeries, CtaSection (and any other button found during implementation).

### 6. Cleanup

- Delete dead `src/components/PipelineTour.astro` (superseded by ArchitectureFlow, still carries the old "§ 01" label).
- Delete unused wrappers `SolutionCard.astro` and `SeriesCard.astro` (not referenced by any page; `Terminal.astro` IS used inside Solutions and stays).
- Serif accent rule, codified: at most one serif accent per section, only inside the h2. Current usages already comply; fix any violation found during implementation.

## Out of Scope

- AI Radar visual theme (stays dark).
- Solutions copy rewrite or structural changes beyond badge thinning.
- Hero content and layout.
- ArchitectureFlow and OrchestratorShowcase internals (labels only).

## Error Handling

Static Astro site; no runtime error paths are affected. The risk is visual regression, addressed by verification below.

## Verification

- `npm run dev`, then a full visual pass over the page after each group of changes (Diagnosis rewrite, label sweep, Solutions thinning, MaturityRef heading, CTA verbs, cleanup).
- `npm run build` must pass at the end (catches broken imports after the rename and deletions).
- Grep check: no `§` remains in `src/`.
