import { createInsForgeServerClient, listJobsForUser } from "@/lib/insforge/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
    }

    const jobs = await listJobsForUser(client, userData.user.id);
    return NextResponse.json({ success: true, data: { jobs } });
  } catch (error) {
    console.error("[api/jobs/GET]", error);
    return NextResponse.json({ success: false, error: "职位列表加载失败" }, { status: 500 });
  }
}
