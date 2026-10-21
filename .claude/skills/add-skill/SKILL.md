---
name: add-skill
description: Add a skill to Gem Skills' skills.json, or retag one, including whether it belongs to a bundle. Use when asked to add, tag, retag or review skills, or to record a bundle of skills.
---

# Add or retag a skill

1. Add its entry to `skills` in `data/skills.json`. Its `id` is where its SKILL.md lives, as `Skill` in `website/types.ts` describes; a GitHub repo it comes from needs an entry in `repos`.
2. Run `pnpm run sync <id>` to save a copy of its SKILL.md in `data/skill-snapshots/`.
3. Read that copy, not only the skill's one-line description, and tag it. Tag values and their meanings are under `facets` in `data/skills.json`.
   1. Give it one `type:` and one `effect:`, judged by the skill's own steps.
   2. List every `needs:` value that applies. Use `needs:none` only when nothing does.
   3. Add a `stack:` tag for each technology or service the skill is about.
   4. Add one to five topics, preferring existing ones.
   5. Add a `flag:` only with evidence, such as a matching original or a retirement notice. Add `flag:tool-docs` when the skill is documentation for agents of one product: how to build with it, configure it, deploy to it or operate it, such as a framework's best practices or a cloud's CLI. A skill that gets a job done through a tool, such as browsing, testing, scraping, searching or generating media, doesn't carry it: there, the tool is how, not what.
4. Check whether it belongs to a bundle (below).
5. Run `pnpm run check`, which rejects tags outside the vocabulary, then commit and push to `main`.
6. Write its TLDR with the write-tldr skill.

A skill tagged with one of the `skip` tags is left out of the skills list and of the daily sync; its page stays.

## Bundles

A bundle is skills of one repo meant to be installed and used together, such as the steps of a workflow. A collection of unrelated skills, such as `anthropics/skills`, isn't one. Record a bundle in `bundles` in `data/skills.json`, as `Bundle` in `website/types.ts` describes:

- Its `id` is the repo, or `<repo>@<name>` when the repo holds more than one bundle, or skills outside the bundle.
- Its `skills` come in the order they're used. A skill is in one bundle at most.
- Mark a skill `standalone` when someone would install it alone and get something out of it, with no other skill of the bundle. One that loads another skill of the bundle, uses its files, or only works on another's output isn't, and gets a `note` saying what it needs. A soft mention, such as suggesting another skill for the next step, doesn't count.
- Give it a one-sentence `description`, its `install` commands from the repo's README, each with a `label` saying where it works, and a TLDR, with the write-tldr skill.

Standalone skills keep an entry of their own in the skills list; the others are only listed inside their bundle.
