# UI 注册表

动态文档。每次构建组件后更新。在构建任何新组件之前阅读此文件 — 在发明新模式之前完全匹配现有模式。

---

## 如何使用

构建任何组件之前：

1. 检查是否已有类似组件
2. 如果有 — 匹配其精确的类名
3. 如果没有 — 按照 ui-rules.md 和 ui-tokens.md 构建，然后添加到此文件

构建任何组件后 — 用组件名、文件路径和使用的精确类名更新此文件。

---

## 组件

### Navbar
- **文件：** `components/Navbar.tsx`
- **类型：** Client Component
- **类名：**
  - 容器：`h-16 bg-surface border-b border-border px-6 flex items-center justify-between`
  - Logo：`text-lg font-bold text-accent`
  - 活动导航项：`text-sm font-medium text-accent`
  - 非活动导航项：`text-sm font-medium text-text-secondary`
  - 用户名：`text-sm font-medium text-text-secondary`
  - 登出按钮：`p-2 text-text-muted hover:text-text-secondary`

### Auth Card（登录/注册通用卡片）
- **文件：** `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`
- **类型：** Client Component
- **类名：**
  - 卡片容器：`bg-surface border border-border rounded-xl p-8 shadow-sm`
  - 标题：`text-2xl font-bold text-text-primary`
  - 副标题：`text-sm text-text-secondary mt-2`
  - Label：`block text-sm font-medium text-text-secondary mb-1.5`
  - 输入框：`w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent`
  - 错误提示容器：`bg-error/10 border border-error/20 rounded-md px-3 py-2`
  - 错误文本：`text-sm text-error`
  - 主按钮：`w-full bg-accent text-accent-foreground rounded-md px-4 py-2.5 text-sm font-medium disabled:opacity-50`
  - 底部链接：`text-center text-sm text-text-secondary mt-6`
  - 链接高亮：`text-accent font-medium`

### Landing Hero（首页未登录状态）
- **文件：** `app/(main)/page.tsx`
- **类型：** Client Component（LandingPage）
- **类名：**
  - 背景光晕：`pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-accent/[0.07] blur-3xl`
  - 浮动装饰：`pointer-events-none absolute animate-float opacity-60` + `flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light shadow-sm`
  - 顶部徽章：`animate-fade-in-up stagger-1 mb-6 inline-flex items-center gap-2 rounded-full bg-accent-light px-4 py-1.5`
  - 标题：`animate-fade-in-up stagger-2 mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl`
  - 渐变文字：`animate-gradient-shift bg-gradient-to-r from-accent via-info to-accent bg-clip-text text-transparent`
  - 副标题：`animate-fade-in-up stagger-3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg`
  - CTA 按钮组：`animate-fade-in-up stagger-4 mt-10 flex flex-col items-center gap-4 sm:flex-row`
  - 主按钮：`group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:brightness-110`
  - 次要按钮：`inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-text-primary shadow-sm transition-all hover:bg-surface-secondary hover:shadow-md`
  - 社会证明条：`animate-fade-in-up stagger-5 mt-14 flex flex-wrap items-center justify-center gap-8`
  - 统计数值：`text-2xl font-bold text-text-primary`
  - 统计标签：`mt-0.5 text-xs text-text-muted`

### Landing Features（首页功能卡片）
- **文件：** `app/(main)/page.tsx`
- **类型：** Client Component（LandingPage 内部）
- **类名：**
  - 区域标题：`text-2xl font-bold text-text-primary sm:text-3xl`
  - 区域副标题：`mt-3 text-sm text-text-secondary`
  - 卡片网格：`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4`
  - 功能卡片：`group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up stagger-N`
  - 渐变顶部条：`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-info to-accent opacity-0 transition-opacity group-hover:opacity-100`
  - 图标容器：`mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-light transition-colors group-hover:bg-accent group-hover:text-accent-foreground`
  - 卡片标题：`text-sm font-semibold text-text-primary`
  - 卡片描述：`mt-2 text-xs leading-relaxed text-text-secondary`

### Landing Steps（首页使用流程）
- **文件：** `app/(main)/page.tsx`
- **类型：** Client Component（LandingPage 内部）
- **类名：**
  - 背景：`relative bg-surface px-4 py-20`
  - 连接线：`absolute left-8 top-8 bottom-8 hidden w-px bg-gradient-to-b from-accent/40 via-info/40 to-success/40 sm:block`
  - 步骤容器：`relative flex items-start gap-5 animate-fade-in-up stagger-N`
  - 步骤编号：`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface shadow-sm`
  - 编号文字：`text-lg font-bold text-accent`
  - 步骤标题：`text-base font-semibold text-text-primary`
  - 步骤描述：`mt-1 text-sm text-text-secondary`
  - 底部 CTA：`group inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:brightness-110`

### Dashboard（首页已登录状态）
- **文件：** `app/(main)/page.tsx`
- **类型：** Client Component（Dashboard）
- **类名：**
  - 容器：`relative space-y-6`
  - 装饰性背景光晕：`pointer-events-none absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-accent/[0.05] blur-3xl`
  - 欢迎区：`animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm`
  - 欢迎光晕（多层）：`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/[0.08] blur-3xl` + `bg-info/[0.06] blur-2xl` + `bg-success/[0.05] blur-2xl`
  - AI 徽章：`animate-fade-in-up stagger-1 mb-3 inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1`
  - 欢迎标题：`animate-fade-in-up stagger-2 text-2xl font-bold text-text-primary sm:text-3xl`
  - 欢迎副标题：`animate-fade-in-up stagger-3 mt-2 max-w-md text-sm leading-relaxed text-text-secondary`
  - 欢迎 CTA：`animate-fade-in-up stagger-4 mt-4 flex flex-wrap gap-3`
  - 主 CTA 按钮：`group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:shadow-lg hover:shadow-accent/25 hover:brightness-110`
  - 次 CTA 按钮：`inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary shadow-sm transition-all hover:bg-surface-secondary hover:shadow-md`
  - 每日进度环：`animate-fade-in-up stagger-3 hidden shrink-0 sm:flex flex-col items-center` + SVG 圆环 + `animate-[dash-in_1.5s_ease-out_forwards]`
  - 统计卡片网格：`grid grid-cols-1 gap-4 sm:grid-cols-3`
  - 统计卡片：`group relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-N`
  - 统计卡片渐变顶条：`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-info to-accent opacity-0 transition-opacity group-hover:opacity-100`
  - 统计图标容器：`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl`（变体：`bg-accent-light`、`bg-success-light`、`bg-info-light`）+ `transition-transform group-hover:scale-105`
  - 统计标签：`text-xs font-medium text-text-secondary`
  - 统计数值：`mt-0.5 text-2xl font-bold text-text-primary`
  - 进度条容器：`mt-4`
  - 进度条标签：`text-[11px] text-text-muted` + `text-[11px] font-medium text-text-muted`
  - 进度条背景：`h-1.5 overflow-hidden rounded-full bg-surface-secondary`
  - 进度条：`h-full rounded-full animate-[progress-in_1.2s_ease-out_forwards]`（变体：`bg-accent`、`bg-success`、`bg-info`）
  - 快捷操作网格：`grid grid-cols-1 gap-3 sm:grid-cols-2`
  - 快捷操作卡片：`group relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-fade-in-up stagger-N`
  - 快捷操作渐变顶条：`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${action.gradient} opacity-0 transition-opacity group-hover:opacity-100`
  - 操作图标容器：`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl` + `transition-all duration-300 group-hover:scale-105 group-hover:shadow-sm`
  - 操作标题：`text-sm font-semibold text-text-primary`
  - 操作描述：`mt-1 text-xs leading-relaxed text-text-secondary`
  - 操作箭头：`mt-0.5 h-4 w-4 shrink-0 text-text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent`
  - 本周目标标题：`mb-4 text-base font-semibold text-text-primary`
  - 本周目标容器：`rounded-xl border border-border bg-surface p-5 shadow-sm`
  - 目标行标签：`text-sm font-medium text-text-primary` + `text-xs text-text-muted`
  - 目标进度条背景：`h-2 overflow-hidden rounded-full bg-surface-secondary`
  - 目标进度条：`h-full rounded-full animate-[progress-in_1s_ease-out_Nms_forwards] opacity-0`（变体：`bg-accent`、`bg-info`、`bg-success`）
  - 目标提示：`mt-4 flex items-center gap-1.5 rounded-lg bg-accent-light/50 px-3 py-2` + `text-xs text-accent`
  - 最近动态容器：`rounded-xl border border-border bg-surface p-5 shadow-sm`
  - 时间线连接线：`absolute left-[15px] top-8 bottom-8 w-px bg-gradient-to-b from-accent/30 via-info/20 to-transparent`
  - 动态项：`relative flex items-start gap-3 animate-fade-in-up`（逐项延迟 style `animationDelay`）
  - 动态图标容器：`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm`
  - 动态文本：`text-sm text-text-primary`
  - 动态时间：`mt-1 flex items-center gap-1 text-xs text-text-muted`
  - 求职小贴士标题：`flex items-center gap-1.5` + `text-xs font-semibold text-text-primary`
  - 小贴士项：`flex items-start gap-2.5` + `mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent` + `text-xs leading-relaxed text-text-secondary`

### Profile Page（个人资料页面）
- **文件：** `app/(main)/profile/page.tsx`
- **类型：** Client Component
- **类名：**
  - 欢迎区容器：`animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm`
  - 装饰光晕：`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/[0.08] blur-3xl` + `bg-info/[0.06] blur-2xl`
  - AI 徽章：`animate-fade-in-up stagger-1 mb-3 inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1`
  - 欢迎标题：`animate-fade-in-up stagger-2 text-2xl font-bold text-text-primary sm:text-3xl`
  - 欢迎副标题：`animate-fade-in-up stagger-3 mt-2 max-w-xl text-sm leading-relaxed text-text-secondary`
  - 页面布局：`grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]`
  - 侧栏容器：`space-y-6`
  - 底部保存栏：`animate-fade-in-up stagger-6 flex items-center justify-between rounded-xl border border-border bg-surface p-5 shadow-sm`
  - 保存成功标签：`rounded-full bg-success-light px-3 py-1 text-sm text-success-foreground animate-fade-in`
  - 保存按钮：`rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-all hover:brightness-110 hover:shadow-md hover:shadow-accent/20 disabled:opacity-50`

### ProfileAttentionBanner（个人资料完善提醒）
- **文件：** `components/features/profile/ProfileAttentionBanner.tsx`
- **类型：** Client Component
- **数据规则：** 完成度与缺失字段来自 `lib/profile-completion.ts` 的统一 10 项必填字段计算；Server Action 落库与前端提醒共用同一口径
- **类名：**
  - 容器：`animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm`
  - 装饰光晕：`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-accent/[0.06] blur-3xl` + `bg-warning/[0.05] blur-2xl`
  - 完成度环：`svg width=72 height=72 -rotate-90` + `animate-profile-ring-in`
  - 完成度百分比：`text-base font-bold text-text-primary`
  - 标题行：`flex items-center gap-2 mb-1`
  - 标题：`text-sm font-semibold text-text-primary`
  - 未完成徽章：`inline-flex items-center rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning`
  - 缺失字段标签：`inline-flex items-center gap-1 rounded-full bg-surface-secondary border border-border px-2.5 py-0.5 text-xs font-medium text-text-secondary animate-fade-in-up`
  - 关闭按钮：`absolute top-1 right-1 p-1.5 text-text-muted hover:text-text-secondary transition-colors`

### ConnectedAccounts（关联账户）
- **文件：** `components/features/profile/ConnectedAccounts.tsx`
- **类型：** Client Component
- **类名：**
  - 卡片容器：`group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-2`
  - 渐变顶条：`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-info via-accent to-info opacity-0 transition-opacity group-hover:opacity-100`
  - 标题：`text-base font-semibold text-text-primary flex items-center gap-2 mb-4`
  - 图标容器：`flex h-8 w-8 items-center justify-center rounded-lg bg-info-light transition-transform group-hover:scale-105`
  - 账号行：`flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/30`
  - 状态徽章：`inline-flex items-center gap-1 rounded-full bg-success-light px-2 py-0.5 text-xs font-medium text-success-foreground`
  - 查看按钮：`inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-text-primary hover:bg-surface-secondary transition-colors`
  - URL 输入框：`w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow`

### ResumeSection（简历管理）
- **文件：** `components/features/profile/ResumeSection.tsx`
- **类型：** Client Component
- **数据规则：** 简历存储桶为 private，查看文件固定打开 `/api/profile/resume/view`，由服务端验证当前用户并以内联 PDF 响应；识别按钮调用 Server Action，通过 5 分钟签名 URL 让 `qwen3.5-ocr` 直接完成 PDF 读取和结构化字段提取，结果仅回填页面状态、不直接落库；组件不直连 InsForge storage public URL
- **类名：**
  - 卡片容器：`group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-4`
  - 渐变顶条：`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-info via-accent to-info opacity-0 transition-opacity group-hover:opacity-100`
  - 标题：`text-base font-semibold text-text-primary flex items-center gap-2`
  - 生成按钮：`inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition-all hover:brightness-110 hover:shadow-md hover:shadow-accent/20`
  - AI 识别按钮：`inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition-all hover:brightness-110 hover:shadow-md hover:shadow-accent/20 disabled:opacity-50`
  - 识别说明：`text-xs leading-relaxed text-text-muted`
  - 已上传文件行：`flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-accent/30`
  - 上传区域：`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all`
  - 拖拽态：`border-accent bg-accent/[0.05]`
  - 默认上传态：`border-border hover:border-accent/40 hover:bg-accent/[0.02]`
  - 上传中 spinner：`h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin`

### ProfileForm（完整个人资料表单）
- **文件：** `components/features/profile/ProfileForm.tsx`
- **类型：** Client Component
- **类名：**
  - 区域卡片：`group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-N`
  - 区域渐变顶条：`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-info to-accent opacity-0 transition-opacity group-hover:opacity-100`
  - 区域图标容器：`flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light transition-transform group-hover:scale-105`（变体：`bg-info-light`、`bg-success-light`）
  - 区域标题：`flex items-center gap-2 text-base font-semibold text-text-primary`
  - 模块完成项：`flex items-center gap-2 animate-fade-in-up`（逐项延迟 60ms + 400ms 基础偏移）
  - 完成图标：`h-4 w-4 shrink-0 text-success`（CheckCircle2）/ `h-4 w-4 shrink-0 text-text-muted`（Circle）
  - 完成项文本：`text-xs font-medium text-text-primary`（已完成）/ `text-xs text-text-muted`（未完成）
  - 模块进度条：`h-1.5 flex-1 overflow-hidden rounded-full bg-surface-secondary` + `animate-[progress-in_1s_ease-out_forwards] opacity-0`
  - 进度计数：`text-[11px] font-medium text-text-muted`
  - 表单网格：`grid grid-cols-1 gap-4 md:grid-cols-2` / `md:grid-cols-3`
  - Label：`mb-1.5 block text-sm font-medium text-text-secondary`
  - 输入框：`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent`
  - 禁用输入框：`w-full cursor-not-allowed rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-text-muted`
  - 文本域：`w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent`
  - 技能标签：`inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent animate-fade-in-up`
  - 添加按钮：`rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary`
  - 动态条目：`relative rounded-lg border border-border p-4 animate-fade-in-up`
  - 删除按钮：`absolute right-3 top-3 text-text-muted transition-colors hover:text-error`
  - 空状态图标：`mx-auto mb-3 h-10 w-10 text-text-muted/40`

### Jobs Page（职位列表页面）
- **文件：** `app/(main)/jobs/page.tsx`
- **类型：** Client Component
- **搜索交互：** 顶部职位名称/地点表单只作为 Jooble API 查询条件，不参与返回列表的本地过滤；列表首次从 `/api/jobs` 加载，独立筛选框支持按公司、职位或地点实时筛选，以及全部、高匹配、中匹配、低匹配筛选。
- **状态规则：** 搜索期间禁用输入和按钮并显示旋转图标；成功、失败、首次加载和空结果均使用独立中文反馈；未经过 AI 评分的职位显示“待评分”。
- **类名：**
  - 统计卡片：`bg-surface border border-border rounded-xl p-4 shadow-sm`
  - 统计标签：`text-xs font-medium text-text-secondary uppercase`
  - 统计数值：`text-2xl font-bold text-text-primary mt-1`
  - 筛选按钮：`flex items-center gap-2 bg-surface border border-border rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary`
  - 下拉菜单：`absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-md py-1 z-10 min-w-[140px]`
  - 下拉菜单项：`w-full text-left px-3 py-2 text-sm hover:bg-surface-secondary`
  - 活动菜单项：`text-accent font-medium`
  - 搜索框：`bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent`
  - 表格容器：`bg-surface border border-border rounded-xl shadow-sm overflow-hidden`
  - 表头行：`grid grid-cols-[1fr_140px_120px_100px_100px_80px] gap-4 px-6 py-3 border-b border-border bg-surface-secondary`
  - 表头文字：`text-xs font-medium text-text-secondary uppercase`
  - 数据行：`grid grid-cols-[1fr_140px_120px_100px_100px_80px] gap-4 items-center px-6 py-4 border-b border-border last:border-b-0 hover:bg-surface-secondary transition-colors`
  - 职位标题链接：`text-sm font-medium text-text-primary hover:text-accent truncate block`
  - 发现时间：`text-xs text-text-muted mt-0.5`
  - 公司/地点：`flex items-center gap-1.5 min-w-0` + `text-sm text-text-secondary truncate`
  - 高匹配徽章：`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-success-light text-success-foreground`
  - 匹配徽章：`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-info-light text-info-foreground`
  - 低匹配徽章：`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-surface-secondary text-text-muted`
  - 状态徽章（已保存）：`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-info-light text-info-foreground`
  - 状态徽章（已投递）：`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-accent-light text-accent`
  - 申请链接按钮：`p-1.5 text-text-muted hover:text-accent`
  - 搜索中按钮：`bg-accent text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50` + `Loader2 animate-spin`
  - 错误提示：`border border-error/20 bg-error/10 text-error`
  - 成功提示：`border border-success/20 bg-success-light text-success-foreground`
  - 加载状态：`flex items-center justify-center gap-2 rounded-xl border border-border bg-surface p-12 text-sm text-text-secondary shadow-sm`

### Job Detail Page（职位详情页面）
- **文件：** `app/(main)/jobs/[id]/page.tsx`
- **类型：** Client Component
- **数据规则：** 使用动态路由 ID 调用受保护的 `/api/jobs/[id]`，仅返回当前用户的职位；Jooble 来源统一显示“查看职位来源”，无 AI 评分时显示说明卡片。
- **类名：**
  - 返回链接：`inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent`
  - 职位信息卡片：`bg-surface border border-border rounded-xl p-6 shadow-sm`
  - 职位标题：`text-2xl font-bold text-text-primary`
  - 信息行：`flex items-center gap-1.5` + `text-sm text-text-secondary`
  - 匹配分数徽章：`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-success-light text-success-foreground`
  - 操作按钮（主）：`inline-flex items-center gap-2 bg-accent text-accent-foreground rounded-md px-4 py-2.5 text-sm font-medium`
  - 操作按钮（次）：`inline-flex items-center gap-2 bg-surface border border-border text-text-primary rounded-md px-4 py-2.5 text-sm font-medium hover:bg-surface-secondary`
  - 职位描述容器：`lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-sm`
  - 职位描述文本：`text-sm text-text-primary leading-relaxed whitespace-pre-line`
  - 匹配详情卡片：`bg-surface border border-border rounded-xl p-6 shadow-sm`
  - 匹配进度条背景：`h-2 bg-surface-secondary rounded-full overflow-hidden`
  - 匹配进度条（高）：`h-full rounded-full bg-success`
  - 匹配进度条（中）：`h-full rounded-full bg-info`
  - 匹配进度条（低）：`h-full rounded-full bg-warning`

### Resumes Page（简历生成页面）
- **文件：** `app/(main)/resumes/page.tsx`
- **类型：** Server Component；预览交互由 `components/features/resume/ResumePreview.tsx` 提供
- **类名：**
  - 欢迎区：`animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm`
  - 信息卡片：`rounded-xl border border-border bg-surface p-5 shadow-sm`
  - 编辑按钮：`inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary`
  - 预览卡片：`overflow-hidden rounded-xl border border-border bg-surface shadow-sm`
  - 预览工具栏：`flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between`
  - 次要操作按钮：`inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary`
  - 主下载按钮：`inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-all hover:brightness-110 hover:shadow-md hover:shadow-accent/20`
  - PDF 预览框：`h-[75vh] min-h-[640px] w-full bg-surface-secondary`
- **模式说明：** 预览和下载使用同一受保护 Route Handler；资料编辑仍回到 `/profile`，保存后通过“刷新预览”更新。
