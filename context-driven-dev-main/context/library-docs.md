# 库文档

本项目中每个第三方库的特定使用模式。在实现涉及这些库的功能之前，请阅读相关部分。

---

## 使用任何库之前

在实现任何使用第三方库的功能之前：

1. **检查项目根目录的 AGENTS.md** — 它列出了为此项目安装的每个技能
2. **检查是否为该库配置了 MCP 服务器** — 如果可用，优先使用
3. **阅读此文件** — 了解覆盖通用库知识的项目特定模式

权威性顺序：

```
MCP 服务器（实时文档）→ AGENTS.md 技能 → 此文件（项目规则）→ 通用训练知识
```

---

## InsForge SDK

后端即服务平台，提供数据库、认证、存储、AI、实时通信等。

### 客户端 vs 服务端

```typescript
// 客户端上下文（浏览器）
'use client'
import { createClient } from '@insforge/sdk'
const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
})
```

```typescript
// 服务端上下文
import { createClient } from '@insforge/sdk'
const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.INSFORGE_SERVICE_ROLE_KEY!
})
```

**规则：**

- 永不混用客户端/服务端客户端
- 所有数据库写入通过 `lib/insforge-server.ts`
- 始终处理错误返回 — 永不假设成功

### 数据库查询

```typescript
// 读取
const { data, error } = await client
  .from('jobs')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })

// 写入（数组格式）
const { data, error } = await client
  .from('jobs')
  .insert([{ title, company, user_id: userId }])

// 更新
const { data, error } = await client
  .from('jobs')
  .update({ status: 'applied' })
  .eq('id', jobId)
```

**规则：**

- 数据库插入必须使用数组格式 `insert([{ ... }])`
- 始终限定查询到当前用户
- 使用 `.single()` 期望恰好一行时

### 存储操作

```typescript
// 上传
const { data, error } = await client.storage
  .from('resumes')
  .upload(`${userId}/${resumeId}.pdf`, fileBuffer)

// 获取 URL
const { data: { publicUrl } } = client.storage
  .from('resumes')
  .getPublicUrl(`${userId}/${resumeId}.pdf`)
```

**规则：**

- 文件覆盖使用 `upsert: true`
- 永不写入磁盘 — 始终直接上传 buffer
- 同时保存返回的 `url` 和 `key`

---

## OpenAI / OpenRouter

用于匹配评分、简历定制、表单填写代理。

### 基本用法

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY
})

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: prompt }],
  response_format: { type: 'json_object' }
})
```

**规则：**

- 模型始终使用 `gpt-4o` — 永不切换模型
- 结构化数据始终使用 `response_format: json_object`
- 始终将响应内容作为字符串解析 — 包裹在 try/catch 中

### 温度设置

| 用途             | 温度  |
| ---------------- | ----- |
| 评分/提取        | 0.3   |
| 创意生成         | 0.7   |

---

## Browserbase

云浏览器服务，用于 LinkedIn 认证会话和职位抓取。

### 会话管理

```typescript
import { Browserbase } from '@browserbasehq/sdk'

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY })

// 创建会话
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  browserSettings: {
    context: { id: contextId } // 使用保存的上下文
  }
})
```

**规则：**

- 始终使用保存的上下文 ID 进行 LinkedIn 认证
- 会话录制 URL 保存到申请记录
- 高级隐身模式：`BROWSERBASE_ADVANCED_STEALTH=true`

---

## Stagehand

AI 浏览器代理，基于 Browserbase。

### DOM 操作

```typescript
import { Stagehand } from 'stagehand'

const stagehand = new Stagehand({ session })

// 导航
await page.goto(url)

// 填写表单
await page.act({ action: 'fill', selector: '#email', value: email })

// 点击
await page.act({ action: 'click', selector: 'button[type="submit"]' })
```

**规则：**

- 每个 `act()` 调用必须包裹在 try/catch 中
- Easy Apply 使用 DOM 模式
- 外部 ATS 使用混合模式

---

## AgentSpan

持久化代理编排。

### 步骤 ID 格式

```
apply-{job_id}  // 例如：apply-abc123
```

**规则：**

- 步骤 ID 始终使用格式 `apply-{job_id}`
- 幂等性通过步骤 ID 保证

---

## shadcn/ui

基于 Radix UI 的组件库。

### 安装组件

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

**规则：**

- 使用 Tailwind CSS v4 令牌进行样式设置
- 颜色使用 `@theme` 中定义的令牌
- 永不使用 Tailwind 内置颜色类

---

## Lucide React

图标库。

```typescript
import { Search, Briefcase, FileText } from 'lucide-react'

<Search className="w-4 h-4" />
```

**规则：**

- 图标大小统一：16px（`w-4 h-4`）、20px（`w-5 h-5`）、24px（`w-6 h-6`）
- 颜色继承父元素文本颜色

---

## PostHog

用户行为分析和事件追踪。

### 初始化

在 `components/PostHogProvider.tsx` 中初始化，已集成到根布局。

### 使用方式

```typescript
'use client'
import { usePostHog } from '@/hooks/usePostHog'

const { identify, reset, track } = usePostHog()

// 用户登录后识别
identify(userId, { email, name })

// 追踪事件
track('job_searched', { query, location })
track('resume_generated', { jobId })

// 用户登出时重置
reset()
```

**规则：**

- 永不在服务端代码中导入 PostHog
- 用户登录后调用 `identify`，登出时调用 `reset`
- 自定义事件命名使用 snake_case
- 追踪的属性保持简洁，不包含敏感信息