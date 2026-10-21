/** Read and write skills.json, keeping its fields in one order and the file formatted. */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Data } from "../website/types.ts";

export const root = fileURLToPath(new URL("..", import.meta.url));
const path = `${root}data/skills.json`;

export const readData = (): Data => JSON.parse(readFileSync(path, "utf8"));

const TOP = ["updated", "asOf", "skip", "facets", "repos", "bundles", "skills"];
const ORDER = [
  "id",
  "name",
  "description",
  "tldr",
  "tags",
  "skills.sh",
  "clawhub.ai",
  "skillhub.cn",
  "skillMd",
  "standalone",
  "note",
  "skills",
  "install",
  "skew",
];
const sorted = <T extends object>(o: T, order: string[]) => {
  const rank = (key: string) => (order.includes(key) ? order.indexOf(key) : order.length);
  return Object.fromEntries(Object.entries(o).sort(([a], [b]) => rank(a) - rank(b))) as T;
};

export function writeData(data: Data) {
  data.skills = data.skills.map((s) => sorted(s, ORDER));
  data.bundles = data.bundles.map((b) =>
    sorted({ ...b, skills: b.skills.map((m) => sorted(m, ORDER)) }, ORDER),
  );
  writeFileSync(path, `${JSON.stringify(sorted(data, TOP), null, 2)}\n`);
  execFileSync(`${root}node_modules/.bin/oxfmt`, [path], { stdio: "ignore" });
}
