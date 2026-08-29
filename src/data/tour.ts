/**
 * Every Visdom appearance, in one place.
 *
 * Read by three things: the tour banner in the header, the tour section on the
 * webinar page, and /visdom-tour, which lists the whole schedule. A hand
 * maintained list duplicated across three templates is a list that goes stale
 * in two of them.
 *
 * Facts only. Event names, cities, dates and links are not translated, so they
 * live here rather than in the dictionary. Country names and the kind badges
 * are keys the dictionary maps for display.
 *
 * Past and upcoming stops live in the same list: the split is computed from
 * `date` at build time, so nothing is moved by hand when a stop is over. They
 * are all on the map, which is the point of a tour map. Marketing asked for it
 * in as many words: by December, a map of only what is left would be a couple
 * of lonely dots instead of a year of work.
 */

export type TourEventKind =
  | 'conference'
  | 'roundtable'
  | 'webinar'
  | 'hackathon'
  | 'meetup';

export type TourEvent = {
  /** Event name as its organizer writes it. Never translated. */
  name: string;
  city: string;
  /** Country key, mapped through t.visdomTour.countries for display. */
  country: string;
  /** Flag emoji, shown before the city. */
  flag: string;
  /** First day, ISO date. Orders the list and feeds <time datetime>. */
  date: string;
  /** Last day, ISO date, when the event runs longer than a day. */
  endDate?: string;
  /**
   * Month name as written in the dictionary's `tour.months` map. Used by the
   * compact banner, which has no room for a full date.
   */
  month: string;
  /** Clock time, printed as given. Only where a stop has one, e.g. the webinar. */
  time?: string;
  /** Where to read more. A stop with no page of its own has none. */
  href?: string;
  kind: TourEventKind;
};

/** The route the banner and the webinar page point at, without a locale prefix. */
export const TOUR_ROUTE = '/visdom-tour';

/**
 * The 2026 schedule, supplied by marketing.
 *
 * Two links look like typos and are not: the New York roundtable really is
 * served at /lp/rountable-usa-visdom (the correctly spelled URL 404s), and the
 * November and December Zurich roundtables share one landing page.
 */
export const TOUR_EVENTS: TourEvent[] = [
  {
    name: 'Roundtable AI in SDLC',
    city: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    date: '2026-03-26',
    month: 'March',
    kind: 'roundtable',
  },
  {
    name: 'Code Remix',
    city: 'Miami',
    country: 'USA',
    flag: '🇺🇸',
    date: '2026-05-11',
    endDate: '2026-05-13',
    month: 'May',
    href: 'https://coderemix.ai/',
    kind: 'conference',
  },
  {
    name: 'Roundtable AI in SDLC',
    city: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    date: '2026-05-29',
    month: 'May',
    kind: 'roundtable',
  },
  {
    name: 'NY Tech Week: From Copilot to Control Plane',
    city: 'New York',
    country: 'USA',
    flag: '🇺🇸',
    date: '2026-06-02',
    month: 'June',
    href: 'https://partiful.com/e/bn5h1g13xzOV6R5XkLaE',
    kind: 'meetup',
  },
  {
    name: 'NY Tech Week: How to write a book on AI',
    city: 'New York',
    country: 'USA',
    flag: '🇺🇸',
    date: '2026-06-02',
    month: 'June',
    href: 'https://partiful.com/e/M7pXmV8sOXT11yHb9pKw',
    kind: 'meetup',
  },
  {
    name: 'AI World Congress',
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    date: '2026-06-23',
    endDate: '2026-06-24',
    month: 'June',
    href: 'https://aiconference.london/',
    kind: 'conference',
  },
  {
    name: 'Energy Data Hackdays',
    city: 'Brugg-Windisch',
    country: 'Switzerland',
    flag: '🇨🇭',
    date: '2026-09-10',
    endDate: '2026-09-11',
    month: 'September',
    href: 'https://www.energydatahackdays.ch/',
    kind: 'hackathon',
  },
  {
    name: 'AGNTCon + MCPCon Europe',
    city: 'Amsterdam',
    country: 'Netherlands',
    flag: '🇳🇱',
    date: '2026-09-17',
    endDate: '2026-09-18',
    month: 'September',
    href: 'https://events.linuxfoundation.org/agntcon-mcpcon-europe/',
    kind: 'conference',
  },
  {
    name: 'Can your agents actually ship?',
    city: 'Online',
    country: 'Online',
    flag: '🌐',
    date: '2026-09-21',
    month: 'September',
    time: '15:00 CEST',
    href: '/webinar',
    kind: 'webinar',
  },
  {
    name: 'Roundtable AI in SDLC',
    city: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    date: '2026-09-23',
    month: 'September',
    href: 'https://virtuslab.com/lp/roundtable-zurich-september-23',
    kind: 'roundtable',
  },
  {
    name: 'GTM2026',
    city: 'New York',
    country: 'USA',
    flag: '🇺🇸',
    date: '2026-09-28',
    endDate: '2026-10-01',
    month: 'September',
    href: 'https://attendgtm.com/',
    kind: 'conference',
  },
  {
    name: 'Visdom Roundtable AI-native SDLC',
    city: 'New York',
    country: 'USA',
    flag: '🇺🇸',
    date: '2026-10-05',
    month: 'October',
    href: 'https://virtuslab.com/lp/rountable-usa-visdom',
    kind: 'roundtable',
  },
  {
    name: 'Scala Days 2026',
    city: 'Berlin',
    country: 'Germany',
    flag: '🇩🇪',
    date: '2026-10-11',
    month: 'October',
    href: 'https://scaladays.org/',
    kind: 'conference',
  },
  {
    name: 'AI Engineer New York',
    city: 'New York',
    country: 'USA',
    flag: '🇺🇸',
    date: '2026-10-12',
    endDate: '2026-10-14',
    month: 'October',
    href: 'https://ai.engineer/nyc/2026',
    kind: 'conference',
  },
  {
    name: 'Dev2Next Conference',
    city: 'Lone Tree',
    country: 'USA',
    flag: '🇺🇸',
    date: '2026-10-12',
    endDate: '2026-10-15',
    month: 'October',
    href: 'https://www.dev2next.com/',
    kind: 'conference',
  },
  {
    name: 'BazelCon',
    city: 'Amsterdam',
    country: 'Netherlands',
    flag: '🇳🇱',
    date: '2026-10-14',
    endDate: '2026-10-15',
    month: 'October',
    href: 'https://events.linuxfoundation.org/bazelcon/',
    kind: 'conference',
  },
  {
    name: 'BazelCon afterparty by VirtusLab & EngFlow',
    city: 'Amsterdam',
    country: 'Netherlands',
    flag: '🇳🇱',
    date: '2026-10-14',
    month: 'October',
    kind: 'meetup',
  },
  {
    name: 'FuncProgConf',
    city: 'Stockholm',
    country: 'Sweden',
    flag: '🇸🇪',
    date: '2026-10-14',
    month: 'October',
    href: 'https://funcprogconf.com/',
    kind: 'conference',
  },
  {
    name: 'Austin Tech Week',
    city: 'Austin',
    country: 'USA',
    flag: '🇺🇸',
    date: '2026-10-26',
    endDate: '2026-10-30',
    month: 'October',
    href: 'https://www.austintech.com/',
    kind: 'conference',
  },
  {
    // Title and clock time are not settled yet. Marketing put the date in the
    // brief so it shows on the schedule; both fill in when the session does.
    name: 'Online webinar',
    city: 'Online',
    country: 'Online',
    flag: '🌐',
    date: '2026-11-05',
    month: 'November',
    href: '/webinar',
    kind: 'webinar',
  },
  {
    name: 'Swiss AI Summit',
    city: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    date: '2026-11-16',
    month: 'November',
    href: 'https://www.swissaisummit.com/',
    kind: 'conference',
  },
  {
    name: 'Roundtable AI in SDLC',
    city: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    date: '2026-11-17',
    month: 'November',
    href: 'https://virtuslab.com/lp/swiss-community',
    kind: 'roundtable',
  },
  {
    // The second edition of the one we spoke at in June, which is why the name
    // appears twice in this list.
    name: 'AI World Congress',
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    date: '2026-11-25',
    endDate: '2026-11-26',
    month: 'November',
    href: 'https://aiconference.london/',
    kind: 'conference',
  },
  {
    name: 'Roundtable AI in SDLC',
    city: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    date: '2026-12-10',
    month: 'December',
    href: 'https://virtuslab.com/lp/swiss-community',
    kind: 'roundtable',
  },
];

/**
 * Where each city sits, and where its label sits next to it.
 *
 * Latitude and longitude are the real ones. `dx` and `dy` place the label
 * relative to the dot, in map units (one unit is one degree), because at world
 * scale Europe puts six stops inside a thumbnail and no automatic placement
 * beats reading the render.
 *
 * `nudge` moves the DOT itself, and only where two stops are closer together
 * than the dot is wide: Brugg-Windisch and Zurich are 25 km apart and would
 * otherwise print as one circle. Nothing else may use it.
 */
export type CityPlacement = {
  lat: number;
  lon: number;
  /** Label offset from the dot, in map units. */
  dx: number;
  dy: number;
  /** Which end of the label sits at dx. */
  anchor: 'start' | 'end';
  nudge?: [number, number];
};

export const CITY_PLACEMENT: Record<string, CityPlacement> = {
  'Lone Tree': { lat: 39.55, lon: -104.87, dx: -5, dy: 0, anchor: 'end' },
  Miami: { lat: 25.77, lon: -80.19, dx: 5, dy: 3, anchor: 'start' },
  Austin: { lat: 30.27, lon: -97.74, dx: -5, dy: 3.5, anchor: 'end' },
  'New York': { lat: 40.71, lon: -74.01, dx: 5, dy: 2, anchor: 'start' },
  London: { lat: 51.51, lon: -0.13, dx: -6, dy: 4, anchor: 'end' },
  Amsterdam: { lat: 52.37, lon: 4.9, dx: -8, dy: -4, anchor: 'end' },
  Stockholm: { lat: 59.33, lon: 18.06, dx: 6, dy: -3, anchor: 'start' },
  Berlin: { lat: 52.52, lon: 13.4, dx: 8, dy: -4, anchor: 'start' },
  Zurich: { lat: 47.37, lon: 8.54, dx: 8, dy: 9, anchor: 'start' },
  'Brugg-Windisch': { lat: 47.48, lon: 8.21, dx: 10, dy: 2.5, anchor: 'start', nudge: [-1.2, 1.2] },
};

/**
 * Photos from the road, shown above the stops that have already happened.
 *
 * `alt` is a key into t.visdomTour.gallery.alt: the file name is layout, the
 * description is copy a reader hears.
 */
export const TOUR_PHOTOS = [
  { src: '/track-record-tour.jpg', width: 2000, height: 1431, alt: 'team' },
  { src: '/tour-aiworld-booth.jpg', width: 1600, height: 1200, alt: 'booth' },
  { src: '/tour-aiworld-stage.jpg', width: 1000, height: 1333, alt: 'stage' },
] as const;

/** True once the last day of the event is behind `now`. */
export function isPast(event: TourEvent, now = new Date()): boolean {
  const last = new Date(`${event.endDate ?? event.date}T23:59:59Z`);
  return last.getTime() < now.getTime();
}

/** The schedule in date order, oldest first. */
export function byDate(events: TourEvent[] = TOUR_EVENTS): TourEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

/** Stops still ahead of us, nearest first. */
export function upcoming(now = new Date()): TourEvent[] {
  return byDate().filter((event) => !isPast(event, now));
}

/**
 * What the header banner shows: the next four stops, the first one badged.
 *
 * Derived rather than written out, so the banner cannot advertise a city the
 * schedule no longer has. It is computed when the page is built, which is the
 * one caveat: a deploy that sits untouched past a stop keeps showing it until
 * the next build.
 */
export type TourStop = {
  city: string;
  flag: string;
  /** Month or date label, e.g. "May" or "23 September". */
  when: string;
  status: 'past' | 'next' | 'upcoming';
};

export function bannerStops(now = new Date()): TourStop[] {
  return upcoming(now)
    .slice(0, 4)
    .map((event, i) => ({
      city: event.city,
      flag: event.flag,
      when: event.month,
      status: i === 0 ? ('next' as const) : ('upcoming' as const),
    }));
}

/** Kept for components that read a plain list. Evaluated once, at build time. */
export const TOUR_STOPS: TourStop[] = bannerStops();
