# Context Files — Project Template

A set of 9 template files that give your AI coding agent (Claude Code, Cursor, Windsurf, Codex) everything it needs to understand your project before writing a single line of code.

---

## Why Context Files?

AI agents fail not because they can't code — they fail because they don't know your project. They make architectural decisions that contradict what you've already built, use libraries you're not using, and have no way to pick up where the last session left off.

Context files fix this. You write them once before the build starts. The agent reads them at the start of every session. You stay in control.

---

## The 9 Files

| File | Purpose |
|------|---------|
| `project-overview.md` | What you're building, who it's for, your stack |
| `architecture.md` | Folder structure, data models, key flows, invariants |
| `build-plan.md` | Features broken into phases with clear done criteria |
| `code-standards.md` | Rules the agent must follow when writing code |
| `library-docs.md` | Key usage patterns for the libraries in this project |
| `ui-tokens.md` | Colors, typography, spacing — the design system values |
| `ui-rules.md` | How the interface behaves — layout, interactions, states |
| `ui-registry.md` | Every reusable component and how to use it |
| `progress-tracker.md` | Live build status — updated after every session |

---

## How to Use

**1. Clone or download this repo**
```bash
git clone https://github.com/JavaScript-Mastery-Pro/context-files
```

**2. Copy the `context-files` folder into your project**
```bash
cp -r context-files/ your-project/context/
```

**3. Fill in every file before you start building**

Open each file and replace the bracketed placeholders with your project's specifics. This usually takes 1–2 hours. It's worth it.

**4. Tell your agent where to find them**

Add this to your `CLAUDE.md` / `AGENTS.md` / `.cursorrules`:
```
Read all files in the /context directory before starting any task.
```

**5. Update `progress-tracker.md` after every session**

This is the one file you keep editing throughout the build. It's how the agent knows where you left off.

---

## Tips

**Fill in all 9 files.** Skipping even one creates gaps the agent will fill with assumptions — usually wrong ones.

**Be specific.** "Use Next.js" is less useful than "Server components by default — use `"use client"` only for interactive elements." The more concrete your rules, the more reliably the agent follows them.

**Update as you build.** If an architectural decision changes, update `architecture.md`. If a component gets added, add it to `ui-registry.md`. Stale context is worse than no context.

**Use the progress tracker every session.** Start by reading it, end by updating it.

---

## Pair With the JSM Agent Skills

These context files work best alongside the JSM Claude Code skills — `/architect`, `/remember`, `/review`, `/recover`, `/imprint`.

```bash
npx skills@latest add JavaScript-Mastery-Pro/skills
```

---

Built by [JavaScript Mastery](https://www.youtube.com/@javascriptmastery)
