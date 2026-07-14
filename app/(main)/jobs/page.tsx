"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpDown,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Filter,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import posthog from "posthog-js";
import { MATCH_THRESHOLD } from "@/lib/utils";
import type { Job, JobStatus } from "@/types/job";

type StatusFilter = "all" | JobStatus;
type SortField = "match_score" | "discovered_at";
type MatchFilter = "all" | "high" | "medium" | "low";

interface JobsData {
  jobs: Job[];
}

interface SearchData extends JobsData {
  found: number;
  message: string;
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

const STATUS_COLORS: Record<JobStatus, string> = {
  saved: "bg-info-light text-info-foreground",
  applied: "bg-accent-light text-accent",
  interviewing: "bg-warning text-warning-foreground",
  rejected: "bg-error/10 text-error",
};

function formatScore(score: number): { label: string; color: string } {
  if (score === 0) return { label: "待评分", color: "bg-surface-secondary text-text-muted" };
  if (score >= MATCH_THRESHOLD + 20) {
    return { label: `${score}%`, color: "bg-success-light text-success-foreground" };
  }
  if (score >= MATCH_THRESHOLD) {
    return { label: `${score}%`, color: "bg-info-light text-info-foreground" };
  }
  return { label: `${score}%`, color: "bg-surface-secondary text-text-muted" };
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "日期未知";

  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays <= 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("discovered_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [jobQuery, setJobQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [listQuery, setListQuery] = useState("");
  const [matchFilter, setMatchFilter] = useState<MatchFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadJobs(): Promise<void> {
      try {
        const response = await fetch("/api/jobs", { cache: "no-store" });
        const payload = await response.json() as ApiResponse<JobsData>;
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error || "职位列表加载失败");
        }
        if (isActive) setJobs(payload.data.jobs);
      } catch (error) {
        if (isActive) {
          setErrorMessage(error instanceof Error ? error.message : "职位列表加载失败");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadJobs();
    return () => { isActive = false; };
  }, []);

  const filteredJobs = useMemo(() => jobs
    .filter((job) => statusFilter === "all" || job.status === statusFilter)
    .filter((job) => !jobQuery.trim() || job.title.toLowerCase().includes(jobQuery.trim().toLowerCase()))
    .filter((job) => !locationQuery.trim() || job.location.toLowerCase().includes(locationQuery.trim().toLowerCase()))
    .filter((job) => !listQuery.trim() || `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(listQuery.trim().toLowerCase()))
    .filter((job) => matchFilter === "all" || (
      matchFilter === "high"
        ? job.match_score >= MATCH_THRESHOLD + 20
        : matchFilter === "medium"
          ? job.match_score >= MATCH_THRESHOLD && job.match_score < MATCH_THRESHOLD + 20
          : job.match_score < MATCH_THRESHOLD
    ))
    .sort((first, second) => {
      const firstValue = first[sortField];
      const secondValue = second[sortField];
      const difference = firstValue > secondValue ? 1 : firstValue < secondValue ? -1 : 0;
      return sortAsc ? difference : -difference;
    }), [jobQuery, jobs, listQuery, locationQuery, matchFilter, sortAsc, sortField, statusFilter]);

  const stats = useMemo(() => ({
    total: jobs.length,
    saved: jobs.filter((job) => job.status === "saved").length,
    applied: jobs.filter((job) => job.status === "applied").length,
    highMatch: jobs.filter((job) => job.match_score >= MATCH_THRESHOLD + 20).length,
  }), [jobs]);

  async function handleSearch(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const keywords = jobQuery.trim();
    const location = locationQuery.trim();

    if (keywords.length < 2) {
      setErrorMessage("请输入至少 2 个字符的职位名称");
      return;
    }

    setIsSearching(true);
    setErrorMessage("");
    setSuccessMessage("");
    posthog.capture("job_search_started", { search_query: keywords, location });

    try {
      const response = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, location }),
      });
      const payload = await response.json() as ApiResponse<SearchData>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "职位搜索失败");
      }

      setJobs(payload.data.jobs);
      setSuccessMessage(payload.data.message);
      posthog.capture("job_search_completed", {
        search_query: keywords,
        location,
        jobs_found: payload.data.found,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "职位搜索失败";
      setErrorMessage(message);
      posthog.capture("job_search_failed", { search_query: keywords, location });
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="rounded-xl border border-border bg-surface p-5 shadow-sm md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">职位名称</span>
            <span className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={jobQuery}
                onChange={(event) => setJobQuery(event.target.value)}
                placeholder="例如：前端工程师"
                className="w-full rounded-md border border-border bg-surface px-3 py-3 pl-10 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent"
                disabled={isSearching}
              />
            </span>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">工作地点</span>
            <span className="relative block">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={locationQuery}
                onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="例如：上海、杭州或远程"
                className="w-full rounded-md border border-border bg-surface px-3 py-3 pl-10 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent"
                disabled={isSearching}
              />
            </span>
          </label>
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {isSearching ? "正在搜索" : "搜索职位"}
          </button>
        </div>
      </form>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success-light px-4 py-3 text-sm text-success-foreground">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-text-primary">职位列表</h1>
        <p className="mt-1 text-sm text-text-secondary">搜索 Jooble 的真实职位，并在这里统一筛选与跟踪。</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "总计", value: stats.total, color: "text-text-primary" },
          { label: "已保存", value: stats.saved, color: "text-info-foreground" },
          { label: "已投递", value: stats.applied, color: "text-accent" },
          { label: "高匹配", value: stats.highMatch, color: "text-success-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <p className="text-xs font-medium uppercase text-text-secondary">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary"
          >
            <Filter className="h-4 w-4 text-text-muted" />
            {statusFilter === "all" ? "全部状态" : STATUS_LABELS[statusFilter]}
            <ChevronDown className="h-3 w-3 text-text-muted" />
          </button>
          {showFilterMenu && (
            <div className="absolute left-0 top-full z-10 mt-1 min-w-[140px] rounded-lg border border-border bg-surface py-1 shadow-md">
              {(["all", "saved", "applied", "interviewing", "rejected"] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => { setStatusFilter(status); setShowFilterMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-surface-secondary ${statusFilter === status ? "font-medium text-accent" : "text-text-primary"}`}
                >
                  {status === "all" ? "全部状态" : STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary"
          >
            <ArrowUpDown className="h-4 w-4 text-text-muted" />
            {sortField === "match_score" ? "匹配分数" : "发现时间"}
            <ChevronDown className="h-3 w-3 text-text-muted" />
          </button>
          {showSortMenu && (
            <div className="absolute left-0 top-full z-10 mt-1 min-w-[160px] rounded-lg border border-border bg-surface py-1 shadow-md">
              {([
                { field: "match_score", label: "匹配分数" },
                { field: "discovered_at", label: "发现时间" },
              ] as { field: SortField; label: string }[]).map((option) => (
                <button
                  key={option.field}
                  type="button"
                  onClick={() => { setSortField(option.field); setShowSortMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-surface-secondary ${sortField === option.field ? "font-medium text-accent" : "text-text-primary"}`}
                >
                  {option.label}
                </button>
              ))}
              <div className="mt-1 border-t border-border pt-1">
                <button
                  type="button"
                  onClick={() => { setSortAsc(!sortAsc); setShowSortMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-secondary"
                >
                  {sortAsc ? "升序 ↑" : "降序 ↓"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative min-w-[220px] flex-1 md:ml-auto md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={listQuery}
            onChange={(event) => setListQuery(event.target.value)}
            placeholder="按公司、职位或地点筛选…"
            className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <button
          type="button"
          onClick={() => setMatchFilter(matchFilter === "all" ? "high" : matchFilter === "high" ? "medium" : matchFilter === "medium" ? "low" : "all")}
          className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary"
        >
          匹配：{matchFilter === "all" ? "全部" : matchFilter === "high" ? "高匹配" : matchFilter === "medium" ? "中匹配" : "低匹配"}
          <ChevronDown className="h-3 w-3 text-text-muted" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface p-12 text-sm text-text-secondary shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          正在加载职位…
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center shadow-sm">
          <Briefcase className="mx-auto mb-4 h-12 w-12 text-text-muted" />
          <p className="mb-1 text-base font-semibold text-text-primary">暂无符合条件的职位</p>
          <p className="text-sm text-text-muted">输入职位名称和地点，开始第一次真实职位搜索。</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[1fr_180px_150px_100px_100px_80px] gap-4 border-b border-border bg-surface-secondary px-6 py-3">
              {['职位', '公司', '地点', '匹配', '状态', '操作'].map((label) => (
                <span key={label} className="text-xs font-medium uppercase text-text-secondary">{label}</span>
              ))}
            </div>
            {filteredJobs.map((job) => {
              const score = formatScore(job.match_score);
              return (
                <div key={job.id} className="grid grid-cols-[1fr_180px_150px_100px_100px_80px] items-center gap-4 border-b border-border px-6 py-4 transition-colors last:border-b-0 hover:bg-surface-secondary">
                  <div className="min-w-0">
                    <Link
                      href={`/jobs/${job.id}`}
                      onClick={() => posthog.capture("job_click", { job_id: job.id, source: "list" })}
                      className="block truncate text-sm font-medium text-text-primary hover:text-accent"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-text-muted">{formatDate(job.discovered_at)} · {job.source === "jooble" ? "Jooble" : job.source}</p>
                  </div>
                  <div className="flex min-w-0 items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                    <span className="truncate text-sm text-text-secondary">{job.company}</span>
                  </div>
                  <div className="flex min-w-0 items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                    <span className="truncate text-sm text-text-secondary">{job.location}</span>
                  </div>
                  <div><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${score.color}`}>{score.label}</span></div>
                  <div><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[job.status]}`}>{STATUS_LABELS[job.status]}</span></div>
                  <div className="flex justify-end">
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => posthog.capture("job_apply_click", { job_id: job.id })}
                      className="p-1.5 text-text-muted hover:text-accent"
                      title="申请职位"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
