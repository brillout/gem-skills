/**
 * check.ts — validate skills.json against its own tag vocabulary.
 *
 * Run: pnpm run check:data
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { copyPath, REPO } from "./site/skill-md.ts";
import { github, type Data, type Facet } from "./site/types.ts";

const root = new URL("./", import.meta.url);
const data: Data = JSON.parse(readFileSync(new URL("skills.json", root), "utf8"));
const errors: string[] = [];
const fail = (where: string, message: string) => errors.push(`${where}: ${message}`);

const facets = new Map<string, Facet>(data.facets.map((f) => [f.id, f]));
const topics = new Set(facets.get("topic")?.values.map((v) => v.id));
const categories = new Set(data.categories.map((c) => c.id));
const repos = new Set<string>();
for (const repo of data.repos) {
  if (repos.has(repo.id)) fail(repo.id, "duplicate repo");
  repos.add(repo.id);
}

const COUNTS: Record<Facet["count"], (n: number) => boolean> = {
  one: (n) => n === 1,
  "one or more": (n) => n >= 1,
  "at most one": (n) => n <= 1,
  "one to five": (n) => n >= 1 && n <= 5,
  any: () => true,
};

const ids = new Set<string>();
for (const skill of data.skills) {
  const at = skill.id;
  if (ids.has(at)) fail(at, "duplicate skill id");
  ids.add(at);
  if (!skill.description) fail(at, "missing description");
  if (skill.categories.length === 0) fail(at, "no category");
  for (const c of skill.categories) if (!categories.has(c)) fail(at, `unknown category "${c}"`);
  const repo = github(skill)?.repo;
  if (repo && !repos.has(repo)) fail(at, `repo "${repo}" has no entry in repos`);
  if (!skill["skills.sh"] && !skill["clawhub.ai"] && !skill["skillhub.cn"])
    fail(at, "not listed on any registry");
  const weekly = skill["skills.sh"]?.weeklyInstalls;
  if (weekly && weekly.length !== 8) fail(at, "weeklyInstalls must have 8 weeks");

  const copy = existsSync(new URL(copyPath(skill), root));
  if (skill.skillMd && !copy) fail(at, `no copy at ${copyPath(skill)}; run pnpm run sync`);
  if (!skill.skillMd && copy) fail(at, `${copyPath(skill)} has no skillMd; run pnpm run sync`);
  const skew = skill.skillMd?.skew;
  if (skew !== undefined && !(Number.isInteger(skew) && skew >= 0))
    fail(at, "skew must be a whole number of words");
  if (skill.tldr) {
    if (!skill.tldr.text.trim()) fail(at, "empty TLDR");
    const gh = github(skill);
    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const target = gh
      ? `https://github.com/${escape(gh.repo)}/tree/[0-9a-f]{40}${gh.dir ? `/${escape(gh.dir)}` : ""}`
      : `https://github.com/${REPO}/blob/[0-9a-f]{40}/${escape(copyPath(skill))}`;
    if (!new RegExp(`^${target}$`).test(skill.tldr.permalink))
      fail(at, "the TLDR permalink must point to the skill at a commit; set it with pnpm run tldr");
  }

  const perFacet = new Map<string, string[]>();
  for (const tag of skill.tags) {
    const i = tag.indexOf(":");
    const facetId = i === -1 ? "topic" : tag.slice(0, i);
    const value = i === -1 ? tag : tag.slice(i + 1);
    const facet = facets.get(facetId);
    if (!facet || (i === -1) !== (facet.prefix === false)) {
      fail(at, `unknown tag "${tag}"`);
      continue;
    }
    // Stack values are open-ended; every other facet has a closed vocabulary.
    if (facetId !== "stack" && !facet.values.some((v) => v.id === value))
      fail(at, `unknown tag "${tag}"`);
    perFacet.set(facetId, [...(perFacet.get(facetId) ?? []), value]);
  }
  for (const facet of data.facets) {
    const values = perFacet.get(facet.id) ?? [];
    if (!COUNTS[facet.count](values.length))
      fail(at, `needs ${facet.count} ${facet.id} tag(s), has ${values.length}`);
    if (new Set(values).size !== values.length) fail(at, `repeated ${facet.id} tag`);
  }
  const needs = perFacet.get("needs") ?? [];
  if (needs.includes("none") && needs.length > 1)
    fail(at, "needs:none can't be combined with other needs");
  const type = perFacet.get("type")?.[0];
  if ((type === "guidelines" || type === "router") && perFacet.get("effect")?.[0] !== "none")
    fail(at, `type:${type} must be effect:none`);
  if (!skill.tags.every((t) => t.includes(":") || topics.has(t))) fail(at, "unknown topic");
}

const copies = new Set(data.skills.map(copyPath));
for (const file of readdirSync(new URL("skill-md", root), { recursive: true, encoding: "utf8" }))
  if (file.endsWith(".md") && !copies.has(`skill-md/${file}`))
    fail(`skill-md/${file}`, "copy of a skill that isn't in skills.json");

if (errors.length > 0) {
  console.error(
    `skills.json has ${errors.length} problem(s):\n${errors.map((e) => `  ${e}`).join("\n")}`,
  );
  process.exit(1);
}
console.log(`skills.json is valid: ${data.skills.length} skills, ${data.repos.length} repos.`);
