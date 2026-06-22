# Memory — 首页视觉全面升级

Last updated: 2026-06-22

## What was built

- **globals.css** — 新增动画系统：`fade-in-up` / `fade-in` / `float` / `float-delayed` / `pulse-ring` / `gradient-shift` / `shimmer`，以及 6 级 stagger 延迟（stagger-1 ~ stagger-6）
- **app/(main)/page.tsx** — 主页完全重写为两个独立组件：
  - **LandingPage**（未登录）：背景光晕、浮动装饰图标、AI 徽章、渐变流光标题、双 CTA 按钮带阴影、社会证明数据条（3x/85%/10s）、四大核心能力卡片（悬停渐变顶部条 + 图标反色）、四步使用流程（渐变连接线）、底部二次 CTA
  - **Dashboard**（已登录）：带光晕欢迎区、三列统计卡片（已发现职位/平均匹配度/已投递）、快捷操作列表（带箭头引导）、最近动态时间线 + 求职小贴士
- **ui-registry.md** — 同步所有新组件类名（Landing Hero、Landing Features、Landing Steps、Dashboard）
- **progress-tracker.md** — 记录首页视觉升级完成

## Decisions made

- Landing Page 和 Dashboard 拆分为独立函数组件，保持 page.tsx 结构清晰
- 使用 CSS 纯动画（@keyframes）而非 JS 动画库，零额外依赖
- 渐变文字效果使用 `bg-gradient-to-r from-accent via-info to-accent` + `animate-gradient-shift`
- 背景光晕使用 `blur-3xl` + 低透明度项目色，不使用硬编码颜色
- 功能卡片悬停效果：顶部渐变条显现 + 图标容器反色，保持交互层次感

## Problems solved

- `user.name ?? user.email` 类型错误（email 可能是 undefined），改为 `user.name ?? user.email ?? "用户"` 兜底

## Current state

- 首页视觉全面升级完成，TypeScript 零错误
- 项目已完成第一阶段（基础设施）和第二阶段大部分核心页面 UI
- 职位列表/详情页面使用模拟数据，尚未接入数据库
- PostHog 事件追踪已覆盖全部已完成页面的完整用户行为链路
- 已有事件：认证（logged_in/signed_up）、导航（nav_click）、首页（cta_click/feature_card_click）、个人资料（profile_saved/resume_uploaded）、职位列表（job_click/job_apply_click/jobs_filtered/jobs_sorted）、职位详情（job_viewed/job_apply_click/generate_resume_click）

## Next session starts with

- 构建计划第07步：**职位管理 — 逻辑**
  - 创建 `jobs` 表（数据库迁移 + RLS 策略）
  - Server Actions（查询、更新、删除职位）
  - 申请状态更新
  - 更新职位列表/详情页面接入真实数据

## Open questions

- 职位搜索与匹配（第08步）需要 Browserbase + Stagehand，是否已准备好 API key
- 简历生成与定制（第09步）需要 OpenRouter API key，需确认是否已配置
