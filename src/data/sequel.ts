/**
 * Sequel.io embed configuration for the /webinar-sequel spike.
 *
 * Sequel (https://sequel.io) hosts the webinar but renders it inside our own
 * page, so the session runs on visdom.virtuslab.com instead of sending people
 * to a Zoom or Livestorm domain. That is the whole reason to look at it: the
 * registration, the live room and the on-demand replay all stay on our domain,
 * which keeps the analytics first-party and the funnel unbroken.
 *
 * Two IDs are needed and both come from the Sequel admin dashboard:
 *   companyId  one per workspace, used by the event grid
 *   eventId    one per session, used by the single-event embed
 *
 * Until they are filled in, the page renders its placeholder states instead of
 * a broken iframe. Nothing here is a secret: these IDs are public identifiers
 * that ship in the HTML of any Sequel embed.
 */

export type SequelConfig = {
  /** Sequel workspace id. Empty disables the event grid section. */
  companyId: string;
  /** Sequel event id for the session we embed. Empty disables the stage. */
  eventId: string;
  /**
   * Load the iframe only after an explicit click. Sequel asks for camera and
   * microphone permissions and sets its own cookies, so on a page that carries
   * a consent banner it should not phone home before the reader asks for it.
   * It also keeps the third-party frame out of the initial page load.
   */
  clickToLoad: boolean;
};

export const SEQUEL: SequelConfig = {
  companyId: '',
  eventId: '',
  clickToLoad: true,
};

/** Base host for the single-event embed. */
const EMBED_HOST = 'https://embed.sequel.io';

/** Toolkit bundle, needed only for the event grid. Loaded as a module. */
export const SEQUEL_TOOLKIT_SRC =
  'https://prod-assets.sequelvideo.com/uploads/toolkit/sequel.js';

/**
 * The permissions the live room needs. Sequel documents exactly this set: the
 * audience uses the mic and camera when they come on stage, and screen share
 * needs display-capture.
 */
export const SEQUEL_IFRAME_ALLOW =
  'camera *; microphone *; autoplay; display-capture *; picture-in-picture';

/** Embed URL for one event, or null when no event id is configured yet. */
export function sequelEventUrl(config: SequelConfig = SEQUEL): string | null {
  if (!config.eventId) return null;
  return `${EMBED_HOST}/event/${encodeURIComponent(config.eventId)}`;
}

export function isConfigured(config: SequelConfig = SEQUEL): boolean {
  return Boolean(config.eventId);
}

/**
 * The postMessage events Sequel's iframe emits, with the payload fields we
 * would actually read. This is the integration surface: it is how the embed
 * tells the host page that someone registered or that the session started, and
 * the only way those become GA4 conversions on our side.
 *
 * Shape on the wire: { event: <name>, data: { ...fields } }
 */
export const SEQUEL_EVENTS = [
  {
    name: 'initialized',
    fields: 'initialized, sessionId',
    meaning: 'The embed is up. Nothing to report yet.',
  },
  {
    name: 'event-loaded',
    fields: 'role, eventId',
    meaning: 'The session page rendered. Good place for a page-level view.',
  },
  {
    name: 'user-registered',
    fields: 'firstname, lastname, email, eventId',
    meaning: 'The conversion. This is the one that matters: it replaces the mailto CTA.',
  },
  {
    name: 'event-started',
    fields: 'role',
    meaning: 'Going live. Separates registrants from actual attendees.',
  },
  {
    name: 'event-ended',
    fields: 'role',
    meaning: 'Session over. The replay takes over at the same URL.',
  },
  {
    name: 'cta-updated',
    fields: 'showing, role, title, link, description, buttonText, uid',
    meaning: 'The host pushed an in-session CTA. Worth tracking as its own click.',
  },
  {
    name: 'drawer-changed',
    fields: 'opened',
    meaning: 'Chat or Q&A panel toggled. Engagement signal, low value on its own.',
  },
] as const;
