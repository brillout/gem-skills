---
name: write-tldr
description: Write or refresh the TLDRs of skills and bundles in Gem Skills' skills.json, the summaries the site shows people browsing skills. Use when asked to write, update or review TLDRs, or to catch up on the skills whose SKILL.md has drifted most from its TLDR.
---

# Write TLDRs

A TLDR explains a skill, or a bundle of skills, to a person browsing the site, so they can tell at a glance what it is and whether they want it. It's written from the skill's SKILL.md and records a permalink to the version it summarizes. Until a skill has one, the site shows its one-line `description` instead.

## 1. Pick what to write

Start from an up-to-date checkout of `main`. Then list the skills and bundles whose TLDR is missing or behind:

```bash
pnpm run tldr 20    # the 20 with the largest skew: skew, id, the copies to read
```

The skew is how many words the SKILL.md gained or lost since its TLDR was written, or its whole word count when there's no TLDR yet. Skipped skills (see `skip` in `skills.json`) are left out.

## 2. Read

- **A skill:** its copy, `skill-snapshots/<id>.md`. Write from the body. The frontmatter `description` is a trigger for agents, not a summary for people. When the body sends the agent to other files of the skill for the substance, read them on GitHub at the commit in the skill's `skillMd.version`.
- **A bundle:** the copies of all its skills, in the order its entry in `bundles` lists them, and the repo's README for how they fit together.
- **Its neighbours:** the other skills of its repo, and skills with the same topic tags, so you can say how it differs.

For a refresh, read what changed since the TLDR's permalink, and keep what still holds.

## 3. Write

A TLDR has two parts:

- **`glance`**: short labelled facts that place the skill at a glance. The skills list shows the first two, the skill's page shows them all, so put the most telling first. Suggested labels, none required, and invent your own when none fits: **Use it when**, **It does**, **You get**, **Unlike**, **Part of**, **Also called**, **Needs**, **Keeps**, **Runs**, **Works with**. Skip **Part of** for a skill in one of the `bundles`: its page and its entry already say so.
- **`text`**: prose that explains what the skill does, for a full picture of it. No fixed structure. A bundle's text says how its skills work together.

There are no minimums, only limits, which `pnpm run tldr` and `pnpm run check` enforce: at most 8 glance items, 4 words per label, 30 words per glance item and 200 words of text. Never pad to fill them.

How to write them:

1. Use plain words. Explain any term the skill coins, such as "fragments", "beats" or "grounding", and don't just restate the skill's name.
2. Say what you end up with: a file, a plan, a draft, a reply style.
3. Say where it fits in its workflow, and how it differs from a close neighbour. One "unlike X" can do a lot.
4. Mention practical facts that change the decision: it only runs when called (`disable-model-invocation` in its frontmatter), it stays on until stopped, it needs a CLI, it writes a file.
5. Only state what the SKILL.md says or shows. Don't guess at behavior.

For example, writing-fragments' frontmatter says "Writing, explore: mine raw fragments, no structure yet." Its TLDR says:

- **Use it when:** you want to write an essay or article but don't know its shape yet
- **It does:** interviews you and saves every usable line, anecdote and idea to one Markdown file
- **You get:** a file of raw notes, with no outline
- **Runs:** only when you call it

> This is the exploring half of Matt Pocock's writing workflow. You say what you'd like to write about, and the agent keeps asking: what you noticed, what happened, what you meant by a phrase you used. Anything that might survive into the final piece goes into one Markdown file […]

## 4. Test it on a cold reader

Someone who has never heard of the skill should understand it from the TLDR alone. If you can start a subagent, give it only the glance and the text, with no other context, and ask what the skill does, what you end up with, and when you'd use it. Compare its answer with the SKILL.md, and rewrite whatever it got wrong or vague. Without subagents, reread the TLDR as that stranger would.

## 5. Save

```bash
pnpm run tldr <id> <<'EOF'
{"glance": [{"label": "Use it when", "text": "…"}], "text": "…"}
EOF
```

This checks the limits, records the permalink and resets the skew to 0. The permalink points to:

- **A skill on GitHub:** its directory at the commit its copy was taken from.
- **A skill that isn't on GitHub:** its copy in this repo, at the commit that last changed it. Commit the copy before setting the TLDR.
- **A bundle:** its repo at the current commit. Setting it fails when a skill's copy doesn't match that commit; then run `pnpm run sync <repo>`, reread what changed, and try again.

Then run `pnpm run check`, and commit and push to `main`. To see the result, `pnpm run dev` serves the site at http://localhost:3000, with each skill at `/skill/<id>/` and each bundle at `/bundle/<id>/`.
