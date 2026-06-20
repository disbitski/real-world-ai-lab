# Field Note: config.toml Is The Harness Environment

Date: 2026-06-20

## Summary

`config.toml` is the final harness-environment layer for Codex. `AGENTS.md`
guides behavior, rules constrain command decisions, and config wires the actual
defaults for model, sandboxing, approvals, tools, MCP, and project trust.

That makes `config.toml` different from a prompt. A prompt tells Codex what to
do now. `AGENTS.md` tells Codex how work normally happens in a repo. Rules tell
Codex which command prefixes should be allowed, prompted, or forbidden. But
`config.toml` decides the operating environment Codex starts with before the
task even begins.

The practical lesson is to treat config as harness wiring, not as a dumping
ground for every preference. Put stable execution defaults there. Put project
working agreements in `AGENTS.md`. Put task-specific intent in the prompt.

## Observation

The most confusing part of Codex configuration is that it looks like "settings,"
but in practice it shapes the whole agent harness.

Small changes can create very different behavior:

- a different default model changes cost, speed, and reasoning quality
- a different sandbox mode changes what commands can touch
- a different approval policy changes when Codex pauses
- `approvals_reviewer = "auto_review"` changes who reviews eligible approvals
- MCP servers add tools and private or live context
- shell environment policy changes which environment variables subprocesses see
- project trust controls whether repo-local `.codex/` layers load at all

That is why two people can use the same model and get different Codex
experiences. The model is only one part of the system. The harness around the
model decides what context it sees, what tools it can use, what it can execute,
and how much friction exists around risky actions.

## Why It Matters

Good config turns a powerful coding agent into a predictable teammate.

Without clear config, every session has to rediscover the same operating
posture: which model to use, whether the workspace is writable, whether network
access should be available, whether approvals are manual or automatically
reviewed, and which MCP tools should be loaded.

With clear config, the defaults match the work:

- everyday development can use a bounded workspace-write setup
- research sessions can enable the right MCP servers
- review sessions can use higher reasoning effort
- sensitive repos can deny broad filesystem or network access
- project-specific settings can live beside the repo instead of in memory

The key is not to make Codex more permissive by default. The key is to make the
boundary intentional.

## How Codex Loads config.toml

OpenAI's Codex docs describe a layered configuration model. Highest precedence
wins:

| Precedence | Layer | Use it for |
| --- | --- | --- |
| 1 | CLI flags and `--config` overrides | One-off changes for a single run |
| 2 | Project `.codex/config.toml` | Trusted repo or subfolder defaults |
| 3 | Profile files selected with `--profile` | Named operating modes |
| 4 | User `~/.codex/config.toml` | Personal defaults across repos |
| 5 | System `/etc/codex/config.toml` | Machine or organization defaults |
| 6 | Built-in defaults | Codex fallback behavior |

Project config is trust-gated. If a project is untrusted, Codex skips project
`.codex/` layers, including project config, project hooks, and project rules.
User and system layers still load.

That trust boundary is important. A repo should not be able to silently redirect
credentials, change provider auth, or run machine-local notification commands
just by adding a `.codex/config.toml`. OpenAI's docs call out several keys that
project-local config cannot override, including provider/auth-related settings
such as `openai_base_url`, `model_provider`, `model_providers`, `notify`,
`profile`, `profiles`, and telemetry-related `otel` settings.

## What Belongs Where

The useful mental model is to separate scope:

| Surface | Best use |
| --- | --- |
| Prompt | One-off task goal, constraints, and definition of done |
| `AGENTS.md` | Durable repo guidance, commands, style, and review expectations |
| `~/.codex/config.toml` | Personal defaults across repos |
| `.codex/config.toml` | Trusted project-specific Codex settings |
| Profile file | Alternate mode such as deep review or CI |
| Rules | Durable allow, prompt, or forbid decisions for command prefixes |
| Hooks | Mechanical checks around tool calls or lifecycle events |
| MCP config | Extra tools and context sources Codex can use |

This prevents a common mistake: putting everything into one file because it is
available. Good harness design keeps guidance, policy, and environment wiring
separate.

## A Practical User Config

This is a conservative everyday `~/.codex/config.toml` shape for local Codex
work. It keeps Codex productive in the workspace, routes eligible approvals
through automatic review, avoids live web by default, and keeps network access
inside the command sandbox disabled unless a task asks for it.

```toml
# ~/.codex/config.toml

model = "gpt-5.5"
model_reasoning_effort = "high"
personality = "friendly"

approval_policy = "on-request"
approvals_reviewer = "auto_review"
sandbox_mode = "workspace-write"
web_search = "cached"

[sandbox_workspace_write]
network_access = false
writable_roots = []
exclude_tmpdir_env_var = false
exclude_slash_tmp = false

[shell_environment_policy]
inherit = "core"
ignore_default_excludes = false
include_only = ["PATH", "HOME", "TMPDIR", "SHELL"]

[features]
hooks = true
multi_agent = true
shell_snapshot = true
```

Adapt this by changing the model, reasoning effort, and approval reviewer to
match the workflow. Keep network access and extra writable roots narrow.

## A Practical Project Config

Project config belongs in a trusted repo under `.codex/config.toml`. Use it for
settings that should travel with the repo, not for personal credentials or
provider routing.

```toml
# .codex/config.toml

model_reasoning_effort = "high"
project_doc_max_bytes = 32768
project_doc_fallback_filenames = ["CONTRIBUTING.md"]
project_root_markers = [".git"]

approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = false
writable_roots = []

[mcp_servers.project_docs]
enabled = true
required = false
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
startup_timeout_sec = 20
tool_timeout_sec = 60
default_tools_approval_mode = "prompt"
```

Adapt this only after the project is trusted. Keep provider auth, notification,
telemetry, and machine-specific credentials in user or managed config.

## Profiles Are Named Modes

Profiles are useful when the same person wants multiple repeatable operating
modes. OpenAI's docs describe profile files as separate TOML files under
`~/.codex/`, selected with `--profile`.

For example, a deep review profile can keep the normal user config intact while
raising reasoning effort for review work:

```toml
# ~/.codex/deep-review.config.toml

model = "gpt-5.5"
model_reasoning_effort = "xhigh"
approval_policy = "on-request"
sandbox_mode = "read-only"
```

Run it with:

```sh
codex --profile deep-review
codex exec --profile deep-review "review this diff for correctness risks"
```

That is cleaner than constantly editing `~/.codex/config.toml`.

## Permissions Versus Sandbox Settings

Codex has older sandbox settings such as `sandbox_mode` and
`[sandbox_workspace_write]`. It also has beta permission profiles that can
describe filesystem and network access together.

The important rule from OpenAI's permissions docs is: use one system or the
other for a session. Do not mix `default_permissions` / `[permissions]` with
`sandbox_mode` / `[sandbox_workspace_write]`.

A permission-profile version of a workspace-edit posture might look like this:

```toml
default_permissions = "project-edit"

[permissions.project-edit.filesystem]
":minimal" = "read"

[permissions.project-edit.filesystem.":workspace_roots"]
"." = "write"
"**/*.env" = "deny"

[permissions.project-edit.network]
enabled = true
allow_local_binding = false

[permissions.project-edit.network.domains]
"api.openai.com" = "allow"
"localhost" = "deny"
```

Adapt this carefully. The useful part is least privilege: write where Codex
needs to work, deny sensitive files, and allow only the network destinations the
workflow actually needs.

## MCP Is Harness Capability

MCP servers are also configured in `config.toml`. This matters because MCP
changes what Codex can know and do. A docs MCP, browser MCP, Figma MCP, or
GitHub MCP can radically change task performance even when the model stays the
same.

The practical questions are:

- Should this MCP server be global or project-local?
- Does it expose tools that should prompt before use?
- Should startup fail if the server is unavailable?
- Which tools should be enabled or disabled?
- Which secrets, if any, should be forwarded through environment variables?

MCP is one of the clearest examples of harness power. It gives the model better
tools, but `config.toml` decides whether those tools are present and how they
are governed.

## What To Avoid

Avoid treating `config.toml` as a convenience override for everything.

Be careful with:

- `sandbox_mode = "danger-full-access"` as a default
- broad `writable_roots`
- `network_access = true` without a reason
- forwarding secret-heavy environment variables
- project config that tries to control provider auth or credential routing
- mixing beta permission profiles with older sandbox settings
- adding MCP servers globally when only one repo needs them
- storing private tokens directly in config
- changing model and sandbox settings together without noting why

If a setting changes risk, it should be visible in review.

## Evaluation Ideas

This lab can evaluate `config.toml` quality by checking observable behavior:

- Did Codex load the expected user, profile, and project config layers?
- Does project config load only after project trust?
- Are one-off overrides limited to the current run?
- Does the default sandbox match the workflow risk?
- Are approval prompts reduced without removing important judgment points?
- Are MCP servers scoped to the work that needs them?
- Are secrets excluded from spawned command environments?
- Are network and writable roots narrower than the whole machine?
- Can another builder explain why each non-default setting exists?

The goal is not a fancy config. The goal is a boring, inspectable environment
that makes good agent behavior repeatable.

## Sources

- OpenAI Codex config basics: https://developers.openai.com/codex/config-basic
- OpenAI Codex advanced config: https://developers.openai.com/codex/config-advanced
- OpenAI Codex config reference: https://developers.openai.com/codex/config-reference
- OpenAI Codex permissions: https://developers.openai.com/codex/permissions
- OpenAI Codex MCP: https://developers.openai.com/codex/mcp

## Working Principle

Use `config.toml` to wire the harness environment. Keep the model, tools,
approvals, sandbox, MCP, and trust posture explicit enough that another builder
can reproduce the same Codex behavior.
