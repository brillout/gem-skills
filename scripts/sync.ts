/**
 * sync.ts — keep the copy of every skill's SKILL.md in data/skill-snapshots/ current.
 *
 * For each skill it fetches the SKILL.md from where the skill lives: its GitHub repo, ClawHub,
 * Tencent SkillHub or the website that publishes it. When the text differs from the copy, it
 * rewrites the copy, records the version in the skill's `skillMd` and recomputes `skew`, how far
 * the text has moved from the SKILL.md the skill's TLDR summarizes. Skipped skills keep the copy
 * they have. When a bundle's skill changes, it recomputes the bundle's skew too.
 *
 * Run: pnpm run sync [id prefix...]
 */

import { execFile, execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { readData, root, writeData } from "./data.ts";
import { copyPath, rawUrl, skew } from "../website/skill-md.ts";
import { github, skipped, type Bundle, type Skill, type SkillMd } from "../website/types.ts";

const today = new Date().toISOString().slice(0, 10);
const scratch = mkdtempSync(join(tmpdir(), "gemskills-sync-"));
const git = (args: string[]) =>
  promisify(execFile)("git", args, { env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } }).then(
    ({ stdout }) => stdout.trim(),
  );

// ------------------------------------------------------------------- fetching

/** GET a URL, or null when it isn't there (404). Network errors, 429 and 5xx are retried. */
async function request(url: string): Promise<Response | null> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { "user-agent": "gemskills-sync" } }).catch(
      (error: Error) => error,
    );
    if (!(res instanceof Error)) {
      if (res.status === 404) return null;
      if (res.ok) return res;
      if (res.status !== 429 && res.status < 500) throw new Error(`${url}: HTTP ${res.status}`);
    }
    if (attempt === 4)
      throw new Error(`${url}: ${res instanceof Error ? res.message : `HTTP ${res.status}`}`);
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
  }
}
const get = async (url: string) => (await request(url))?.text() ?? null;
const getJson = async <T>(url: string) => {
  const text = await get(url);
  return text === null ? null : (JSON.parse(text) as T);
};

interface Found {
  version: string;
  text: string;
}

const skillMdIn = (dir: string) => (dir ? `${dir}/SKILL.md` : "SKILL.md");
const raw = (repo: string, commit: string, path: string) =>
  `https://raw.githubusercontent.com/${repo}/${commit}/${path.split("/").map(encodeURIComponent).join("/")}`;

/** Each repo's HEAD commit, looked up once per run. */
const heads = new Map<string, Promise<string>>();
function head(repo: string): Promise<string> {
  if (!heads.has(repo))
    heads.set(
      repo,
      git(["ls-remote", `https://github.com/${repo}`, "HEAD"]).then((out) => {
        const commit = out.split(/\s/)[0];
        if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error(`${repo}: no HEAD commit`);
        return commit;
      }),
    );
  return heads.get(repo) as Promise<string>;
}

/** Blobless clones with full history, for the SKILL.md files that are gone from HEAD. */
const clones = new Map<string, Promise<string>>();
function clone(repo: string): Promise<string> {
  if (!clones.has(repo)) {
    const dir = join(scratch, repo.replace("/", "__"));
    const args = ["clone", "--quiet", "--filter=blob:none", "--no-checkout"];
    clones.set(
      repo,
      git([...args, `https://github.com/${repo}`, dir]).then(() => dir),
    );
  }
  return clones.get(repo) as Promise<string>;
}

/** When a file was deleted from a repo, and the last commit that still had it. */
async function deletion(repo: string, path: string): Promise<{ date: string; before: string }> {
  const dir = await clone(repo);
  const log = ["log", "-1", "--no-renames", "--diff-filter=D", "--format=%H %cs", "--", path];
  const [commit, date] = (await git(["-C", dir, ...log])).split(" ");
  if (!commit) throw new Error(`${path} isn't in ${repo} and never was`);
  return { date, before: await git(["-C", dir, "rev-parse", `${commit}^`]) };
}

/** ClawHub and Tencent SkillHub share an API: the skill's latest version, and its files. */
async function registry(base: string, query: string): Promise<Found | null> {
  const meta = await getJson<{ latestVersion?: { version: string } }>(`${base}?${query}`);
  if (!meta?.latestVersion) return null;
  const text = await get(`${base}/file?path=SKILL.md${query ? `&${query}` : ""}`);
  return text === null ? null : { version: meta.latestVersion.version, text };
}

/** A skill a website publishes in its `/.well-known/skills/index.json`, as a zip archive or as a plain SKILL.md. */
async function website(host: string, name: string): Promise<Found | null> {
  const index = `https://${host}/.well-known/skills/index.json`;
  type Entry = { name: string; type?: string; url: string; digest?: string };
  const entry = (await getJson<{ skills: Entry[] }>(index))?.skills.find((s) => s.name === name);
  if (!entry) return null;
  const url = new URL(entry.url, index).href;
  const version = entry.digest ?? url;
  if (entry.type !== "archive") {
    const text = await get(url);
    return text === null ? null : { version, text };
  }
  const res = await request(url);
  if (!res) return null;
  const zip = join(scratch, `${host}-${name}.zip`);
  writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  const [file] = execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" })
    .split("\n")
    .filter((f) => /(^|\/)SKILL\.md$/.test(f))
    .sort((a, b) => a.split("/").length - b.split("/").length);
  if (!file) throw new Error(`${url}: no SKILL.md in the archive`);
  return { version, text: execFileSync("unzip", ["-p", zip, file], { encoding: "utf8" }) };
}

/** The SKILL.md as the skill's source has it now, or null when the source no longer has it. */
async function fetchSkillMd(skill: Skill): Promise<Found | null> {
  const gh = github(skill);
  if (gh) {
    const version = await head(gh.repo);
    const text = await get(raw(gh.repo, version, skillMdIn(gh.dir)));
    return text === null ? null : { version, text };
  }
  const [host, ...name] = skill.id.split("/");
  if (host === "clawhub.ai") {
    const [owner, slug] = name.map(encodeURIComponent);
    return registry(`https://clawhub.ai/api/v1/skills/${slug}`, `owner=${owner}`);
  }
  if (host === "skillhub.cn")
    return registry(`https://api.skillhub.cn/api/v1/skills/${encodeURIComponent(name[0])}`, "");
  return website(host, name.join("/"));
}

// ------------------------------------------------------------------- syncing

const changed = new Set<string>();
const removed: string[] = [];
const errors: string[] = [];

/** How far `text` is from the SKILL.md the skill's TLDR summarizes. */
async function skewOf(skill: Skill, copy: string | null, text: string): Promise<number> {
  if (!skill.tldr) return skew("", text);
  const url = rawUrl(skill.tldr.permalink);
  const summarized = url ? await get(url).catch(() => null) : null;
  if (summarized !== null) return skew(summarized, text);
  // The summarized SKILL.md can't be fetched: add this change to the skew so far.
  errors.push(`${skill.id}: can't fetch the SKILL.md its TLDR summarizes, ${skill.tldr.permalink}`);
  return (skill.skillMd?.skew ?? 0) + skew(copy ?? "", text);
}

async function save(skill: Skill, copy: string | null, found: Found, gone?: string) {
  let { version, updated, skew: words } = skill.skillMd ?? ({} as SkillMd);
  if (copy !== found.text || !skill.skillMd) {
    const file = join(root, copyPath(skill));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, found.text);
    changed.add(skill.id);
    version = found.version;
    updated = today;
    words = await skewOf(skill, copy, found.text);
  }
  skill.skillMd = { version, updated, ...(gone ? { removed: gone } : {}), skew: words };
}

async function sync(skill: Skill) {
  const file = join(root, copyPath(skill));
  const copy = existsSync(file) ? readFileSync(file, "utf8") : null;
  const before = JSON.stringify(skill.skillMd);
  const found = await fetchSkillMd(skill);
  if (found) await save(skill, copy, found);
  else {
    // Gone from its source: keep the last version there was.
    const gh = github(skill);
    if (gh) {
      const path = skillMdIn(gh.dir);
      const { date, before: commit } = await deletion(gh.repo, path);
      const text = await get(raw(gh.repo, commit, path));
      if (text === null) throw new Error(`${path} is missing at ${gh.repo}@${commit}`);
      await save(skill, copy, { version: commit, text }, date);
    } else if (copy !== null && skill.skillMd) {
      const { version, updated, skew: words } = skill.skillMd;
      skill.skillMd = { version, updated, removed: today, skew: words };
    } else throw new Error("not found at its source");
    removed.push(skill.id);
  }
  if (JSON.stringify(skill.skillMd) !== before) changed.add(skill.id);
}

/** How far a bundle's skills are from the SKILL.md files at the commit its TLDR summarizes. */
async function bundleSkew(bundle: Bundle, skills: Map<string, Skill>): Promise<number> {
  const commit = bundle.tldr && /\/tree\/([0-9a-f]{40})$/.exec(bundle.tldr.permalink)?.[1];
  let words = 0;
  for (const { id } of bundle.skills) {
    const skill = skills.get(id);
    const gh = skill && github(skill);
    if (!gh) continue;
    const text = readFileSync(join(root, copyPath(skill)), "utf8");
    // A skill that's new since that commit counts all its words.
    const summarized = commit ? ((await get(raw(gh.repo, commit, skillMdIn(gh.dir)))) ?? "") : "";
    words += skew(summarized, text);
  }
  return words;
}

/** Run `work` on every item, `size` at a time. */
async function pool<T>(items: T[], size: number, work: (item: T) => Promise<void>) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: size }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) await work(item);
    }),
  );
}

const data = readData();
const only = process.argv.slice(2);
const listed = data.skills.filter((s) => !only.length || only.some((p) => s.id.startsWith(p)));
const skills = listed.filter((s) => !skipped(data, s) || !existsSync(join(root, copyPath(s))));
await pool(skills, 8, (skill) =>
  sync(skill).catch((error: Error) => {
    errors.push(`${skill.id}: ${error.message}`);
  }),
);

const byId = new Map(data.skills.map((s) => [s.id, s]));
for (const bundle of data.bundles)
  if (bundle.skills.some(({ id }) => changed.has(id))) {
    const before = bundle.skew;
    bundle.skew = await bundleSkew(bundle, byId).catch((error: Error) => {
      errors.push(`bundle ${bundle.id}: ${error.message}`);
      return before;
    });
    if (bundle.skew !== before) changed.add(`bundle ${bundle.id}`);
  }

// Drop the copies of skills that left the list.
if (!only.length) {
  const kept = new Set(data.skills.map(copyPath));
  const dir = join(root, "data/skill-snapshots");
  for (const file of existsSync(dir) ? readdirSync(dir, { recursive: true, encoding: "utf8" }) : [])
    if (file.endsWith(".md") && !kept.has(`data/skill-snapshots/${file}`)) {
      rmSync(join(dir, file));
      changed.add(`removed copy ${file}`);
    }
}

writeData(data);
rmSync(scratch, { recursive: true, force: true });

console.log(
  `Checked ${skills.length} skills, skipped ${listed.length - skills.length}: ${changed.size} changed, ${removed.length} gone from their source, ${errors.length} failed.`,
);
for (const id of changed) console.log(`  changed ${id}`);
for (const e of errors) console.error(`  failed ${e}`);
if (errors.length) process.exit(1);
