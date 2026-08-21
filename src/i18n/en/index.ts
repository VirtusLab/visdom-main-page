/**
 * English copy for the home page, the canonical source of the dictionary shape.
 *
 * Every other locale is checked against this object with `satisfies typeof en`,
 * so a key that is missing or misspelled in a translation fails the build
 * instead of silently falling back to English at runtime.
 *
 * What belongs here: text a reader sees, including alt text, aria labels and
 * the strings the contact form puts in an email. What does not: hrefs, colours,
 * icons, SVG geometry, image names and metric values. Those live with the
 * component that draws them, so a translator cannot break the layout.
 *
 * Arrays that pair positionally with visual config in a component are typed as
 * fixed-length tuples. A translation with the wrong number of entries would
 * otherwise drop a card without any error.
 */

type T3<X> = [X, X, X];
type T4<X> = [X, X, X, X];
type T5<X> = [X, X, X, X, X];
type T6<X> = [X, X, X, X, X, X];
type T10<X> = [X, X, X, X, X, X, X, X, X, X];

const en = {
  meta: {
    title: 'Visdom by VirtusLab - How We Build the AI-Native SDLC with Enterprise Teams',
    description:
      'We embed with enterprise platform teams to build the context, CI, review, and governance infrastructure agents actually need. We bring a platform we built, deploy it with your team, and stay on as a long-term partner.',
    siteName: 'Visdom by VirtusLab',
    ogImageAlt:
      'Visdom by VirtusLab: how we build the AI-Native SDLC with enterprise teams',
  },

  nav: {
    ariaPrimary: 'Primary',
    platform: 'Platform',
    /** First item in the Platform dropdown, so the section overview stays reachable from the nav. */
    platformOverview: 'Platform overview',
    insights: 'Insights',
    maturityMatrix: 'Maturity Matrix',
    contact: 'Get in Touch',
    themeToggle: 'Toggle color theme',
    openMenu: 'Open menu',
    languageLabel: 'Language',
  },

  tour: {
    tag: 'Visdom AI Tour',
    aria: 'Visdom AI Tour 2026, see the dates and register',
    nextStop: 'Next stop:',
    /**
     * Month names as written in src/data/tour.ts, mapped for display. A stop
     * whose label is not a bare month (for example "23 September") falls
     * through unchanged and needs an entry added here when it appears.
     */
    months: {
      May: 'May',
      June: 'June',
      September: 'September',
      October: 'October',
    } as Record<string, string>,
  },

  hero: {
    brandTagline: 'AI-Native SDLC Platform',
    headlineLead: 'The Missing Layer Between',
    headlineAccent: 'AI Coding and Production',
    lead: 'Production-ready AI-Native SDLC workflows implemented with your engineering team.',
    cta: 'See how we engage ->',
    trust: ['Fully Customizable', 'Start Small, Scale Fast'] as [string, string],
    visualLabel: 'Forward-Deployed Build Pattern',
    visualTitle: 'We embed, deploy, and partner.',
    steps: [
      {
        phase: 'Phase 1',
        title: 'Assessment',
        detail: 'We assess your current stack, map the gaps, and name the first pilot team.',
      },
      {
        phase: 'Phase 2',
        title: 'Pilot implementation',
        detail:
          'We deploy the kit into your repos, CI, and controls with your platform engineers in the loop.',
      },
      {
        phase: 'Phase 3',
        title: 'Scale and improve',
        detail:
          'We scale the rollout across teams, review architecture, and unblock the edge cases as adoption grows.',
      },
      {
        phase: 'Phase 4',
        title: 'Support',
        detail:
          'An ongoing partnership for architecture reviews and the next maturity step, on predictable terms.',
      },
    ] as T4<{ phase: string; title: string; detail: string }>,
  },

  shift: {
    aria: 'Why AI stalls in human-built delivery infrastructure',
    label: 'The shift',
    title: 'AI got fast. The pipes it runs through did not.',
    subtitle:
      'You rolled out the assistant. Engineers were excited. Then throughput stalled and the ROI faded. The assistant was never the bottleneck. The delivery infrastructure around it was: pipelines, CI, and review built for humans typing at human speed. Plug an AI into that and it does not get fixed, it exposes every crack.',
    changedLabel: 'What changed',
    changedLead: 'AI agents now generate code faster than any human.',
    changedBody:
      'The constraint moved from writing the code to understanding, validating, and safely shipping it.',
    sameLabel: 'What did not change',
    unchanged: [
      {
        dim: 'Context',
        text: "Still lives in someone's head, not in the system. Agents see open files, not the dependency and intent graph.",
      },
      {
        dim: 'Execution',
        text: '45-minute CI built for humans. For an agent iterating fast, more time goes to waiting on the build than writing the code.',
      },
      {
        dim: 'Verification',
        text: 'Tests written by the same agent that wrote the code. Coverage looks great, bugs still ship.',
      },
      {
        dim: 'Validation',
        text: 'PR review that still waits on the same seniors. Spec and merge review turn into hollow rituals.',
      },
    ] as T4<{ dim: string; text: string }>,
    bridge: 'So we built the infrastructure layer AI actually needs.',
  },

  diagnosis: {
    label: 'What Visdom is',
    title: 'The platform for operating AI-Native software delivery.',
    lead: "Visdom is VirtusLab's AI-Native SDLC platform. AI can already write the code; the hard part is shipping it at enterprise scale. Visdom composes the delivery system around the agent (context, review, testing, governance, security, and CI) into one governed pipeline, so your organization can stop demoing agents and start operating them in production.",
    kicker: 'What defines it:',
    pillars: [
      {
        key: 'Composable',
        copy: 'One platform, composable components. Start with any one, expand at your own pace. Context, review, testing, governance, security, and CI, used together or on their own.',
      },
      {
        key: 'Governed',
        copy: 'Changes flow through one system, with policy enforcement and a tamper-evident audit trail end to end. The complete loop, not a drawer of disconnected point tools.',
      },
      {
        key: 'Owned',
        copy: 'Our engineers deploy it inside your repos, CI, and infrastructure, then hand it over. You run the operating capability. Nothing leaves your environment.',
      },
    ] as T3<{ key: string; copy: string }>,
    bridge: 'Here is how a change flows through it.',
  },

  architecture: {
    label: 'How a change flows',
    title: 'One architecture, end to end',
    subtitle: {
      lead: 'Context Fabric feeds the agent system, code, organizational and historical context over MCP, both ways, continuously.',
      beforeLinks: 'The change then clears',
      testing: 'testing',
      review: 'multi-level review',
      security: 'security scanning',
      afterLinks: 'and risk triage;',
      tracing: 'Visdom AI Tracing',
      tail: 'signs every step.',
    },
    svgTitle:
      'Visdom architecture: Context Fabric, Orchestrator, Coding Agent (Cursor, Claude, Codex), Testing, Code Review, Security scanning by Aikido, PR triage and Visdom AI Tracing.',
    /**
     * Labels drawn inside the SVG. These sit in pills of fixed width at fixed
     * coordinates, so a translation that runs much longer than the English will
     * overflow. Product names stay in English in every locale; only the
     * descriptive labels are translated, and any that grow need the pill width
     * in ArchitectureFlow.astro adjusted in the same change.
     */
    diagram: {
      sources: [
        'Jira',
        'Git history',
        'Review comments',
        'Repositories',
        'Docs & ADRs',
        'Owners & on-call',
      ] as T6<string>,
      fabric: 'Visdom Context Fabric',
      fabricTag: 'queried by every stage',
      orchestrator: 'Visdom Orchestrator',
      orchestratorSub: 'powered by Visdom Machine Speed',
      preflight: ['Preflight', 'context'] as [string, string],
      activeContext: ['Active', 'context'] as [string, string],
      agent: ['Coding', 'Agent'] as [string, string],
      sandbox: ['Visdom', 'Sandbox'] as [string, string],
      runsYourAgent: 'Runs your agent',
      testing: 'Visdom Testing',
      testLayers: [
        'Classic tests',
        'Architecture testing',
        'Property-based',
        'Mutation testing',
      ] as T4<string>,
      pullRequest: 'Pull Request',
      review: 'Visdom Code Review',
      reviewLevels: [
        { n: 'L1', label: 'Linting review' },
        { n: 'L2', label: 'Deterministic review' },
        { n: 'L3', label: 'Single-pass LLM' },
        { n: 'L4', label: 'Deep LLM review' },
      ] as T4<{ n: string; label: string }>,
      security: 'Visdom Security',
      securityLayers: ['SAST & DAST', 'Dependencies', 'Secrets & IaC'] as T3<string>,
      poweredBy: 'Powered by',
      triage: 'Triage',
      riskGate: 'Risk gate',
      autofix: 'green · trivial: auto-fix → back to agent',
      highRisk: 'High-risk',
      humanApproval: 'human approval',
      approved: 'approved',
      production: 'Production',
      vault: 'Visdom AI Tracing',
    },
    captions: [
      {
        n: '01',
        t: 'Context Fabric',
        d: 'Jira tickets, git history, old debates, buried docs: everything your team knows, woven into one fabric the agent can actually ask.',
      },
      {
        n: '02',
        t: 'Orchestrator',
        d: 'One orchestrator runs the whole engine room: preflight, the coding agent, testing, review and risk triage all happen inside it. It only stops for a human when risk demands it.',
      },
      {
        n: '03',
        t: 'Preflight context',
        d: 'No cold starts. Before the first line of code, the agent already knows the task, the owners, and the landmines.',
      },
      {
        n: '04',
        t: 'Active context',
        d: 'Who owns this? What breaks if it changes? The agent keeps asking, the Fabric keeps answering. Context never stops flowing.',
      },
      {
        n: '05',
        t: 'Testing layer',
        d: 'Agents love tests that pass. These gates do not care: architecture rules, property-based inputs and mutation testing expose what green CI hides.',
      },
      {
        n: '06',
        t: 'Code review · VCR',
        d: 'VCR reads every PR in CI before any human does: lint, deterministic checks, then LLM passes that know how your repo is actually written.',
      },
      {
        n: '07',
        t: 'Security',
        d: 'Aikido scans the same PR: SAST, DAST, dependencies, secrets and IaC. Reachability analysis mutes what your code never calls; real findings join the risk gate.',
      },
      {
        n: '08',
        t: 'Triage',
        d: 'Not every bug deserves a meeting. The gate scores path, diff and coverage: trivial ones the agent fixes on the spot, the risky ones stop and wait for a human.',
      },
      {
        n: '09',
        t: 'Visdom AI Tracing',
        d: 'Every prompt, decision and test lands in a signed, hash-chained ledger. When the auditor asks, the answer already exists.',
      },
      {
        n: '10',
        t: 'Ship to production',
        d: 'All gates green. The change rolls out with receipts: tested, reviewed, scanned, traced. Ship it and enjoy the moment.',
      },
    ] as T10<{ n: string; t: string; d: string }>,
    /** Accessible name for a caption button. {n} and {t} are substituted. */
    stepAria: 'Show step {n}: {t}',
  },

  orchestrator: {
    label: 'The Orchestrator',
    titleFirst: 'One ticket in.',
    titleSecondBefore: 'One',
    titleAccent: 'pull request',
    titleSecondAfter: 'out.',
    subtitle:
      'Every step is a specialized agent. You see none of that. Production errors, Jira tickets, events: signals go in, the orchestrator does the legwork through the same gates you just saw, and a human signs off only when risk demands it.',
    signalsLabel: 'Incoming signals',
    signals: [
      { key: 'production error', title: 'a service starts failing' },
      { key: 'Jira ticket', title: 'a bug lands in the backlog' },
      { key: 'security advisory', title: 'a CVE hits a dependency' },
    ] as T3<{ key: string; title: string }>,
    human: {
      name: 'Human in the loop',
      idle: 'on call · every step',
      ask: 'quick question',
      answered: 'answered ✓',
      called: 'review red · deciding',
      resolved: 'resolved ✓',
    },
    hubName: 'Orchestrator',
    work: [
      'Context Fabric',
      'testing',
      'security',
      'code review',
      'deployment',
    ] as T5<string>,
    prTitle: 'Pull request',
    prMeta: 'all gates green · fully traced',
    captions: [
      'Signals stream in: errors, tickets, events, advisories.',
      'The orchestrator picks one up and does the legwork.',
      'Mid-flow it pings a human: one quick question, answered.',
      'Code review turns red. The human is back in the loop.',
      'Review green, deployment done. A pull request rolls out.',
    ] as T5<string>,
    ctaLine: 'Want to see the Orchestrator on your stack?',
    ctaButton: 'See Visdom in action!',
  },

  useCases: {
    label: 'Orchestrator at work',
    titleBefore: 'The orchestrator takes the',
    titleAccent: 'night shift',
    subtitle:
      'One orchestrator runs every flow above end to end: it watches, correlates, plans and prepares. The same gates, the same approvals, the same audit trail. People step in only where judgment matters. Where it pays off on day one:',
    cases: [
      {
        tag: 'Incident response',
        title: 'Prod throws 500s at 2 a.m.',
        steps: [
          { t: '02:14', d: 'Alerts fire: error rate spikes on production.' },
          {
            t: '02:31',
            d: 'Logs correlated, root cause pinned, fix drafted and run through every gate.',
          },
          { t: '08:00', d: 'Morning standup reviews a green, fully traced pull request.' },
        ] as T3<{ t: string; d: string }>,
        outcome: 'A pull request, not a Zendesk ticket',
      },
      {
        tag: 'Regression hunt',
        title: 'Error rate doubles on the API',
        steps: [
          { t: '11:02', d: 'The checkout API starts failing twice as often.' },
          {
            t: '11:04',
            d: 'Events correlated across services; the deploy that broke it identified.',
          },
          { t: '11:27', d: 'A proposed fix waits for one click of approval.' },
        ] as T3<{ t: string; d: string }>,
        outcome: 'Root cause before the war room',
      },
      {
        tag: 'Bug reproduction',
        title: 'A customer hits the same bug, twice',
        steps: [
          { t: '14:50', d: 'Support escalates a recurring, hard-to-pin failure.' },
          { t: '15:12', d: 'Replayed from logs and telemetry; a failing test now reproduces it.' },
          { t: '16:05', d: 'The fix ships with a regression test bolted on.' },
        ] as T3<{ t: string; d: string }>,
        outcome: 'Reproduced, fixed, locked for good',
      },
      {
        tag: 'Security patch',
        title: 'A CVE lands in a core library',
        steps: [
          { t: '06:00', d: 'A new vulnerability drops in a dependency you run.' },
          {
            t: '06:18',
            d: 'Affected components mapped, dependency bumped, full gate suite run.',
          },
          { t: '07:02', d: 'A verified upgrade sits ready to merge.' },
        ] as T3<{ t: string; d: string }>,
        outcome: 'Patched in hours, not sprints',
      },
      {
        tag: 'Migration',
        title: 'A deprecated API, used in 214 places',
        steps: [
          {
            t: '09:00',
            d: 'The framework flags an API for removal; your repo calls it everywhere.',
          },
          {
            t: '09:30',
            d: 'Call sites mapped, the mechanical 95% migrated, gates run on every change.',
          },
          { t: '11:45', d: 'Humans review the six call sites that actually needed judgment.' },
        ] as T3<{ t: string; d: string }>,
        outcome: '214 call sites, six human decisions',
      },
      {
        tag: 'CI hygiene',
        title: 'CI fails every third run',
        steps: [
          { t: '16:20', d: 'A flaky test starts blocking every other merge.' },
          { t: '16:35', d: 'The test is quarantined, history bisected, the race condition pinned.' },
          { t: '17:10', d: 'A deterministic fix lands; the merge queue moves again.' },
        ] as T3<{ t: string; d: string }>,
        outcome: 'A test suite you can trust again',
      },
    ] as T6<{
      tag: string;
      title: string;
      steps: T3<{ t: string; d: string }>;
      outcome: string;
    }>,
  },

  solutions: {
    engagementLabel: 'Engagement model',
    engagementTitle: 'How we engage',
    engagementSubtitle:
      'Four phases that build on each other, each delivering working capability you can see and use. Exact scope, pace, and team are agreed with you for every engagement, never off a fixed price list.',
    phases: [
      {
        name: 'Phase 1 - Assessment',
        meta: 'fixed scope',
        body: 'On-site or remote. We run your environment through the Visdom Maturity Matrix and leave you with a prioritized roadmap, the pilot team named, and the next phase scoped. A light touch from your side. If you want to stop here, you walk away with the roadmap and nothing locked in.',
      },
      {
        name: 'Phase 2 - Pilot Implementation',
        meta: 'fixed scope',
        body: 'One pilot team. The components that matter, deployed into your SCM, CI, IdP, and observability stack. A small team of our engineers works alongside your AI champion and platform team. Runbooks, ADRs, and integration code are co-authored from the start. Not as observers, as owners.',
      },
      {
        name: 'Phase 3 - Scale and Improve',
        meta: 'advisory',
        body: 'Scale runs two ways: vertically, as more components come online, and horizontally, as adoption spreads across more teams and the wider organization. The components are hardened and improved as that footprint grows, and architecture reviews, the hard calls, and the awkward exceptions get worked through together.',
      },
      {
        name: 'Phase 4 - Support',
        meta: 'ongoing',
        body: 'An ongoing partnership after transfer, not a payroll line. We stay available for architecture reviews, the hard calls, and the next maturity step, on terms that stay predictable for finance and flexible for engineering.',
      },
    ] as T4<{ name: string; meta: string; body: string }>,
    transferAria: 'Capability transfer across engagement phases',
    transfer: [
      { label: 'Phase 1', strong: 'VirtusLab leads' },
      { label: 'Phase 2', strong: 'Deep collaboration' },
      { label: 'Phase 3', strong: 'Scaled rollout' },
      { label: 'Phase 4', strong: 'We stay on call' },
    ] as T4<{ label: string; strong: string }>,

    platformLabel: 'Platform components',
    platformTitle: 'The platform we bring',
    platformSubtitle:
      'One spine: the Context Fabric. Review, testing, security, and governance all read the same ground truth, so agents and reviewers answer the same questions the same way. Composing, hardening, and integrating them into a regulated enterprise stack is what teams hire us for.',
    readReference: 'Read the reference',

    fabric: {
      title: 'Visdom Context Fabric',
      body: 'Context Fabric delivers tailored context for your planning, coding, and review agents. Agents not only have to perform less discovery each time, but they are also provided with information that is often not accessible without having the broader picture.',
      note: 'Deterministic code expertise, blast radius analysis, and ownership graphs via MCP.',
      readLink: 'Read: "Your README Is a Lie"',
      diagramAria:
        'Visdom Context Fabric ingests repository, documentation, tickets, and CI data, then exposes deterministic ground truth that the Coding Agent, Code Review, and Testing components read over MCP',
      sourcesLabel: 'Sources',
      sources: [
        { name: 'Git repository', meta: 'code · history · blame' },
        { name: 'Confluence / Notion', meta: 'ADRs · runbooks' },
        { name: 'Jira / Linear', meta: 'tickets · ownership' },
        { name: 'CI / Actions', meta: 'builds · artifacts' },
        { name: 'CLAUDE.md / rules', meta: 'conventions' },
      ] as T5<{ name: string; meta: string }>,
      coreName: 'Context Fabric',
      coreDesc: "Ingest · normalize · index the organization's ground truth.",
      outputsLabel: 'Components reading it',
      outputs: [
        { name: 'Coding Agent', meta: 'context · conventions' },
        { name: 'Code Review', meta: 'ownership · blast radius' },
        { name: 'Testing', meta: 'conventions · risk' },
      ] as T3<{ name: string; meta: string }>,
      outputsNote: 'Every Visdom component reads the same ground truth.',
    },

    review: {
      title: 'Visdom Code Review',
      abbr: 'VCR',
      body: 'Code Review provides automated pre-review for AI- and human-authored pull requests. By validating changes against engineering conventions, risk patterns, and common failure modes, reviewers can focus their attention where it matters most.',
      diagramAria: 'Multi-level code review inside a pull request, with risk triage',
      prTag: 'Pull request',
      panelHead: 'Visdom Code Review',
      levels: [
        { n: 'L1', label: 'Linting review' },
        { n: 'L2', label: 'Deterministic review' },
        { n: 'L3', label: 'Single-pass LLM' },
        { n: 'L4', label: 'Deep LLM review' },
      ] as T4<{ n: string; label: string }>,
      triageHead: 'Triage',
      riskGate: 'Risk gate',
      human: 'Human in the loop',
    },

    testing: {
      title: 'Visdom Testing',
      body: 'Testing introduces validation layers that go beyond traditional unit tests and coverage metrics. By combining architecture testing, property-based testing, and mutation testing, it uncovers defects that conventional testing approaches often miss.',
      note: 'Adaptive test shape tuned to your architecture, with architecture gates that stop AI from drifting.',
      diagramAria:
        'Visdom Testing techniques: classic, architecture, property-based, and mutation testing',
      panelHead: 'Visdom Testing',
      techniques: [
        'Classic tests',
        'Architecture testing',
        'Property-based',
        'Mutation testing',
      ] as T4<string>,
    },

    tracing: {
      title: 'Visdom AI Tracing',
      body: 'Captures AI interactions across the software delivery lifecycle, enforces policies, and provides a tamper-evident audit trail. The flight recorder for operating AI systems with accountability and full visibility.',
      noteStrong: 'Ed25519-signed, hash-chained records',
      noteRest:
        'with line-by-line AI attribution, mapped to EU AI Act, SR 11-7, SOX, PCI-DSS, and DORA.',
      capabilities: [
        { label: 'Trace', desc: 'Session traces, token usage, tool calls, secret redaction' },
        { label: 'Enforce', desc: 'Model allowlists, path protection, token budgets' },
        { label: 'Audit', desc: 'Ed25519 signatures, hash-chained records, SOX/PCI-DSS' },
        { label: 'Evaluate', desc: 'Auto-evaluation, model distribution, adoption patterns' },
        { label: 'Attribute', desc: 'Line-by-line AI code attribution via tree-sitter' },
      ] as T5<{ label: string; desc: string }>,
    },

    security: {
      title: 'Visdom Security',
      body: 'Security provides guardrails for your AI agents and delivery workflows. Agents can operate safely with controlled access to systems, credentials, and resources while generated changes are continuously validated against security policies.',
      notePoweredBy: 'Powered by',
      noteSandbox: 'Visdom Sandbox',
      noteContainment: '(containment) and',
      noteAikido: 'Aikido',
      noteRest:
        '(AppSec): ephemeral isolated sandboxes with scoped credentials and egress allowlists, plus reachability-based scanning built for agentic workflows.',
      diagramAria:
        'Visdom Sandbox runs the agent in isolation; only approved traffic crosses the egress wall, so data stays contained and production is unreachable',
      caption: 'Two layers, one protection model.',
      sandboxHead: 'Visdom Sandbox · runtime containment',
      agentTag: 'Agent',
      agentDesc: 'isolated ephemeral sandbox · execute · test · iterate',
      egressOk: 'egress wall lets out: package registries · LLM APIs',
      egressNo: 'your data · secrets · production → 403',
      secretsNote: 'Real secrets stay outside the sandbox, injected only on approved calls.',
      aikidoHead: 'Aikido · AppSec scanning',
      aikidoNote: 'Every change the agent produces is scanned before it merges:',
      chips: [
        'SAST · code',
        'SCA · dependencies',
        'DAST · APIs',
        'Secrets',
        'IaC · cloud',
      ] as T5<string>,
      reachability: 'reachability triage surfaces only exploitable findings',
    },

    machineCi: {
      title: 'Visdom Machine CI',
      badge: 'Coming Soon',
      body: 'Machine CI provides continuous integration optimized for AI-native software delivery. By reducing build times and feedback cycles, it enables agents to operate at machine speed without being constrained by traditional CI pipelines.',
      builtOn: 'Built on',
      readLink: 'Read: "The Ferrari Engine in a Fiat 500"',
      metrics: [
        {
          label: 'Build time reduction',
          note: 'Global logistics, Scala monorepo, sbt -> Bazel. 40-60 min -> 5 min.',
        },
        {
          label: 'PR merge time',
          note: 'Investment bank, Scala monorepo, managed IntelliJ IDEA.',
        },
        {
          label: 'Agent iteration speed (target)',
          note: "Target cadence for coding agents - the speed today's pipelines need to keep up with.",
        },
      ] as T3<{ label: string; note: string }>,
      footnoteBefore: 'Client names under NDA. Full write-ups on the',
      footnoteLink: 'VirtusLab success stories',
      footnoteAfter: 'page.',
    },
  },

  results: {
    label: 'Track record',
    title: 'The experience behind Visdom',
    subtitleBefore:
      "These are VirtusLab's own results from building platform tooling and optimizing delivery, not Visdom product metrics. They are the track record we draw on to build it. Clients under NDA, with full write-ups on the",
    subtitleLink: 'VirtusLab success stories',
    subtitleAfter: 'page.',
    items: [
      {
        headline: 'reduction in PR merge time',
        client: 'for a leading investment bank',
        detail: 'Scala monorepo, managed IntelliJ IDEA solution.',
      },
      {
        headline: 'decrease in pod count for a single workload',
        client: 'for a global hospitality leader',
        detail: 'Workload right-sizing across the platform footprint.',
      },
      {
        headline: 'reduction in build times',
        client: 'for a global freight forwarder',
        detail: 'Scala monorepo migrated from sbt to Bazel, 40-60 min down to ~5 min.',
      },
    ] as T3<{ headline: string; client: string; detail: string }>,
    photoAlt:
      'VirtusLab engineers at an AI infrastructure conference, in Can Your AI Agents Actually Ship shirts.',
    photoCaption: 'Out in the field on the Visdom AI Tour.',
  },

  /** Credibility block, mirrored from the other Visdom property. */
  builtBy: {
    title: 'Built by VirtusLab',
    body: "VirtusLab's engineers spent over a decade helping organizations solve software delivery and developer productivity challenges at scale. We maintain core open-source infrastructure (Scala toolchain, Metals, Scala CLI), contribute to the JVM ecosystem, and build production-grade tooling where the cost of getting it wrong is high.",
    stats: [
      { value: '15+', label: 'years on market' },
      { value: '500', label: 'engineers' },
      { value: 'Open Source', label: 'in DNA' },
      { value: 'Scala & JVM', label: 'core contributors' },
    ] as T4<{ value: string; label: string }>,
  },

  partners: {
    badge: 'partnerships & technologies',
    title: 'Trusted Across the Modern Stack.',
    body: 'VirtusLab maintains deep technical partnerships with the tools and platforms that power modern engineering at scale. We actively contribute to these ecosystems, bringing hands-on expertise to organizations modernizing software delivery and engineering operations.',
    cta: 'See Visdom in action!',
    /** Accessible name for the logo grid. */
    gridAria: 'Tools and platforms VirtusLab partners with',
  },

  writing: {
    label: 'Writing in the open',
    title: 'We work in the open and share what we learn.',
    subtitle:
      '50+ articles across three series, written by the engineers building the AI-native SDLC and published openly for the wider community.',
    latestLabel: 'Latest',
    linkLabel: 'Read the latest article',
    series: [
      {
        description: 'Field notes on the AI-Native SDLC, context, CI, review, and governance.',
      },
      { description: 'What we watch on GitHub and why it matters.' },
      { description: 'Technical analysis of models, systems, and engineering patterns.' },
    ] as T3<{ description: string }>,
  },

  maturity: {
    aria: 'Maturity model',
    label: 'Maturity model',
    title: 'The AI Maturity Matrix',
    lead: 'The framework we scope every engagement with. It shows where your SDLC stands today, and what the first two weeks should target.',
    shotAria: 'Open the AI Maturity Matrix',
    shotAlt:
      'The AI Maturity Matrix for Development: capabilities scored across five levels from Ad-hoc to Autonomous, with L4 Optimized as the target.',
    shotHint: 'Explore the live matrix',
    ladder: {
      heading: 'Where does your organization stand?',
      lead: 'The Visdom Maturity Matrix maps 60 practices across 4 perspectives and 5 maturity levels.',
      /** Level names are the Matrix framework's own vocabulary and stay in English. */
      levels: [
        { id: 'L1', name: 'Ad-hoc' },
        { id: 'L2', name: 'Guided' },
        { id: 'L3', name: 'Systematic' },
        { id: 'L4', name: 'Optimized' },
        { id: 'L5', name: 'Autonomous' },
      ] as T5<{ id: string; name: string }>,
      perspectives: ['Development', 'Delivery', 'Organization', 'Infrastructure'] as T4<string>,
      assessmentCta: 'Take the Self-Assessment',
      matrixCta: 'Explore the Full Matrix',
    },
    publicationAria: 'Companion publication to the AI Maturity Matrix',
    publicationLabel: 'Companion read',
    publicationLevel: 'L4 · Optimized',
    /** The article's real English title. Never translated: the link goes to an English text. */
    publicationTitle: 'AI Works Great. At Level Four.',
    publicationBlurb:
      'The thesis behind the Matrix: why AI delivers on its promise only once the infrastructure around it reaches L4, and what it takes to get there.',
    publicationCta: 'Read the article',
  },

  cta: {
    label: 'Next move',
    /**
     * Names the product and the thing being booked. The section used to open on
     * "Skip the deck", which read as a generic call and left a reader who landed
     * here mid-page unsure what they were signing up for: this site also links to
     * the Maturity Matrix, and Matrix sessions are booked on the Matrix site, not
     * in this form.
     */
    title: 'See Visdom in your engineering context.',
    subtitle:
      "Book a 30-minute guided session with our engineers. Tell us where you see friction or gaps in your SDLC, and we'll focus the demo on the Visdom capabilities most relevant to your environment.",
    /** Its own paragraph, as approved: the composability point is a separate promise. */
    subtitleComposable:
      'Visdom is composable - you can start with what you need, without adopting the entire platform.',
    form: {
      title: 'Book a guided Visdom session',
      body: "Share your biggest SDLC challenge and we'll tailor the session to your engineering environment.",
      nameLabel: 'Name',
      companyLabel: 'Company',
      emailLabel: 'Work email',
      messageLabel: 'What are you trying to ship?',
      optional: 'optional',
      submit: 'See Visdom in action!',
      /** Live region states while the request is in flight and after it lands. */
      sending: 'Sending...',
      /**
       * The approved success sentence, split across the panel's heading and body
       * rather than reworded: it replaces the form now instead of sitting under
       * it, so it needs a heading, but the wording is the one that was signed off.
       *
       * The confirmation it promises is sent by the HubSpot form's own settings,
       * which this repo cannot see. If that follow-up is off in the portal, this
       * line is a promise the site does not keep.
       */
      successTitle: 'Thanks.',
      success: 'An engineer will reply within one business day, and a confirmation is on its way to your inbox.',
      /** Reopens the form, for a mistyped address or a second request. */
      successAgain: 'Send another request',
      error: 'We could not send that. Please try again, or write to visdom@virtuslab.com.',
      errorRef: 'Reference:',
      /** Shown if the endpoint is unreachable, e.g. on a static-only deploy. */
      errorFallback: 'Write to visdom@virtuslab.com',
      errorCaptcha: 'Please complete the verification and try again.',
    },
    /**
     * The two routes for a reader who is not ready to book. Deliberately one
     * quiet line rather than the two cards that used to sit beside the form:
     * both destinations are already pitched properly earlier on this page
     * (MaturityLadder and MaturityRef for the Matrix, the #insights section for
     * the writing), so repeating them at the decision point only competed with
     * the form. Keeping the Matrix exit here also keeps the two bookings apart:
     * this form books a Visdom session, the Matrix link books a Matrix one.
     */
    alt: {
      lead: 'Not ready for a call?',
      matrix: 'Run the Matrix yourself',
      writing: 'Read our engineering writing',
    },
    footnoteBefore: 'Prefer plain email?',
    footnoteAfter: 'Replies come from an engineer, within one business day.',
  },

  footer: {
    /** The brand line in the footer's left slot, next to the "Visdom" wordmark. */
    poweredBy: 'Powered by VirtusLab',
    links: [
      { label: 'VirtusLab' },
      { label: 'GitHub' },
      { label: 'Blog' },
      { label: 'Contact' },
    ] as T4<{ label: string }>,
  },
};

export default en;
