import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const fieldNotesDirectory = fileURLToPath(new URL("../field-notes/", import.meta.url));
const startMarker = "<!-- podcast-links:start -->";
const endMarker = "<!-- podcast-links:end -->";

test("published podcast link blocks use direct verified destinations", () => {
  for (const filename of readdirSync(fieldNotesDirectory).filter((name) =>
    name.endsWith(".md"),
  )) {
    const markdown = readFileSync(join(fieldNotesDirectory, filename), "utf8");
    const starts = markdown.split(startMarker).length - 1;
    const ends = markdown.split(endMarker).length - 1;
    assert.equal(starts, ends, `${filename} has unmatched podcast link markers`);
    assert.ok(starts <= 1, `${filename} has duplicate podcast link blocks`);
    if (starts === 0) continue;

    const block = markdown.split(startMarker)[1]?.split(endMarker)[0] ?? "";
    assert.match(block, /## Listen To This Field Note/);
    assert.match(block, /https:\/\/podcast\.thedavedev\.com\/episodes\/[a-z0-9-]+/);
    assert.doesNotMatch(block, /\bTBD\b/i);
    if (block.includes("Apple Podcasts")) {
      assert.match(block, /https:\/\/podcasts\.apple\.com\/.+\?i=\d+/);
    }
    if (block.includes("Spotify")) {
      assert.match(block, /https:\/\/open\.spotify\.com\/episode\/[A-Za-z0-9]+/);
    }
  }
});
