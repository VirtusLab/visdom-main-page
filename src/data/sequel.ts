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

/**
 * Both ids can come from the environment, so plugging in a real event is a
 * Vercel env var and a redeploy rather than a code change:
 *
 *   PUBLIC_SEQUEL_EVENT_ID    the session to embed
 *   PUBLIC_SEQUEL_COMPANY_ID  the workspace, for the event grid
 *
 * Locally: PUBLIC_SEQUEL_EVENT_ID=<id> npm run dev
 *
 * They are PUBLIC_ on purpose. Sequel ids are not secrets: they ship in the
 * HTML of every embed. Deliberately not read from a query string, which would
 * let anyone frame arbitrary content on our domain.
 */
export const SEQUEL: SequelConfig = {
  companyId: import.meta.env.PUBLIC_SEQUEL_COMPANY_ID ?? '',
  eventId: import.meta.env.PUBLIC_SEQUEL_EVENT_ID ?? '',
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

/** Origin the embed posts from. Messages from anywhere else are ignored. */
export const SEQUEL_ORIGIN = 'https://embed.sequel.io';

/*
 * The frame talks to the host page over postMessage, shaped
 * { event: <name>, data: { ...fields } }. The names it sends:
 *
 *   initialized      initialized, sessionId
 *   event-loaded     role, eventId
 *   user-registered  firstname, lastname, email, eventId   <- the conversion
 *   event-started    role
 *   event-ended      role
 *   cta-updated      showing, role, title, link, description, buttonText, uid
 *   drawer-changed   opened
 *
 * user-registered is the one that matters: it is what replaces the mailto CTA,
 * and the only way a signup becomes a GA4 conversion. Note it hands us an email
 * address client-side, so anything beyond firing an event needs a decision.
 */
