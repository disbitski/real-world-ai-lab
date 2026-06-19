# Field Note: Reading Model Cards Without Getting Lost

Date: 2026-06-19

## Summary

OpenAI model pages are easier to understand when you read them as a set of
tradeoffs, not as a leaderboard.

Three fields matter immediately:

- context window
- max output
- reasoning

They all use tokens, but they describe different parts of the work. Context is
what the model can take into account. Max output is how much it is allowed to
produce. Reasoning is how much internal problem-solving effort the model is
guided to spend before and while producing the answer.

## Observation

On the model page, a frontier model can show a very large context window and a
separate max output limit. For example, the current OpenAI model page lists
`gpt-5.5` with a `1M` context window and `128K` max output tokens.

Those numbers are not saying the same thing.

The context window is the model's working space for the request or conversation.
It is the space where instructions, user input, retrieved documents, tool
results, prior messages, images, files, and other input material have to fit.

The max output limit is the upper bound on what the model can generate for the
response. In the Responses API, `max_output_tokens` includes both visible output
tokens and reasoning tokens.

That last detail matters. If a task needs a lot of reasoning, some of the output
budget can be spent on internal reasoning work before the visible answer is
finished.

## Why It Matters

Longer context windows are powerful because they let a model work with more
source material at once:

- larger codebases
- longer documents
- deeper conversations
- more retrieved knowledge
- richer tool results
- more examples and constraints

But a larger context window is not the same as better judgment. It gives the
model more room, not automatic understanding. The workflow still needs good
source selection, clear instructions, and verification.

Max output is a different control. It protects the response length and cost, but
it can also cut the model off if it is too low for the task. A short answer,
summary, or classification can use a small output budget. A migration plan,
long-form report, code generation task, or multi-step analysis may need more.

## Reasoning Effort

Reasoning effort controls how much the model is encouraged to think through the
problem. The OpenAI reasoning docs describe supported values as model-dependent,
including values such as `none`, `minimal`, `low`, `medium`, `high`, and
`xhigh`.

Lower effort favors speed and lower token usage. Higher effort gives the model
more room to work through complex tasks. The right setting depends on the work:

| Effort | Useful For |
| --- | --- |
| `none` or `minimal` | simple extraction, formatting, routing, or latency-critical work |
| `low` | everyday answers, simple code edits, straightforward summaries |
| `medium` | balanced default for reasoning, quality, and speed |
| `high` or `xhigh` | complex debugging, architecture, planning, long-horizon coding, careful analysis |

The practical habit is to match reasoning effort to risk and complexity, not to
always crank it up.

## Mental Model

Think of a model request as three budgets:

| Budget | Plain-English Meaning | Failure Mode |
| --- | --- | --- |
| Context window | How much the model can consider | important input is missing, truncated, or buried |
| Max output | How much the model can generate | the answer is cut short or cannot finish the job |
| Reasoning effort | How hard the model is guided to think | too low can be shallow; too high can add latency and cost |

These budgets interact. A huge context window can still produce a weak answer if
the relevant facts are buried. A high reasoning setting can still fail if the
needed source material is not present. A generous output cap can still be wasted
if the prompt does not define the desired artifact.

## How To Read A Model Card

When choosing a model, read the fields in this order:

1. Capability fit: does it support the modality and tools the workflow needs?
2. Context window: can it hold the source material or conversation state?
3. Reasoning support: can it spend enough effort for the task?
4. Max output: can it produce the artifact you need?
5. Latency and price: is the quality worth the cost for this workflow?
6. Knowledge cutoff: does the task require fresh information from tools or
   external sources?

This keeps the choice grounded in the work instead of in model hype.

## Evaluation Ideas

This lab can evaluate model choices by asking observable questions:

- Did the prompt fit within the model's context limits?
- Did the workflow include only useful source material, or did it overload the
  context window?
- Did the output budget match the expected artifact?
- Did reasoning effort match task complexity and risk?
- Did the system use tools when the knowledge cutoff was not enough?
- Did the final answer cite or preserve the evidence needed for review?

These are better criteria than asking whether a model is simply "smarter."

## Sources

- OpenAI API Models page: https://developers.openai.com/api/docs/models
- OpenAI Reasoning models guide:
  https://developers.openai.com/api/docs/guides/reasoning
- OpenAI Responses API reference:
  https://developers.openai.com/api/reference/resources/responses/methods/create
- OpenAI Token counting guide:
  https://developers.openai.com/api/docs/guides/token-counting

## Working Principle

Model selection is workflow design. Choose the model, context, output budget,
and reasoning effort based on the artifact you need and the risk of being wrong.
