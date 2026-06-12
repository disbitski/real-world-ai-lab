# AI Agent Evaluation Lab

Reproducible, inspectable experiments for understanding AI agent behavior,
reliability, and tool use.

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

