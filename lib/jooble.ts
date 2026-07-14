import "server-only";

import type { JobInput } from "@/types/job";

const JOOBLE_API_URL = "https://jooble.org/api";
const REQUEST_TIMEOUT_MS = 15_000;

interface JoobleSearchInput {
  keywords: string;
  location: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanText(value: unknown): string {
  return getString(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDate(value: unknown): string {
  const date = new Date(getString(value));
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function normalizeJob(value: unknown): JobInput | null {
  if (!isRecord(value)) return null;

  const title = cleanText(value.title);
  const sourceUrl = getString(value.link);
  if (!title || !sourceUrl.startsWith("http")) return null;

  return {
    title,
    company: cleanText(value.company) || "未提供公司",
    location: cleanText(value.location) || "地点未注明",
    description: cleanText(value.snippet) || "该职位暂未提供详细描述。",
    source: "jooble",
    source_url: sourceUrl,
    apply_url: sourceUrl,
    apply_type: "external",
    match_score: 0,
    match_breakdown: {},
    status: "saved",
    discovered_at: normalizeDate(value.updated),
  };
}

export async function searchJoobleJobs(input: JoobleSearchInput): Promise<JobInput[]> {
  const apiKey = process.env.JOOBLE_API_KEY?.trim();
  if (!apiKey) throw new Error("JOOBLE_NOT_CONFIGURED");

  const response = await fetch(`${JOOBLE_API_URL}/${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keywords: input.keywords, location: input.location, page: 1 }),
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) throw new Error(`JOOBLE_REQUEST_FAILED_${response.status}`);

  const payload: unknown = await response.json();
  const jobs = isRecord(payload) && Array.isArray(payload.jobs) ? payload.jobs : [];
  const uniqueJobs = new Map<string, JobInput>();

  for (const value of jobs) {
    const job = normalizeJob(value);
    if (job && !uniqueJobs.has(job.source_url)) uniqueJobs.set(job.source_url, job);
  }

  return Array.from(uniqueJobs.values());
}
