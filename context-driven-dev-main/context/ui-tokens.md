# UI 令牌

JobPilot 设计系统令牌。所有颜色、排版、间距和组件值从设计中提取。在整个代码库中使用这些精确值 — 永不硬编码颜色或在组件中使用原始 Tailwind 颜色类。

---

## 如何使用

本项目使用 **Tailwind CSS v4**。所有设计令牌使用 `@theme` 指令在 `app/globals.css` 中定义。颜色或令牌不需要 `tailwind.config.ts`。

Tailwind v4 自动从 `@theme` 变量生成实用类：

- `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`

```tsx
// 正确 — 使用生成的实用类
className="bg-surface text-text-primary border-border"

// 也正确 — 直接引用 CSS 变量
style={{ color: 'var(--color-text-primary)' }}

// 永不 — 硬编码十六进制值
className="bg-[#F6F7FB] text-[#101828]"

// 永不 — 原始 Tailwind 颜色类
className="bg-purple-500 text-gray-600"
```

---

## globals.css — 完整令牌定义

```css
@import "tailwindcss";

@theme {
  /* 字体 */
  --font-sans: "Inter", sans-serif;

  /* 页面和表面背景 */
  --color-background: #F6F7FB;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F9FAFB;

  /* 边框 */
  --color-border: #E7EAF3;
  --color-border-light: #E5E7EB;

  /* 文本 */
  --color-text-primary: #101828;
  --color-text-secondary: #6A7282;
  --color-text-muted: #99A1AF;

  /* 主色调 */
  --color-accent: #7C5CFC;
  --color-accent-dark: #5E4CFF;
  --color-accent-light: #F3E8FF;
  --color-accent-foreground: #FFFFFF;

  /* 成功 */
  --color-success: #10B981;
  --color-success-light: #D0FAE5;
  --color-success-foreground: #007A55;

  /* 信息 */
  --color-info: #61A8FF;
  --color-info-light: #DBEAFE;
  --color-info-foreground: #155DFC;

  /* 警告 */
  --color-warning: #FF8904;
  --color-warning-foreground: #FFFFFF;

  /* 错误 */
  --color-error: #EF4444;
  --color-error-foreground: #FFFFFF;

  /* 边框半径 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## 颜色使用指南

### 页面布局

| 元素           | 令牌                  |
| -------------- | --------------------- |
| 页面背景       | `bg-background`       |
| 卡片/表面      | `bg-surface`          |
| 次要表面       | `bg-surface-secondary`|
| 默认边框       | `border-border`       |
| 浅色边框       | `border-border-light` |

### 排版

| 元素               | 令牌                  |
| ------------------ | --------------------- |
| 标题、主要文本     | `text-text-primary`   |
| 次要文本、标签     | `text-text-secondary` |
| 占位符、静音       | `text-text-muted`     |

### 主色调

用于：主按钮、活动导航项、焦点环

| 元素               | 令牌                     |
| ------------------ | ------------------------ |
| 按钮背景           | `bg-accent`              |
| 按钮文本           | `text-accent-foreground` |
| 浅色徽章背景       | `bg-accent-light`        |

### 状态颜色

| 状态  | 背景               | 文本                      |
| ----- | ------------------ | ------------------------- |
| 成功  | `bg-success-light` | `text-success-foreground` |
| 信息  | `bg-info-light`    | `text-info-foreground`    |
| 警告  | `bg-warning`       | `text-warning-foreground` |
| 错误  | `bg-error`         | `text-error-foreground`   |

---

## 排版

| 元素         | 大小 | 粗细 | 行高 | 颜色令牌              |
| ------------ | ---- | ---- | ---- | --------------------- |
| 页面标题     | 24px | 700  | 32px | `text-text-primary`   |
| 区域标题     | 16px | 600  | 24px | `text-text-primary`   |
| 正文文本     | 14px | 400  | 20px | `text-text-primary`   |
| 标签         | 12px | 500  | 16px | `text-text-secondary` |
| 静音/时间戳  | 12px | 400  | 16px | `text-text-muted`     |

字体：**Inter** — 通过 `next/font/google` 导入，永不使用后备系统字体。

---

## 间距

| 令牌          | 值     | 用途           |
| ------------- | ------ | -------------- |
| `gap-2`       | 8px    | 徽章和标签间距 |
| `gap-4`       | 16px   | 区域内部间距   |
| `gap-6`       | 24px   | 区域之间间距   |
| `p-4`         | 16px   | 卡片内边距     |
| `p-6`         | 24px   | 大卡片内边距   |
| `px-4 py-2`   | 16/8px | 按钮内边距     |
| `px-3 py-1`   | 12/4px | 徽章内边距     |

---

## 组件令牌

### 卡片

```
background:    bg-surface
border:        1px solid var(--color-border)
border-radius: rounded-xl
padding:       p-6
box-shadow:    0px 1px 3px rgba(0,0,0,0.1)
```

### 按钮

**主按钮：**

```
background:    bg-accent
text:          text-accent-foreground
border-radius: rounded-md
padding:       px-4 py-2
font-weight:   font-medium
```

**次要按钮：**

```
background:    bg-surface
border:        border border-border
text:          text-text-primary
border-radius: rounded-md
padding:       px-4 py-2
```

**幽灵按钮：**

```
background:    transparent
text:          text-text-secondary
hover:         hover:bg-surface-secondary
border-radius: rounded-md
```

### 输入框

```
background:    bg-surface
border:        1px solid var(--color-border)
border-radius: rounded-md
padding:       px-3 py-2
font-size:     text-sm
focus:         ring-1 ring-accent border-accent
placeholder:   placeholder:text-text-muted
```

### 徽章

```
background:    bg-accent-light
text:          text-accent
border-radius: rounded-full (pill)
padding:       px-2 py-0.5
font-size:     text-xs
font-weight:   font-medium
```

### 表格

```
header:        text-xs font-medium text-text-secondary uppercase
row:           text-sm text-text-primary
border:        border-b border-border
hover:         hover:bg-surface-secondary
```