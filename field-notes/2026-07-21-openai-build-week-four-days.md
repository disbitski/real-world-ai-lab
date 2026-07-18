# Field Note: OpenAI Build Week: From a QR Code to Production in Four Days

Date: 2026-07-21

![A creator moves an idea from a hand-drawn arc across four brass stages into matching web, phone, and laptop experiences at sunrise.](assets/2026-07-21-openai-build-week-four-days/hero.webp)

## Summary

On July 14, I watched an OpenAI Codex video on LinkedIn about what was new for
developers. A QR code appeared at the end. I scanned it, landed on the OpenAI
Build Week page, and realized the challenge had opened the day before.

Four calendar days later, Codex and I had taken Morrowward from an idea about
financial hope to a production web app, installable PWA, iPhone and Mac
companion shells, public demo video, documented build history, and complete
Devpost submission. The first repository commit landed on July 14. We submitted
on July 17, then fixed the final user-discovered input bug that evening. The
four-day history contains 44 commits.

OpenAI calls the event **OpenAI Build Week**, and that name fits my experience
better than hackathon alone. The deadline created focus, but the week was really
a structured invitation to build, learn, make decisions, and finish something
real with GPT-5.6 and Codex.

The larger lesson for me is about who gets to build now. Agentic tools do not
remove the need for engineering. They make intent, curiosity, creativity,
judgment, and the willingness to learn much more operational. I believe that
will bring many more intuitive and creative people into software creation—not
because personality guarantees success, but because more of their natural
strengths can now reach working production systems.

## Observation

I did not begin the week with a backlog ticket or a technical specification. I
began with a life story.

I grew up poor, was diagnosed with Type 1 diabetes at age ten, and learned early
that I would need to support myself medically. Around that same age, I bought a
Commodore 64 with paper-route savings and discovered programming. Technology
changed the direction of my life and my family's life.

That became the reason for Morrowward: help people see how a small weekly habit,
financial education, and a long horizon can make a different future feel
possible. The product would be an educational simulation, not financial advice.
Its calculations would remain deterministic and local. GPT-5.6 would explain
concepts and produce bounded educational briefings, but it would not control the
math or tell someone what to buy.

The Build Week constraint turned that story into a sequence of decisions. Codex
and I chose the **Apps for Your Life** category, scoped a complete web/PWA
experience first, created a private repository, and started building. I supplied
the mission, product taste, financial lessons, daily hands-on testing, and final
judgment. Codex used GPT-5.6 Sol Ultra with Fast mode to help plan, implement,
test, document, deploy, and revise the product.

What surprised me was not merely the speed. It was how much of the work could
remain connected to the original human reason for building.

## The QR Code That Changed My Week

The discovery path matters because it was so ordinary.

I was scrolling LinkedIn, watched an OpenAI developer video, and scanned the QR
code at the end. I did not spend weeks deciding whether I was ready. The official
page said Build Week was open to developers and creators around the world and
encouraged builders of all experience levels. It linked directly to registration,
the schedule, live sessions, community events, Discord, and the Devpost challenge.

The official schedule showed submissions opening July 13 and closing July 21 at
5:00 p.m. Pacific, or 8:00 p.m. Eastern. I found it on July 14, so the event was
already moving.

That could have felt like being late. Instead, it removed hesitation. I
registered, shared the rules with Codex, told it the personal story behind the
idea, and we began shaping Morrowward that night.

OpenAI Build Week was the catalyst, not the source of the mission. The mission
was already part of my life. The event gave it a bounded container and a reason
to ship now.

## Four Calendar Days, Kept Honest

The Git history and contemporaneous build journal make the pace inspectable:

| Day | What changed |
| --- | --- |
| July 14 | Defined the mission and safety boundaries, built the first complete MVP, added the Market Journey learning experience, and created the Space theme. |
| July 15 | Deepened Practice mode, added guarded daily market snapshots, created the reviewed historical welcome experience, and connected practice balances to the simulated market journey. |
| July 16 | Expanded education and daily briefings, simplified deployment around one stable Production backend, hardened citations and caching, and made the production experience the shared source for future companions. |
| July 17 | Added the iPhone and Mac companion shells, finished the demo and Devpost submission, and fixed a direct-entry bug found through final hands-on use. |

The first commit landed at 9:49 p.m. Eastern on July 14. Feature-complete
acceptance, the companion apps, video, and Devpost submission all landed on July
17. Later that evening, a real onboarding test exposed numeric fields that
clamped each keystroke before a person could finish typing. Codex fixed the
shared input behavior, added desktop and mobile regression tests, deployed it,
and I verified the corrected web, iPhone, and Mac experiences.

I count that as part of the four-day story, not an exception to it. Production
work includes finding the thing that escaped the earlier test and closing the
loop before declaring the work done.

The four-day claim is intentionally narrow: four calendar days from first
repository commit to final production correction. It is not a claim that every
possible native behavior or future roadmap item was completed. We shipped a
working product with explicit boundaries and documented the tests we chose not
to expand for the event.

## What Devpost Got Right

I have served as a judge for hackathons hosted on Devpost, so I have seen the
submission experience from the other side. A strong platform does more than
collect a link at the end. It helps a first-time participant understand what a
complete entry looks like.

That structure showed up throughout OpenAI Build Week. The challenge pages made
the category, repository, README, project description, demo video, and Codex
session requirements visible. The FAQ explained that the video needed to be no
more than three minutes, public on YouTube, and narrated with specifics about
both Codex and GPT-5.6. The resources encouraged builders to record as they went
and emphasized that a clear three-minute demo beats a rushed one.

The project editor also turned the final submission into a guided checklist:
overview copy, technology tags, screenshots, short captions, links, repository,
and video. That matters for someone who has never entered a build event before.
The platform teaches the shape of a credible submission while the builder is
assembling it.

My judging experience also influenced what I prioritized. Judges may have only
a few minutes. A working link, a repeatable demo, clear screenshots, honest
claims, and a README that explains why decisions were made reduce the work
required to understand a project. Morrowward's build journal went further by
showing the human–AI process behind the polished result.

## Why I Did Not Use Every Community Resource

OpenAI provided live sessions, Discord office hours, community events, and
support channels throughout Build Week. I did not join the Discord or watch the
live sessions while building Morrowward.

That is not a criticism of those resources. I appreciate that they were there.
They make the event more accessible to someone who wants examples, collaborators,
real-time help, or a shared community rhythm.

My own rhythm is strongly self-directed. I have built a career around learning
new technology and then teaching it to other people. I work with GPT and Codex
every day. Before Build Week, Codex and I already had reusable skills for my
repository conventions, field-note process, writing voice, visual review, and
verification habits. We already knew how to move from an idea into a plan, let
me use the product, and turn my reactions into the next implementation loop.

For me, the highest-value use of the week was staying inside that flow. For a
different builder, joining office hours or meeting collaborators might be the
highest-value choice. The event supported both paths.

That flexibility is part of why the format works. A shared deadline does not
require one shared learning style.

## My Creative-Builder Lens

I often describe myself as an INFJ. I use Myers-Briggs as a personal lens for
how I experience intuition, meaning, empathy, and long-range ideas—not as a
scientific ranking, a credential, or a prediction of who can build software.

I have also used “right-brain” as shorthand for the part of me that thinks in
stories, images, emotional arcs, and possibilities. I do not mean that as a
literal claim that creative people use one side of the brain while engineers
use the other. It is personal language for an intuitive and artistic working
style.

The Big Five trait **openness to experience** gives me a more research-grounded
way to describe part of that style. The APA definition connects openness with
receptivity to new ideas and experiences. I recognize high openness in my own
curiosity, imagination, aesthetic interests, willingness to cross disciplines,
and habit of continuously learning new tools.

Peer-reviewed research supports an association between openness and creativity,
but the boundary is important. A second-order meta-analysis that integrated
seven prior meta-analyses reported a positive relationship between openness to
experience and creativity. That is a population-level correlation, not proof
that one trait causes creativity, guarantees useful output, or makes one type of
person a better builder.

My interpretation is more practical: agentic systems lower the distance between
an idea and a working artifact. That gives people who lead with narrative,
visual imagination, teaching, empathy, product taste, or cross-domain curiosity
more leverage than traditional software workflows often gave them.

It does not replace engineering discipline. Morrowward still needed TypeScript,
React, deterministic finance math, persistence migrations, API schemas, caching,
rate limits, Playwright tests, accessibility checks, Xcode builds, deployment
configuration, and privacy review. Codex helped execute and connect that work.
I remained responsible for why it existed, what it should feel like, whether it
was useful, and what was honest to claim.

That combination is what excites me. The table is getting wider.

## Why It Matters

For a long time, building production software demanded that one person either
master a large stack of procedural skills or assemble a team before the idea
could become tangible. Those constraints filtered which ideas got attempted and
which kinds of thinkers saw themselves as builders.

Agents change that threshold. They can translate intent into implementation,
carry context across layers, run verification, and help one person iterate much
faster. The scarce human skills shift toward choosing a worthwhile problem,
describing the desired experience, recognizing quality, noticing when the result
has drifted, and accepting responsibility for the release.

That is why I expect an explosion of building from people who may not match the
old stereotype of a software developer. This is my forecast, not an established
research conclusion. I expect more educators, artists, domain experts,
storytellers, and highly curious generalists to discover that they can make
working systems—not merely mockups or ideas.

OpenAI Build Week made that possibility concrete for me. In four days, a deeply
personal reason for building became something another person can open, use, and
learn from.

The deadline mattered. The tools mattered. The documentation and community
infrastructure mattered. But the most important change was psychological: the
future product stopped feeling hypothetical.

## Evaluation Ideas

I can evaluate future build-week experiences with questions like:

- Did the event help builders produce a working artifact, or only a compelling
  concept?
- Can the Git history and build journal support the claimed timeline?
- Did the deadline sharpen scope without erasing safety, accessibility, or
  honest limitations?
- Did the platform make submission requirements understandable to someone new
  to hackathons?
- Were community and self-directed learning paths both available?
- Did the agent amplify the builder's intent, or flatten the product into a
  generic first draft?
- Can the builder explain which judgments remained human and why?
- Did creative and domain-specific strengths translate into observable product
  decisions?
- Did the final correction loop continue after submission assembly exposed a
  real bug?
- Would another person be able to inspect, run, and learn from what was built?

## Sources

- OpenAI, [“OpenAI Build Week”](https://openai.com/build-week/)
- Devpost, [“OpenAI Build Week Schedule”](https://openai.devpost.com/details/dates)
- Devpost, [“OpenAI Build Week Resources”](https://openai.devpost.com/resources)
- Devpost, [“OpenAI Build Week FAQs”](https://openai.devpost.com/details/faqs)
- Morrowward, [build journal](https://github.com/disbitski/morrowward/blob/main/docs/BUILD_JOURNAL.md)
- APA Dictionary of Psychology, [“openness to experience”](https://dictionary.apa.org/openness-to-experience)
- Da Costa, Páez, Sánchez, Garaigordobil, and Gondim, [“Personal factors of creativity: A second order meta-analysis”](https://doi.org/10.1016/j.rpto.2015.06.002), *Revista de Psicología del Trabajo y de las Organizaciones* 31(3), 2015
- The Myers & Briggs Foundation, [“Myers-Briggs Overview”](https://www.myersbriggs.org/my-mbti-personality-type/myers-briggs-overview/)

## Working Principle

A focused event and a capable agent can turn creative intent into production
software quickly, but the human still supplies the reason, judgment, learning
style, and responsibility that make the result worth shipping.
