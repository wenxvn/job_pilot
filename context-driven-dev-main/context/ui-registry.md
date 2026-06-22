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

### Dashboard Cards（首页功能卡片）
- **文件：** `app/(main)/page.tsx`
- **类型：** Client Component
- **类名：**
  - 卡片：`bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`
  - 图标：`h-8 w-8 text-accent mb-3`
  - 标题：`text-base font-semibold text-text-primary`
  - 描述：`text-sm text-text-secondary mt-1`

### Landing Hero（首页未登录状态）
- **文件：** `app/(main)/page.tsx`
- **类名：**
  - 容器：`flex flex-col items-center justify-center min-h-[80vh] text-center`
  - 标题：`text-4xl font-bold text-text-primary mb-4`
  - 副标题：`text-lg text-text-secondary mb-8`
  - CTA 按钮：`bg-accent text-accent-foreground rounded-md px-6 py-3 text-sm font-medium`
  - 次要按钮：`bg-surface border border-border text-text-primary rounded-md px-6 py-3 text-sm font-medium`

### Profile Form（个人资料表单）
- **文件：** `app/(main)/profile/page.tsx`
- **类型：** Client Component
- **类名：**
  - 区域卡片：`bg-surface border border-border rounded-xl p-6 shadow-sm`
  - 区域标题：`text-base font-semibold text-text-primary mb-4 flex items-center gap-2`
  - 区域图标：`h-4 w-4 text-accent`
  - 表单网格：`grid grid-cols-1 md:grid-cols-2 gap-4`
  - Label：`block text-sm font-medium text-text-secondary mb-1.5`
  - 输入框：`w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent`
  - 禁用输入框：`w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-sm text-text-muted cursor-not-allowed`
  - 技能标签：`inline-flex items-center gap-1.5 bg-accent-light text-accent rounded-full px-3 py-1 text-xs font-medium`
  - 删除标签按钮：`hover:text-accent-dark`
  - 添加按钮：`bg-surface border border-border text-text-primary rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-secondary`
  - 文字链接按钮：`flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark`
  - 经验条目：`border border-border rounded-lg p-4 relative`
  - 文本域：`w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-none`
  - 上传区域：`border-2 border-dashed border-border rounded-lg p-8 text-center`
  - 上传图标：`h-8 w-8 text-text-muted mx-auto mb-3`
  - 保存成功标签：`text-sm text-success-foreground bg-success-light rounded-full px-3 py-1`
  - 保存按钮：`bg-accent text-accent-foreground rounded-md px-6 py-2.5 text-sm font-medium disabled:opacity-50`

### Jobs Page（职位列表页面）
- **文件：** `app/(main)/jobs/page.tsx`
- **类型：** Client Component
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

### Job Detail Page（职位详情页面）
- **文件：** `app/(main)/jobs/[id]/page.tsx`
- **类型：** Client Component
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
