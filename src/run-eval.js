import { readFile } from "node:fs/promises";
import { evaluateExperiment } from "./evaluate.js";

const fixturePath = process.argv[2];

if (!fixturePath) {
  console.error("Usage: node src/run-eval.js <fixture.json>");
  process.exitCode = 1;
} else {
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  const report = evaluateExperiment(fixture);

  console.log(`\n${report.experiment}`);
  console.log(`Average score: ${(report.averageScore * 100).toFixed(0)}%`);
  console.log(`Runs evaluated: ${report.totalRuns}\n`);

  for (const result of report.results) {
    console.log(`${result.id}: ${(result.score * 100).toFixed(0)}%`);
    for (const item of result.checks) {
      console.log(`  ${item.passed ? "PASS" : "FAIL"}  ${item.name} - ${item.detail}`);
    }
    console.log();
  }
}
