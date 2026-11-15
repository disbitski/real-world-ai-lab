import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const fieldNotesDirectory = fileURLToPath(new URL("../field-notes/", import.meta.url));
const startMarker = "<!-- podcast-links:start -->";
const endMarker = "<!-- podcast-links:end -->";

function assertListenBlock(block) {
  assert.match(block, /## Listen To This Field Note/);
  assert.match(block, /https:\/\/podcast\.thedavedev\.com\/episodes\/[a-z0-9-]+/);
  assert.doesNotMatch(block, /\bTBD\b/i);
  if (block.includes("Apple Podcasts")) {
    assert.match(block, /https:\/\/podcasts\.apple\.com\/.+\?i=\d+/);
  }
  if (block.includes("Spotify")) {
    assert.match(block, /https:\/\/open\.spotify\.com\/episode\/[A-Za-z0-9]+/);
  }
  // Web/RSS can be public before a directory has indexed the episode.
  if (block.includes("YouTube")) {
    assert.match(block, /\[Watch on YouTube\]\(https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}\)/);
  }
  assert.doesNotMatch(block, /youtube\.com\/playlist/);
}

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
    assertListenBlock(block);
  }
});

const webOnly = `## Listen To This Field Note

This field note is also available as **Season 1, Episode 12** of *The Age We Build*.

- [Listen on the Web](https://podcast.thedavedev.com/episodes/example)`;

test("a live Web-only listen block is valid while directories index", () => {
  assert.doesNotThrow(() => assertListenBlock(webOnly));
});

test("included directory links must remain direct episode destinations", () => {
  for (const link of [
    "[Watch on YouTube](https://www.youtube.com/playlist?list=example)",
    "[Watch on YouTube](https://www.youtube.com/watch?v=short)",
    "[Listen on Apple Podcasts](https://podcasts.apple.com/us/podcast/show/id123)",
    "[Listen on Spotify](https://open.spotify.com/show/example)",
  ]) {
    assert.throws(() => assertListenBlock(`${webOnly}\n- ${link}`));
  }
});

test("listen blocks never publish unresolved directory placeholders", () => {
  assert.throws(() => assertListenBlock(`${webOnly}\n- Apple Podcasts: TBD`));
});
