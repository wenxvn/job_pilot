import { createInsForgeServerClient } from "@/lib/insforge/server";
import { NextResponse } from "next/server";

interface ResumeProfileRow {
  resume_file_key: string | null;
}

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return NextResponse.json({ success: false, error: "未登录" }, { status: 401 });
    }

    const userId = userData.user.id;
    const { data, error } = await client.database
      .from("profiles")
      .select("resume_file_key")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: "获取简历失败" }, { status: 500 });
    }

    const profile = data as ResumeProfileRow | null;
    const resumeKey = profile?.resume_file_key;

    if (!resumeKey) {
      return NextResponse.json({ success: false, error: "尚未上传简历" }, { status: 404 });
    }

    if (!resumeKey.startsWith(`${userId}/`)) {
      return NextResponse.json({ success: false, error: "无权查看该简历" }, { status: 403 });
    }

    const { data: resumeBlob, error: downloadError } = await client.storage
      .from("resumes")
      .download(resumeKey);

    if (downloadError || !resumeBlob) {
      return NextResponse.json({ success: false, error: "简历文件读取失败" }, { status: 404 });
    }

    return new Response(resumeBlob, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": 'inline; filename="resume.pdf"',
        "Content-Length": String(resumeBlob.size),
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "服务器错误" }, { status: 500 });
  }
}
