"use server";

import { createInsForgeServerClient } from "@/lib/insforge/server";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import { revalidatePath } from "next/cache";
import type {
  Education,
  Experience,
  Profile,
  ProfileInput,
  ResumeProfileExtract,
} from "@/types/profile";

const RESUME_VIEW_URL = "/api/profile/resume/view";
const DEFAULT_BAILIAN_OCR_MODEL = "qwen3.5-ocr";

interface ResumeKeyProfileRow {
  resume_file_key: string | null;
}

interface RawResumeProfileExtract {
  full_name?: unknown;
  phone?: unknown;
  bio?: unknown;
  target_role?: unknown;
  location?: unknown;
  skills?: unknown;
  experience?: unknown;
  education?: unknown;
}

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

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeMonth(value: unknown): string {
  const text = getString(value);
  if (!text) return "";

  const isoMatch = text.match(/(\d{4})[-/.年](0?[1-9]|1[0-2])/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, "0")}`;
  }

  return "";
}

function createExtractId(prefix: string, index: number): string {
  return `${prefix}-${Date.now()}-${index}-${crypto.randomUUID()}`;
}

function dedupeByKey<Item>(
  items: Item[],
  createKey: (item: Item) => string
): Item[] {
  const uniqueItems = new Map<string, Item>();

  for (const item of items) {
    const key = createKey(item);
    if (!uniqueItems.has(key)) uniqueItems.set(key, item);
  }

  return Array.from(uniqueItems.values());
}

function normalizeOrganizationKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/集团|股份|有限|责任|公司/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function normalizeExperience(value: unknown): Experience[] {
  if (!Array.isArray(value)) return [];

  const experiences = value
    .map((item, index): Experience | null => {
      if (!item || typeof item !== "object") return null;
      const source = item as Record<string, unknown>;
      const company = getString(source.company);
      const role = getString(source.role);
      const description = getString(source.description);

      if (!company && !role && !description) return null;

      return {
        id: createExtractId("experience", index),
        company,
        role,
        start_date: normalizeMonth(source.start_date),
        end_date: normalizeMonth(source.end_date),
        description,
      };
    })
    .filter((item): item is Experience => item !== null);

  return dedupeByKey(experiences, (item) => {
    const companyKey = normalizeOrganizationKey(item.company);
    if (companyKey && item.start_date) return `${companyKey}|${item.start_date}`;

    return [item.company, item.role, item.start_date, item.end_date, item.description]
      .map((part) => part.toLowerCase())
      .join("|");
  }).slice(0, 20);
}

function normalizeEducation(value: unknown): Education[] {
  if (!Array.isArray(value)) return [];

  const education = value
    .map((item, index): Education | null => {
      if (!item || typeof item !== "object") return null;
      const source = item as Record<string, unknown>;
      const school = getString(source.school);
      const degree = getString(source.degree);
      const major = getString(source.major);

      if (!school && !degree && !major) return null;

      return {
        id: createExtractId("education", index),
        school,
        degree,
        major,
        start_date: normalizeMonth(source.start_date),
        end_date: normalizeMonth(source.end_date),
      };
    })
    .filter((item): item is Education => item !== null);

  return dedupeByKey(education, (item) =>
    [item.school, item.degree, item.major, item.start_date, item.end_date]
      .map((part) => part.toLowerCase())
      .join("|")
  ).slice(0, 10);
}

function normalizeSkills(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .map((item) => getString(item))
        .filter(Boolean)
        .slice(0, 30)
    )
  );
}

function normalizeResumeProfileExtract(
  raw: RawResumeProfileExtract
): ResumeProfileExtract {
  const fullName = getString(raw.full_name);

  return {
    full_name: fullName.includes("模板") ? "" : fullName,
    phone: getString(raw.phone),
    bio: getString(raw.bio),
    target_role: getString(raw.target_role),
    location: getString(raw.location),
    skills: normalizeSkills(raw.skills),
    experience: normalizeExperience(raw.experience),
    education: normalizeEducation(raw.education),
  };
}

function parseResumeExtractJson(content: string): ResumeProfileExtract | null {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!parsed || typeof parsed !== "object") return null;
    return normalizeResumeProfileExtract(parsed as RawResumeProfileExtract);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    try {
      const parsed: unknown = JSON.parse(jsonMatch[0]);
      if (!parsed || typeof parsed !== "object") return null;
      return normalizeResumeProfileExtract(parsed as RawResumeProfileExtract);
    } catch {
      return null;
    }
  }
}

function hasExtractedProfileData(profile: ResumeProfileExtract): boolean {
  return Boolean(
    profile.full_name ||
      profile.phone ||
      profile.bio ||
      profile.target_role ||
      profile.location ||
      (profile.skills && profile.skills.length > 0) ||
      (profile.experience && profile.experience.length > 0) ||
      (profile.education && profile.education.length > 0)
  );
}

function parseBailianResponseText(value: unknown): string | null {
  if (!isRecord(value) || !Array.isArray(value.output)) return null;

  for (const outputItem of value.output) {
    if (!isRecord(outputItem) || !Array.isArray(outputItem.content)) continue;

    for (const contentItem of outputItem.content) {
      if (!isRecord(contentItem)) continue;
      const text = getString(contentItem.text);
      if (text) return text;
    }
  }

  return getString(value.output_text) || null;
}

function buildResumeExtractPrompt(): string {
  return `只返回合法 JSON，不要 Markdown 或解释。请从简历中提取以下字段：
{"full_name":"","phone":"","location":"","target_role":"","bio":"","skills":[],"experience":[{"company":"","role":"","start_date":"","end_date":"","description":""}],"education":[{"school":"","degree":"","major":"","start_date":"","end_date":""}]}
full_name 只能是求职者真实姓名，不能使用文件名、页面标题或“校招/社招通用模板”等模板文字。每段 experience 只对应一段真实工作或实习，不要把同一工作中的项目、职责或成果拆成新的 experience，相关内容合并到 description。experience 中 role 只填写职位名称。不要遗漏简历中的 education、skills 和 experience。日期只用 YYYY-MM，不确定或缺失时填空字符串或空数组。不要提取邮箱、薪资、文件地址或求职偏好。bio 使用中文且不超过 80 字。`;
}

async function extractProfileWithBailianOcr(
  fileURL: string
): Promise<ResumeProfileExtract | null> {
  const apiKey = process.env.BAILIAN_API_KEY;
  const baseURL = process.env.BAILIAN_BASE_URL;
  const model = process.env.BAILIAN_OCR_MODEL ?? DEFAULT_BAILIAN_OCR_MODEL;

  if (!apiKey || !baseURL) return null;

  const response = await fetch(`${baseURL.replace(/\/$/, "")}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      input: [
        {
          role: "user",
          content: [
            { type: "input_file", file_url: fileURL },
            { type: "input_text", text: buildResumeExtractPrompt() },
          ],
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Bailian OCR failed (${response.status})`);
  }

  const responseText = parseBailianResponseText(await response.json());
  return responseText ? parseResumeExtractJson(responseText) : null;
}

function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.toLowerCase().includes("timed out")
  );
}

function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message.replace(/sk-[A-Za-z0-9._-]+/g, "[REDACTED_KEY]");
  }

  return "unknown error";
}

export async function extractResumeProfile(): Promise<{
  profile: ResumeProfileExtract | null;
  error: string | null;
  source: "pdf" | "ocr" | null;
}> {
  try {
    if (
      !process.env.BAILIAN_API_KEY ||
      !process.env.BAILIAN_BASE_URL
    ) {
      return { profile: null, error: "AI 服务尚未配置", source: null };
    }

    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return { profile: null, error: "未登录", source: null };
    }

    const userId = userData.user.id;
    const { data, error } = await client.database
      .from("profiles")
      .select("resume_file_key")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return { profile: null, error: "获取简历失败", source: null };
    }

    const profile = data as ResumeKeyProfileRow | null;
    const resumeKey = profile?.resume_file_key;

    if (!resumeKey) {
      return { profile: null, error: "请先上传 PDF 简历", source: null };
    }

    if (!resumeKey.startsWith(`${userId}/`)) {
      return { profile: null, error: "无权识别该简历", source: null };
    }

    const { data: signedURLData, error: signedURLError } = await client.storage
      .from("resumes")
      .createSignedUrl(resumeKey, 300);

    if (signedURLError || !signedURLData?.signedUrl) {
      return { profile: null, error: "简历文件读取失败", source: null };
    }

    const extractedProfile = await extractProfileWithBailianOcr(
      signedURLData.signedUrl
    );

    if (!extractedProfile || !hasExtractedProfileData(extractedProfile)) {
      return {
        profile: null,
        error: "AI 未能识别出可用资料",
        source: "ocr",
      };
    }

    return { profile: extractedProfile, error: null, source: "ocr" };
  } catch (error) {
    console.error("[profile/extractResumeProfile]", getSafeErrorMessage(error));
    if (isTimeoutError(error)) {
      return {
        profile: null,
        error: "AI 识别超时，请稍后重试",
        source: null,
      };
    }

    return {
      profile: null,
      error: "AI 识别失败，请稍后重试",
      source: null,
    };
  }
}
