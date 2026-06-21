"use client";

import Link from "next/link";
import { Briefcase, FileText, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full bg-surface-secondary animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            用 AI 找到下一份技术好工作
          </h1>
          <p className="text-lg text-text-secondary mb-8">
            JobPilot 从 LinkedIn 发现匹配职位，用 AI 评分筛选，并帮你生成定制简历 — 一站式搞定。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-accent text-accent-foreground rounded-md px-6 py-3 text-sm font-medium"
            >
              免费开始
            </Link>
            <Link
              href="/login"
              className="bg-surface border border-border text-text-primary rounded-md px-6 py-3 text-sm font-medium"
            >
              登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          欢迎回来，{user.name ?? user.email}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          以下是你的求职进展概览。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/jobs" className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <Briefcase className="h-8 w-8 text-accent mb-3" />
          <h2 className="text-base font-semibold text-text-primary">职位</h2>
          <p className="text-sm text-text-secondary mt-1">浏览和管理已发现的职位</p>
        </Link>

        <Link href="/resumes" className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <FileText className="h-8 w-8 text-accent mb-3" />
          <h2 className="text-base font-semibold text-text-primary">简历</h2>
          <p className="text-sm text-text-secondary mt-1">创建和定制你的简历</p>
        </Link>

        <Link href="/applications" className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <Send className="h-8 w-8 text-accent mb-3" />
          <h2 className="text-base font-semibold text-text-primary">投递记录</h2>
          <p className="text-sm text-text-secondary mt-1">跟踪你的投递状态</p>
        </Link>
      </div>
    </div>
  );
}
