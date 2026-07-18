import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const notesDirectory = join(repoRoot, "field-notes");
const quotePairs = new Map([
  ['"', '"'],
  ["'", "'"],
  ["“", "”"],
  ["‘", "’"],
]);

function quotedLinkLabels(markdown) {
  const links = /(?<!!)\[([^\]\n]+)\]\(([^)\n]+)\)/gu;
  const matches = [];

  for (const match of markdown.matchAll(links)) {
    const label = match[1];
    const expectedClose = quotePairs.get(label.at(0));
    if (expectedClose && label.at(-1) === expectedClose) {
      matches.push({
        label,
        line: markdown.slice(0, match.index).split("\n").length,
      });
    }
  }

  return matches;
}

test("field-note Markdown link labels are never wrapped in quotation marks", () => {
  const failures = [];
  const notes = readdirSync(notesDirectory)
    .filter((name) => name.endsWith(".md"))
    .sort();

  for (const note of notes) {
    const markdown = readFileSync(join(notesDirectory, note), "utf8");
    for (const match of quotedLinkLabels(markdown)) {
      failures.push(`${note}:${match.line} [${match.label}]`);
    }
  }

  assert.deepEqual(failures, []);
});

test("quoted-link detection preserves normal apostrophes and ignores images", () => {
  const invalid = [
    '["Quoted title"](https://example.com)',
    "['Quoted title'](https://example.com)",
    "[“Quoted title”](https://example.com)",
    "[‘Quoted title’](https://example.com)",
  ].join("\n");

  assert.equal(quotedLinkLabels(invalid).length, 4);
  assert.deepEqual(quotedLinkLabels("[What's new](https://example.com)"), []);
  assert.deepEqual(
    quotedLinkLabels('The source calls this "useful": [plain title](https://example.com).'),
    [],
  );
  assert.deepEqual(
    quotedLinkLabels('![“Descriptive image alt”](assets/example/hero.webp)'),
    [],
  );
});
