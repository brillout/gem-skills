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

## Adding or changing a skill

Edit `skills.json`, then run `pnpm run check`, which rejects any tag outside the vocabulary. Tag values and their meanings are listed under `facets` in `skills.json` and on the site's [Tags](https://brillout.github.io/gemskills/#/tags) page.

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
pnpm run build   # build the site into site/dist
```

Every push to the default branch rebuilds the site and publishes it to the `gh-pages` branch, which GitHub Pages serves.
