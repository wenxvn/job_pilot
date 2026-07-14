"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import posthog from "posthog-js";
import { MATCH_THRESHOLD } from "@/lib/utils";
import type { Job, JobStatus } from "@/types/job";

interface JobData {
  job: Job;
}

interface ApiResponse<Data> {
  success: boolean;
  data?: Data;
  error?: string;
}

const STATUS_LABELS: Record<JobStatus, string> = {
  saved: "已保存",
  applied: "已投递",
  interviewing: "面试中",
  rejected: "已拒绝",
};

function formatScore(score: number): { label: string; color: string } {
  if (score === 0) return { label: "等待 AI 评分", color: "bg-surface-secondary text-text-muted" };
  if (score >= MATCH_THRESHOLD + 20) return { label: `${score}% 高匹配`, color: "bg-success-light text-success-foreground" };
  if (score >= MATCH_THRESHOLD) return { label: `${score}% 匹配`, color: "bg-info-light text-info-foreground" };
  return { label: `${score}% 低匹配`, color: "bg-surface-secondary text-text-muted" };
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadJob(): Promise<void> {
      try {
        const response = await fetch(`/api/jobs/${encodeURIComponent(id)}`, { cache: "no-store" });
        const payload = await response.json() as ApiResponse<JobData>;
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error || "职位详情加载失败");
        }
        if (isActive) {
          setJob(payload.data.job);
          posthog.capture("job_viewed", {
            job_id: payload.data.job.id,
            match_score: payload.data.job.match_score,
            company: payload.data.job.company,
          });
        }
      } catch (error) {
        if (isActive) setErrorMessage(error instanceof Error ? error.message : "职位详情加载失败");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadJob();
    return () => { isActive = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface p-12 text-sm text-text-secondary shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-accent" />
        正在加载职位详情…
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-4">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent">
          <ArrowLeft className="h-4 w-4" />返回职位列表
        </Link>
        <div className="rounded-xl border border-error/20 bg-surface p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-error" />
          <p className="font-medium text-text-primary">{errorMessage || "职位不存在"}</p>
        </div>
      </div>
    );
  }

  const score = formatScore(job.match_score);
  const breakdown = Object.entries(job.match_breakdown);

  return (
    <div className="space-y-6">
      <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent">
        <ArrowLeft className="h-4 w-4" />返回职位列表
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{job.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm text-text-secondary"><Building2 className="h-4 w-4 text-text-muted" />{job.company}</span>
              <span className="flex items-center gap-1.5 text-sm text-text-secondary"><MapPin className="h-4 w-4 text-text-muted" />{job.location}</span>
              <span className="flex items-center gap-1.5 text-sm text-text-secondary"><Clock className="h-4 w-4 text-text-muted" />{new Date(job.discovered_at).toLocaleDateString("zh-CN")}</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${score.color}`}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />{score.label}
            </span>
            <span className="text-xs text-text-muted">状态：{STATUS_LABELS[job.status]}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => posthog.capture("job_apply_click", { job_id: job.id, source: "detail" })}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground"
          >
            <ExternalLink className="h-4 w-4" />前往申请
          </a>
          <button
            type="button"
            onClick={() => posthog.capture("generate_resume_click", { job_id: job.id })}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary"
          >
            <FileText className="h-4 w-4" />生成定制简历
          </button>
          <a href={job.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent md:ml-auto">
            查看职位来源<ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-text-primary">职位描述</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-text-primary">{job.description}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-text-primary">
            <Sparkles className="h-4 w-4 text-accent" />匹配详情
          </h2>
          {breakdown.length === 0 ? (
            <div className="rounded-lg bg-surface-secondary p-4">
              <p className="text-sm font-medium text-text-primary">AI 匹配评分尚未接入</p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">职位已成功保存。后续接入评分服务后，这里会展示技能、经验和地点匹配详情。</p>
            </div>
          ) : (
            <div className="space-y-4">
              {breakdown.map(([key, detail]) => (
                <div key={key} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-text-primary">{key}</span>
                    <span className="text-sm font-medium text-accent">{detail.score}%</span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">{detail.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
