import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const notesDirectory = join(repoRoot, "field-notes");
const notes = readdirSync(notesDirectory)
  .filter((name) => name.endsWith(".md"))
  .sort();

function uint24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function webpDimensions(buffer) {
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP");

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunk = buffer.subarray(offset, offset + 4).toString("ascii");
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (chunk === "VP8X") {
      return [uint24LE(buffer, data + 4) + 1, uint24LE(buffer, data + 7) + 1];
    }
    if (chunk === "VP8 ") {
      assert.equal(buffer.subarray(data + 3, data + 6).toString("hex"), "9d012a");
      return [buffer.readUInt16LE(data + 6) & 0x3fff, buffer.readUInt16LE(data + 8) & 0x3fff];
    }
    if (chunk === "VP8L") {
      assert.equal(buffer[data], 0x2f);
      const dimensions = buffer.readUInt32LE(data + 1);
      return [(dimensions & 0x3fff) + 1, ((dimensions >>> 14) & 0x3fff) + 1];
    }

    offset = data + size + (size % 2);
  }

  assert.fail("WebP dimensions were not found");
}

test("every field note publishes an optimized Grok hero below its date", () => {
  assert.ok(notes.length > 0);

  for (const noteName of notes) {
    const notePath = join(notesDirectory, noteName);
    const markdown = readFileSync(notePath, "utf8");
    const hero = markdown.match(
      /^Date: \d{4}-\d{2}-\d{2}\n\n!\[([^\]]+)\]\((assets\/[^)]+\/hero\.webp)\)\n\n/m,
    );

    assert.ok(hero, `${noteName} should place its hero immediately below Date`);
    const [, altText, relativePath] = hero;
    const stem = basename(noteName, ".md");
    assert.equal(relativePath, `assets/${stem}/hero.webp`);
    assert.ok(altText.length >= 30, `${noteName} should have descriptive alt text`);
    assert.doesNotMatch(altText, /^hero image$/i);

    const heroPath = join(notesDirectory, relativePath);
    assert.ok(existsSync(heroPath), `${relativePath} should exist`);
    assert.ok(statSync(heroPath).size < 1_000_000, `${relativePath} should remain below 1 MB`);

    const bytes = readFileSync(heroPath);
    const [width, height] = webpDimensions(bytes);
    assert.ok(width > 0 && height > 0, `${relativePath} should have valid dimensions`);
    assert.ok(Math.max(width, height) <= 1600, `${relativePath} should be at most 1600px`);
  }
});
