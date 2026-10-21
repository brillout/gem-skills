# Gem Skills

The most popular agent skills, ranked by installs and tagged by what they do, need and change.

**Browse them: https://brillout.github.io/gemskills**

## Data

Everything lives in one file, [`skills.json`](skills.json): 280 skills from skills.sh, ClawHub and Tencent SkillHub, the bundles some of them form, their categories, the tag vocabulary and the GitHub repos behind them.

A skill's `id` is where its SKILL.md lives: the GitHub repo and the directory inside it, such as `vercel-labs/skills/skills/find-skills`. A skill that isn't on GitHub starts with a domain instead, such as `clawhub.ai/steipete/weather`. What each registry reports about a skill sits under that registry's domain: `skills.sh`, `clawhub.ai` and `skillhub.cn`.

| Numbers                                      | Collected  |
| -------------------------------------------- | ---------- |
| skills.sh installs and weekly installs       | 2026-09-21 |
| GitHub stars, ClawHub and SkillHub downloads | 2026-09-21 |
| Tags                                         | 2026-10-19 |

Star, ClawHub and SkillHub numbers: data from [Best Skills](https://github.com/LinklyAI/best-skills) by [@BlueeonY](https://x.com/BlueeonY) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## SKILL.md copies

[`skill-md/`](skill-md) holds a copy of every skill's SKILL.md, at `skill-md/<id>.md`. The files aren't named `SKILL.md`, so that `npx skills` doesn't take this repo for a skill bundle.

Once a day, the [Sync SKILL.md copies](.github/workflows/sync.yml) workflow runs `pnpm run sync`. That fetches each SKILL.md from its source: the skill's GitHub repo, ClawHub, Tencent SkillHub, or the website that publishes it. When the text changed, the workflow updates the copy and the skill's `skillMd` in `skills.json`, commits to the default branch and redeploys the site. `skillMd` records:

- `version`: the commit, or the registry's version, the copy was taken from.
- `updated`: when the copy last changed.
- `removed`: when the SKILL.md disappeared from its source. The copy keeps its last version.
- `skew`: how far the SKILL.md has moved from the one the skill's TLDR summarizes, in words added plus words removed. With no TLDR, it's the SKILL.md's whole word count.

`skip` in `skills.json` lists the tags whose skills the sync leaves out, each with a note saying why: `flag:deprecated` (retired), `flag:tool-docs` (docs for agents of one product) and `lang:zh` (not in English). Skills gone from their source are skipped too. Skipped skills keep the copy they have. The site's skills list leaves them out as well, unless you tick Show all or filter on one of those tags; their pages stay.

## TLDRs

A skill's `tldr` explains it to a human browsing the site, in two parts written from its SKILL.md:

- **`glance`**: short labelled facts that place the skill at a glance. The skills list shows the first two, the skill's page shows them all, so put the most telling first. Suggested labels, none required, and invent your own when none fits: **Use it when**, **It does**, **You get**, **Unlike**, **Part of**, **Also called**, **Needs**, **Keeps**, **Runs**, **Works with**. Skip **Part of** for a skill in one of the `bundles`: its page and its entry already say so.
- **`text`**: prose that explains what the skill does, for a full picture of it. No fixed structure.

There are no minimums, only limits, which `pnpm run check` enforces: at most 8 glance items, 4 words per label, 30 words per glance item and 200 words of text.

How to write them:

1. Write from the SKILL.md's body. Its frontmatter `description` is a trigger for agents, not a summary for people.
2. Use plain words. Explain any term the skill coins, such as "fragments", "beats" or "grounding", and don't just restate the skill's name.
3. Say what you end up with: a file, a plan, a draft, a reply style.
4. Say where it fits in its workflow, and how it differs from a close neighbour.
5. Mention practical facts that change the decision: it only runs when called, it stays on until stopped, it needs a CLI.
6. Check it cold: someone who has never heard of the skill should understand it from the TLDR alone.

For example, writing-fragments' frontmatter says "Writing, explore: mine raw fragments, no structure yet." Its TLDR says:

- **Use it when:** you want to write an essay or article but don't know its shape yet
- **It does:** interviews you and saves every usable line, anecdote and idea to one Markdown file
- **You get:** a file of raw notes, with no outline
- **Runs:** only when you call it

> This is the exploring half of Matt Pocock's writing workflow. You say what you'd like to write about, and the agent keeps asking: what you noticed, what happened, what you meant by a phrase you used. Anything that might survive into the final piece goes into one Markdown file […]

A TLDR records a permalink to what it summarizes: the skill's directory on GitHub at a commit. For a skill that isn't on GitHub, the permalink points to its copy in this repo at a commit. Until a skill has a TLDR, the site shows its one-line `description` instead. To write or refresh the TLDRs that drifted most:

```bash
pnpm run tldr 20                          # the 20 skills and bundles with the largest skew,
                                          # skipped skills left out
pnpm run tldr <id> '{"glance": [{"label": "Use it when", "text": "…"}], "text": "…"}'
                                          # set a skill's or a bundle's TLDR (or pipe the JSON in)
```

Setting a TLDR records the permalink and resets the skill's `skew` to 0. Run it on an up-to-date checkout of the default branch, and commit the result. For a skill that isn't on GitHub, the copy must be committed first, because its permalink points to the commit that last changed it.

## Bundles

Some repos ship skills meant to be installed and used together, such as the steps of a workflow. `bundles` in `skills.json` records them, and the site gives each bundle one entry, with its skills inside in the order they're used, and a page at `/bundle/<id>/`. A bundle's `id` is its GitHub repo, or the repo and a name, such as `mattpocock/skills@writing`, when a repo holds several bundles or more than one bundle's worth of skills. Each skill is in one bundle at most. A collection of unrelated skills, such as `anthropics/skills`, isn't a bundle.

Each of a bundle's `skills` says whether it's `standalone`: would someone install it alone and get something out of it, with no other skill of the bundle? A skill that loads another one of the bundle, uses its files, or only works on another's output isn't, and needs a `note` saying what it needs. A soft mention of another skill, such as suggesting it for a next step, doesn't count. Standalone skills also keep an entry of their own in the skills list, with a link to their bundle; the others are only listed inside it.

A bundle also has a `description` (one sentence, shown until it has a TLDR), its `install` commands, each with a `label` saying where it works, and a `tldr` written the same way as a skill's. Its TLDR says how the skills work together, and its permalink points to the repo at the commit it summarizes; `pnpm run tldr <bundle id>` checks that the bundle's copies in `skill-md/` match that commit, so run `pnpm run sync <repo>` first if they don't. Its `skew` adds up how far its skills' SKILL.md files have moved since that commit, and the daily sync recomputes it whenever one of them changes.

The site shows a bundle's numbers as those of its skills: the installs of its most installed skill, the repo's stars, and when its first skill was first seen.

## Adding or changing a skill

Edit `skills.json`, run `pnpm run sync <id>` to save the skill's SKILL.md, then run `pnpm run check`, which rejects any tag outside the vocabulary. Tag values and their meanings are listed under `facets` in `skills.json` and on the site's [Tags](https://brillout.github.io/gemskills/tags/) page.

1. Read the skill's SKILL.md itself, not only its one-line description.
2. Give it one `type:` and one `effect:`, judged by the skill's own steps.
3. List every `needs:` value that applies. Use `needs:none` only when nothing does.
4. Add a `stack:` tag for each technology or service the skill is about.
5. Add one to five topics, preferring existing ones.
6. Add a `flag:` only with evidence, such as a matching original or a retirement notice. Add `flag:tool-docs` when the skill is documentation for agents of one product: how to build with it, configure it, deploy to it or operate it, such as a framework's best practices or a cloud's CLI. A skill that gets a job done through a tool, such as browsing, testing, scraping, searching or generating media, doesn't carry it: there, the tool is how, not what.

## Development

```bash
pnpm install
pnpm run dev     # site at http://localhost:3000
pnpm run check   # validate skills.json and type-check
pnpm run build   # pre-render the site into site/dist/client
pnpm run sync    # update the SKILL.md copies (or pass id prefixes to sync only those)
```

The site is built with [Vike](https://vike.dev). Every page is pre-rendered HTML, one per skill at `/skill/<id>/`; the skills list and skill pages add a small script. Every push to the default branch rebuilds the site and publishes it to the `gh-pages` branch, which GitHub Pages serves.
