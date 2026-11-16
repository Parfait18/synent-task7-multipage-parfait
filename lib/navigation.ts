/**
 * Whether a navigation item points to the page being viewed.
 *
 * The home link only matches "/" exactly; other links also match their
 * sub-paths (for example "/services/retrofit" keeps "Services" active), so
 * the rule keeps working if a section grows child pages.
 */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const normalised = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (href === "/") return normalised === "/";
  return normalised === href || normalised.startsWith(`${href}/`);
}
