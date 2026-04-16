# Visdom Main Page - Design Spec

## Overview

Standalone landing page for the Visdom platform (visdom.virtuslab.com or similar).
Built as a static site using the Vived Engine design language (dark theme, glassmorphism, Montserrat + JetBrains Mono).

**Primary goal**: Convert engineering leaders and CTOs who know they have an "AI adoption without infrastructure" problem into qualified conversations.

**Secondary goal**: Build bottom-up credibility with senior engineers through OSS, technical content, and tools they can try today.

---

## Tech Stack

- **Framework**: Astro (matches visdom-code-review, static export, fast)
- **Styling**: Tailwind CSS 4
- **Fonts**: Montserrat (headings), Inter (body), JetBrains Mono (code)
- **Animations**: CSS animations (no Framer Motion dependency for a landing page)
- **Deployment**: GitHub Pages or Cloudflare Pages (static)
- **Design language**: Vived Engine reference
  - Dark background: `#181823`
  - Surface: `#21212d`
  - Primary accent: emerald `#10b981` (Visdom brand green, consistent with Code Review + Maturity Matrix)
  - Secondary accent: blue `#0693e3` to purple `#9b51e0` gradient (Vived Engine signature)
  - Glassmorphism: `backdrop-blur-xl bg-white/5 border border-white/10`
  - Pill-shaped CTAs with hover lift

---

## Page Structure (Full)

```
1. Nav (sticky, glassmorphism)
2. Hero (problem-first)
3. Three Pillars (Context Fabric / Machine-Speed CI / Risk Assessment)
4. Solutions (Dual-Layer: journey + product cards)     ← MAIN FOCUS
5. Thought Leadership (3 blog series)                  ← NEW
6. Social Proof (metrics + engagement timeline)
7. CTA (graduated: Try ViDIA / Book Assessment / Contact)
8. Footer
```

This spec focuses on sections 4 and 5 as requested.

---

## Section 4: Our Solutions (Dual-Layer)

### Section Header

```
"From Assessment to Autonomous Delivery"

Each solution works standalone.
Together, they form an AI-Native SDLC.
```

### Journey Timeline (Layer 1)

Horizontal timeline with 4 phases, connected by a gradient line.
Each phase is a clickable anchor that scrolls to the product cards below.

```
───[1. ASSESS]────[2. ENABLE]────[3. BUILD]────[4. VALIDATE]───
    Where are      Make your       Equip your     Trust what
    you today?     infra ready     agents         ships
```

Phase colors (gradient from left to right):
- ASSESS: blue (`#3b82f6`)
- ENABLE: purple (`#8b5cf6`)
- BUILD: emerald (`#10b981`)
- VALIDATE: amber (`#f59e0b`)

On mobile: vertical timeline instead of horizontal.

### Product Cards (Layer 2)

Each phase contains 1-3 product cards. Cards use glassmorphism style.

---

#### Phase 1: ASSESS

**Card: Visdom Maturity Matrix**

```
Tags: [Interactive Tool] [Self-Assessment]

Title: Visdom Maturity Matrix
Subtitle: AI-Native SDLC Assessment

Problem: "You can't optimize what you can't measure. Most teams
don't know where they stand on AI readiness."

Capabilities:
- 60 practices across 4 perspectives
- 5 maturity levels (Ad-hoc to Autonomous)
- Self-assessment questionnaire + workshop mode
- Perspectives: Development, Delivery, Organization, Infrastructure

Metric highlight:
  ┌────────────────────────────────┐
  │  60 practices | 4 perspectives │
  │  5 levels | Based on 15+ years │
  │  of enterprise engagements     │
  └────────────────────────────────┘

CTAs: [Try the Assessment →] [Explore the Matrix →]
Links to: virtus-lab-ai-maturity-matrix deployment
```

---

#### Phase 2: ENABLE

**Card: Context Fabric**

```
Tags: [Infrastructure] [AI-Native]

Title: Context Fabric
Subtitle: Structured, agent-consumable context

Problem: "AI agents hallucinate when they can't see your codebase.
Context Fabric makes your repositories, standards, and architecture
machine-readable."

Capabilities:
- Structured context built across repositories and teams
- Agent-consumable documentation and architecture maps
- Governance rules auto-detected from 16+ config sources
- CLAUDE.md / .cursorrules / AGENTS.md export

Code snippet (glassmorphism terminal):
  $ vidia init
  Scanning repository...
  Detected: pyproject.toml, .pre-commit-config.yaml,
            GitHub Actions, Docker Compose, ArchUnit
  Found 23 rules across 6 categories.
  Exported to CLAUDE.md ✓

CTAs: [View on GitHub →]
```

**Card: Machine-Speed CI**

```
Tags: [Infrastructure] [Performance]

Title: Machine-Speed CI
Subtitle: CI built for agent iteration speed

Problem: "Your CI takes 45 minutes. An AI agent iterates 50x
per hour. Do the math - your pipeline is the bottleneck."

Capabilities:
- High-frequency validation loops for rapid agent feedback
- Build time optimization (Bazel, Gradle, Maven expertise)
- Monorepo enablement for large-scale agent workflows
- CI/CD re-architecture for agent-native development

Metric highlight:
  ┌─────────────────────────────────────┐
  │  88% build time decrease            │
  │  (freight logistics company)        │
  │                                     │
  │  43% PR merge time reduction        │
  │  (investment bank)                  │
  └─────────────────────────────────────┘

CTAs: [Read: "The Ferrari Engine in a Fiat 500" →]
```

---

#### Phase 3: BUILD

**Card: ViDIA - Developer Intelligence Agent**

```
Tags: [Open Source] [MCP-Compatible] [CLI]

Title: ViDIA
Subtitle: Developer Intelligence Agent

Problem: "Who knows this code? What breaks if I change it?
Why was it built this way? Your agents need answers before
they touch a single line."

Capabilities:
- Expert discovery via git history (scored by blame, frequency, recency)
- Blast radius analysis before any change
- PR discussion indexing for architectural decisions
- 16+ governance rule detectors
- Deterministic SHA256-pinned snapshots
- MCP Server for Claude Desktop / Cursor

Code snippet (glassmorphism terminal):
  $ vidia expert src/auth/login.py
  ┌─────────────────────────────────┐
  │ Expert: @jkowalski (score: 0.87)│
  │ Last touch: 3 days ago          │
  │ Bus factor: 1 ⚠                │
  │ Blast radius: 12 files          │
  └─────────────────────────────────┘

CTAs: [View on GitHub →] [Try MCP Server →] [Read Docs →]
```

**Card: Agent Skills**

```
Tags: [Open Source] [Anthropic Spec]

Title: Agent Skills Library
Subtitle: Curated skills for AI coding agents

Problem: "Every team writes the same CLAUDE.md rules from scratch.
We maintain battle-tested skills so you don't have to."

Capabilities:
- Following Anthropic Agent Skills specification
- Java best practices and coding standards
- IDE-agnostic (.claude, .cursor, .gemini, .kiro support)
- Community-maintained, enterprise-tested

CTAs: [Browse Skills on GitHub →]
```

**Card: Reference Architectures**

```
Tags: [Blueprint] [Open Source]

Title: Reference Architectures
Subtitle: Battle-tested blueprints for agentic systems

Problem: "Building an agentic system from scratch?
Start from a proven architecture, not a blank canvas."

Capabilities:
- Insurance Underwriting: full C4 architecture (context to code level)
  - Ingestion & parsing, data enrichment, risk & pricing engine
  - Agentic orchestration with human-in-the-loop
  - 4 reference implementations on GitHub
- More verticals coming

CTAs: [Explore Insurance Architecture →] [View C4 Diagrams →]
```

---

#### Phase 4: VALIDATE

**Card: Visdom Code Review (VCR)**

```
Tags: [Framework] [Process] [Multi-Layer]

Title: Visdom Code Review
Subtitle: Multi-layered AI Review Pipeline

Problem: "45% of AI-generated code contains OWASP vulnerabilities.
Your seniors spend 30-50% of their time reviewing PRs.
This doesn't scale."

Capabilities (4 layers):
- L0: Context Collection - deterministic, <10s
- L1: Deterministic Gate - linters, SAST, secrets - <60s
      Cannot be prompt-injected
- L2: AI Quick Scan - risk classification, max 5 findings - <2min
- L3: AI Deep Review - Review Lenses, full analysis - <10min

Visual: Layer diagram with timing
  L0 ──[<10s]──▶ L1 ──[<60s]──▶ L2 ──[<2min]──▶ L3 ──[<10min]──▶ PR Comment

Metric highlight:
  ┌─────────────────────────────────────┐
  │  $0.05 per LOW-risk PR              │
  │  vs. hours of senior engineer time  │
  │                                     │
  │  4 layers, each catching what       │
  │  the previous one can't             │
  └─────────────────────────────────────┘

Three audience links:
  [For Leaders →] [For Platform Engineers →] [For Developers →]

CTAs: [Read the Framework →] [See Before/After Scenarios →]
```

---

### Card Component Design (Vived Engine style)

```css
/* Glassmorphism card */
.solution-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
}

.solution-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Terminal snippet */
.terminal-snippet {
  background: #0d0d14;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  padding: 16px 20px;
}

/* Tags */
.tag {
  background: rgba(16, 185, 129, 0.1);  /* emerald */
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
}

.tag--oss {
  background: rgba(6, 147, 227, 0.1);  /* blue */
  color: #0693e3;
  border-color: rgba(6, 147, 227, 0.2);
}
```

### Card Layout

- Desktop: 2 columns for phases with 2 cards, full-width for phases with 1 card
- Tablet: 1 column, cards stack
- Mobile: 1 column, simplified (collapse code snippets behind "Show code" toggle)

---

## Section 5: Thought Leadership (Blog Series)

### Section Header

```
"Engineering Insights, Not Marketing Fluff"

Three series. 50+ articles. Written by engineers, for engineers.
```

### Layout: 3 Series Cards side-by-side

Each series card shows: series icon/illustration, title, description, article count, and the **latest edition** as a featured link plus 2-3 more recent ones.

---

**Series 1: VISDOM - The AI-Native SDLC**

```
Icon: Circuit board / neural network pattern
Color accent: Emerald (#10b981)

Description:
"Deep dives into what it takes to make your software delivery
pipeline ready for AI agents. No hype, just hard-won lessons
from real enterprise engagements."

Latest edition (featured, larger):
  "AI in the SDLC: Faster or Just Busier?"
  Apr 10, 2026
  → https://virtuslab.com/blog/ai/ai-in-the-sdlc-faster-or-just-busier/

Also recent:
  - "Cognitive Debt: The code nobody understands" (Apr 10)
    → /blog/ai/cognitive-debt-the-code-nobody-understands/
  - "Your README Is a Lie" (Apr 7)
    → /blog/ai/the-hard-truth/
  - "The Ferrari Engine in a Fiat 500" (Mar 31)
    → /blog/ai/the-fallacy/

Stats: 10+ articles | Series ongoing

CTA: [Read the VISDOM series →]
Link: https://virtuslab.com/blog/ai/
```

**Series 2: GitHub All-Stars**

```
Icon: Star / telescope pattern
Color accent: Blue (#0693e3)

Description:
"Every edition, we dissect a trending open-source AI project.
Architecture deep-dives, not README summaries. 16 editions
and counting."

Latest edition (featured, larger):
  "#16: Project N.O.M.A.D. - Civilization in a Docker Container"
  Mar 25, 2026
  → https://virtuslab.com/blog/ai/project-nomad/

Also recent:
  - "#15: jCodeMunch MCP - When your Agent stops reading" (Mar 11)
    → /blog/ai/code-munch-mcp-your-agent-starts-navigating/
  - "#14: NanoClaw - Your Personal AI Butler" (Feb 25)
    → /blog/ai/nano-claw-your-personal-ai-butler/

Stats: 16 editions | Published biweekly since Aug 2025

CTA: [Browse All-Stars →]
Link: https://virtuslab.com/blog/ai/
```

**Series 3: AI-Insight**

```
Icon: Lightbulb / radar pattern
Color accent: Purple (#9b51e0)

Description:
"Monthly curations of what top engineers actually read about AI.
Plus deep technical explainers on MCP, RAG, model evaluation,
and agentic testing."

Latest edition (featured, larger):
  "Interview with Krzysztof Grajek, lead engineer behind TraceVault"
  Apr 13, 2026
  → https://virtuslab.com/blog/ai/interview-with-krzysztof-grajek-lead-engineer-behind-trace-vault/

Also recent:
  - "How to improve your RAG: Move Beyond Flat Vector Stores" (Feb 16)
    → /blog/ai/how-to-improve-your-rag/
  - "Best generative AI models at the beginning of 2026" (Jan 27)
    → /blog/ai/best-gen-ai-beginning-2026/

Stats: 13+ articles | Monthly cadence

CTA: [Read AI-Insights →]
Link: https://virtuslab.com/blog/ai/
```

### Series Card Design

```css
.series-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
  position: relative;
  overflow: hidden;
}

/* Gradient accent at top */
.series-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--series-color);
}

/* Article list */
.series-card .article-link {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  transition: color 0.2s;
}

.series-card .article-link:hover {
  color: #ffffff;
}

.series-card .article-date {
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  white-space: nowrap;
}
```

### Series Card - Featured Article Treatment

The latest edition in each series gets a **featured treatment** inside the card:

```
┌─────────────────────────────────────────────┐
│ ▌ VISDOM - The AI-Native SDLC    10+ arts │
│                                              │
│ "Deep dives into what it takes..."           │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ LATEST                                   │ │
│ │                                          │ │
│ │ AI in the SDLC: Faster or Just Busier?   │ │
│ │ Apr 10, 2026                     Read →  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│  Cognitive Debt: The code nobody...  Apr 10  │
│  Your README Is a Lie                Apr 7   │
│  The Ferrari Engine in a Fiat 500    Mar 31  │
│                                              │
│              [Read the VISDOM series →]       │
└─────────────────────────────────────────────┘
```

Featured article card inside series card uses slightly lighter glassmorphism (`bg-white/5`).

### Layout
- Desktop: 3 columns, equal height
- Tablet: 2 + 1 layout
- Mobile: Horizontal scroll (snap) or stacked accordion

---

## Section 6: AI-Radar (Live Intelligence Feed)

Placed directly below the blog series. Full-width banner card with live stats.

### Content

```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ◉ LIVE    AI Engineering Radar                                   │
│                                                                   │
│  Tracking the AI engineering ecosystem in real-time.              │
│  777 signals across 17 areas, automatically discovered            │
│  and classified by maturity level.                                │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │   777    │  │    17    │  │   354    │  │   251    │         │
│  │ signals  │  │  areas   │  │discoveries│  │ releases │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│                                                                   │
│  Top tracked areas:                                               │
│  Coding agents (211) · MCP integration (143) ·                    │
│  Context engineering (116) · Agent sandboxing (85) ·              │
│  Observability (48) · Governance (37)                             │
│                                                                   │
│         [Open AI-Radar Dashboard →]                               │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

Link: https://visdom-ai-maturity-matrix.pages.dev/dashboard

### Design

```css
.radar-banner {
  background: linear-gradient(135deg,
    rgba(16, 185, 129, 0.08),   /* emerald tint */
    rgba(6, 147, 227, 0.08),    /* blue tint */
    rgba(155, 81, 224, 0.08)    /* purple tint */
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 48px;
}

/* Live indicator - pulsing green dot */
.live-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
}

/* Stat boxes */
.radar-stat {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px 24px;
  text-align: center;
}

.radar-stat .number {
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
}

.radar-stat .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### What AI-Radar Tracks (for tooltip/expandable)
- **Discoveries**: New tools, frameworks, and projects in the AI engineering space
- **Releases**: Version updates across the ecosystem (LLMs, agents, MCP tools)
- **Articles**: Industry analysis and think pieces
- **Discussions**: Community conversations and debates
- Classified by maturity level (L1 Ad-hoc to L5 Autonomous)
- Mapped to 17 areas: coding agents, MCP, context engineering, sandboxing, observability, governance, build systems, code review, knowledge management, AI adoption, tech debt, testing, and more

---

## Section 7: Maturity Matrix Reference (Bottom CTA)

Full-width section at the bottom of the page, before the footer. Serves as both
a reference to the full Maturity Matrix tool and a secondary CTA for assessment.

### Content

```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Where does your organization stand?                              │
│                                                                   │
│  The Visdom Maturity Matrix maps 60 practices across              │
│  4 perspectives and 5 maturity levels - from Ad-hoc               │
│  to Autonomous.                                                   │
│                                                                   │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                   │
│  │ L1  │──│ L2  │──│ L3  │──│ L4  │──│ L5  │                   │
│  │Ad-hoc│ │Guided│ │Syst.│ │Optim.│ │Auton.│                   │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘                   │
│   zinc     teal    emerald   green    green                       │
│                                                                   │
│  4 perspectives:                                                  │
│  Development · Delivery · Organization · Infrastructure           │
│                                                                   │
│  [Take the Self-Assessment →]  [Explore the Full Matrix →]       │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

Links:
- Self-Assessment: https://visdom-ai-maturity-matrix.pages.dev/assessment
- Full Matrix: https://visdom-ai-maturity-matrix.pages.dev/matrix/development
- Main site: https://visdom-ai-maturity-matrix

### Design

```css
.maturity-ref {
  background: linear-gradient(180deg,
    rgba(16, 185, 129, 0.05) 0%,
    rgba(16, 185, 129, 0.02) 100%
  );
  border-top: 1px solid rgba(16, 185, 129, 0.15);
  padding: 80px 0;
}

/* Level badges - reuse Maturity Matrix color scheme */
.level-badge {
  border-radius: 8px;
  padding: 12px 20px;
  text-align: center;
  font-weight: 600;
}
.level-badge--l1 { background: rgba(113, 113, 122, 0.2); color: #a1a1aa; }
.level-badge--l2 { background: rgba(13, 148, 136, 0.2); color: #2dd4bf; }
.level-badge--l3 { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.level-badge--l4 { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
.level-badge--l5 { background: rgba(74, 222, 128, 0.2); color: #86efac; }

/* Connecting line between levels */
.levels-timeline {
  display: flex;
  align-items: center;
  gap: 0;
}
.levels-timeline .connector {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg,
    var(--from-color),
    var(--to-color)
  );
}
```

---

## Updated Page Structure (Full)

```
1. Nav (sticky, glassmorphism)
2. Hero (problem-first)
3. Three Pillars (Context Fabric / Machine-Speed CI / Risk Assessment)
4. Solutions (Dual-Layer: journey + product cards)
5. Thought Leadership (3 blog series with latest editions)
6. AI-Radar (live intelligence feed banner)                    ← NEW
7. Maturity Matrix Reference (bottom CTA with level timeline)  ← NEW
8. Social Proof (metrics + engagement timeline)
9. CTA (graduated: Try ViDIA / Book Assessment / Contact)
10. Footer
```

---

## Complete Article Inventory

### VISDOM Series (AI-Native SDLC)
| # | Title | Date |
|---|-------|------|
| 1 | Interview with Artur Skowronski, lead of VISDOM | Mar 24, 2026 |
| 2 | The Ferrari Engine in a Fiat 500 | Mar 31, 2026 |
| 3 | Your README Is a Lie | Apr 7, 2026 |
| 4 | Cognitive Debt: The code nobody understands | Apr 10, 2026 |
| 5 | AI in the SDLC: Faster or Just Busier? | Apr 10, 2026 |
| 6 | Agents for Legacy Code migration | Mar 10, 2026 |
| 7 | Do you need an AI Agent? | Jan 29, 2026 |
| 8 | How To Write Rules for AI Coding Tools | Dec 11, 2025 |
| 9 | How to Test and Evaluate Agentic Systems | Dec 11, 2025 |
| 10 | Monorepo in Enterprise: Security, Myths, and Real Benefits | Mar 25, 2026 |

### GitHub All-Stars (16 editions)
| # | Title | Date |
|---|-------|------|
| 16 | Project N.O.M.A.D. - Civilization in a Docker Container | Mar 25, 2026 |
| 15 | jCodeMunch MCP - Agent stops reading, starts navigating | Mar 11, 2026 |
| 14 | NanoClaw - Your Personal AI Butler in a Container Cage | Feb 25, 2026 |
| 13 | Matchlock - Your Agent's Bulletproof Cage | Feb 11, 2026 |
| 12 | Beads - How to Give an AI Goldfish a Memory | Jan 21, 2026 |
| 11 | vibe-kanban - a Kanban board for AI agents | Jan 7, 2026 |
| 10 | llm-council - AI Consensus mechanism | Dec 3, 2025 |
| 9 | git-rewrite-commits - AI to the Rescue of Chaotic Git | Nov 19, 2025 |
| 8 | toon - Cutting LLM costs in the protocol layer | Oct 29, 2025 |
| 7 | Paper2Agent - Research papers to working code | Oct 15, 2025 |
| 6 | Dayflow - Your Day's Private "Git Log" | Oct 1, 2025 |
| 5 | Spec-Kit - GitHub tames AI-coding chaos | Sep 24, 2025 |
| 4 | CopilotKit - Solving the "Last Mile" for AI Agents | Sep 17, 2025 |
| 3 | LangExtract - Google Turns Chaos into Data with Gemini | Sep 10, 2025 |
| 2 | Mem0 - Creating memory for stateless AI minds | Sep 3, 2025 |
| 1 | deepagents - Architecture of Deep Reasoning for Agentic AI | Aug 27, 2025 |

### AI-Insight
| # | Title | Date |
|---|-------|------|
| 1 | Interview with Krzysztof Grajek, lead of TraceVault | Apr 13, 2026 |
| 2 | How We Got FP16 GPU Tests on GitHub Actions - Without a GPU | Mar 6, 2026 |
| 3 | How to improve your RAG: Move Beyond Flat Vector Stores | Feb 16, 2026 |
| 4 | Best generative AI models at the beginning of 2026 | Jan 27, 2026 |
| 5 | NeurIPS 2025 Best Papers part 2: 1000 Layer Networks | Feb 6, 2026 |
| 6 | NeurIPS 2025 Best Papers part 1: Gated Attention | Jan 20, 2026 |
| 7 | Understanding How Claude Code Works | Nov 12, 2025 |
| 8 | Running a Pragmatic AI Hackathon | Oct 23, 2025 |
| 9 | What top engineers read - September 2025 | Oct 13, 2025 |
| 10 | What top engineers read - August 2025 | Sep 5, 2025 |
| 11 | AI glossary | Sep 12, 2025 |
| 12 | How MCP and LLM tool calls work | Aug 11, 2025 |
| 13 | What top engineers read - July 2025 | Aug 12, 2025 |

### Also notable (Insurance AI series, not in main 3 but linkable)
| # | Title | Date |
|---|-------|------|
| 1 | Secure by design for Agentic AI in Insurance | Mar 24, 2026 |
| 2 | AI agents in accelerating insurance underwriting | Sep 16, 2025 |
| 3 | Human-in-the-loop in Agentic AI Underwriting | Sep 9, 2025 |
| 4 | Digitalization and AI in Insurance | Sep 2, 2025 |

---

## Design Decisions

### Why Astro (not Next.js)
- visdom-code-review already uses Astro + Tailwind - consistency
- Static landing page doesn't need React runtime
- Astro islands if we need interactivity (e.g., maturity matrix widget)
- Faster load times, better SEO

### Why Vived Engine style (not Maturity Matrix style)
- User explicitly requested Vived Engine as reference
- Dark theme conveys technical credibility (every dev tool uses dark mode)
- Glassmorphism + gradients feel modern without being flashy
- Maturity Matrix emerald green is used as accent - bridges both

### Why Dual-Layer for Solutions
- From competitive research: Cognizant Neuro AI does this best among consultancies
- Journey (timeline) gives executive buyers the "big picture"
- Product cards give engineers the specifics they need
- Each product can be linked directly (deep linking via #anchors)
- Supports "I just want one thing" and "I want the whole platform" buyers

### Why 3 Blog Series (not a generic "Blog" link)
- From research: LangChain's "State of Agent Engineering" and thought leadership is a key differentiator
- Series framing shows consistent, sustained expertise (not one-off content marketing)
- 50+ articles is a massive, underutilized content asset
- Each series serves a different intent:
  - VISDOM series = "convince my boss" content
  - GitHub All-Stars = "I want to learn" content
  - AI-Insight = "stay current" content

---

## Out of Scope (for this spec)

These sections are part of the full page but not detailed here:
- Hero section (problem-first framing)
- Three Pillars section (Context Fabric / Machine-Speed CI / Risk Assessment)
- Social Proof section (metrics, client logos, engagement timeline)
- CTA section (graduated: Try ViDIA / Book Assessment / Contact)
- Footer
- Nav

These will be specced in a follow-up if this design is approved.
