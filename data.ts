/** Read and write skills.json, keeping each skill's fields in one order and the file formatted. */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Data, Skill } from "./site/types.ts";

export const root = fileURLToPath(new URL(".", import.meta.url));
const path = `${root}skills.json`;

export const readData = (): Data => JSON.parse(readFileSync(path, "utf8"));

const ORDER = [
  "id",
  "name",
  "description",
  "tldr",
  "categories",
  "tags",
  "skills.sh",
  "clawhub.ai",
  "skillhub.cn",
  "skillMd",
  "note",
];
const rank = (key: string) => (ORDER.includes(key) ? ORDER.indexOf(key) : ORDER.length);

export function writeData(data: Data) {
  data.skills = data.skills.map(
    (s) => Object.fromEntries(Object.entries(s).sort(([a], [b]) => rank(a) - rank(b))) as Skill,
  );
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
  execFileSync(`${root}node_modules/.bin/oxfmt`, [path], { stdio: "ignore" });
}
