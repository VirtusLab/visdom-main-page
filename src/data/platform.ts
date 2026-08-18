/**
 * The six platform components, in the order they appear on the home page.
 *
 * One source for three things that must not drift apart: the section anchors in
 * Solutions.astro, the nav dropdown, and the deep links campaigns point at. A
 * nav entry aimed at an anchor that does not exist scrolls nowhere and looks
 * exactly like a working one, so neither side gets to keep its own copy of this
 * list.
 *
 * The ids are PUBLIC URLs. An ad that promises code review links straight to
 * /#code-review, so renaming one quietly breaks every ad already running against
 * it. Adding is free; renaming is a conversation with whoever owns the campaign.
 *
 * `key` indexes t.solutions, whose titles carry the "Visdom " brand prefix.
 */
export const PLATFORM_COMPONENTS = [
  { id: 'context-fabric', key: 'fabric' },
  { id: 'code-review', key: 'review' },
  { id: 'testing', key: 'testing' },
  { id: 'ai-tracing', key: 'tracing' },
  { id: 'security', key: 'security' },
  { id: 'machine-ci', key: 'machineCi' },
] as const;

/**
 * "Visdom Code Review" -> "Code Review".
 *
 * Six menu items each opening with the same word is noise, and the menu already
 * hangs off a trigger that says Platform. Product names are English in every
 * locale, so stripping the prefix is correct in all of them; a title without the
 * prefix is returned unchanged.
 */
export function shortName(title: string): string {
  return title.replace(/^Visdom\s+/, '');
}
