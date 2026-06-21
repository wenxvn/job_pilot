# 进度跟踪器

**最后更新：** 2026-06-21
**当前阶段：** 第一阶段 — 基础设施 → 第二阶段 — 核心页面
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

## 进行中
- [ ] 个人资料页面 — 完整 UI

## 待开始
- [ ] 个人资料逻辑
- [ ] 职位列表页面
- [ ] 职位详情页面
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

---

## 会话记录

**2026-06-21**
- 创建和完善所有规范性文档
- 确认项目技术栈和功能范围
- 初始化 Next.js 16 项目，配置 Tailwind CSS v4、TypeScript 严格模式
- 配置 InsForge SDK 客户端（浏览器 + 服务端）
- 实现 SSR 认证：proxy.ts + auth-actions.ts + refresh route
- 创建 AuthProvider + useAuth hook
- 实现登录页面 `/login`（邮箱密码登录）
- 实现注册页面 `/signup`（含邮箱验证流程）
- 创建 Navbar 组件（认证状态感知导航）
- 创建首页仪表盘（未登录展示 CTA，已登录展示功能卡片）
- 所有页面通过 TypeScript 检查和构建验证
- 下一步：个人资料页面 UI
