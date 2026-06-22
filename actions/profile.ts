"use server";

import { createInsForgeServerClient } from "@/lib/insforge/server";
import { revalidatePath } from "next/cache";
import type { Profile, ProfileInput } from "@/types/profile";

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

    const { data, error } = await client.database
      .from("profiles")
      .upsert(
        [{ user_id: userId, ...input }],
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

export async function uploadResume(
  formData: FormData
): Promise<{ url: string; key: string } | null> {
  try {
    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();

    if (authError || !userData?.user) return null;

    const userId = userData.user.id;
    const file = formData.get("file") as File | null;
    if (!file) return null;

    const ext = file.name.split(".").pop() ?? "pdf";
    const key = `${userId}/resume-${Date.now()}.${ext}`;

    const { data, error } = await client.storage
      .from("resumes")
      .upload(key, file);

    if (error || !data) return null;

    const urlResult = client.storage
      .from("resumes")
      .getPublicUrl(key);

    if (!urlResult.data) return null;

    return { url: urlResult.data.publicUrl, key };
  } catch {
    return null;
  }
}
