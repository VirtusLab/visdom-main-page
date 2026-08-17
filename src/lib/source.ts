/**
 * Where a contact-form submission came from.
 *
 * The same HubSpot form is shared by every property that hosts this form, because
 * duplicating it would split the submission history and double the settings that
 * can silently drift apart. The cost of sharing it is that a lead arrives with no
 * inherent hint of its origin, so that hint has to be attached explicitly.
 *
 * It rides in the submission CONTEXT (`pageUri`, `pageName`), never in a form
 * field. Context is metadata HubSpot records next to the submission, so the form
 * definition stays untouched and a new property needs no HubSpot change at all.
 *
 * Pure functions on purpose: every branch here is unit tested, because the failure
 * mode is a lead that is attributed to the wrong property, which nothing
 * downstream would ever flag.
 */

export interface Source {
  /** Machine-readable, safe to put in a log line or a template variable. */
  slug: string;
  /** Human-readable, used where a person reads it. */
  label: string;
  /** True when the page named itself rather than being classified by hostname. */
  declared: boolean;
}

/** Properties that may host the form, keyed by hostname. */
export const SOURCES: Record<string, { slug: string; label: string }> = {
  'visdom.virtuslab.com': { slug: 'visdom-site', label: 'Visdom site' },
  'visdom-maturity-matrix.virtuslab.com': {
    slug: 'maturity-matrix',
    label: 'Visdom Maturity Matrix',
  },
};

export const UNKNOWN_SOURCE = { slug: 'unknown', label: 'Unknown property' };

/**
 * The shape a caller-supplied slug must have. Deliberately narrow: this string is
 * echoed into a CRM record and into the team's notification email, and the
 * endpoint is unauthenticated, so anything outside this shape is discarded rather
 * than sanitised. There is no clever encoding left to reason about.
 */
const SOURCE_RE = /^[a-z0-9][a-z0-9-]{0,39}$/;

function hostOf(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value).hostname;
  } catch {
    return undefined;
  }
}

export interface RequestContext {
  origin: string | null;
  referer: string | null;
  url: string;
}

/**
 * Resolve the origin property of a submission.
 *
 * Order matters. The page states its own identity first, because only it knows
 * whether it is the Matrix landing page or an embed of it somewhere else. Headers
 * are the fallback: Origin for a cross-origin post, then Referer, then the host
 * serving the endpoint, which is the right answer when page and endpoint ship
 * together.
 *
 * A caller-supplied slug is trusted for LABELLING ONLY. It cannot change where the
 * lead goes, who is notified, or whether the CRM write happens.
 */
export function resolveSource(ctx: RequestContext, explicit?: string): Source {
  const host = hostOf(ctx.origin) ?? hostOf(ctx.referer) ?? hostOf(ctx.url);
  const known = host ? SOURCES[host] : undefined;
  const slug = (explicit ?? '').trim();

  if (slug && SOURCE_RE.test(slug)) {
    // A known slug keeps its canonical label. An unrecognised but well-formed one
    // is still recorded, so a new property reports itself correctly before this
    // table learns about it. The label is always derived, never taken from the
    // caller.
    const canonical = Object.values(SOURCES).find((s) => s.slug === slug);
    if (canonical) return { ...canonical, declared: true };
    return { slug, label: known?.label ?? slug, declared: true };
  }

  return { ...(known ?? UNKNOWN_SOURCE), declared: false };
}

/**
 * Which page the request came from. The referer is caller-controlled and ends up
 * in a CRM record and in a notification body, so it is used only when it parses as
 * a web URL, and it is capped. Anything else falls back to the endpoint's own URL.
 */
export function pageUriOf(ctx: RequestContext): string {
  try {
    const url = new URL(ctx.referer ?? '');
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString().slice(0, 500);
  } catch {
    // Absent or unparseable, which is the common case for a native form post.
  }
  return ctx.url.slice(0, 500);
}

/**
 * Cross-origin access, off unless someone turns it on.
 *
 * Needed only when a page on another property posts to this endpoint directly
 * instead of shipping its own copy. An explicit allow-list rather than a wildcard,
 * because the endpoint is unauthenticated and writes to the CRM: a wildcard would
 * invite every page on the internet to submit leads through us.
 *
 * An unset variable permits no cross-origin caller, which is where every
 * deployment starts.
 */
export function allowedOrigin(origin: string | null, configured: string | undefined): string | undefined {
  if (!origin || !configured) return undefined;
  const trim = (s: string) => s.trim().replace(/\/$/, '');
  const list = configured.split(',').map(trim).filter(Boolean);
  return list.includes(trim(origin)) ? origin : undefined;
}
