/**
 * Single source of truth for the webinar invitation page (/webinar).
 *
 * Everything an organiser changes between editions of the session lives here:
 * the date, the registration link, the host. The page degrades gracefully while
 * fields are still unknown. A missing date renders as "To be announced" and the
 * schema.org Event block is withheld (Google rejects an Event with no
 * startDate); a missing registration link falls back to a mailto so the CTA is
 * never a dead end.
 */

export type WebinarConfig = {
  title: string;
  /** One-line positioning, used for the page description and social cards. */
  subtitle: string;
  /** ISO 8601 start, e.g. "2026-09-17T13:00:00Z". Keep null until confirmed. */
  startsAt: string | null;
  /** IANA zone the clock time is rendered in. */
  timezone: string;
  /** Short label printed after the time, e.g. "CEST". */
  timezoneLabel: string;
  durationMinutes: number;
  /** Zoom / HubSpot / Livestorm link. Empty falls back to contactEmail. */
  registrationUrl: string;
  contactEmail: string;
  host: {
    name: string;
    role: string;
    company: string;
    /**
     * Optional one-line addition under the brief's own host paragraph. This is
     * the only place on the page where copy may go beyond the campaign brief.
     * Set to "" to hide it.
     */
    note: string;
    /** Put the headshot at public/webinar-host.jpg. Until then: initials plate. */
    photo: string;
  };
};

export const WEBINAR: WebinarConfig = {
  title: 'Can your agents actually ship?',
  subtitle:
    'AI coding assistants can write code. But can they actually deliver software? Join our live session on turning AI-assisted delivery into an agent-operable SDLC.',
  // Copy of the schedule in Sequel (the source of truth). If the event moves
  // in Sequel, this must move with it. 16:00 CEST = 14:00 UTC.
  startsAt: '2026-09-16T14:00:00Z',
  timezone: 'Europe/Warsaw',
  timezoneLabel: 'CEST',
  durationMinutes: 60,
  registrationUrl: '',
  contactEmail: 'visdom@virtuslab.com',
  host: {
    name: 'Artur Skowroński',
    role: 'Head of Application Development',
    company: 'VirtusLab',
    note: 'Artur also writes the JVM Weekly newsletter.',
    photo: '/webinar-host.jpg',
  },
};

export type Speaker = {
  name: string;
  /** Empty renders the card without a role line until the copy is confirmed. */
  role: string;
  company: string;
  /** 2-3 sentences. Empty hides the bio until the edited copy arrives. */
  bio: string;
  /** Full profile URL. Empty hides the link. */
  linkedin: string;
  /** Photo path under public/. Initials plate renders until the file exists. */
  photo: string;
};

/**
 * The session's speaker roster, in billing order. Photos and edited bios are
 * coming from marketing; the empty fields render nothing until filled, so the
 * section ships in a presentable placeholder state.
 */
export const SPEAKERS: Speaker[] = [
  {
    name: 'Artur Skowroński',
    role: 'Head of Application Development',
    company: 'VirtusLab',
    bio:
      'Artur will demonstrate how Visdom transforms AI-assisted software delivery into an agent-operable SDLC: how AI agents can safely navigate the entire delivery lifecycle with the context, validation, governance, and orchestration they need to ship production-ready software. He also writes the JVM Weekly newsletter.',
    linkedin: 'https://www.linkedin.com/in/arturskowronski/',
    photo: '/webinar-host.jpg',
  },
  {
    name: 'Krzysztof Grajek',
    role: '',
    company: 'SoftwareMill',
    bio: '',
    linkedin: 'https://www.linkedin.com/in/krzysztofgrajek/',
    photo: '/speakers/krzysztof-grajek.jpg',
  },
  {
    name: 'Adam Warski',
    role: 'Chief R&D Officer',
    company: 'SoftwareMill',
    bio: '',
    linkedin: 'https://www.linkedin.com/in/adamwarski/',
    photo: '/speakers/adam-warski.jpg',
  },
];

/** Where the "Reserve your spot" button points. Never empty. */
export function registrationHref(w: WebinarConfig = WEBINAR): string {
  if (w.registrationUrl) return w.registrationUrl;
  return `mailto:${w.contactEmail}?subject=${encodeURIComponent(
    `Webinar registration: ${w.title}`,
  )}`;
}

/** Human date for the session card. "To be announced" while the date is open. */
export function formatSessionDate(w: WebinarConfig = WEBINAR): string {
  if (!w.startsAt) return 'To be announced';
  const d = new Date(w.startsAt);
  const date = d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: w.timezone,
  });
  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: w.timezone,
  });
  return `${date}, ${time} ${w.timezoneLabel}`;
}

/** Two-letter plate shown until a headshot is in place. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}

/** Kept for pages that still read the single-host config. */
export function hostInitials(w: WebinarConfig = WEBINAR): string {
  return initials(w.host.name);
}
