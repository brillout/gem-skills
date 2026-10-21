---
name: anti-prose-slop
description: Stop AI agents from shipping generic AI prose when writing books with Proseify.
license: MIT
metadata:
  version: "1.0.0"
  author: "Proseify <support@proseify.xyz>"
  compatibility: "Works with any AI agent that can call the Proseify MCP server (Claude Code, Codex, Cursor, OpenCode, Hermes)."
  tags: "book-writing, mcp, longform, fiction, prose-quality, editing"
---

> **Stop AI writing agents from shipping generic prose.**

# Stop Making Prose Slop

Write distinctive, publishable longform with the Proseify MCP — a curated
public-domain corpus plus a guided drafting pipeline.

**Prerequisite:** connect the Proseify MCP first. No key, no tools.

```json
{
  "mcpServers": {
    "proseify": {
      "type": "http",
      "url": "https://mcp.proseify.xyz/mcp",
      "headers": { "Authorization": "Bearer YOUR_KEY" }
    }
  }
}
```

Get a key at https://proseify.xyz (sign in → pick a plan → paste your config).

## The one rule

**Genre before prose.** Every generation decision after the first sentence
depends on picking the right tradition. A gothic ghost story and a Regency
romance want different sentence lengths, different climates, different endings.
Call `get_genre_recipe` before writing; don't use `plan_book` to skip it.

## The workflow

1. **Agree the length FIRST.** Before planning anything, ask the user one
   question: *"Full novel (~70–90k words) or novella (~20–30k)?"* Then pass
   **explicit** arguments — `plan_book("...", genre, target_chapters=40,
   target_words=80000)` for a novel, or omit for the default (30 chapters ≈
   48k words). Never accept the bare default without confirming: agents that
   "just go" produce novellas when the customer asked for a book, and stop
   mid-book to ask about tools instead of finishing the manuscript.
2. **Identify the genre.** Don't guess. Cross-check against `list_genres` and
   `get_genre_recipe(genre)` before writing. Mislabeled genre = mis-voiced book.
3. **Read the recipe.** It returns pacing beats, dialogue ratio, and
   stylistic anchors from the tradition. Read them all before planning.
4. **Search the corpus.** Use `search_corpus` for 3–5 model passages that
   match the register you want. Quote a line to yourself; match its rhythm.
5. **Plan before drafting.** `plan_book` produces the architecture. Use it —
   don't freestyle 40 chapters without a map.
6. **Draft EVERY chapter, in chapter order, without stopping.** The common
   failure: the agent drafts chapters 1–5, summarises the rest, and calls it
   done. A book isn't done until every planned chapter exists at its full
   target length. If you have a per-session step budget, write the next
   chapter at the start of each new turn rather than summarising.
7. **Self-edit between drafts.** Anti-slop pass, every time:
   - Cut "seemed to", "began to", "settled into".
   - Kill adverb-stacking ("quietly, almost reverently…").
   - Delete sentences that only restate the previous one.
   - Check chapter openings — vary them. Never six chapters in a row that open
     with weather.
   - Read the last page out loud; if it sounds like a summary, rewrite it.
8. **Verify with `evaluate_book`.** If the score is below your own bar,
   don't ship it — revise the weakest chapters and re-evaluate.

## Anti-slop checklist (per chapter)

- [ ] Voice matches the recipe, not "ChatGPT normal".
- [ ] Dialogue keeps its register (era, class, region).
- [ ] Scene boundaries do work — each has a job, not just a location change.
- [ ] No repeated sentence-opening constructions within three paragraphs.
- [ ] Concrete nouns beat abstractions. "The bell rang" beats "A sound occurred."

## Traps the corpus protects against

- **The thesaurus trap.** Don't swap synonyms for variety; swap for precision.
- **The cliffhanger trap.** One per book, not one per chapter.
- **The filter-words trap.** "She felt / saw / heard / noticed" — cut them.
- **The dialogue-as-exposition trap.** Nobody explains the plot over tea.

## Pitfalls

- `plan_book` result is large. Don't call it repeatedly for the same book; call
  once, hold the outline in context, work chapter by chapter.
- **Default is 30 chapters ≈ 48k words (novella-length).** A full novel needs
  explicit `target_chapters=40, target_words=80000` (cap is 40 chapters).
  Confirm this with the user before planning (step 1).
- **The summarise trap:** the #1 way agents "finish" a book is writing chapters
  1–5 fully and compressing the rest into one-line summaries. `evaluate_book`
  catches thin chapters — run it before declaring done, and re-draft any
  chapter under its per-chapter target.
- Long agent sessions get cut off. Persist progress: keep the assembled
  manuscript in a file (`assemble_book` markdown) and append chapter by
  chapter so an interrupted session resumes instead of restarting.
- `search_corpus` supports FTS5 syntax (quotes, AND/OR/NOT, `*` wildcards)
  but long operator chains are clamped to 10 terms.

## Licensing

Books sourced from Project Gutenberg and similar public-domain corpora; safe
commercial use. See the corpus page on https://proseify.xyz for per-book details.
