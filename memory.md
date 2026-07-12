# Memory — 简历 PDF 文字识别与 Profile 回填

Last updated: 2026-07-12 CST

## What was built

- `actions/profile.ts` 已接入阿里云百炼 `qwen3.5-ocr`：通过 InsForge 私有简历文件生成 5 分钟签名 URL，将 PDF 直接交给 OCR 模型并解析为结构化 Profile JSON。
- OCR 结果会过滤模板标题/姓名误识别，去重工作和教育经历，并保护空字段；识别结果只回填页面，不自动写入数据库。
- `app/(main)/profile/page.tsx` 与 `components/features/profile/ResumeSection.tsx` 已更新识别状态、失败提示和操作文案，用户检查后点击“保存资料”才持久化。
- 已移除因百炼免费额度耗尽而失败的 GLM-5 二次结构化调用，以及未使用的 `openai`、`pdf-parse` 依赖和旧 Next worker 配置。
- 已同步更新 `context-driven-dev-main/context/library-docs.md`、`code-standards.md`、`ui-registry.md`、`progress-tracker.md`。

## Decisions made

- 默认 OCR 模型由 `BAILIAN_OCR_MODEL` 配置，未配置时使用 `qwen3.5-ocr`；当前不依赖 GLM-5 或其他文本模型。
- 简历继续存放在 InsForge private bucket；识别时仅生成短期签名 URL，不生成公开 URL、不在本地落盘。
- 识别结果不自动写数据库，避免 OCR 误识别直接覆盖用户资料。
- 保留自定义 JSON 提示解析，不使用实验性的 `result_schema`，因为该方案会把字段说明错误回填为字段值。

## Problems solved

- 解决 PDF 无法直接读取的问题：OCR 模型可直接读取 PDF 签名 URL，不再依赖本地 PDF 文本解析。
- 解决 OCR 常见脏数据：模板标题被当作姓名、经历重复、字段为空时覆盖已有页面值。
- `AbortError` 已确认来自 PostHog 日志，与简历识别失败无关。

## Current state

- 已通过 `npx tsc --noEmit`、`npm run build`、`git diff --check`。
- 使用真实登录账号完成端到端验证：识别请求返回 `200`，页面成功回填姓名、手机号、技能和工作经历；仍需用户手动点击“保存资料”。
- 本地开发服务器仍运行在 `http://localhost:3000`，已登录的 Profile 页面可继续验证。
- 工作区包含未提交的 Profile/OCR 改动；未发现密钥、token 或密码写入记忆。

## Next session starts with

1. 刷新 `http://localhost:3000/profile`，点击“识别并填充”，检查所有回填字段后点击“保存资料”，再刷新确认持久化。
2. 运行 `git status --short`，确认最终改动范围并决定是否提交。
3. Profile 稳定后，继续构建计划第 07 步：职位管理逻辑（jobs 迁移、`types/job.ts`、`actions/job.ts`、列表/详情页真实数据）。

## Open questions

- 是否需要为 private bucket 中的简历预览/下载增加独立 signed URL 接口。
- 职位搜索与匹配仍需要 Browserbase/Stagehand 配置；简历生成与定制仍需要 OpenRouter 配置。
