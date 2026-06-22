"use client";

import Link from "next/link";
import {
  Briefcase,
  FileText,
  Send,
  Search,
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import posthog from "posthog-js";
import { useAuth } from "@/hooks/useAuth";

/* ── 未登录：Landing Page ── */

function LandingPage() {
  const features = [
    {
      icon: Search,
      title: "智能职位发现",
      desc: "通过 Browserbase 会话自动从 LinkedIn 抓取匹配职位，告别手动翻页。",
    },
    {
      icon: Target,
      title: "AI 匹配评分",
      desc: "GPT-4o 深度分析职位描述与你的技能，精准计算匹配度。",
    },
    {
      icon: FileText,
      title: "定制简历生成",
      desc: "针对每个职位自动生成定制简历，突出最相关的经验和技能。",
    },
    {
      icon: BarChart3,
      title: "投递状态追踪",
      desc: "一站式管理所有申请，实时掌握投递进度和结果。",
    },
  ];

  const steps = [
    { num: "01", title: "填写个人资料", desc: "录入技能、经验和求职目标" },
    { num: "02", title: "AI 自动搜索", desc: "连接 LinkedIn，智能发现匹配职位" },
    { num: "03", title: "查看匹配评分", desc: "AI 分析每个职位与你的契合度" },
    { num: "04", title: "一键投递", desc: "生成定制简历，快速申请" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* 装饰性背景光晕 */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-accent/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-48 h-[400px] w-[400px] rounded-full bg-info/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-success/[0.04] blur-3xl" />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-20 text-center">
        {/* 装饰性浮动元素 */}
        <div className="pointer-events-none absolute top-12 left-[15%] animate-float opacity-60">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light shadow-sm">
            <Briefcase className="h-5 w-5 text-accent" />
          </div>
        </div>
        <div className="pointer-events-none absolute top-24 right-[18%] animate-float-delayed opacity-60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-light shadow-sm">
            <Sparkles className="h-5 w-5 text-success-foreground" />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-20 left-[22%] animate-float-delayed opacity-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-light shadow-sm">
            <Target className="h-5 w-5 text-info-foreground" />
          </div>
        </div>

        {/* 徽章 */}
        <div className="animate-fade-in-up stagger-1 mb-6 inline-flex items-center gap-2 rounded-full bg-accent-light px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-medium text-accent">
            AI 驱动的智能求职工具
          </span>
        </div>

        {/* 标题 */}
        <h1 className="animate-fade-in-up stagger-2 mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          让 AI 帮你找到
          <span className="relative ml-2">
            <span
              className="animate-gradient-shift bg-gradient-to-r from-accent via-info to-accent bg-clip-text text-transparent"
            >
              下一份好工作
            </span>
          </span>
        </h1>

        {/* 副标题 */}
        <p className="animate-fade-in-up stagger-3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          JobPilot 自动从 LinkedIn 发现匹配职位，用 GPT-4o 评分筛选，并为你生成定制简历 — 告别海投低效。
        </p>

        {/* CTA 按钮组 */}
        <div className="animate-fade-in-up stagger-4 mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            onClick={() =>
              posthog.capture("cta_click", { cta: "signup", source: "home_hero" })
            }
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:brightness-110"
          >
            免费开始使用
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            onClick={() =>
              posthog.capture("cta_click", { cta: "login", source: "home_hero" })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-text-primary shadow-sm transition-all hover:bg-surface-secondary hover:shadow-md"
          >
            登录账号
          </Link>
        </div>

        {/* 社会证明条 */}
        <div className="animate-fade-in-up stagger-5 mt-14 flex flex-wrap items-center justify-center gap-8">
          {[
            { value: "3x", label: "投递效率提升" },
            { value: "85%", label: "匹配准确率" },
            { value: "10s", label: "简历生成速度" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-text-primary">
                {stat.value}
              </div>
              <div className="mt-0.5 text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 特色功能区 */}
      <section className="relative px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
              四大核心能力
            </h2>
            <p className="mt-3 text-sm text-text-secondary">
              从职位发现到简历投递，AI 全程助力
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up stagger-${i + 1}`}
              >
                {/* 悬停时的渐变边框效果 */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-info to-accent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-light transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <f.icon className="h-5 w-5 text-accent transition-colors group-hover:text-accent-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 工作流程 */}
      <section className="relative bg-surface px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
              如何使用
            </h2>
            <p className="mt-3 text-sm text-text-secondary">
              四步开启你的 AI 求职之旅
            </p>
          </div>

          <div className="relative">
            {/* 连接线 */}
            <div className="absolute left-8 top-8 bottom-8 hidden w-px bg-gradient-to-b from-accent/40 via-info/40 to-success/40 sm:block" />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className={`relative flex items-start gap-5 animate-fade-in-up stagger-${i + 1}`}
                >
                  {/* 步骤编号 */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface shadow-sm">
                    <span className="text-lg font-bold text-accent">
                      {step.num}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-semibold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部 CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/signup"
              onClick={() =>
                posthog.capture("cta_click", {
                  cta: "signup",
                  source: "home_bottom",
                })
              }
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:brightness-110"
            >
              立即注册，开启智能求职
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── 已登录：Dashboard ── */

function Dashboard({ userName }: { userName: string }) {
  const quickActions = [
    {
      icon: Search,
      title: "浏览职位",
      desc: "查看最新匹配的职位列表",
      href: "/jobs",
      color: "bg-accent-light",
      iconColor: "text-accent",
      card: "jobs",
    },
    {
      icon: FileText,
      title: "管理简历",
      desc: "创建和定制你的简历",
      href: "/resumes",
      color: "bg-info-light",
      iconColor: "text-info-foreground",
      card: "resumes",
    },
    {
      icon: Send,
      title: "投递记录",
      desc: "跟踪投递状态和进展",
      href: "/applications",
      color: "bg-success-light",
      iconColor: "text-success-foreground",
      card: "applications",
    },
  ];

  const mockActivity = [
    {
      icon: Briefcase,
      text: "发现 12 个新的匹配职位",
      time: "2 小时前",
      color: "bg-accent-light",
      iconColor: "text-accent",
    },
    {
      icon: CheckCircle2,
      text: "简历已成功生成",
      time: "昨天",
      color: "bg-success-light",
      iconColor: "text-success-foreground",
    },
    {
      icon: Send,
      text: "投递了 3 个职位",
      time: "2 天前",
      color: "bg-info-light",
      iconColor: "text-info-foreground",
    },
  ];

  const mockTips = [
    "完善个人资料可以提升职位匹配准确率",
    "为高匹配度职位生成定制简历，提高面试机会",
    "定期更新技能列表，获取更精准的推荐",
  ];

  return (
    <div className="space-y-6">
      {/* 欢迎区 */}
      <div className="animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/[0.06] blur-2xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-text-primary">
            欢迎回来，{userName}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            以下是你的求职进展概览，祝你今天投递顺利！
          </p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "已发现职位",
            value: "48",
            change: "+12 本周",
            icon: Briefcase,
            iconBg: "bg-accent-light",
            iconColor: "text-accent",
          },
          {
            label: "平均匹配度",
            value: "76%",
            change: "+5% 较上周",
            icon: TrendingUp,
            iconBg: "bg-success-light",
            iconColor: "text-success-foreground",
          },
          {
            label: "已投递",
            value: "15",
            change: "+3 本周",
            icon: Send,
            iconBg: "bg-info-light",
            iconColor: "text-info-foreground",
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-md animate-fade-in-up stagger-${i + 1}`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-text-secondary">
                {stat.label}
              </div>
              <div className="mt-0.5 text-xl font-bold text-text-primary">
                {stat.value}
              </div>
              <div className="mt-0.5 text-xs text-text-muted">
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 快捷操作 + 最近动态 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* 快捷操作 */}
        <div className="lg:col-span-3">
          <h2 className="mb-3 text-base font-semibold text-text-primary">
            快捷操作
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <Link
                key={action.title}
                href={action.href}
                onClick={() =>
                  posthog.capture("feature_card_click", { card: action.card })
                }
                className={`group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-${i + 1}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.color}`}
                >
                  <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-text-primary">
                    {action.title}
                  </div>
                  <div className="mt-0.5 text-xs text-text-secondary">
                    {action.desc}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>

        {/* 最近动态 */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-text-primary">
            最近动态
          </h2>
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="space-y-4">
              {mockActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                  >
                    <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-primary">{item.text}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 分割线 */}
            <div className="my-5 h-px bg-border" />

            {/* 求职小贴士 */}
            <div>
              <div className="mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold text-text-primary">
                  求职小贴士
                </span>
              </div>
              <ul className="space-y-2">
                {mockTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span className="text-xs leading-relaxed text-text-secondary">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 主组件 ── */

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <Dashboard userName={user.name ?? user.email ?? "用户"} />;
}
