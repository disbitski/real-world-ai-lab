# Field Note: When Plan Mode Is Useful

Date: 2026-06-20

## Summary

Plan Mode is useful when the work needs a conversation before it needs file
edits. It gives Codex room to gather context, ask clarifying questions, and
turn a fuzzy request into an implementation path before the agent starts making
changes.

That does not mean every Codex task should start in Plan Mode. In real use, the
fastest path is often direct agent execution: give Codex a clear goal, the
right context, constraints, and a definition of done, then let it inspect,
change, verify, and report back.

The practical lesson is to pick the mode based on uncertainty. Use normal agent
mode when the destination is clear. Use Plan Mode when the destination, route,
or risk profile still needs to be shaped.

## Observation

Codex works especially well when the human already knows what they want to
build and can describe it with enough specificity. A strong prompt gives Codex:

- the goal
- the relevant context
- constraints or preferences
- what "done" should mean

In that situation, planning can happen inside the normal working loop. Codex can
inspect the repo, make a scoped change, run verification, and confirm the result
without a separate planning phase.

Plan Mode becomes more valuable when the prompt is not yet ready for that
execution loop. That happens when the work is broad, the tradeoffs are unclear,
the repo impact is large, or the human wants to talk through options before
Codex starts editing.

OpenAI's Codex best-practices docs describe the same threshold: if a task is
complex, ambiguous, or hard to describe, ask Codex to plan before it starts
coding. The docs also say Plan Mode can gather context, ask clarifying
questions, and build a stronger plan before implementation. In the CLI, it can
be toggled with `/plan` or `Shift+Tab`.

## Why It Matters

Plan Mode is not about slowing work down for its own sake. It is about moving
uncertainty earlier, where it is cheaper to resolve.

Without a planning phase, a fuzzy request can turn into premature edits. The
agent may choose an architecture too early, touch too many files, or optimize
for the wrong version of the user's intent. Even if the code is technically
good, it may be pointed at the wrong target.

With Plan Mode, the first artifact is not a patch. It is shared understanding:
what Codex thinks the task is, what context it found, what assumptions it is
making, what risks it sees, and what sequence it proposes.

That is especially useful for teams because it creates a reviewable moment
before implementation. A human can approve the direction, correct an assumption,
or choose between options while the cost of changing course is still low.

## When To Use Plan Mode

Use Plan Mode when the work has meaningful uncertainty:

- large or sweeping repo changes
- architecture or data model decisions
- migrations and multi-step refactors
- changes that could affect many users or workflows
- security, permissions, deployment, or data-handling concerns
- a vague product idea that needs to become concrete
- a task where there are several plausible approaches
- a task where the human wants to compare options before implementation
- a goal that is hard to define up front

Use regular agent execution when the work is already clear:

- small, scoped fixes
- adding a known feature with clear acceptance criteria
- docs updates with a defined audience and source material
- UI changes where the desired behavior is specific
- test, lint, build, commit, or publish chores
- research-to-artifact work where the output format is already known

The difference is not task size alone. A small task can need planning if the
intent is ambiguous. A larger task can work fine in normal mode if the goal,
constraints, and verification path are clear.

## How To Prompt For It

A useful Plan Mode prompt asks Codex to shape the work, not just restate it.

Example:

```text
/plan I want to add this capability, but I am not sure about the best shape.
Inspect the repo, ask me clarifying questions if needed, identify the tradeoffs,
and propose a staged implementation plan before editing files.
```

Another pattern is to ask Codex to interview you:

```text
/plan Interview me until the goal, constraints, risks, and definition of done
are clear. Then summarize the plan and wait before implementation.
```

For longer-running work, Plan Mode can also prepare a goal. OpenAI's Codex
prompting docs recommend starting with `/plan` when a goal is hard to define up
front, then asking Codex to shape that goal before implementation.

## Evaluation Ideas

This lab can evaluate Plan Mode by checking whether it improves alignment
before implementation:

- Did Codex inspect relevant context before proposing a plan?
- Did it identify ambiguity instead of guessing silently?
- Did it ask useful clarifying questions?
- Did it present options when there were real tradeoffs?
- Did it name risks, affected areas, and verification steps?
- Did the plan become specific enough to implement?
- Did the final implementation match the approved plan?
- Did Plan Mode reduce rework compared with starting in normal agent mode?

The important comparison is not whether Plan Mode feels more thorough. The
question is whether it reduces wrong-direction work on tasks where the target
was unclear.

## Sources

- Codex best practices: https://developers.openai.com/codex/learn/best-practices
- Codex prompting guide: https://developers.openai.com/codex/prompting
- Codex CLI slash commands: https://developers.openai.com/codex/cli/slash-commands
- OpenAI Agents SDK guide: https://developers.openai.com/api/docs/guides/agents

## Working Principle

Use Plan Mode when the work needs shared understanding before action. Use normal
agent mode when the goal, constraints, and definition of done are already clear.
