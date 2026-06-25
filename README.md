# Real World AI Lab

Notes from the trenches, practical research, and reproducible experiments for
understanding AI agents, Codex workflows, and human-AI collaboration.

This lab is a place to turn hands-on AI work into something useful for other
builders: inspectable evaluations, thoughtful notes from real workflows, and
clear ideas about where agents create value when humans, tools, and process work
together.

## Field Notes

Short journal-style notes from hands-on AI workflow experiments:

### Mindset & Collaboration

- [AI Is A Collaboration Layer, Not A Replacement Worker](field-notes/2026-06-18-human-ai-interaction.md)
- [Workflows Are Where Codex Gets Powerful](field-notes/2026-06-18-codex-workflows.md)
- [When Plan Mode Is Useful](field-notes/2026-06-20-when-plan-mode-is-useful.md)
- [Loops Are The New Prompt Surface](field-notes/2026-06-21-agentic-loops.md)

### Context & Knowledge

- [Claude Code Shortcuts Are Context Steering](field-notes/2026-06-23-claude-code-context-shortcuts.md)
- [RAG Is Context Work](field-notes/2026-06-23-rag-is-context-work.md)
- [Reading Model Cards Without Getting Lost](field-notes/2026-06-19-model-context-output-reasoning.md)

### Agent Harness & Operating Environment

- [Custom Agent Statuslines Make The Terminal Feel Alive](field-notes/2026-06-23-custom-agent-statuslines.md)
- [The Harness Is Not The Model](field-notes/2026-06-20-agent-harnesses.md)
- [Subagents Keep The Main Thread Clean](field-notes/2026-06-25-subagents-keep-the-main-thread-clean.md)
- [MCP Is The Tool Layer](field-notes/2026-06-23-mcp-is-the-tool-layer.md)
- [config.toml Is The Harness Environment](field-notes/2026-06-20-config-toml-harness-environment.md)
- [Locking Down Permissions With Codex Rules](field-notes/2026-06-20-locking-down-permissions-with-codex-rules.md)

### Reusable Agent Instructions

- [AGENTS.md Is A README For Agents](field-notes/2026-06-20-agents-md-readme-for-agents.md)
- [Skill Discovery Is Part Of The Workflow](field-notes/2026-06-19-codex-skill-discovery.md)

## First Experiment: Tool-Use Reliability

My ongoing AI experiments lab starts with a deliberately simple evaluator: give it recorded agent
runs and explicit criteria, then receive a scorecard showing which behaviors
passed and why. Keeping the first evaluator deterministic makes it easy to
understand before adding model-based judges.

The sample fixture evaluates whether an agent:

- Uses a required tool
- Avoids a forbidden tool
- Produces required output text
- Stays within a tool-call budget
- Completes the task successfully

Run the sample evaluation:

```sh
npm run eval:sample
```

Run the tests:

```sh
npm test
```

## Fixture Format

Each JSON fixture contains an experiment name, evaluation criteria, and one or
more recorded runs:

```json
{
  "experiment": "tool-use-baseline",
  "criteria": {
    "requiredTools": ["search"],
    "forbiddenTools": ["shell"],
    "requiredOutputIncludes": ["source"],
    "maxToolCalls": 3
  },
  "runs": [
    {
      "id": "run-001",
      "success": true,
      "output": "Answer with source",
      "toolCalls": [{ "name": "search" }]
    }
  ]
}
```

## Principles

- Prefer reproducible evaluations over vibes.
- Keep criteria visible and version controlled.
- Record failures, not just aggregate scores.
- Separate deterministic checks from model-based judgments.
- Treat an evaluation as evidence, not absolute truth.

## Roadmap

- Add JSON Schema validation for fixtures
- Compare multiple agent configurations
- Export Markdown and JSON reports
- Add latency and cost measurements
- Explore model-based judges and judge agreement
