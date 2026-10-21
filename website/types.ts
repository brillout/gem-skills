/** The shape of ../data/skills.json, the single data file behind the site. */

/** A registry a skill can be listed on, by the domain that keys its listing on a skill. */
export type Registry = "skills.sh" | "clawhub.ai" | "skillhub.cn";

export interface Data {
  /** When the data was last edited (YYYY-MM-DD). */
  updated: string;
  /** When each kind of number was collected, and when the tags were assigned (YYYY-MM-DD). */
  asOf: Record<"installs" | "stars" | "downloads" | "tags", string>;
  /** The tags whose skills the skills list and the daily sync leave out, each with why. */
  skip: { tag: string; note: string }[];
  categories: Category[];
  facets: Facet[];
  repos: Repo[];
  bundles: Bundle[];
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
  /** What the skill is and does, written from the SKILL.md its permalink points to. */
  tldr?: Tldr;
  categories: string[];
  tags: string[];
  "skills.sh"?: SkillsSh;
  "clawhub.ai"?: ClawHub;
  "skillhub.cn"?: SkillHub;
  /** The copy of the skill's SKILL.md at `data/skill-snapshots/<id>.md`, which `sync.ts` keeps current. */
  skillMd?: SkillMd;
  /** Something to know before installing. */
  note?: string;
}

/**
 * Skills of one repo meant to be installed together, such as the steps of a workflow. Its skills
 * are listed inside its entry; those worth installing alone also get an entry of their own.
 */
export interface Bundle {
  /** The GitHub repo, `owner/name`, or `owner/name@part` for one of several bundles in a repo. */
  id: string;
  name: string;
  /** One sentence, shown until it has a TLDR. */
  description: string;
  /** What the bundle is and how its skills work together, written from the repo at its permalink's commit. */
  tldr?: Tldr;
  /** Its skills, in the order they're used. */
  skills: BundleSkill[];
  install: { label: string; command: string }[];
  /** Words added plus words removed across its skills' SKILL.md since the commit the TLDR summarizes, or all their words when there's no TLDR. */
  skew: number;
}

export interface BundleSkill {
  id: string;
  /**
   * Whether it's worth installing alone, with no other skill of the bundle: then it also gets an
   * entry of its own in the skills list. A skill that loads another one of the bundle, or only
   * works on another's output, isn't.
   */
  standalone: boolean;
  /** For a skill that isn't standalone: what it needs from the rest of the bundle. */
  note?: string;
}

/** The repo a bundle is in. */
export const bundleRepo = (bundle: Bundle) => bundle.id.split("@")[0];

export interface Tldr {
  /** Short labelled facts to place the skill quickly, most telling first, such as "Use it when". */
  glance: { label: string; text: string }[];
  /** Prose that explains what the skill does. */
  text: string;
  /**
   * GitHub permalink to what the TLDR summarizes: the skill's directory at a commit, or for a
   * skill that isn't on GitHub, its copy in this repo at a commit. For a bundle, its repo at a
   * commit.
   */
  permalink: string;
}

/** The most a TLDR may hold; there's no minimum. */
export const TLDR_LIMITS = { glanceItems: 8, labelWords: 4, glanceWords: 30, textWords: 200 };

/** What's wrong with a TLDR's glance and text, if anything. */
export function tldrProblems({ glance, text }: Pick<Tldr, "glance" | "text">): string[] {
  const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
  const { glanceItems, labelWords, glanceWords, textWords } = TLDR_LIMITS;
  const problems: string[] = [];
  if (!text?.trim()) problems.push("the TLDR text is empty");
  else if (words(text) > textWords)
    problems.push(`the TLDR text has ${words(text)} words, at most ${textWords}`);
  if (!Array.isArray(glance)) return [...problems, "glance must be a list"];
  if (glance.length > glanceItems)
    problems.push(`glance has ${glance.length} items, at most ${glanceItems}`);
  for (const item of glance) {
    if (!item?.label?.trim() || !item?.text?.trim())
      problems.push("a glance item needs a label and a text");
    else if (words(item.label) > labelWords)
      problems.push(`glance label "${item.label}" has over ${labelWords} words`);
    else if (words(item.text) > glanceWords)
      problems.push(`glance item "${item.label}" has over ${glanceWords} words`);
  }
  return problems;
}

export interface SkillMd {
  /** The version the copy was taken from: the GitHub commit, or the registry's version or digest. */
  version: string;
  /** When the copy last changed (YYYY-MM-DD). */
  updated: string;
  /** When the SKILL.md disappeared from its source (YYYY-MM-DD). The copy keeps its last version. */
  removed?: string;
  /** Words added plus words removed since the SKILL.md the TLDR summarizes, or all its words when there's no TLDR. */
  skew: number;
}

/** The GitHub repo (`owner/name`) a skill lives in, and the directory inside it, or null when it isn't on GitHub. */
export function github(skill: Skill): { repo: string; dir: string } | null {
  const [owner, name, ...dir] = skill.id.split("/");
  return owner.includes(".") ? null : { repo: `${owner}/${name}`, dir: dir.join("/") };
}

/**
 * Whether the skills list and the daily sync leave a skill out: it carries one of the `skip` tags,
 * or it's gone from its source. Its page stays.
 */
export const skipped = (data: Pick<Data, "skip">, skill: Skill) =>
  data.skip.some(({ tag }) => skill.tags.includes(tag)) || Boolean(skill.skillMd?.removed);

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
