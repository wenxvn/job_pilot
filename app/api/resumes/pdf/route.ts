import { createInsForgeServerClient } from "@/lib/insforge/server";
import { renderProfileResume } from "@/lib/resume-pdf";
import type { Profile } from "@/types/profile";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function createFilename(fullName: string): string {
  const safeName = fullName.trim().replace(/[\\/:*?"<>|]/g, "") || "个人";
  return encodeURIComponent(`${safeName}简历.pdf`);
}

export async function GET(request: Request): Promise<Response> {
  try {
    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return NextResponse.json({ success: false, error: "未登录" }, { status: 401 });
    }

    const { data, error } = await client.database
      .from("profiles")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: "获取个人资料失败" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: "请先填写并保存个人资料" }, { status: 404 });
    }

    const profile = data as Profile;
    const pdfBuffer = await renderProfileResume(profile);
    const disposition = new URL(request.url).searchParams.get("disposition") === "attachment"
      ? "attachment"
      : "inline";

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `${disposition}; filename*=UTF-8''${createFilename(profile.full_name)}`,
        "Content-Length": String(pdfBuffer.byteLength),
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("[api/resumes/pdf] PDF 生成失败", error);
    return NextResponse.json({ success: false, error: "PDF 生成失败，请稍后重试" }, { status: 500 });
  }
}
