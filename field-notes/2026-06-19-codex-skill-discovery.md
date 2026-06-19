# Field Note: Skill Discovery Is Part Of The Workflow

Date: 2026-06-19

## Summary

Creating a Codex skill is only half the work. The skill also has to live in a
place Codex actually scans for skill discovery.

In practice, this matters most when you expect a custom skill to appear in the
`$` picker. A skill can be valid Markdown, installed somewhere on disk, and even
usable when manually attached, but still not show up in autocomplete if it is not
in one of Codex's current skill discovery paths.

The lesson from building `$field-notes` was simple: use `.agents/skills` for
skills you want Codex to discover and show in the picker.

## Observation

I first installed a custom `field-notes` skill under `~/.codex/skills`. The
skill existed, and the instructions were usable in the thread, but it did not
show up in the `$` autocomplete list alongside the Chainlink skills.

The reason became clear after comparing local paths and Codex's skill docs. The
skills that appeared in the picker were installed under:

```text
~/.agents/skills
```

The Codex docs describe `.agents/skills` as the discovery location for
repository-scoped and user-scoped skills. They also describe `agents/openai.yaml`
as the optional metadata file that configures app-facing display details such as
name, short description, and default prompt.

Once the custom skill was copied into `~/.agents/skills/field-notes` and given a
clear `agents/openai.yaml`, it matched the shape of the skills already appearing
in the picker.

## Why It Matters

Custom skills are meant to make repeatable work easy to invoke. If a skill does
not appear where a user naturally looks for it, the workflow feels broken even
when the skill file itself is correct.

This is a product lesson and an enablement lesson. For teams teaching Codex,
"write the skill" is not enough. The workflow should include:

- where the skill source lives
- where the local installed copy lives
- how the skill appears in the picker
- what metadata users see
- how to refresh Codex if a new skill does not appear

That turns a hidden configuration detail into an explicit part of the workflow.

## Discovery Paths

A useful mental model is to separate source, installation, and configuration:

| Path | Role |
| --- | --- |
| `~/.agents/skills` | Personal skills Codex can discover across repos |
| `<repo>/.agents/skills` | Repo-scoped skills shared with people working in that repo |
| `/etc/codex/skills` | Admin or machine-level skills |
| bundled system skills | Skills shipped with Codex |
| `~/.codex/config.toml` | Codex configuration, including skill enable/disable entries |

In our case, `~/.codex/skills` was not the path to rely on for `$` autocomplete.
The safer habit is to install personal skills into `~/.agents/skills`, and keep
private source in a separate private repository when the skill should not be
public.

## Metadata Matters

The `SKILL.md` frontmatter is for Codex's skill matching:

```yaml
name: field-notes
description: Create, polish, and publish Real World AI Lab field notes...
```

The optional `agents/openai.yaml` is for the app experience:

```yaml
interface:
  display_name: "Field Notes"
  short_description: "Turn AI/Codex lessons into published Real World AI Lab field notes."
  default_prompt: "Turn this topic or session into a Real World AI Lab field note..."
```

Both are worth treating as product copy. The description helps Codex decide when
to use the skill. The UI metadata helps the human recognize the skill in the
picker.

## Evaluation Ideas

This lab can evaluate custom skill workflows by asking:

- Did the skill include valid `name` and `description` frontmatter?
- Was the skill installed under the correct `.agents/skills` discovery path?
- Did the skill include useful `agents/openai.yaml` metadata for the app?
- Did `$` autocomplete show the expected skill name and description?
- Did the skill trigger explicitly when invoked by name?
- Did the skill remain private when the workflow source should not be public?
- Did the final workflow document how to refresh or restart Codex if discovery
  lagged?

These checks are more useful than only validating the Markdown file.

## Sources

- Codex Agent Skills: https://developers.openai.com/codex/skills
- Codex AGENTS.md guidance: https://developers.openai.com/codex/guides/agents-md

## Working Principle

A reusable skill is not finished when the instructions are written. It is
finished when Codex can discover it, the human can find it, and the source lives
in the right place for the team.
