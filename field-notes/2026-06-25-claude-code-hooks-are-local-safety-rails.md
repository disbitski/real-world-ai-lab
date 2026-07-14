# Field Note: Claude Code Hooks Are Local Safety Rails

Date: 2026-06-25

![Editorial photograph of a compact tool carriage moving through three connected amber safety checkpoints on a desktop rail beside a developer laptop.](assets/2026-06-25-claude-code-hooks-are-local-safety-rails/hero.webp)

## Summary

I am doing more agent work on my Mac Studio M4 Max with 48GB of memory, and the
more capable the workflows get, the more often the agent wants to reach into my
real local environment.

That is useful. It is also exactly where I want stronger guardrails.

When I am building my RPG game in `disbitski/embermere-rpg`, the work can touch
Unity, local assets, project files, generated builds, and repo tooling. When I
am running daily agentic finance workflows like
`disbitski/codex-autonomous-finance-agent-robinhood-mcp`, the work can get
closer to local financial data. Claude Code hooks give me a way to put
deterministic checks in front of that local action before the tool call runs.

The practical lesson for me: once an agent is operating on my actual machine,
instructions are not enough. I need local safety rails that can stop a bad move
before I get tempted to approve it.

## Observation

As I used Claude Code more, and as Codex and I worked through more GPT-powered
local workflows, I found myself leaving the tidy sandbox more often. That is
the natural direction of agent work. At first the agent edits files in one repo.
Then it needs a local asset. Then it needs Unity open. Then it needs an MCP
server. Then it needs a CSV, an export, a generated build, or a folder I forgot
was sitting nearby.

The risk is not only that the model might do something strange. The risk is
that I might be moving fast, say yes to a permission prompt, and only later
realize I let the agent touch something it never needed.

Hooks help because they move some decisions out of the moment. Instead of
trusting myself to catch every risky action while I am in flow, I can define a
rule ahead of time:

- do not read this financial folder
- do not edit this asset directory
- do not run this app-control command
- do not call this MCP write tool
- do not continue if a command looks like it will exfiltrate secrets

That is a different kind of safety. It is not "Claude, please be careful." It
is "before this tool runs, execute my policy."

## Why It Matters

Local agents are powerful because they can use the same machine I use. They can
read files, run tests, start tools, call MCP servers, and interact with real
project state. That is the whole point.

But my personal computer is not only a dev container. It is also where I have
creative assets, financial workflows, local app state, credentials, exports,
experiments, downloads, and half-finished ideas. The more I let agents act
there, the more I need layered boundaries.

The useful mental model is:

| Layer | What it protects |
| --- | --- |
| Sandbox | What the agent can technically reach by default |
| Permissions | What requires approval or is denied |
| Hooks | What custom checks run at lifecycle points |
| MCP allowlists | Which external tools are available |
| Human review | Whether the final action still makes sense |

Hooks sit in the middle. They are not a replacement for sandboxing or
permissions. They are the custom local logic I can add when the default
boundary is too broad for my actual life.

## How Claude Code Hooks Work

Anthropic describes Claude Code hooks as user-defined commands, HTTP endpoints,
MCP tool calls, prompt checks, or agent checks that run at specific points in
the Claude Code lifecycle. The most important event for my use case is
`PreToolUse`, because it fires before a tool call executes and can block it.

Hooks are configured in Claude Code settings, including user-level
`~/.claude/settings.json`, project-level `.claude/settings.json`, local
`.claude/settings.local.json`, managed organization settings, plugins, skills,
and agents. Claude Code also has a `/hooks` browser so I can inspect which
hooks are active.

The event model is bigger than just `PreToolUse`:

- `UserPromptSubmit` can inspect a prompt before Claude processes it.
- `PreToolUse` can inspect or block a proposed action before a tool runs.
- `PermissionRequest` can handle permission prompts.
- `PostToolUse` can inspect or react after a successful tool call.
- `ConfigChange` can audit or block settings changes.
- `SubagentStart` and `SubagentStop` can track delegated work.
- `Stop` can run checks when Claude finishes a turn.

That means hooks can enforce rules, notify me, format files, log activity,
reload environment state, validate MCP tool calls, or add a final stop-time
check. The key is to keep deterministic rules deterministic. If a decision
requires judgment, Anthropic documents prompt-based and agent-based hooks too,
but those are a different tradeoff because they bring another model decision
into the path.

## A Small Local Safety Hook

For my setup, I would start with a narrow `PreToolUse` hook that blocks local
financial paths and app-control commands I do not want Claude to touch by
accident.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Read|Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/local-safety.sh",
            "timeout": 10,
            "statusMessage": "Checking local safety policy"
          }
        ]
      }
    ]
  }
}
```

```bash
#!/bin/bash
# .claude/hooks/local-safety.sh

set -euo pipefail

INPUT="$(cat)"
TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')"
COMMAND="$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')"
FILE_PATH="$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')"

deny() {
  printf '%s\n' "$1" >&2
  exit 2
}

case "$FILE_PATH" in
  "$HOME"/Finance/*|"$HOME"/Documents/Financial/*)
    deny "Blocked: this local financial path is outside my Claude Code work boundary."
    ;;
  *../*)
    deny "Blocked: path traversal is not allowed in this workflow."
    ;;
esac

case "$COMMAND" in
  *"open -a Unity"*|*"osascript"*|*"rm -rf "*|*"curl "*)
    deny "Blocked: this command needs a narrower manual workflow before Claude can run it."
    ;;
esac

exit 0
```

This is not a universal hook. It is a pattern. I would adapt the protected
paths, app commands, and MCP tool names for each machine and repo.

For a project like `embermere-rpg`, I might block generated Unity folders,
asset store imports, or broad app-control commands until I intentionally open
that workflow. For finance automation, I would keep private exports and
brokerage-related local files outside the default agent path unless a specific
read-only workflow needs them.

The important detail is that exit code `2` blocks the action and sends the
reason back to Claude. Exit code `0` does not auto-approve the action; it just
means the hook did not object and the normal permission flow continues.

## What I Should Be Careful About

Hooks are powerful because they run locally. That is also their risk.

Anthropic's hook docs are direct about this: command hooks run with my system
user permissions. A sloppy hook can read, modify, or delete anything my account
can access. So the hook itself needs the same care I expect from any local
automation:

- validate and sanitize JSON input
- quote shell variables
- block path traversal
- prefer absolute paths
- keep sensitive files out of scope
- test hooks before relying on them
- use `/hooks` and `/permissions` to audit what is active

There is also a design lesson: for static rules like "never read `.env`" or
"never use `curl`," Claude Code permissions are often the cleaner first layer.
Hooks are best when the rule needs local logic: path matching, command
inspection, logging, context-aware blocking, or integration with another tool.

That same pattern shows up in Codex. OpenAI's Codex docs describe hooks as a
way to inject scripts into the agentic loop, while sandboxing and approvals
remain the main safety boundary. Codex also requires non-managed command hooks
to be reviewed and trusted before they run. The product shapes differ, but the
principle is the same: lifecycle hooks are part of the harness, not a magic
substitute for a narrow sandbox.

xAI's public docs frame the adjacent problem through tool control rather than
Claude-style local hooks. Grok function calling lets the model request a tool
call while the developer executes it locally and returns the result. xAI Remote
MCP tools include an `allowed_tools` option so only specific MCP tools are
available from a server. That is the broader agent pattern: expose fewer tools,
gate the risky ones, and keep the execution boundary explicit.

## Evaluation Ideas

This lab can evaluate hook workflows by testing whether they actually stop the
bad move before the agent acts:

- Does `PreToolUse` block protected local paths before any read or write?
- Does the hook block risky app-control commands without blocking normal tests?
- Does the hook return a clear reason Claude can recover from?
- Does exit code `0` still preserve the normal permission flow?
- Are static deny rules handled in permissions instead of overcomplicated
  scripts?
- Are hook scripts executable, versioned where appropriate, and easy to audit?
- Does `/hooks` show the expected source, matcher, event, and command?
- Do finance and personal-data workflows fail closed when paths are ambiguous?
- Does the same policy still work when Claude starts from a subdirectory?

For my own machine, the benchmark is not only whether the agent completes the
task. It is whether the agent completes the task without touching folders,
apps, MCP tools, or local data that were outside the intended workflow.

## Sources

- My Claude Code and Codex local workflow notes on RPG development, Unity assets, and agentic finance workflows, 2026-06-25.
- Anthropic Claude Code, "Automate actions with hooks": https://code.claude.com/docs/en/hooks-guide
- Anthropic Claude Code, "Hooks reference": https://code.claude.com/docs/en/hooks
- Anthropic Claude Code, "Settings": https://code.claude.com/docs/en/settings
- Anthropic Claude Code, "Security": https://code.claude.com/docs/en/security
- OpenAI Codex, "Hooks": https://developers.openai.com/codex/hooks
- OpenAI Codex, "Agent approvals & security": https://developers.openai.com/codex/agent-approvals-security
- xAI Docs, "Function Calling": https://docs.x.ai/developers/tools/function-calling
- xAI Docs, "Remote MCP Tools": https://docs.x.ai/developers/tools/remote-mcp

## Working Principle

I should use hooks for local safety rules I want enforced before the agent acts,
especially when my work crosses from a repo into real apps, assets, private
files, or financial data.
