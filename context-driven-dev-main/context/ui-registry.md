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
