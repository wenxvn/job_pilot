"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  User,
  Briefcase,
  DollarSign,
  MapPin,
  Link as LinkIcon,
  Plus,
  X,
  Upload,
  FileText,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import posthog from "posthog-js";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, upsertProfile, uploadResume } from "@/actions/profile";
import type { Experience, ProfileInput } from "@/types/profile";

/* ── 类型 ── */

interface ProfileForm {
  full_name: string;
  email: string;
  target_role: string;
  salary_min: number;
  salary_max: number;
  location: string;
  linkedin_url: string;
  skills: string[];
  experience: Experience[];
  resume_file_url: string;
  resume_file_key: string;
}

const EMPTY_PROFILE: ProfileForm = {
  full_name: "",
  email: "",
  target_role: "",
  salary_min: 0,
  salary_max: 0,
  location: "",
  linkedin_url: "",
  skills: [],
  experience: [],
  resume_file_url: "",
  resume_file_key: "",
};

/* ── 扇形完成度环组件 ── */

function CompletionRing({ percent }: { percent: number }) {
  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const getColor = (p: number) => {
    if (p >= 80) return "var(--color-success)";
    if (p >= 50) return "var(--color-info)";
    if (p >= 25) return "var(--color-warning)";
    return "var(--color-accent)";
  };

  const getLabel = (p: number) => {
    if (p >= 80) return "资料完善";
    if (p >= 50) return "继续加油";
    if (p >= 25) return "还需完善";
    return "开始填写";
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* 背景轨道 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-secondary)"
          strokeWidth={strokeWidth}
        />
        {/* 进度弧 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(percent)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="animate-profile-ring-in"
          style={{ "--ring-circ": circumference, "--ring-target": offset } as React.CSSProperties}
        />
      </svg>
      {/* 中心文字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-text-primary">{percent}%</span>
        <span className="text-xs text-text-muted mt-0.5">{getLabel(percent)}</span>
      </div>
    </div>
  );
}

/* ── 模块完成项组件 ── */

function SectionProgress({
  items,
}: {
  items: { label: string; done: boolean }[];
}) {
  const doneCount = items.filter((i) => i.done).length;
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={item.label}
          className="flex items-center gap-2 animate-fade-in-up"
          style={{ animationDelay: `${idx * 60 + 400}ms` }}
        >
          {item.done ? (
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
          ) : (
            <Circle className="h-4 w-4 text-text-muted shrink-0" />
          )}
          <span
            className={`text-xs ${
              item.done
                ? "text-text-primary font-medium"
                : "text-text-muted"
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-surface-secondary">
          <div
            className="h-full rounded-full bg-accent animate-[progress-in_1s_ease-out_forwards] opacity-0"
            style={{ width: `${(doneCount / items.length) * 100}%` }}
          />
        </div>
        <span className="text-[11px] text-text-muted font-medium">
          {doneCount}/{items.length}
        </span>
      </div>
    </div>
  );
}

/* ── 主页面 ── */

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>(EMPTY_PROFILE);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── 数据加载 ── */

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const { profile: data, error: err } = await getProfile();
    if (err) {
      setError(err);
    } else if (data) {
      setProfile({
        full_name: data.full_name,
        email: data.email,
        target_role: data.target_role,
        salary_min: data.salary_min,
        salary_max: data.salary_max,
        location: data.location,
        linkedin_url: data.linkedin_url,
        skills: data.skills ?? [],
        experience: (data.experience as Experience[]) ?? [],
        resume_file_url: data.resume_file_url,
        resume_file_key: data.resume_file_key,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (user?.email && !profile.email) {
      setProfile((prev) => ({ ...prev, email: user.email ?? "" }));
    }
  }, [user, profile.email]);

  /* ── 完成度计算 ── */

  const completion = useMemo(() => {
    const basicItems = [
      { label: "姓名", done: !!profile.full_name.trim() },
      { label: "所在地", done: !!profile.location.trim() },
      { label: "LinkedIn 主页", done: !!profile.linkedin_url.trim() },
    ];
    const intentItems = [
      { label: "目标职位", done: !!profile.target_role.trim() },
      { label: "期望薪资", done: profile.salary_min > 0 && profile.salary_max > 0 },
    ];
    const skillItems = [
      { label: "至少 3 项技能", done: profile.skills.length >= 3 },
      { label: "至少 5 项技能（推荐）", done: profile.skills.length >= 5 },
    ];
    const expItems = [
      { label: "添加至少 1 段经历", done: profile.experience.length >= 1 },
      { label: "添加至少 2 段经历（推荐）", done: profile.experience.length >= 2 },
    ];
    const resumeItems = [
      { label: "上传简历", done: !!profile.resume_file_url },
    ];

    const allItems = [
      ...basicItems,
      ...intentItems,
      ...skillItems,
      ...expItems,
      ...resumeItems,
    ];
    const doneCount = allItems.filter((i) => i.done).length;
    const percent = Math.round((doneCount / allItems.length) * 100);

    return { percent, basicItems, intentItems, skillItems, expItems, resumeItems };
  }, [profile]);

  /* ── 交互处理 ── */

  function handleAddSkill() {
    const skill = skillInput.trim();
    if (!skill || profile.skills.includes(skill)) return;
    setProfile({ ...profile, skills: [...profile.skills, skill] });
    setSkillInput("");
  }

  function handleRemoveSkill(skill: string) {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    });
  }

  function handleAddExperience() {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      role: "",
      start_date: "",
      end_date: "",
      description: "",
    };
    setProfile({ ...profile, experience: [...profile.experience, newExp] });
  }

  function handleUpdateExperience(
    id: string,
    field: keyof Experience,
    value: string
  ) {
    setProfile({
      ...profile,
      experience: profile.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  }

  function handleRemoveExperience(id: string) {
    setProfile({
      ...profile,
      experience: profile.experience.filter((exp) => exp.id !== id),
    });
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("仅支持 PDF 格式");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("文件大小不能超过 10MB");
      return;
    }

    setUploadingResume(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadResume(formData);

    if (result) {
      setProfile((prev) => ({
        ...prev,
        resume_file_url: result.url,
        resume_file_key: result.key,
      }));
      posthog.capture("resume_uploaded", {
        file_type: file.type,
        file_size: file.size,
      });
    } else {
      setError("上传简历失败，请重试");
    }

    setUploadingResume(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const input: ProfileInput = {
      full_name: profile.full_name,
      email: profile.email,
      target_role: profile.target_role,
      salary_min: profile.salary_min,
      salary_max: profile.salary_max,
      location: profile.location,
      linkedin_url: profile.linkedin_url,
      skills: profile.skills,
      experience: profile.experience,
      resume_file_url: profile.resume_file_url,
      resume_file_key: profile.resume_file_key,
    };

    const { error: err } = await upsertProfile(input);
    setSaving(false);

    if (err) {
      setError(err);
    } else {
      setSaved(true);
      posthog.capture("profile_saved", {
        skills_count: input.skills.length,
        has_resume: !!input.resume_file_url,
      });
      setTimeout(() => setSaved(false), 3000);
    }
  }

  /* ── 加载态 ── */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full bg-surface-secondary animate-pulse" />
      </div>
    );
  }

  /* ── 渲染 ── */

  return (
    <div className="space-y-6">
      {/* ── 头部欢迎区 + 完成度环 ── */}
      <div className="animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm">
        {/* 装饰光晕 */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-info/[0.06] blur-2xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* 文字区 */}
          <div className="flex-1 min-w-0">
            <div className="animate-fade-in-up stagger-1 mb-3 inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">
                个人资料中心
              </span>
            </div>
            <h1 className="animate-fade-in-up stagger-2 text-2xl font-bold text-text-primary sm:text-3xl">
              你好，{profile.full_name || "求职者"}
            </h1>
            <p className="animate-fade-in-up stagger-3 mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              完善你的资料信息，帮助 AI 更精准地匹配职位。
              {completion.percent < 100 &&
                " 继续填写下方内容提升匹配准确度！"}
            </p>
          </div>

          {/* 扇形完成度环 */}
          <div className="animate-fade-in-up stagger-3 hidden sm:block shrink-0">
            <CompletionRing percent={completion.percent} />
          </div>
        </div>
      </div>

      {/* ── 错误提示 ── */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-md px-4 py-3 animate-fade-in">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* ── 表单 ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── 基本信息 + 完成进度 ── */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-1">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-info to-accent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-start justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light transition-transform group-hover:scale-105">
                <User className="h-4 w-4 text-accent" />
              </span>
              基本信息
            </h2>
            <div className="hidden md:block w-48">
              <SectionProgress items={completion.basicItems} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                姓名
              </label>
              <input
                id="full_name"
                type="text"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                placeholder="请输入姓名"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-sm text-text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  所在地
                </span>
              </label>
              <input
                id="location"
                type="text"
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                placeholder="例如：上海、北京"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="linkedin_url"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" />
                  LinkedIn 主页
                </span>
              </label>
              <input
                id="linkedin_url"
                type="url"
                value={profile.linkedin_url}
                onChange={(e) =>
                  setProfile({ ...profile, linkedin_url: e.target.value })
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* ── 求职意向 ── */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-2">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-info via-accent to-info opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-start justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-light transition-transform group-hover:scale-105">
                <Briefcase className="h-4 w-4 text-info-foreground" />
              </span>
              求职意向
            </h2>
            <div className="hidden md:block w-48">
              <SectionProgress items={completion.intentItems} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="target_role"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                目标职位
              </label>
              <input
                id="target_role"
                type="text"
                value={profile.target_role}
                onChange={(e) =>
                  setProfile({ ...profile, target_role: e.target.value })
                }
                placeholder="例如：前端工程师"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="salary_min"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  最低期望薪资（月薪/元）
                </span>
              </label>
              <input
                id="salary_min"
                type="number"
                value={profile.salary_min || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    salary_min: Number(e.target.value),
                  })
                }
                placeholder="例如：25000"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="salary_max"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  最高期望薪资（月薪/元）
                </span>
              </label>
              <input
                id="salary_max"
                type="number"
                value={profile.salary_max || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    salary_max: Number(e.target.value),
                  })
                }
                placeholder="例如：40000"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* ── 技能标签 ── */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-3">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-success via-info to-success opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-start justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-light transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-success-foreground" />
              </span>
              技能标签
            </h2>
            <div className="hidden md:block w-48">
              <SectionProgress items={completion.skillItems} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill, idx) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 bg-accent-light text-accent rounded-full px-3 py-1 text-xs font-medium animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-accent-dark transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {profile.skills.length === 0 && (
              <p className="text-sm text-text-muted">
                暂无技能标签，请在下方输入添加。
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="输入技能名称，按 Enter 添加"
              className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-surface border border-border text-text-primary rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-secondary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── 工作经验 ── */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-4">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-success to-accent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light transition-transform group-hover:scale-105">
                <Briefcase className="h-4 w-4 text-accent" />
              </span>
              工作经验
            </h2>
            <div className="flex items-center gap-4">
              <div className="hidden md:block w-48">
                <SectionProgress items={completion.expItems} />
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
              >
                <Plus className="h-4 w-4" />
                添加经历
              </button>
            </div>
          </div>

          {profile.experience.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="h-10 w-10 text-text-muted/40 mx-auto mb-3" />
              <p className="text-sm text-text-muted">
                暂无工作经历，点击上方按钮添加。
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {profile.experience.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="border border-border rounded-lg p-4 relative animate-fade-in-up group/exp"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="absolute top-3 right-3 text-text-muted hover:text-error transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        公司名称
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          handleUpdateExperience(
                            exp.id,
                            "company",
                            e.target.value
                          )
                        }
                        placeholder="例如：字节跳动"
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        职位名称
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) =>
                          handleUpdateExperience(
                            exp.id,
                            "role",
                            e.target.value
                          )
                        }
                        placeholder="例如：前端工程师"
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        开始时间
                      </label>
                      <input
                        type="month"
                        value={exp.start_date}
                        onChange={(e) =>
                          handleUpdateExperience(
                            exp.id,
                            "start_date",
                            e.target.value
                          )
                        }
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        结束时间
                      </label>
                      <input
                        type="month"
                        value={exp.end_date}
                        onChange={(e) =>
                          handleUpdateExperience(
                            exp.id,
                            "end_date",
                            e.target.value
                          )
                        }
                        placeholder="留空表示至今"
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
                      />
                      <p className="text-xs text-text-muted mt-1">
                        留空表示至今
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        工作描述
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) =>
                          handleUpdateExperience(
                            exp.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="简要描述你的工作职责和成就"
                        rows={2}
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-none transition-shadow"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 简历上传 ── */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-info via-accent to-info opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-start justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-light transition-transform group-hover:scale-105">
                <FileText className="h-4 w-4 text-info-foreground" />
              </span>
              基础简历
            </h2>
            <div className="hidden md:block w-48">
              <SectionProgress items={completion.resumeItems} />
            </div>
          </div>

          {profile.resume_file_url ? (
            <div className="flex items-center gap-3 border border-border rounded-lg p-4 transition-colors hover:border-accent/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-light">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  已上传简历
                </p>
                <a
                  href={profile.resume_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  查看文件
                </a>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
              >
                替换
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent/40 hover:bg-accent/[0.02] transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingResume ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  <p className="text-sm text-text-secondary">上传中...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-secondary mb-1">
                    点击上传简历
                  </p>
                  <p className="text-xs text-text-muted">
                    支持 PDF 格式，最大 10MB
                  </p>
                </>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* ── 底部保存栏 ── */}
        <div className="animate-fade-in-up stagger-6 flex items-center justify-between rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-success-foreground bg-success-light rounded-full px-3 py-1 animate-fade-in">
                保存成功
              </span>
            )}
            {error && (
              <span className="text-sm text-error animate-fade-in">
                保存失败，请重试
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-accent text-accent-foreground rounded-md px-6 py-2.5 text-sm font-medium disabled:opacity-50 transition-all hover:brightness-110 hover:shadow-md hover:shadow-accent/20"
          >
            {saving ? "保存中..." : "保存资料"}
          </button>
        </div>
      </form>
    </div>
  );
}
