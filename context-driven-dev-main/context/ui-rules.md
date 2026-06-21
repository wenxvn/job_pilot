<!-- UI rules: how the interface behaves — layout, interactions, and component patterns -->

# UI Rules

Concise rules for building [PROJECT NAME] UI. Design assets are available — use them as the source of truth for visual decisions. These rules cover the most important patterns and constraints to keep the UI consistent without over-specifying every detail.

---

## Font

Always import [YOUR FONT — e.g. Inter] via `next/font/google` in the root layout.

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

The `--font-sans` variable is already declared in `@theme` in globals.css. Apply the font variable class to the `<html>` tag in root layout. Never use system fonts as the primary font.

---

## Layout

- Page max-width: [e.g. 1440px], centered
- Main content area padding: [e.g. 32px on all sides]
- Gap between page sections: [e.g. 24px]
- Header height: [e.g. 64px], full width, [color] background, padding [e.g. 0 24px]
- All pages use [top navbar / sidebar] only — [describe nav structure]

---

## Navbar

[List nav items in order — e.g. Dashboard, Jobs, Profile]

- Active item: color `[token]`, font-weight [e.g. 500], [e.g. 14px]
- Inactive item: color `[token]`, font-weight [e.g. 500], [e.g. 14px]
- Active state indicator: [e.g. color change only / underline / left border]
- Navbar background: [color], full viewport width

---

## Cards

Every content section lives in a card.

```
background:    [e.g. #FFFFFF]
border:        1px solid [border token]
border-radius: [e.g. 16px]
padding:       [e.g. 24px]
box-shadow:    [e.g. 0px 1px 3px rgba(0,0,0,0.1)]
```

Never use colored card backgrounds — always [color]. Color goes inside cards via badges, bars, and text, never on the card surface itself.

---

## Typography Hierarchy

Three levels used consistently throughout:

**Section headings** — card titles, page section titles

```
font-size:   [e.g. 16px]
font-weight: [e.g. 600]
color:       [text-primary token]
line-height: [e.g. 24px]
```

**Body / primary content text**

```
font-size:   [e.g. 14px]
font-weight: [e.g. 500]
color:       [text-primary token]
line-height: [e.g. 20px]
```

**Secondary / muted text** — labels, timestamps, subtitles

```
font-size:   [e.g. 12px]
font-weight: [e.g. 400]
color:       [text-muted token]
line-height: [e.g. 16px]
```

---

## Badges

All badges use `border-radius: 9999px` (pill shape) unless specified otherwise.

```
padding:     [e.g. 2px 8px]
font-size:   [e.g. 12px]
font-weight: [e.g. 500]
```

[Note any badge variants that break the pill rule — e.g. trend badges use border-radius: 4px]

---

## Buttons

**Primary button:**

```
background:    [accent token]
color:         [accent-foreground token]
border-radius: [e.g. 8px]
padding:       [e.g. 8px 16px]
font-size:     [e.g. 14px]
font-weight:   [e.g. 500]
```

**Secondary button:**

```
background:    [surface token]
border:        1px solid [border token]
color:         [text-primary token]
border-radius: [e.g. 8px]
padding:       [e.g. 8px 16px]
```

**Ghost button:**

```
background:    transparent
color:         [text-secondary token]
hover:         [surface-secondary token]
border-radius: [e.g. 8px]
```

---

## Form Inputs

```
background:        [surface token]
border:            1px solid [border token]
border-radius:     [e.g. 8px]
padding:           [e.g. 8px 12px]
font-size:         [e.g. 14px]
color:             [text-primary token]
placeholder color: [text-muted token]
focus:             ring-1 ring-accent border-accent
```

---

## Table

- No alternating row colors — [color] rows only, separated by border
- Row border: `1px solid [border token]` between rows
- Column headers: uppercase, [e.g. 12px], font-weight [e.g. 500], color `[text-secondary token]`
- Row text: [e.g. 14px], color `[text-primary token]`
- Hover state: `background: [surface-secondary token]`

---

## Empty States

Every section that can be empty must have an empty state. Keep it minimal:

- Short descriptive text in `[text-muted token]`
- Optional icon above text
- CTA button if there's a logical next action

---

## Tailwind v4 Note

This project uses Tailwind v4. Tokens are defined with `@theme` in globals.css — no `tailwind.config.ts` needed. Never define colors in a config file. Always use `@theme` for new tokens.

---

## Do Nots

- Never use Tailwind's built-in color classes (`bg-purple-500`, `text-gray-600`) — use project tokens only
- Never define colors in `tailwind.config.ts` — use `@theme` in globals.css
- Never add gradients to card backgrounds
- Never use more than one font weight in a single UI element
- Never show raw error messages to users — always show human readable text
- [Add any project-specific rules here]
