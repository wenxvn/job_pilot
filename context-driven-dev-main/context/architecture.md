# 系统架构

## 技术栈

| 层级           | 工具                              | 用途                     |
| -------------- | --------------------------------- | ------------------------ |
| 框架           | Next.js 15                        | 全栈框架（App Router）   |
| 数据库         | InsForge（PostgreSQL）            | 主要数据存储             |
| 认证           | InsForge Auth                     | 用户认证和授权           |
| 存储           | InsForge Storage                  | 文件存储（简历 PDF）     |
| AI             | OpenAI GPT-4o                     | 匹配评分、简历定制       |
| 样式           | Tailwind CSS v4 + shadcn/ui       | UI 组件和样式            |
| 浏览器自动化   | Browserbase + Stagehand           | LinkedIn 职位抓取        |
| 代理编排       | AgentSpan                         | 持久化代理任务           |
| 语言           | TypeScript（严格模式）            | 全项目使用               |

---

## 文件夹结构

```
/
├── context-driven-dev-main/     # 上下文规范文件
│   └── context/                 # 项目上下文文档
├── app/                         # Next.js App Router
│   ├── (auth)/                  # 认证相关页面
│   │   ├── login/               # 登录页
│   │   └── signup/              # 注册页
│   ├── (main)/                  # 主应用页面
│   │   ├── jobs/                # 职位页面
│   │   ├── resumes/             # 简历页面
│   │   ├── applications/        # 申请记录页面
│   │   └── profile/             # 个人资料页面
│   └── api/                     # API 路由
├── components/                  # React 组件
│   ├── ui/                      # shadcn/ui 基础组件
│   └── features/                # 业务功能组件
├── lib/                         # 工具库
│   ├── insforge-server.ts       # InsForge 服务端操作
│   ├── insforge-client.ts       # InsForge 客户端实例
│   ├── utils.ts                 # 通用工具函数
│   └── constants.ts             # 常量定义
├── agent/                       # 代理相关代码
│   ├── linkedin/                # LinkedIn 搜索代理
│   └── resume/                  # 简历生成代理
├── actions/                     # Server Actions
├── types/                       # TypeScript 类型定义
└── hooks/                       # React Hooks
```

---

## 系统边界

| 目录                | 职责                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| `app/`              | 页面和 API 路由。不含业务逻辑。                                       |
| `components/`       | 纯 UI 组件。不获取数据。不直接调用数据库。                             |
| `lib/`              | 第三方客户端初始化和共享工具函数。                                     |
| `agent/`            | 代理逻辑。不导入 components 或 actions。                               |
| `actions/`          | Server Actions。不调用 agent 函数。                                   |
| `types/`            | 跨项目共享的 TypeScript 类型。                                        |

---

## 数据流

### 1. 职位搜索流程

```
用户点击搜索
        ↓
Server Action（触发搜索）
        ↓
API Route（/api/jobs/search）
        ↓
Agent（LinkedIn 代理）
        ↓
Browserbase 会话（LinkedIn 认证）
        ↓
Stagehand（职位抓取）
        ↓
AI 评分（GPT-4o）
        ↓
InsForge 数据库（保存职位）
        ↓
UI 更新（职位列表）
```

### 2. 简历生成流程

```
用户选择职位 + 点击生成简历
        ↓
Server Action
        ↓
API Route（/api/resumes/generate）
        ↓
Agent（简历代理）
        ↓
获取职位详情 + 用户资料
        ↓
GPT-4o（定制简历内容）
        ↓
InsForge 存储（保存 PDF）
        ↓
InsForge 数据库（保存记录）
        ↓
UI 更新（简历列表）
```

### 3. 职位申请流程

```
用户点击申请
        ↓
外部申请链接跳转（浏览器）
        ↓
或：AgentSpan（触发自动申请任务）
        ↓
Agent（申请代理）
        ↓
Stagehand（表单填写）
        ↓
InsForge 数据库（更新申请状态）
        ↓
UI 更新（申请记录）
```

---

## 数据库表结构

### `profiles` — 用户资料

| 列名           | 类型         | 说明                     |
| -------------- | ------------ | ------------------------ |
| id             | uuid         | 主键，关联 auth.users    |
| user_id        | uuid         | 外键，auth.users(id)     |
| full_name      | text         | 姓名                     |
| email          | text         | 邮箱                     |
| experience     | jsonb        | 工作经验数组             |
| skills         | text[]       | 技能列表                 |
| target_role    | text         | 目标职位                 |
| salary_min     | integer      | 最低期望薪资             |
| salary_max     | integer      | 最高期望薪资             |
| location       | text         | 所在地                   |
| linkedin_url   | text         | LinkedIn 个人主页        |
| created_at     | timestamptz  | 创建时间                 |
| updated_at     | timestamptz  | 更新时间                 |

### `jobs` — 职位

| 列名           | 类型         | 说明                     |
| -------------- | ------------ | ------------------------ |
| id             | uuid         | 主键                     |
| user_id        | uuid         | 外键，auth.users(id)     |
| title          | text         | 职位名称                 |
| company        | text         | 公司名称                 |
| location       | text         | 工作地点                 |
| description    | text         | 职位描述                 |
| source_url     | text         | 来源链接（LinkedIn）     |
| apply_url      | text         | 申请链接                 |
| apply_type     | text         | 申请类型（external/easy） |
| match_score    | integer      | 匹配分数（0-100）        |
| match_breakdown| jsonb        | 匹配详情                 |
| status         | text         | 状态（saved/applied/...）|
| discovered_at  | timestamptz  | 发现时间                 |
| created_at     | timestamptz  | 创建时间                 |

### `resumes` — 简历

| 列名           | 类型         | 说明                     |
| -------------- | ------------ | ------------------------ |
| id             | uuid         | 主键                     |
| user_id        | uuid         | 外键，auth.users(id)     |
| job_id         | uuid         | 关联职位（可选）         |
| type           | text         | 类型（base/tailored）    |
| title          | text         | 简历标题                 |
| content        | jsonb        | 简历内容                 |
| file_url       | text         | PDF 文件 URL             |
| file_key       | text         | 存储 key                 |
| created_at     | timestamptz  | 创建时间                 |

### `applications` — 申请记录

| 列名           | 类型         | 说明                     |
| -------------- | ------------ | ------------------------ |
| id             | uuid         | 主键                     |
| user_id        | uuid         | 外键，auth.users(id)     |
| job_id         | uuid         | 外键，jobs(id)           |
| resume_id      | uuid         | 外键，resumes(id)        |
| method         | text         | 申请方式（external/agent）|
| status         | text         | 状态（pending/submitted/failed） |
| recording_url  | text         | Browserbase 录制 URL     |
| applied_at     | timestamptz  | 申请时间                 |
| created_at     | timestamptz  | 创建时间                 |

---

## 存储桶

| 桶名          | 路径                   | 内容           |
| ------------- | ---------------------- | -------------- |
| resumes       | `{user_id}/{resume_id}` | 简历 PDF 文件   |

---

## 关键约束

- API 路由不包含 UI 逻辑
- 组件不包含数据库逻辑
- Agent 代码（`agent/`）不从 `components/` 或 `actions/` 导入
- Server Actions 不调用 agent 函数 — 仅 API 路由调用
- 所有 InsForge 数据库写入通过 `lib/insforge-server.ts`
- 匹配阈值来自 `lib/utils.ts` 中的 `MATCH_THRESHOLD`
- AgentSpan 步骤 ID 格式：`apply-{job_id}`
- 使用外部申请链接 — 不使用 Easy Apply