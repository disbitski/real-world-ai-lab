import test from "node:test";
import assert from "node:assert/strict";
import { flashcards, cardsForMode } from "../docs/flashcards.js";

const fieldNotes = [
  "field-notes/2026-06-18-human-ai-interaction.md",
  "field-notes/2026-06-28-4d-framework-common-language.md",
  "field-notes/2026-06-29-teaching-ai-fluency-classical-learning.md",
  "field-notes/2026-06-18-codex-workflows.md",
  "field-notes/2026-06-19-codex-skill-discovery.md",
  "field-notes/2026-06-19-model-context-output-reasoning.md",
  "field-notes/2026-06-20-agent-harnesses.md",
  "field-notes/2026-06-20-agents-md-readme-for-agents.md",
  "field-notes/2026-06-20-config-toml-harness-environment.md",
  "field-notes/2026-06-20-locking-down-permissions-with-codex-rules.md",
  "field-notes/2026-06-20-when-plan-mode-is-useful.md",
  "field-notes/2026-06-21-agentic-loops.md",
  "field-notes/2026-06-23-claude-code-context-shortcuts.md",
  "field-notes/2026-06-23-custom-agent-statuslines.md",
  "field-notes/2026-06-23-mcp-is-the-tool-layer.md",
  "field-notes/2026-06-23-rag-is-context-work.md",
  "field-notes/2026-06-25-claude-code-hooks-are-local-safety-rails.md",
  "field-notes/2026-06-25-subagents-keep-the-main-thread-clean.md",
  "field-notes/2026-06-26-claude-code-memory-is-a-staging-layer.md",
];

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
