---
description: 使用 MCP 构建应用的指令
globs: *
alwaysApply: true
---

## 语言约定

**本项目使用中文。** 所有面向用户的文案、注释、commit message、文档均使用中文。代码变量名、函数名、文件名使用英文。

<!-- BEGIN:nextjs-agent-rules -->

# 这不是你熟悉的 Next.js

此版本有重大变更 — API、约定和文件结构可能都与你的训练数据不同。在编写任何代码之前，请先阅读 `node_modules/next/dist/docs/` 中的相关指南。注意弃用通知。

<!-- END:nextjs-agent-rules -->

## 实现前必须先阅读

按以下顺序阅读，然后再进行任何实现：

1. context-driven-dev-main/context/project-overview.md
2. context-driven-dev-main/context/architecture.md
3. context-driven-dev-main/context/ui-tokens.md
4. context-driven-dev-main/context/ui-rules.md
5. context-driven-dev-main/context/ui-registry.md
6. context-driven-dev-main/context/code-standards.md
7. context-driven-dev-main/context/library-docs.md
8. context-driven-dev-main/context/build-plan.md
9. context-driven-dev-main/context/progress-tracker.md

## 永不改变的规则

- 永不使用硬编码十六进制值或原始 Tailwind 颜色类
- 每个功能完成后更新 `progress-tracker.md` 和 `ui-registry.md`
- 使用任何第三方库之前 — 先加载其已安装的技能，
  然后阅读 `context-driven-dev-main/context/library-docs.md` 了解项目特定规则
- 如果同一个问题在一次纠正提示后仍然存在 —
  立即停止并运行 /recover

## 绝对不可违反的约束

- API 路由不包含 UI 逻辑。组件不包含数据库逻辑。
- `agent/` 中的代理代码永不从 `components/` 或 `actions/` 导入
- Server Actions 永不调用代理函数 — 仅 API 路由调用代理函数
- 所有代理的 InsForge 数据库写入仅通过 `lib/insforge-server.ts`
- 永不触碰 Easy Apply — 仅使用外部申请链接
- 每个 Stagehand `act()` 调用都包裹在 try/catch 中
- 匹配阈值始终来自 `lib/utils.ts` 中的 `MATCH_THRESHOLD`
- AgentSpan 步骤 ID 始终使用格式 `apply-{job_id}`

## 可用技能

- `/architect` — 任何复杂功能之前。先思考再构建。
- `/imprint` — 任何新 UI 组件之后。捕获模式。
- `/review` — 演示之前或感觉不对时。
- `/recover` — 一次纠正后仍有问题时。
- `/remember save` — 功能跨多个会话时。
- `/remember restore` — 返回跨会话功能时。

# InsForge SDK 文档 - 概览

## 什么是 InsForge？

后端即服务（BaaS）平台，提供：

- **数据库**：PostgreSQL + PostgREST API
- **认证**：邮箱/密码 + OAuth（Google、GitHub）
- **存储**：文件上传/下载
- **AI**：OpenRouter 密钥配置和模型目录，支持直接 OpenAI 兼容集成
- **函数**：无服务器函数部署
- **实时通信**：WebSocket 发布/订阅（数据库 + 客户端事件）

## 安装

以下是安装和使用 InsForge TypeScript SDK 构建 Web 应用的分步指南。如果你正在构建其他类型的应用，请参考：
- [Swift SDK 文档](/sdks/swift/overview) — 适用于 iOS、macOS、tvOS 和 watchOS 应用
- [Kotlin SDK 文档](/sdks/kotlin/overview) — 适用于 Android 应用
- [REST API 文档](/sdks/rest/overview) — 直接 HTTP API 访问

### 严重警告：必须按顺序执行以下步骤

### 步骤 1：下载模板

使用 `download-template` MCP 工具创建一个预配置了后端 URL 和匿名密钥的新项目。

### 步骤 2：安装 SDK

```bash
npm install @insforge/sdk@latest
```

### 步骤 3：创建 SDK 客户端

你必须使用 `createClient()` 创建客户端实例，传入基础 URL 和匿名密钥：

```javascript
import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://your-app.region.insforge.app',  // 你的 InsForge 后端 URL
  anonKey: 'your-anon-key-here'       // 从后端元数据获取
});
```

**API 基础 URL**：你的 API 基础 URL 是 `https://your-app.region.insforge.app`。

## 获取详细文档

### 严重警告：编写代码前必须先获取文档

InsForge 提供官方 SDK 和 REST API，使用它们从应用代码中与 InsForge 服务交互。

- [TypeScript SDK](/sdks/typescript/overview) — JavaScript/TypeScript
- [Swift SDK](/sdks/swift/overview) — iOS、macOS、tvOS 和 watchOS
- [Kotlin SDK](/sdks/kotlin/overview) — Android 和 Kotlin 多平台
- [REST API](/sdks/rest/overview) — 直接 HTTP API 访问

在编写或编辑任何 InsForge 集成代码之前，你**必须**调用 `fetch-docs` 或 `fetch-sdk-docs` MCP 工具获取最新的 SDK 文档。这确保你拥有准确、最新的实现模式。

### 使用 InsForge `fetch-docs` MCP 工具获取特定 SDK 文档：

可用文档类型：

- `"instructions"` — 后端设置要点（从这里开始）
- `"real-time"` — 通过 WebSocket 的实时发布/订阅（数据库 + 客户端事件）
- `"db-sdk-typescript"` — 使用 TypeScript SDK 进行数据库操作
- **认证** — 根据实现选择：
  - `"auth-sdk-typescript"` — 自定义认证流程的 TypeScript SDK 方法
  - `"auth-components-react"` — React+Vite 的预构建认证 UI（单页应用）
  - `"auth-components-react-router"` — React(Vite+React Router) 的预构建认证 UI（多页应用）
  - `"auth-components-nextjs"` — Next.js 的预构建认证 UI（SSR 应用）
- `"storage-sdk"` — 文件存储操作
- `"functions-sdk"` — 无服务器函数调用
- `"ai-integration-sdk"` — 使用配置的 OpenRouter 密钥和 OpenAI SDK 进行 AI 集成
- `"real-time"` — 通过 WebSocket 的实时发布/订阅（数据库 + 客户端事件）
- `"deployment"` — 通过 MCP 工具部署前端应用

这些文档主要是 TypeScript SDK。对于其他语言，你也可以使用 `fetch-sdk-docs` MCP 工具获取特定文档。

### 使用 InsForge `fetch-sdk-docs` MCP 工具获取特定 SDK 文档

你可以使用 `fetch-sdk-docs` MCP 工具，通过特定功能类型和语言获取 SDK 文档。

可用功能类型：
- db — 数据库操作
- storage — 文件存储操作
- functions — 无服务器函数调用
- auth — 用户认证
- ai — 使用配置的 OpenRouter 密钥和 OpenAI SDK 进行 AI 集成
- realtime — 通过 WebSocket 的实时发布/订阅（数据库 + 客户端事件）

可用语言：
- typescript — JavaScript/TypeScript SDK
- swift — Swift SDK（适用于 iOS、macOS、tvOS 和 watchOS）
- kotlin — Kotlin SDK（适用于 Android 和 JVM 应用）
- rest-api — REST API

## 何时使用 SDK vs MCP 工具

### 应用逻辑始终使用 SDK：

- 认证（注册、登录、登出、个人资料）
- 数据库 CRUD（查询、插入、更新、删除）
- 存储操作（上传、下载文件）
- 通过配置的 OpenRouter 密钥使用 OpenAI SDK 或 OpenRouter HTTP API 进行 AI 集成
- 无服务器函数调用

### 基础设施使用 MCP 工具：

- 项目脚手架（`download-template`）— 下载预集成 InsForge 的入门模板
- 后端设置和元数据（`get-backend-metadata`）
- 数据库模式管理（`run-raw-sql`、`get-table-schema`）
- 存储桶创建（`create-bucket`、`list-buckets`、`delete-bucket`）
- 无服务器函数部署（`create-function`、`update-function`、`delete-function`）
- 前端部署（`create-deployment`）— 将前端应用部署到 InsForge 托管

## 重要说明

- 认证：自定义 UI 使用 `auth-sdk`，预构建 UI 使用框架特定组件
- SDK 所有操作返回 `{data, error}` 结构
- 数据库插入需要数组格式：`[{...}]`
- 无服务器函数只有单一端点（无子路径）
- 存储：上传文件到桶中，将 URL 存储在数据库中
- AI 集成应直接调用 OpenRouter，使用 `baseURL: "https://openrouter.ai/api/v1"` 和服务端 `OPENROUTER_API_KEY`
- **特别重要**：使用 Tailwind CSS v4。令牌使用 `@theme` 在 `globals.css` 中定义 — 颜色或令牌不需要 `tailwind.config.ts`。

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **job_pilot** (API base `https://9g5p2i2e.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
