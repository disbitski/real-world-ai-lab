# Field Note: MCP Is The Tool Layer

Date: 2026-06-23

![Editorial product photograph of a central ceramic protocol hub connected by organized cables to four distinct modules for documents, developer tools, data, and permission control.](assets/2026-06-23-mcp-is-the-tool-layer/hero.webp)

## Summary

I realized we have not written a field note about MCP yet, even though I am
already using it all the time.

MCP, or Model Context Protocol, is the layer that lets an agent reach outside
the chat window in a standard way. It can expose tools, resources, and prompt
templates from real systems: Chainlink docs, GitHub, Figma, browser tools,
private data, dashboards, or a personal finance workflow.

The practical lesson for me is simple: if RAG is how I bring knowledge into the
model, MCP is how I give the agent a controlled interface to the world.

## Observation

MCP has been quietly sitting underneath a lot of my daily workflow. The
Chainlink agent skills rely on external context and tools. My investing
workflow uses an MCP server to make a private system available to agents. Codex
and Claude both use MCP as a way to connect coding agents to tools, APIs, local
processes, and documentation.

That makes MCP more than another integration format. It is part of the agent
harness. The model still reasons, but MCP decides what external capabilities it
can discover, what schemas describe those capabilities, what data can be read,
what actions can be called, and which boundaries require approval.

The official MCP docs frame it as an open standard for connecting AI
applications to external systems. Anthropic's launch post describes the
motivation as replacing fragmented one-off integrations with a single protocol.
OpenAI's Codex docs describe MCP as the way to connect Codex to tools and
context, including third-party documentation and developer tools.

That is the pattern I care about: build the integration once, then let multiple
agent surfaces use it.

## Why It Matters

Without MCP, I am usually copying information into chat or asking the agent to
work from memory. That is fine for small tasks, but it breaks down when the work
needs current state, private state, or the ability to take action.

With MCP, the workflow changes:

- The agent can discover available tools instead of guessing.
- Tool inputs can be schema-defined instead of vague prose.
- Private data can stay behind a controlled server boundary.
- Repeated integrations can become reusable across clients.
- Approvals, timeouts, and tool allowlists can sit around the action surface.

The risk is the same reason MCP is powerful. A bad MCP server gives the model a
bad steering wheel. If a server exposes too much, describes tools poorly, mixes
read and write operations carelessly, or fetches untrusted content without
guardrails, the agent can become more dangerous and less reliable at the same
time.

## What An MCP Server Exposes

The official MCP docs describe three main server-side building blocks:

| Building block | What I use it for |
| --- | --- |
| Tools | Actions the model can request, like querying an API, opening an issue, or running a search |
| Resources | Read-only context, like files, schemas, records, docs, or saved notes |
| Prompts | Reusable templates that guide a workflow with the right tools and resources |

That split is important. Not everything should be a tool. If the agent only
needs to read something, a resource is often safer. If I keep repeating the same
workflow shape, a prompt template may be clearer than another broad tool.

This is also where MCP fits with the other field notes:

| Earlier idea | MCP connection |
| --- | --- |
| Harness | MCP adds external tools and context to the harness |
| RAG | MCP can expose the data sources a retrieval step searches |
| Loops | MCP tools can become the action/check steps inside a loop |
| `config.toml` | Codex config decides which MCP servers are available and how tools require approval |
| Skills | A skill can teach Codex when and how to use an MCP server |

## A Good First MCP Server

If I were building a custom MCP server for this lab, I would start with a
read-only server for the Real World AI Lab field notes.

That is a good first example because the risk is low and the value is obvious:
Codex or Claude could search my notes, read a specific note, and reuse the
working principles without me manually pasting context every time.

```ts
// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "real-world-ai-lab",
  version: "0.1.0",
});

server.tool(
  "search_field_notes",
  {
    query: z.string().describe("Topic or phrase to search for"),
  },
  async ({ query }) => {
    const matches = await searchMarkdownNotes(query);

    return {
      content: [
        {
          type: "text",
          text: matches.map((m) => `${m.title}: ${m.path}`).join("\n"),
        },
      ],
    };
  }
);

await server.connect(new StdioServerTransport());
```

That sketch is intentionally narrow. It has one read-only tool. It returns
paths and titles, not broad filesystem access. After that works, I could add:

- a `read_field_note` tool for one known note
- a `list_working_principles` resource
- a `draft_related_note` prompt template

I would not start with write access. The first server should prove discovery,
schema design, logging, and client setup before it can mutate anything.

## What Makes A Good MCP Tool

A good MCP tool is small enough that the model knows when to use it and narrow
enough that I can reason about the blast radius.

My default checklist:

- Name the tool by the action it performs.
- Write the description for model decision-making, not marketing.
- Use typed inputs with clear required fields.
- Keep read tools separate from write tools.
- Return structured, reviewable output.
- Surface errors in a way the agent can recover from.
- Require approval for anything that changes money, files, tickets, messages,
  infrastructure, or user-visible state.
- Avoid exposing secrets, broad filesystem access, or raw private data unless
  the server has a real need and a narrow boundary.

The docs also have one very practical warning for local stdio servers: do not
write normal logs to stdout. Stdio is the protocol channel, so stdout logging
can break the JSON-RPC stream. Logs should go to stderr or a file.

## Where MCP Fits In Codex And Claude

Codex supports MCP servers in the CLI and IDE extension. Its docs describe
local stdio servers, Streamable HTTP servers, bearer token auth, OAuth auth, and
server-wide instructions returned during initialization. Codex stores MCP
configuration in `config.toml`, which matches the earlier lesson that config is
harness wiring.

Claude Code also supports MCP for external tools, databases, APIs, and
workflows. Its docs call out common use cases like issue trackers, monitoring
data, databases, GitHub, Figma, Slack, and email. Claude Code can add remote
HTTP servers, local stdio servers, and plugin-provided MCP servers.

The important pattern across both products is not the exact command syntax. It
is that MCP gives agents a standard way to discover tools, call them with typed
arguments, receive structured results, and keep those capabilities separate
from the base model.

## Evaluation Ideas

This lab can evaluate MCP servers by looking at both usefulness and safety:

- Can the agent discover the right tool without being told the exact name?
- Does the tool description cause correct use, or does the model overuse it?
- Are read and write actions separated?
- Does the server return enough context for the next model step?
- Does it fail closed when credentials, network, or upstream APIs fail?
- Are tool outputs small enough to avoid context flooding?
- Are approvals required for sensitive actions?
- Can the same server work from Codex and Claude without redesigning the
  integration?

For a first benchmark, I would compare three versions of the same task:

1. manual copy/paste context
2. RAG over files
3. an MCP server exposing the same source as tools/resources

The score should include final answer quality, source traceability, time to
complete, tool-call count, failed calls, and whether the agent stayed inside
the intended permissions.

## Sources

- Model Context Protocol, "What is the Model Context Protocol?": https://modelcontextprotocol.io/docs/getting-started/intro
- Model Context Protocol, "Architecture overview": https://modelcontextprotocol.io/docs/learn/architecture
- Model Context Protocol, "Understanding MCP servers": https://modelcontextprotocol.io/docs/learn/server-concepts
- Model Context Protocol, "Build an MCP server": https://modelcontextprotocol.io/docs/develop/build-server
- Model Context Protocol, "MCP Inspector": https://modelcontextprotocol.io/docs/tools/inspector
- Model Context Protocol, "Security Best Practices": https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- Anthropic, "Introducing the Model Context Protocol": https://www.anthropic.com/news/model-context-protocol
- Anthropic Claude Code, "Connect Claude Code to tools via MCP": https://code.claude.com/docs/en/mcp
- OpenAI Codex, "Model Context Protocol": https://developers.openai.com/codex/mcp

## Working Principle

I should treat MCP servers as agent-facing APIs: small, typed, inspectable,
permissioned, and designed for the model to use correctly.
