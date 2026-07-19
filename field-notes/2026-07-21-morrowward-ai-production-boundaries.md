# Field Note: Shipping Morrowward’s AI Meant Designing Boundaries, Not Just Prompts

Date: 2026-07-21

![The four-bar Morrowward logo anchors four gated lanes leading to educator, prices, briefing, and reviewed-media modules.](assets/2026-07-21-morrowward-ai-production-boundaries/hero.webp)

## Summary

Morrowward was my first experience taking OpenAI API calls all the way from an
idea into a working production application.

I had used GPT and Codex every day to research, write, and build software. This
time Codex and I also had to decide what an AI model should be allowed to do
inside a personal-finance product, what context it should receive, what the
application must verify, how often a costly request could run, and what the
user should see when any part of that system failed.

The most important decision was architectural: **the model would never own the
financial math**. Morrowward's projections, simulated purchases, portfolio
accounting, Market Journey paths, migrations, and offline behavior remain
deterministic TypeScript. GPT-5.6 adds bounded education and source-backed
public context. Grok supplies reviewed creative media at build time, not
financial data at runtime.

That separation let the complete simulator work with no OpenAI key and no
network. AI could make the experience richer without becoming the load-bearing
part of it.

The production lesson was just as important: a good prompt is only one layer.
Shipping AI meant designing schemas, evidence checks, timeouts, durable locks,
rate limits, circuit breakers, safe fallbacks, protected routes, and human
review around the model.

## Observation

At the beginning, the AI portion sounded straightforward. Ask GPT-5.6 to
explain a projection, collect a daily set of public prices, and write a short
market briefing. Use Grok to create a few motivational images and videos.

Each sentence hid a different product boundary.

An educator can drift from explanation into a personalized recommendation. A
price can be current but attached to the wrong ticker. A market paragraph can
sound credible while one sentence is unsupported. A daily job can run twice. A
serverless instance can forget a warm-memory limit. A public chat route can be
found before anyone shares its URL. A technically successful media generation
can still be visually wrong.

Codex helped me turn those possibilities into explicit contracts. We separated
the system into four AI lanes:

| Lane | What AI contributes | Boundary owned by the application |
| --- | --- | --- |
| Ask Morrow | A level-appropriate educational explanation | Sanitized context, non-advice rules, strict schema, local safety handling, and deterministic fallback |
| Daily prices | One source-backed snapshot for a fixed eleven-symbol public list | Identity, freshness, evidence, caching, retry, and per-symbol fallback |
| Daily briefing | Three concise, sourced sections about fixed public context | Citation binding, timestamp checks, asset identity, Federal Reserve-source checks, and last-valid retention |
| Grok media | Image, video, and narration candidates | Build-time-only keys, candidate limits, provenance, visual inspection, captions, disclosure, and human approval |

This was not one autonomous agent making financial decisions. It was a bounded
team of systems, orchestrated by Codex, with deterministic code and human
judgment holding the important boundaries.

## Why It Matters

Prompts are easy to demonstrate because the successful answer is visible.
Production boundaries are less glamorous because their best result is often
that something unsafe, unsupported, duplicate, stale, or unnecessarily costly
never reaches the screen.

That matters even more in finance. Morrowward is educational software, not a
broker, adviser, or live trading terminal. It does not need a model to choose
assets or calculate returns. It needs to help someone understand time,
contributions, compounding, inflation, volatility, and risk without creating a
false sense of certainty.

The architecture therefore starts from the no-AI product and adds AI only where
language or current public context creates real educational value.

That changed my design question from:

> What else can the model do?

to:

> What is the smallest useful job the model can do inside a boundary the rest
> of the product can test, observe, and survive without?

## The Deterministic Product Comes First

Morrowward stores a person's plan and simulated practice portfolio locally in
IndexedDB. There is no account, brokerage connection, or real transaction path.
The application uses integer cents and basis points for its financial domain,
and its projection engine is covered by deterministic and property tests.

The selected age, contribution, balance, holdings, and simulation state do not
need to leave the device for the core experience to work. Even Market Journey's
uneven-market paths and strongest-day comparison are calculated locally.

This creates a useful failure property: disabling OpenAI does not disable the
financial simulator. The user loses optional AI explanation and the newest
source-backed public context, but not their plan or the ability to explore it.

I now think this is one of the strongest ways to integrate AI into an existing
domain: make the deterministic path complete, then use the model to explain or
enrich it.

## Ask Morrow Sees Less Than The Screen

The Education Center can show a plan, practice holdings, and learning content,
but the server does not send that complete screen state to GPT-5.6.

Ask Morrow receives a sanitized question, the selected experience level, and
at most four bounded illustrative values: years remaining, weekly
contribution, illustrative return, and inflation. It does not receive the
starting balance, simulated holdings, transaction history, identity, or health
story.

Questions that look like prompt injection, include obvious sensitive
identifiers, request individualized buy/sell instructions, or cross defined
crisis, debt, tax, and regulated-advice boundaries are handled locally before a
provider call. The generated response is checked again for direct
recommendations, concentrated allocations, guarantees, and urgency.

The Responses API request itself is deliberately plain and inspectable. This is
a shortened version of the real contract:

```ts
const response = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: {
    authorization: `Bearer ${serverOnlyApiKey}`,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-5.6",
    store: false,
    instructions: boundedEducationalInstructions,
    input: sanitizedContext,
    max_output_tokens: 1200,
    text: {
      format: {
        type: "json_schema",
        name: "morrowward_educational_explanation",
        strict: true,
        schema: educationSchema,
      },
    },
  }),
});
```

The API key exists only in server-side deployment settings. `store: false`
turns off Responses application-state storage for this request; it does not
mean I should describe the request as if no provider-side processing or abuse
monitoring can occur. OpenAI's current data-controls documentation separately
describes abuse-monitoring retention and organization-level data-control
options. That distinction is why Morrowward still minimizes the context it
sends.

Strict structured output gives the application a predictable shape. It does
not prove that the content is correct. Morrowward parses the result, validates
it again in TypeScript, and uses a deterministic explanation if the call times
out, the schema fails, or the safety contract does not hold.

## Daily Prices Are A Shared Publication, Not A Button

We initially discussed a refresh button for market prices. During the design
loop, I realized that a per-visitor button was the wrong cost and reliability
shape. One shared daily snapshot was enough for a practice application.

A protected Production cron now batches the fixed allowlist—VTI, BND, AAPL,
TSLA, SPCX, NVDA, MRVL, MU, AVGO, BTC, and ETH—into one GPT-5.6 Responses
request after the regular U.S. equity session. It requires hosted web search,
allows at most one search call, requests source records, uses `store: false`,
and returns a strict per-asset structure.

Both generation routes compare Vercel's bearer authorization header with a
server-side `CRON_SECRET`; an optional separate admin token exists only for an
operator-controlled server-to-server trigger. Neither credential is shipped to
the browser.

The model receives only that public list and the request time. It never receives
a visitor's plan, holdings, simulated cash, transactions, question, or identity.

The server then validates each symbol's identity, observation time, evidence,
and output shape. A URL must come from the returned search evidence and must be
bound to the quote it supports. A hosted source that exposes no URL does not
get an invented one. Unsupported symbols fall back individually, so one weak
result does not have to corrupt an otherwise useful snapshot.

The UI calls these values **updated daily**, not real-time or trading-grade.
That wording is part of the architecture too.

## The Price Cache Race Taught Us What Production Means

The first public Production visit found a race that protected Preview testing
had not reproduced.

The page correctly returned deterministic prices immediately and started the
shared GPT-5.6 refresh in the background. The batch succeeded and wrote nine
validated stock and ETF prices. But the initiating response could be held by an
edge cache, while a warm function briefly cached its earlier empty Redis read.
The interface's two observation checks could therefore miss data that another
function had already saved.

Nothing was wrong with the model output. The orchestration around it was wrong.

Codex and I kept the existing spend controls and repaired the read path:

- fallback responses became private and `no-store`;
- observation-only reads bypassed the short durable-miss cache;
- the first run gained a clear “preparing” state;
- returning to a long-open page triggers one read-only observation; and
- none of those observations can start another generation.

An in-process singleflight still collapses duplicate work inside one warm
runtime. A Redis/KV `NX` guard coordinates retries across instances, and
persistent failures retry no more frequently than once per twelve hours.

This does not make the application immune to abuse or distributed attacks. It
reduces duplicate generation and repeated spend inside the operating envelope
we designed.

## The Daily Briefing Needed An Evidence Binder

The daily briefing is another shared publication job. A protected Vercel cron
is scheduled once per day, with a 150-second route and upstream deadline because
current web research often took around ninety seconds during testing. Delivery
can be missed or duplicated, so the durable lease and last-valid publication
rules still matter.

The request contains only a timestamp and time zone, four public benchmarks,
nine public frontier-asset identifiers, and a fixed hypothetical $100,000
learning scenario. It permits no more than four web searches and asks for
exactly three sections: market and sentiment, frontier assets, and a $100K
learning lens with Federal Reserve watch.

Production exposed an important difference between structured output and
verified output. Real search results returned valid but varied evidence shapes:

- RFC 3339 timestamps with numeric offsets;
- a known click-tracking query on an otherwise matching article;
- two AP News URL forms with the same stable article identifier; and
- complete search-source records without an inline citation annotation for
  every sentence.

The answer was not to loosen matching until anything plausible passed. Codex
and I added narrowly bounded normalization, kept public diagnostics limited to
host and path structure, omitted sentences whose citations still could not
bind, and rejected unsupported Federal Reserve dates or asset identities.

A failed run never replaces the latest validated edition. If there is no usable
edition, Morrowward serves an evergreen briefing that makes no claim about
current prices, headlines, sentiment, or future Federal Reserve dates.

That experience gave me a concise rule: **a strict schema makes an answer
machine-readable; evidence validation makes it eligible for publication**.

## Redis Is Coordination, Not Financial Storage

When we made the production site public but unannounced, I raised a practical
concern: a bot could find Ask Morrow and consume our API credit even if humans
had not shared the URL.

Warm-memory rate limits were not enough because serverless instances do not
share process memory. We reused one small Redis-compatible store for:

- atomic per-client fixed-window counters;
- a 100-provider-attempt UTC-day educator circuit breaker;
- the last validated quote and briefing publications;
- short-lived generation leases and retry guards; and
- expiry of shared AI content after 48 hours.

The store does not contain a person's plan or practice portfolio. Rate-limit
keys use a salted hash rather than a stored raw address. Provider-eligible
attempts reserve a quota slot before the call, so upstream failures still count;
locally handled safety boundaries do not spend that shared GPT quota.

If the durable store is unavailable in Production, Morrowward fails closed for
model-eligible educator work rather than falling back to an unshared counter
that only looks global.

Again, these are cost and reliability controls. They reduce rapid repeated use
and duplicate generation. They are not a claim that the app can stop a DDoS
attack, and they do not replace platform-level firewall, monitoring, or future
abuse work.

## Grok Was A Build-Time Creative Specialist

The fourth lane never runs for a visitor.

Codex used xAI's Grok image, video, and text-to-speech APIs to create candidate
historical welcomes and visual material. The local scripts bounded candidate
counts and duration, kept `XAI_API_KEY` out of browser code, and stored raw
candidates outside Git.

Codex reviewed the outputs at original resolution for anatomy, duplicate
objects, pseudo-text, logos, visual fit, captions, transcript accuracy, file
size, and reduced-motion behavior. I made the final creative call. In the
Franklin pass, I rejected a technically clean still-motion fallback because it
did not feel right, and we returned to the stronger reviewed video.

The approved files became static assets with disclosure, captions, provenance,
and user-controlled playback. Grok never supplies a market price, projection,
risk score, or recommendation, and the deployed app has no xAI runtime
dependency.

This is one of my favorite parts of the project. GPT-5.6 Sol in Codex did not
have to be the best model for every specialized job. It could orchestrate a
small team, establish the review criteria, inspect the results, and bring the
best accepted artifact into one product.

## What The First API Budget Taught Me

I began with a dedicated OpenAI API project, $10 of prepaid API credit,
auto-recharge disabled, and usage monitoring enabled. Separately, I later
received $100 in Build Week promotional **Codex** credits. The Build Week credit
applied to Codex workspace use, not to Morrowward's runtime API calls.

Neither should be described as an absolute application-enforced spending cap.
OpenAI's prepaid-billing guidance warns that cutoff can be delayed after an API
credit balance is consumed, with excess usage appearing as a negative balance.
The architecture still needed bounded outputs, daily shared jobs, retry guards,
rate limits, a circuit breaker, and safe shutdown behavior.

That was enough for a public Build Week demonstration. A real consumer launch
would need a fresh economics pass using observed traffic and token usage.
Possibilities I would evaluate include:

- reserving interactive AI for paid members;
- giving free users cached or evergreen educational content;
- routing some bounded explanations to a less expensive model;
- caching repeated questions only when the privacy and product semantics fit;
- measuring cost per useful completed learning interaction; and
- adding stronger platform-level abuse detection before promotion.

Those are hypotheses, not a pricing plan. The right answer depends on real use,
quality requirements, current provider pricing, and how much of the experience
can remain deterministic.

There is a related diligence lesson around market data. We deliberately used
fixed public educational context, retained source provenance, and labeled the
result as daily rather than live trading data. That design does **not** create a
blanket legal right to display or redistribute any source. A production
business would still need to review each provider's current terms, licensing,
attribution, and geography with qualified counsel.

## Evaluation Ideas

- Does the complete simulator still work with OpenAI and Redis disabled?
- Can any public request cause projection math or a real transaction?
- What exact user context reaches each AI lane, and can it be reduced further?
- What percentage of Ask Morrow questions resolve locally, through GPT-5.6, or
  through a deterministic fallback?
- Do prompt-injection, sensitive-identifier, recommendation, urgency, and
  guarantee tests fail before unsafe copy reaches the interface?
- Can a duplicate or missed cron run create duplicate spend or replace a newer
  validated publication?
- How often do real citations fail to bind even when structured output parses?
- Do stale, malformed, unsupported, or partially sourced results fail closed?
- Does every quote show its update time, source state, and educational status?
- Can a cold start, cache miss, or Redis outage leave the interface ambiguous?
- What is the cost per successful daily publication and per useful educator
  interaction at realistic traffic levels?
- Are promotional credits, dashboard limits, and rate limits described without
  implying a guaranteed hard cap?
- Can every generated media asset be traced to its reviewed source, transcript,
  disclosure, and human approval?
- Are data-source licensing and display decisions reviewed separately from
  technical citation validation?

## Continue The Morrowward Journey

The production boundaries are one part of the larger Morrowward story. I also wrote about the four-day Build Week journey that started it and the human-AI collaboration loop that kept the product moving without giving up judgment or intent.

- **Start with the four-day build story:** [OpenAI Build Week: From a QR Code to Production in Four Days](2026-07-21-openai-build-week-four-days.md)
- **Follow the collaboration journey:** [The Loop That Built Morrowward: Delegation, Discernment, and Four Days of Human-AI Work](2026-07-21-morrowward-delegation-discernment-loop.md)
- **Read the full day-by-day developer journal:** [Morrowward Build Journal](https://github.com/disbitski/morrowward/blob/main/docs/BUILD_JOURNAL.md) records what we learned, changed, and shipped during each day of the build.

## Sources

- [Morrowward source repository](https://github.com/disbitski/morrowward)
- Morrowward, [AI orchestration and media provenance](https://github.com/disbitski/morrowward/blob/main/docs/AI_ORCHESTRATION.md)
- Morrowward, [Security and privacy notes](https://github.com/disbitski/morrowward/blob/main/docs/SECURITY_AND_PRIVACY.md)
- OpenAI, [Structured model outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- OpenAI, [Web search](https://developers.openai.com/api/docs/guides/tools-web-search)
- OpenAI, [Data controls in the OpenAI platform](https://developers.openai.com/api/docs/guides/your-data)
- OpenAI, [API pricing](https://developers.openai.com/api/docs/pricing)
- OpenAI Help Center, [How can I set up prepaid billing?](https://help.openai.com/en/articles/8264644-what-is-prepaid-billing)
- Devpost, [OpenAI Build Week FAQs](https://openai.devpost.com/details/faqs)
- Vercel, [Getting started with cron jobs](https://vercel.com/docs/cron-jobs/quickstart)
- Vercel, [Managing Cron Jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs)
- xAI, [Image Generation](https://docs.x.ai/developers/model-capabilities/images/generation)
- xAI, [Video Generation](https://docs.x.ai/developers/model-capabilities/video/generation)
- xAI, [Text to Speech](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech)

## Working Principle

In a production AI product, the prompt proposes an answer; deterministic code,
evidence, cost controls, failure behavior, and human judgment decide whether
that answer earns a place in the experience.
