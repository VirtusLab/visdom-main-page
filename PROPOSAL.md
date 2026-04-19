# Visdom Main Page Rewrite Proposal

This document contains the proposed full-page copy for the rewritten landing page in VirtusLab's forward-deployed voice.

## Navigation

- `Platform` -> `#kit`
- `Insights` -> `#thesis`
- `AI Radar` -> `#radar`
- `Matrix` -> `https://visdom-ai-maturity-matrix.pages.dev`
- `Get in Touch` -> `#start`

## 1. Hero

**Eyebrow**

`VISDOM BY VIRTUSLAB`

**H1**

`We help enterprise teams build agent-ready SDLC.`

**Subtitle**

Most organizations adopting AI hit the same wall: the model works, but the infrastructure around it, context, CI, review, and governance, was never built for machine-speed iteration.

We have been solving this at VirtusLab for three years. Now we help other teams get there faster.

We bring opinionated patterns, six open-source components, and engineers who have shipped this before.

**Primary CTA**

`Take the 20-min Matrix Assessment`

Link: `https://visdom-ai-maturity-matrix.pages.dev/assessment`

**Secondary CTA**

`How we engage ->`

Link: `#engage`

**Trust strip**

`Built by the team behind the Visdom Maturity Matrix and AI Engineering Radar · 160+ open-source repositories · 15+ years in JVM ecosystem`

## 2. What We See Going Wrong

**H2**

`What we see going wrong in AI adoption`

**Column 1**

**The model works. The chassis does not.**

Most teams we talk to already have Copilot, Cursor, or Claude Code in the hands of engineers. The suggestions are often useful. The failure shows up later, when senior engineers spend half their week untangling agent-generated pull requests that pass CI and still cut across architecture. The block is rarely the model.

**Column 2**

**Nobody owns this capability.**

Adopting agents at enterprise scale is a platform engineering problem. Someone has to own context delivery, sandbox isolation, attribution, policy, and machine-speed CI. In most organizations we assess, those responsibilities are split across DevEx, platform, and security, and nobody is accountable for the full operating model.

**Column 3**

**Vendor sprawl without a thesis.**

The average stack we audit is a pile of disconnected tools: generation in one place, measurement somewhere else, governance bolted on later, and no usable context layer underneath any of it. Each vendor solves a slice. Nobody is wiring the system your engineers need if agents are going to move from task to verified deploy.

**Close**

`That is the gap we close.`

## 3. How We Are Different

**H2**

`Not a vendor. Not a consultancy. Something in between.`

**Paragraph**

We are not a software vendor selling licenses. We are not a traditional consultancy starting from zero in every client environment. We bring a six-component open-source kit that we have deployed repeatedly, then we embed with your platform engineers to adapt it to your stack, your controls, and your delivery model. When the engagement ends, your team owns the capability and the codebase.

**Card 1**

**We bring the kit**

Six components, MIT-licensed, shaped through real delivery work, and visible in public before we ever step into your environment.

**Card 2**

**We embed, not advise**

Our engineers work in your repositories, your CI, and your infrastructure. We author production code and integration docs with your team, not decks for a steering committee.

**Card 3**

**We transfer the keys**

We structure the work for capability transfer from day one. Our footprint should shrink as your team takes over, and by the final phase we should be advisory, not essential.

## 4. How We Engage

**H2**

`How we engage`

**Preamble**

We structure engagements in three phases with capability transfer designed in from the start. You should end with the capability, not a dependency on us.

**Phase 1 - Foundation**

`2 weeks · fixed scope`

We start on-site or remote by assessing your environment against the Visdom Maturity Matrix: 60 practices across four perspectives. We return a prioritized roadmap, name the first pilot team, identify the components that matter, and define the Phase 2 scope. If you stop there, your team still keeps the roadmap.

**Phase 2 - Pilot Implementation**

`6-10 weeks · scoped after Phase 1`

We deploy the recommended components with one pilot team inside your environment. We integrate with your source control, CI, identity, and observability stack. Our engineers and your platform team co-author the runbooks, ADRs, and integration docs, and your engineers co-own the code from the first week.

**Phase 3 - Scale and Transfer**

`4-8 weeks · advisory`

Your platform team leads rollout across the wider organization. We stay close enough to unblock hard decisions, review architecture, and help with exceptions, but we are no longer driving day-to-day delivery. By the end, your team should be able to operate the stack without us.

**Footprint line**

`Phase 1: VirtusLab leads, your team observes -> Phase 2: VirtusLab leads with deep client collaboration -> Phase 3: your team leads, VirtusLab advises`

## 5. The Kit We Bring

**H2**

`The kit we bring`

**Preamble**

Every engagement uses some combination of these six components. Each one is open source, MIT-licensed, and self-hostable. Most teams still bring us in because composing them, hardening them, and integrating them into a real enterprise stack is the expensive part, and we have already done that work more than once.

### ViDIA

**One-line purpose**

Deterministic developer intelligence for ownership, expertise, and blast-radius analysis.

**What it does**

ViDIA indexes repository history, structural relationships, and collaboration signals so your engineers and coding agents can resolve ownership, likely experts, and change impact from a stable context layer.

**How we deploy it**

We integrate ViDIA into your MCP-enabled IDE setup, connect its knowledge graph to your repository and service boundaries, and co-author the operating rules with your platform team.

**Link**

`See on GitHub`

Link: `https://github.com/VirtusLab/visdom-developer-intelligence`

### VCR

**One-line purpose**

Machine review for architecture, security, and performance checks in pull requests.

**What it does**

VCR analyzes pull request diffs against explicit rules so architectural violations, security issues, and common regression patterns are surfaced before a senior engineer spends review time on them.

**How we deploy it**

We wire VCR into your CI and review workflow, encode your architectural constraints into review rules, and tune the findings with your senior engineers until the signal is usable.

**Link**

`See on GitHub`

Link: `https://virtuslab.github.io/visdom-code-review/`

### Visdom Testing

**One-line purpose**

Verification patterns for code written and tested in agent-heavy workflows.

**What it does**

Visdom Testing combines architecture tests, property-based testing, and mutation checks so your team can verify behavior that line coverage alone no longer explains.

**How we deploy it**

We fit the test strategy to your architecture, install the right gates into CI, and help your engineers decide which invariants must hold before agents are allowed to merge work.

**Link**

`See on GitHub`

Link: `https://virtuslab.github.io/visdom-testing/`

### TraceVault

**One-line purpose**

Tamper-evident tracing, attribution, and audit records for AI-assisted development.

**What it does**

TraceVault records sessions, tool calls, token usage, and code attribution in a signed audit trail so your team can explain how AI-assisted changes were produced.

**How we deploy it**

We connect TraceVault to your development toolchain, map the retained evidence to your governance requirements, and set up the dashboards and retention model your risk teams will actually use.

**Link**

`See on GitHub`

Link: `https://github.com/softwaremill/tracevault`

### Sandcat

**One-line purpose**

Isolated execution environments for agent workflows with scoped credentials and policy controls.

**What it does**

Sandcat creates ephemeral sandboxes where agents can execute, test, and iterate without inheriting the network access, credentials, or blast radius of a normal developer workstation.

**How we deploy it**

We fit Sandcat to your infrastructure boundaries, define the credential and egress policies with your security team, and make the sandbox flow usable enough that engineers will adopt it.

**Link**

`See on GitHub`

Link: `#start`

### Visdom Machine CI

**One-line purpose**

CI architecture tuned for rapid agent feedback loops rather than human waiting time.

**What it does**

Visdom Machine CI restructures validation pipelines so builds, checks, and feedback loops complete fast enough for machine-driven iteration to be economical.

**How we deploy it**

We review the pipeline bottlenecks in your build graph, rework the validation path with your platform team, and hand over the operating model needed to keep iteration speed high after we leave.

**Link**

`See on GitHub`

Link: `https://virtuslab.com/blog/ai/the-fallacy/`

## 6. The Thesis Behind This

**H2**

`The thesis behind this`

**Main paragraph**

We do not treat AI adoption as a tooling procurement exercise. We start with operating model, capability ownership, verification discipline, and the practical constraints that determine whether agents help or create drag. The Visdom Maturity Matrix gives us the assessment model. Our article series and live Radar make the public case for how engineering teams should evaluate, adopt, and operationalize these patterns.

**Support paragraph**

If you want the implementation path, start with the Matrix. If you want to understand how we think, read the writing and follow the Radar. We use those two bodies of work together: one to structure engagements, the other to keep the thesis grounded in what is actually changing in the ecosystem.

**Left column content**

Matrix methodology panel:

- `60 practices`
- `4 perspectives`
- `5 maturity levels`
- CTA: `Open the Matrix ->`
- Link: `https://visdom-ai-maturity-matrix.pages.dev/matrix/development`

**Right column content**

Supporting writing:

`Supporting writing: 50+ articles across three VirtusLab series, VISDOM, GitHub All-Stars, and AI-Insight.`

**Series intro**

`We publish the practical argument in public, then apply it with client teams in the field.`

**Series cards**

Keep the three current series and links, with lighter framing:

- `VISDOM`
  - Focus: field notes on agent-ready SDLC, context, CI, review, and governance
- `GitHub All-Stars`
  - Focus: what we watch in open source and why it matters
- `AI-Insight`
  - Focus: technical analysis of models, systems, and engineering patterns

## 7. AI Engineering Radar

**H2**

`AI Engineering Radar · Live`

**Subtitle**

We track the AI engineering ecosystem in real time, classify signals by maturity level, and map them back to the Matrix practices. Our clients use the Radar to answer a simple question: what shipped recently that our team should actually evaluate, without assigning someone to do that research full time.

**Stats**

Keep current stats:

- `777 signals`
- `17 areas`
- `354 discoveries`
- `251 releases`

**CTA**

`Open AI-Radar Dashboard`

Link: `https://visdom-ai-maturity-matrix.pages.dev/dashboard`

## 8. Start The Conversation

**H2**

`Start the conversation`

**Preamble**

The fastest way to find out whether we are a good fit is a 20-minute Matrix assessment. We both get a clearer picture of where your organization is now and what the first move should be. After that, we can scope a Foundation engagement or send you on your way with the roadmap. Either outcome is fine with us.

**Primary card**

**Take the 20-minute Matrix Assessment**

60 practices, four perspectives, five maturity levels. No signup, no sales call. You leave with a scored report.

Button: `Start assessment ->`

Link: `https://visdom-ai-maturity-matrix.pages.dev/assessment`

**Secondary card 1**

**Book a Phase 1 scoping call**

30 minutes with the engineers who built Visdom. We will discuss your environment and decide whether a two-week Foundation engagement makes sense.

Button: `Talk to the team ->`

Link: `https://virtuslab.com/contact`

**Secondary card 2**

**Explore the open source**

Start with ViDIA on GitHub. Our deterministic context server is MIT-licensed and self-hostable, and it is the fastest way to see how we think about context before you ever talk to us.

Button: `View on GitHub ->`

Link: `https://github.com/VirtusLab/visdom-developer-intelligence`

## Notes For Implementation

- Keep the existing light visual language, fonts, colors, and button/card patterns.
- Replace the current product-led hero visual with a more consulting-oriented systems or engagement visual.
- Remove product outcome stats from the hero.
- Preserve the current article links and Radar dashboard link.
- Preserve the single-page structure and current Astro stack.
- Replace SaaS-style phrasing so sentence subjects stay with `we` or `your team`, not `Visdom`.
