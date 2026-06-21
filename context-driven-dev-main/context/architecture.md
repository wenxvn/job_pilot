<!-- System architecture: how the app is structured and how data flows through it -->

# Architecture

## Stack

| Layer            | Tool                        | Purpose                        |
| ---------------- | --------------------------- | ------------------------------ |
| [e.g. Framework] | [e.g. Next.js]              | [e.g. Full stack framework]    |
| [e.g. Database]  | [e.g. PostgreSQL]           | [e.g. Primary data store]      |
| [e.g. Auth]      | [e.g. Clerk]                | [e.g. Authentication]          |
| [e.g. AI]        | [e.g. OpenAI GPT-4o]        | [e.g. Matching and extraction] |
| [e.g. Styling]   | [e.g. Tailwind + shadcn/ui] | [e.g. UI components]           |
| [e.g. Language]  | [e.g. TypeScript strict]    | [e.g. Throughout]              |

---

## Folder Structure

```
/
├── context/                    # context files live here
├── [e.g. app/]
│   ├── [route]/                # [describe]
│   └── api/                    # [describe]
├── [e.g. components/]
│   ├── ui/                     # [describe]
│   └── [feature]/              # [describe]
├── [e.g. lib/]                 # [describe]
└── [e.g. types/]               # [describe]
```

---

## System Boundaries

| Folder               | Owns                                                                |
| -------------------- | ------------------------------------------------------------------- |
| `[e.g. app/]`        | [e.g. Pages and API routes only. No business logic.]                |
| `[e.g. components/]` | [e.g. UI only. No data fetching. No direct DB calls.]               |
| `[e.g. lib/]`        | [e.g. Third party client initialisation and shared utilities only.] |
| `[e.g. types/]`      | [e.g. TypeScript types shared across the project.]                  |

---

## Data Flows

### [Flow 1 — e.g. UI Mutation]

```
[e.g. User interaction in component]
        ↓
[e.g. Server Action]
        ↓
[e.g. DB write]
        ↓
[e.g. Revalidate or redirect]
```

### [Flow 2 — e.g. Agent Operation]

```
[e.g. User clicks trigger]
        ↓
[e.g. API route]
        ↓
[e.g. Agent function]
        ↓
[e.g. External API call]
        ↓
[e.g. Results saved to DB]
```

---

## Database Schema

### `[table_name]`

| Column     | Type        | Notes                   |
| ---------- | ----------- | ----------------------- |
| id         | uuid        | Primary key             |
| user_id    | uuid        | References [auth table] |
| [column]   | [type]      | [notes]                 |
| created_at | timestamptz |                         |
| updated_at | timestamptz |                         |

### `[table_name]`

| Column   | Type   | Notes       |
| -------- | ------ | ----------- |
| id       | uuid   | Primary key |
| [column] | [type] | [notes]     |

---

## Storage

| Bucket        | Path                            | Contents      |
| ------------- | ------------------------------- | ------------- |
| [bucket_name] | [e.g. files/{user_id}/file.pdf] | [description] |

---

## Authentication

- Provider: [e.g. Clerk / NextAuth / custom]
- Methods: [e.g. Google OAuth, GitHub OAuth, email+password]
- Protected routes: [list them]
- Public routes: [list them]
- [Any redirect behavior after login/logout]

---

## [Key Integration] Pattern

[Add one section per major external integration — DB client, AI client, third-party APIs, etc.]

```typescript
// [Description of when/how this pattern is used]
[code snippet]
```

---

## Invariants

Rules the AI agent must never violate:

- [e.g. API routes contain no UI logic. Components contain no DB logic.]
- [e.g. All DB queries must be scoped to the current user_id — never query without a user filter.]
- [e.g. No hardcoded hex values or raw color classes in components — use CSS variables from ui-tokens.md.]
- [Add more as needed]
