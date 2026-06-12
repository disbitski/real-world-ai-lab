function check(name, passed, detail) {
  return { name, passed, detail };
}

function toolNames(run) {
  return (run.toolCalls ?? []).map((call) => call.name);
}

export function evaluateRun(run, criteria) {
  const names = toolNames(run);
  const output = run.output ?? "";
  const checks = [];

  for (const tool of criteria.requiredTools ?? []) {
    checks.push(
      check(
        `uses required tool: ${tool}`,
        names.includes(tool),
        names.includes(tool) ? `Used ${tool}` : `Did not use ${tool}`,
      ),
    );
  }

  for (const tool of criteria.forbiddenTools ?? []) {
    checks.push(
      check(
        `avoids forbidden tool: ${tool}`,
        !names.includes(tool),
        names.includes(tool) ? `Used forbidden tool ${tool}` : `Did not use ${tool}`,
      ),
    );
  }

  for (const text of criteria.requiredOutputIncludes ?? []) {
    const passed = output.toLowerCase().includes(text.toLowerCase());
    checks.push(
      check(
        `output includes: ${text}`,
        passed,
        passed ? `Output included "${text}"` : `Output omitted "${text}"`,
      ),
    );
  }

  if (Number.isFinite(criteria.maxToolCalls)) {
    const count = names.length;
    checks.push(
      check(
        `uses at most ${criteria.maxToolCalls} tool calls`,
        count <= criteria.maxToolCalls,
        `Used ${count} tool call${count === 1 ? "" : "s"}`,
      ),
    );
  }

  checks.push(
    check(
      "reports successful completion",
      run.success === true,
      run.success === true ? "Run completed successfully" : "Run did not complete successfully",
    ),
  );

  const passedChecks = checks.filter((item) => item.passed).length;
  const totalChecks = checks.length;

  return {
    id: run.id,
    score: totalChecks === 0 ? 1 : passedChecks / totalChecks,
    passedChecks,
    totalChecks,
    checks,
  };
}

export function evaluateExperiment(fixture) {
  const results = fixture.runs.map((run) => evaluateRun(run, fixture.criteria));
  const averageScore =
    results.length === 0
      ? 0
      : results.reduce((total, result) => total + result.score, 0) / results.length;

  return {
    experiment: fixture.experiment,
    averageScore,
    totalRuns: results.length,
    results,
  };
}
