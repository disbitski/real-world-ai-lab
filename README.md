# Real World AI Lab

Notes from the trenches, practical research, and reproducible experiments for
understanding AI agents, Codex workflows, and human-AI collaboration.

This lab is a place to turn hands-on AI work into something useful for other
builders: inspectable evaluations, thoughtful notes from real workflows, and
clear ideas about where agents create value when humans, tools, and process work
together.

## Field Notes

Short journal-style notes from hands-on AI workflow experiments:

- [Workflows Are Where Codex Gets Powerful](field-notes/2026-06-18-codex-workflows.md)
- [AI Is A Collaboration Layer, Not A Replacement Worker](field-notes/2026-06-18-human-ai-interaction.md)
- [Reading Model Cards Without Getting Lost](field-notes/2026-06-19-model-context-output-reasoning.md)
- [Skill Discovery Is Part Of The Workflow](field-notes/2026-06-19-codex-skill-discovery.md)

The lab starts with a deliberately simple evaluator: give it recorded agent
runs and explicit criteria, then receive a scorecard showing which behaviors
passed and why. Keeping the first evaluator deterministic makes it easy to
understand before adding model-based judges.

## First Experiment: Tool-Use Reliability

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
