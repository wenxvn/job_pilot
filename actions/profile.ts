"use server";

import { createInsForgeServerClient } from "@/lib/insforge/server";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import { revalidatePath } from "next/cache";
import type { Profile, ProfileInput } from "@/types/profile";

const RESUME_VIEW_URL = "/api/profile/resume/view";

export async function getProfile(): Promise<{ profile: Profile | null; error: string | null }> {
  try {
    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return { profile: null, error: "未登录" };
    }

    const userId = userData.user.id;

    const { data, error } = await client.database
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return { profile: null, error: "获取资料失败" };
    }

    return { profile: data as Profile | null, error: null };
  } catch {
    return { profile: null, error: "服务器错误" };
  }
}

export async function upsertProfile(
  input: ProfileInput
): Promise<{ profile: Profile | null; error: string | null }> {
  try {
    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return { profile: null, error: "未登录" };
    }

    const userId = userData.user.id;
    const completion = calculateProfileCompletion(input);

    const { data, error } = await client.database
      .from("profiles")
      .upsert(
        [
          {
            user_id: userId,
            ...input,
            is_complete: completion.isComplete,
            completion_percentage: completion.completionPercentage,
            missing_fields: completion.missingFields,
          },
        ],
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      return { profile: null, error: "保存资料失败" };
    }

    revalidatePath("/profile");
    return { profile: data as Profile, error: null };
  } catch {
    return { profile: null, error: "服务器错误" };
  }
}

async function uploadResumeWithOverwrite(
  client: Awaited<ReturnType<typeof createInsForgeServerClient>>,
  key: string,
  file: File
): Promise<boolean> {
  const bucket = client.storage.from("resumes");
  let uploadResult = await bucket.upload(key, file);

  if (uploadResult.error || !uploadResult.data) {
    await bucket.remove(key);
    uploadResult = await bucket.upload(key, file);
  }

  if (uploadResult.error || !uploadResult.data) {
    return false;
  }

  return true;
}

export async function uploadResume(
  formData: FormData
): Promise<{ url: string; key: string } | null> {
  try {
    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();

    if (authError || !userData?.user) return null;

    const userId = userData.user.id;
    const file = formData.get("file");
    if (!(file instanceof File)) return null;

    if (file.type !== "application/pdf") return null;
    if (file.size > 10 * 1024 * 1024) return null;

    const key = `${userId}/resume.pdf`;
    const uploaded = await uploadResumeWithOverwrite(client, key, file);

    if (!uploaded) return null;

    const { data: currentProfile, error: profileError } = await client.database
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) return null;

    const profileInput: ProfileInput = {
      full_name: currentProfile?.full_name ?? "",
      email: currentProfile?.email ?? userData.user.email ?? "",
      phone: currentProfile?.phone ?? "",
      bio: currentProfile?.bio ?? "",
      experience: currentProfile?.experience ?? [],
      education: currentProfile?.education ?? [],
      skills: currentProfile?.skills ?? [],
      target_role: currentProfile?.target_role ?? "",
      salary_min: currentProfile?.salary_min ?? 0,
      salary_max: currentProfile?.salary_max ?? 0,
      location: currentProfile?.location ?? "",
      linkedin_url: currentProfile?.linkedin_url ?? "",
      job_preferences: currentProfile?.job_preferences ?? {
        work_type: "",
        remote_preference: "",
        preferred_locations: [],
        industries: [],
      },
      resume_file_url: RESUME_VIEW_URL,
      resume_file_key: key,
    };
    const completion = calculateProfileCompletion(profileInput);

    const { error: updateError } = await client.database
      .from("profiles")
      .upsert(
        [
          {
            user_id: userId,
            ...profileInput,
            is_complete: completion.isComplete,
            completion_percentage: completion.completionPercentage,
            missing_fields: completion.missingFields,
          },
        ],
        { onConflict: "user_id" }
      );

    if (updateError) return null;

    revalidatePath("/profile");
    return { url: RESUME_VIEW_URL, key };
  } catch {
    return null;
  }
}
