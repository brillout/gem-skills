import type { PageContextServer } from "vike/types";
import { compact, date, esc, href, plural } from "../../format.ts";
import { skillsLink } from "../../list.ts";
import {
  data,
  firstSeenOf,
  glanceHtml,
  installsOf,
  repoById,
  repoKey,
  skillHref,
  skillsOf,
  tldrHtml,
} from "../../skills.ts";
import type { Bundle } from "../../types.ts";
import type { Data } from "./+data.ts";

function facts(b: Bundle): string {
  const repo = repoById.get(repoKey(b));
  const top = skillsOf(b).toSorted((x, y) => (installsOf(y) ?? -1) - (installsOf(x) ?? -1))[0];
  const installs = installsOf(top);
  const firstSeen = firstSeenOf(b);
  const list: string[] = [];
  if (installs !== null)
    list.push(
      `<div><dt>Installs</dt><dd>${installs.toLocaleString("en")} <span class="muted">of <a href="${skillHref(top.id)}">${esc(top.name)}</a>, its most installed skill, on skills.sh, ${date(data.asOf.installs)}</span></dd></div>`,
    );
  if (repo?.stars != null)
    list.push(
      `<div><dt>Repo stars</dt><dd>${repo.stars.toLocaleString("en")} <span class="muted">${esc(repo.id)}</span></dd></div>`,
    );
  if (firstSeen)
    list.push(
      `<div><dt>First seen</dt><dd>${date(firstSeen)} <span class="muted">on skills.sh, its first skill</span></dd></div>`,
    );
  return `<dl class="facts">${list.join("")}</dl>`;
}

function skills(b: Bundle): string {
  const items = b.skills.map(({ id, standalone, note }, i) => {
    const s = skillsOf(b)[i];
    const installs = installsOf(s);
    return `
      <li>
        <div class="skill-head">
          <h3><a class="skill-name" href="${skillHref(id)}">${esc(s.name)}</a></h3>
          ${standalone ? "" : `<span class="kind">Only in the bundle</span>`}
          ${installs === null ? "" : `<span class="metric"><strong>${compact(installs)}</strong> installs</span>`}
        </div>
        <p class="skill-desc">${esc(s.description)}</p>
        ${note ? `<p class="member-note">${esc(note)}</p>` : ""}
      </li>`;
  });
  return `<ol class="bundle-skills">${items.join("")}</ol>`;
}

export default function Page(pageContext: PageContextServer): string {
  const { bundle: b } = pageContext.data as Data;
  const repo = repoKey(b);
  const alone = b.skills.filter((m) => m.standalone).length;
  return `
    <div class="page skill-page bundle-page">
      <p class="crumbs"><a href="${href()}">Skills</a> <span aria-hidden="true">/</span> <a href="${skillsLink({ repo })}">${esc(repo)}</a></p>
      <h1>${esc(b.name)} <span class="kind">Bundle · ${plural(b.skills.length, "skill")}</span></h1>
      ${
        b.tldr?.glance.length
          ? `<section class="at-a-glance" aria-label="At a glance">${glanceHtml(b.tldr.glance)}</section>`
          : `<p class="lede">${esc(b.description)}</p>`
      }
      ${b.tldr ? tldrHtml(b.tldr, "the repo", b.skew) : ""}
      <div class="details-grid">
        <div>
          ${b.install
            .map(
              ({ label, command }) =>
                `<p class="install-label">${esc(label)}</p><div class="install"><code>${esc(command)}</code><button type="button" class="copy" data-copy="${esc(command)}">Copy</button></div>`,
            )
            .join("")}
          <p class="links"><a href="https://github.com/${esc(repo)}">Source on GitHub</a> · <a href="${skillsLink({ repo })}">All skills from ${esc(repo)}</a></p>
          ${facts(b)}
        </div>
      </div>
      <section aria-labelledby="skills">
        <h2 id="skills">Its skills, in the order they're used</h2>
        <p class="muted">${
          alone === b.skills.length
            ? "Each also works alone, so each also has its own entry in the skills list."
            : "The ones marked “Only in the bundle” need the rest of it, so they're only listed here. The others also have their own entry in the skills list."
        }</p>
        ${skills(b)}
      </section>
    </div>`;
}
