import { compact, date, esc } from "../../format.ts";
import { skillsLink } from "../../list.ts";
import { data, desc } from "../../skills.ts";
import { github, type Repo, type Skill } from "../../types.ts";

const KINDS: Record<Repo["kind"], string> = {
  skills: "Skills",
  project: "Project",
  index: "Index",
};

export default function Page(): string {
  const listed = new Map<string, Skill[]>();
  for (const s of data.skills) {
    const repo = github(s)?.repo;
    if (repo) listed.set(repo, [...(listed.get(repo) ?? []), s]);
  }
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
