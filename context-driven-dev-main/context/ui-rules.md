# UI 规则

JobPilot UI 构建的简洁规则。设计资产可用 — 使用它们作为视觉决策的真实来源。这些规则涵盖了保持 UI 一致性的最重要模式和约束。

---

## 字体

始终在根布局中通过 `next/font/google` 导入 Inter。

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

`--font-sans` 变量已在 globals.css 的 `@theme` 中声明。将字体变量类应用到根布局的 `<html>` 标签。永不使用系统字体作为主字体。

---

## 布局

- 页面最大宽度：1280px，居中
- 主内容区内边距：24px
- 页面区域间距：24px
- 头部高度：64px，全宽，背景 `bg-surface`，内边距 `px-6`
- 所有页面使用顶部导航栏

---

## 导航栏

导航项：Logo、Jobs（职位）、Resumes（简历）、Applications（申请记录）、用户头像下拉菜单

- 活动项：颜色 `text-accent`，字重 500，14px
- 非活动项：颜色 `text-text-secondary`，字重 500，14px
- 活动状态指示：颜色变化
- 导航栏背景：`bg-surface`，全视口宽度
- 底部边框：`border-b border-border`

---

## 卡片

每个内容区域都在卡片中。

```
background:    bg-surface
border:        1px solid var(--color-border)
border-radius: rounded-xl
padding:       p-6
box-shadow:    0px 1px 3px rgba(0,0,0,0.1)
```

永不使用彩色卡片背景 — 始终使用 `bg-surface`。颜色通过卡片内的徽章、条形和文本体现，永不放在卡片表面本身。

---

## 排版层级

三个级别贯穿始终使用：

**区域标题** — 卡片标题、页面区域标题

```
font-size:   16px
font-weight: 600
color:       text-text-primary
line-height: 24px
```

**正文/主要内容文本**

```
font-size:   14px
font-weight: 500
color:       text-text-primary
line-height: 20px
```

**次要/静音文本** — 标签、时间戳、副标题

```
font-size:   12px
font-weight: 400
color:       text-text-muted
line-height: 16px
```

---

## 徽章

所有徽章使用 `rounded-full`（药丸形状），除非另有说明。

```
padding:     px-2 py-0.5
font-size:   12px
font-weight: 500
```

状态徽章变体：
- 成功：`bg-success-light text-success-foreground`
- 信息：`bg-info-light text-info-foreground`
- 警告：`bg-warning text-warning-foreground`
- 错误：`bg-error text-error-foreground`

---

## 按钮

**主按钮：**

```
background:    bg-accent
color:         text-accent-foreground
border-radius: rounded-md
padding:       px-4 py-2
font-size:     14px
font-weight:   500
```

**次要按钮：**

```
background:    bg-surface
border:        1px solid border-border
color:         text-text-primary
border-radius: rounded-md
padding:       px-4 py-2
```

**幽灵按钮：**

```
background:    transparent
color:         text-text-secondary
hover:         hover:bg-surface-secondary
border-radius: rounded-md
```

---

## 表单输入

```
background:        bg-surface
border:            1px solid border-border
border-radius:     rounded-md
padding:           px-3 py-2
font-size:         14px
color:             text-text-primary
placeholder color: text-text-muted
focus:             ring-1 ring-accent border-accent
```

---

## 表格

- 无交替行颜色 — 仅 `bg-surface` 行，用边框分隔
- 行边框：行间 `border-b border-border`
- 列标题：大写，12px，字重 500，颜色 `text-text-secondary`
- 行文本：14px，颜色 `text-text-primary`
- 悬停状态：`bg-surface-secondary`

---

## 空状态

每个可能为空的区域必须有空状态。保持简洁：

- `text-text-muted` 中的简短描述性文本
- 文本上方的可选图标
- 如果有逻辑上的下一步操作，提供 CTA 按钮

---

## Tailwind v4 注意事项

本项目使用 Tailwind v4。令牌使用 `@theme` 在 globals.css 中定义 — 不需要 `tailwind.config.ts`。永不将颜色定义在配置文件中。新令牌始终使用 `@theme`。

---

## 禁止事项

- 永不使用 Tailwind 内置颜色类（`bg-purple-500`、`text-gray-600`）— 仅使用项目令牌
- 永不将颜色定义在 `tailwind.config.ts` — 使用 `@theme` 在 globals.css
- 永不给卡片背景添加渐变
- 永不在单个 UI 元素中使用超过一种字重
- 永不向用户显示原始错误消息 — 始终显示人类可读的文本