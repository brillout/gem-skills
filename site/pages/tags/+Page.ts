import { date, esc } from "../../format.ts";
import { skillsLink } from "../../list.ts";
import { FACET_ORDER, data, facetById, tagChip, tagOf } from "../../skills.ts";
import { retired, type Facet } from "../../types.ts";

export default function Page(): string {
  // As many skills as each tag's link lists: retired skills only count for flag:deprecated.
  const n = new Map<string, number>();
  for (const s of data.skills)
    for (const t of s.tags)
      if (!retired(s) || t === "flag:deprecated") n.set(t, (n.get(t) ?? 0) + 1);
  const tagLink = (t: string) => tagChip(t, skillsLink({ tags: [t] }));
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
      <nav class="toc" aria-label="Facets">${FACET_ORDER.map((id) => `<a href="#facet-${id}">${esc(facetById.get(id)?.name ?? id)}</a>`).join("")}</nav>
      ${sections}
    </div>`;
}
