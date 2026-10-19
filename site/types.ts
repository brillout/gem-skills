/** The shape of ../skills.json, the single data file behind the site. */

export type Registry = "skills.sh" | "ClawHub" | "Tencent SkillHub";

export interface Data {
  /** When the data was last edited (YYYY-MM-DD). */
  updated: string;
  /** When each kind of number was collected (YYYY-MM-DD). */
  snapshots: Record<"installs" | "stars" | "downloads" | "tags" | "audits", string>;
  categories: Category[];
  facets: Facet[];
  repos: Repo[];
  skills: Skill[];
}

export interface Category {
  id: string;
  /** Short name for chips. */
  label: string;
  name: string;
  description: string;
}

/** A tag dimension. Tags are written `facet:value`, except topics, which have no prefix. */
export interface Facet {
  id: string;
  name: string;
  question: string;
  /** How many values of this facet a skill carries. */
  count: "one" | "one or more" | "at most one" | "one to five" | "any";
  values: { id: string; description?: string }[];
  /** `false` for topics, which are written without a `topic:` prefix. */
  prefix?: false;
  /** Display groups (topics only). */
  groups?: { name: string; values: string[] }[];
}

export interface Repo {
  /** GitHub `owner/name`. */
  id: string;
  url: string;
  /** `skills`: exists to ship skills. `project`: a product that also ships a skill. `index`: a curated list or catalog. */
  kind: "skills" | "project" | "index";
  /** GitHub stars, or null when unknown. */
  stars: number | null;
  description: string | null;
  /** How many of the repo's skills were in the skills.sh all-time top 600. */
  leaderboardSkills: number | null;
  note?: string;
}

export interface Skill {
  /** Unique: the skills.sh path, `clawhub/<owner>/<name>` or `skillhub/<name>`. */
  id: string;
  name: string;
  registry: Registry;
  /** Who publishes it: a skills.sh source (GitHub `owner/name` or a domain) or a ClawHub handle. */
  source: string | null;
  /** The GitHub repo, when the source is one; it has an entry in `repos`. */
  repo: string | null;
  /** The skill's page on its registry. */
  url: string | null;
  install: string | null;
  description: string;
  categories: string[];
  /** All-time installs on skills.sh. */
  installs: number | null;
  /** Installs per week for the 8 weeks up to the installs snapshot, oldest first. */
  weeklyInstalls: number[] | null;
  downloads: Partial<Record<Registry, number>> | null;
  /** When skills.sh first saw the skill (YYYY-MM-DD). */
  firstSeen: string | null;
  /** skills.sh security scanners and their verdicts. */
  audits: Record<string, string> | null;
  tags: string[];
  /** Something to know before installing. */
  note?: string;
}
