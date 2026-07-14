import {
  createInsForgeServerClient,
  listJobsForUser,
  saveJobsForUser,
} from "@/lib/insforge/server";
import { searchJoobleJobs } from "@/lib/jooble";
import { NextResponse } from "next/server";

interface SearchInput {
  keywords: string;
  location: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseSearchInput(value: unknown): SearchInput | null {
  if (!isRecord(value)) return null;

  const keywords = typeof value.keywords === "string" ? value.keywords.trim() : "";
  const location = typeof value.location === "string" ? value.location.trim() : "";
  if (keywords.length < 2 || keywords.length > 100 || location.length > 100) return null;

  return { keywords, location };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const input = parseSearchInput(await request.json());
    if (!input) {
      return NextResponse.json(
        { success: false, error: "请输入 2–100 个字符的职位名称" },
        { status: 400 }
      );
    }

    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();
    if (authError || !userData?.user) {
      return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
    }

    const foundJobs = await searchJoobleJobs(input);
    await saveJobsForUser(client, userData.user.id, foundJobs);
    const jobs = await listJobsForUser(client, userData.user.id);

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        found: foundJobs.length,
        message: foundJobs.length > 0
          ? `已找到并保存 ${foundJobs.length} 个职位`
          : "本次搜索没有找到职位，请尝试其他关键词",
      },
    });
  } catch (error) {
    console.error("[api/jobs/search/POST]", error);
    const message = error instanceof Error && error.message === "JOOBLE_NOT_CONFIGURED"
      ? "职位搜索服务尚未配置"
      : "职位搜索暂时失败，请稍后重试";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
