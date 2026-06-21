<!-- UI tokens: the design system values the agent must use for all styling -->

# UI Tokens

Design tokens for [PROJECT NAME]. All colors, typography, spacing, and component values extracted from the delivered design. Use these exact values throughout the codebase — never hardcode colors or use raw Tailwind color classes in components.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using the `@theme` directive in `app/globals.css`. No `tailwind.config.ts` needed for colors or tokens.

Tailwind v4 automatically generates utility classes from `@theme` variables:

- `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`

```tsx
// Correct — uses generated utility classes
className="bg-surface text-text-primary border-border"

// Also correct — references CSS variable directly
style={{ color: 'var(--color-text-primary)' }}

// Never — hardcoded hex values
className="bg-[#F6F7FB] text-[#101828]"

// Never — raw Tailwind color classes
className="bg-purple-500 text-gray-600"
```

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Font */
  --font-sans: "[YOUR FONT — e.g. Inter]", sans-serif;

  /* Page and surface backgrounds */
  --color-background: [e.g. #F6F7FB];
  --color-surface: [e.g. #FFFFFF];
  --color-surface-secondary: [e.g. #F9FAFB];

  /* Borders */
  --color-border: [e.g. #E7EAF3];
  --color-border-light: [e.g. #E5E7EB];

  /* Text */
  --color-text-primary: [e.g. #101828];
  --color-text-secondary: [e.g. #6A7282];
  --color-text-muted: [e.g. #99A1AF];

  /* Primary accent */
  --color-accent: [e.g. #7C5CFC];
  --color-accent-dark: [e.g. #5E4CFF];
  --color-accent-light: [e.g. #F3E8FF];
  --color-accent-foreground: [e.g. #FFFFFF];

  /* Success */
  --color-success: [e.g. #10B981];
  --color-success-light: [e.g. #D0FAE5];
  --color-success-foreground: [e.g. #007A55];

  /* Info */
  --color-info: [e.g. #61A8FF];
  --color-info-light: [e.g. #DBEAFE];
  --color-info-foreground: [e.g. #155DFC];

  /* Warning */
  --color-warning: [e.g. #FF8904];
  --color-warning-foreground: [e.g. #FFFFFF];

  /* Error */
  --color-error: [e.g. #EF4444];
  --color-error-foreground: [e.g. #FFFFFF];

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## Color Usage Guide

### Page Layout

| Element           | Token                  |
| ----------------- | ---------------------- |
| Page background   | `bg-background`        |
| Card / surface    | `bg-surface`           |
| Secondary surface | `bg-surface-secondary` |
| Default border    | `border-border`        |
| Light border      | `border-border-light`  |

### Typography

| Element                | Token                 |
| ---------------------- | --------------------- |
| Headings, primary text | `text-text-primary`   |
| Secondary text, labels | `text-text-secondary` |
| Placeholder, muted     | `text-text-muted`     |

### Accent (Primary Color)

Used for: primary buttons, active nav items, focus rings

| Element                | Token                    |
| ---------------------- | ------------------------ |
| Button background      | `bg-accent`              |
| Button text            | `text-accent-foreground` |
| Light badge background | `bg-accent-light`        |

### Status Colors

| Status  | Background         | Text                      |
| ------- | ------------------ | ------------------------- |
| Success | `bg-success-light` | `text-success-foreground` |
| Info    | `bg-info-light`    | `text-info-foreground`    |
| Warning | `bg-warning`       | `text-warning-foreground` |
| Error   | `bg-error`         | `text-error-foreground`   |

---

## Typography

| Element           | Size | Weight     | Line height | Color token           |
| ----------------- | ---- | ---------- | ----------- | --------------------- |
| Page heading      | [px] | [e.g. 700] | [px]        | `text-text-primary`   |
| Section heading   | [px] | [e.g. 600] | [px]        | `text-text-primary`   |
| Body text         | [px] | [e.g. 400] | [px]        | `text-text-primary`   |
| Label             | [px] | [e.g. 500] | [px]        | `text-text-secondary` |
| Muted / timestamp | [px] | [e.g. 400] | [px]        | `text-text-muted`     |

Font family: **[YOUR FONT]** — import via `next/font/google`, never use a fallback system font.

---

## Spacing

| Token       | Value  | Usage                 |
| ----------- | ------ | --------------------- |
| `gap-2`     | 8px    | Badge and tag gaps    |
| `gap-4`     | 16px   | Section internal gaps |
| `gap-6`     | 24px   | Between sections      |
| `p-4`       | 16px   | Card padding          |
| `p-6`       | 24px   | Large card padding    |
| `px-4 py-2` | 16/8px | Button padding        |
| `px-3 py-1` | 12/4px | Badge padding         |

---

## Component Tokens

### Cards

```
background:    bg-surface
border:        1px solid var(--color-border)
border-radius: [e.g. rounded-2xl]
padding:       p-6
box-shadow:    [e.g. 0px 1px 3px rgba(0,0,0,0.1)]
```

### Buttons

**Primary:**

```
background:    bg-accent
text:          text-accent-foreground
border-radius: rounded-md
padding:       px-4 py-2
font-weight:   font-medium
```

**Secondary:**

```
background:    bg-surface
border:        border border-border
text:          text-text-primary
border-radius: rounded-md
padding:       px-4 py-2
```

**Ghost:**

```
background:    transparent
text:          text-text-secondary
hover:         hover:bg-surface-secondary
border-radius: rounded-md
```

### Input Fields

```
background:  bg-surface
border:      border border-border
border-radius: rounded-md
padding:     px-3 py-2
text:        text-text-primary
placeholder: text-text-muted
focus:       ring-1 ring-accent
```

### Badges

```
border-radius: rounded-full
padding:       px-2 py-0.5
font-size:     text-xs
font-weight:   font-medium
```

---

## Invariants

- Never use hex values directly in components — always use CSS variables via Tailwind tokens
- Font is [YOUR FONT] — always import via `next/font/google`, never use a fallback system font
- Never use raw Tailwind color classes like `bg-purple-500` or `text-gray-600` — use project tokens only
- The primary accent color is the only [color] — never use Tailwind's built-in color scale for it
- All borders default to `--color-border` — never use `border-gray-*`
