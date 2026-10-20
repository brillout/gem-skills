import type { PageContextServer } from "vike/types";
import { compact, date, esc, href, plural } from "../../format.ts";
import { skillsLink } from "../../list.ts";
import { statTile } from "../../sparkline.ts";
import {
  DOWNLOADS,
  FACET_ORDER,
  REGISTRIES,
  categoryById,
  data,
  facetById,
  facetOf,
  repoById,
  repoKey,
  tagChip,
  tagInfo,
} from "../../skills.ts";
import { github, type Skill, type SkillMd } from "../../types.ts";
import type { Data } from "./+data.ts";

/** A commit as its first 7 characters, a digest as its first 12. */
const short = (version: string) =>
  /^[0-9a-f]{40}$/.test(version)
    ? version.slice(0, 7)
    : version.replace(/^(\w+:\w{12})\w+$/, "$1…");

/** Where the copy of the SKILL.md came from. */
function source(s: Skill, { version }: SkillMd): string {
  const gh = github(s);
  if (gh)
    return `<a href="https://github.com/${esc(gh.repo)}/blob/${version}/${esc(encodeURI(gh.dir ? `${gh.dir}/SKILL.md` : "SKILL.md"))}">${esc(gh.repo)} at ${short(version)}</a>`;
  const host = s.id.split("/")[0];
  const claw = s["clawhub.ai"];
  if (host === "clawhub.ai")
    return `${claw?.url ? `<a href="${esc(claw.url)}">ClawHub</a>` : "ClawHub"}, version ${esc(version)}`;
  if (host === "skillhub.cn") return `Tencent SkillHub, version ${esc(version)}`;
  return `<a href="https://${esc(host)}/.well-known/skills/index.json">${esc(host)}</a>, ${esc(short(version))}`;
}

function tldr(s: Skill): string {
  if (!s.tldr) return "";
  const commit = /\/(?:tree|blob)\/([0-9a-f]{40})/.exec(s.tldr.permalink)?.[1] ?? "";
  const skew = s.skillMd?.skew ?? 0;
  return `
    <section class="tldr" aria-labelledby="tldr">
      <h2 id="tldr">TLDR</h2>
      ${s.tldr.text
        .split(/\n\s*\n/)
        .map((p) => `<p>${esc(p)}</p>`)
        .join("")}
      <p class="muted">Summarizes <a href="${esc(s.tldr.permalink)}">the skill at ${short(commit)}</a>.${
        skew ? ` Its SKILL.md has changed by ${plural(skew, "word")} since.` : ""
      }</p>
    </section>`;
}

function facts(s: Skill): string {
  const gh = github(s);
  const repo = gh ? repoById.get(gh.repo) : undefined;
  const sh = s["skills.sh"];
  const list: string[] = [];
  if (sh?.installs != null)
    list.push(
      `<div><dt>Installs</dt><dd>${sh.installs.toLocaleString("en")} <span class="muted">on skills.sh, ${date(data.snapshots.installs)}</span></dd></div>`,
    );
  for (const r of DOWNLOADS) {
    const n = s[r]?.downloads;
    if (n !== undefined)
      list.push(
        `<div><dt>Downloads</dt><dd>${n.toLocaleString("en")} <span class="muted">on ${esc(REGISTRIES[r])}, ${date(data.snapshots.downloads)}</span></dd></div>`,
      );
  }
  if (repo?.stars != null)
    list.push(
      `<div><dt>Repo stars</dt><dd>${repo.stars.toLocaleString("en")} <span class="muted">${esc(repo.id)}</span></dd></div>`,
    );
  if (sh?.firstSeen)
    list.push(
      `<div><dt>First seen</dt><dd>${date(sh.firstSeen)} <span class="muted">on skills.sh</span></dd></div>`,
    );
  list.push(
    `<div><dt>Category</dt><dd>${s.categories
      .map(
        (c) => `<a href="${skillsLink({ cats: [c] })}">${esc(categoryById.get(c)?.name ?? c)}</a>`,
      )
      .join(", ")}</dd></div>`,
  );
  return `<dl class="facts">${list.join("")}</dl>`;
}

function tagTable(s: Skill): string {
  const byFacet = new Map<string, string[]>();
  for (const t of s.tags) byFacet.set(facetOf(t), [...(byFacet.get(facetOf(t)) ?? []), t]);
  const rows = FACET_ORDER.filter((f) => byFacet.has(f)).map((f) => {
    const tags = byFacet.get(f) ?? [];
    const explained = f === "topic" || f === "stack" ? [] : tags.filter((t) => tagInfo.has(t));
    return `
      <tr>
        <th scope="row">${esc(facetById.get(f)?.name ?? f)}</th>
        <td>
          <div class="tags">${tags.map((t) => tagChip(t, skillsLink({ tags: [t] }))).join("")}</div>
          ${explained.map((t) => `<p class="tag-meaning">${esc(tagInfo.get(t) ?? "")}</p>`).join("")}
        </td>
      </tr>`;
  });
  return `<table class="tag-detail">${rows.join("")}</table>`;
}

export default function Page(pageContext: PageContextServer): string {
  const { skill: s, copy } = pageContext.data as Data;
  const gh = github(s);
  const sh = s["skills.sh"];
  const claw = s["clawhub.ai"];
  const state = s.skillMd;
  const removed = state?.removed;
  // A skill gone from its repo lives on at the commit its copy is from.
  const at = removed && state ? state.version : "HEAD";
  const links = [
    sh ? `<a href="${esc(sh.url)}">skills.sh page</a>` : "",
    claw?.url ? `<a href="${esc(claw.url)}">ClawHub page</a>` : "",
    gh
      ? `<a href="https://github.com/${esc(gh.repo)}${gh.dir || removed ? `/tree/${at}/${esc(encodeURI(gh.dir))}` : ""}">Source on GitHub</a>`
      : "",
    `<a href="${skillsLink({ repo: repoKey(s) })}">All skills from ${esc(repoKey(s))}</a>`,
  ].filter(Boolean);
  const installs = [sh?.install, claw?.install].filter((c): c is string => Boolean(c));
  return `
    <div class="page skill-page">
      <p class="crumbs"><a href="${href()}">Skills</a> <span aria-hidden="true">/</span> <a href="${skillsLink({ repo: repoKey(s) })}">${esc(repoKey(s))}</a></p>
      <h1>${esc(s.name)}</h1>
      <p class="lede">${esc(s.description)}</p>
      ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
      ${removed ? `<p class="note">Gone from ${gh ? esc(gh.repo) : "its registry"} since ${date(removed)}, so installing it no longer works. The SKILL.md below is its last version.</p>` : ""}
      ${tldr(s)}
      <div class="details-grid">
        <div>
          ${
            installs.length
              ? installs
                  .map(
                    (c) =>
                      `<div class="install"><code>${esc(c)}</code><button type="button" class="copy" data-copy="${esc(c)}">Copy</button></div>`,
                  )
                  .join("")
              : `<p class="muted">No install command known for this registry.</p>`
          }
          <p class="links">${links.join(" · ")}</p>
          ${facts(s)}
        </div>
        ${sh?.weeklyInstalls ? statTile(sh.weeklyInstalls, data.snapshots.installs, compact) : ""}
      </div>
      ${tagTable(s)}
      <section class="skill-md" aria-labelledby="skill-md">
        <h2 id="skill-md">SKILL.md</h2>
        ${
          copy && state
            ? `<p class="muted">From ${source(s, state)}. Checked daily, last changed ${date(state.updated)}.</p>
        ${copy.frontmatter ? `<details class="frontmatter"><summary>Frontmatter</summary><pre><code>${esc(copy.frontmatter)}</code></pre></details>` : ""}
        <div class="markdown">${copy.html}</div>`
            : `<p class="muted">No copy of its SKILL.md yet.</p>`
        }
      </section>
    </div>`;
}
