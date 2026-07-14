# 进度跟踪器

**最后更新：** 2026-07-14
**当前阶段：** 第三阶段 — AI 功能
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
- [x] 简历 PDF 私有存储查看修复（/api/profile/resume/view 服务端验证并以内联 PDF 打开新页面）
- [x] 简历 PDF AI 识别回填（qwen3.5-ocr 单次完成文字型/扫描版 PDF 读取、结构化与页面表单覆盖回填）
- [x] 个人资料页面视觉增强（完成度环 + 模块进度条 + 卡片 hover 动画 + stagger 入场）
- [x] 完整个人资料页面（ProfileAttentionBanner + ConnectedAccounts + ResumeSection + 五段 ProfileForm + Navbar 当前页状态）
- [x] 职位列表页面 UI（/jobs）— 统计卡片、筛选排序、表格列表、匹配徽章
- [x] 职位详情页面 UI（/jobs/[id]）— 职位信息、匹配详情、申请链接、简历操作
- [x] 网页 Profile 生成 PDF 简历（/resumes）— 中文模板、站内预览与下载
- [x] 职位页面中文搜索与筛选 — 职位名称、地点、公司/职位/地点全文检索及匹配分段筛选
- [x] Jooble 真实职位搜索 — 服务端 API Key、受保护搜索路由、结果规范化去重、jobs 表持久化与用户级 RLS
- [x] 职位列表与详情真实数据接入 — 首次加载、搜索中、成功/失败/空结果、待评分状态及外部申请链接
- [x] 修复 Jooble 结果被搜索输入误过滤 — API 查询条件与列表本地筛选状态完全分离

## 进行中
- [ ] 职位管理 — 状态更新与删除逻辑
- [ ] 职位 AI 匹配评分

## 待开始
- [ ] Browserbase/LinkedIn 职位搜索扩展
- [ ] 简历定制（基础 PDF 生成已完成）
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
- **2026-06-26** — private resumes bucket 不使用 public URL 查看；`resume_file_url` 保存同域查看入口 `/api/profile/resume/view`，Route Handler 验证当前用户后以内联 PDF 响应
- **2026-06-26** — 简历 AI 识别使用 `pdf-parse` 抽取文字，再调用阿里云百炼 OpenAI 兼容 `glm-5` 输出 JSON；识别结果只覆盖页面表单状态，仍需用户手动保存
- **2026-06-28** — 修复 GLM-5 识别超时：百炼 GLM 默认思考模式导致非流式 JSON 抽取超时，已在请求中传 `enable_thinking: false` 并缩短提示词
- **2026-06-28** — 修复 Next/Turbopack Server Action 中 `pdf-parse` worker 加载失败：`pdf-parse` / `pdfjs-dist` 设为 server external，并显式使用 `file://` worker URL
- **2026-07-12** — 简历识别采用两阶段策略：文字型 PDF 优先本地提取，文字为空或过少时通过 InsForge 5 分钟签名 URL 与 `qwen3.5-ocr` Responses API 解析扫描件，再交由 GLM-5 结构化回填
- **2026-07-12** — GLM-5 与 qwen-plus 因账户级免费额度耗尽返回 403；简历识别改为 `qwen3.5-ocr` 单模型链路，使用 PDF + 自定义 JSON 提示直接生成 Profile 字段
- **2026-07-12** — 真实简历端到端识别通过；服务端增加工作/教育经历去重和模板标题姓名过滤，页面回填时不再用空识别结果覆盖已有资料
- **2026-07-12** — 新增基于已保存 Profile 的服务端中文 PDF 简历生成；使用 `@react-pdf/renderer` 与 Noto Sans SC 字体，生成版与上传原始简历分离，`/resumes` 提供预览和下载
- **2026-07-14** — 真实职位搜索先接入 Jooble REST API；密钥仅保存在服务端环境变量，搜索结果按用户和来源链接去重保存，AI 匹配评分后续独立接入

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
- 修复 private bucket 简历查看 401：新增 `/api/profile/resume/view` 服务端 PDF 查看路由，ResumeSection 的“查看文件”改为打开同域新页面
- 新增简历 PDF AI 识别回填：ResumeSection 增加“AI 识别并填充”，服务端读取 private PDF、抽取文字、调用百炼结构化，再回填 Profile 页面状态
- 排查并修复 AI 识别失败：确认不是 GLM-5 识图能力问题，而是未关闭 `enable_thinking` 导致请求超时；新增 PostHog 成功/失败事件耗时记录
- 继续排查 AI 识别失败：确认最新失败不是模型问题，而是 `pdf-parse/pdf.js` worker 在 Next/Turbopack Server Action 中被打包到错误路径；改为 `serverExternalPackages` + `file://` worker 后，浏览器实测按钮可回填技能、工作经历、教育经历和手机号等字段

**2026-07-14**
- 新增 Jooble 服务端搜索适配器与 `/api/jobs/search`，密钥只读取 `.env.local`
- 新增 jobs 表、索引、RLS 和用户级数据库读写服务，并应用到 InsForge 后端
- `/jobs` 与 `/jobs/[id]` 移除模拟数据，接入真实职位加载、搜索、详情和外部申请链接
