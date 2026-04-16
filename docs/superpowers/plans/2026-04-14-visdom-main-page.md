# Visdom Main Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone dark-themed landing page for the Visdom platform showcasing solutions, blog series, AI-Radar, and Maturity Matrix reference.

**Architecture:** Static Astro site with Tailwind CSS 4. All content is hardcoded (no CMS). Components are `.astro` files - one per page section. Data for solution cards and blog series lives in typed arrays within each component. Vived Engine design language: dark `#181823` background, glassmorphism cards, emerald accent.

**Tech Stack:** Astro 5.x, Tailwind CSS 4, Google Fonts (Montserrat, Inter, JetBrains Mono), CSS animations (no JS framework needed).

**Spec:** `docs/superpowers/specs/2026-04-14-visdom-main-page-design.md`

---

## File Structure

```
src/
  layouts/
    Layout.astro           # HTML shell: head, fonts, meta, body wrapper
  components/
    Nav.astro              # Sticky glassmorphism navbar
    Hero.astro             # Problem-first hero with stats
    Pillars.astro          # Three pillars (Context Fabric / CI / Risk)
    Solutions.astro        # Journey timeline + all solution cards
    SolutionCard.astro     # Reusable card component (props-driven)
    Terminal.astro         # Code snippet terminal component
    BlogSeries.astro       # Three series section
    SeriesCard.astro       # Individual series card with featured article
    AiRadar.astro          # Live radar banner
    MaturityRef.astro      # Bottom Maturity Matrix reference
    SocialProof.astro      # Metrics strip
    CtaSection.astro       # Graduated CTAs
    Footer.astro           # Footer with links
  pages/
    index.astro            # Assembles all sections
  styles/
    global.css             # Tailwind imports, custom utilities, animations
public/
  favicon.svg              # Visdom favicon
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/layouts/Layout.astro`
- Create: `src/pages/index.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Initialize Astro project**

```bash
cd /Users/askowronski/Projects/visdom-main-page
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @astrojs/tailwind tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Astro with Tailwind**

Replace `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Write global CSS with Tailwind imports and design tokens**

Write `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg: #181823;
  --color-surface: #21212d;
  --color-surface-light: #2a2a38;
  --color-emerald: #10b981;
  --color-emerald-dark: #059669;
  --color-blue: #0693e3;
  --color-purple: #9b51e0;
  --color-amber: #f59e0b;
  --color-phase-assess: #3b82f6;
  --color-phase-enable: #8b5cf6;
  --color-phase-build: #10b981;
  --color-phase-validate: #f59e0b;

  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Glassmorphism utility */
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

/* Glass card with lift */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Terminal block */
.terminal {
  background: #0d0d14;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  padding: 16px 20px;
  overflow-x: auto;
}

/* Pill button */
.btn-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-body);
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: var(--color-emerald);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--color-emerald-dark);
}

.btn-outline {
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-outline:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
}

/* Tag */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* Pulse animation for live dot */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
}

.pulse-dot {
  animation: pulse-dot 2s infinite;
}

/* Fade up on scroll */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-up {
  animation: fade-up 0.6s ease-out both;
}

/* Section spacing */
.section {
  padding: 96px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Section heading */
.section-title {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 600px;
}

@media (max-width: 640px) {
  .section { padding: 64px 0; }
  .section-title { font-size: 1.75rem; }
}
```

- [ ] **Step 5: Write base Layout**

Write `src/layouts/Layout.astro`:

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Visdom - The AI-Native SDLC Platform. From assessment to autonomous delivery." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet" />
    <title>{title}</title>
    <style>
      @view-transition { navigation: auto; }
    </style>
  </head>
  <body class="min-h-screen">
    <slot />
  </body>
</html>
```

- [ ] **Step 6: Write minimal index page**

Write `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import '../styles/global.css';
---
<Layout title="Visdom - The AI-Native SDLC Platform">
  <main>
    <div class="container section">
      <h1 class="section-title">Visdom</h1>
      <p class="section-subtitle">Scaffold working. Building sections next.</p>
    </div>
  </main>
</Layout>
```

- [ ] **Step 7: Write favicon**

Write `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#181823"/>
  <text x="16" y="22" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="#10b981">V</text>
</svg>
```

- [ ] **Step 8: Start dev server and verify**

```bash
cd /Users/askowronski/Projects/visdom-main-page && npx astro dev
```

Expected: Dark page with "Visdom" heading, correct fonts loading.

- [ ] **Step 9: Init git and commit**

```bash
cd /Users/askowronski/Projects/visdom-main-page
git init
echo "node_modules/\ndist/\n.astro/\n.DS_Store" > .gitignore
git add -A
git commit -m "feat: scaffold Astro project with Tailwind and Visdom design tokens"
```

---

## Task 2: Nav + Hero + Pillars

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Hero.astro`
- Create: `src/components/Pillars.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build Nav component**

Write `src/components/Nav.astro`:

```astro
---
const links = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Insights', href: '#insights' },
  { label: 'AI Radar', href: '#radar' },
  { label: 'Matrix', href: 'https://visdom-ai-maturity-matrix.pages.dev', external: true },
];
---
<nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
  <div class="container flex items-center justify-between h-16">
    <a href="/" class="flex items-center gap-2 text-white font-bold text-lg" style="font-family: var(--font-heading);">
      <span class="text-emerald">V</span>isDom
    </a>
    <div class="hidden md:flex items-center gap-8">
      {links.map(link => (
        <a
          href={link.href}
          class="text-sm text-white/50 hover:text-white transition-colors"
          {...(link.external ? { target: '_blank', rel: 'noopener' } : {})}
        >
          {link.label}
        </a>
      ))}
      <a href="#contact" class="btn-pill btn-primary text-sm !py-2 !px-5">
        Get in Touch
      </a>
    </div>
  </div>
</nav>
```

- [ ] **Step 2: Build Hero component**

Write `src/components/Hero.astro`:

```astro
---
const stats = [
  { value: '88%', label: 'using AI in dev' },
  { value: '6%', label: 'getting real value' },
  { value: '45%', label: 'AI code has OWASP vulns' },
];
---
<section class="pt-32 pb-20">
  <div class="container">
    <div class="max-w-3xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-xs font-medium mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald pulse-dot"></span>
        AI-Native SDLC Platform
      </div>

      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6" style="font-family: var(--font-heading);">
        Your AI agents are only as good as your
        <span class="bg-gradient-to-r from-emerald via-blue to-purple bg-clip-text text-transparent">
          engineering infrastructure
        </span>
      </h1>

      <p class="text-lg sm:text-xl text-white/50 mb-10 max-w-2xl leading-relaxed">
        Most organizations adopted AI coding tools. Few changed the infrastructure around them.
        Visdom transforms your SDLC into an agent-operable production system - from assessment to autonomous delivery.
      </p>

      <div class="flex flex-wrap gap-4 mb-16">
        <a href="#solutions" class="btn-pill btn-primary">
          Explore Solutions
          <span aria-hidden="true">&darr;</span>
        </a>
        <a href="https://visdom-ai-maturity-matrix.pages.dev/assessment" target="_blank" rel="noopener" class="btn-pill btn-outline">
          Take the Assessment
        </a>
      </div>
    </div>

    <div class="flex flex-wrap gap-8 pt-8 border-t border-white/5">
      {stats.map(stat => (
        <div class="flex flex-col">
          <span class="text-3xl font-bold text-white" style="font-family: var(--font-heading);">{stat.value}</span>
          <span class="text-sm text-white/40">{stat.label}</span>
        </div>
      ))}
      <div class="flex flex-col">
        <span class="text-xs text-white/30 max-w-48">Sources: Dataiku 2026, OWASP AI Security Report</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build Pillars component**

Write `src/components/Pillars.astro`:

```astro
---
const pillars = [
  {
    title: 'Context Fabric',
    description: 'Structured, agent-consumable context built across repositories and teams. Your agents stop hallucinating when they can actually see your codebase.',
    icon: '{}',
  },
  {
    title: 'Machine-Speed CI',
    description: 'High-frequency iteration loops that match agent speed. Your CI should validate in seconds, not block for 45 minutes.',
    icon: '>>',
  },
  {
    title: 'Automated Risk Assessment',
    description: 'Continuous validation and intelligent change control. Multi-layered review that catches what humans miss and agents introduce.',
    icon: '!!',
  },
];
---
<section class="section border-t border-white/5">
  <div class="container">
    <p class="text-sm font-medium text-emerald uppercase tracking-wider mb-4">Three Pillars</p>
    <h2 class="section-title mb-12">What Makes an SDLC AI-Native</h2>

    <div class="grid md:grid-cols-3 gap-6">
      {pillars.map(pillar => (
        <div class="glass-card p-8">
          <div class="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald font-mono text-sm font-bold mb-5">
            {pillar.icon}
          </div>
          <h3 class="text-lg font-semibold text-white mb-3" style="font-family: var(--font-heading);">
            {pillar.title}
          </h3>
          <p class="text-sm text-white/50 leading-relaxed">
            {pillar.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Update index page to assemble sections**

Replace `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Pillars from '../components/Pillars.astro';
import '../styles/global.css';
---
<Layout title="Visdom - The AI-Native SDLC Platform">
  <Nav />
  <main>
    <Hero />
    <Pillars />
  </main>
</Layout>
```

- [ ] **Step 5: Verify in browser**

Run: `npx astro dev` (if not already running)
Expected: Dark page with glassmorphism nav, gradient hero text, three pillar cards.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.astro src/components/Hero.astro src/components/Pillars.astro src/pages/index.astro
git commit -m "feat: add Nav, Hero, and Three Pillars sections"
```

---

## Task 3: Reusable Components (SolutionCard + Terminal)

**Files:**
- Create: `src/components/SolutionCard.astro`
- Create: `src/components/Terminal.astro`

- [ ] **Step 1: Build Terminal component**

Write `src/components/Terminal.astro`:

```astro
---
interface Props {
  title?: string;
}
const { title = 'Terminal' } = Astro.props;
---
<div class="terminal">
  <div class="flex items-center gap-1.5 mb-3 pb-3 border-b border-white/5">
    <span class="w-2.5 h-2.5 rounded-full bg-white/10"></span>
    <span class="w-2.5 h-2.5 rounded-full bg-white/10"></span>
    <span class="w-2.5 h-2.5 rounded-full bg-white/10"></span>
    <span class="ml-2 text-xs text-white/30">{title}</span>
  </div>
  <pre class="text-white/70"><slot /></pre>
</div>
```

- [ ] **Step 2: Build SolutionCard component**

Write `src/components/SolutionCard.astro`:

```astro
---
interface CTA {
  label: string;
  href: string;
  external?: boolean;
}

interface Props {
  title: string;
  subtitle: string;
  problem: string;
  capabilities: string[];
  tags: { label: string; color: 'emerald' | 'blue' | 'purple' | 'amber' }[];
  ctas: CTA[];
  metric?: { lines: string[] };
}

const { title, subtitle, problem, capabilities, tags, ctas, metric } = Astro.props;

const tagColors = {
  emerald: 'bg-emerald/10 text-emerald border-emerald/20',
  blue: 'bg-blue/10 text-blue border-blue/20',
  purple: 'bg-purple/10 text-purple border-purple/20',
  amber: 'bg-amber/10 text-amber border-amber/20',
};
---
<div class="glass-card p-8">
  <div class="flex flex-wrap gap-2 mb-4">
    {tags.map(tag => (
      <span class:list={['tag border', tagColors[tag.color]]}>
        {tag.label}
      </span>
    ))}
  </div>

  <h4 class="text-xl font-bold text-white mb-1" style="font-family: var(--font-heading);">
    {title}
  </h4>
  <p class="text-sm text-white/40 mb-4">{subtitle}</p>

  <blockquote class="text-sm text-white/60 italic border-l-2 border-emerald/30 pl-4 mb-5">
    {problem}
  </blockquote>

  <ul class="space-y-2 mb-5">
    {capabilities.map(cap => (
      <li class="flex items-start gap-2 text-sm text-white/70">
        <span class="text-emerald mt-0.5 shrink-0">&#x25B8;</span>
        {cap}
      </li>
    ))}
  </ul>

  {metric && (
    <div class="rounded-lg bg-white/[0.02] border border-white/5 p-4 mb-5">
      {metric.lines.map(line => (
        <p class="text-sm text-white/50">{line}</p>
      ))}
    </div>
  )}

  <slot />

  <div class="flex flex-wrap gap-3 mt-5">
    {ctas.map(cta => (
      <a
        href={cta.href}
        class="btn-pill btn-outline text-xs !py-1.5 !px-4"
        {...(cta.external ? { target: '_blank', rel: 'noopener' } : {})}
      >
        {cta.label} &rarr;
      </a>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SolutionCard.astro src/components/Terminal.astro
git commit -m "feat: add reusable SolutionCard and Terminal components"
```

---

## Task 4: Solutions Section (Journey Timeline + All Cards)

**Files:**
- Create: `src/components/Solutions.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build Solutions component with timeline and all phase cards**

Write `src/components/Solutions.astro`:

```astro
---
import SolutionCard from './SolutionCard.astro';
import Terminal from './Terminal.astro';

const phases = [
  { id: 'assess', label: 'Assess', desc: 'Where are you today?', color: 'var(--color-phase-assess)' },
  { id: 'enable', label: 'Enable', desc: 'Make your infra ready', color: 'var(--color-phase-enable)' },
  { id: 'build', label: 'Build', desc: 'Equip your agents', color: 'var(--color-phase-build)' },
  { id: 'validate', label: 'Validate', desc: 'Trust what ships', color: 'var(--color-phase-validate)' },
];
---
<section id="solutions" class="section border-t border-white/5">
  <div class="container">
    <p class="text-sm font-medium text-emerald uppercase tracking-wider mb-4">Our Solutions</p>
    <h2 class="section-title">From Assessment to Autonomous Delivery</h2>
    <p class="section-subtitle mb-16">
      Each solution works standalone. Together, they form an AI-Native SDLC.
    </p>

    {/* Journey Timeline */}
    <div class="hidden md:flex items-center justify-between mb-20 relative">
      <div class="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-phase-assess via-phase-enable via-50% to-phase-validate opacity-30"></div>
      {phases.map((phase, i) => (
        <a href={`#phase-${phase.id}`} class="flex flex-col items-center relative z-10 group">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3 border-2 transition-transform group-hover:scale-110"
            style={`background: ${phase.color}22; border-color: ${phase.color}; color: ${phase.color};`}
          >
            {i + 1}
          </div>
          <span class="text-sm font-semibold text-white">{phase.label}</span>
          <span class="text-xs text-white/40">{phase.desc}</span>
        </a>
      ))}
    </div>

    {/* Phase 1: ASSESS */}
    <div id="phase-assess" class="mb-16">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style="background: var(--color-phase-assess); color: white;">1</span>
        <h3 class="text-xl font-bold text-white" style="font-family: var(--font-heading);">Assess</h3>
      </div>
      <div class="grid lg:grid-cols-1 gap-6 max-w-2xl">
        <SolutionCard
          title="Visdom Maturity Matrix"
          subtitle="AI-Native SDLC Assessment"
          problem="You can't optimize what you can't measure. Most teams don't know where they stand on AI readiness."
          capabilities={[
            '60 practices across 4 perspectives',
            '5 maturity levels (Ad-hoc to Autonomous)',
            'Self-assessment questionnaire + workshop mode',
            'Perspectives: Development, Delivery, Organization, Infrastructure',
          ]}
          tags={[
            { label: 'Interactive Tool', color: 'blue' },
            { label: 'Self-Assessment', color: 'emerald' },
          ]}
          metric={{ lines: ['60 practices | 4 perspectives | 5 levels', 'Based on 15+ years of enterprise engagements'] }}
          ctas={[
            { label: 'Try the Assessment', href: 'https://visdom-ai-maturity-matrix.pages.dev/assessment', external: true },
            { label: 'Explore the Matrix', href: 'https://visdom-ai-maturity-matrix.pages.dev/matrix/development', external: true },
          ]}
        />
      </div>
    </div>

    {/* Phase 2: ENABLE */}
    <div id="phase-enable" class="mb-16">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style="background: var(--color-phase-enable); color: white;">2</span>
        <h3 class="text-xl font-bold text-white" style="font-family: var(--font-heading);">Enable</h3>
      </div>
      <div class="grid lg:grid-cols-2 gap-6">
        <SolutionCard
          title="Context Fabric"
          subtitle="Structured, agent-consumable context"
          problem="AI agents hallucinate when they can't see your codebase. Context Fabric makes your repositories, standards, and architecture machine-readable."
          capabilities={[
            'Structured context built across repositories and teams',
            'Agent-consumable documentation and architecture maps',
            'Governance rules auto-detected from 16+ config sources',
            'CLAUDE.md / .cursorrules / AGENTS.md export',
          ]}
          tags={[
            { label: 'Infrastructure', color: 'purple' },
            { label: 'AI-Native', color: 'emerald' },
          ]}
          ctas={[
            { label: 'View on GitHub', href: 'https://github.com/VirtusLab', external: true },
          ]}
        >
          <Terminal title="context-fabric">
{`$ vidia init
Scanning repository...
Detected: pyproject.toml, .pre-commit-config.yaml,
          GitHub Actions, Docker Compose, ArchUnit
Found 23 rules across 6 categories.
Exported to CLAUDE.md `}<span class="text-emerald">&#x2713;</span>
          </Terminal>
        </SolutionCard>

        <SolutionCard
          title="Machine-Speed CI"
          subtitle="CI built for agent iteration speed"
          problem="Your CI takes 45 minutes. An AI agent iterates 50x per hour. Do the math - your pipeline is the bottleneck."
          capabilities={[
            'High-frequency validation loops for rapid agent feedback',
            'Build time optimization (Bazel, Gradle, Maven expertise)',
            'Monorepo enablement for large-scale agent workflows',
            'CI/CD re-architecture for agent-native development',
          ]}
          tags={[
            { label: 'Infrastructure', color: 'purple' },
            { label: 'Performance', color: 'amber' },
          ]}
          metric={{ lines: ['88% build time decrease (freight logistics)', '43% PR merge time reduction (investment bank)'] }}
          ctas={[
            { label: 'Read: "The Ferrari Engine in a Fiat 500"', href: 'https://virtuslab.com/blog/ai/the-fallacy/', external: true },
          ]}
        />
      </div>
    </div>

    {/* Phase 3: BUILD */}
    <div id="phase-build" class="mb-16">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style="background: var(--color-phase-build); color: white;">3</span>
        <h3 class="text-xl font-bold text-white" style="font-family: var(--font-heading);">Build</h3>
      </div>
      <div class="grid lg:grid-cols-2 gap-6">
        <SolutionCard
          title="ViDIA"
          subtitle="Developer Intelligence Agent"
          problem="Who knows this code? What breaks if I change it? Why was it built this way? Your agents need answers before they touch a single line."
          capabilities={[
            'Expert discovery via git history (scored by blame, frequency, recency)',
            'Blast radius analysis before any change',
            'PR discussion indexing for architectural decisions',
            '16+ governance rule detectors',
            'Deterministic SHA256-pinned snapshots',
            'MCP Server for Claude Desktop / Cursor',
          ]}
          tags={[
            { label: 'Open Source', color: 'blue' },
            { label: 'MCP-Compatible', color: 'emerald' },
            { label: 'CLI', color: 'purple' },
          ]}
          ctas={[
            { label: 'View on GitHub', href: 'https://github.com/VirtusLab/visdom-developer-intelligence', external: true },
            { label: 'Read Docs', href: 'https://github.com/VirtusLab/visdom-developer-intelligence', external: true },
          ]}
        >
          <Terminal title="vidia">
{`$ vidia expert src/auth/login.py
┌─────────────────────────────────┐
│ Expert: @jkowalski (score: 0.87)│
│ Last touch: 3 days ago          │
│ Bus factor: 1 `}<span class="text-amber">&#x26A0;</span>{`               │
│ Blast radius: 12 files          │
└─────────────────────────────────┘`}
          </Terminal>
        </SolutionCard>

        <div class="flex flex-col gap-6">
          <SolutionCard
            title="Agent Skills Library"
            subtitle="Curated skills for AI coding agents"
            problem="Every team writes the same CLAUDE.md rules from scratch. We maintain battle-tested skills so you don't have to."
            capabilities={[
              'Following Anthropic Agent Skills specification',
              'Java best practices and coding standards',
              'IDE-agnostic (.claude, .cursor, .gemini, .kiro support)',
              'Community-maintained, enterprise-tested',
            ]}
            tags={[
              { label: 'Open Source', color: 'blue' },
              { label: 'Anthropic Spec', color: 'emerald' },
            ]}
            ctas={[
              { label: 'Browse Skills on GitHub', href: 'https://github.com/VirtusLab/agent-skills', external: true },
            ]}
          />

          <SolutionCard
            title="Reference Architectures"
            subtitle="Battle-tested blueprints for agentic systems"
            problem="Building an agentic system from scratch? Start from a proven architecture, not a blank canvas."
            capabilities={[
              'Insurance Underwriting: full C4 architecture (context to code level)',
              'Agentic orchestration with human-in-the-loop',
              '4 reference implementations on GitHub',
            ]}
            tags={[
              { label: 'Blueprint', color: 'amber' },
              { label: 'Open Source', color: 'blue' },
            ]}
            ctas={[
              { label: 'Explore Insurance Architecture', href: 'https://github.com/VirtusLab/ai-insurance-reference-architecture', external: true },
            ]}
          />
        </div>
      </div>
    </div>

    {/* Phase 4: VALIDATE */}
    <div id="phase-validate">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style="background: var(--color-phase-validate); color: white;">4</span>
        <h3 class="text-xl font-bold text-white" style="font-family: var(--font-heading);">Validate</h3>
      </div>
      <div class="grid lg:grid-cols-1 gap-6 max-w-2xl">
        <SolutionCard
          title="Visdom Code Review"
          subtitle="Multi-layered AI Review Pipeline"
          problem="45% of AI-generated code contains OWASP vulnerabilities. Your seniors spend 30-50% of their time reviewing PRs. This doesn't scale."
          capabilities={[
            'L0: Context Collection - deterministic, <10s',
            'L1: Deterministic Gate - linters, SAST, secrets - <60s (cannot be prompt-injected)',
            'L2: AI Quick Scan - risk classification, max 5 findings - <2min',
            'L3: AI Deep Review - Review Lenses, full analysis - <10min',
          ]}
          tags={[
            { label: 'Framework', color: 'amber' },
            { label: 'Process', color: 'purple' },
            { label: 'Multi-Layer', color: 'emerald' },
          ]}
          metric={{ lines: ['$0.05 per LOW-risk PR vs. hours of senior engineer time', '4 layers, each catching what the previous one can\'t'] }}
          ctas={[
            { label: 'Read the Framework', href: 'https://virtuslab.github.io/visdom-code-review/', external: true },
            { label: 'See Before/After Scenarios', href: 'https://virtuslab.github.io/visdom-code-review/before-after/', external: true },
            { label: 'For Leaders', href: 'https://virtuslab.github.io/visdom-code-review/guide/leaders/', external: true },
          ]}
        >
          <div class="flex items-center gap-2 text-xs font-mono text-white/40 my-4 overflow-x-auto">
            <span class="px-2 py-1 rounded bg-white/5">L0 &lt;10s</span>
            <span class="text-white/20">&rarr;</span>
            <span class="px-2 py-1 rounded bg-blue/10 text-blue">L1 &lt;60s</span>
            <span class="text-white/20">&rarr;</span>
            <span class="px-2 py-1 rounded bg-amber/10 text-amber">L2 &lt;2min</span>
            <span class="text-white/20">&rarr;</span>
            <span class="px-2 py-1 rounded bg-purple/10 text-purple">L3 &lt;10min</span>
            <span class="text-white/20">&rarr;</span>
            <span class="px-2 py-1 rounded bg-emerald/10 text-emerald">PR Comment</span>
          </div>
        </SolutionCard>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add Solutions to index page**

In `src/pages/index.astro`, add import and component:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Pillars from '../components/Pillars.astro';
import Solutions from '../components/Solutions.astro';
import '../styles/global.css';
---
<Layout title="Visdom - The AI-Native SDLC Platform">
  <Nav />
  <main>
    <Hero />
    <Pillars />
    <Solutions />
  </main>
</Layout>
```

- [ ] **Step 3: Verify in browser**

Expected: Journey timeline with 4 phase dots, all 7 solution cards organized by phase, terminal snippets in ViDIA and Context Fabric cards, layer pipeline in Code Review card.

- [ ] **Step 4: Commit**

```bash
git add src/components/Solutions.astro src/pages/index.astro
git commit -m "feat: add Solutions section with journey timeline and all product cards"
```

---

## Task 5: Blog Series Section

**Files:**
- Create: `src/components/SeriesCard.astro`
- Create: `src/components/BlogSeries.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build SeriesCard component**

Write `src/components/SeriesCard.astro`:

```astro
---
interface Article {
  title: string;
  date: string;
  href: string;
}

interface Props {
  title: string;
  color: string;
  description: string;
  stats: string;
  featured: Article;
  articles: Article[];
  ctaLabel: string;
  ctaHref: string;
}

const { title, color, description, stats, featured, articles, ctaLabel, ctaHref } = Astro.props;
---
<div class="glass-card p-8 relative overflow-hidden flex flex-col">
  <div class="absolute top-0 left-0 right-0 h-[3px]" style={`background: ${color};`}></div>

  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-bold text-white" style="font-family: var(--font-heading);">{title}</h3>
    <span class="text-xs text-white/30">{stats}</span>
  </div>

  <p class="text-sm text-white/50 leading-relaxed mb-6">{description}</p>

  {/* Featured latest article */}
  <a
    href={featured.href}
    target="_blank"
    rel="noopener"
    class="block rounded-lg bg-white/[0.04] border border-white/5 p-4 mb-4 hover:border-white/15 transition-colors group"
  >
    <span class="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2 block">Latest</span>
    <span class="text-sm font-medium text-white group-hover:text-emerald transition-colors block mb-1">{featured.title}</span>
    <span class="text-xs text-white/30">{featured.date}</span>
  </a>

  {/* Recent articles list */}
  <div class="flex-1 space-y-0">
    {articles.map(article => (
      <a
        href={article.href}
        target="_blank"
        rel="noopener"
        class="flex justify-between items-baseline py-2.5 border-b border-white/5 text-sm text-white/50 hover:text-white transition-colors group"
      >
        <span class="truncate pr-4">{article.title}</span>
        <span class="text-xs text-white/30 whitespace-nowrap">{article.date}</span>
      </a>
    ))}
  </div>

  <a
    href={ctaHref}
    target="_blank"
    rel="noopener"
    class="btn-pill btn-outline text-xs !py-1.5 !px-4 mt-6 self-start"
  >
    {ctaLabel} &rarr;
  </a>
</div>
```

- [ ] **Step 2: Build BlogSeries section**

Write `src/components/BlogSeries.astro`:

```astro
---
import SeriesCard from './SeriesCard.astro';

const baseUrl = 'https://virtuslab.com';
---
<section id="insights" class="section border-t border-white/5">
  <div class="container">
    <p class="text-sm font-medium text-emerald uppercase tracking-wider mb-4">Thought Leadership</p>
    <h2 class="section-title">Engineering Insights, Not Marketing Fluff</h2>
    <p class="section-subtitle mb-16">
      Three series. 50+ articles. Written by engineers, for engineers.
    </p>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SeriesCard
        title="VISDOM - AI-Native SDLC"
        color="#10b981"
        description="Deep dives into what it takes to make your software delivery pipeline ready for AI agents. No hype, just hard-won lessons from real enterprise engagements."
        stats="10+ articles"
        featured={{
          title: 'AI in the SDLC: Faster or Just Busier?',
          date: 'Apr 10, 2026',
          href: `${baseUrl}/blog/ai/ai-in-the-sdlc-faster-or-just-busier/`,
        }}
        articles={[
          { title: 'Cognitive Debt: The code nobody understands', date: 'Apr 10', href: `${baseUrl}/blog/ai/cognitive-debt-the-code-nobody-understands/` },
          { title: 'Your README Is a Lie', date: 'Apr 7', href: `${baseUrl}/blog/ai/the-hard-truth/` },
          { title: 'The Ferrari Engine in a Fiat 500', date: 'Mar 31', href: `${baseUrl}/blog/ai/the-fallacy/` },
        ]}
        ctaLabel="Read the VISDOM series"
        ctaHref={`${baseUrl}/blog/ai/`}
      />

      <SeriesCard
        title="GitHub All-Stars"
        color="#0693e3"
        description="Every edition, we dissect a trending open-source AI project. Architecture deep-dives, not README summaries. 16 editions and counting."
        stats="16 editions"
        featured={{
          title: '#16: Project N.O.M.A.D. - Civilization in a Docker Container',
          date: 'Mar 25, 2026',
          href: `${baseUrl}/blog/ai/project-nomad/`,
        }}
        articles={[
          { title: '#15: jCodeMunch MCP - Agent stops reading', date: 'Mar 11', href: `${baseUrl}/blog/ai/code-munch-mcp-your-agent-starts-navigating/` },
          { title: '#14: NanoClaw - Your Personal AI Butler', date: 'Feb 25', href: `${baseUrl}/blog/ai/nano-claw-your-personal-ai-butler/` },
          { title: '#13: Matchlock - Agent\'s Bulletproof Cage', date: 'Feb 11', href: `${baseUrl}/blog/ai/matchlock-your-agents-bulletproof-cage/` },
        ]}
        ctaLabel="Browse All-Stars"
        ctaHref={`${baseUrl}/blog/ai/`}
      />

      <SeriesCard
        title="AI-Insight"
        color="#9b51e0"
        description="Monthly curations of what top engineers actually read about AI. Plus deep technical explainers on MCP, RAG, model evaluation, and agentic testing."
        stats="13+ articles"
        featured={{
          title: 'Interview with Krzysztof Grajek, lead engineer behind TraceVault',
          date: 'Apr 13, 2026',
          href: `${baseUrl}/blog/ai/interview-with-krzysztof-grajek-lead-engineer-behind-trace-vault/`,
        }}
        articles={[
          { title: 'How to improve your RAG: Move Beyond Flat Vector Stores', date: 'Feb 16', href: `${baseUrl}/blog/ai/how-to-improve-your-rag/` },
          { title: 'Best generative AI models at the beginning of 2026', date: 'Jan 27', href: `${baseUrl}/blog/ai/best-gen-ai-beginning-2026/` },
          { title: 'Understanding How Claude Code Works', date: 'Nov 12', href: `${baseUrl}/blog/ai/how-claude-code-works/` },
        ]}
        ctaLabel="Read AI-Insights"
        ctaHref={`${baseUrl}/blog/ai/`}
      />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add BlogSeries to index**

Add to `src/pages/index.astro` imports and after `<Solutions />`:

```astro
import BlogSeries from '../components/BlogSeries.astro';
```

Add `<BlogSeries />` after `<Solutions />`.

- [ ] **Step 4: Verify in browser**

Expected: Three side-by-side series cards, each with colored top accent, featured article box, article list, and CTA.

- [ ] **Step 5: Commit**

```bash
git add src/components/SeriesCard.astro src/components/BlogSeries.astro src/pages/index.astro
git commit -m "feat: add Thought Leadership section with three blog series"
```

---

## Task 6: AI-Radar Banner

**Files:**
- Create: `src/components/AiRadar.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build AiRadar component**

Write `src/components/AiRadar.astro`:

```astro
---
const stats = [
  { value: '777', label: 'signals' },
  { value: '17', label: 'areas' },
  { value: '354', label: 'discoveries' },
  { value: '251', label: 'releases' },
];

const topAreas = [
  'Coding agents (211)',
  'MCP integration (143)',
  'Context engineering (116)',
  'Agent sandboxing (85)',
  'Observability (48)',
  'Governance (37)',
];
---
<section id="radar" class="section border-t border-white/5">
  <div class="container">
    <div class="rounded-2xl p-8 sm:p-12 relative overflow-hidden" style="background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,147,227,0.08), rgba(155,81,224,0.08)); border: 1px solid rgba(255,255,255,0.08);">

      <div class="flex items-center gap-3 mb-6">
        <span class="w-2 h-2 rounded-full bg-emerald pulse-dot"></span>
        <span class="text-xs font-semibold uppercase tracking-wider text-emerald">Live</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-white" style="font-family: var(--font-heading);">
          AI Engineering Radar
        </h2>
      </div>

      <p class="text-white/50 mb-8 max-w-2xl">
        Tracking the AI engineering ecosystem in real-time. Signals automatically discovered and classified by maturity level (L1-L5), mapped to relevant technical areas.
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div class="rounded-xl bg-white/[0.05] p-4 text-center">
            <div class="text-2xl sm:text-3xl font-bold text-white" style="font-family: var(--font-heading);">{stat.value}</div>
            <div class="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div class="mb-8">
        <span class="text-xs text-white/30 uppercase tracking-wider block mb-3">Top tracked areas</span>
        <div class="flex flex-wrap gap-2">
          {topAreas.map(area => (
            <span class="text-xs text-white/50 bg-white/[0.04] border border-white/5 rounded-full px-3 py-1">
              {area}
            </span>
          ))}
        </div>
      </div>

      <a
        href="https://visdom-ai-maturity-matrix.pages.dev/dashboard"
        target="_blank"
        rel="noopener"
        class="btn-pill btn-primary"
      >
        Open AI-Radar Dashboard &rarr;
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to index**

Add import and `<AiRadar />` after `<BlogSeries />`.

- [ ] **Step 3: Verify in browser**

Expected: Gradient banner with pulsing live dot, 4 stat boxes, area tags, green CTA.

- [ ] **Step 4: Commit**

```bash
git add src/components/AiRadar.astro src/pages/index.astro
git commit -m "feat: add AI-Radar live intelligence feed banner"
```

---

## Task 7: Maturity Matrix Reference

**Files:**
- Create: `src/components/MaturityRef.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build MaturityRef component**

Write `src/components/MaturityRef.astro`:

```astro
---
const levels = [
  { id: 'L1', name: 'Ad-hoc', bg: 'rgba(113,113,122,0.2)', text: '#a1a1aa' },
  { id: 'L2', name: 'Guided', bg: 'rgba(13,148,136,0.2)', text: '#2dd4bf' },
  { id: 'L3', name: 'Systematic', bg: 'rgba(16,185,129,0.2)', text: '#34d399' },
  { id: 'L4', name: 'Optimized', bg: 'rgba(34,197,94,0.2)', text: '#4ade80' },
  { id: 'L5', name: 'Autonomous', bg: 'rgba(74,222,128,0.2)', text: '#86efac' },
];

const perspectives = ['Development', 'Delivery', 'Organization', 'Infrastructure'];
---
<section class="py-20 relative" style="border-top: 1px solid rgba(16,185,129,0.15); background: linear-gradient(180deg, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0.01) 100%);">
  <div class="container text-center">
    <h2 class="section-title mx-auto">Where does your organization stand?</h2>
    <p class="text-white/50 mt-4 mb-12 max-w-xl mx-auto">
      The Visdom Maturity Matrix maps 60 practices across 4 perspectives and 5 maturity levels - from Ad-hoc to Autonomous.
    </p>

    {/* Level timeline */}
    <div class="flex items-center justify-center gap-0 mb-10 overflow-x-auto pb-2">
      {levels.map((level, i) => (
        <div class="flex items-center">
          <div
            class="flex flex-col items-center px-3 sm:px-5 py-3 rounded-lg min-w-[80px]"
            style={`background: ${level.bg};`}
          >
            <span class="text-xs font-bold" style={`color: ${level.text};`}>{level.id}</span>
            <span class="text-[11px] mt-0.5" style={`color: ${level.text}; opacity: 0.7;`}>{level.name}</span>
          </div>
          {i < levels.length - 1 && (
            <div class="w-6 sm:w-10 h-0.5 bg-gradient-to-r" style={`--tw-gradient-from: ${level.text}; --tw-gradient-to: ${levels[i + 1].text};`}></div>
          )}
        </div>
      ))}
    </div>

    {/* Perspectives */}
    <div class="flex flex-wrap justify-center gap-3 mb-10">
      {perspectives.map(p => (
        <span class="text-sm text-white/40 bg-white/[0.03] border border-white/5 rounded-full px-4 py-1.5">
          {p}
        </span>
      ))}
    </div>

    <div class="flex flex-wrap justify-center gap-4">
      <a
        href="https://visdom-ai-maturity-matrix.pages.dev/assessment"
        target="_blank"
        rel="noopener"
        class="btn-pill btn-primary"
      >
        Take the Self-Assessment
      </a>
      <a
        href="https://visdom-ai-maturity-matrix.pages.dev/matrix/development"
        target="_blank"
        rel="noopener"
        class="btn-pill btn-outline"
      >
        Explore the Full Matrix
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to index after AiRadar**

Add import and `<MaturityRef />` after `<AiRadar />`.

- [ ] **Step 3: Verify in browser**

Expected: Green-tinted bottom section with L1-L5 level badges connected by gradient lines, perspective tags, two CTAs.

- [ ] **Step 4: Commit**

```bash
git add src/components/MaturityRef.astro src/pages/index.astro
git commit -m "feat: add Maturity Matrix reference section with level timeline"
```

---

## Task 8: Social Proof + CTA + Footer

**Files:**
- Create: `src/components/SocialProof.astro`
- Create: `src/components/CtaSection.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build SocialProof component**

Write `src/components/SocialProof.astro`:

```astro
---
const metrics = [
  { value: '15+', label: 'years in JVM ecosystem' },
  { value: '160+', label: 'open-source repositories' },
  { value: '50+', label: 'AI engineering articles' },
  { value: '88%', label: 'build time decrease (best case)' },
];

const credentials = [
  'Scala compiler contributors',
  'Metals LSP maintainers',
  'Jenkins Kubernetes Operator creators',
  'Bazel & Gradle migration specialists',
];
---
<section class="section border-t border-white/5">
  <div class="container">
    <p class="text-sm font-medium text-emerald uppercase tracking-wider mb-4">Why VirtusLab</p>
    <h2 class="section-title mb-12">Built by Engineers Who Ship Compilers</h2>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {metrics.map(metric => (
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-white" style="font-family: var(--font-heading);">{metric.value}</div>
          <div class="text-sm text-white/40 mt-2">{metric.label}</div>
        </div>
      ))}
    </div>

    <div class="flex flex-wrap justify-center gap-3">
      {credentials.map(cred => (
        <span class="text-xs text-white/50 bg-white/[0.03] border border-white/5 rounded-full px-4 py-2">
          {cred}
        </span>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Build CtaSection component**

Write `src/components/CtaSection.astro`:

```astro
<section id="contact" class="section border-t border-white/5">
  <div class="container text-center">
    <h2 class="section-title mx-auto">Ready to Make Your SDLC AI-Native?</h2>
    <p class="text-white/50 mt-4 mb-12 max-w-xl mx-auto">
      Start where it makes sense. Try a tool, take the assessment, or talk to our engineers.
    </p>

    <div class="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
      <a
        href="https://github.com/VirtusLab/visdom-developer-intelligence"
        target="_blank"
        rel="noopener"
        class="glass-card p-6 text-center group"
      >
        <div class="text-2xl mb-3">&#x2699;</div>
        <div class="text-sm font-semibold text-white mb-1" style="font-family: var(--font-heading);">Try ViDIA</div>
        <div class="text-xs text-white/40">Open source. Start in 5 minutes.</div>
      </a>

      <a
        href="https://visdom-ai-maturity-matrix.pages.dev/assessment"
        target="_blank"
        rel="noopener"
        class="glass-card p-6 text-center group"
      >
        <div class="text-2xl mb-3">&#x1F4CA;</div>
        <div class="text-sm font-semibold text-white mb-1" style="font-family: var(--font-heading);">Take the Assessment</div>
        <div class="text-xs text-white/40">60 practices. Know where you stand.</div>
      </a>

      <a
        href="https://virtuslab.com/contact"
        target="_blank"
        rel="noopener"
        class="glass-card p-6 text-center group border-emerald/20 hover:border-emerald/40"
      >
        <div class="text-2xl mb-3">&#x1F4AC;</div>
        <div class="text-sm font-semibold text-emerald mb-1" style="font-family: var(--font-heading);">Talk to Engineers</div>
        <div class="text-xs text-white/40">Not sales. Engineers who built this.</div>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build Footer component**

Write `src/components/Footer.astro`:

```astro
---
const links = [
  { label: 'VirtusLab', href: 'https://virtuslab.com' },
  { label: 'GitHub', href: 'https://github.com/VirtusLab' },
  { label: 'Blog', href: 'https://virtuslab.com/blog/ai/' },
  { label: 'Contact', href: 'https://virtuslab.com/contact' },
];
---
<footer class="py-12 border-t border-white/5">
  <div class="container flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-2 text-sm text-white/30">
      <span class="font-bold text-white/50" style="font-family: var(--font-heading);">
        <span class="text-emerald">V</span>isDom
      </span>
      <span>&middot;</span>
      <span>Powered by VirtusLab</span>
    </div>
    <div class="flex items-center gap-6">
      {links.map(link => (
        <a href={link.href} target="_blank" rel="noopener" class="text-sm text-white/30 hover:text-white/60 transition-colors">
          {link.label}
        </a>
      ))}
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Assemble final index page**

Replace `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Pillars from '../components/Pillars.astro';
import Solutions from '../components/Solutions.astro';
import BlogSeries from '../components/BlogSeries.astro';
import AiRadar from '../components/AiRadar.astro';
import MaturityRef from '../components/MaturityRef.astro';
import SocialProof from '../components/SocialProof.astro';
import CtaSection from '../components/CtaSection.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
---
<Layout title="Visdom - The AI-Native SDLC Platform">
  <Nav />
  <main>
    <Hero />
    <Pillars />
    <Solutions />
    <BlogSeries />
    <AiRadar />
    <MaturityRef />
    <SocialProof />
    <CtaSection />
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 5: Verify complete page in browser**

Scroll through all 10 sections. Check:
- Nav sticks on scroll with glassmorphism
- Hero has gradient text and stats
- Pillars show 3 cards
- Solutions has timeline + all 7 product cards
- Blog series has 3 cards with featured articles
- AI Radar has pulsing dot and stats
- Maturity Matrix has L1-L5 timeline
- Social Proof has metrics
- CTA has 3 graduated options
- Footer has links

- [ ] **Step 6: Commit**

```bash
git add src/components/SocialProof.astro src/components/CtaSection.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add Social Proof, CTA, and Footer sections - complete page"
```

---

## Task 9: Responsive Polish + Final Review

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/Nav.astro` (mobile menu)

- [ ] **Step 1: Add mobile nav toggle**

Update `src/components/Nav.astro` - add a mobile hamburger button that toggles nav visibility:

```astro
---
const links = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Insights', href: '#insights' },
  { label: 'AI Radar', href: '#radar' },
  { label: 'Matrix', href: 'https://visdom-ai-maturity-matrix.pages.dev', external: true },
];
---
<nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
  <div class="container flex items-center justify-between h-16">
    <a href="/" class="flex items-center gap-2 text-white font-bold text-lg" style="font-family: var(--font-heading);">
      <span class="text-emerald">V</span>isDom
    </a>

    {/* Desktop nav */}
    <div class="hidden md:flex items-center gap-8">
      {links.map(link => (
        <a
          href={link.href}
          class="text-sm text-white/50 hover:text-white transition-colors"
          {...(link.external ? { target: '_blank', rel: 'noopener' } : {})}
        >
          {link.label}
        </a>
      ))}
      <a href="#contact" class="btn-pill btn-primary text-sm !py-2 !px-5">
        Get in Touch
      </a>
    </div>

    {/* Mobile toggle */}
    <button
      id="mobile-toggle"
      class="md:hidden text-white/60 hover:text-white p-2"
      aria-label="Toggle menu"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    </button>
  </div>

  {/* Mobile menu */}
  <div id="mobile-menu" class="hidden md:hidden border-t border-white/5 pb-4">
    <div class="container flex flex-col gap-3 pt-3">
      {links.map(link => (
        <a
          href={link.href}
          class="text-sm text-white/50 hover:text-white transition-colors py-2"
          {...(link.external ? { target: '_blank', rel: 'noopener' } : {})}
        >
          {link.label}
        </a>
      ))}
      <a href="#contact" class="btn-pill btn-primary text-sm !py-2 !px-5 self-start mt-2">
        Get in Touch
      </a>
    </div>
  </div>
</nav>

<script>
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });
  // Close on anchor click
  menu?.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => menu?.classList.add('hidden'));
  });
</script>
```

- [ ] **Step 2: Test responsive at mobile breakpoints**

Resize browser to 375px width. Check:
- Nav shows hamburger, menu toggles
- Hero text wraps correctly
- Pillars stack to 1 column
- Solution cards stack to 1 column
- Blog series cards stack
- AI Radar stats go 2x2
- Maturity levels scroll horizontally
- CTAs stack

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add mobile navigation and responsive polish"
```

- [ ] **Step 4: Build and verify static output**

```bash
cd /Users/askowronski/Projects/visdom-main-page && npx astro build
```

Expected: Build succeeds, `dist/` folder created with `index.html`.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: verify production build"
```
