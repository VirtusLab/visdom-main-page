/**
 * The one entry point components use to get their copy.
 *
 * Usage inside any .astro component:
 *
 *   import { useI18n } from '../i18n';
 *   const { t, locale } = useI18n(Astro);
 *
 * `t` is the whole dictionary for the current locale, fully typed off the
 * English one, so `t.hero.headlineAccent` autocompletes and a typo is a build
 * error rather than an empty string on the page.
 */

import en from './en';
import pl from './pl';
import { DEFAULT_LOCALE, localeOf, routeOf, type Locale } from './config';

export type Dictionary = typeof en;

const DICTIONARIES: Record<Locale, Dictionary> = { en, pl };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/** Resolves locale, route and dictionary from an Astro component's context. */
export function useI18n(astro: { url: URL }): {
  locale: Locale;
  route: string;
  t: Dictionary;
} {
  const locale = localeOf(astro.url.pathname);
  return { locale, route: routeOf(astro.url.pathname), t: getDictionary(locale) };
}

/** Substitutes {name} placeholders in a dictionary string. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? values[key] : match,
  );
}

export * from './config';
