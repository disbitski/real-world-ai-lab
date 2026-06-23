# Field Note: Claude Code Shortcuts Are Context Steering

Date: 2026-06-23

## Summary

I was working with Claude Code and noticed a practical pattern: Claude can
usually figure out a repo by searching, but I can save time by steering the
search path.

The useful move was not giving Claude an answer. It was giving Claude better
entry points. I used `@` references to load specific files or directories into
the conversation, then used memory once I found the file or process that should
matter again later.

That felt like chipping away at a problem. Start broad enough to orient the
agent, narrow to the right files, then capture the durable lesson so the next
turn or next session starts closer to the work.

## Observation

Claude was able to search whole directories and inspect the repo on its own,
but that can be more work than the task needs. When I already knew which repo,
directory, or file mattered, `@` was a cleaner way to point Claude directly at
the material.

For example, instead of asking a broad question like:

```text
Find the files that handle sync and migration.
```

I could aim the context:

```text
Review @src/migrationPlan.js and @src/migrationExecutor.js.
Help me understand the safest next migration step.
```

Once I found the right file, I used the memory flow to tell Claude to remember
that file and process moving forward. In my local workflow, the `#` shortcut was
useful for that kind of "remember this" moment. The important habit is not the
shortcut itself. The habit is recognizing when a discovered path has become
durable project knowledge.

I have also been using `/init` when loading a local repo for the first time.
That gives Claude a starter `CLAUDE.md` based on what it can discover about the
project. From there, I can refine the file with the parts Claude would not know
from static inspection: preferred workflows, important commands, risky areas,
and which files are the best starting points for common tasks.

## Why It Matters

Agents are powerful at exploration, but exploration has a cost. It consumes
time, context, tool calls, and attention. If I already know the best path, I
should not make the agent rediscover it every time.

This matters for builders because a lot of agent productivity comes from
reducing unnecessary search:

- `@` turns "go inspect the repo" into "start with this file or directory."
- `/init` turns a new repo into a project with explicit agent instructions.
- memory turns repeated discoveries into persistent working context.
- a small `CLAUDE.md` turns repo-specific habits into something reviewable.

The point is not to micromanage the model. The point is to remove waste from
the path. Let Claude reason and code, but give it better coordinates.

## A Small Context Funnel

The pattern I want to keep using is a context funnel:

| Stage | Human move | Agent benefit |
| --- | --- | --- |
| Orient | Use `/init` or ask for a high-level overview | Builds an initial map of the repo |
| Focus | Reference likely files with `@` | Avoids broad directory wandering |
| Confirm | Ask Claude to explain why those files matter | Checks whether the path is correct |
| Remember | Save the durable file/process note | Reduces repeated rediscovery |
| Refine | Update `CLAUDE.md` with stable guidance | Makes the workflow inspectable |

This is especially useful when the problem is not mysterious, just scattered.
If I can identify one useful file, test command, schema, or workflow, I should
turn that into a sharper prompt instead of asking the agent to fan out across
the whole tree.

## A Starter CLAUDE.md Pattern

For a repo I expect to revisit, I want the project memory to include both broad
setup and high-value navigation hints.

```md
# CLAUDE.md

## Project Map

- App code starts in `src/`.
- Tests live in `test/`.
- Migration logic starts in `src/migrationPlan.js`.
- Sync execution scaffolding starts in `src/migrationExecutor.js`.

## Commands

- Run all tests with `npm test`.
- Start the local app with `npm start`.

## Working Agreements

- Use existing patterns before introducing new abstractions.
- Keep local-only behavior working when cloud config is missing.
- Run tests before committing behavior changes.
```

That kind of file is not meant to replace the agent. It gives the agent a
better launch point. It also gives me something concrete to review when Claude
seems to be searching too broadly or forgetting an important workflow.

## What I Would Try Next

I want to get more deliberate about when a discovery becomes memory.

Some lightweight rules:

- If Claude searches the same path twice, add a note.
- If a file is the entry point for a feature, put it in `CLAUDE.md`.
- If a command is required to verify work, put it in `CLAUDE.md`.
- If a rule is personal or local-only, keep it in `CLAUDE.local.md`.
- If a note is only useful for one task, leave it in the prompt instead of
  making it permanent.

That last point matters. Memory can become clutter. The goal is not to save
everything. The goal is to save the few coordinates that make future work
faster and more accurate.

## Evaluation Ideas

This lab can evaluate context steering by comparing the same task under
different context setups:

- broad prompt only
- prompt plus `@` file references
- prompt plus generated `CLAUDE.md`
- prompt plus refined `CLAUDE.md`
- prompt plus remembered file/process hints

For each run, I would measure:

- number of files searched
- number of irrelevant files opened
- time to identify the right file
- whether the agent chose the expected entry point
- whether the final change was smaller and more accurate
- whether the same repo task improved in a later session

The best signal is not whether the agent can eventually solve the problem. The
best signal is whether good context steering helps it take the cleaner path.

## Sources

- My Claude Code workflow notes, 2026-06-23.
- Anthropic Claude Code, "Common workflows": https://code.claude.com/docs/en/common-workflows
- Anthropic Claude Code, "How Claude remembers your project": https://code.claude.com/docs/en/memory

## Working Principle

When an agent is exploring too broadly, I should not only ask harder. I should
steer context: point to the right files, preserve the right memory, and keep the
repo's agent instructions sharp.
