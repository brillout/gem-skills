import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";
import { renderSkillMd } from "../../markdown.ts";
import { skillById } from "../../skills.ts";
import { github } from "../../types.ts";

// The copy of every SKILL.md, read at build time.
const copies = import.meta.glob<string>("../../../skill-md/**/*.md", {
  query: "?raw",
  import: "default",
});

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const id = decodeURIComponent(pageContext.routeParams["*"]).replace(/\/$/, "");
  const skill = skillById.get(id);
  if (!skill) throw render(404);
  const load = copies[`../../../skill-md/${id}.md`];
  const gh = github(skill);
  const commit = skill.skillMd?.version;
  // Relative links and images point into the skill's directory, at the commit the copy is from.
  const rebase =
    gh && commit
      ? (url: string, image: boolean) => {
          const root = image
            ? `https://raw.githubusercontent.com/${gh.repo}/${commit}/`
            : `https://github.com/${gh.repo}/blob/${commit}/`;
          if (url.startsWith("/")) return new URL(url.slice(1), root).href;
          return new URL(url, gh.dir ? `${root}${gh.dir}/` : root).href;
        }
      : null;
  return { skill, copy: load ? renderSkillMd(await load(), rebase) : null };
}
