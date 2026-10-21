/**
 * tldr.ts — find the skills whose TLDR is missing or behind their SKILL.md, and set TLDRs.
 *
 * Run: pnpm run tldr [count]        the skills with the largest skew first: skew, id, copy
 *      pnpm run tldr <id> <json>    set a skill's TLDR: {"glance": [{"label", "text"}], "text"}
 *                                   (or pipe the JSON in)
 *
 * The list leaves skipped skills out (see `skip` in skills.json). Setting a TLDR resets the
 * skill's skew to 0 and records a permalink to what the TLDR summarizes: the skill's directory
 * at the commit its copy in skill-md/ was taken from. For a skill that isn't on GitHub, it's the
 * copy itself, at the commit of this repo that last changed it, so commit the copy before
 * summarizing it.
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readData, root, writeData } from "./data.ts";
import { copyPath, REPO } from "./site/skill-md.ts";
import { github, skipped, tldrProblems, type Skill, type Tldr } from "./site/types.ts";

const git = (...args: string[]) =>
  execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();

/** The permalink to what a TLDR written from the skill's copy summarizes. */
function permalink(skill: Skill): string {
  if (!skill.skillMd) throw new Error(`${skill.id} has no copy yet; run pnpm run sync`);
  const gh = github(skill);
  if (gh)
    return `https://github.com/${gh.repo}/tree/${skill.skillMd.version}${gh.dir ? `/${gh.dir}` : ""}`;
  const file = copyPath(skill);
  if (git("status", "--porcelain", "--", file)) throw new Error(`commit ${file} first`);
  return `https://github.com/${REPO}/blob/${git("log", "-1", "--format=%H", "--", file)}/${file}`;
}

const data = readData();
const [first, ...rest] = process.argv.slice(2);

if (!first || /^\d+$/.test(first)) {
  const list = data.skills
    .filter((s) => !skipped(data, s))
    .sort((a, b) => (b.skillMd?.skew ?? 0) - (a.skillMd?.skew ?? 0));
  for (const s of list.slice(0, first ? Number(first) : undefined))
    console.log(`${s.skillMd?.skew ?? "?"}\t${s.id}\t${copyPath(s)}${s.tldr ? "" : "\t(no TLDR)"}`);
} else {
  const skill = data.skills.find((s) => s.id === first);
  if (!skill) throw new Error(`no skill ${first}`);
  const input = (rest.length ? rest.join(" ") : readFileSync(0, "utf8")).trim();
  const { glance, text } = JSON.parse(input) as Pick<Tldr, "glance" | "text">;
  const problems = tldrProblems({ glance, text });
  if (problems.length) throw new Error(problems.join("; "));
  skill.tldr = { glance, text, permalink: permalink(skill) };
  if (skill.skillMd) skill.skillMd.skew = 0;
  writeData(data);
  console.log(`${skill.id}: TLDR set, summarizing ${skill.tldr.permalink}`);
}
