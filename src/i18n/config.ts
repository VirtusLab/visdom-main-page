/**
 * Locale plumbing: which locales exist, how a path maps between them, and the
 * per-locale metadata the document head needs.
 *
 * Everything here is pure path math over `Astro.url.pathname`. We resolve the
 * locale ourselves rather than leaning on `Astro.currentLocale` because this
 * site is served from two different bases (root on Vercel, /visdom-main-page/
 * on GitHub Pages) and the base has to be stripped before the first path
 * segment means anything.
 */

export const LOCALES = ['en', 'pl'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_META: Record<
  Locale,
  {
    /** `<html lang>` and hreflang value. */
    lang: string;
    /** Label in the language switcher. */
    label: string;
    /** Full language name, for the switcher's accessible name. */
    name: string;
    /** Open Graph locale. */
    ogLocale: string;
    /** `data-culture` for the Cookie Information banner. */
    cookieCulture: string;
  }
> = {
  en: {
    lang: 'en',
    label: 'EN',
    name: 'English',
    ogLocale: 'en_US',
    cookieCulture: 'EN',
  },
  pl: {
    lang: 'pl',
    label: 'PL',
    name: 'Polski',
    ogLocale: 'pl_PL',
    cookieCulture: 'PL',
  },
};

/**
 * Routes that exist in every locale, written without a locale prefix.
 *
 * Only these emit hreflang alternates and only these show the language
 * switcher. Pointing hreflang at a URL that 404s is worse than shipping no
 * hreflang at all, so a page joins this list on the commit that translates it.
 */
export const TRANSLATED_ROUTES = ['/', '/visdom-tour'] as const;

/** The configured base, always with a leading and trailing slash. */
export function base(): string {
  const raw = import.meta.env.BASE_URL || '/';
  const withLead = raw.startsWith('/') ? raw : `/${raw}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

/** Drops the deploy base from a pathname, leaving a route that starts with "/". */
function stripBase(pathname: string): string {
  const b = base();
  const withLead = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (b !== '/' && withLead.startsWith(b)) return `/${withLead.slice(b.length)}`;
  if (b !== '/' && `${withLead}/` === b) return '/';
  return withLead;
}

/** Normalizes a route to a leading slash and no trailing slash (except root). */
function normalizeRoute(route: string): string {
  const withLead = route.startsWith('/') ? route : `/${route}`;
  const trimmed = withLead.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** The locale a pathname belongs to, from its first segment after the base. */
export function localeOf(pathname: string): Locale {
  const [, first] = normalizeRoute(stripBase(pathname)).split('/');
  return (LOCALES as readonly string[]).includes(first)
    ? (first as Locale)
    : DEFAULT_LOCALE;
}

/** The locale-less route for a pathname: "/pl/webinar" and "/webinar" both give "/webinar". */
export function routeOf(pathname: string): string {
  const route = normalizeRoute(stripBase(pathname));
  const locale = localeOf(pathname);
  if (locale === DEFAULT_LOCALE) return route;
  const rest = route.slice(`/${locale}`.length);
  return normalizeRoute(rest || '/');
}

/** Builds the site-relative href for a route in a given locale. */
export function localePath(locale: Locale, route = '/'): string {
  const clean = normalizeRoute(route).replace(/^\//, '');
  const prefix = locale === DEFAULT_LOCALE ? '' : `${locale}/`;
  return `${base()}${prefix}${clean}`;
}

/** True when the route is available in every locale. */
export function isTranslatedRoute(route: string): boolean {
  return (TRANSLATED_ROUTES as readonly string[]).includes(normalizeRoute(route));
}

/**
 * hreflang alternates for a pathname, or an empty list when the page has no
 * translation. `x-default` points at the default locale.
 */
export function alternatesFor(
  pathname: string,
): Array<{ locale: Locale; hreflang: string; path: string }> {
  const route = routeOf(pathname);
  if (!isTranslatedRoute(route)) return [];
  const alternates = LOCALES.map((locale) => ({
    locale,
    hreflang: LOCALE_META[locale].lang,
    path: localePath(locale, route),
  }));
  return [
    ...alternates,
    {
      locale: DEFAULT_LOCALE,
      hreflang: 'x-default',
      path: localePath(DEFAULT_LOCALE, route),
    },
  ];
}
