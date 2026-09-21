# Gem Skills

The most popular **agent skills**, ranked by real usage data and organized by category.

Snapshot date: **2026-09-21**. Numbers are all-time installs on [skills.sh](https://skills.sh) unless marked otherwise (★ = stars of the GitHub repo behind the skill, ⬇ = downloads on ClawHub or Tencent SkillHub).

- [What is an agent skill?](#what-is-an-agent-skill)
- [How popularity is measured](#how-popularity-is-measured)
- [Top 30 at a glance](#top-30-at-a-glance)
- [Skills by category](#skills-by-category)
  1. [Skill discovery, authoring and management](#1-skill-discovery-authoring-and-management)
  2. [Planning, specs and requirements](#2-planning-specs-and-requirements)
  3. [Engineering workflow and coding discipline](#3-engineering-workflow-and-coding-discipline)
  4. [Debugging, code review and QA](#4-debugging-code-review-and-qa)
  5. [Output style, context and token economy](#5-output-style-context-and-token-economy)
  6. [Writing, documentation and research](#6-writing-documentation-and-research)
  7. [Frontend design and UI taste](#7-frontend-design-and-ui-taste)
  8. [Frameworks, libraries and databases](#8-frameworks-libraries-and-databases)
  9. [Cloud, deployment and DevOps](#9-cloud-deployment-and-devops)
  10. [Browser automation, scraping and web search](#10-browser-automation-scraping-and-web-search)
  11. [Video, image, audio and media generation](#11-video-image-audio-and-media-generation)
  12. [Documents, office suites and knowledge tools](#12-documents-office-suites-and-knowledge-tools)
  13. [Marketing, SEO, sales and social](#13-marketing-seo-sales-and-social)
  14. [Science, data and diagrams](#14-science-data-and-diagrams)
  15. [Agents, orchestration, memory and self-improvement](#15-agents-orchestration-memory-and-self-improvement)
  16. [Security, privacy and OSINT](#16-security-privacy-and-osint)
- [Most-starred skill repositories](#most-starred-skill-repositories)
- [Other ecosystems: ClawHub and Tencent SkillHub](#other-ecosystems-clawhub-and-tencent-skillhub)
- [Data and sources](#data-and-sources)

## What is an agent skill?

An agent skill is a folder with a `SKILL.md` file: YAML frontmatter (`name`, `description`) followed by Markdown instructions, optionally bundled with scripts, templates and reference files. Agents load the short description up front and read the full instructions only when the skill is relevant (progressive disclosure).

Anthropic introduced the format in Claude in October 2025 and published it as an open standard at [agentskills.io](https://agentskills.io) on December 18, 2025. The same skill now works in Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot, Cursor, VS Code, Cline, OpenCode, Windsurf, Zed and 20+ other agents.

Installing a skill is one command:

```bash
npx skills add <github-owner/repo> --skill <skill-name>
```

## How popularity is measured

| Signal | Source | What it tells you |
| --- | --- | --- |
| Installs | [skills.sh](https://skills.sh) all-time leaderboard (Vercel's `npx skills` CLI, deduplicated telemetry, top 600) | How many people actually installed the skill into an agent |
| Stars ★ | GitHub stars of the repository behind the skill (via the [Best Skills](https://github.com/LinklyAI/best-skills) daily snapshot) | Attention and word of mouth, not a quality review |
| Downloads ⬇ | [ClawHub](https://clawhub.ai) (OpenClaw personal-agent ecosystem) and [Tencent SkillHub](https://skillhub.cn) (China) | Popularity outside the coding-agent registries |

Things to keep in mind when reading the numbers:

- **Bundles share counts.** skills.sh counts an install of a repo once per skill in it, so all 28 Lark skills or all 32 Azure skills sit within a few hundred installs of each other. This list collapses each bundle to its lead skill and notes how many siblings it has. The full uncollapsed leaderboard is in [`data/skills-sh-leaderboard-2026-09-21.csv`](data/skills-sh-leaderboard-2026-09-21.csv).
- **Some publishers republish the same skills under several names.** RunComfy's media skills appear as both `genmedia-labs/skills` and `prime-skills/runcomfy-agent-skills`. The inference.sh media and X-automation skills are published under at least six org names (`101-skills`, `qu-skills`, `magentosh`, `skills-shell`, `its-a-skill-issue`, `bankai-skills`), every repo named `superpowers`, with near-identical install counts, and they fill the top of the 24-hour trending chart. They are listed once here, with that caveat.
- **CI installs count too**, so skills wired into pipelines are over-represented relative to skills a human types once.
- Stars measure the whole repository. For projects like shadcn/ui or browser-use, the skill is a small part of a much larger codebase.

## Top 30 at a glance

Bundles collapsed. "Official" means the publisher is verified on skills.sh.

| # | Skill | Repo | Installs | Category | What it does |
| --- | --- | --- | --- | --- | --- |
| 1 | `find-skills` | [vercel-labs/skills](https://github.com/vercel-labs/skills) | 3.50M | Meta | Finds and installs a skill when the user asks "is there a skill for X?". Official. |
| 2 | `grill-me` | [mattpocock/skills](https://github.com/mattpocock/skills) | 1.19M | Planning | A relentless interview that sharpens a plan or design before any code is written. Lead of a 52-skill bundle. |
| 3 | `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) | 907K | Design | Distinctive, intentional visual design instead of generic "AI" UI. Official, 18-skill bundle. |
| 4 | `agent-browser` | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | 896K | Browser | Browser automation CLI for agents: navigate, fill forms, click, screenshot. Official. |
| 5 | `vercel-react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 731K | Frameworks | React and Next.js performance guidelines from Vercel Engineering. Official, 9-skill bundle. |
| 6 | `lark-doc` | [open.feishu.cn](https://open.feishu.cn) | 716K | Documents | Read, create and edit Lark (Feishu) docs. Lead of a 28-skill suite (Base, Drive, IM, Calendar, Sheets, Wiki, Mail, OKR...). Mirrored as `larksuite/cli` (454K). |
| 7 | `hyperframes-cli` | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | 629K | Media | "Write HTML, render video": HeyGen's agent-native video toolkit. 38-skill bundle. |
| 8 | `microsoft-foundry` | [microsoft/azure-skills](https://github.com/microsoft/azure-skills) | 601K | Cloud | Build, deploy and evaluate Microsoft Foundry agents. Lead of a 32-skill Azure suite. Official. |
| 9 | `video-edit` | [genmedia-labs/skills](https://github.com/genmedia-labs/skills) | 594K | Media | Smart router over RunComfy's video, image and music models (8 skills; also published as `prime-skills/runcomfy-agent-skills`, 423K). |
| 10 | `reddit-automation` | [flowkit-labs/skills](https://github.com/flowkit-labs/skills) | 562K | Marketing | Finds Reddit threads asking for what you offer and drafts helpful, affiliation-disclosed replies. |
| 11 | `remotion-best-practices` | [remotion-dev/skills](https://github.com/remotion-dev/skills) | 534K | Media | Router for the Remotion (React video) skills: create, render, captions, docs. Official, 12-skill bundle. |
| 12 | `caveman` | [juliusbrussee/caveman](https://github.com/JuliusBrussee/caveman) | 526K | Style | Ultra-compressed output mode that cuts tokens by roughly two thirds while keeping technical accuracy. 20-skill bundle. |
| 13 | `design-taste-frontend` | [leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 501K | Design | Anti-slop frontend skill for landing pages, portfolios and redesigns. 13-skill bundle. |
| 14 | `paper-context-resolver` | [lllllllama/rigorpilot-skills](https://github.com/lllllllama/rigorpilot-skills) | 451K | Science | README-first reproduction of deep-learning repositories. 11-skill bundle. |
| 15 | `supabase-postgres-best-practices` | [supabase/agent-skills](https://github.com/supabase/agent-skills) | 410K | Frameworks | Postgres best practices maintained by Supabase, for Postgres running anywhere. Official. |
| 16 | `brainstorming` | [obra/superpowers](https://github.com/obra/superpowers) | 370K | Planning | Explore intent before any creative work. Entry point of the 14-skill Superpowers methodology (289K ★). |
| 17 | `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 365K | Design | UI/UX design intelligence for web, mobile and desktop (129K ★). |
| 18 | `design-mobile-apps` | [designed-by-ai/skills](https://github.com/designed-by-ai/skills) | 334K | Design | Designs mobile app screens with the Sleek design system. |
| 19 | `prisma-database-setup` | [prisma/skills](https://github.com/prisma/skills) | 301K | Frameworks | Prisma ORM setup, client API, CLI and Prisma Postgres. 9-skill bundle. |
| 20 | `ai-video-generation` | [101-skills/superpowers](https://github.com/101-skills/superpowers) | 301K | Media | Video, image, avatar and X-automation skills over the inference.sh CLI. Republished under six org names; see caveats. |
| 21 | `google-agents-cli-adk-code` | [google/agents-cli](https://github.com/google/agents-cli) | 290K | Agents | Write, run, evaluate and deploy agents with Google's ADK. 7-skill bundle. |
| 22 | `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 286K | Design | A design language for AI harnesses: polish, critique, audit, animate, harden and 15 more. 21-skill bundle (69K ★). |
| 23 | `emil-design-eng` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | 285K | Design | Emil Kowalski's philosophy of UI polish, component design and animation. 12-skill bundle. |
| 24 | `shadcn` | [shadcn/ui](https://github.com/shadcn/ui) | 272K | Frameworks | Add, search, fix and compose shadcn components and projects. |
| 25 | `just-scrape` | [scrapegraphai/just-scrape](https://github.com/scrapegraphai/just-scrape) | 245K | Browser | Search, scrape, crawl and extract structured data with the ScrapeGraph AI CLI. |
| 26 | `orca-cli` | [stablyai/orca](https://github.com/stablyai/orca) | 244K | Agents | Operate Orca, an environment for running fleets of parallel coding agents. With `orchestration` and `computer-use` (74K ★). |
| 27 | `seo-audit` | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | 211K | Marketing | Technical SEO audit. Lead of a 61-skill marketing suite (51K ★). |
| 28 | `neon-postgres` | [neondatabase/agent-skills](https://github.com/neondatabase/agent-skills) | 178K | Frameworks | Neon Postgres: connections, migrations, branching, autoscaling. |
| 29 | `higgsfield-generate` | [higgsfield-ai/skills](https://github.com/higgsfield-ai/skills) | 175K | Media | Generate images, video, 3D and audio through Higgsfield AI. 8-skill bundle. |
| 30 | `wind-mcp-skill` | [wind-alice/alicemarket](https://github.com/wind-alice/alicemarket) | 169K | Data | Verified financial market data from Wind instead of model memory. |

## Skills by category

### 1. Skill discovery, authoring and management

Skills that help an agent find, write, evaluate and route to other skills.

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `find-skills` | vercel-labs/skills | 3.50M | Discovers and installs skills when the user asks "how do I do X" or "find a skill for X". |
| `setup-matt-pocock-skills` | mattpocock/skills | 868K | One-time repo setup (issue tracker, triage labels, domain docs) for the Matt Pocock bundle. |
| `ask-matt` | mattpocock/skills | 591K | Router that picks the right skill or flow in the bundle for your situation. |
| `skill-creator` | anthropics/skills | 387K | Create, improve and eval-test skills. Official. |
| `writing-great-skills` | mattpocock/skills | 324K | Vocabulary and principles that make a skill predictable. |
| `writing-for-agents` | mattpocock/skills | 294K | Writing documents for agents, including AGENTS.md and CLAUDE.md. |
| `using-superpowers` | obra/superpowers | 249K | Establishes how to find and invoke skills at the start of every conversation. |
| `write-a-skill` | mattpocock/skills | 230K | Scaffold a new skill with progressive disclosure and bundled resources. |
| `writing-skills` | obra/superpowers | 195K | Create, edit and verify skills before deployment. |
| `browser-act-skill-forge` | browser-act/skills | 85K | Forge a reusable skill from a browser exploration so the site never has to be re-explored. |
| `skill-vetter` | ClawHub | 274K ⬇ | Security-first vetting before installing any skill from a registry or GitHub. |
| `skillscan` | ClawHub | 182K ⬇ | A gate every newly installed skill must pass before use. |

Also notable by stars: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) (75K ★, curated index of 1,000+ skills), [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills) (47K ★, agent-first catalog and control plane), [yusufkaraaslan/Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers) (15K ★, turns docs sites and repos into skills), [LinklyAI/best-skills](https://github.com/LinklyAI/best-skills) (daily cross-registry rankings).

### 2. Planning, specs and requirements

The single biggest theme of 2026: make the agent interrogate you and write things down before it writes code.

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `grill-me` | mattpocock/skills | 1.19M | Relentless interview to sharpen a plan or design. |
| `grill-with-docs` | mattpocock/skills | 1.02M | Same interview, but writes ADRs and a glossary as it goes. |
| `handoff` | mattpocock/skills | 842K | Compacts the conversation into a handoff document for another agent. |
| `prototype` | mattpocock/skills | 815K | Builds a throwaway prototype to answer a design question. |
| `grilling` | mattpocock/skills | 744K | Stress-tests a plan, decision or idea. |
| `teach` | mattpocock/skills | 687K | Teaches the user a skill or concept inside the workspace. |
| `domain-modeling` | mattpocock/skills | 672K | Builds and sharpens the project's domain model, CONTEXT.md and ADRs. |
| `codebase-design` | mattpocock/skills | 651K | Shared vocabulary for designing deep modules. |
| `wayfinder` | mattpocock/skills | 543K | Plans work larger than one session as a map of decision tickets. |
| `to-spec` | mattpocock/skills | 538K | Turns the conversation into a spec on the issue tracker. |
| `to-tickets` | mattpocock/skills | 529K | Breaks a plan into tracer-bullet tickets with blocking edges. |
| `brainstorming` | obra/superpowers | 370K | Explores user intent before any creative work. |
| `to-prd` | mattpocock/skills | 368K | Turns the conversation into a PRD. |
| `to-issues` | mattpocock/skills | 355K | Breaks a plan into independently grabbable issues. |
| `to-questionnaire` | mattpocock/skills | 340K | Turns an open decision into a questionnaire for someone else. |
| `loop-me` | mattpocock/skills | 322K | Grills you about the specs of workflows you want to build. |
| `claude-handoff` | mattpocock/skills | 298K | Hands the conversation to a fresh background agent. |
| `writing-plans` | obra/superpowers | 255K | Writes an implementation plan from a spec before touching code. |
| `design-an-interface` | mattpocock/skills | 217K | Generates radically different interface designs for a module with parallel sub-agents. |
| `request-refactor-plan` | mattpocock/skills | 210K | Interviews you into a tiny-commit refactor plan and files it as an issue. |
| `ubiquitous-language` | mattpocock/skills | 205K | Extracts a DDD-style glossary from the conversation. |

Also notable by stars: [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) (27K ★, crash-proof Markdown plans for long-running tasks), [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) (25K ★), [phuryn/pm-skills](https://github.com/phuryn/pm-skills) (26K ★, 100+ product-management skills).

### 3. Engineering workflow and coding discipline

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `improve-codebase-architecture` | mattpocock/skills | 967K | Scans a codebase for deepening opportunities, renders an HTML report, then grills through the one you pick. |
| `tdd` | mattpocock/skills | 939K | Test-first feature and bug work, red-green-refactor. |
| `implement` | mattpocock/skills | 590K | Implements a piece of work from a spec or tickets. |
| `resolving-merge-conflicts` | mattpocock/skills | 517K | Resolves an in-progress merge or rebase conflict. |
| `wizard` | mattpocock/skills | 391K | Generates an interactive bash wizard for steps only a human can do (credentials, infra, CI). |
| `git-guardrails-claude-code` | mattpocock/skills | 382K | Hooks that block dangerous git commands before they run. |
| `setup-pre-commit` | mattpocock/skills | 374K | Husky, lint-staged, type checks and tests as pre-commit hooks. |
| `migrate-to-shoehorn` | mattpocock/skills | 363K | Migrates test files off `as` type assertions. |
| `setup-ts-deep-modules` | mattpocock/skills | 254K | Enforces deep-module boundaries with dependency-cruiser. |
| `test-driven-development` | obra/superpowers | 232K | TDD before writing any implementation code. |
| `executing-plans` | obra/superpowers | 217K | Executes an implementation plan inline in the current session. |
| `verification-before-completion` | obra/superpowers | 217K | Requires running verification commands before claiming work is done. |
| `subagent-driven-development` | obra/superpowers | 210K | Executes plans with independent tasks through subagents. |
| `dispatching-parallel-agents` | obra/superpowers | 196K | Splits independent tasks across parallel agents. |
| `using-git-worktrees` | obra/superpowers | 195K | Isolates feature work in a git worktree. |
| `finishing-a-development-branch` | obra/superpowers | 192K | Decides how to integrate finished work. |
| `implement-spec` | mattpocock/skills | 129K | Implements a specification in code. |
| `typescript-advanced-types` | wshobson/agents | 78K | Generics, conditional, mapped and template-literal types. |
| `turborepo` | vercel/turborepo | 74K | Turborepo pipelines, caching and filters. |
| `ponytail` | dietrichgebert/ponytail | 62K (143K ★) | Forces the laziest solution that actually works; the best code is the code you never wrote. |
| `safe-refactor`, `surgical-patch`, `lean-build`, `migration` | juliusbrussee/caveman | 61-62K each | Scoped, verification-bracketed refactors, patches, builds and migrations. |

Also notable by stars: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (98K ★, production-grade skills for TDD, debugging, code review, security, incremental implementation, API design, performance, ADRs), [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) (66K ★), [wshobson/agents](https://github.com/wshobson/agents) (40K ★, multi-harness plugin marketplace). Two workflow repos are not on skills.sh because they ship as a CLAUDE.md or plugin rather than a SKILL.md: the Karpathy guidelines ([multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills), 174K ★) and [garrytan/gstack](https://github.com/garrytan/gstack) (110K ★), both as reported by AWS in June 2026.

### 4. Debugging, code review and QA

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `triage` | mattpocock/skills | 818K | Moves issues and external PRs through a triage state machine and writes agent-ready briefs. |
| `diagnosing-bugs` | mattpocock/skills | 639K | Diagnosis loop for hard bugs and performance regressions. |
| `code-review` | mattpocock/skills | 590K | Reviews changes since a fixed point on two axes: standards and correctness. |
| `caveman-review` | juliusbrussee/caveman | 366K | Compressed code review, one line per finding. |
| `systematic-debugging` | obra/superpowers | 266K | Structured diagnosis before proposing any fix. |
| `diagnose` | mattpocock/skills | 239K | Reproduce, minimise, hypothesise, instrument, fix, regression-test. |
| `requesting-code-review` | obra/superpowers | 234K | Requests review before merging to verify work meets requirements. |
| `qa` | mattpocock/skills | 206K | Conversational bug reporting that files GitHub issues. |
| `receiving-code-review` | obra/superpowers | 198K | Evaluates review feedback technically before implementing it. |
| `webapp-testing` | anthropics/skills | 161K | Tests local web apps with Playwright. Official. |
| `retro` | mattpocock/skills | 116K | Retrospective on a coding session. |
| `playwright-best-practices` | currents-dev/playwright-best-practices-skill | 85K | Writing Playwright tests, fixing flaky tests, Page Object Model, CI. |
| `review-loop` | 2dmurali/review-loop-skill | 73K | Worker-reviewer cycle with a critic subagent scoring 1-10 until a quality gate passes. |
| `investigate-first` | juliusbrussee/caveman | 62K | Diagnoses ambiguous failures before editing. |
| `momentic-test` | momentic-ai/skills | 53K | Creates and maintains Momentic browser end-to-end tests. |

### 5. Output style, context and token economy

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `caveman` | juliusbrussee/caveman | 526K (107K ★) | Ultra-compressed communication mode with lite, full, ultra and wenyan variants. |
| `caveman-commit` | juliusbrussee/caveman | 370K | Conventional Commits message compressed to intent only. |
| `caveman-compress` | juliusbrussee/caveman | 364K | Compresses CLAUDE.md or todo files into caveman format to save input tokens. |
| `caveman-help` | juliusbrussee/caveman | 357K | Quick-reference card for caveman modes. |
| `full-output-enforcement` | leonxlnx/taste-skill | 323K | Bans placeholder patterns and truncated output. |
| `cavecrew` | juliusbrussee/caveman | 314K | Delegates to investigator, builder and reviewer subagents. |
| `caveman-stats` | juliusbrussee/caveman | 313K | Shows token usage and mode attribution for the session. |
| `wait-what` | mattpocock/skills | 281K | Re-pitches the last message when it did not land. |
| `zoom-out` | mattpocock/skills | 230K | Gives broader context or a higher-level perspective. |
| `caveman` | mattpocock/skills | 224K | Matt Pocock's port of the compressed mode. |
| `humanizer` | ClawHub | 131K ⬇ | Removes signs of AI-generated writing. Forked into a dozen languages ([op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh), 18K ★). |
| `anti-prose-slop` | proseify.xyz | trending | Strips prose slop from agent output. |

Also notable by stars: [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) (49K ★, stops the agent from burying the answer), [mksglu/context-mode](https://github.com/mksglu/context-mode) (24K ★, sandboxes tool output and persists session memory).

### 6. Writing, documentation and research

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `research` | mattpocock/skills | 538K | Investigates a question against high-trust primary sources and saves the findings as Markdown. |
| `writing-beats` | mattpocock/skills | 367K | Assembles raw material into a journey of beats. |
| `scaffold-exercises` | mattpocock/skills | 367K | Scaffolds exercise directories with problems, solutions and explainers. |
| `writing-shape` | mattpocock/skills | 367K | Shapes raw material into an article, paragraph by paragraph. |
| `writing-fragments` | mattpocock/skills | 366K | Mines raw fragments before any structure exists. |
| `edit-article` | mattpocock/skills | 199K | Restructures and tightens an article draft. |
| `doc-coauthoring` | anthropics/skills | 85K | Structured workflow for co-authoring docs, proposals and specs. Official. |
| `internal-comms` | anthropics/skills | 73K | Internal communications in a company's own formats. Official. |
| `writing-guidelines` | vercel-labs/agent-skills | 72K | Reviews docs and prose for voice and tone. Official. |
| `nia` | nozomio-labs/nia-skill | 55K | Indexes and searches repos, docs, papers, datasets, Slack and Drive. |
| `summarize` | Tencent SkillHub | 619K ⬇ | Summarization skill (upstream on ClawHub). |

### 7. Frontend design and UI taste

The second-largest category by installs, driven by the fight against generic-looking AI interfaces.

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `frontend-design` | anthropics/skills | 907K | Aesthetic direction, typography and layout for distinctive UI. Official. |
| `web-design-guidelines` | vercel-labs/agent-skills | 653K | Reviews UI code against Vercel's Web Interface Guidelines and accessibility rules. Official. |
| `design-taste-frontend` | leonxlnx/taste-skill | 501K (89K ★) | Reads the brief, infers a design direction, ships non-generic interfaces. |
| `high-end-visual-design` | leonxlnx/taste-skill | 368K | Fonts, spacing, shadows and animation that feel like a high-end agency. |
| `redesign-existing-projects` | leonxlnx/taste-skill | 365K | Audits and upgrades an existing site to premium quality. |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | 365K (129K ★) | Design intelligence for web, mobile and desktop interfaces. |
| `minimalist-ui` | leonxlnx/taste-skill | 339K | Editorial-style interfaces, warm monochrome, flat bento grids. |
| `design-mobile-apps` | designed-by-ai/skills | 334K | Mobile screens with the Sleek design system. |
| `impeccable` | pbakaus/impeccable | 286K (69K ★) | Design, critique, audit, polish, harden, animate and more. |
| `emil-design-eng` | emilkowalski/skills | 285K (40K ★) | UI polish, component design and animation decisions. |
| `review-animations` | emilkowalski/skills | 169K | Reviews motion code against a high craft bar. |
| `animation-vocabulary` | emilkowalski/skills | 157K | Turns "the bouncy thing when a popover opens" into its exact term. |
| `apple-design` | emilkowalski/skills | 153K | Apple's interface and physical-motion approach, translated for the web. |
| `extract-design-system` | arvindrk/extract-design-system | 129K | Extracts design tokens from any public website. |
| `vercel-react-view-transitions` | vercel-labs/agent-skills | 128K | Native-feeling animations with React's View Transition API. Official. |
| `canvas-design` | anthropics/skills | 110K | Visual art in PNG and PDF from a design philosophy. Official. |
| `web-artifacts-builder` | anthropics/skills | 103K | Multi-component HTML artifacts with React, Tailwind and shadcn/ui. Official. |
| `polish`, `critique`, `audit`, `animate` | pbakaus/impeccable | 84-87K each | Final quality pass, UX critique, scored technical audit, purposeful motion. |
| `theme-factory` | anthropics/skills | 86K | Ten preset themes for slides, docs and landing pages. Official. |
| `design-md` | google-labs-code/stitch-skills | 62K | Synthesizes a semantic design system into DESIGN.md from Stitch projects. |
| `gsap-core` | greensock/gsap-skills | 58K | Official GSAP animation skills (8 skills, 16K ★). |
| `make-interfaces-feel-better` | jakubkrehel/make-interfaces-feel-better | 58K | Design-engineering principles for polished components. |
| `hallmark` | nutlope/hallmark | 55K (29K ★) | Anti-AI-slop design for greenfield pages, audits and redesigns. |
| `accessibility` | addyosmani/web-quality-skills | 55K | WCAG 2.2 audits and fixes. |

### 8. Frameworks, libraries and databases

Vendors increasingly ship an official skill next to their docs. This is where most "official" publishers live.

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `vercel-react-best-practices` | vercel-labs/agent-skills | 731K | React and Next.js performance rules. Official. |
| `supabase-postgres-best-practices` | supabase/agent-skills | 410K | Postgres best practices, load before touching the database. Official. |
| `vercel-composition-patterns` | vercel-labs/agent-skills | 348K | Composition patterns for component libraries. Official. |
| `prisma-database-setup` | prisma/skills | 301K | Prisma with PostgreSQL, MySQL, SQLite, MongoDB. With `prisma-client-api`, `prisma-cli`, `prisma-postgres` (9 skills). |
| `supabase` | supabase/agent-skills | 285K | Any task involving Supabase products. Official. |
| `shadcn` | shadcn/ui | 272K (124K ★) | Manage shadcn components and projects. |
| `vercel-react-native-skills` | vercel-labs/agent-skills | 217K | React Native and Expo performance. Official. |
| `neon-postgres` | neondatabase/agent-skills | 178K | Neon Postgres connections, migrations, branching. With `neon` (131K). |
| `convex-quickstart` | get-convex/agent-skills | 119K | Convex backend from a one-sentence idea. 6-skill bundle. |
| `better-auth-best-practices` | better-auth/skills | 112K | Better Auth server, client, adapters, sessions, plugins. |
| `solana-dev` | solana-foundation/solana-dev-skill | 72K | Solana dapps, Anchor programs, tokens, wallets. |
| `tailwind-design-system` | wshobson/agents | 65K | Tailwind v4 design systems and tokens. |
| `expo-dev-client` | expo/skills | 60K | Expo development clients, native UI, Tailwind setup (3 skills). |
| `developing-genkit-js` | genkit-ai/skills | 58K | AI apps with Genkit in TypeScript. |
| `ai-sdk` | vercel/ai | 57K | Vercel AI SDK: generateText, streamText, tools, agents. |
| `opentui` | msmps/opentui-skill | 56K | Terminal UIs with OpenTUI. |
| `fastify-best-practices` | mcollina/skills | 54K | Fastify servers and REST APIs from the maintainer. |

Rising this week on the skills.sh "hot" chart: Svelte 5 best practices ([ejirocodes/agent-skills](https://github.com/ejirocodes/agent-skills), [sveltejs/ai-tools](https://github.com/sveltejs/ai-tools)), `vitest` and `pnpm` from [antfu/skills](https://github.com/antfu/skills), and the [vercel-labs/json-render](https://github.com/vercel-labs/json-render) generative-UI skills.

### 9. Cloud, deployment and DevOps

Microsoft is the largest vendor on skills.sh by total installs (7.1M across 582 skills), followed by Vercel (3.2M), GitHub (2.0M), Anthropic (1.9M), Firebase (686K), Firecrawl (482K) and NVIDIA (423K).

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `microsoft-foundry` | microsoft/azure-skills | 601K | Build, deploy, evaluate and fine-tune Microsoft Foundry agents. Official. |
| `azure-diagnostics` | microsoft/azure-skills | 592K | Debug production issues with AppLens, Azure Monitor and resource health. |
| `azure-prepare` | microsoft/azure-skills | 592K | Generates azure.yaml, Bicep or Terraform and Dockerfiles for azd. |
| `azure-ai` | microsoft/azure-skills | 592K | Azure AI Search, Speech, OpenAI and Document Intelligence. |
| `azure-deploy` | microsoft/azure-skills | 591K | Executes deployments of already-prepared apps. Plus 27 more Azure skills: storage, Entra, compliance, App Insights, Kusto, compute, Kubernetes, cost, RBAC... |
| `google-agents-cli-deploy` | google/agents-cli | 289K | Deploys ADK agents, sets up CI/CD and secrets. |
| `firebase-basics` | firebase/agent-skills | 156K | Firebase CLI setup and login. With auth, hosting, App Hosting, Data Connect, Firestore (14 skills). |
| `sentry-cli` | sentry/dev | 146K | Issues, events and projects from the Sentry CLI. |
| `deploy-to-vercel` | vercel-labs/agent-skills | 133K | "Deploy my app and give me the link." Official. |
| `vercel-cli-with-tokens` | vercel-labs/agent-skills | 104K | Token-based Vercel CLI for non-interactive environments. Official. |
| `cloudflare` | cloudflare/skills | 95K | Choose Cloudflare products for apps, APIs, agents and storage. With `wrangler` (93K), `workers-best-practices` (86K), `durable-objects` (78K), `web-perf` (78K). |
| `stripe-best-practices` | stripe/ai | 87K | Stripe integration decisions, sandboxes and API selection. With `upgrade-stripe` and `stripe-projects`. |
| `vercel-optimize` | vercel-labs/agent-skills | 77K | Cost and performance optimization of deployed projects. Official. |
| `gh-issue-sync` | mitsuhiko/gh-issue-sync | hot #1 | Sync GitHub issues to local files for offline agent work. |

### 10. Browser automation, scraping and web search

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `agent-browser` | vercel-labs/agent-browser | 896K (43K ★) | Browser automation CLI: navigate, fill, click, screenshot, accessibility snapshots. Official. |
| `just-scrape` | scrapegraphai/just-scrape | 245K | Search, scrape, crawl, extract and monitor pages. |
| `computer-use` | stablyai/orca | 165K | Drives the GUI of a local app window through the accessibility tree. |
| `playwright-cli` | microsoft/playwright-cli | 161K (13K ★) | Automate browsers, record and generate Playwright code. |
| `browser-act` | browser-act/skills | 108K | Browser automation CLI for agents. |
| `firecrawl` | firecrawl/cli | 101K | Any live-web task: search, scrape, crawl, map, agent extraction (9 skills, plus 4 `firecrawl-build-*` SDK skills). |
| `browser-use` | browser-use/browser-use | 95K (116K ★) | Direct browser control over CDP for automation, scraping and testing. |
| `anti-detect-browser` | antibrow/anti-detect-browser-skills | 94K | Playwright with a real-device fingerprint and isolated profiles. |
| `defuddle` | kepano/obsidian-skills | 69K | Clean Markdown from any HTML page. |
| `browser-fingerprint-audit` | liarjsdev/liarjs-skills | 60K | Audits a browser fingerprint for contradictions (4 skills). |
| `web-search` | 101-skills/superpowers | trending | Web search over inference.sh. |
| `agent-browser-clawdbot` | ClawHub | 156K ⬇ | Headless browser automation optimized for OpenClaw. |
| `multi-search-engine` | ClawHub / SkillHub | 162K ⬇ / 583K ⬇ | Search across 16 engines, 7 Chinese and 9 global. |
| `openclaw-tavily-search` | ClawHub | 106K ⬇ | Structured web search through Tavily. |

### 11. Video, image, audio and media generation

The fastest-growing category on the 7-day trending chart.

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `hyperframes-cli` | heygen-com/hyperframes | 629K (52K ★) | HeyGen's HTML-to-video toolkit: init, capture, lint, snapshot, render. With `hyperframes` (600K), `hyperframes-registry` (543K), `hyperframes-core` (507K), `media-use` (501K) and 33 more. |
| `video-edit` | genmedia-labs/skills | 594K | Routes an edit request to the right model in RunComfy's catalog. |
| `ai-music` | genmedia-labs/skills | 593K | AI music via the RunComfy CLI. |
| `ai-video-generation` | genmedia-labs/skills | 593K | Video generation across the RunComfy catalog. |
| `image-to-video` | genmedia-labs/skills | 593K | Animates a still image. |
| `ai-image-generation` | genmedia-labs/skills | 592K | Image generation and editing across FLUX, GPT Image and more. |
| `remotion-best-practices` | remotion-dev/skills | 534K | Router for Remotion. With `remotion-render`, `remotion-create`, `remotion-captions`, `remotion-markup` (85-90K each). Official. |
| `ai-video-generation` | 101-skills/superpowers | 301K | Veo, Seedance, Wan and 40+ models over inference.sh. With `twitter-automation`, `ai-image-generation`, `ai-avatar-video`. Republished under six org names. |
| `higgsfield-generate` | higgsfield-ai/skills | 175K | Images, video, 3D and audio through Higgsfield. With `higgsfield-product-photoshoot` (155K), `higgsfield-soul-id` (154K). |
| `algorithmic-art` | anthropics/skills | 82K | p5.js generative art with seeded randomness. Official. |
| `wonda-cli` | degausai/wonda | 75K | Images, video, music and audio from the terminal. |
| `slack-gif-creator` | anthropics/skills | 69K | Animated GIFs optimized for Slack. Official. |
| `nano-banana-pro` | ClawHub | 107K ⬇ | Image generation and editing with Gemini 3 Pro Image. |

### 12. Documents, office suites and knowledge tools

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `lark-doc` | open.feishu.cn | 716K | Lark (Feishu) docs and wiki. With `lark-base`, `lark-drive`, `lark-im`, `lark-calendar`, `lark-sheets`, `lark-mail`, `lark-minutes`, `lark-okr` and 19 more, all around 714K. Mirrored at `larksuite/cli` (454K, 17K ★). |
| `pptx` | anthropics/skills | 224K | Create, read and edit PowerPoint decks. Official. |
| `obsidian-vault` | mattpocock/skills | 202K | Search, create and organize notes in an Obsidian vault. |
| `pdf` | anthropics/skills | 199K | Read, merge, split, fill and OCR PDFs. Official. |
| `docx` | anthropics/skills | 191K | Word documents with tracked changes and comments. Official. |
| `xlsx` | anthropics/skills | 171K | Spreadsheets with formulas and formatting. Official. |
| `obsidian-markdown` | kepano/obsidian-skills | 87K (49K ★) | Obsidian-flavored Markdown. With `obsidian-cli` (76K), `obsidian-bases` (75K), `json-canvas` (70K). |
| `notion-api` | intellectronica/agent-skills | 77K | Notion pages, databases and blocks over REST. |
| `gws-gmail` | googleworkspace/cli | 77K (31K ★) | Gmail, Drive, Calendar, Sheets and Docs through Google's official CLI (7 skills). |
| `gog` | ClawHub | 194K ⬇ | Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets and Docs. |
| `nano-pdf` | ClawHub | 122K ⬇ | Natural-language PDF editing. |
| `obsidian` | ClawHub | 110K ⬇ | Obsidian vaults through obsidian-cli. |
| `tencent-docs` | Tencent SkillHub | 1.10M ⬇ | Tencent Docs integration, the most downloaded enterprise skill in China. |

### 13. Marketing, SEO, sales and social

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `reddit-automation` | flowkit-labs/skills | 562K | Finds relevant Reddit threads and drafts disclosed, helpful replies. |
| `twitter-automation` | 101-skills/superpowers | 301K | Posting, engagement and user management on X over inference.sh. |
| `seo-audit` | coreyhaines31/marketingskills | 211K (51K ★) | Technical SEO diagnosis. |
| `copywriting` | coreyhaines31/marketingskills | 205K | Homepage, landing, pricing and feature-page copy. |
| `higgsfield-product-photoshoot` | higgsfield-ai/skills | 155K | Brand-quality product images. With `higgsfield-marketplace-cards` (152K). |
| `marketing-psychology` | coreyhaines31/marketingskills | 146K | Behavioral science applied to marketing. |
| `content-strategy` | coreyhaines31/marketingskills | 143K | What content to create and why. |
| `programmatic-seo` | coreyhaines31/marketingskills | 134K | Template-driven SEO pages at scale. Plus 56 more marketing skills in the bundle. |
| `amazon-product-research` | nexscope-ai/amazon-skills | 78K | Demand, competition and profit analysis for Amazon sellers. |
| `audit-website` | squirrelscan/skills | 71K | SEO, performance, security and accessibility audit, then fixes in code. |
| `cross-border-ecommerce` | nexscope-ai/ecommerce-skills | 63K | Scores target markets for e-commerce expansion. |
| `landing-page-conversion-audit` | autonnel/autonnel-skills | 61K | Conversion leaks ordered by revenue impact. With funnel, upsell and tracking skills (6 total). |
| `admapix` | ClawHub | 134K ⬇ | Ad creatives, app rankings and market data. |

Also notable by stars: [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) (17K ★, 25 sub-skills and 18 sub-agents for SEO and GEO).

### 14. Science, data and diagrams

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `paper-context-resolver` | lllllllama/rigorpilot-skills | 451K | Resolves paper context for README-first deep-learning reproduction. With `repo-intake-and-plan`, `minimal-run-and-audit`, `env-and-assets-bootstrap` (450K each) and `ai-research-explore` (311K). |
| `wind-mcp-skill` | wind-alice/alicemarket | 169K | Verified financial market data from Wind. |
| `archify` | tt-a1i/archify | 100K (68K ★) | Validated architecture, sequence, data-flow and lifecycle diagrams as explorable HTML. |
| `smart-charts` | Tencent SkillHub | 361K ⬇ | Chart generation from data. |

Also notable by stars: [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) (83K ★, turns any code into an interactive knowledge graph), [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) (46K ★, the largest science skill library), [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py) (19K ★), [Orchestra-Research/AI-Research-SKILLs](https://github.com/Orchestra-Research/AI-Research-SKILLs) (13K ★), [yizhiyanhua-ai/fireworks-tech-graph](https://github.com/yizhiyanhua-ai/fireworks-tech-graph) (11K ★, technical diagrams from natural language).

### 15. Agents, orchestration, memory and self-improvement

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `cavecrew` | juliusbrussee/caveman | 314K | Delegates to investigator, builder and reviewer subagents. |
| `google-agents-cli-adk-code` | google/agents-cli | 290K | Agent code, tools and callbacks with Google ADK. With `workflow`, `eval`, `deploy`, `scaffold`, `observability`, `publish`. |
| `orca-cli` | stablyai/orca | 244K (74K ★) | Worktrees, terminals, automations and artifacts for a fleet of agents. |
| `orchestration` | stablyai/orca | 228K | Supervised workers, task DAGs, decision gates and escalation. |
| `subagent-driven-development` | obra/superpowers | 210K | Independent plan tasks executed through subagents. |
| `dispatching-parallel-agents` | obra/superpowers | 196K | Parallel agents for independent tasks. |
| `mcp-builder` | anthropics/skills | 117K | Build high-quality MCP servers. Official. |
| `claude-api` | anthropics/skills | 66K | Claude API and SDK reference: models, streaming, tools, caching. Official. |
| `agentix-ceo` | agentix-cloud/skills | 61K | Create roles, assign tasks, spawn workers, monitor progress. |
| `typesafe-ai` | typesafe-ai/skills | trending | Type-safe AI application patterns. |
| `self-improving-agent` | ClawHub / SkillHub | 480K ⬇ / 1.22M ⬇ | Captures learnings, errors and corrections for continuous improvement. The most downloaded skill outside skills.sh. |
| `self-improving` | ClawHub | 210K ⬇ | Self-reflection, self-criticism and self-organizing memory. Top of the social-buzz chart. |
| `ontology` | ClawHub | 199K ⬇ | Typed knowledge graph for structured agent memory. |
| `proactive-agent` | ClawHub | 176K ⬇ | Turns task-followers into partners that anticipate needs. |
| `evolver` | ClawHub | 90K ⬇ | Self-evolution engine that mines runtime history for improvements. |

Also notable by stars: [bytedance/deer-flow](https://github.com/bytedance/deer-flow) (83K ★, long-horizon super-agent harness), [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) (69K ★), [herdrdev/herdr](https://github.com/herdrdev/herdr) (40K ★, runtime for coding agents), [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) (31K ★), [nanocoai/nanoclaw](https://github.com/nanocoai/nanoclaw) (31K ★), [NevaMind-AI/memU](https://github.com/NevaMind-AI/memU) (14K ★, memory across agents).

### 16. Security, privacy and OSINT

| Skill | Repo | Installs | What it does |
| --- | --- | --- | --- |
| `azure-compliance` | microsoft/azure-skills | 590K | Compliance checks for Azure resources. With `entra-app-registration` (590K), `azure-rbac` (492K). |
| `git-guardrails-claude-code` | mattpocock/skills | 382K | Blocks destructive git commands through hooks. |
| `anti-detect-browser` | antibrow/anti-detect-browser-skills | 94K | Fingerprint-consistent browsing with isolated profiles. With `multi-account-isolation` (63K). |
| `browser-fingerprint-audit` | liarjsdev/liarjs-skills | 60K | Canvas, WebGL, audio, font and timezone contradiction checks. With `playwright-stealth-verify`, `fingerprint-ci-gate`, `fingerprint-failure-triage`. |
| `is-this-photo-real` | useosint/skills | 58K | Provenance, error-level and compression analysis for images and video. |
| `investigate-without-getting-made` | useosint/skills | 58K | Investigator OPSEC across IP, ASN, browser and TLS fingerprints. |
| `what-leaked-about-you` | useosint/skills | 58K | Breach exposure for an email, username, phone or name. |
| `find-the-original-image` | useosint/skills | 56K | Reverse image search across Yandex, Google Lens, Bing, TinEye and Baidu. |
| `skill-vetter` | ClawHub / SkillHub | 274K ⬇ / 313K ⬇ | Security-first vetting of skills before installation. |
| `skillscan` | ClawHub | 182K ⬇ | Mandatory security gate for new skills. |
| `anti-fraud` | Tencent SkillHub | 449K ⬇ | Scam and fraud detection for consumers. |

Also notable by stars: [mukul975/Anthropic-Cybersecurity-Skills](https://github.com/mukul975/Anthropic-Cybersecurity-Skills) (33K ★, 817 skills mapped to MITRE ATT&CK and NIST CSF), [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) (18K ★, multi-phase audits with verified findings), [trailofbits/skills](https://github.com/trailofbits/skills) (7K ★, `sharp-edges` and `gh-cli` are on this week's hot chart), and the threat-modeling skills in [wshobson/agents](https://github.com/wshobson/agents) (`stride-analysis-patterns`, `attack-tree-construction`, `threat-mitigation-mapping`, all rising).

## Most-starred skill repositories

GitHub stars on 2026-09-21 for the repositories behind the skills above. "Skills-first" repos exist to ship skills; for "project" repos the skill rides along with a larger product, so the stars are not a measure of the skill itself.

| # | Repository | Stars | Type | Skills on skills.sh |
| --- | --- | --- | --- | --- |
| 1 | [obra/superpowers](https://github.com/obra/superpowers) | 289K | Skills-first | 14 (`brainstorming`, `systematic-debugging`, `writing-plans`...) |
| 2 | [mattpocock/skills](https://github.com/mattpocock/skills) | 266K | Skills-first | 52 (`grill-me`, `tdd`, `handoff`...) |
| 3 | [anthropics/skills](https://github.com/anthropics/skills) | 177K | Skills-first | 18 (`frontend-design`, `skill-creator`, `pptx`...) |
| 4 | [anthropics/claude-code](https://github.com/anthropics/claude-code) | 147K | Project | Ships `frontend-design` and `agent development` |
| 5 | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | 143K | Skills-first | `ponytail` |
| 6 | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 129K | Skills-first | `ui-ux-pro-max` |
| 7 | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | 124K | Project | `shadcn` |
| 8 | [browser-use/browser-use](https://github.com/browser-use/browser-use) | 116K | Project | `browser-use` |
| 9 | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | 107K | Skills-first | 20 (`caveman`, `caveman-commit`...) |
| 10 | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 98K | Skills-first | Engineering discipline skills (TDD, debugging, review, security...) |
| 11 | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 89K | Skills-first | 13 (`design-taste-frontend`...) |
| 12 | [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | 83K | Skills-first | Code-to-knowledge-graph |
| 13 | [bytedance/deer-flow](https://github.com/bytedance/deer-flow) | 83K | Project | Super-agent harness |
| 14 | [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 75K | Index | Curated list |
| 15 | [stablyai/orca](https://github.com/stablyai/orca) | 74K | Project | `orca-cli`, `orchestration`, `computer-use` |
| 16 | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 69K | Skills-first | 21 (`impeccable`, `polish`, `critique`...) |
| 17 | [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) | 69K | Project | Agent workflow tooling |
| 18 | [tt-a1i/archify](https://github.com/tt-a1i/archify) | 68K | Skills-first | `archify`, `archify-review` |
| 19 | [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) | 66K | Skills-first | Best-practice guides |
| 20 | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | 52K | Project | 38 (`hyperframes-cli`...) |
| 21 | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | 51K | Skills-first | 61 (`seo-audit`, `copywriting`...) |
| 22 | [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) | 49K | Skills-first | ADHD-friendly output |
| 23 | [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) | 49K | Skills-first | 5 (`obsidian-markdown`...) |
| 24 | [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills) | 47K | Index | Catalog and control plane |
| 25 | [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) | 46K | Skills-first | Science skills library |

Not in this snapshot because they are not packaged as a SKILL.md, but among the most-starred agent-workflow repos of 2026 according to AWS's June 2026 survey: [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (174K ★, four behavioral principles as a CLAUDE.md) and [garrytan/gstack](https://github.com/garrytan/gstack) (110K ★, role-based slash-command workflow).

## Other ecosystems: ClawHub and Tencent SkillHub

skills.sh measures coding agents. Two other registries show what personal and enterprise agents install.

**ClawHub** (OpenClaw personal agents), by downloads:

| # | Skill | Downloads | What it does |
| --- | --- | --- | --- |
| 1 | `self-improving-agent` | 480K | Captures learnings and corrections for continuous improvement |
| 2 | `skill-vetter` | 274K | Security vetting before installing skills |
| 3 | `self-improving` | 210K | Self-reflection and self-organizing memory |
| 4 | `ontology` | 199K | Typed knowledge graph for agent memory |
| 5 | `github` | 199K | GitHub through the `gh` CLI |
| 6 | `gog` | 194K | Google Workspace CLI |
| 7 | `skillscan` | 182K | Security gate for new skills |
| 8 | `proactive-agent` | 176K | Anticipates needs instead of following tasks |
| 9 | `weather` | 170K | Weather and forecasts, no API key |
| 10 | `multi-search-engine` | 162K | 16 search engines |

**Tencent SkillHub** (China), by downloads:

| # | Skill | Downloads | Category |
| --- | --- | --- | --- |
| 1 | `dev-expert` | 1.22M | Full-stack programming expert (Java, PHP, frontend, MySQL) |
| 2 | `self-improving-agent` | 1.22M | AI agent (mirror of the ClawHub skill) |
| 3 | `tencent-docs` | 1.10M | Office and productivity |
| 4 | `find-skills` | 1.00M | AI agent (mirror) |
| 5 | `agent-browser` | 832K | AI agent (mirror) |
| 6 | `parenting-expert` | 656K | Life services |
| 7 | `summarize` | 619K | Knowledge management |
| 8 | `multi-search-engine` | 583K | Knowledge management |
| 9 | `anti-fraud` | 449K | Life services |
| 10 | `self-improving` | 409K | AI agent (mirror) |

## Data and sources

- [`data/skills-sh-leaderboard-2026-09-21.csv`](data/skills-sh-leaderboard-2026-09-21.csv): the full 600-entry skills.sh all-time leaderboard as embedded in the site on the snapshot date, with weekly install counts for the last eight weeks.
- [skills.sh](https://skills.sh) leaderboard, [trending](https://skills.sh/trending) and hot charts, by Vercel.
- [Best Skills](https://github.com/LinklyAI/best-skills) by Linkly AI: daily cross-registry rankings (skills.sh, ClawHub, Tencent SkillHub, GitHub, social), CC BY 4.0. Star counts, ClawHub and SkillHub numbers above come from its 2026-09-21 raw data.
- [Agent Skills specification](https://agentskills.io) and [anthropics/skills](https://github.com/anthropics/skills).
- [The most popular AI coding skills right now](https://dev.to/aws/the-most-popular-ai-coding-skills-right-now-4183), AWS on DEV, June 2026, for the Karpathy guidelines and gstack star counts.
- Skill descriptions are the `description` field of each SKILL.md as shown on skills.sh, lightly shortened.
