# PostHog post-wizard report

## 集成摘要

已将 PostHog 分析集成到 JobPilot 项目中。使用 `posthog-js` 客户端 SDK，通过 `instrumentation-client.ts` 初始化（Next.js 16+ 标准方式），并配置了反向代理以提高追踪可靠性。

## 变更文件

| 文件 | 变更内容 |
|------|---------|
| `instrumentation-client.ts` | 新建 — PostHog 客户端初始化 |
| `next.config.ts` | 添加 `/ingest/*` 反向代理 rewrites |
| `.env.local` | 新建 — PostHog 环境变量占位符 |
| `app/(auth)/login/page.tsx` | 添加 `posthog.identify()` + `user_logged_in` 事件 |
| `app/(auth)/signup/page.tsx` | 添加 `posthog.identify()` + `user_signed_up` 事件 |
| `components/Navbar.tsx` | 添加 `posthog.reset()` 到退出登录按钮 |

## 事件表

| 事件名称 | 描述 | 文件 |
|----------|------|------|
| `user_logged_in` | 用户通过邮箱密码成功登录 | `app/(auth)/login/page.tsx` |
| `user_signed_up` | 用户通过邮箱密码成功注册 | `app/(auth)/signup/page.tsx` |

## 安装的包

- `posthog-js`（客户端分析 SDK）

## Verify before merging

- [ ] 运行完整生产构建（wizard 仅验证了修改的文件），修复生成代码引入的 lint 或类型错误。
- [ ] 运行测试套件 — 被重写或插桩的调用点可能需要更新 mock 或 fixture。
- [ ] 将 `.env.local` 中添加的 PostHog 环境变量名（`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`、`NEXT_PUBLIC_POSTHOG_HOST`）添加到 `.env.example` 或项目引导脚本中，方便协作者配置。
- [ ] 如需减少广告拦截器影响，确认 `/ingest/*` 反向代理在生产环境中正常工作。
- [ ] 确认回访用户也会触发 `identify` — 仅在首次登录时 identify 的处理程序可能导致回访 session 使用匿名 distinct ID。
