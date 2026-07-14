# 项目概述

## 项目介绍

JobPilot 是一个职位发现和匹配跟踪工具，专为技术岗位求职者设计。它通过 Browserbase 保存的浏览器会话从 LinkedIn 发现职位，使用 LLM 对每个职位进行评分匹配，组织来源和申请链接，并能为特定职位生成定制简历。

---

## 解决的问题

**痛点：** 技术求职者在 LinkedIn 等平台上手动搜索、筛选、匹配职位，需要花费大量时间浏览和判断职位是否符合自身条件。

**解决方案：** JobPilot 自动化职位发现、智能匹配评分、简历定制，帮助求职者高效找到匹配的工作机会。

---

## 页面路由

```
/                  → 首页 / 仪表盘
/login             → 登录页
/signup            → 注册页
/profile           → 个人资料管理
/jobs              → 职位列表
/jobs/[id]         → 职位详情
/resumes           → 简历管理
/applications      → 申请记录
```

---

## 导航结构

**顶部导航栏：**
- Logo / 品牌名
- Jobs（职位）
- Resumes（简历）
- Applications（申请记录）
- 用户头像/下拉菜单（Profile、设置、登出）

---

## 核心用户流程

### 1. 注册登录与资料设置

1. 用户注册/登录账户
2. 填写个人资料（经验、技能、目标职位、薪资期望）
3. 上传基础简历 PDF

### 2. 职位发现与匹配

1. 用户连接 LinkedIn 浏览器会话（通过 Browserbase）
2. 系统通过 Jooble API 搜索公开职位，后续可使用 Browserbase 会话扩展 LinkedIn 来源
3. AI 对每个职位进行匹配评分
4. 高匹配度职位保存到职位库

### 3. 简历定制与申请

1. 用户浏览职位列表，查看匹配详情
2. 为特定职位生成定制简历
3. 使用外部链接申请或触发自动申请

---

## 数据架构

### 用户资料（profiles）

- 存储位置：InsForge 数据库
- 内容：经验、技能、目标职位、薪资期望
- 用途：职位匹配评分的基准

### 职位（jobs）

- 存储位置：InsForge 数据库
- 来源：Jooble API 搜索结果；LinkedIn Browserbase 搜索为后续扩展
- 内容：职位名称、公司、地点、描述、匹配分数、申请链接
- 用途：职位浏览和申请管理

### 简历（resumes）

- 存储位置：InsForge 存储 + 数据库记录
- 类型：基础简历、定制简历
- 用途：申请时使用

### 申请记录（applications）

- 存储位置：InsForge 数据库
- 内容：申请状态、申请时间、申请方式
- 用途：跟踪申请进度

---

## 功能范围

### 核心功能

- LinkedIn 职位搜索（通过 Browserbase 认证会话）
- 职位匹配评分（LLM 驱动）
- 职位列表和筛选
- 简历生成和定制
- 外部链接申请

### 实验功能

- LinkedIn Easy Apply（Stagehand DOM 模式）
- 外部 ATS 表单填写（Stagehand 混合模式）
- Browserbase 会话录制回放

### 不在范围内

- 内置职位申请（Easy Apply） — 使用外部链接
- 社交功能
- 薪资谈判工具

---

## 技术栈

- **前端：** Next.js 15（App Router）、Tailwind CSS v4、shadcn/ui、lucide-react
- **后端：** Next.js Server Actions、API Routes
- **数据库：** InsForge（PostgreSQL）
- **认证：** InsForge Auth（Email/Password + OAuth）
- **存储：** InsForge Storage
- **AI：** OpenAI GPT-4o（匹配评分、简历定制、表单填写）
- **浏览器自动化：** Browserbase（云浏览器）、Stagehand（AI 浏览器代理）
- **编排：** AgentSpan（持久化代理编排）
- **部署：** Vercel

---

## 分析事件

```typescript
// 职位搜索
job_search_started // { search_query, location }
job_search_completed // { jobs_found, jobs_matched }

// 职位匹配
job_match_scored // { job_id, match_score }
job_viewed // { job_id }

// 简历操作
resume_generated // { resume_type, job_id }
resume_downloaded // { resume_id }

// 申请操作
application_started // { job_id, application_type }
application_completed // { job_id, status }
```
