# Memory — Profile 表单接入 InsForge DB/Storage

Last updated: 2026-06-26 10:55 CST

## What was built

- **actions/profile.ts** — `upsertProfile` 现在保存完整 profile 表单字段，并同步写入 `is_complete`、`completion_percentage`、`missing_fields`；`uploadResume` 改为固定上传到 `resumes/{user_id}/resume.pdf`，上传后立即写回 `profiles.resume_file_url` / `resume_file_key` 并重新计算完成度。
- **lib/profile-completion.ts** — 新增统一完成度计算函数，按 10 项必填字段计算完成度和缺失字段。
- **types/profile.ts** — 新增 `MissingProfileField`、`ProfileCompletion` 和 profile 完成度字段；`ProfileInput` 排除派生字段，只保留用户可提交字段。
- **components/features/profile/ProfileAttentionBanner.tsx** — 改为复用 `lib/profile-completion.ts`，前端提醒与服务端落库使用同一口径。
- **app/(main)/profile/page.tsx** — 预览 profile 补齐派生完成度字段，适配新的 `ProfileInput`。
- **migrations/20260626102000_add-profile-completion-fields.sql** — 新增 `is_complete`、`completion_percentage`、`missing_fields` 字段迁移。
- **context-driven-dev-main/context/progress-tracker.md** 和 **ui-registry.md** — 记录 profile DB/Storage 接入与完成度规则。
- 已通过 InsForge CLI 链接项目并将以下迁移导入远端 InsForge：`20260626093000_add-complete-profile-fields.sql`、`20260626102000_add-profile-completion-fields.sql`。

## Decisions made

- 图片中的 `resume_pdf_url` 在本项目中继续对应现有字段 `resume_file_url`，不改名。
- 基础简历固定使用 `resumes/{user_id}/resume.pdf`，通过上传失败后删除旧对象并重试的方式实现覆盖。
- 完成度派生状态落库到 `profiles`，但不由表单输入直接提交；统一由 `calculateProfileCompletion` 计算。
- `missing_fields` 使用 JSONB 存储结构化缺失字段对象数组。
- 必填口径为 10 项：姓名、邮箱、手机号、所在地、目标职位、个人简介、至少 3 个技能、至少 1 段工作经历、至少 1 段教育经历、已上传简历。

## Problems solved

- 远端 InsForge 未保存新增字段的原因是迁移只存在本地文件，尚未执行到远端；本轮安装/使用 InsForge CLI 后已导入迁移并查询确认字段存在。
- InsForge SDK 当前 `storage.upload(path, file)` 没有 `upsert` 参数；已用固定 key + 删除旧对象重试实现等效覆盖。
- `ProfileInput` 如果直接继承新增完成度字段会迫使页面手动构造派生字段；已把派生字段从 `ProfileInput` 排除。

## Current state

- `npx tsc --noEmit` 通过。
- `npm run build` 通过。
- 本地开发服务器已启动在 `http://localhost:3000`（session id 21464）。
- 远端 InsForge `profiles` 表已确认包含 `phone`、`bio`、`education`、`job_preferences`、`is_complete`、`completion_percentage`、`missing_fields`。
- `resumes` storage bucket 存在且仍为 private。
- 当前工作区有未提交改动，包括本轮 profile 逻辑改动、前一轮完整 profile UI 改动、`next-env.d.ts` 生成路径变化、`memory.md` 更新，以及未跟踪的 `components/features/`、`lib/profile-completion.ts`、迁移文件和 `skills-lock.json`。

## Next session starts with

1. 打开 `http://localhost:3000/profile`，登录后手动验证保存完整资料、刷新预填、完成度/缺失字段展示、PDF 上传后无需再次保存即可持久化。
2. 如上传简历查看链接在 private bucket 下不可访问，决定是否改为 signed URL 或调整 bucket/下载策略。
3. 若 profile 验证通过，继续构建计划第 07 步：职位管理逻辑（jobs 表迁移、`types/job.ts`、`actions/job.ts`、职位列表/详情页接真实数据）。

## Open questions

- `next-env.d.ts` 的 dev/build 生成路径变化是否保留，还是提交前恢复。
- `skills-lock.json` 是否需要纳入版本控制。
- Profile 保存/上传流程还需要浏览器实测一次；当前只完成了类型检查、生产构建和远端 schema 验证。
- 职位搜索与匹配仍需要 Browserbase/Stagehand 配置；简历生成与定制仍需要 OpenRouter 配置。
