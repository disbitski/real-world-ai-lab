# Field Note: When Unreal MCP Started Feeling Native

Date: 2026-07-09

## Summary

Today my Codex app became the ChatGPT desktop app with Codex mode. The migration
let me keep the familiar Codex icon, but the branding changed throughout the
product. I also moved to a new model configuration and reopened my Unreal
Engine project with its MCP server running.

The difference was immediate: Unreal MCP stopped feeling like a fragile local
HTTP experiment and started feeling like a native part of the agent workflow.
Codex discovered Unreal toolsets, ran automation tests, started and stopped
Play In Editor, captured the editor UI, inspected actors, corrected a scene-wide
rotation bug, and saved the level through Unreal's asset API.

The most important lesson is not "the new model fixed MCP." I changed the app,
model, session, and MCP connection at roughly the same time. What improved was
the whole harness. I should measure that experience end to end while staying
careful about which layer caused it.

## Observation

In earlier Embermere sessions, Codex could reach Unreal's MCP endpoint directly
over HTTP. Initialization worked, but streamed `tools/call` requests sometimes
hung or failed to produce usable output. We could still build C++, run headless
commandlets, and document manual PIE checks, but editor control was inconsistent.

After the desktop app migration and a fresh session, Unreal appeared as a
first-class MCP connection. Codex could immediately list toolsets for editor
control, automation, Slate inspection, UMG, materials, assets, scene actors,
and more. The same Unreal server was now much easier to use from the agent.

One observed run looked like this:

| Check | Observed result |
| --- | --- |
| Unreal tool discovery | Toolsets listed successfully in the active session |
| Test discovery | Nine Embermere tests found |
| Test execution | Nine passed, zero failed, zero warnings |
| Tool round trip for the nine-test run | About 6.2 seconds |
| Unreal-reported test execution time | About 0.119 seconds |
| PIE control | Start and stop worked through MCP |
| UI inspection | Slate captured the running HUD inside the editor window |
| Scene correction | Sixty-eight misplaced rotations were inspected and corrected |

This is one workflow sample, not a benchmark. The Unreal test runtime is also
not the same thing as total agent latency. The useful signal is that the full
loop completed reliably enough to keep building without dropping back to a
manual HTTP workaround.

## Why It Matters

An MCP server can be healthy while the agent experience is still poor. The
server, client, app integration, tool schemas, model, permissions, and project
state all participate in the result.

That means I need to separate at least four questions:

- Is Unreal's MCP server listening?
- Did the ChatGPT/Codex client load the project configuration and expose the
  connection?
- Can the model discover and call the right toolset?
- Does the Unreal tool itself return a useful result and persist the change?

Today exposed the last distinction clearly. A simulated `Cmd+S` was accepted by
the Slate input layer while PIE had focus, but the map was still dirty. Saving
the map through Unreal's asset tool persisted it correctly, and a headless
validator then saw the expected actor count. UI input and asset persistence are
different capabilities even when both travel through MCP.

## The App Migration And Plan Mode

The desktop migration presented Codex as a mode inside the ChatGPT app while
letting me keep the Codex icon. My tasks and coding workflow remained available,
but one familiar shortcut had changed: `Shift+Tab` no longer toggled Plan Mode.

Plan Mode had not disappeared. The installed app still exposed a **Toggle Plan
Mode** command, but it had no default keybinding in this build. I restored my
workflow by opening Keyboard Shortcuts with `Cmd+Shift+/`, searching for
`Toggle Plan Mode`, and assigning `Shift+Tab` again.

That distinction matters. A changed shortcut can look like a removed feature.
Before assuming a capability is gone, I should inspect the command palette and
keyboard-shortcut settings.

## The Unreal Setup That Persisted

Starting the Unreal server is a per-editor-session action unless auto-start is
enabled. Generating the client configuration is setup, not a command I need to
repeat every morning.

```text
# Run when the Unreal editor session needs its MCP server.
ModelContextProtocol.StartServer 8123

# Run once when creating the Codex client configuration.
ModelContextProtocol.GenerateClientConfig Codex
```

Epic's Unreal 5.8 documentation now says the Codex TOML configuration is
write-once: generating it again does not overwrite an existing file. It also
documents tool-search mode, where the client first sees `list_toolsets`,
`describe_toolset`, and `call_tool` instead of eagerly loading every Unreal
tool schema.

That matches what I observed. The agent discovered a small tool-search surface,
then opened the specific editor, automation, Slate, actor, scene, and material
toolsets as the work required them.

## What The Better Loop Found

The improved connection was not only more convenient. It changed what we could
find.

The first PIE screenshot showed the player camera buried in a huge building.
Actor inspection revealed that the Fab placement recipe intended to rotate
buildings and foliage around yaw, but Unreal Python had interpreted positional
`Rotator` arguments as pitch. Almost the whole art pass was leaning over.

Codex and I corrected the saved actor transforms, changed the script to assign
named rotation fields, added a validator that rejects tilted Fab actors, and
removed three oversized sci-fi building shells that still blocked the village
route when upright.

The harness improvement produced a better debugging loop:

1. run the existing automation baseline;
2. start PIE;
3. capture what the player actually sees;
4. inspect the responsible world actors;
5. perform a narrow batch correction;
6. save through the asset API;
7. verify from a fresh headless process.

That is much more valuable than simply being able to say the MCP port is open.

## Model Or Harness?

I liked the new model's speed and steadiness, but this session does not isolate
model quality. Several things changed together:

- the standalone Codex app migrated into the ChatGPT desktop app;
- the app loaded Unreal MCP as native callable tools;
- Codex started in a fresh session from the Unreal project root;
- Unreal and its MCP server were already running;
- the model configuration changed.

My evidence supports an end-to-end improvement. It does not support assigning
all of that improvement to one model. This is the same lesson as my earlier
field note, *The Harness Is Not The Model*, now made concrete inside a game
engine.

## Evaluation Ideas

I want to evaluate this workflow with repeatable measurements:

- time from opening a Codex task to successful Unreal tool discovery;
- success rate for `list_toolsets`, `describe_toolset`, and `call_tool`;
- wall time versus Unreal-reported execution time for test runs;
- success rate for PIE start, screenshot, input, stop, and restart loops;
- whether scene edits persist and survive a fresh headless validator;
- recovery behavior when the editor restarts or the MCP server reconnects;
- context/tool overhead as more Unreal toolsets become available;
- the same task across model changes while holding the app and server constant.

The last comparison is how I can eventually say something meaningful about the
model. Until then, "the whole loop got better" is the accurate claim.

## Sources

- OpenAI, "Using Codex with your ChatGPT plan": https://help.openai.com/en/articles/11369540-using-codex-with-chatgpt
- OpenAI, "Model Context Protocol": https://developers.openai.com/codex/mcp
- Epic Games, "Unreal MCP in Unreal Editor": https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor
- Real World AI Lab, "The Harness Is Not The Model": https://github.com/disbitski/real-world-ai-lab/blob/main/field-notes/2026-06-20-agent-harnesses.md
- Real World AI Lab, "MCP Is The Tool Layer": https://github.com/disbitski/real-world-ai-lab/blob/main/field-notes/2026-06-23-mcp-is-the-tool-layer.md

## Working Principle

When an agent workflow suddenly feels better, measure the whole loop and debug
the layers before crediting the model alone.
