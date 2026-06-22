# 进度跟踪器

**最后更新：** 2026-06-22
**当前阶段：** 第二阶段 — 核心页面
**总体状态：** 进行中

---

## 已完成
- [x] 规范性文件创建和初始化
- [x] 项目概述文档
- [x] 架构文档
- [x] 代码规范文档
- [x] 库文档
- [x] UI 令牌文档
- [x] UI 规则文档
- [x] 构建计划文档
- [x] 项目初始化（Next.js 16 + Tailwind CSS v4 + TypeScript）
- [x] InsForge SDK 集成（客户端 + 服务端 + SSR 模式）
- [x] 认证功能（登录 + 注册 + 邮箱验证 + 登出 + session 管理）
- [x] 导航栏组件（认证状态感知）
- [x] 首页仪表盘（登录/未登录两种状态）
- [x] PostHog 分析集成（Provider + usePostHog hook + 事件追踪）
- [x] 个人资料页面 UI（/profile）
- [x] profiles 表创建（数据库迁移 + RLS 策略）
- [x] resumes 存储桶创建（private + RLS 策略）
- [x] 个人资料 Server Actions（getProfile / upsertProfile / uploadResume）
- [x] 个人资料页面接入真实数据（加载 / 保存 / 简历上传）
- [x] 职位列表页面 UI（/jobs）— 统计卡片、筛选排序、表格列表、匹配徽章
- [x] 职位详情页面 UI（/jobs/[id]）— 职位信息、匹配详情、申请链接、简历操作

## 进行中
- [ ] 职位管理 — 逻辑

## 待开始
- [ ] 职位搜索与匹配
- [ ] 简历生成与定制
- [ ] 申请记录

## 阻塞
- 无

---

## 已知问题
| 问题 | 严重性 | 状态 |
|------|--------|------|
| @insforge/sdk/ssr/middleware CookieStore 类型与 Next.js 16 RequestCookies 不兼容 | 低 | 已通过 as unknown as CookieStore 绕过 |

---

## 决策记录

- **2026-06-21** — 选择 Tailwind CSS v4 而非 v3.4
- **2026-06-21** — 确认使用 shadcn/ui + lucide-react + radix-ui 作为 UI 组件库
- **2026-06-21** — 确认四张核心数据表：profiles、jobs、resumes、applications
- **2026-06-21** — 确认功能范围：LinkedIn 搜索、匹配评分、简历管理、自动申请
- **2026-06-21** — 使用 Next.js 16 (proxy.ts 替代 middleware.ts)
- **2026-06-21** — 认证采用 InsForge SSR 模式：createBrowserClient + createServerClient + createAuthActions
- **2026-06-21** — 路由组：(auth) 用于登录/注册，(main) 用于主应用
- **2026-06-22** — profiles 表使用 JSONB 存储 experience 数组，TEXT[] 存储 skills
- **2026-06-22** — resumes 存储桶设为 private，RLS 策略基于 key 前缀匹配 user_id
- **2026-06-22** — 个人资料使用 upsert（onConflict: user_id），每个用户一条记录
- **2026-06-22** — Server Actions 使用 InsForge SDK：client.auth.getCurrentUser() + client.database.from()

---

## 会话记录

**2026-06-21**
- 创建和完善所有规范性文档
- 初始化 Next.js 16 项目，配置 Tailwind CSS v4、TypeScript 严格模式
- 配置 InsForge SDK 客户端（浏览器 + 服务端）
- 实现 SSR 认证：proxy.ts + auth-actions.ts + refresh route
- 创建 AuthProvider + useAuth hook + Navbar + 首页仪表盘 + PostHog 集成

**2026-06-22**
- 创建个人资料页面 UI（模拟数据版）
- InsForge CLI 登录并链接到 job_pilot 项目
- 创建 profiles 表迁移（含 RLS 策略 + updated_at 触发器）
- 创建 resumes 存储桶（private）+ 存储 RLS 策略
- 创建 types/profile.ts 类型定义
- 创建 actions/profile.ts（getProfile / upsertProfile / uploadResume）
- 更新 profile 页面接入真实数据（加载 / 保存 / 简历上传）
- 更新 ui-registry.md 和 progress-tracker.md
- 修正 library-docs.md 中 InsForge SDK API（client.database.from()）
- 创建职位列表页面 UI（/jobs）— 统计卡片、筛选排序、表格列表、匹配徽章
- 创建职位详情页面 UI（/jobs/[id]）— 职位信息、匹配详情进度条、申请链接、简历操作
