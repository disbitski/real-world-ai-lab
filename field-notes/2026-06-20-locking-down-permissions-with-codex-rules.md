# Field Note: Locking Down Permissions With Codex Rules

Date: 2026-06-20

## Summary

Codex Rules are a way to make permission decisions durable. They let a team say
which command prefixes should be allowed, prompted for, or forbidden when Codex
needs to run something outside the normal sandbox boundary.

That distinction matters. Rules are not the model. They are not the sandbox.
They are not `AGENTS.md`. They are a policy layer around tool execution.

The practical lesson is simple: keep Codex inside a reasonable sandbox, use
approvals for judgment calls, and use rules for the stable permission decisions
that keep appearing again and again.

## Observation

In day-to-day Codex work, the same approval patterns start to repeat:

- checking Git state
- staging, committing, and pushing work
- reading GitHub issue or pull request metadata
- starting local servers
- probing localhost endpoints
- installing dependencies
- running commands that cross a network boundary
- touching files outside the current workspace

Some of those approvals are low-risk and mechanical. Some are context-dependent.
Some should be blocked unless a human deliberately steps outside the agent flow.

Codex Rules make those differences explicit. Instead of treating every approval
as a one-off decision, a rule can encode the team's default posture:

- allow commands that are safe and repetitive
- prompt for commands that need context
- forbid commands that are too risky for normal agent execution

That is especially useful in an "approve for me" workflow. Automatic approval
review can reduce friction, but it still has to evaluate prompts as they arrive.
Rules move the most stable decisions into a reviewable policy file.

## Sandbox Boundaries First

OpenAI's Codex docs describe sandboxing as a technical boundary around what
commands can access. The common modes are:

| Mode | Practical meaning |
| --- | --- |
| `read-only` | Codex can inspect files but not modify them or access the network without approval. |
| `workspace-write` | Codex can edit the current workspace and selected writable roots, with other access still constrained. |
| `danger-full-access` | Codex can act without the normal filesystem and network sandbox boundaries. |

So yes, in normal use Codex runs with a sandbox boundary. The exact boundary
depends on the configured sandbox mode. It is possible to remove that boundary
with `danger-full-access`, but that should be treated as an exceptional mode,
not the default for serious work.

The useful posture is to make the sandbox boring and predictable:

- keep most work in `workspace-write`
- keep network access intentional
- avoid broad filesystem access unless the task truly needs it
- use rules for specific exceptions instead of expanding the whole sandbox

That last point is the big one. If one command needs to cross a boundary often,
that does not mean the whole agent should get wider access.

## How The Permission Stack Fits Together

Codex permissions are easiest to reason about as layers:

| Layer | What it answers |
| --- | --- |
| Sandbox mode | What is technically reachable by default? |
| Approval policy | When must Codex ask before doing more? |
| Approval reviewer | Who reviews eligible approval requests: the user or automatic review? |
| Codex Rules | Which command prefixes should be allowed, prompted, or forbidden outside the sandbox? |
| `AGENTS.md` | What working guidance should the agent follow? |

`AGENTS.md` is guidance. Codex Rules are execution policy.

For example, `AGENTS.md` might say "run tests before finishing." A Codex Rule
can say whether a specific command prefix may run without another prompt. One
helps the agent understand the workflow. The other controls the permission
decision.

## When Rules Are Useful

Rules become useful when the team already knows the answer to a repeated
permission question.

Use rules for commands that fall into stable categories:

- read-only repo inspection that is always okay
- GitHub reads that are common but still cross auth and network boundaries
- local scripts that are safe within the workspace
- deployment, deletion, or secret-management commands that should always prompt
- destructive commands that should be forbidden in agent workflows

Rules are less useful when the decision depends heavily on the task. In that
case, keep the prompt. A human or automatic approval reviewer can evaluate the
specific context.

The key question is:

```text
Would we make the same decision about this command prefix almost every time?
```

If yes, it may deserve a rule. If no, leave it as an approval.

## A Small Example

Rules live in `.rules` files under a `rules/` directory next to an active Codex
config layer, such as:

```text
~/.codex/rules/default.rules
```

Project-local rules can live under a trusted project config layer:

```text
.codex/rules/project.rules
```

A small starter policy might look like this:

```python
# ~/.codex/rules/default.rules

prefix_rule(
    pattern = ["git", "status"],
    decision = "allow",
    justification = "Read-only repository state is safe to inspect.",
    match = ["git status --short"],
)

prefix_rule(
    pattern = ["gh", "pr", "view"],
    decision = "prompt",
    justification = "Reading PR data crosses network and auth boundaries.",
    match = ["gh pr view 123", "gh pr view --json title,body"],
)

prefix_rule(
    pattern = ["gh", "repo", "delete"],
    decision = "forbidden",
    justification = "Repository deletion should be done manually outside Codex.",
    match = ["gh repo delete owner/repo"],
)
```

The format is Starlark, a small Python-like configuration language. The
`pattern` is a command-prefix match, so narrow rules are better than broad
ones. A rule for `["gh", "pr", "view"]` is much safer than a rule for `["gh"]`.

OpenAI's docs also recommend testing rules with `codex execpolicy check`:

```sh
codex execpolicy check --pretty --rules ~/.codex/rules/default.rules -- gh pr view 123
```

The `match` and `not_match` examples inside a rule act like small unit tests.
That is a good habit because permission bugs are usually caused by a pattern
being broader than the author intended.

## What To Avoid

The dangerous version of rules is using them to recreate full access one prefix
at a time.

Avoid:

- broad allows like `["bash"]`, `["sh"]`, or `["zsh"]`
- broad allows like `["gh"]`, `["git"]`, `["npm"]`, or `["curl"]`
- allowing package installs without thinking about supply-chain risk
- allowing arbitrary network calls
- allowing secret reads, token writes, or credential configuration
- treating `danger-full-access` as a convenience setting
- writing rules without `match` or `not_match` examples
- using rules as a substitute for reviewing risky workflow design

Shell wrappers deserve extra care. Codex can split safe, simple shell scripts
and evaluate each command, but advanced shell features are treated more
conservatively. A narrow rule for the actual command is usually easier to
reason about than a broad rule for a shell invocation.

## A Practical Starting Policy

For a personal or small-team Codex setup, a good starting policy is:

- allow low-risk read-only commands that never leave the repo
- prompt for authenticated network reads
- prompt for writes to GitHub, package registries, cloud services, or production systems
- forbid deletion, credential exfiltration, repo destruction, and broad shell access
- keep `workspace-write` as the everyday sandbox mode
- reserve `danger-full-access` for rare sessions where the risk is understood

That keeps the default workflow fast without making the agent bigger than the
task requires.

## Evaluation Ideas

This lab can evaluate Codex Rules by watching whether they improve the workflow
without weakening the safety boundary:

- Which approval prompts repeat often enough to justify a rule?
- Did a rule reduce noise for low-risk commands?
- Did sensitive commands still prompt or fail closed?
- Does `codex execpolicy check` return the expected decision?
- Are the rule patterns narrow enough?
- Do all rules include `match` or `not_match` examples?
- Can another human understand each rule's justification?
- Did the team avoid widening the sandbox just to skip one recurring prompt?

The important signal is not "fewer prompts" by itself. The goal is fewer
uninteresting prompts while preserving prompts for the moments that need real
judgment.

## Sources

- OpenAI Codex Rules: https://developers.openai.com/codex/rules
- OpenAI Codex agent approvals and security: https://developers.openai.com/codex/agent-approvals-security
- OpenAI Codex sandboxing: https://developers.openai.com/codex/concepts/sandboxing
- OpenAI Codex permissions: https://developers.openai.com/codex/permissions

## Working Principle

Keep Codex bounded by default. Use rules for stable command decisions, approvals
for judgment calls, and sandbox expansion only when the task truly requires it.
