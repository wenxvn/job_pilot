<!-- Code standards: rules the agent must follow when writing code for this project -->

# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

- [e.g. Think before implementing — understand what is being built and why before writing a single line]
- [e.g. Scope is sacred — only build what the current feature requires]
- [e.g. Clean over clever — simple readable code is always preferred]
- [e.g. One thing at a time — complete one feature fully before touching the next]

---

## Language & Type Safety

- [e.g. Strict mode enabled — no exceptions]
- [e.g. Never use `any` — use `unknown` and narrow the type]
- [e.g. All function parameters and return types must be explicitly typed]
- [e.g. Use `const` by default — only use `let` when reassignment is necessary]

---

## File and Folder Naming

- [e.g. Folders: kebab-case]
- [e.g. Component files: PascalCase]
- [e.g. Utility files: camelCase]
- [e.g. One component per file]

---

## Component / Module Structure

```
[Paste your preferred component or module structure here as a code snippet]
[e.g. imports → types → component/function → exports]
```

- [e.g. No inline styles — all styling via design tokens]
- [e.g. No business logic inside UI components]

---

## API / Backend Conventions

```
[Paste your preferred route or controller structure here as a code snippet]
```

- [e.g. Every route validates the request before processing]
- [e.g. Always return `{ success: boolean, data?, error? }`]
- [e.g. Never expose raw error messages to the client]

---

## Database

- [e.g. Never query the DB directly from a component — always through a service layer]
- [e.g. Always scope queries to the current user — never fetch without a user filter]
- [e.g. Use transactions for operations that touch more than one table]

---

## Error Handling

- [e.g. Never use empty catch blocks — always log or handle]
- [e.g. User-facing errors must be human readable]
- [e.g. Log errors with a context prefix: `[module/function]`]

---

## Analytics Events

| Event          | When            | Properties |
| -------------- | --------------- | ---------- |
| `[event_name]` | [When it fires] | [params]   |
| `[event_name]` | [When it fires] | [params]   |

---

## Environment Variables

| Variable     | Used In          |
| ------------ | ---------------- |
| `[VAR_NAME]` | [file or module] |
| `[VAR_NAME]` | [file or module] |

---

## Comments

- [e.g. No comments explaining what the code does — code must be self-explanatory]
- [e.g. Comments only for why — explaining a non-obvious decision]

---

## Dependencies

Approved dependencies for this project:

- [package] — [purpose]
- [package] — [purpose]

Do not install any other packages without updating this list first.
