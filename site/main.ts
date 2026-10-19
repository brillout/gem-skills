/**
 * Gem Skills: browse the skills in ../skills.json by category and tag.
 * Run with: pnpm run dev
 */

import raw from "../skills.json";
import { mountSparklines, statTile } from "./sparkline.ts";
import type { Data, Facet, Registry, Repo, Skill } from "./types.ts";

const data = raw as unknown as Data;
const GITHUB = "https://github.com/brillout/gem-skills";

// ------------------------------------------------------------------- lookups

const facetById = new Map(data.facets.map((f) => [f.id, f]));
const repoById = new Map(data.repos.map((r) => [r.id, r]));
const categoryById = new Map(data.categories.map((c) => [c.id, c]));
const skillIndex = new Map(data.skills.map((s, i) => [s.id, i]));
const REGISTRIES: Registry[] = ["skills.sh", "ClawHub", "Tencent SkillHub"];

/** Tags are `facet:value`, except topics, which are written without a prefix. */
const tagOf = (facet: Facet, value: string) =>
  facet.prefix === false ? value : `${facet.id}:${value}`;
const facetOf = (tag: string) => (tag.includes(":") ? tag.slice(0, tag.indexOf(":")) : "topic");
const tagInfo = new Map<string, string>();
for (const facet of data.facets)
  for (const v of facet.values) if (v.description) tagInfo.set(tagOf(facet, v.id), v.description);

/** The order facets appear in, wherever they're listed. */
const FACET_ORDER = ["type", "effect", "needs", "by", "topic", "stack", "flag", "audit", "lang"];
/** Tags that hold for most skills; the list leaves them to the details panel. */
const QUIET = new Set(["by:community", "audit:pass", "audit:none"]);
/** Tags that call for a look before installing. */
const CAUTION = ["flag:republished", "flag:deprecated"];

const repoKey = (s: Skill) => s.repo ?? s.source ?? s.registry;
const starsOf = (s: Skill) => (s.repo ? (repoById.get(s.repo)?.stars ?? null) : null);
const downloadsOf = (s: Skill) => (s.downloads ? Math.max(...Object.values(s.downloads)) : null);
const searchText = new Map(
  data.skills.map((s) => [
    s.id,
    [
      s.name,
      s.description,
      s.source,
      s.registry,
      s.note,
      ...s.tags,
      ...s.categories.map((c) => categoryById.get(c)?.label),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  ]),
);

// ------------------------------------------------------------------- formatting

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** 3.5M, 907K, 54.5K, 812 */
function compact(n: number): string {
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
const date = (iso: string) => longDate.format(new Date(`${iso}T00:00:00Z`));
const plural = (n: number, word: string) =>
  `${n.toLocaleString("en")} ${word}${n === 1 ? "" : "s"}`;

// ------------------------------------------------------------------- state

type View = "skills" | "tags" | "repos" | "about";
type Sort = "installs" | "downloads" | "stars" | "name" | "newest";
interface State {
  view: View;
  q: string;
  cats: string[];
  tags: string[];
  registries: string[];
  repo: string | null;
  sort: Sort;
  /** One skill per repo: the most popular one stands for its bundle. */
  one: boolean;
  /** Hide republished copies and retired skills. */
  hide: boolean;
  /** The skill whose details are open. */
  open: string | null;
}
const SORTS: Record<Sort, string> = {
  installs: "Installs",
  downloads: "Downloads",
  stars: "Repo stars",
  name: "Name",
  newest: "Newest",
};
const VIEWS: View[] = ["skills", "tags", "repos", "about"];

/** The whole state lives in the URL hash, so every view and filter can be shared as a link. */
function parse(hash: string): State {
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  const p = new URLSearchParams(query);
  const sort = p.get("sort") as Sort | null;
  return {
    view: VIEWS.includes(path as View) ? (path as View) : "skills",
    q: p.get("q") ?? "",
    cats: p.getAll("cat"),
    tags: p.getAll("tag"),
    registries: p.getAll("registry"),
    repo: p.get("repo"),
    sort: sort && sort in SORTS ? sort : "installs",
    one: p.get("one") === "1",
    hide: p.get("hide") === "1",
    open: p.get("skill"),
  };
}
function link(s: State): string {
  const p = new URLSearchParams();
  if (s.view === "skills") {
    if (s.q) p.set("q", s.q);
    for (const c of s.cats) p.append("cat", c);
    for (const t of s.tags) p.append("tag", t);
    for (const r of s.registries) p.append("registry", r);
    if (s.repo) p.set("repo", s.repo);
    if (s.sort !== "installs") p.set("sort", s.sort);
    if (s.one) p.set("one", "1");
    if (s.hide) p.set("hide", "1");
    if (s.open) p.set("skill", s.open);
  }
  const query = p.toString();
  return `#/${s.view === "skills" ? "" : s.view}${query ? `?${query}` : ""}`;
}
const FRESH: State = parse("");
/** A link to the skills list filtered to the given state changes. */
const skillsLink = (patch: Partial<State>) => link({ ...FRESH, ...patch, view: "skills" });

let state = parse(location.hash);
let stackExpanded = false;

function go(patch: Partial<State>, history: "push" | "replace" = "replace") {
  state = { ...state, ...patch };
  const url = link(state);
  if (url !== location.hash)
    window.history[history === "push" ? "pushState" : "replaceState"](null, "", url);
  render();
}
const toggled = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

// ------------------------------------------------------------------- filtering

/** Within a facet a skill needs any selected value; across facets it needs all of them. `skip` leaves one facet out, for its counts. */
function passes(s: Skill, st: State, skip: string | null = null): boolean {
  if (st.hide && s.tags.some((t) => CAUTION.includes(t))) return false;
  if (st.repo && repoKey(s) !== st.repo) return false;
  if (skip !== "category" && st.cats.length && !s.categories.some((c) => st.cats.includes(c)))
    return false;
  if (skip !== "registry" && st.registries.length && !st.registries.includes(s.registry))
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

const desc = (a: number | null, b: number | null) => (b ?? -1) - (a ?? -1);
const ORDER: Record<Sort, (a: Skill, b: Skill) => number> = {
  installs: (a, b) =>
    desc(a.installs, b.installs) ||
    desc(downloadsOf(a), downloadsOf(b)) ||
    a.name.localeCompare(b.name),
  downloads: (a, b) => desc(downloadsOf(a), downloadsOf(b)) || ORDER.installs(a, b),
  stars: (a, b) => desc(starsOf(a), starsOf(b)) || ORDER.installs(a, b),
  name: (a, b) => a.name.localeCompare(b.name) || ORDER.installs(a, b),
  newest: (a, b) => (b.firstSeen ?? "").localeCompare(a.firstSeen ?? "") || ORDER.installs(a, b),
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

function tagChip(tag: string, pressed = false): string {
  const info = tagInfo.get(tag);
  return `<button type="button" class="tag" data-tag="${esc(tag)}" data-facet="${esc(facetOf(tag))}" aria-pressed="${pressed}"${
    info ? ` title="${esc(info)}"` : ""
  }>${esc(tag)}</button>`;
}

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

function metric(s: Skill): string {
  if (state.sort === "stars") {
    const stars = starsOf(s);
    return stars === null
      ? `<span class="metric muted" title="No GitHub repo star count">no stars</span>`
      : `<span class="metric" title="GitHub stars of ${esc(s.repo ?? "")} on ${date(data.snapshots.stars)}"><strong>${compact(stars)}</strong> stars</span>`;
  }
  if (state.sort === "newest" && s.firstSeen)
    return `<span class="metric" title="First seen on skills.sh"><strong>${date(s.firstSeen)}</strong></span>`;
  if (s.installs !== null && state.sort !== "downloads")
    return `<span class="metric" title="All-time installs on skills.sh, ${date(data.snapshots.installs)}"><strong>${compact(s.installs)}</strong> installs</span>`;
  const downloads = downloadsOf(s);
  if (downloads !== null)
    return `<span class="metric" title="Downloads on ${esc(Object.keys(s.downloads ?? {}).join(" and "))}, ${date(data.snapshots.downloads)}"><strong>${compact(downloads)}</strong> downloads</span>`;
  if (s.installs !== null)
    return `<span class="metric" title="All-time installs on skills.sh, ${date(data.snapshots.installs)}"><strong>${compact(s.installs)}</strong> installs</span>`;
  return `<span class="metric muted" title="Not in the skills.sh all-time top 600 on ${date(data.snapshots.installs)}">new</span>`;
}

const domId = (s: Skill) => `skill-${skillIndex.get(s.id)}`;

function skillRow(s: Skill, more: number): string {
  const open = state.open === s.id;
  const tags = s.tags
    .filter((t) => !QUIET.has(t))
    .sort((a, b) => FACET_ORDER.indexOf(facetOf(a)) - FACET_ORDER.indexOf(facetOf(b)));
  const caution = s.tags.some((t) => CAUTION.includes(t));
  return `
    <li class="skill${open ? " open" : ""}${caution ? " caution" : ""}" id="${domId(s)}">
      <div class="skill-head">
        <h3><button type="button" class="skill-toggle" data-open="${esc(s.id)}" aria-expanded="${open}" aria-controls="${domId(s)}-details">${esc(s.name)}</button></h3>
        <span class="skill-source">${esc(s.source ?? s.registry)}</span>
        ${metric(s)}
      </div>
      <p class="skill-desc">${esc(s.description)}</p>
      <div class="tags">${tags.map((t) => tagChip(t, state.tags.includes(t))).join("")}</div>
      ${
        more
          ? `<a class="more" href="${skillsLink({ repo: repoKey(s), sort: state.sort })}">+${plural(more, "more skill")} from ${esc(repoKey(s))}</a>`
          : ""
      }
      ${open ? details(s) : ""}
    </li>`;
}

function details(s: Skill): string {
  const repo = s.repo ? repoById.get(s.repo) : undefined;
  const byFacet = new Map<string, string[]>();
  for (const t of s.tags) byFacet.set(facetOf(t), [...(byFacet.get(facetOf(t)) ?? []), t]);
  const tagRows = FACET_ORDER.filter((f) => byFacet.has(f))
    .map((f) => {
      const facet = facetById.get(f);
      const tags = byFacet.get(f) ?? [];
      const explained = tags.filter((t) => tagInfo.has(t));
      return `
        <tr>
          <th scope="row">${esc(facet?.name ?? f)}</th>
          <td>
            <div class="tags">${tags.map((t) => tagChip(t, state.tags.includes(t))).join("")}</div>
            ${f === "topic" || f === "stack" ? "" : explained.map((t) => `<p class="tag-meaning">${esc(tagInfo.get(t) ?? "")}</p>`).join("")}
            ${
              f === "audit" && s.audits
                ? `<p class="tag-meaning">${Object.entries(s.audits)
                    .map(
                      ([scanner, verdict]) =>
                        `${esc(scanner)}: <span class="verdict" data-verdict="${esc(verdict.toLowerCase())}">${esc(verdict)}</span>`,
                    )
                    .join(" · ")} (${date(data.snapshots.audits)})</p>`
                : ""
            }
          </td>
        </tr>`;
    })
    .join("");
  const facts: string[] = [];
  if (s.installs !== null)
    facts.push(
      `<div><dt>Installs</dt><dd>${s.installs.toLocaleString("en")} <span class="muted">on skills.sh, ${date(data.snapshots.installs)}</span></dd></div>`,
    );
  for (const [registry, n] of Object.entries(s.downloads ?? {}))
    facts.push(
      `<div><dt>Downloads</dt><dd>${n.toLocaleString("en")} <span class="muted">on ${esc(registry)}, ${date(data.snapshots.downloads)}</span></dd></div>`,
    );
  if (repo?.stars != null)
    facts.push(
      `<div><dt>Repo stars</dt><dd>${repo.stars.toLocaleString("en")} <span class="muted">${esc(repo.id)}</span></dd></div>`,
    );
  if (s.firstSeen)
    facts.push(
      `<div><dt>First seen</dt><dd>${date(s.firstSeen)} <span class="muted">on skills.sh</span></dd></div>`,
    );
  facts.push(
    `<div><dt>Category</dt><dd>${s.categories
      .map(
        (c) => `<a href="${skillsLink({ cats: [c] })}">${esc(categoryById.get(c)?.name ?? c)}</a>`,
      )
      .join(", ")}</dd></div>`,
  );
  const links = [
    s.url ? `<a href="${esc(s.url)}">${esc(s.registry)} page</a>` : "",
    repo ? `<a href="${esc(repo.url)}">GitHub repo</a>` : "",
    `<a href="${skillsLink({ repo: repoKey(s) })}">All skills from ${esc(repoKey(s))}</a>`,
  ].filter(Boolean);
  return `
    <div class="details" id="${domId(s)}-details">
      ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
      <div class="details-grid">
        <div>
          ${
            s.install
              ? `<div class="install"><code>${esc(s.install)}</code><button type="button" class="copy" data-copy="${esc(s.install)}">Copy</button></div>`
              : `<p class="muted">No install command known for this registry.</p>`
          }
          <p class="links">${links.join(" · ")}</p>
          <dl class="facts">${facts.join("")}</dl>
        </div>
        ${s.weeklyInstalls ? statTile(s.weeklyInstalls, data.snapshots.installs, compact) : ""}
      </div>
      <table class="tag-detail">${tagRows}</table>
    </div>`;
}

// ------------------------------------------------------------------- skills view

const app = document.getElementById("app") as HTMLElement;
let mounted: View | null = null;

function mountSkillsView() {
  app.innerHTML = `
    <div class="skills-view">
      <aside id="filters" aria-label="Filters">
        <div class="search">
          <label for="q" class="sr-only">Search skills</label>
          <input id="q" type="search" placeholder="Search names, descriptions, tags" autocomplete="off" spellcheck="false" />
        </div>
        <div id="facets"></div>
      </aside>
      <section id="results" aria-label="Skills"></section>
    </div>`;
  const q = document.getElementById("q") as HTMLInputElement;
  q.value = state.q;
  q.addEventListener("input", () => go({ q: q.value, open: null }));
}

function facetsHtml(): string {
  const sections: string[] = [];
  const catCounts = counts(state, "category", (s) => s.categories);
  sections.push(
    section(
      "Category",
      null,
      data.categories
        .filter((c) => catCounts.get(c.id) || state.cats.includes(c.id))
        .map((c) =>
          filterChip(
            "data-cat",
            c.id,
            c.label,
            catCounts.get(c.id) ?? 0,
            state.cats.includes(c.id),
            c.description,
          ),
        )
        .join(""),
    ),
  );
  for (const f of ["type", "effect", "needs", "by", "flag", "audit"]) sections.push(tagSection(f));
  const regCounts = counts(state, "registry", (s) => [s.registry]);
  sections.push(
    section(
      "Registry",
      "Where the skill is published.",
      REGISTRIES.filter((r) => regCounts.get(r) || state.registries.includes(r))
        .map((r) =>
          filterChip("data-registry", r, r, regCounts.get(r) ?? 0, state.registries.includes(r)),
        )
        .join(""),
    ),
  );
  sections.push(tagSection("lang"));
  // Topics, by group.
  const topic = facetById.get("topic");
  const topicCounts = counts(state, "topic", (s) => s.tags.filter((t) => facetOf(t) === "topic"));
  const groups = (topic?.groups ?? [])
    .map((g) => {
      const chips = g.values
        .filter((v) => topicCounts.get(v) || state.tags.includes(v))
        .map((v) => filterChip("data-tag", v, v, topicCounts.get(v) ?? 0, state.tags.includes(v)))
        .join("");
      return chips ? `<h3 class="group">${esc(g.name)}</h3><div class="chips">${chips}</div>` : "";
    })
    .join("");
  sections.push(
    `<section class="facet"><h2 title="${esc(topic?.question ?? "")}">Topics</h2>${groups || `<p class="muted">None</p>`}</section>`,
  );
  // Stack, most used first.
  const stackCounts = counts(state, "stack", (s) => s.tags.filter((t) => t.startsWith("stack:")));
  const stack = [
    ...stackCounts.keys(),
    ...state.tags.filter((t) => t.startsWith("stack:") && !stackCounts.has(t)),
  ].sort((a, b) => (stackCounts.get(b) ?? 0) - (stackCounts.get(a) ?? 0) || a.localeCompare(b));
  const shown = stackExpanded ? stack : stack.slice(0, 16);
  sections.push(
    section(
      "Stack",
      facetById.get("stack")?.question ?? null,
      shown
        .map((t) =>
          filterChip("data-tag", t, t.slice(6), stackCounts.get(t) ?? 0, state.tags.includes(t)),
        )
        .join("") +
        (stack.length > 16
          ? `<button type="button" class="link-button" data-action="stack">${stackExpanded ? "Show fewer" : `Show all ${stack.length}`}</button>`
          : ""),
    ),
  );
  return sections.join("");
}

function section(title: string, question: string | null, chips: string): string {
  return `<section class="facet"><h2${question ? ` title="${esc(question)}"` : ""}>${esc(title)}</h2><div class="chips">${chips || `<span class="muted">None</span>`}</div></section>`;
}

function tagSection(facetId: string): string {
  const facet = facetById.get(facetId);
  if (!facet) return "";
  const n = counts(state, facetId, (s) => s.tags.filter((t) => facetOf(t) === facetId));
  return section(
    facet.name,
    facet.question,
    facet.values
      .map((v) => tagOf(facet, v.id))
      .filter((t) => n.get(t) || state.tags.includes(t))
      .map((t) =>
        filterChip(
          "data-tag",
          t,
          t.slice(facetId.length + 1),
          n.get(t) ?? 0,
          state.tags.includes(t),
          tagInfo.get(t),
        ),
      )
      .join(""),
  );
}

function activeFilters(): string {
  const chips: string[] = [];
  const remove = (kind: string, value: string, label: string) =>
    `<button type="button" class="active-chip" data-remove="${kind}" data-value="${esc(value)}" aria-label="Remove filter ${esc(label)}">${esc(label)} <span aria-hidden="true">×</span></button>`;
  if (state.q) chips.push(remove("q", state.q, `“${state.q}”`));
  for (const c of state.cats) chips.push(remove("cat", c, categoryById.get(c)?.label ?? c));
  for (const t of state.tags) chips.push(remove("tag", t, t));
  for (const r of state.registries) chips.push(remove("registry", r, r));
  if (state.repo) chips.push(remove("repo", state.repo, `from ${state.repo}`));
  return chips.length
    ? `<div class="active">${chips.join("")}<button type="button" class="link-button" data-action="clear">Clear all</button></div>`
    : "";
}

function renderSkillsView() {
  if (mounted !== "skills") {
    mountSkillsView();
    mounted = "skills";
  }
  const q = document.getElementById("q") as HTMLInputElement;
  if (q.value !== state.q) q.value = state.q;
  (document.getElementById("facets") as HTMLElement).innerHTML = facetsHtml();
  const { list, hidden, total } = results(state);
  const filtered =
    state.q ||
    state.cats.length ||
    state.tags.length ||
    state.registries.length ||
    state.repo ||
    state.hide;
  const repoNote = state.repo ? repoById.get(state.repo) : undefined;
  (document.getElementById("results") as HTMLElement).innerHTML = `
    <div class="toolbar">
      <p id="count" role="status"><strong>${plural(total, "skill")}</strong>${
        state.one && list.length !== total ? `, ${plural(list.length, "repo")}` : ""
      }${filtered ? ` <span class="muted">of ${data.skills.length}</span>` : ""}</p>
      <button type="button" class="filters-toggle" data-action="filters" aria-controls="filters">Filters</button>
      <label class="sort">Sort by <select id="sort">${(Object.keys(SORTS) as Sort[])
        .map(
          (s) => `<option value="${s}"${s === state.sort ? " selected" : ""}>${SORTS[s]}</option>`,
        )
        .join("")}</select></label>
      <label class="check"><input type="checkbox" id="one"${state.one ? " checked" : ""} /> One per repo</label>
      <label class="check"><input type="checkbox" id="hide"${state.hide ? " checked" : ""} /> Hide copies and retired</label>
    </div>
    ${activeFilters()}
    ${repoNote ? `<p class="repo-banner"><a href="${esc(repoNote.url)}">${esc(repoNote.id)}</a>${repoNote.description ? ` · ${esc(repoNote.description)}` : ""}</p>` : ""}
    ${
      list.length
        ? `<ol class="skill-list">${list.map((s) => skillRow(s, hidden.get(repoKey(s)) ?? 0)).join("")}</ol>`
        : `<p class="empty">No skill matches these filters.</p>`
    }`;
  mountSparklines(app);
}

// ------------------------------------------------------------------- other views

function tagsView(): string {
  const n = new Map<string, number>();
  for (const s of data.skills) for (const t of s.tags) n.set(t, (n.get(t) ?? 0) + 1);
  const tagLink = (t: string, label = t) =>
    `<a class="tag" data-facet="${esc(facetOf(t))}" href="${skillsLink({ tags: [t] })}"${tagInfo.has(t) ? ` title="${esc(tagInfo.get(t) ?? "")}"` : ""}>${esc(label)}</a>`;
  const sections = FACET_ORDER.map((id) => facetById.get(id))
    .filter((f): f is Facet => Boolean(f))
    .map((f) => {
      let body: string;
      if (f.id === "topic")
        body = (f.groups ?? [])
          .map(
            (g) =>
              `<h3>${esc(g.name)}</h3><p class="cloud">${g.values.map((v) => `${tagLink(v)}<span class="n">${n.get(v) ?? 0}</span>`).join(" ")}</p>`,
          )
          .join("");
      else if (f.id === "stack")
        body = `<p class="cloud">${f.values
          .map((v) => `stack:${v.id}`)
          .sort((a, b) => (n.get(b) ?? 0) - (n.get(a) ?? 0) || a.localeCompare(b))
          .map((t) => `${tagLink(t)}<span class="n">${n.get(t) ?? 0}</span>`)
          .join(" ")}</p>`;
      else
        body = `<table class="tag-table"><thead><tr><th scope="col">Tag</th><th scope="col">Skills</th><th scope="col">Meaning</th></tr></thead><tbody>${f.values
          .map((v) => {
            const t = tagOf(f, v.id);
            return `<tr><td>${tagLink(t)}</td><td class="num">${n.get(t) ?? 0}</td><td>${esc(v.description ?? "")}</td></tr>`;
          })
          .join("")}</tbody></table>`;
      return `<section class="facet-doc" id="facet-${f.id}"><h2>${esc(f.name)} <code>${f.prefix === false ? "no prefix" : `${f.id}:`}</code></h2><p class="question">${esc(f.question)} <span class="muted">${esc(f.count)} per skill.</span></p>${body}</section>`;
    })
    .join("");
  return `
    <div class="page">
      <h1>Tags</h1>
      <p class="lede">Categories put each skill in one place. Tags cut across them: how a skill works, what it needs, what it can change on its own, who publishes it and what it's about. Faceted tags carry a prefix, such as <code>needs:cli</code>; topics don't. Tags were assigned from each skill's SKILL.md on ${date(data.snapshots.tags)}. Pick a tag to list its skills.</p>
      <nav class="toc" aria-label="Facets">${FACET_ORDER.map((id) => `<a href="#/tags" data-scroll="facet-${id}">${esc(facetById.get(id)?.name ?? id)}</a>`).join("")}</nav>
      ${sections}
    </div>`;
}

const KINDS: Record<Repo["kind"], string> = {
  skills: "Skills",
  project: "Project",
  index: "Index",
};

function reposView(): string {
  const listed = new Map<string, Skill[]>();
  for (const s of data.skills) if (s.repo) listed.set(s.repo, [...(listed.get(s.repo) ?? []), s]);
  const rows = [...data.repos]
    .sort((a, b) => desc(a.stars, b.stars) || a.id.localeCompare(b.id))
    .map((r) => {
      const skills = listed.get(r.id) ?? [];
      return `
        <tr>
          <td><a href="${esc(r.url)}">${esc(r.id)}</a></td>
          <td>${KINDS[r.kind]}</td>
          <td class="num">${r.stars === null ? "—" : compact(r.stars)}</td>
          <td class="num">${skills.length ? `<a href="${skillsLink({ repo: r.id })}">${skills.length}</a>` : "—"}</td>
          <td class="num">${r.leaderboardSkills ?? "—"}</td>
          <td>${esc(r.description ?? "")}${r.note ? ` <span class="muted">${esc(r.note)}</span>` : ""}</td>
        </tr>`;
    })
    .join("");
  return `
    <div class="page wide">
      <h1>Repos</h1>
      <p class="lede">The GitHub repositories behind the skills, plus notable skill repos that aren't on skills.sh. Stars count the whole repository and were collected on ${date(data.snapshots.stars)}. For a project such as shadcn/ui, the skill is a small part of a much larger codebase. <em>Skills</em> repos exist to ship skills, <em>Project</em> repos ship a skill alongside a product, and <em>Index</em> repos list other skills.</p>
      <div class="table-scroll">
        <table class="repo-table">
          <thead><tr><th scope="col">Repository</th><th scope="col">Kind</th><th scope="col">Stars</th><th scope="col">Listed here</th><th scope="col" title="Skills in the skills.sh all-time top 600 on ${date(data.snapshots.installs)}">In top 600</th><th scope="col">About</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

function aboutView(): string {
  const n = data.skills.length;
  const tagged = (t: string) => data.skills.filter((s) => s.tags.includes(t)).length;
  return `
    <div class="page">
      <h1>About</h1>
      <p class="lede">Gem Skills lists ${n} of the most popular agent skills, ranked by real usage and tagged by what they do, need and change.</p>
      <h2>How popularity is measured</h2>
      <ul>
        <li><strong>Installs</strong> are all-time installs on <a href="https://skills.sh">skills.sh</a>, Vercel's registry for the <code>npx skills</code> CLI, from its top 600 on ${date(data.snapshots.installs)}. They also give the weekly trend.</li>
        <li><strong>Downloads</strong> come from <a href="https://clawhub.ai">ClawHub</a>, the OpenClaw registry, and <a href="https://skillhub.cn">Tencent SkillHub</a>, on ${date(data.snapshots.downloads)}. They aren't comparable with skills.sh installs.</li>
        <li><strong>Stars</strong> belong to the GitHub repo behind a skill, collected on ${date(data.snapshots.stars)}.</li>
      </ul>
      <h2>Read the numbers with care</h2>
      <ul>
        <li><strong>Bundles share counts.</strong> skills.sh counts an install of a repo once per skill in it, so skills from one repo sit close together. Turn on <a href="${skillsLink({ one: true })}">One per repo</a> to see one skill per bundle.</li>
        <li><strong>Some skills are copies.</strong> ${tagged("flag:republished")} skills here are republished copies of another publisher's skill, with install counts far above their originals'. They carry <a href="${skillsLink({ tags: ["flag:republished"] })}"><code>flag:republished</code></a>.</li>
        <li><strong>Some skills are retired.</strong> ${tagged("flag:deprecated")} skills now point to a replacement and carry <a href="${skillsLink({ tags: ["flag:deprecated"] })}"><code>flag:deprecated</code></a>.</li>
        <li><strong>CI installs count too</strong>, so skills wired into pipelines are over-represented.</li>
      </ul>
      <h2>Tags</h2>
      <p>Each skill has one type, one effect, one publisher and one audit result, plus what it needs, its stack, one to five topics and any flags. The <a href="#/tags">Tags</a> page explains every value. Tags were assigned from each skill's SKILL.md on ${date(data.snapshots.tags)}. Eleven ClawHub and Tencent SkillHub skills were tagged from their registry description because their SKILL.md couldn't be read. <code>by:official</code> is conservative: unverified vendor claims count as community.</p>
      <h2>Data</h2>
      <p>Everything on this site comes from one file, <a href="${GITHUB}/blob/HEAD/skills.json">skills.json</a>. To add or correct a skill, edit it and open a pull request.</p>
      <p>Sources: <a href="https://skills.sh">skills.sh</a> (installs, weekly trend, security audits), <a href="https://clawhub.ai">ClawHub</a> and <a href="https://skillhub.cn">Tencent SkillHub</a> (downloads), GitHub (stars), and <a href="https://dev.to/aws/the-most-popular-ai-coding-skills-right-now-4183">AWS's June 2026 survey</a> for two repos that aren't packaged as skills.</p>
      <p class="attribution">Star, ClawHub and SkillHub numbers: data from <a href="https://github.com/LinklyAI/best-skills">Best Skills</a> by <a href="https://x.com/BlueeonY">@BlueeonY</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
    </div>`;
}

// ------------------------------------------------------------------- render & events

const TITLES: Record<View, string> = {
  skills: "Gem Skills",
  tags: "Tags · Gem Skills",
  repos: "Repos · Gem Skills",
  about: "About · Gem Skills",
};

/** Re-rendering replaces the buttons; put focus back on the one that was used. */
function restoreFocus(selector: string | null) {
  if (selector)
    (document.querySelector(selector) as HTMLElement | null)?.focus({ preventScroll: true });
}
function focusSelector(): string | null {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el.id === "q" || !app.contains(el)) return null;
  for (const attr of [
    "data-open",
    "data-tag",
    "data-cat",
    "data-registry",
    "data-action",
    "data-remove",
  ]) {
    const v = el.getAttribute(attr);
    if (v !== null)
      return `#${el.closest("#facets") ? "facets" : "results"} [${attr}="${CSS.escape(v)}"]`;
  }
  return el.id ? `#${CSS.escape(el.id)}` : null;
}

function render() {
  const focus = focusSelector();
  for (const a of document.querySelectorAll<HTMLAnchorElement>("#views a"))
    if (a.dataset.view === state.view) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  document.title = TITLES[state.view];
  if (state.view === "skills") renderSkillsView();
  else {
    mounted = state.view;
    app.innerHTML =
      state.view === "tags" ? tagsView() : state.view === "repos" ? reposView() : aboutView();
  }
  restoreFocus(focus);
}

app.addEventListener("click", (event) => {
  const el = (event.target as Element).closest<HTMLElement>(
    "[data-cat],[data-tag],[data-registry],[data-open],[data-copy],[data-action],[data-remove],[data-scroll]",
  );
  if (!el || (el.tagName === "A" && !el.dataset.scroll)) return;
  const d = el.dataset;
  if (d.scroll) {
    event.preventDefault();
    document.getElementById(d.scroll)?.scrollIntoView({ behavior: "smooth" });
  } else if (d.cat) go({ cats: toggled(state.cats, d.cat), open: null });
  else if (d.tag) go({ view: "skills", tags: toggled(state.tags, d.tag) });
  else if (d.registry) go({ registries: toggled(state.registries, d.registry), open: null });
  else if (d.open) go({ open: state.open === d.open ? null : d.open });
  else if (d.copy) {
    const button = el;
    navigator.clipboard?.writeText(d.copy).then(() => {
      button.textContent = "Copied";
      setTimeout(() => (button.textContent = "Copy"), 1500);
    });
  } else if (d.remove) {
    const v = d.value ?? "";
    if (d.remove === "q") go({ q: "" });
    else if (d.remove === "cat") go({ cats: state.cats.filter((c) => c !== v) });
    else if (d.remove === "tag") go({ tags: state.tags.filter((t) => t !== v) });
    else if (d.remove === "registry") go({ registries: state.registries.filter((r) => r !== v) });
    else if (d.remove === "repo") go({ repo: null });
  } else if (d.action === "clear")
    go({ q: "", cats: [], tags: [], registries: [], repo: null, hide: false, open: null });
  else if (d.action === "stack") {
    stackExpanded = !stackExpanded;
    render();
  } else if (d.action === "filters") document.getElementById("filters")?.classList.toggle("shown");
});

app.addEventListener("change", (event) => {
  const el = event.target as HTMLInputElement | HTMLSelectElement;
  if (el.id === "sort") go({ sort: el.value as Sort });
  else if (el.id === "one") go({ one: (el as HTMLInputElement).checked });
  else if (el.id === "hide") go({ hide: (el as HTMLInputElement).checked });
});

window.addEventListener("hashchange", () => {
  const next = parse(location.hash);
  const viewChanged = next.view !== state.view;
  state = next;
  render();
  if (viewChanged) window.scrollTo(0, 0);
});

render();
// A shared link to a skill opens with that skill in view.
const opened = state.open === null ? undefined : skillIndex.get(state.open);
if (opened !== undefined)
  document.getElementById(domId(data.skills[opened]))?.scrollIntoView({ block: "center" });
