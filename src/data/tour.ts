/**
 * Visdom AI Tour stops, in one place.
 *
 * The list used to live inline in TourBanner.astro. It is now read by both the
 * banner and the webinar page, and a hand-maintained list duplicated in two
 * templates is a list that goes stale in one of them.
 *
 * Add a stop by adding a row here. Exactly one row should carry
 * status: 'next' - it is the one the banner badges and the webinar page marks
 * as the upcoming stop.
 */

export type TourStop = {
  city: string;
  /** Country flag emoji shown before the city. */
  flag: string;
  /** Month or date label, e.g. "May" or "23 September". */
  when: string;
  status: 'past' | 'next' | 'upcoming';
};

export const TOUR_HREF = 'https://virtuslab.com/lp/visdom-tour-2026';

export const TOUR_STOPS: TourStop[] = [
  { city: 'Zurich', flag: '🇨🇭', when: 'May', status: 'past' },
  { city: 'New York', flag: '🇺🇸', when: 'June', status: 'past' },
  { city: 'New York', flag: '🇺🇸', when: 'September', status: 'next' },
  { city: 'San Francisco', flag: '🇺🇸', when: 'October', status: 'upcoming' },
];
