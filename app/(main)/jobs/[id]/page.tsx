"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Building2, ExternalLink, FileText, Sparkles, Clock, DollarSign } from "lucide-react";
import posthog from "posthog-js";
import { MATCH_THRESHOLD } from "@/lib/utils";

// 模拟职位详情数据
const MOCK_JOB_DETAIL = {
  id: "1",
  title: "高级前端工程师",
  company: "字节跳动",
  location: "上海",
  description: `我们正在寻找一位高级前端工程师加入我们的团队，负责核心产品的前端架构设计和开发。

**职责：**
- 负责公司核心产品的前端架构设计与开发
- 推动前端工程化建设，提升团队开发效率
- 参与技术方案评审，输出技术文档
- 指导初级工程师，推动团队技术成长

**要求：**
- 本科及以上学历，计算机相关专业优先
- 5 年以上前端开发经验
- 精通 React、TypeScript，熟悉 Next.js 生态
- 熟悉前端性能优化、工程化建设
- 有大型项目架构经验者优先
- 良好的沟通能力和团队协作精神`,
  source_url: "https://www.linkedin.com/jobs/view/123456",
  apply_url: "https://jobs.bytedance.com/1",
  apply_type: "external",
  match_score: 92,
  match_breakdown: {
    skills: { score: 95, details: "React、TypeScript、Next.js 与你的技能高度匹配" },
    experience: { score: 90, details: "5 年经验要求与你的背景相符" },
    role: { score: 88, details: "高级前端工程师与你的目标职位一致" },
    location: { score: 95, details: "上海与你的所在地匹配" },
    salary: { score: 90, details: "薪资范围在你的期望区间内" },
  },
  status: "saved",
  discovered_at: "2026-06-21T10:00:00Z",
};

const STATUS_LABELS: Record<string, string> = {
  saved: "已保存",
  applied: "已投递",
  interviewing: "面试中",
  rejected: "已拒绝",
};

function formatScore(score: number): { label: string; color: string } {
  if (score >= MATCH_THRESHOLD + 20) return { label: "高匹配", color: "bg-success-light text-success-foreground" };
  if (score >= MATCH_THRESHOLD) return { label: "匹配", color: "bg-info-light text-info-foreground" };
  return { label: "低匹配", color: "bg-surface-secondary text-text-muted" };
}

function ScoreBar({ label, score, details }: { label: string; score: number; details: string }) {
  const barColor = score >= 80 ? "bg-success" : score >= 60 ? "bg-info" : "bg-warning";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span className="text-sm font-medium text-text-primary">{score}%</span>
      </div>
      <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-text-muted">{details}</p>
    </div>
  );
}

export default function JobDetailPage() {
  const [status, setStatus] = useState(MOCK_JOB_DETAIL.status);
  const job = MOCK_JOB_DETAIL;
  const scoreInfo = formatScore(job.match_score);
  const breakdown = job.match_breakdown;

  useEffect(() => {
    posthog.capture("job_viewed", { job_id: job.id, match_score: job.match_score, company: job.company });
  }, [job.id, job.match_score, job.company]);

  const breakdownLabels: Record<string, string> = {
    skills: "技能匹配",
    experience: "经验匹配",
    role: "职位匹配",
    location: "地点匹配",
    salary: "薪资匹配",
  };

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        返回职位列表
      </Link>

      {/* 职位信息卡片 */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{job.title}</h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-text-muted" />
                <span className="text-sm text-text-secondary">{job.company}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-text-muted" />
                <span className="text-sm text-text-secondary">{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-text-muted" />
                <span className="text-sm text-text-secondary">
                  {new Date(job.discovered_at).toLocaleDateString("zh-CN")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${scoreInfo.color}`}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {job.match_score}% {scoreInfo.label}
            </span>
            <span className="text-xs text-text-muted">
              状态：{STATUS_LABELS[status] ?? status}
            </span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => posthog.capture("job_apply_click", { job_id: job.id, source: "detail" })}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground rounded-md px-4 py-2.5 text-sm font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            前往申请
          </a>
          <button
            type="button"
            onClick={() => posthog.capture("generate_resume_click", { job_id: job.id })}
            className="inline-flex items-center gap-2 bg-surface border border-border text-text-primary rounded-md px-4 py-2.5 text-sm font-medium hover:bg-surface-secondary"
          >
            <FileText className="h-4 w-4" />
            生成定制简历
          </button>
          <a
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent ml-auto"
          >
            查看 LinkedIn 原帖
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 职位描述 */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-text-primary mb-4">职位描述</h2>
          <div className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* 匹配详情 */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            匹配详情
          </h2>
          <div className="space-y-4">
            {Object.entries(breakdown).map(([key, value]) => (
              <ScoreBar
                key={key}
                label={breakdownLabels[key] ?? key}
                score={value.score}
                details={value.details}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
