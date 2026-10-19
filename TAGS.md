# Skill tags

Suggested tags for every skill named in the [README](README.md) tables: 280 skills, including the bundle siblings named inside those rows. The full assignment is in [`data/skill-tags.csv`](data/skill-tags.csv), one row per skill with a ready-to-use `tags` column.

The README's categories put each skill in exactly one place. Tags cut across them. They say how a skill works, what it needs, what it can change, who publishes it and what it is about.

Tags were assigned from each skill's SKILL.md as shown on skills.sh or ClawHub on 2026-10-19. Eleven ClawHub and Tencent SkillHub skills were tagged from their registry description, because their SKILL.md could not be read: `skillscan`, `evolver`, `proactive-agent`, `multi-search-engine`, `weather`, `summarize`, `tencent-docs`, `smart-charts`, `anti-fraud`, `dev-expert`, `parenting-expert`.

## How tags are written

Every tag is lowercase kebab-case. Faceted tags carry a prefix, such as `type:tool` or `needs:cli`. Topic tags have no prefix, such as `debugging`.

```text
grill-me            type:workflow effect:none by:community needs:none interview planning requirements audit:pass
agent-browser       type:tool effect:remote by:official needs:cli needs:browser stack:agent-browser browser-automation agent-workflows audit:warn
design-mobile-apps  type:tool effect:remote by:community needs:account stack:sleek design mobile flag:republished audit:fail
```

| Facet | Per skill | Question it answers |
| --- | --- | --- |
| `type:` | exactly 1 | How does the skill work? |
| `effect:` | exactly 1 | What can it change on its own? |
| `needs:` | 1 or more | What do you need besides the agent? |
| `by:` | exactly 1 | Who publishes it? |
| `stack:` | 0 or more | Which technologies or services is it about? |
| topics | 1 to 5 | What is it about? |
| `flag:` | 0 or more | Is there something to check before installing? |
| `lang:` | 0 or 1 | Is the SKILL.md written in a language other than English? |
| `audit:` | exactly 1 | What did skills.sh's security scanners report? |

## Type

| Tag | Skills | Meaning | Examples |
| --- | --- | --- | --- |
| `type:workflow` | 94 | A multi-step process the agent follows: interview, debug, run a TDD loop, review. | `grill-me`, `web-design-guidelines`, `azure-diagnostics` |
| `type:guidelines` | 56 | Knowledge and rules the agent applies while it works: best practices, design principles, API references. | `frontend-design`, `vercel-react-best-practices`, `codebase-design` |
| `type:tool` | 89 | Operates a CLI, API, app or bundled script to get something done. | `find-skills`, `agent-browser`, `lark-doc` |
| `type:command` | 15 | A one-shot action you invoke by name, such as turning the conversation into a PRD. | `handoff`, `caveman-commit`, `to-spec` |
| `type:mode` | 5 | Changes how the agent talks or behaves for the rest of the session. | `caveman`, `full-output-enforcement`, `ponytail` |
| `type:router` | 11 | An entry point that picks and loads other skills. Retired skills that only redirect count as routers. | `hyperframes`, `ask-matt`, `remotion-best-practices` |
| `type:setup` | 10 | One-time configuration or scaffolding of a project, account or tool. | `setup-matt-pocock-skills`, `azure-prepare`, `env-and-assets-bootstrap` |

## Effect

Judge `effect:` by the skill's own steps, and pick the strongest one that applies in normal use.

| Tag | Skills | Meaning | Examples |
| --- | --- | --- | --- |
| `effect:none` | 124 | Adds no side effects of its own. It shapes how the agent thinks, writes or reviews. Guidelines and routers are always `effect:none`, even when the task they support edits code. | `grill-me`, `frontend-design`, `vercel-react-best-practices` |
| `effect:local` | 109 | Its own steps create or change files, git state or local tools. | `find-skills`, `grill-with-docs`, `hyperframes-cli` |
| `effect:remote` | 47 | Its own steps change something outside your machine: post, send, deploy, provision, file issues, drive a website, or upload data to a service. | `agent-browser`, `triage`, `lark-doc` |

## Needs

| Tag | Skills | Meaning | Examples |
| --- | --- | --- | --- |
| `needs:none` | 151 | Instructions only. Works in any agent that supports skills. | `grill-me`, `frontend-design`, `vercel-react-best-practices` |
| `needs:cli` | 85 | A specific command-line tool or desktop app must be installed, such as gh, agent-browser, LibreOffice, Obsidian or a vendor CLI. | `find-skills`, `agent-browser`, `lark-doc` |
| `needs:account` | 66 | An account, API key or paid plan with an outside service. | `lark-doc`, `microsoft-foundry`, `media-use` |
| `needs:browser` | 14 | Drives a real Chromium or Chrome browser. | `agent-browser`, `playwright-cli`, `webapp-testing` |
| `needs:subagents` | 11 | Relies on the agent being able to spawn subagents. | `code-review`, `cavecrew`, `requesting-code-review` |
| `needs:issue-tracker` | 10 | Reads or writes an issue tracker, GitHub Issues by default. | `triage`, `gh-issue-sync`, `wayfinder` |
| `needs:mcp` | 6 | Needs an MCP server connected. | `azure-ai`, `wind-mcp-skill`, `design-md` |
| `needs:claude-code` | 3 | Uses Claude Code features such as hooks or background agents. | `git-guardrails-claude-code`, `caveman-stats`, `claude-handoff` |
| `needs:claude-ai` | 1 | Built for claude.ai artifacts. | `web-artifacts-builder` |
| `needs:openclaw` | 4 | Built for the OpenClaw agent. | `agent-browser-clawdbot`, `openclaw-tavily-search`, `self-improving-agent` |

## Publisher

| Tag | Skills | Meaning | Examples |
| --- | --- | --- | --- |
| `by:official` | 132 | A verified publisher on its registry (skills.sh, ClawHub or Tencent SkillHub), or the company or maintainer behind the product the skill operates. | `find-skills`, `frontend-design`, `agent-browser` |
| `by:community` | 148 | Everyone else. Unverified vendor claims default to community. | `grill-me`, `caveman`, `design-taste-frontend` |

## Flags

| Tag | Skills | Meaning | Examples |
| --- | --- | --- | --- |
| `flag:republished` | 12 | A copy of another publisher's skill under a different org. Each copy found had hundreds of thousands of installs while its original had fewer than twenty, so treat its ranking with caution. | `video-edit`, `reddit-automation`, `design-mobile-apps` |
| `flag:mirror` | 9 | The same publisher ships the skill under two sources, which splits its counts. | `lark-doc`, `lark-base`, `lark-drive` |
| `flag:deprecated` | 4 | The SKILL.md now says the skill is retired and points to a replacement. | `lark-minutes`, `redesign-existing-projects`, `prisma-database-setup` |
| `flag:dual-use` | 9 | Legitimate uses exist, but the same capability can evade bot detection or investigate other people. Read the SKILL.md before installing. | `anti-detect-browser`, `browser-fingerprint-audit`, `investigate-without-getting-made` |

The republished copies in the README, compared with their originals on skills.sh. The copy's install count is shown on both snapshot dates:

| Copy | 2026-09-21 | 2026-10-19 | Original | Original installs |
| --- | --- | --- | --- | --- |
| designed-by-ai/skills `design-mobile-apps` | 334K | 909.2K | sleekdotdesign/agent-skills `sleek-design-mobile-apps` | 13 |
| flowkit-labs/skills `reddit-automation` | 562K | 1.0M | doany-skills/skills `reddit-automation` | 12 |
| 101-skills/superpowers `ai-video-generation` | 301K | 810.0K | inference-sh/skills `ai-video-generation` | 14 |
| genmedia-labs/skills `video-edit` | 594K | 13 | agentspace-so/runcomfy-skills `video-edit` | 5 |

The same RunComfy skills are also published as prime-skills/runcomfy-agent-skills, where `video-edit` had 436.6K installs on 2026-10-19. The inference.sh copies exist under six org names, all called `superpowers`.

Deprecated skills and what their SKILL.md now points to:

| Skill | Repo | Replacement |
| --- | --- | --- |
| `redesign-existing-projects` | leonxlnx/taste-skill | `design-taste-frontend` |
| `prisma-database-setup` | prisma/skills | `prisma-orm-setup` |
| `prisma-postgres` | prisma/skills | `prisma-postgres-setup` |
| `lark-minutes` | open.feishu.cn | `lark-meeting` |

Dual-use skills: `anti-detect-browser`, `browser-fingerprint-audit`, `investigate-without-getting-made`, `what-leaked-about-you`, `find-the-original-image`, `multi-account-isolation`, `playwright-stealth-verify`, `fingerprint-ci-gate`, `fingerprint-failure-triage`.

## Audit

Copied from the security audits on each skill's skills.sh page on 2026-10-19. Results change with every version, so re-check the page before installing.

| Tag | Skills | Meaning | Examples |
| --- | --- | --- | --- |
| `audit:pass` | 150 | All three skills.sh scanners (Gen Agent Trust Hub, Socket, Snyk) passed. | `grill-me`, `frontend-design`, `vercel-react-best-practices` |
| `audit:warn` | 88 | At least one scanner warned and none failed. | `find-skills`, `improve-codebase-architecture`, `agent-browser` |
| `audit:fail` | 8 | At least one scanner failed. | `higgsfield-product-photoshoot`, `sentry-cli`, `wonda-cli` |
| `audit:none` | 34 | Not scanned on skills.sh: ClawHub, Tencent SkillHub and domain-hosted skills. | `lark-doc`, `skill-vetter`, `anti-prose-slop` |

Skills with at least one failed scan: `nia` (nozomio-labs/nia-skill), `design-mobile-apps` (designed-by-ai/skills), `sentry-cli` (sentry/dev), `image-to-video` (genmedia-labs/skills), `wonda-cli` (degausai/wonda), `higgsfield-product-photoshoot` (higgsfield-ai/skills), `landing-page-conversion-audit` (autonnel/autonnel-skills), `higgsfield-marketplace-cards` (higgsfield-ai/skills).

## Topics

Use 1 to 5 per skill. The counts show how many of the tagged skills carry each topic.

| Group | Topics |
| --- | --- |
| Engineering process | `planning` 10, `requirements` 7, `interview` 7, `architecture` 7, `domain-modeling` 3, `prototyping` 3, `implementation` 5, `tdd` 2, `testing` 14, `debugging` 9, `code-review` 10, `refactoring` 3, `migration` 4, `git` 8, `issue-tracking` 12, `handoff` 2, `verification` 4, `scope-control` 3, `ci` 7, `build-tools` 2, `code-quality` 5, `learning` 4, `agent-workflows` 16 |
| Agents and skills | `skill-discovery` 3, `skill-authoring` 7, `skill-security` 2, `token-saving` 7, `output-style` 7, `anti-slop` 7, `multi-agent` 11, `memory` 4, `self-improvement` 5, `agent-development` 11, `guardrails` 1 |
| Design and frontend | `design` 21, `animation` 15, `accessibility` 4, `performance` 9, `design-system` 8, `mobile` 3, `generative-art` 2, `terminal-ui` 1 |
| Backend and data | `databases` 11, `auth` 4, `payments` 2, `backend` 7, `web3` 1 |
| Operations and security | `deployment` 8, `infrastructure` 5, `observability` 4, `security` 7, `osint` 4, `privacy` 3, `fingerprinting` 6 |
| Web | `browser-automation` 9, `scraping` 6, `web-search` 5, `computer-use` 1 |
| Media | `video` 17, `image` 12, `audio` 4, `ai-generation` 14 |
| Documents and productivity | `documents` 8, `spreadsheets` 5, `slides` 3, `pdf` 2, `notes` 8, `email` 3, `messaging` 1, `calendar` 3 |
| Writing and research | `writing` 14, `documentation` 10, `research` 9, `diagrams` 2, `charts` 1, `ml-research` 5, `finance` 1 |
| Marketing and business | `marketing` 9, `seo` 4, `copywriting` 1, `social-media` 3, `conversion` 2, `ecommerce` 4 |
| Everyday | `personal` 3 |

## Stack

Add `stack:` for each framework, platform or service a skill is about. For a skill that wraps a vendor's CLI or API, the vendor is the stack, so `stack:runcomfy` groups every RunComfy skill whoever published it.

`stack:react` 12, `stack:lark` 9, `stack:python` 9, `stack:azure` 8, `stack:google-adk` 7, `stack:obsidian` 6, `stack:playwright` 6, `stack:typescript` 6, `stack:git` 5, `stack:hyperframes` 5, `stack:inference-sh` 5, `stack:nextjs` 5, `stack:postgres` 5, `stack:remotion` 5, `stack:runcomfy` 5, `stack:cloudflare` 4, `stack:higgsfield` 4, `stack:liarjs` 4, `stack:prisma` 4, `stack:google-cloud` 3, `stack:microsoft-office` 3, `stack:orca` 3, `stack:stripe` 3, `stack:tailwind` 3, `stack:vercel` 3, `stack:agent-browser` 2, `stack:antibrow` 2, `stack:browser-act` 2, `stack:expo` 2, `stack:github` 2, `stack:google-workspace` 2, `stack:neon` 2, `stack:react-native` 2, `stack:shadcn` 2, `stack:supabase` 2, `stack:admapix` 1, `stack:agentix` 1, `stack:ai-sdk` 1, `stack:amazon` 1, `stack:better-auth` 1, `stack:browser-use` 1, `stack:claude` 1, `stack:convex` 1, `stack:defuddle` 1, `stack:dependency-cruiser` 1, `stack:fastify` 1, `stack:firebase` 1, `stack:firecrawl` 1, `stack:gemini` 1, `stack:genkit` 1, `stack:gsap` 1, `stack:husky` 1, `stack:mcp` 1, `stack:momentic` 1, `stack:nia` 1, `stack:node` 1, `stack:notion` 1, `stack:opentui` 1, `stack:p5js` 1, `stack:proseify` 1, `stack:reddit` 1, `stack:scrapegraph` 1, `stack:sentry` 1, `stack:slack` 1, `stack:sleek` 1, `stack:solana` 1, `stack:squirrelscan` 1, `stack:stitch` 1, `stack:tavily` 1, `stack:tencent-docs` 1, `stack:turborepo` 1, `stack:typesafe` 1, `stack:wind` 1, `stack:wonda` 1, `stack:x-twitter` 1.

## Matching skills.sh topics

skills.sh groups a few skills under eight hand-picked topics. Each one maps to a single tag here, so the two can be cross-referenced.

| skills.sh topic | Tag here |
| --- | --- |
| react | `stack:react` |
| nextjs | `stack:nextjs` |
| design | `design` |
| mobile | `mobile` |
| agent-workflows | `agent-workflows` |
| databases | `databases` |
| testing | `testing` |
| marketing | `marketing` |

## Tagging a new skill

1. Read the SKILL.md itself, not only its one-line description.
2. Pick one `type:` and one `effect:`, judged by the skill's own steps.
3. List every `needs:` value that applies. Use `needs:none` only when nothing does.
4. Add a `stack:` tag for each technology or service the skill is about.
5. Add 1 to 5 topics from the table above. Prefer an existing topic, and add a new one only for a distinct subject people would search for.
6. Add a `flag:` only with evidence, such as a matching original or a retirement notice.
7. Record the `audit:` result from skills.sh and the date you checked it.
