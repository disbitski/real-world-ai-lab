# Field Note: Claude Code Memory Is A Staging Layer

Date: 2026-06-26

![Editorial photograph of a temporary metal memory tray branching by fine white lines to four durable destinations: a guidebook, private drawer, skill cartridge, and locked case.](assets/2026-06-26-claude-code-memory-is-a-staging-layer/hero.webp)

## Summary

I have been using Claude Code memory as a lightweight way to keep context alive
before I am ready to turn it into a durable project instruction.

The move is small but useful: when I notice myself explaining a preference,
calculation rule, workflow habit, or local convention that may matter again, I
can tell Claude to remember it. In my Claude Code flow, hitting `#` makes that
feel immediate. It is not as formal as editing `CLAUDE.md`, but it is much
better than hoping the next session rediscovers the same thing.

The real lesson for me is that memory gives me a probation layer. Some context
is too useful to leave only in chat, but not stable enough to commit into the
repo or hand to every future teammate.

## Observation

I noticed this while working through how I analyze an all-up portfolio. The
important detail was not just "look at my portfolio." It was my preferred
interpretation: calculate value based on current equity holdings and options,
regardless of margin treatment.

That kind of preference is easy to lose in a conversation. If I only explain it
once, Claude may handle the current turn correctly but future sessions still
start cold. If I immediately put it in `CLAUDE.md`, I may be over-promoting a
personal analysis habit into a durable project instruction.

Memory sits between those two moves.

I can tell Claude something like:

```text
# Remember that when I ask for my all-up portfolio value, I mean current equity holdings plus current options value, regardless of margin treatment. Treat this as my personal analysis convention, not as investment advice.
```

That gives the next session a better starting point while I keep control over
whether the rule eventually belongs in a checked-in instruction file, a local
`CLAUDE.local.md`, a finance skill, or nowhere permanent. I keep the `#`
memory example on one line because each new leading `#` can create a separate
memory entry.

## Why It Matters

Agents do better when they do not have to rediscover stable context every time.
But not all context deserves the same kind of durability.

Some things are repo rules:

- build commands
- test commands
- architecture constraints
- coding conventions
- deployment workflow

Some things are personal working context:

- how I define a portfolio value
- which dashboards I trust
- how I like summaries structured
- which local data source I usually mean
- what assumptions I want called out every time

If I mix those together too quickly, `CLAUDE.md` can become cluttered with
personal habits, experimental ideas, and half-stable preferences. If I never
write them down, I keep paying the same explanation cost.

Memory gives me a way to capture the middle.

## How Claude Code Memory Works

Anthropic's docs describe two complementary memory systems in Claude Code.
`CLAUDE.md` files are instructions I write. Auto memory is where Claude records
learnings and patterns from my corrections and preferences.

Both are loaded into future sessions as context, not as hard enforcement. That
distinction matters. If I want a rule to block behavior, I need permissions or
a hook. If I want Claude to start with better context, memory is the right
shape.

Claude Code also gives me `/memory` as the management surface. The command lets
me view loaded `CLAUDE.md`, `CLAUDE.local.md`, and rules files, toggle auto
memory, and open the auto-memory folder. The official docs also describe auto
memory as machine-local, stored per project under `~/.claude/projects/...`, and
shared across worktrees for the same repository.

The practical operating model is:

| Surface | What I use it for |
| --- | --- |
| Chat | One-off context for this turn |
| Memory | Personal patterns that may matter again |
| `CLAUDE.local.md` | Personal project guidance I want loaded reliably but not committed |
| `CLAUDE.md` | Team or project guidance worth versioning |
| `.claude/rules/` | Path-scoped guidance that should load only when relevant |
| Hooks/permissions | Enforcement, not just context |

Codex has a similar broad idea with Memories, but the workflow is different.
OpenAI's Codex docs describe memories as an optional feature that carries useful
context from earlier threads into future work, while still recommending
`AGENTS.md` or checked-in documentation for required team guidance. That
reinforces the same principle: memory is useful recall, not the only source of
truth.

## What Should Graduate

I want to treat memory like a staging area.

If a memory keeps proving useful, I should promote it. The destination depends
on the shape of the knowledge:

| If the memory says... | Promote it to... |
| --- | --- |
| "I personally define this metric this way" | `CLAUDE.local.md` or a personal skill |
| "This repo must always run this command" | `CLAUDE.md` |
| "Files under this path follow special rules" | `.claude/rules/` |
| "This repeats across many repos" | user-level `~/.claude/CLAUDE.md` or a skill |
| "This should stop an unsafe action" | permissions or a `PreToolUse` hook |

The portfolio example is a good test. My current view is that it should start
as memory because it is a personal analysis convention. If it becomes part of a
repeatable finance workflow, I would rather promote it into a finance-specific
skill or local instruction file than bury it inside a general project
`CLAUDE.md`.

## What I Should Watch

Memory can make agents feel more personal and capable, but it can also make
old assumptions invisible.

My guardrails:

- Do not store secrets, account numbers, credentials, or private raw financial
  data in memory.
- Keep financial memories as analysis conventions, not trading instructions.
- Review `/memory` when Claude starts acting like it "knows" something I did
  not say in the current session.
- Promote stable project rules into files I can review.
- Delete or edit memories that are stale, vague, or too broad.
- Use hooks or permissions for safety rules instead of relying on memory.

This is especially important for finance-adjacent workflows. A remembered
valuation convention can be helpful. A remembered trading preference can become
dangerous if it silently shapes future analysis without fresh judgment.

## Evaluation Ideas

This lab can evaluate Claude Code memory by comparing the same task across
different context layers:

- no memory, only the current prompt
- memory with the portfolio valuation convention
- `CLAUDE.local.md` with the same convention
- a finance skill with explicit inputs, outputs, and risk language

For each run, I would check:

- Did Claude apply the remembered convention correctly?
- Did it distinguish the convention from financial advice?
- Did it ask for missing data instead of inventing holdings or options values?
- Did it avoid using margin treatment when the convention says not to?
- Did it cite or show the calculation path clearly enough to audit?
- Did memory reduce repeated explanation without creating hidden assumptions?
- Was the context layer appropriate, or should the rule have been promoted?

The strongest signal is not whether Claude remembers everything. It is whether
memory helps the workflow start closer to my actual intent without making the
system less inspectable.

## Sources

- My Claude Code memory workflow notes on portfolio analysis conventions, 2026-06-26.
- Anthropic Claude Code, "How Claude remembers your project": https://code.claude.com/docs/en/memory
- Anthropic Claude Code, "Commands": https://code.claude.com/docs/en/commands
- OpenAI Codex, "Memories": https://developers.openai.com/codex/memories

## Working Principle

I should use memory for context that is worth carrying forward, but promote it
only after it proves stable enough to become an instruction, rule, skill, or
enforced boundary.
