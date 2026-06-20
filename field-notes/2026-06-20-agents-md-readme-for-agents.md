# Field Note: AGENTS.md Is A README For Agents

Date: 2026-06-20

## Summary

`AGENTS.md` is a Markdown instruction file for coding agents. The easiest way
to explain it is: `README.md` is for humans, `AGENTS.md` is for agents.

It gives Codex and other coding agents a predictable place to find project
guidance: how the repo is organized, how to run it, how to test it, what style
to follow, what not to do, and what "done" means.

The best `AGENTS.md` files are short, specific, and maintained from real
friction. They should not be giant prompt dumps. They should be the durable
working agreements that make agent work easier to execute and review.

## Observation

Once a team starts using Codex every day, repeated guidance starts to appear.
The same reminders keep coming back:

- where the important files live
- which command actually runs the tests
- what conventions matter in this repo
- when to ask before changing dependencies
- how to verify the work before calling it done
- what tone or collaboration style makes the workflow feel natural

That guidance can live in every prompt, but it is better as repo memory. The
prompt should describe the current task. `AGENTS.md` should describe the stable
way work happens in this repo.

This is also where personality can help, as long as it stays practical. A small
line such as "use a warm, conversational tone in summaries" is useful if it
matches the team's collaboration style. A page of vibes is less useful than one
clear instruction about how to communicate, verify, and hand off work.

## Why It Matters

Good agent instructions reduce hidden assumptions.

Without an `AGENTS.md`, Codex has to infer project norms from the file tree,
package scripts, prior messages, and local context. It can often do that well,
but the process is noisier than it needs to be.

With an `AGENTS.md`, the repo can tell Codex what a new teammate would need to
know:

- the preferred package manager
- the right test command
- the code style
- the review expectations
- the risky areas
- the definition of done

That improves both execution and evaluation. If the file says "run `npm test`
before finishing," then a trace that skips tests is easier to catch. If the file
says "ask before adding dependencies," then dependency changes become visible
review points instead of silent agent choices.

## History And Standardization

`AGENTS.md` started as a simple convention for giving coding agents
project-specific instructions. The public `agents.md` site describes it as an
open format and a predictable place for agent guidance.

It is not a complex schema. There are no required fields. It is standard
Markdown, with whatever headings help the agent understand the project.

The format has become broader than Codex. The `agents.md` site lists adoption
across many coding-agent tools, and the Linux Foundation announced that
OpenAI's `AGENTS.md` project became one of the founding contributions to the
Agentic AI Foundation. In that announcement, the Linux Foundation described
`AGENTS.md` as a universal standard for consistent project-specific guidance
across repositories and toolchains.

The practical takeaway: treat `AGENTS.md` as an emerging cross-agent convention,
not a Codex-only trick.

## How Codex Loads AGENTS.md

OpenAI's Codex docs describe a layered instruction chain.

Codex reads instruction files before doing work. At global scope, Codex looks in
the Codex home directory, which defaults to `~/.codex` unless `CODEX_HOME` is
set. It reads `AGENTS.override.md` first if it exists. Otherwise it reads
`AGENTS.md`.

At project scope, Codex starts at the project root, usually the Git root, and
walks down toward the current working directory. In each directory along that
path, it checks for:

1. `AGENTS.override.md`
2. `AGENTS.md`
3. configured fallback filenames

Codex includes at most one instruction file per directory. It then concatenates
the files from root down, so more specific files appear later and can override
broader guidance.

That gives a useful layering model:

| Scope | Use it for |
| --- | --- |
| `~/.codex/AGENTS.md` | Personal defaults across all repos |
| repo-root `AGENTS.md` | Shared project norms |
| nested `AGENTS.md` | Subproject-specific rules |
| `AGENTS.override.md` | Temporary or higher-priority overrides |

The important caution is size. Codex has a default combined project-doc limit,
and research on repository context files has found that unnecessary
requirements can make tasks harder. Keep the file small enough that the agent
can actually use it.

## What To Put In It

A useful `AGENTS.md` usually covers:

- project overview
- repo layout and important directories
- setup commands
- build, test, lint, and preview commands
- coding conventions
- testing expectations
- security or data-handling constraints
- dependency rules
- PR or commit expectations
- what "done" means
- communication preferences

The file should answer the questions a good teammate asks before touching a
repo:

- Where should I look first?
- Which command proves this works?
- What patterns should I copy?
- What changes require extra care?
- What should I report back when I finish?

## A Simple Starter File

This is a small example for a JavaScript or TypeScript project. It includes a
conversational style preference, but keeps the main focus on work quality.

```md
# AGENTS.md

## Project Context

- This repo is a small web app.
- Source code lives in `src/`.
- Tests live next to the code they cover.
- Public docs live in `docs/`.

## Working Style

- Be warm, direct, and conversational in summaries.
- Explain tradeoffs when there is more than one reasonable path.
- Ask before adding new runtime dependencies.
- Keep changes focused on the user's request.

## Commands

- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Run tests: `npm test`
- Run lint: `npm run lint`

## Code Conventions

- Prefer small, readable functions.
- Follow existing file structure before introducing new patterns.
- Use TypeScript types for public interfaces.
- Avoid broad refactors unless the task explicitly asks for one.

## Verification

- Run tests after changing behavior.
- Run lint after changing TypeScript or JavaScript.
- If tests cannot be run, explain why and name the remaining risk.

## Definition Of Done

- The requested behavior is implemented.
- Relevant tests or checks pass.
- The final response summarizes changed files, verification, and any caveats.
```

Create it by adding `AGENTS.md` at the repo root. In the Codex CLI, `/init` can
scaffold a starter file, but the generated file should be edited to match how
the team actually builds, tests, reviews, and ships.

To verify the setup, ask Codex to summarize the active instructions from the
repo root. For nested projects, start Codex from the nested directory and ask
which instruction files it loaded.

## What To Avoid

The common failure mode is context bloat: stuffing the file with every possible
preference, outdated command, or long explanation.

Avoid:

- vague rules like "write clean code" without examples
- instructions that conflict with the repo's actual scripts
- stale setup commands
- private secrets or credentials
- long architecture essays that belong in docs
- rules copied from another repo without checking if they apply
- using `AGENTS.md` for one-off task instructions that belong in the prompt

If the file keeps growing, split it. Keep `AGENTS.md` concise and point to
specific docs for architecture, review, deployment, or security details.

## Evaluation Ideas

This lab can evaluate `AGENTS.md` quality by checking observable behavior:

- Did Codex load the expected global and project instruction files?
- Did the file name real commands that exist in the repo?
- Did Codex follow the listed verification steps?
- Did it avoid prohibited changes, such as adding dependencies without asking?
- Did nested instructions override broader instructions correctly?
- Did the file reduce repeated corrections across sessions?
- Did the file stay short enough to avoid context bloat?
- Did the final response follow the requested communication style?

The best test is not whether the file sounds comprehensive. The best test is
whether it changes agent behavior in useful, inspectable ways.

## Sources

- OpenAI Codex AGENTS.md guide: https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex best practices: https://developers.openai.com/codex/learn/best-practices
- AGENTS.md open format site: https://agents.md/
- Linux Foundation AAIF announcement: https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation
- Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?: https://arxiv.org/abs/2602.11988
- Configuration Smells in AGENTS.md Files: https://arxiv.org/abs/2606.15828

## Working Principle

Put durable repo guidance in `AGENTS.md`, keep task-specific instructions in the
prompt, and keep the file short enough that Codex can reliably follow it.
