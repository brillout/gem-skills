# Gem Skills

The most popular agent skills, ranked by installs and tagged by what they do, need and change.

**Browse them: https://brillout.github.io/gemskills**

## Data

Everything lives in one file, [`skills.json`](skills.json): 280 skills from skills.sh, ClawHub and Tencent SkillHub, their categories, the tag vocabulary and the GitHub repos behind them.

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

Retired skills are skipped: those tagged `flag:deprecated` and those gone from their source. They keep the copy they have. The site's skills list leaves them out too, unless you tick Show retired or filter on `flag:deprecated`; their pages stay.

## TLDRs

A skill's `tldr` is a summary written from its SKILL.md, with a permalink to what it summarizes: the skill's directory on GitHub at a commit. For a skill that isn't on GitHub, the permalink points to its copy in this repo at a commit. To refresh the TLDRs that drifted most:

```bash
pnpm run tldr 20                          # the 20 skills with the largest skew, retired ones left out
pnpm run tldr <id> "<summary>"            # set a skill's TLDR (or pipe the summary in)
```

Setting a TLDR records the permalink and resets the skill's `skew` to 0. Run it on an up-to-date checkout of the default branch, and commit the result. For a skill that isn't on GitHub, the copy must be committed first, because its permalink points to the commit that last changed it.

## Adding or changing a skill

Edit `skills.json`, run `pnpm run sync <id>` to save the skill's SKILL.md, then run `pnpm run check`, which rejects any tag outside the vocabulary. Tag values and their meanings are listed under `facets` in `skills.json` and on the site's [Tags](https://brillout.github.io/gemskills/tags/) page.

1. Read the skill's SKILL.md itself, not only its one-line description.
2. Give it one `type:` and one `effect:`, judged by the skill's own steps.
3. List every `needs:` value that applies. Use `needs:none` only when nothing does.
4. Add a `stack:` tag for each technology or service the skill is about.
5. Add one to five topics, preferring existing ones.
6. Add a `flag:` only with evidence, such as a matching original or a retirement notice.

## Development

```bash
pnpm install
pnpm run dev     # site at http://localhost:3000
pnpm run check   # validate skills.json and type-check
pnpm run build   # pre-render the site into site/dist/client
pnpm run sync    # update the SKILL.md copies (or pass id prefixes to sync only those)
```

The site is built with [Vike](https://vike.dev). Every page is pre-rendered HTML, one per skill at `/skill/<id>/`; the skills list and skill pages add a small script. Every push to the default branch rebuilds the site and publishes it to the `gh-pages` branch, which GitHub Pages serves.
