/** The shape of ../skills.json, the single data file behind the site. */

/** A registry a skill can be listed on, by the domain that keys its listing on a skill. */
export type Registry = "skills.sh" | "clawhub.ai" | "skillhub.cn";

export interface Data {
  /** When the data was last edited (YYYY-MM-DD). */
  updated: string;
  /** When each kind of number was collected (YYYY-MM-DD). */
  snapshots: Record<"installs" | "stars" | "downloads" | "tags", string>;
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
  /**
   * Unique: where the skill's SKILL.md lives. On GitHub, the repo and the directory inside it,
   * `owner/name/path/to/dir` (just `owner/name` for a SKILL.md at the root); the repo has an
   * entry in `repos`. Otherwise a domain and the skill's name there, such as
   * `clawhub.ai/steipete/weather`. GitHub owners can't contain a dot, so a dot in the first
   * segment marks a skill that isn't on GitHub.
   */
  id: string;
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  "skills.sh"?: SkillsSh;
  "clawhub.ai"?: ClawHub;
  "skillhub.cn"?: SkillHub;
  /** Something to know before installing. */
  note?: string;
}

/** The GitHub repo (`owner/name`) a skill lives in, and the directory inside it, or null when it isn't on GitHub. */
export function github(skill: Skill): { repo: string; dir: string } | null {
  const [owner, name, ...dir] = skill.id.split("/");
  return owner.includes(".") ? null : { repo: `${owner}/${name}`, dir: dir.join("/") };
}

export interface SkillsSh {
  /** The skill's page on skills.sh. */
  url: string;
  install: string;
  /** All-time installs, or null when the skill wasn't in the top 600. */
  installs: number | null;
  /** Installs per week for the 8 weeks up to the installs snapshot, oldest first. */
  weeklyInstalls: number[] | null;
  /** When skills.sh first saw the skill (YYYY-MM-DD). */
  firstSeen: string | null;
}

export interface ClawHub {
  /** The skill's page on ClawHub, or null when its publisher is unknown. */
  url: string | null;
  install: string | null;
  downloads: number;
}

export interface SkillHub {
  downloads: number;
}
