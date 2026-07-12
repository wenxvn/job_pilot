# Memory — 职位页面中文搜索与筛选

Last updated: 2026-07-12 CST

## What was built

- 更新 `app/(main)/jobs/page.tsx`：新增中文职位名称和工作地点搜索卡片，支持输入后实时过滤职位。
- 修复原列表搜索框仅展示、无法使用的问题；现在可按公司、职位或地点进行全文筛选。
- 新增匹配分段筛选（全部、高匹配、中匹配、低匹配），并保留原有状态筛选、匹配分数/发现时间排序。
- 搜索按钮和输入框回车会记录 `job_search_started` 事件，但当前职位数据仍是页面内模拟数据。
- 更新 `context-driven-dev-main/context/ui-registry.md` 与 `context-driven-dev-main/context/progress-tracker.md`，登记职位页面搜索交互。

## Decisions made

- 首版搜索继续沿用现有 Client Component 和模拟职位数据，不新增 API 或数据库逻辑；后续接入真实职位搜索时可复用现有搜索状态和筛选体验。
- 职位名称和地点使用独立条件，列表搜索使用公司、职位、地点的组合全文匹配。
- 匹配筛选阈值继续使用 `lib/utils.ts` 中的 `MATCH_THRESHOLD`，遵守项目约定。

## Problems solved

- 修复搜索输入没有 `value`、`onChange` 和过滤条件导致的“搜索功能不可用”。
- 补齐了用户截图所需的中文搜索区域和中文筛选文案。

## Current state

- `npx tsc --noEmit`、`npm run build`、`git diff --check` 均通过。
- 职位页面当前显示模拟数据；真实职位管理、数据库查询和 Browserbase/Stagehand 搜索尚未实现。
- 工作区包含本次职位页面改动，以及此前 Profile/OCR 和中文 PDF 简历功能的未提交改动。
- 未在记忆中保存任何密钥、token、密码或其他敏感值。

## Next session starts with

1. 启动开发服务器并打开 `/jobs`，手动验证职位名称、地点、全文搜索和匹配筛选的交互。
2. 检查移动端布局，必要时为筛选工具栏增加换行或响应式调整。
3. 继续构建计划第 07 步职位管理逻辑：接入 `jobs` 表、用户限定查询、状态更新和真实列表数据。
4. 真实职位搜索接入前，按项目要求读取 InsForge/Browsebase/Stagehand 相关技能与文档。

## Open questions

- 搜索按钮目前只执行本地模拟数据过滤并记录事件；是否需要后续触发 LinkedIn/Browserbase 远程搜索。
- 职位列表最终字段、分页、空状态和排序规则在接入真实 `jobs` 表后是否需要调整。
- 中文 PDF 简历仍需要登录态浏览器验证长内容分页和下载效果。
