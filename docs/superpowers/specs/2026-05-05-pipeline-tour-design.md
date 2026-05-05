# Visdom Pipeline Tour — Design Spec

**Date:** 2026-05-05
**Author:** Artur Skowronski (DRC) + Claude
**Status:** Approved by user, ready for implementation plan

## Goal

Add a single, animated section to the Visdom landing page that tells the
"how a change flows through Visdom" story step-by-step. One animation, one
viewport-screen, no over-design. Match the existing visual language of the
page (specifically the `fabric-diagram` aesthetic in `Solutions.astro`).

## Placement

New section between `Hero` and `Pillars` in `src/pages/index.astro`.
Component lives at `src/components/PipelineTour.astro`.

The section's role on the page: a 7-second "what is Visdom" tour that
prepares the reader for the diagnosis ("tools changed, system didn't") and
the detailed component breakdown that follows. Position may be moved later
based on feedback — the component is self-contained.

## User Story

A first-time visitor lands on the page, scrolls past the Hero, and sees an
animated diagram of a code commit traveling through five stations of the
Visdom platform: **Context → Development → Review → Tests → CI**. Each
station lights up as the commit passes, the commit accumulates green
checkmarks ("stamps"), and the loop resets. Within ~7 seconds the visitor
has a mental model of the whole platform before reading any prose.

## Visual Language

Match `fabric-diagram` in `Solutions.astro`:

- White card, 1px `--color-border`, large radius (`--radius-xl`).
- Soft `--color-emerald` accents for active state and the wire.
- Mono font (`--font-mono`) for badges, station labels, and the commit token.
- Same spacing rhythm and shadow tokens as existing diagrams.

## Layout — Desktop (≥900px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ § 02 · How a change flows                                                │
│ One commit. Five stations. Machine speed.                                │
│                                                                          │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│   │ CONTEXT │───│   DEV   │───│ REVIEW  │───│  TESTS  │───│   CI    │    │
│   │ Fabric  │   │ agent + │   │   VCR   │   │ Visdom  │   │ Machine │    │
│   │         │   │  human  │   │         │   │ Testing │   │   CI    │    │
│   │ 12 files│   │ +47 −12 │   │ 0 crit  │   │ 73% mut │   │ 5m vs 45 │    │
│   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│        ●─────────────────────●                                           │
│                       commit token                                       │
│              feat: pricing rule  ✓ ctx  ✓ dev                            │
└──────────────────────────────────────────────────────────────────────────┘
```

- 5-column grid, equal widths, gaps via SVG wire.
- One continuous SVG `<path>` defines the wire trajectory across all stations.
- Commit token rides the path via CSS `offset-path` / `offset-distance`.
- Section padding: `~3rem` top/bottom — does not dominate the page.

## Layout — Mobile (<900px)

Pipeline rotates 90° → vertical. Stations stack top-to-bottom, full card
width. Token travels down the same SVG wire (rotated). Same content, same
animation timeline. Section height ≈ 70vh on mobile.

## Animation Timeline (7s loop, 1s reset pause = 8s total)

| t (s)     | Event                                                                                        |
|-----------|----------------------------------------------------------------------------------------------|
| 0.0       | Token starts at left edge. All stations dimmed (opacity 0.6, border-light).                  |
| 0.0–1.4   | Token travels to **Station 1: Context Fabric**. Station activates (emerald border + glow). Badge `blast radius: 12 files` fades in. Token gains stamp `✓ ctx`. |
| 1.4–2.8   | Token travels to **Station 2: Development**. Activates. Badge `+47 −12`. Stamp `✓ dev`.    |
| 2.8–4.2   | Token travels to **Station 3: Code Review (VCR)**. Activates. Badge `0 critical · $0.10`. Stamp `✓ review`. |
| 4.2–5.6   | Token travels to **Station 4: Testing**. Activates. Badge `73% mutation`. Stamp `✓ tests`. |
| 5.6–7.0   | Token travels to **Station 5: Machine CI**. Activates. Badge `5m vs 45m`. Stamp `✓ shipped`. Brief emerald pulse on the merged token. |
| 7.0–8.0   | Hold the final state (all stations done, all stamps visible).                                |
| 8.0       | Reset to t=0, loop again.                                                                    |

Once a station has been activated by the passing token, it stays in the
"done" state (full opacity, accent border) until the loop resets. Only the
token is in motion at any one time.

## What is NOT animated (deliberately)

- No parallax, no particle effects, no floating icons.
- Stations don't scale or bounce — they only toggle dim → active → done.
- The wire itself is static (no flowing-dash animation).
- One animation, one focus point: the token.

## Station Content

| # | Title              | Sub                                  | Badge (mono)              |
|---|--------------------|--------------------------------------|---------------------------|
| 1 | **Context Fabric** | Agents read the ground truth         | `blast radius: 12 files`  |
| 2 | **Development**    | Agent + engineer co-author           | `+47 −12`                 |
| 3 | **Code Review**    | VCR pre-reviews in CI                | `0 critical · $0.10`      |
| 4 | **Testing**        | Architecture · property · mutation   | `73% mutation`            |
| 5 | **Machine CI**     | Pipeline at agent speed              | `5m vs 45m`               |

Badges are illustrative — they are static decorative copy, not data feeds.

## Section Header Copy

- Section label: `§ 01 · How a change flows`
- Section title: `One commit. Five stations. Machine speed.`
- Optional one-line subtitle if it reads thin: `From context to merge in a single, machine-speed loop.`

(Note: the existing Pillars section currently uses `§ 01 · The Diagnosis`. After this insertion, the new Pipeline Tour section becomes `§ 01` and Pillars renumbers to `§ 02`. If any downstream sections use `§ NN` labels, they shift by one. Renumbering is part of the implementation; the implementation plan will audit all components for `§` labels first.)

## Scope Decisions

1. **Five stations only.** Visdom Governance and Visdom Security are
   intentionally omitted from this animation. They are cross-cutting
   concerns that don't fit a linear SDLC pipeline; they live in the
   detailed Solutions section below.
2. **No interactivity in v1.** Autoplay loop only. Hover-to-pause is a
   v1 nice-to-have; click-to-jump is v2.
3. **Illustrative metrics, not real data.** Badges are static copy.

## Accessibility

- `prefers-reduced-motion: reduce` → render the static "done" end state:
  every station active, every stamp visible, token at the right edge.
  No motion at all.
- Pause animation on hover and on keyboard focus within the section
  (CSS `:hover` / `:focus-within` setting `animation-play-state: paused`).
- The diagram itself is decorative (`aria-hidden="true"` on visual parts).
- A `<figcaption>` (or visually-hidden `<p>`) provides a text equivalent:
  *"Visdom pipeline: a code change moves through Context Fabric,
   development, code review, testing, and machine-speed CI."*

## Implementation Approach

- Single Astro component: `src/components/PipelineTour.astro`.
- Pure CSS animation, **zero JavaScript**:
  - One SVG `<path>` for the wire trajectory (desktop horizontal version;
    a second path or CSS `transform` rotation handles mobile).
  - Token uses `offset-path: path(...)` with `offset-distance` keyframed
    `0% → 100%` over 7s, `infinite`.
  - Each station has a CSS animation with the same 7s+1s duration and a
    staggered `animation-delay` that turns it active at the right moment
    and holds it active until the loop restarts.
  - Stamps on the token are 5 small chips with `opacity` keyframed to
    appear at their respective station times.
- Add `import PipelineTour from '../components/PipelineTour.astro';` and
  `<PipelineTour />` between `<Hero />` and `<Pillars />` in
  `src/pages/index.astro`.
- Renumber section labels in `Pillars.astro` and downstream sections so
  the `§ NN` sequence stays correct.
- Estimated size: one file, ~180–220 lines (template + scoped CSS).
- No new npm dependencies.

## Acceptance Criteria

1. Section renders between Hero and Pillars on `/` and matches the
   reference layout above on desktop and mobile.
2. Animation runs as one continuous 8s loop with the timeline specified.
3. Visual tokens (colors, border-radius, fonts, shadows) match
   `fabric-diagram` — no new design primitives introduced.
4. With `prefers-reduced-motion: reduce`, the section is fully static in
   the "done" end state.
5. Hovering or focusing within the section pauses the animation.
6. No JavaScript runtime cost (no `<script>` block in the component).
7. Existing `§ NN` labels across the page are renumbered consistently.

## Out of Scope (v1)

- Click-to-jump or keyboard step-through interaction.
- Real-time data feeds into badges.
- Parallax, particles, scroll-driven scrubbing.
- Repositioning the section based on A/B testing — manual move only.
