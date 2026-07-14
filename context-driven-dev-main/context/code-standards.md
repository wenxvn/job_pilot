# 代码规范

本项目所有代码实现必须遵循以下规则。这些规则防止跨会话的模式漂移。

---

## 工程心态

- 先理解再实现 — 在写任何代码之前，理解正在构建什么以及为什么
- 范围神圣不可变 — 只构建当前功能所需的内容
- 简洁优于聪明 — 简单可读的代码总是首选
- 一次一件事 — 完整完成一个功能后再开始下一个

---

## 语言和类型安全

- 启用严格模式 — 没有例外
- 禁止使用 `any` — 使用 `unknown` 并进行类型收窄
- 所有函数参数和返回类型必须显式标注
- 默认使用 `const` — 仅在需要重新赋值时使用 `let`

---

## 文件和文件夹命名

- 文件夹：kebab-case
- 组件文件：PascalCase
- 工具文件：camelCase
- 每个文件一个组件

---

## 组件/模块结构

```typescript
// 1. 导入
import { ... } from '...'

// 2. 类型定义
interface Props { ... }

// 3. 组件/函数
export function ComponentName({ ... }: Props) {
  // hooks
  // handlers
  // render
}

// 4. 导出（如未使用 export function）
```

- 不使用内联样式 — 所有样式通过设计令牌
- UI 组件内不包含业务逻辑

---

## API/后端规范

```typescript
// API Route 示例
export async function POST(request: Request) {
  try {
    // 1. 验证请求
    const body = await request.json()
    
    // 2. 验证用户身份
    const { user, error: authError } = await getUser(request)
    if (authError) return NextResponse.json({ success: false, error: authError }, { status: 401 })
    
    // 3. 业务逻辑
    const result = await doSomething(body, user.id)
    
    // 4. 返回结果
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: '服务器错误' }, { status: 500 })
  }
}
```

- 每个路由在处理前验证请求
- 始终返回 `{ success: boolean, data?, error? }`
- 永不暴露原始错误消息给客户端

---

## 数据库

- 永不直接从组件查询数据库 — 始终通过服务层
- 始终限定查询范围为当前用户 — 不在没有用户过滤器的情况下获取数据
- 涉及多个表的操作使用事务
- 数据库插入使用数组格式：`insert([{ ... }])`
- 引用用户使用 `auth.users(id)`；在 RLS 策略中使用 `auth.uid()`
- 存储上传时，同时保存返回的 `url` 和 `key`

---

## InsForge 规范

- 所有数据库写入通过 `lib/insforge-server.ts`
- 客户端实例在 `lib/insforge-client.ts`
- SDK 返回 `{data, error}` 结构
- AI 集成使用 OpenRouter：`baseURL: "https://openrouter.ai/api/v1"`，服务端使用 `OPENROUTER_API_KEY`

---

## 错误处理

- 禁止使用空 catch 块 — 始终记录或处理
- 面向用户的错误必须是人类可读的
- 记录错误时带上下文前缀：`[module/function]`
- 每个 Stagehand `act()` 调用必须包裹在 try/catch 中

---

## 环境变量

| 变量                        | 用途                     |
| --------------------------- | ------------------------ |
| NEXT_PUBLIC_INSFORGE_URL    | InsForge 后端 URL        |
| NEXT_PUBLIC_INSFORGE_ANON_KEY | InsForge 匿名密钥      |
| INSFORGE_SERVICE_ROLE_KEY   | InsForge 服务角色密钥    |
| BROWSERBASE_API_KEY         | Browserbase API 密钥     |
| BROWSERBASE_PROJECT_ID      | Browserbase 项目 ID      |
| OPENAI_API_KEY              | OpenAI API 密钥          |
| BAILIAN_API_KEY             | 阿里云百炼 API 密钥      |
| BAILIAN_BASE_URL            | 阿里云百炼 OpenAI 兼容地址 |
| BAILIAN_OCR_MODEL           | 阿里云百炼 PDF OCR 模型（默认 qwen3.5-ocr） |
| JOOBLE_API_KEY              | Jooble 服务端职位搜索密钥 |
| AGENTSPAN_API_KEY           | AgentSpan API 密钥       |
| NEXT_PUBLIC_APP_URL         | 应用 URL                 |

---

## 注释

- 不写解释代码做了什么的注释 — 代码必须自解释
- 注释只解释为什么 — 解释不明显的决策

---

## 依赖

本项目已批准的依赖：

- `next` — 框架
- `react` / `react-dom` — UI 库
- `tailwindcss` — 样式
- `@insforge/sdk` — 后端 SDK
- `openai` — AI 集成
- `@browserbasehq/sdk` — Browserbase SDK
- `stagehand` — AI 浏览器代理
- `agentspan` — 代理编排
- `lucide-react` — 图标
- `@radix-ui/*` — UI 原语
- `shadcn/ui` 组件 — UI 组件

不要在未更新此列表的情况下安装其他包。
