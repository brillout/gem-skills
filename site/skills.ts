/** The data behind every page, ../skills.json, and what the pages derive from it. */

import raw from "../skills.json";
import { esc, href } from "./format.ts";
import { github, type Data, type Facet, type Registry, type Skill, type Tldr } from "./types.ts";

export const data = raw as unknown as Data;
export const GITHUB = "https://github.com/brillout/gemskills";

export const facetById = new Map(data.facets.map((f) => [f.id, f]));
export const repoById = new Map(data.repos.map((r) => [r.id, r]));
export const categoryById = new Map(data.categories.map((c) => [c.id, c]));
export const skillById = new Map(data.skills.map((s) => [s.id, s]));
export const REGISTRIES: Record<Registry, string> = {
  "skills.sh": "skills.sh",
  "clawhub.ai": "ClawHub",
  "skillhub.cn": "Tencent SkillHub",
};
export const registriesOf = (s: Skill) =>
  (Object.keys(REGISTRIES) as Registry[]).filter((r) => s[r]);

/** Tags are `facet:value`, except topics, which are written without a prefix. */
export const tagOf = (facet: Facet, value: string) =>
  facet.prefix === false ? value : `${facet.id}:${value}`;
export const facetOf = (tag: string) =>
  tag.includes(":") ? tag.slice(0, tag.indexOf(":")) : "topic";
export const tagInfo = new Map<string, string>();
for (const facet of data.facets)
  for (const v of facet.values) if (v.description) tagInfo.set(tagOf(facet, v.id), v.description);

/** The order facets appear in, wherever they're listed. */
export const FACET_ORDER = ["type", "effect", "needs", "by", "topic", "stack", "flag", "lang"];
/** Tags that call for a look before installing. */
export const CAUTION = ["flag:republished", "flag:deprecated"];

/** The GitHub repo a skill lives in, or else its publisher: the id without the skill's own name, such as `clawhub.ai/steipete`. */
export const repoKey = (s: Skill) => github(s)?.repo ?? s.id.slice(0, s.id.lastIndexOf("/"));
export const starsOf = (s: Skill) => {
  const repo = github(s)?.repo;
  return repo ? (repoById.get(repo)?.stars ?? null) : null;
};
export const installsOf = (s: Skill) => s["skills.sh"]?.installs ?? null;
export const firstSeenOf = (s: Skill) => s["skills.sh"]?.firstSeen ?? null;
/** The registries that count downloads rather than installs. */
export const DOWNLOADS = ["clawhub.ai", "skillhub.cn"] as const;
export const downloadsOf = (s: Skill) => {
  const n = DOWNLOADS.flatMap((r) => s[r]?.downloads ?? []);
  return n.length ? Math.max(...n) : null;
};

/** Compare for a descending sort, unknown values last. */
export const desc = (a: number | null, b: number | null) => (b ?? -1) - (a ?? -1);

/** The skill's own page. */
export const skillHref = (id: string) =>
  href(`skill/${id.split("/").map(encodeURIComponent).join("/")}/`);

/** A TLDR's glance as a list of labelled facts, or its first `max` items. */
export function glanceHtml(glance: Tldr["glance"], max = glance.length): string {
  const items = glance
    .slice(0, max)
    .map(({ label, text }) => `<div><dt>${esc(label)}</dt><dd>${esc(text)}</dd></div>`);
  return `<dl class="glance">${items.join("")}</dl>`;
}

/** A tag, as a link to `link`, or with no link as a toggle for the skills list's filters. */
export function tagChip(tag: string, link: string | null, pressed = false): string {
  const info = tagInfo.get(tag);
  const attrs = `class="tag" data-tag="${esc(tag)}" data-facet="${esc(facetOf(tag))}"${info ? ` title="${esc(info)}"` : ""}`;
  return link === null
    ? `<button type="button" ${attrs} aria-pressed="${pressed}">${esc(tag)}</button>`
    : `<a ${attrs} href="${link}">${esc(tag)}</a>`;
}
