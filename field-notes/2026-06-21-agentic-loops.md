# Field Note: Loops Are The New Prompt Surface

Date: 2026-06-21

## Summary

I am starting to think that the most important thing I am learning with Codex
is not how to write better one-off prompts. It is how to design better loops.

When I work with Codex, I usually do not arrive with a perfect prompt. I arrive
with an idea, a direction, a source, a repo, or a half-formed workflow. Codex
and I turn that into a loop: gather context, make a plan, act, verify, revise,
and keep going until there is something useful enough to commit, publish, or
evaluate.

That changes the job. I am not trying to type every next instruction. I am
trying to shape the goal, constraints, checks, judgment points, and stopping
conditions that let the agent keep moving without drifting away from what I
actually meant.

## Observation

The X article that prompted this note framed the old way of using AI as a slow
manual cycle: type a request, wait, fix it, ask again. The useful framework in
the thread was the loop shape: discover, plan, execute, verify, iterate. The
weaker part was the product pitch near the end, so I am treating the thread as
a prompt for the idea, not as proof that any particular product is the answer.

The same idea shows up in the current coding-agent conversation. Peter
Steinberger's line about designing loops that prompt agents helped name what I
have already been feeling in practice. Related coverage of Boris Cherny's
Claude Code workflow points in the same direction: persistent sessions,
subagents, and recurring work make these tools feel less like chatbots and more
like always-on development systems.

OpenAI's agent documentation also supports this from the technology side. The
Agents SDK describes a run as a loop: call the model, inspect the output,
execute tools or hand off to another specialist, and continue until the run
reaches a real stopping point. Codex documentation says Codex works in a loop
too: it calls the model, performs actions such as file reads, edits, and tool
calls, and stops when the task is complete or canceled.

The important realization for me is that a good Codex session is already more
than a prompt. It is a goal-directed loop with tools, state, permissions,
review, and verification.

## Why It Matters

Prompt engineering focuses attention on the instruction. Loop engineering
focuses attention on the operating system around the instruction.

That distinction matters because long-running agent work fails in predictable
places:

- the goal is vague
- the loop has no stopping condition
- the agent cannot verify its own work
- the same model grades its own output too generously
- context fills with logs, diffs, and intermediate noise
- tool permissions are too broad or too narrow
- the loop keeps spending tokens after the useful work is done

Better prompts help, but they do not solve those problems by themselves. The
loop is where I can make the work more reliable.

## What I Think A Loop Needs

When Codex and I work well together, the loop has a few visible parts:

| Part | Question I need answered |
| --- | --- |
| Goal | What outcome am I asking the loop to pursue? |
| Context | What files, sources, tools, or prior decisions should it use? |
| Action | What work may Codex perform on each pass? |
| Check | How will we know whether the pass improved the result? |
| State | What should persist into the next pass? |
| Boundary | What requires approval, escalation, or a human decision? |
| Stop condition | When should the loop end? |
| Evidence | What trace, diff, test output, or note proves what happened? |

This is the difference between asking Codex to "write me a field note" and
asking it to "run the field-note publishing loop until the note is sourced,
verified, linked from the README, committed, and ready to publish."

## When I Should Not Loop

The strongest part of the X thread was its warning that most tasks do not need
the heavy version of loop engineering.

I should formalize a loop only when these conditions are mostly true:

- The task repeats often enough that setup cost pays back.
- Bad output can be rejected automatically by a test, build, linter, type
  checker, hard rule, or explicit rubric.
- The agent can do the work end to end with available tools and permissions.
- "Done" is objective enough that the loop can stop without guessing.

If those are missing, I should keep the work as a manual prompt or a
collaborative Codex session. A loop without a verifier, state, and stop
condition is just an agent spending time more confidently.

## A Small Loop Spec

One thing I want to do more often is write down small Markdown loop specs before
turning a repeated workflow into a skill or automation.

```md
# Loop: Field Note From A Rough Idea

## Goal
Turn my rough workflow insight into a concise Real World AI Lab field note.

## Inputs
- My idea or source link
- Existing field notes for tone and structure
- Current official docs when product claims are involved

## Cycle
1. Inspect existing notes and repo state.
2. Research only the sources needed to ground the idea.
3. Draft the note from my perspective, with summary, observation, why it
   matters, evaluation ideas, sources, and working principle.
4. Add a concrete example when the note describes reusable config, docs, or
   workflow artifacts.
5. Run repo verification.
6. Review the diff for unsupported claims and formatting drift.

## Stop When
- The note is added under `field-notes/`.
- `README.md` links to it.
- Verification has passed or the remaining risk is explicit.
- The commit is ready to push.

## Escalate When
- A source is inaccessible and the exact wording matters.
- The loop would publish a claim that is not grounded.
- Verification requires credentials or permissions not available in the repo.
```

This is not a giant prompt. It is a compact contract for how I want the loop to
behave. Once it works repeatedly, it can move into a skill, automation, or
repo-level instruction file.

## What Codex And I Can Do Better

First, I should name the loop. "Write a field note" is a task. "Run the
field-note publishing loop" is an operating mode with expected steps, checks,
and a definition of done.

Second, I should make stop conditions explicit. A loop should know when to
stop, when to ask, and when to keep going. "Continue until useful" is weaker
than "continue until tests pass, the README is updated, the diff is reviewed,
and unsupported claims are removed."

Third, I should separate maker and reviewer roles when the risk is high enough.
Codex subagents are useful for read-heavy parallel work such as research,
test-gap review, security review, and summarization. They cost more tokens, so
I should use them where a second pass is worth paying for.

Fourth, I should keep the main thread clean. Exploration logs, failed commands,
and raw research can bury the actual decisions. Subagents, summaries, notes,
and compact loop specs help keep the main thread focused on requirements,
decisions, and final artifacts.

Fifth, I should turn repeated friction into durable guidance. When I give the
same reminder twice, it probably belongs in `AGENTS.md`, a skill, a hook, an
automation prompt, or an evaluator.

## Technology Perspective

The technical side matters because loops are not only a prompting style. They
are a systems design problem.

OpenAI's current docs expose several layers that make loops practical:

- The Agents SDK gives application developers an explicit agent loop, state
  strategies, handoffs, guardrails, tracing, and evals.
- Codex exposes the coding loop in a developer workspace, with file access,
  shell commands, patches, review surfaces, sandboxing, approvals, and resumable
  threads.
- Skills package repeatable workflows so the loop does not depend on me
  retyping the same process.
- Automations provide scheduled wake-ups for loops that should run again later.
- Subagents move bounded work out of the main thread and return distilled
  summaries.
- Hooks can inject deterministic checks into the agentic loop, such as logging,
  prompt scanning, validation, and stop-time enforcement.

The practical lesson for me is that state, tools, permissions, observability,
cost, and evaluation all shape whether a loop produces trustworthy work.

## Evaluation Ideas

I can evaluate loops with criteria that are visible in traces and diffs:

- Did the loop preserve my actual goal across iterations?
- Did it inspect the right context before acting?
- Did it use tools and sources appropriate to the task?
- Did it keep a bounded token, time, or cadence budget?
- Did it separate drafting from review when quality mattered?
- Did it run the expected verification step?
- Did it stop at the right time instead of drifting into extra work?
- Did it leave enough evidence for me to audit the result?

For stronger tests, I can compare two versions of the same workflow: one as an
ad hoc prompt and one as a written loop spec or skill. I should score not only
the final artifact, but also the process: tool use, unsupported claims, retries,
verification, cost, and reviewability.

## Sources

- Anatoli Kopadze X article pointer, "Loops explained: Claude, GPT, Mira and what actually works": https://x.com/anatolikopadze/status/2068328135611822149
- Business Insider, "Forget prompt engineering: 'Loop engineering' is all the rage now": https://www.businessinsider.com/what-are-loops-ai-engineering-tips-2026-6
- Business Insider, "Claude Code's creator says his setup involves thousands of AI sub-agents doing 'deeper work' overnight": https://www.businessinsider.com/anthropic-engineer-claude-boris-cherny-ai-agent-use-overnight-2026-5
- OpenAI Agents SDK, "Running agents": https://developers.openai.com/api/docs/guides/agents/running-agents
- OpenAI Agents SDK, "Orchestration and handoffs": https://developers.openai.com/api/docs/guides/agents/orchestration
- OpenAI Agents SDK, "Evaluate agent workflows": https://developers.openai.com/api/docs/guides/agent-evals
- OpenAI Codex, "Best practices": https://developers.openai.com/codex/learn/best-practices
- OpenAI Codex, "Automations": https://developers.openai.com/codex/app/automations
- OpenAI Codex, "Agent Skills": https://developers.openai.com/codex/skills
- OpenAI Codex, "Subagents": https://developers.openai.com/codex/concepts/subagents
- OpenAI Codex, "Hooks": https://developers.openai.com/codex/hooks

## Working Principle

Do not just prompt the agent. Design the loop that tells Codex how to keep
working, how to check itself, and when to stop.
