# Memory — Browserbase MCP 配置

Last updated: 2026-07-14 CST

## What was built

- 按 `browserbase/mcp-server-browserbase` 官方 README，将 Browserbase 托管 MCP 服务添加到 Codex 全局配置 `/Users/wenxun/.codex/config.toml`。
- MCP 服务名为 `browserbase`，使用官方推荐的 Streamable HTTP 托管端点；未向配置文件写入 API Key 或其他凭据。
- 完成 MCP 初始化握手验证，服务正常返回协议版本和工具能力。

## Decisions made

- 当前采用官方 README 推荐的托管 SHTTP 方案，而不是本地 `npx @browserbasehq/mcp` 或 Composio/Rube 方案。
- 托管方案不依赖项目 `.env.local` 中的 Browserbase/Gemini 变量，避免在 MCP 配置中保存密钥。
- 本次仅修改 Codex 全局 MCP 配置，不修改 JobPilot 项目代码或 UI 文档。

## Problems solved

- 确认 Browserbase 官方 MCP 端点可直接完成初始化握手，Codex 已将其识别为启用的 Streamable HTTP 服务。
- 启动 Next.js 开发服务器时自动改写了 `next-env.d.ts` 的类型引用，已还原，项目工作区保持干净。
- 内置浏览器插件初始化出现环境冲突；打开 `/jobs` 时改用系统默认浏览器完成导航。

## Current state

- Codex 全局配置中 `browserbase` 已启用，服务端连接验证通过。
- 当前任务不会热加载新增 MCP；需要重启 Codex 或新建任务后才能使用 Browserbase 工具。
- `/jobs` 开发页面已在系统默认浏览器打开，开发服务器当时运行于本地端口 3000。
- JobPilot 职位页面仍使用模拟数据；真实职位数据库逻辑与 Browserbase/Stagehand 搜索尚未实现。
- 未在记忆中保存任何密钥、令牌、Cookie、会话标识或其他敏感值。

## Next session starts with

1. 重启 Codex 或新建任务，确认 `browserbase` MCP 工具已加载。
2. 使用 Browserbase 的 `start`、`navigate`、`observe`、`act`、`extract`、`end` 完成一次最小连接测试。
3. 决定职位搜索是否需要保存的 LinkedIn Context ID；如果需要，评估改用支持 `--contextId` 的自托管 STDIO 方案。
4. 继续职位管理与真实职位搜索前，按项目规范读取 Browserbase、Stagehand、InsForge 的最新技能和文档。

## Open questions

- 官方托管 MCP 是否能满足 JobPilot 对持久化 LinkedIn 登录上下文的需求，还是必须切换到自托管 STDIO。
- 后续 Browserbase MCP 仅用于开发调试，还是也参与应用内职位搜索流程；应用运行时仍应优先使用 Browserbase SDK 与 Stagehand。
