# Localization

English lives at `/`, Polish at `/pl/`. There is no Accept-Language redirect: it
breaks CDN caching, confuses crawlers, and takes the choice away from the
reader. People switch with the `EN | PL` control in the nav.

## Where things live

```
src/i18n/config.ts     locales, base-aware path math, per-locale head metadata,
                       and TRANSLATED_ROUTES
src/i18n/en/index.ts   English copy. This is the canonical shape.
src/i18n/pl/index.ts   Polish copy, checked against English
src/i18n/index.ts      useI18n(Astro) -> { locale, route, t }
```

A component gets its copy like this:

```astro
---
import { useI18n } from '../i18n';
const { t } = useI18n(Astro);
---
<h2>{t.shift.title}</h2>
```

`useI18n` resolves the locale from the URL, so nothing has to be threaded
through props and `src/pages/index.astro` and `src/pages/pl/index.astro` stay
four lines each. Both render `HomeSections.astro`, which owns the section order.

## What goes in the dictionary, and what does not

In: every string a reader can see or hear, including `alt` text, `aria-label`s,
and the text the contact form puts into an email.

Out: hrefs, colours, icons, SVG geometry, image filenames, and measured metric
values. Those pair with the dictionary by array position inside the component.
The rule is that a translator must not be able to break the layout or restate a
number.

Arrays that pair positionally with visual config are typed as fixed-length
tuples (`T4<...>`, `T6<...>`), so a translation with the wrong number of entries
fails the build instead of silently dropping a card.

## The build enforces the contract

`src/i18n/pl/index.ts` ends with `satisfies typeof en`. Vite transpiles `.ts`
without type-checking, so that alone would prove nothing at build time. The
`check:i18n` npm script runs `tsc` over the Polish dictionary and `build` runs
it first. A missing key, a typo, or a wrong-length array fails the build.

## Translation policy

Polish sentences, English industry vocabulary. Terms Polish engineers actually
use in Polish sentences stay in English: code review, pull request, CI, merge,
sandbox, deployment, property-based, mutation testing, stack, backlog.

Never translated:

- Visdom product names (Visdom Context Fabric, Visdom Code Review, Visdom
  Testing, Visdom Security, Visdom AI Tracing, Visdom Machine CI, Orchestrator,
  Coding Agent, Visdom Sandbox, Aikido).
- The Maturity Matrix's own vocabulary: L1-L5 level names and the four
  perspectives. The live matrix publishes them in English.
- Article titles. Their links point at English texts, so a translated title
  would promise something the destination does not deliver.
- Client descriptions and metric values in the track record.

The reader is addressed in the plural (`wasz`), consistently.

No em dashes anywhere, in any language. See `CLAUDE.md`.

## Adding a page in both locales

1. Create `src/pages/<route>.astro` and `src/pages/pl/<route>.astro`.
2. Add its copy to both dictionaries.
3. Add the locale-less path to `TRANSLATED_ROUTES` in `src/i18n/config.ts`.

Step 3 is what turns on the hreflang alternates and the language switcher for
that page. A page absent from the list renders in one locale with no alternates
advertised, which is what `/webinar` does today: pointing hreflang at a URL that
404s is worse than shipping no hreflang at all.

## Adding a locale

Add it to `LOCALES` and `LOCALE_META` in `src/i18n/config.ts`, add it to the
`locales` array in `astro.config.mjs`, create `src/i18n/<locale>/index.ts` with
`satisfies typeof en`, extend `check:i18n` to cover it, and add
`src/pages/<locale>/` copies of every translated route. `LOCALE_META` carries the
`<html lang>`, the hreflang value, the switcher labels, the Open Graph locale,
and the Cookie Information `data-culture`.

## Text in the architecture SVG

`ArchitectureFlow.astro` draws 32 `<text>` labels at fixed coordinates inside
fixed-width shapes. Polish runs 15 to 30 percent longer than English, so a
translation can overflow its pill.

When you change a label there, measure it. In the browser, on the page:

```js
const svg = document.querySelector('.af-svg');
const rects = [...svg.querySelectorAll('rect')].map((r) => ({
  x: +r.getAttribute('x'), y: +r.getAttribute('y'),
  w: +r.getAttribute('width'), h: +r.getAttribute('height'),
  cls: r.getAttribute('class'),
}));
svg.querySelectorAll('text').forEach((el) => {
  const b = el.getBBox(), cy = b.y + b.height / 2;
  const host = rects
    .filter((r) => r.w < 400 && cy >= r.y && cy <= r.y + r.h && b.x >= r.x - 4 && b.x <= r.x + r.w)
    .sort((a, c) => a.w - c.w)[0];
  if (host) {
    const slack = Math.round(host.x + host.w - (b.x + b.width));
    if (slack < 4) console.warn(el.textContent.trim(), host.cls, slack);
  }
});
```

Anything with negative slack overflows. Fix it by shortening the label or by
widening the shape, and remember that widening one shape can push into a
neighbouring path: the risk card and the "approved" elbow that leaves its right
edge have to move together.

## Deploy

Both locales are static pages, built by the same `astro build`. The GitHub Pages
workflow sets `SITE` and `BASE` for the `/visdom-main-page` subpath; every path
helper in `src/i18n/config.ts` is base-aware, so `/pl/` and its hreflang
alternates come out correct under either base.
