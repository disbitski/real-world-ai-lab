# Field Note: RAG Is Context Work

Date: 2026-06-23

![Overhead editorial photograph of five document sources feeding through translucent ribbons into one clear context funnel, producing selected cards and one clean output.](assets/2026-06-23-rag-is-context-work/hero.webp)

## Summary

This morning I learned the name for something Codex and I have already been
doing together: RAG, or Retrieval-Augmented Generation.

The simple version is: retrieve the right material first, then generate from
that material. Instead of asking a model to answer from whatever it already
knows, I bring in source artifacts: docs, repo files, browser research,
conversation snippets, PDFs, prior notes, and official product documentation.
Then Codex uses that retrieved context to produce something grounded.

That sounds technical, and it is. But the practical insight for me is very
human: good AI work depends on choosing what the model gets to see.

## Observation

My Grok conversation framed RAG as two moves: retrieval and generation. The
retrieval step finds relevant information from documents, databases, websites,
PDFs, or other sources. The generation step uses an LLM to produce a coherent
answer from the question plus the retrieved material.

That made something click. A lot of the work I do with Codex is not just
prompting. It is context assembly. I point Codex at the conversation, the repo,
the source docs, the existing field notes, and the verification steps. Codex
then generates from that grounded bundle instead of improvising from memory.

OpenAI's docs describe this in product terms through file search, retrieval,
vector stores, and embeddings. Anthropic's Contextual Retrieval writeup calls
out the hard part: RAG can fail when chunks lose the context that made them
meaningful. xAI/Grok's docs show the same pattern through Web Search for fresh
public information and Collections Search for uploaded knowledge bases.

The common thread is clear: the model is only one part of the system. The
retrieval layer decides what evidence enters the room.

## Why It Matters

RAG matters because models are not databases. They can reason over context, but
they do not automatically know my repo, my latest notes, a private document, or
what changed on the web this morning.

When I use RAG well, I get a better working relationship with the model:

- fewer unsupported claims
- fresher answers when the web or docs have changed
- better use of private or project-specific artifacts
- a clearer source trail for review
- less pressure to make one giant prompt carry everything

The danger is thinking RAG is magic. Bad retrieval still gives the model bad
grounding. If the wrong chunks are fetched, if the source is stale, if the query
is too vague, or if the model is allowed to answer without citations, the final
response can still sound confident and be wrong.

## What RAG Looks Like In My Work

For this lab, RAG is not just a vector database pattern. It is the discipline of
making context explicit before generation.

| RAG layer | My version with Codex |
| --- | --- |
| Knowledge base | Repos, field notes, docs, conversations, PDFs, web pages |
| Retriever | Search, file reads, web research, MCP tools, connectors |
| Chunking | Choosing the smallest useful excerpt or file section |
| Augmentation | Putting source material into Codex's working context |
| Generation | Drafting the note, code, summary, plan, or review |
| Citations | Links, file paths, line references, command output |
| Evaluation | Tests, diff review, source checks, unsupported-claim review |

The most important part is not the label. It is the habit: before asking the
model to answer, I should ask what evidence belongs in the context.

## A Small RAG Spec

I want to start writing small retrieval specs for tasks where source quality
matters. They do not need to be fancy. A Markdown or YAML-like checklist is
enough to make the retrieval plan visible.

```yaml
# rag-source-set.yaml
task: "Write a field note about Retrieval-Augmented Generation"

question:
  - "What did I learn from the Grok conversation?"
  - "How does this map to the way Codex and I already work?"

retrieve:
  required_sources:
    - user_conversation: "Grok RAG explanation from 2026-06-23"
    - openai_docs: "file search, retrieval, embeddings"
    - anthropic_docs: "contextual retrieval, context windows"
    - xai_docs: "collections search, web search"
  optional_sources:
    - existing_field_notes: "harnesses, loops, workflows"

rules:
  - "Separate facts from my interpretation."
  - "Do not make provider claims without official docs."
  - "Cite official docs in the Sources section."
  - "Flag any source that is promotional, stale, or incomplete."

done_when:
  - "The note explains the idea in my voice."
  - "The retrieval path is visible."
  - "Unsupported claims have been removed."
  - "Evaluation ideas are observable."
```

This is the kind of small artifact that turns "go research RAG" into a
repeatable retrieval loop. It also gives me something to evaluate later.

## What The Official Docs Add

OpenAI's docs give me the system shape. File search lets a model search uploaded
files before generating a response. Vector stores power semantic search and can
automatically chunk, embed, and index files. Embeddings turn text into vectors
where distance represents relatedness, which is the core trick behind semantic
retrieval.

Anthropic's docs and engineering notes give me the caution. Their Contextual
Retrieval writeup says traditional RAG can fail because chunks lose important
context when they are encoded. Anthropic's context-window docs make the same
larger point: what fits in context is not automatically what should be in
context. Curation still matters.

xAI/Grok's docs show two useful retrieval modes. Web Search lets Grok search and
browse the web for up-to-date information with citations. Collections Search
lets Grok search uploaded knowledge bases, use semantic search over documents,
and power RAG workflows over private or proprietary material.

Together, the docs make RAG feel less like one vendor feature and more like a
general pattern: retrieve relevant evidence, give it to the model, require the
answer to stay grounded, and keep the source trail visible.

## What I Should Watch

RAG can make AI systems more trustworthy, but only if I evaluate the retrieval
step directly.

The questions I should keep asking:

- Did the retriever find the right sources?
- Did it miss a source I knew should matter?
- Did the chunks preserve enough context to be useful?
- Did the model cite what it actually used?
- Did the answer distinguish retrieved facts from interpretation?
- Did stale, promotional, or low-quality material sneak into the context?
- Did the final artifact improve because of retrieval, or just become longer?

This is why I should not only evaluate the final answer. I should evaluate the
retrieval path that produced it.

## Evaluation Ideas

This lab can evaluate RAG by recording both the source set and the generated
artifact:

- Same question, no retrieval vs. curated retrieval.
- Same question, broad web retrieval vs. official-doc-only retrieval.
- Same source set, different chunk sizes.
- Same source set, with and without source citations.
- Same source set, with and without a reviewer pass for unsupported claims.
- Same field note prompt, with and without a written `rag-source-set.yaml`.

For each run, I should score:

- source relevance
- source freshness
- citation accuracy
- unsupported claims
- missing context
- final artifact quality
- whether the retrieval path is understandable enough to repeat

The key test is not whether the answer sounds smart. The key test is whether I
can trace the answer back to the material that grounded it.

## Sources

- My Grok conversation about Retrieval-Augmented Generation, 2026-06-23.
- OpenAI, "File search": https://developers.openai.com/api/docs/guides/tools-file-search
- OpenAI, "Retrieval": https://developers.openai.com/api/docs/guides/retrieval
- OpenAI, "Vector embeddings": https://developers.openai.com/api/docs/guides/embeddings
- Anthropic, "Introducing Contextual Retrieval": https://www.anthropic.com/engineering/contextual-retrieval
- Anthropic, "Context windows": https://platform.claude.com/docs/en/build-with-claude/context-windows
- Anthropic, "Files API": https://platform.claude.com/docs/en/build-with-claude/files
- xAI, "Collections Search Tool": https://docs.x.ai/developers/tools/collections-search
- xAI, "Web Search": https://docs.x.ai/developers/tools/web-search

## Working Principle

Before I ask the model to generate, I should decide what evidence deserves to
be retrieved, trusted, and carried into context.
