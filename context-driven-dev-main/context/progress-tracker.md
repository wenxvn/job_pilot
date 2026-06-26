# 进度跟踪器

**最后更新：** 2026-06-26
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
- [x] 首页视觉升级（Landing Page 完整重构 + Dashboard 丰富化 + CSS 动画系统）
- [x] Dashboard 视觉增强（多层光晕欢迎区 + 每日进度环 + 统计进度条 + 2x2 快捷操作 + 本周目标 + 动态时间线）
- [x] PostHog 分析集成（Provider + usePostHog hook + 事件追踪）
- [x] 个人资料页面 UI（/profile）
- [x] profiles 表创建（数据库迁移 + RLS 策略）
- [x] resumes 存储桶创建（private + RLS 策略）
- [x] 个人资料 Server Actions（getProfile / upsertProfile / uploadResume）
- [x] 个人资料页面接入真实数据（加载 / 保存 / 简历上传）
- [x] 个人资料表单完整接入 InsForge DB/Storage（固定简历路径覆盖 + 上传后立即写回 profile + 完成度落库）
- [x] 个人资料页面视觉增强（完成度环 + 模块进度条 + 卡片 hover 动画 + stagger 入场）
- [x] 完整个人资料页面（ProfileAttentionBanner + ConnectedAccounts + ResumeSection + 五段 ProfileForm + Navbar 当前页状态）
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
- **2026-06-22** — 首页视觉升级：Landing Page 增加浮动装饰、渐变光晕、四步流程、社会证明条；Dashboard 增加统计卡片、快捷操作列表、最近动态、求职小贴士；globals.css 新增 fade-in-up / float / gradient-shift / pulse-ring 动画系统
- **2026-06-22** — profiles 表使用 JSONB 存储 experience 数组，TEXT[] 存储 skills
- **2026-06-22** — resumes 存储桶设为 private，RLS 策略基于 key 前缀匹配 user_id
- **2026-06-22** — 个人资料使用 upsert（onConflict: user_id），每个用户一条记录
- **2026-06-22** — Server Actions 使用 InsForge SDK：client.auth.getCurrentUser() + client.database.from()
- **2026-06-26** — 完整个人资料扩展沿用 profiles 单表，新增 phone、bio、education、job_preferences 字段；教育经历和求职偏好使用 JSONB，保持一次保存完整资料
- **2026-06-26** — 个人资料完成度使用统一函数计算并落库；基础简历固定保存到 resumes/{user_id}/resume.pdf，上传后立即写回 profiles

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
- 创建职位详情页面 UI（/jobs/[id]）— 职位信息、匹配详情、申请链接、简历操作
- 个人资料页面视觉增强：SVG 扇形完成度环 + SectionProgress 模块进度检查项 + 卡片 hover 渐变顶条 + stagger 入场动画 + globals.css 新增 profile-ring-in 动画

**2026-06-26**
- 新增完整个人资料组件：ProfileAttentionBanner、ConnectedAccounts、ResumeSection、ProfileForm
- 个人资料页改为组合页面：顶部介绍 + 完善提醒 + 五段表单 + 关联账户侧栏 + 简历拖拽上传/生成入口
- 新增 profiles 字段迁移：phone、bio、education、job_preferences
- Navbar 将个人资料加入主导航，并使用路径前缀判断当前页高亮
- 新增个人资料完成度字段迁移：is_complete、completion_percentage、missing_fields
- 新增共享完成度计算函数，并让 Server Action 与 ProfileAttentionBanner 使用同一套必填字段口径
- 简历上传改为固定 key 覆盖，上传成功后立即更新 profiles 中的 resume_file_url / resume_file_key
