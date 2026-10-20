/** Formatting and links shared by every page. */

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** 3.5M, 907K, 54.5K, 812 */
export function compact(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1e5) return `${Math.round(n / 1e3)}K`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}
const longDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export const date = (iso: string) => longDate.format(new Date(`${iso}T00:00:00Z`));
export const plural = (n: number, word: string) =>
  `${n.toLocaleString("en")} ${word}${n === 1 ? "" : "s"}`;

/** A path on this site, under the base it's served from (such as `/gemskills/` on GitHub Pages). */
export const href = (path = "") => `${import.meta.env.BASE_URL}${path}`;
