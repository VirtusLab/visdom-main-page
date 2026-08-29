/**
 * Dates for the tour, formatted once and shared by everything that prints one.
 *
 * The schedule stores calendar days, not instants, so every formatter runs in
 * UTC: rendered in a negative offset, `2026-09-10` would print as the 9th.
 */

export type DatedStop = { date: string; endDate?: string };

export interface TourDates {
  /** A single day, or a range collapsed onto one month: "10-11 September 2026". */
  human(stop: DatedStop): string;
}

export function tourDates(locale: string): TourDates {
  const tag = locale === 'pl' ? 'pl-PL' : 'en-GB';
  const full = new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const dayOnly = new Intl.DateTimeFormat(tag, { day: 'numeric', timeZone: 'UTC' });
  const dayAndMonth = new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });

  return {
    human(stop) {
      // Noon, so nothing can round to the neighbouring day.
      const start = new Date(`${stop.date}T12:00:00Z`);
      if (!stop.endDate) return full.format(start);
      const end = new Date(`${stop.endDate}T12:00:00Z`);
      // A range inside one month prints the month once: "10-11 September 2026".
      // One that crosses a month prints both months but one year:
      // "28 September - 1 October 2026".
      const sameMonth = stop.date.slice(0, 7) === stop.endDate.slice(0, 7);
      if (sameMonth) return `${dayOnly.format(start)}-${full.format(end)}`;
      return `${dayAndMonth.format(start)} - ${full.format(end)}`;
    },
  };
}
