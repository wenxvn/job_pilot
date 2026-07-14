import { cookies } from "next/headers";
import { createServerClient } from "@insforge/sdk/ssr";
import type { Job, JobInput } from "@/types/job";

export async function createInsForgeServerClient() {
  return createServerClient({
    cookies: await cookies(),
  });
}

type InsForgeServerClient = Awaited<ReturnType<typeof createInsForgeServerClient>>;

export async function listJobsForUser(
  client: InsForgeServerClient,
  userId: string
): Promise<Job[]> {
  const { data, error } = await client.database
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .order("discovered_at", { ascending: false });

  if (error) throw new Error("JOBS_READ_FAILED");
  return (data ?? []) as Job[];
}

export async function getJobForUser(
  client: InsForgeServerClient,
  userId: string,
  jobId: string
): Promise<Job | null> {
  const { data, error } = await client.database
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .eq("id", jobId)
    .maybeSingle();

  if (error) throw new Error("JOB_READ_FAILED");
  return data as Job | null;
}

export async function saveJobsForUser(
  client: InsForgeServerClient,
  userId: string,
  jobs: JobInput[]
): Promise<Job[]> {
  if (jobs.length === 0) return [];

  const rows = jobs.map((job) => ({ user_id: userId, ...job }));
  const { data, error } = await client.database
    .from("jobs")
    .upsert(rows, { onConflict: "user_id,source_url" })
    .select("*");

  if (error) throw new Error("JOBS_SAVE_FAILED");
  return (data ?? []) as Job[];
}
