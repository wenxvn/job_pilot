export type JobStatus = "saved" | "applied" | "interviewing" | "rejected";

export interface MatchDetail {
  score: number;
  details: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  source: string;
  source_url: string;
  apply_url: string;
  apply_type: "external";
  match_score: number;
  match_breakdown: Record<string, MatchDetail>;
  status: JobStatus;
  discovered_at: string;
  created_at: string;
  updated_at: string;
}

export interface JobInput {
  title: string;
  company: string;
  location: string;
  description: string;
  source: string;
  source_url: string;
  apply_url: string;
  apply_type: "external";
  match_score: number;
  match_breakdown: Record<string, MatchDetail>;
  status: JobStatus;
  discovered_at: string;
}
