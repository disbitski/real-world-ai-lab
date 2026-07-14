import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { flashcards, cardsForMode } from "../docs/flashcards.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const fieldNotes = readdirSync(join(repoRoot, "field-notes"))
  .filter((name) => name.endsWith(".md"))
  .sort()
  .map((name) => `field-notes/${name}`);

test("every field note has at least one flashcard", () => {
  const covered = new Set(flashcards.map((card) => card.fieldNotePath));

  assert.deepEqual(
    fieldNotes.filter((note) => !covered.has(note)),
    [],
  );
});

test("official-only mode excludes real-world-only cards", () => {
  const officialCards = cardsForMode(false);

  assert.ok(officialCards.length > 0);
  assert.equal(officialCards.every((card) => card.mode === "official"), true);
  assert.equal(cardsForMode(true).length, flashcards.length);
});

test("official cards include source links and all cards include field-note links", () => {
  for (const card of flashcards) {
    assert.match(card.fieldNoteUrl, /^https:\/\/github\.com\/disbitski\/real-world-ai-lab\/blob\/main\/field-notes\//);
    assert.ok(card.question.length > 20);
    assert.ok(card.answer.length > 20);

    if (card.mode === "official") {
      assert.ok(card.sources.length > 0, `${card.id} should include official sources`);
      assert.equal(card.sources.every((source) => source.label && source.url.startsWith("https://")), true);
    }
  }
});

test("README flashcard thumbnails match the current card count", () => {
  const readme = readFileSync(join(repoRoot, "README.md"), "utf8");
  const expected = ["light", "dark"].map(
    (theme) => `docs/assets/real-world-ai-flashcards-${flashcards.length}-${theme}.png`,
  );
  const referenced = [...readme.matchAll(
    /docs\/assets\/real-world-ai-flashcards-\d+-(?:light|dark)\.png/g,
  )].map((match) => match[0]);

  assert.deepEqual(referenced, expected);
  for (const relativePath of expected) {
    const imagePath = join(repoRoot, relativePath);
    assert.ok(existsSync(imagePath), `${relativePath} should exist`);
    const image = readFileSync(imagePath);
    assert.equal(image.subarray(1, 4).toString("ascii"), "PNG");
    assert.equal(image.readUInt32BE(16), 1440);
    assert.equal(image.readUInt32BE(20), 1100);
  }
});
