"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Filter, ArrowUpDown, Briefcase, MapPin, Building2, ExternalLink, ChevronDown } from "lucide-react";
import posthog from "posthog-js";
import { MATCH_THRESHOLD } from "@/lib/utils";

// 模拟职位数据
const MOCK_JOBS = [
  {
    id: "1",
    title: "高级前端工程师",
    company: "字节跳动",
    location: "上海",
    match_score: 92,
    status: "saved" as const,
    discovered_at: "2026-06-21T10:00:00Z",
    apply_url: "https://jobs.bytedance.com/1",
    apply_type: "external",
  },
  {
    id: "2",
    title: "React 工程师",
    company: "阿里巴巴",
    location: "杭州",
    match_score: 85,
    status: "saved" as const,
    discovered_at: "2026-06-21T09:30:00Z",
    apply_url: "https://talent.alibaba.com/2",
    apply_type: "external",
  },
  {
    id: "3",
    title: "全栈开发工程师",
    company: "腾讯",
    location: "深圳",
    match_score: 78,
    status: "applied" as const,
    discovered_at: "2026-06-20T14:00:00Z",
    apply_url: "https://careers.tencent.com/3",
    apply_type: "external",
  },
  {
    id: "4",
    title: "前端架构师",
    company: "美团",
    location: "北京",
    match_score: 71,
    status: "saved" as const,
    discovered_at: "2026-06-20T11:00:00Z",
    apply_url: "https://zhaopin.meituan.com/4",
    apply_type: "external",
  },
  {
    id: "5",
    title: "TypeScript 开发工程师",
    company: "小红书",
    location: "上海",
    match_score: 65,
    status: "saved" as const,
    discovered_at: "2026-06-19T16:00:00Z",
    apply_url: "https://job.xiaohongshu.com/5",
    apply_type: "external",
  },
  {
    id: "6",
    title: "前端开发实习生",
    company: "网易",
    location: "杭州",
    match_score: 45,
    status: "saved" as const,
    discovered_at: "2026-06-19T10:00:00Z",
    apply_url: "https://hr.163.com/6",
    apply_type: "external",
  },
];

type JobStatus = "all" | "saved" | "applied" | "interviewing" | "rejected";
type SortField = "match_score" | "discovered_at";
type MatchFilter = "all" | "high" | "medium" | "low";

const STATUS_LABELS: Record<string, string> = {
  saved: "已保存",
  applied: "已投递",
  interviewing: "面试中",
  rejected: "已拒绝",
};

const STATUS_COLORS: Record<string, string> = {
  saved: "bg-info-light text-info-foreground",
  applied: "bg-accent-light text-accent",
  interviewing: "bg-warning text-warning-foreground",
  rejected: "bg-error/10 text-error",
};

function formatScore(score: number): { label: string; color: string } {
  if (score >= MATCH_THRESHOLD + 20) return { label: "高匹配", color: "bg-success-light text-success-foreground" };
  if (score >= MATCH_THRESHOLD) return { label: "匹配", color: "bg-info-light text-info-foreground" };
  return { label: "低匹配", color: "bg-surface-secondary text-text-muted" };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export default function JobsPage() {
  const [statusFilter, setStatusFilter] = useState<JobStatus>("all");
  const [sortField, setSortField] = useState<SortField>("match_score");
  const [sortAsc, setSortAsc] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [jobQuery, setJobQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [listQuery, setListQuery] = useState("");
  const [matchFilter, setMatchFilter] = useState<MatchFilter>("all");

  const filteredJobs = useMemo(() => MOCK_JOBS
    .filter((job) => statusFilter === "all" || job.status === statusFilter)
    .filter((job) => !jobQuery.trim() || job.title.toLowerCase().includes(jobQuery.trim().toLowerCase()))
    .filter((job) => !locationQuery.trim() || job.location.toLowerCase().includes(locationQuery.trim().toLowerCase()))
    .filter((job) => !listQuery.trim() || `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(listQuery.trim().toLowerCase()))
    .filter((job) => matchFilter === "all" || (matchFilter === "high" ? job.match_score >= 85 : matchFilter === "medium" ? job.match_score >= MATCH_THRESHOLD && job.match_score < 85 : job.match_score < MATCH_THRESHOLD))
    .sort((a, b) => {
      const diff = a[sortField] > b[sortField] ? 1 : -1;
      return sortAsc ? diff : -diff;
    }), [jobQuery, locationQuery, listQuery, matchFilter, sortAsc, sortField, statusFilter]);

  const stats = {
    total: MOCK_JOBS.length,
    saved: MOCK_JOBS.filter((j) => j.status === "saved").length,
    applied: MOCK_JOBS.filter((j) => j.status === "applied").length,
    highMatch: MOCK_JOBS.filter((j) => j.match_score >= MATCH_THRESHOLD + 20).length,
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">职位名称</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input value={jobQuery} onChange={(event) => setJobQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && posthog.capture("job_search_started", { search_query: jobQuery, location: locationQuery })} placeholder="例如：前端工程师" className="w-full rounded-md border border-border bg-surface px-3 py-3 pl-10 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent" />
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">工作地点</span>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && posthog.capture("job_search_started", { search_query: jobQuery, location: locationQuery })} placeholder="例如：上海、杭州或远程" className="w-full rounded-md border border-border bg-surface px-3 py-3 pl-10 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent" />
            </div>
          </label>
          <button type="button" onClick={() => posthog.capture("job_search_started", { search_query: jobQuery, location: locationQuery })} className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground hover:bg-accent-dark">
            <Search className="h-4 w-4" />搜索职位
          </button>
        </div>
      </div>
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">职位列表</h1>
        <p className="text-sm text-text-secondary mt-1">
          浏览 AI 发现的匹配职位，点击查看匹配详情。
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-text-secondary uppercase">总计</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{stats.total}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-text-secondary uppercase">已保存</p>
          <p className="text-2xl font-bold text-info-foreground mt-1">{stats.saved}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-text-secondary uppercase">已投递</p>
          <p className="text-2xl font-bold text-accent mt-1">{stats.applied}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-text-secondary uppercase">高匹配</p>
          <p className="text-2xl font-bold text-success-foreground mt-1">{stats.highMatch}</p>
        </div>
      </div>

      {/* 筛选和排序栏 */}
      <div className="flex items-center gap-3">
        {/* 筛选 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
            className="flex items-center gap-2 bg-surface border border-border rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary"
          >
            <Filter className="h-4 w-4 text-text-muted" />
            {statusFilter === "all" ? "全部状态" : STATUS_LABELS[statusFilter]}
            <ChevronDown className="h-3 w-3 text-text-muted" />
          </button>
          {showFilterMenu && (
            <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-md py-1 z-10 min-w-[140px]">
              {(["all", "saved", "applied", "interviewing", "rejected"] as JobStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => { setStatusFilter(status); setShowFilterMenu(false); posthog.capture("jobs_filtered", { filter: status }); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-secondary ${
                    statusFilter === status ? "text-accent font-medium" : "text-text-primary"
                  }`}
                >
                  {status === "all" ? "全部状态" : STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 排序 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
            className="flex items-center gap-2 bg-surface border border-border rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary"
          >
            <ArrowUpDown className="h-4 w-4 text-text-muted" />
            {sortField === "match_score" ? "匹配分数" : "发现时间"}
            <ChevronDown className="h-3 w-3 text-text-muted" />
          </button>
          {showSortMenu && (
            <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-md py-1 z-10 min-w-[160px]">
              {([
                { field: "match_score" as SortField, label: "匹配分数" },
                { field: "discovered_at" as SortField, label: "发现时间" },
              ]).map((option) => (
                <button
                  key={option.field}
                  type="button"
                  onClick={() => { setSortField(option.field); setShowSortMenu(false); posthog.capture("jobs_sorted", { sort_by: option.field }); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-secondary ${
                    sortField === option.field ? "text-accent font-medium" : "text-text-primary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
              <div className="border-t border-border mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => { setSortAsc(!sortAsc); setShowSortMenu(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary"
                >
                  {sortAsc ? "升序 ↑" : "降序 ↓"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1" />

        <div className="relative min-w-0 flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={listQuery}
            onChange={(event) => setListQuery(event.target.value)}
            placeholder="按公司、职位或地点筛选…"
            className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="relative">
          <button type="button" onClick={() => { setMatchFilter(matchFilter === "all" ? "high" : matchFilter === "high" ? "medium" : matchFilter === "medium" ? "low" : "all"); setShowFilterMenu(false); }} className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary">
            匹配：{matchFilter === "all" ? "全部" : matchFilter === "high" ? "高匹配" : matchFilter === "medium" ? "中匹配" : "低匹配"}<ChevronDown className="h-3 w-3 text-text-muted" />
          </button>
        </div>
      </div>

      {/* 职位列表 */}
      {filteredJobs.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center shadow-sm">
          <Briefcase className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <p className="text-base font-semibold text-text-primary mb-1">暂无职位</p>
          <p className="text-sm text-text-muted">
            {statusFilter === "all"
              ? "还没有发现任何职位，请先设置你的 LinkedIn 浏览器会话。"
              : `没有${STATUS_LABELS[statusFilter]}状态的职位。`}
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          {/* 表头 */}
          <div className="grid grid-cols-[1fr_140px_120px_100px_100px_80px] gap-4 px-6 py-3 border-b border-border bg-surface-secondary">
            <span className="text-xs font-medium text-text-secondary uppercase">职位</span>
            <span className="text-xs font-medium text-text-secondary uppercase">公司</span>
            <span className="text-xs font-medium text-text-secondary uppercase">地点</span>
            <span className="text-xs font-medium text-text-secondary uppercase">匹配</span>
            <span className="text-xs font-medium text-text-secondary uppercase">状态</span>
            <span className="text-xs font-medium text-text-secondary uppercase">操作</span>
          </div>

          {/* 职位行 */}
          {filteredJobs.map((job) => {
            const scoreInfo = formatScore(job.match_score);
            return (
              <div
                key={job.id}
                className="grid grid-cols-[1fr_140px_120px_100px_100px_80px] gap-4 items-center px-6 py-4 border-b border-border last:border-b-0 hover:bg-surface-secondary transition-colors"
              >
                <div className="min-w-0">
                  <Link
                    href={`/jobs/${job.id}`}
                    onClick={() => posthog.capture("job_click", { job_id: job.id, source: "list" })}
                    className="text-sm font-medium text-text-primary hover:text-accent truncate block"
                  >
                    {job.title}
                  </Link>
                  <p className="text-xs text-text-muted mt-0.5">{formatDate(job.discovered_at)}</p>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  <Building2 className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                  <span className="text-sm text-text-secondary truncate">{job.company}</span>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                  <span className="text-sm text-text-secondary truncate">{job.location}</span>
                </div>

                <div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${scoreInfo.color}`}>
                    {job.match_score}%
                  </span>
                </div>

                <div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[job.status] ?? "bg-surface-secondary text-text-muted"}`}>
                    {STATUS_LABELS[job.status] ?? job.status}
                  </span>
                </div>

                <div className="flex items-center justify-end">
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
      )}
    </div>
  );
}
