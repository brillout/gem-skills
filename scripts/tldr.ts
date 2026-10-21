/**
 * tldr.ts — find the skills whose TLDR is missing or behind their SKILL.md, and set TLDRs.
 *
 * Run: pnpm run tldr [count]        the skills and bundles with the largest skew first: skew, id,
 *                                   the copies to read
 *      pnpm run tldr <id> <json>    set a skill's or a bundle's TLDR:
 *                                   {"glance": [{"label", "text"}], "text"} (or pipe the JSON in)
 *
 * The list leaves skipped skills out (see `skip` in skills.json). Setting a TLDR resets the
 * skew to 0 and records a permalink to what the TLDR summarizes: the skill's directory at the
 * commit its copy in skill-md/ was taken from. For a skill that isn't on GitHub, it's the copy
 * itself, at the commit of this repo that last changed it, so commit the copy before summarizing
 * it. For a bundle, it's the repo at its current commit, which its skills' copies must match.
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readData, root, writeData } from "./data.ts";
import { copyPath, rawUrl, REPO } from "../website/skill-md.ts";
import {
  bundleRepo,
  github,
  skipped,
  tldrProblems,
  type Bundle,
  type Skill,
  type Tldr,
} from "../website/types.ts";

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

/** The permalink to a bundle's repo at its current commit, once its skills' copies are checked against it. */
async function bundlePermalink(bundle: Bundle): Promise<string> {
  const repo = bundleRepo(bundle);
  const commit = git("ls-remote", `https://github.com/${repo}`, "HEAD").split(/\s/)[0];
  const behind: string[] = [];
  for (const { id } of bundle.skills) {
    const skill = skillOf(id);
    const dir = github(skill)?.dir;
    const res = await fetch(
      rawUrl(`https://github.com/${repo}/tree/${commit}${dir ? `/${dir}` : ""}`) ?? "",
    );
    if (!res.ok || (await res.text()) !== readFileSync(`${root}${copyPath(skill)}`, "utf8"))
      behind.push(id);
  }
  if (behind.length)
    throw new Error(
      `run pnpm run sync ${repo} first: ${behind.join(", ")} changed since their copy`,
    );
  return `https://github.com/${repo}/tree/${commit}`;
}

const data = readData();
const skillOf = (id: string) => {
  const skill = data.skills.find((s) => s.id === id);
  if (!skill) throw new Error(`no skill ${id}`);
  return skill;
};
const [first, ...rest] = process.argv.slice(2);

if (!first || /^\d+$/.test(first)) {
  const list = [
    ...data.skills
      .filter((s) => !skipped(data, s))
      .map((s) => ({ skew: s.skillMd?.skew, id: s.id, read: [copyPath(s)], tldr: s.tldr })),
    ...data.bundles.map((b) => ({
      skew: b.skew,
      id: b.id,
      read: b.skills.map(({ id }) => copyPath(skillOf(id))),
      tldr: b.tldr,
    })),
  ].sort((a, b) => (b.skew ?? 0) - (a.skew ?? 0));
  for (const e of list.slice(0, first ? Number(first) : undefined))
    console.log(`${e.skew ?? "?"}\t${e.id}\t${e.read.join(" ")}${e.tldr ? "" : "\t(no TLDR)"}`);
} else {
  const bundle = data.bundles.find((b) => b.id === first);
  const skill = bundle ? null : skillOf(first);
  const input = (rest.length ? rest.join(" ") : readFileSync(0, "utf8")).trim();
  const { glance, text } = JSON.parse(input) as Pick<Tldr, "glance" | "text">;
  const problems = tldrProblems({ glance, text });
  if (problems.length) throw new Error(problems.join("; "));
  const tldr: Tldr = {
    glance,
    text,
    permalink: skill ? permalink(skill) : await bundlePermalink(bundle as Bundle),
  };
  if (skill) {
    skill.tldr = tldr;
    if (skill.skillMd) skill.skillMd.skew = 0;
  } else if (bundle) {
    bundle.tldr = tldr;
    bundle.skew = 0;
  }
  writeData(data);
  console.log(`${first}: TLDR set, summarizing ${tldr.permalink}`);
}
