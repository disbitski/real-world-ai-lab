---
name: field-notes
description: Create and publish Real World AI Lab field notes. Use when the user asks to turn a conversation, lesson, workflow, AI/Codex concept, experiment, or practical observation into a field note; when they mention adding something to field-notes; or when they explicitly invoke $field-notes. Produces a dated Markdown note in disbitski/real-world-ai-lab/field-notes, updates the README Field Notes section near the top, verifies the repo, commits, and pushes to main unless the user asks for a PR or pushing is blocked.
---

# Field Notes

## Overview

Turn practical AI/Codex lessons into concise Real World AI Lab field notes and publish them to `disbitski/real-world-ai-lab`.

## Target Repository

- Repository: `https://github.com/disbitski/real-world-ai-lab`
- Notes directory: `field-notes/`
- README: `README.md`
- Default publish target: `main`

If the current workspace is not this repository, use `gh repo clone` or an existing local clone, work from a clean branch or clean `main`, and protect unrelated user changes.

## Field Note Format

Follow the established note style:

```markdown
# Field Note: <Plain-English Title>

Date: YYYY-MM-DD

## Summary

<2-4 short paragraphs explaining the core lesson.>

## Observation

<What happened, what pattern appeared, or what changed in the user's understanding.>

## Why It Matters

<Why builders, teams, or evaluators should care.>

## <One or two topic-specific sections>

<Use short prose, bullets, or a table only when it clarifies the idea.>

## Evaluation Ideas

<Observable questions this lab can use to evaluate the pattern.>

## Sources

<Only include when external sources materially grounded the note.>

## Working Principle

<One concise principle that captures the lesson.>
```

Not every note needs every optional section, but keep `Summary`, `Observation`, `Why It Matters`, `Evaluation Ideas`, and `Working Principle` unless there is a strong reason to omit one.

## Style Rules

- Write for builders learning practical AI, GPT, and Codex workflows.
- Keep the tone clear, grounded, and useful. Avoid hype and vague claims.
- Prefer short paragraphs and visible criteria over long essays.
- Separate facts from interpretation.
- Use official/current sources for OpenAI model, API, or Codex product claims.
- Preserve links in a `Sources` section when external docs or web pages are used.
- Keep filenames lowercase and dated: `field-notes/YYYY-MM-DD-short-slug.md`.

## Workflow

1. Clarify the core lesson and audience when needed. If the request is clear, proceed.
2. Inspect existing field notes before drafting so the title, shape, and tone match.
3. Create the new dated note in `field-notes/`.
4. Update the top README `Field Notes` section with a link to the new note.
5. Keep Field Notes near the top of the README, immediately after the intro.
6. Run `npm test` when the repo has Node tests, even for documentation-only changes.
7. Review `git diff` for unsupported claims, broken links, formatting drift, and unrelated edits.
8. Commit with a concise message.
9. Push to `main` when the user has asked for publishing to the live field-notes repo. If branch protection or policy blocks direct push, push a branch and open a PR instead.

## README Link Format

Use this bullet format:

```markdown
- [Title Without "Field Note:"](field-notes/YYYY-MM-DD-short-slug.md)
```

The README Field Notes section should stay actionable and visible near the top of the file.
