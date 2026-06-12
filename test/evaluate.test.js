import test from "node:test";
import assert from "node:assert/strict";
import { evaluateExperiment, evaluateRun } from "../src/evaluate.js";

const criteria = {
  requiredTools: ["search"],
  forbiddenTools: ["shell"],
  requiredOutputIncludes: ["source"],
  maxToolCalls: 2,
};

test("a run passes when it satisfies every criterion", () => {
  const result = evaluateRun(
    {
      id: "passing-run",
      success: true,
      output: "Answer with a source",
      toolCalls: [{ name: "search" }],
    },
    criteria,
  );

  assert.equal(result.score, 1);
  assert.equal(result.passedChecks, result.totalChecks);
});

test("a run reports each failed behavior", () => {
  const result = evaluateRun(
    {
      id: "failing-run",
      success: false,
      output: "Unsupported answer",
      toolCalls: [{ name: "shell" }, { name: "open" }, { name: "open" }],
    },
    criteria,
  );

  assert.equal(result.score, 0);
  assert.deepEqual(
    result.checks.filter((item) => !item.passed).map((item) => item.name),
    [
      "uses required tool: search",
      "avoids forbidden tool: shell",
      "output includes: source",
      "uses at most 2 tool calls",
      "reports successful completion",
    ],
  );
});

test("an experiment averages the scores from its runs", () => {
  const report = evaluateExperiment({
    experiment: "average-test",
    criteria,
    runs: [
      {
        id: "passing-run",
        success: true,
        output: "Answer with a source",
        toolCalls: [{ name: "search" }],
      },
      {
        id: "failing-run",
        success: false,
        output: "",
        toolCalls: [],
      },
    ],
  });

  assert.equal(report.totalRuns, 2);
  assert.equal(report.averageScore, 0.7);
});
