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
  startsAt: null,
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

/** Two-letter plate shown until the host headshot is in place. */
export function hostInitials(w: WebinarConfig = WEBINAR): string {
  return w.host.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}
