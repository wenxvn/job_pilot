import { createInsForgeServerClient, getJobForUser } from "@/lib/insforge/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await context.params;
    const client = await createInsForgeServerClient();
    const { data: userData, error: authError } = await client.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
    }

    const job = await getJobForUser(client, userData.user.id, id);
    if (!job) {
      return NextResponse.json({ success: false, error: "职位不存在或已被移除" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { job } });
  } catch (error) {
    console.error("[api/jobs/[id]/GET]", error);
    return NextResponse.json({ success: false, error: "职位详情加载失败" }, { status: 500 });
  }
}
