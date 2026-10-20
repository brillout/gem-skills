/**
 * The skills list: its filters, which live in the URL query so every filtered list can be shared
 * as a link, and its HTML. The page is pre-rendered unfiltered; its client script re-renders it.
 */

import { compact, date, esc, href, plural } from "./format.ts";
import {
  CAUTION,
  DOWNLOADS,
  FACET_ORDER,
  REGISTRIES,
  categoryById,
  data,
  desc,
  downloadsOf,
  facetById,
  facetOf,
  firstSeenOf,
  installsOf,
  registriesOf,
  repoById,
  repoKey,
  skillHref,
  starsOf,
  tagChip,
  tagInfo,
  tagOf,
} from "./skills.ts";
import { skipped, type Registry, type Skill } from "./types.ts";

/** Tags that hold for most skills; the list leaves them to the skill's page. */
const QUIET = new Set(["by:community"]);

// ------------------------------------------------------------------- state

export type Sort = "installs" | "downloads" | "stars" | "name" | "newest";
export interface State {
  q: string;
  cats: string[];
  tags: string[];
  registries: string[];
  repo: string | null;
  sort: Sort;
  /** One skill per repo: the most popular one stands for its bundle. */
  one: boolean;
  /** Hide republished copies. */
  hide: boolean;
  /** Show the skipped skills too, which the list leaves out unless asked for. */
  all: boolean;
}
export const SORTS: Record<Sort, string> = {
  installs: "Installs",
  downloads: "Downloads",
  stars: "Repo stars",
  name: "Name",
  newest: "Newest",
};

export function parse(search: string): State {
  const p = new URLSearchParams(search);
  const sort = p.get("sort") as Sort | null;
  return {
    q: p.get("q") ?? "",
    cats: p.getAll("cat"),
    tags: p.getAll("tag"),
    registries: p.getAll("registry"),
    repo: p.get("repo"),
    sort: sort && sort in SORTS ? sort : "installs",
    one: p.get("one") === "1",
    hide: p.get("hide") === "1",
    all: p.get("all") === "1",
  };
}
/** The query string for a state, empty for the unfiltered list. */
export function query(s: State): string {
  const p = new URLSearchParams();
  if (s.q) p.set("q", s.q);
  for (const c of s.cats) p.append("cat", c);
  for (const t of s.tags) p.append("tag", t);
  for (const r of s.registries) p.append("registry", r);
  if (s.repo) p.set("repo", s.repo);
  if (s.sort !== "installs") p.set("sort", s.sort);
  if (s.one) p.set("one", "1");
  if (s.hide) p.set("hide", "1");
  if (s.all) p.set("all", "1");
  const q = p.toString();
  return q ? `?${q}` : "";
}
export const FRESH: State = parse("");
/** A link to the skills list filtered to the given state changes. */
export const skillsLink = (patch: Partial<State>) => href() + query({ ...FRESH, ...patch });

// ------------------------------------------------------------------- filtering

const searchText = new Map(
  data.skills.map((s) => [
    s.id,
    [
      s.name,
      s.description,
      repoKey(s),
      ...registriesOf(s).map((r) => REGISTRIES[r]),
      s.note,
      ...s.tags,
      ...s.categories.map((c) => categoryById.get(c)?.label),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  ]),
);

/** Within a facet a skill needs any selected value; across facets it needs all of them. `skip` leaves one facet out, for its counts. */
function passes(s: Skill, st: State, skip: string | null = null): boolean {
  // Filtering on a skip tag, such as flag:vendor, asks for the skills it skips.
  if (
    skipped(data, s) &&
    !st.all &&
    !s.tags.some((t) => data.skip.includes(t) && st.tags.includes(t))
  )
    return false;
  if (st.hide && s.tags.includes("flag:republished")) return false;
  if (st.repo && repoKey(s) !== st.repo) return false;
  if (skip !== "category" && st.cats.length && !s.categories.some((c) => st.cats.includes(c)))
    return false;
  if (
    skip !== "registry" &&
    st.registries.length &&
    !registriesOf(s).some((r) => st.registries.includes(r))
  )
    return false;
  const selected = new Map<string, string[]>();
  for (const t of st.tags) selected.set(facetOf(t), [...(selected.get(facetOf(t)) ?? []), t]);
  for (const [facet, tags] of selected)
    if (facet !== skip && !tags.some((t) => s.tags.includes(t))) return false;
  if (st.q) {
    const text = searchText.get(s.id) ?? "";
    if (
      !st.q
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((word) => text.includes(word))
    )
      return false;
  }
  return true;
}

const ORDER: Record<Sort, (a: Skill, b: Skill) => number> = {
  installs: (a, b) =>
    desc(installsOf(a), installsOf(b)) ||
    desc(downloadsOf(a), downloadsOf(b)) ||
    a.name.localeCompare(b.name),
  downloads: (a, b) => desc(downloadsOf(a), downloadsOf(b)) || ORDER.installs(a, b),
  stars: (a, b) => desc(starsOf(a), starsOf(b)) || ORDER.installs(a, b),
  name: (a, b) => a.name.localeCompare(b.name) || ORDER.installs(a, b),
  newest: (a, b) =>
    (firstSeenOf(b) ?? "").localeCompare(firstSeenOf(a) ?? "") || ORDER.installs(a, b),
};

/** The filtered, sorted list, plus how many skills each bundle hides in one-per-repo mode. */
function results(st: State): { list: Skill[]; hidden: Map<string, number>; total: number } {
  const matching = data.skills.filter((s) => passes(s, st)).sort(ORDER[st.sort]);
  const hidden = new Map<string, number>();
  if (!st.one) return { list: matching, hidden, total: matching.length };
  const list = matching.filter((s) => {
    const key = repoKey(s);
    if (hidden.has(key)) {
      hidden.set(key, (hidden.get(key) ?? 0) + 1);
      return false;
    }
    hidden.set(key, 0);
    return true;
  });
  return { list, hidden, total: matching.length };
}

function counts(st: State, facet: string, valuesOf: (s: Skill) => string[]): Map<string, number> {
  const n = new Map<string, number>();
  for (const s of data.skills)
    if (passes(s, st, facet)) for (const v of valuesOf(s)) n.set(v, (n.get(v) ?? 0) + 1);
  return n;
}

// ------------------------------------------------------------------- pieces

function filterChip(
  attr: string,
  value: string,
  label: string,
  n: number,
  pressed: boolean,
  title?: string,
): string {
  return `<button type="button" class="chip" ${attr}="${esc(value)}" aria-pressed="${pressed}"${
    title ? ` title="${esc(title)}"` : ""
  }><span>${esc(label)}</span><span class="n">${n}</span></button>`;
}

function metric(s: Skill, st: State): string {
  if (st.sort === "stars") {
    const stars = starsOf(s);
    return stars === null
      ? `<span class="metric muted" title="No GitHub repo star count">no stars</span>`
      : `<span class="metric" title="GitHub stars of ${esc(repoKey(s))} on ${date(data.snapshots.stars)}"><strong>${compact(stars)}</strong> stars</span>`;
  }
  const firstSeen = firstSeenOf(s);
  if (st.sort === "newest" && firstSeen)
    return `<span class="metric" title="First seen on skills.sh"><strong>${date(firstSeen)}</strong></span>`;
  const installs = installsOf(s);
  if (installs !== null && st.sort !== "downloads")
    return `<span class="metric" title="All-time installs on skills.sh, ${date(data.snapshots.installs)}"><strong>${compact(installs)}</strong> installs</span>`;
  const downloads = downloadsOf(s);
  if (downloads !== null)
    return `<span class="metric" title="Downloads on ${esc(
      DOWNLOADS.filter((r) => s[r])
        .map((r) => REGISTRIES[r])
        .join(" and "),
    )}, ${date(data.snapshots.downloads)}"><strong>${compact(downloads)}</strong> downloads</span>`;
  if (installs !== null)
    return `<span class="metric" title="All-time installs on skills.sh, ${date(data.snapshots.installs)}"><strong>${compact(installs)}</strong> installs</span>`;
  return `<span class="metric muted" title="Not in the skills.sh all-time top 600 on ${date(data.snapshots.installs)}">new</span>`;
}

function skillRow(s: Skill, more: number, st: State): string {
  const tags = s.tags
    .filter((t) => !QUIET.has(t))
    .sort((a, b) => FACET_ORDER.indexOf(facetOf(a)) - FACET_ORDER.indexOf(facetOf(b)));
  const caution = s.tags.some((t) => CAUTION.includes(t));
  return `
    <li class="skill${caution ? " caution" : ""}">
      <div class="skill-head">
        <h3><a class="skill-name" href="${skillHref(s.id)}">${esc(s.name)}</a></h3>
        <span class="skill-source">${esc(repoKey(s))}</span>
        ${metric(s, st)}
      </div>
      <p class="skill-desc">${esc(s.description)}</p>
      <div class="tags">${tags.map((t) => tagChip(t, null, st.tags.includes(t))).join("")}</div>
      ${
        more
          ? `<a class="more" href="${skillsLink({ repo: repoKey(s), sort: st.sort })}">+${plural(more, "more skill")} from ${esc(repoKey(s))}</a>`
          : ""
      }
    </li>`;
}

function section(title: string, question: string | null, chips: string): string {
  return `<section class="facet"><h2${question ? ` title="${esc(question)}"` : ""}>${esc(title)}</h2><div class="chips">${chips || `<span class="muted">None</span>`}</div></section>`;
}

function tagSection(st: State, facetId: string): string {
  const facet = facetById.get(facetId);
  if (!facet) return "";
  const n = counts(st, facetId, (s) => s.tags.filter((t) => facetOf(t) === facetId));
  return section(
    facet.name,
    facet.question,
    facet.values
      .map((v) => tagOf(facet, v.id))
      .filter((t) => n.get(t) || st.tags.includes(t))
      .map((t) =>
        filterChip(
          "data-tag",
          t,
          t.slice(facetId.length + 1),
          n.get(t) ?? 0,
          st.tags.includes(t),
          tagInfo.get(t),
        ),
      )
      .join(""),
  );
}

export function facetsHtml(st: State, stackExpanded: boolean): string {
  const sections: string[] = [];
  const catCounts = counts(st, "category", (s) => s.categories);
  sections.push(
    section(
      "Category",
      null,
      data.categories
        .filter((c) => catCounts.get(c.id) || st.cats.includes(c.id))
        .map((c) =>
          filterChip(
            "data-cat",
            c.id,
            c.label,
            catCounts.get(c.id) ?? 0,
            st.cats.includes(c.id),
            c.description,
          ),
        )
        .join(""),
    ),
  );
  for (const f of ["type", "effect", "needs", "by", "flag"]) sections.push(tagSection(st, f));
  const regCounts = counts(st, "registry", registriesOf);
  sections.push(
    section(
      "Registry",
      "Where the skill is published.",
      (Object.keys(REGISTRIES) as Registry[])
        .filter((r) => regCounts.get(r) || st.registries.includes(r))
        .map((r) =>
          filterChip(
            "data-registry",
            r,
            REGISTRIES[r],
            regCounts.get(r) ?? 0,
            st.registries.includes(r),
          ),
        )
        .join(""),
    ),
  );
  sections.push(tagSection(st, "lang"));
  // Topics, by group.
  const topic = facetById.get("topic");
  const topicCounts = counts(st, "topic", (s) => s.tags.filter((t) => facetOf(t) === "topic"));
  const groups = (topic?.groups ?? [])
    .map((g) => {
      const chips = g.values
        .filter((v) => topicCounts.get(v) || st.tags.includes(v))
        .map((v) => filterChip("data-tag", v, v, topicCounts.get(v) ?? 0, st.tags.includes(v)))
        .join("");
      return chips ? `<h3 class="group">${esc(g.name)}</h3><div class="chips">${chips}</div>` : "";
    })
    .join("");
  sections.push(
    `<section class="facet"><h2 title="${esc(topic?.question ?? "")}">Topics</h2>${groups || `<p class="muted">None</p>`}</section>`,
  );
  // Stack, most used first.
  const stackCounts = counts(st, "stack", (s) => s.tags.filter((t) => t.startsWith("stack:")));
  const stack = [
    ...stackCounts.keys(),
    ...st.tags.filter((t) => t.startsWith("stack:") && !stackCounts.has(t)),
  ].sort((a, b) => (stackCounts.get(b) ?? 0) - (stackCounts.get(a) ?? 0) || a.localeCompare(b));
  const shown = stackExpanded ? stack : stack.slice(0, 16);
  sections.push(
    section(
      "Stack",
      facetById.get("stack")?.question ?? null,
      shown
        .map((t) =>
          filterChip("data-tag", t, t.slice(6), stackCounts.get(t) ?? 0, st.tags.includes(t)),
        )
        .join("") +
        (stack.length > 16
          ? `<button type="button" class="link-button" data-action="stack">${stackExpanded ? "Show fewer" : `Show all ${stack.length}`}</button>`
          : ""),
    ),
  );
  return sections.join("");
}

function activeFilters(st: State): string {
  const chips: string[] = [];
  const remove = (kind: string, value: string, label: string) =>
    `<button type="button" class="active-chip" data-remove="${kind}" data-value="${esc(value)}" aria-label="Remove filter ${esc(label)}">${esc(label)} <span aria-hidden="true">×</span></button>`;
  if (st.q) chips.push(remove("q", st.q, `“${st.q}”`));
  for (const c of st.cats) chips.push(remove("cat", c, categoryById.get(c)?.label ?? c));
  for (const t of st.tags) chips.push(remove("tag", t, t));
  for (const r of st.registries) chips.push(remove("registry", r, REGISTRIES[r as Registry] ?? r));
  if (st.repo) chips.push(remove("repo", st.repo, `from ${st.repo}`));
  return chips.length
    ? `<div class="active">${chips.join("")}<button type="button" class="link-button" data-action="clear">Clear all</button></div>`
    : "";
}

export function resultsHtml(st: State): string {
  const { list, hidden, total } = results(st);
  const filtered =
    st.q || st.cats.length || st.tags.length || st.registries.length || st.repo || st.hide;
  // Out of every skill once skipped ones show, else out of the listed ones.
  const all =
    st.all || list.some((s) => skipped(data, s))
      ? data.skills.length
      : data.skills.filter((s) => !skipped(data, s)).length;
  const repoNote = st.repo ? repoById.get(st.repo) : undefined;
  return `
    <div class="toolbar">
      <p id="count" role="status"><strong>${plural(total, "skill")}</strong>${
        st.one && list.length !== total ? `, ${plural(list.length, "repo")}` : ""
      }${filtered ? ` <span class="muted">of ${all}</span>` : ""}</p>
      <button type="button" class="filters-toggle" data-action="filters" aria-controls="filters">Filters</button>
      <label class="sort">Sort by <select id="sort">${(Object.keys(SORTS) as Sort[])
        .map((s) => `<option value="${s}"${s === st.sort ? " selected" : ""}>${SORTS[s]}</option>`)
        .join("")}</select></label>
      <label class="check"><input type="checkbox" id="one"${st.one ? " checked" : ""} /> One per repo</label>
      <label class="check"><input type="checkbox" id="hide"${st.hide ? " checked" : ""} /> Hide copies</label>
      <label class="check" title="Also show the skills tagged ${esc(data.skip.join(", "))}, and those gone from their source"><input type="checkbox" id="all"${st.all ? " checked" : ""} /> Show all</label>
    </div>
    ${activeFilters(st)}
    ${repoNote ? `<p class="repo-banner"><a href="${esc(repoNote.url)}">${esc(repoNote.id)}</a>${repoNote.description ? ` · ${esc(repoNote.description)}` : ""}</p>` : ""}
    ${
      list.length
        ? `<ol class="skill-list">${list.map((s) => skillRow(s, hidden.get(repoKey(s)) ?? 0, st)).join("")}</ol>`
        : `<p class="empty">No skill matches these filters.</p>`
    }`;
}

export function listView(st: State): string {
  return `
    <div class="skills-view">
      <aside id="filters" aria-label="Filters">
        <div class="search">
          <label for="q" class="sr-only">Search skills</label>
          <input id="q" type="search" value="${esc(st.q)}" placeholder="Search names, descriptions, tags" autocomplete="off" spellcheck="false" />
        </div>
        <div id="facets">${facetsHtml(st, false)}</div>
      </aside>
      <section id="results" aria-label="Skills">${resultsHtml(st)}</section>
    </div>`;
}
