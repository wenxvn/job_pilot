import Link from "next/link";
import { FileText, Pencil, Sparkles } from "lucide-react";
import { getProfile } from "@/actions/profile";
import { ResumePreview } from "@/components/features/resume/ResumePreview";

export default async function ResumesPage() {
  const { profile, error } = await getProfile();

  if (error || !profile) {
    return (
      <div className="rounded-xl border border-border bg-surface p-10 text-center shadow-sm">
        <FileText className="mx-auto h-10 w-10 text-text-muted" />
        <h1 className="mt-4 text-lg font-semibold text-text-primary">还不能生成简历</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
          请先填写并保存个人资料，保存后的内容会自动排版为 PDF 简历。
        </p>
        <Link
          href="/profile"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          <Pencil className="h-4 w-4" />
          完善个人资料
        </Link>
      </div>
    );
  }

  const sectionCount = [
    Boolean(profile.bio),
    profile.skills.length > 0,
    profile.experience.length > 0,
    profile.education.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/[0.08] blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium text-accent">网页资料智能排版</span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">我的 PDF 简历</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
                系统根据已保存的个人资料实时生成简历，预览与下载内容保持一致。
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 self-start rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary sm:self-auto"
            >
              <Pencil className="h-4 w-4" />
              编辑资料
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="text-base font-semibold text-text-primary">生成信息</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-xs text-text-muted">简历姓名</dt>
                <dd className="mt-1 text-sm font-medium text-text-primary">{profile.full_name || "未填写"}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">目标职位</dt>
                <dd className="mt-1 text-sm font-medium text-text-primary">{profile.target_role || "未填写"}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">已包含模块</dt>
                <dd className="mt-1 text-sm font-medium text-text-primary">{sectionCount} / 4</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-text-primary">排版说明</h2>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              空白模块会自动省略，较长内容会自动分页。修改资料并保存后，返回此页刷新预览即可更新。
            </p>
          </div>
        </aside>

        <ResumePreview fullName={profile.full_name} />
      </div>
    </div>
  );
}
