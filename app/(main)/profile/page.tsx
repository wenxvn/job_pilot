"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { User, Briefcase, DollarSign, MapPin, Link as LinkIcon, Plus, X, Upload, FileText } from "lucide-react";
import posthog from "posthog-js";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, upsertProfile, uploadResume } from "@/actions/profile";
import type { Experience, ProfileInput } from "@/types/profile";

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

  function handleAddSkill() {
    const skill = skillInput.trim();
    if (!skill || profile.skills.includes(skill)) return;
    setProfile({ ...profile, skills: [...profile.skills, skill] });
    setSkillInput("");
  }

  function handleRemoveSkill(skill: string) {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
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

  function handleUpdateExperience(id: string, field: keyof Experience, value: string) {
    setProfile({
      ...profile,
      experience: profile.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  }

  function handleRemoveExperience(id: string) {
    setProfile({ ...profile, experience: profile.experience.filter((exp) => exp.id !== id) });
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
      posthog.capture("resume_uploaded", { file_type: file.type, file_size: file.size });
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
      posthog.capture("profile_saved", { skills_count: input.skills.length, has_resume: !!input.resume_file_url });
      setTimeout(() => setSaved(false), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full bg-surface-secondary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">个人资料</h1>
        <p className="text-sm text-text-secondary mt-1">
          完善你的资料信息，帮助 AI 更精准地匹配职位。
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-md px-4 py-3">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-accent" />
            基本信息
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-text-secondary mb-1.5">
                姓名
              </label>
              <input
                id="full_name"
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="请输入姓名"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
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
              <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  所在地
                </span>
              </label>
              <input
                id="location"
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="例如：上海、北京"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label htmlFor="linkedin_url" className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" />
                  LinkedIn 主页
                </span>
              </label>
              <input
                id="linkedin_url"
                type="url"
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* 求职意向 */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-accent" />
            求职意向
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="target_role" className="block text-sm font-medium text-text-secondary mb-1.5">
                目标职位
              </label>
              <input
                id="target_role"
                type="text"
                value={profile.target_role}
                onChange={(e) => setProfile({ ...profile, target_role: e.target.value })}
                placeholder="例如：前端工程师"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label htmlFor="salary_min" className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  最低期望薪资（月薪/元）
                </span>
              </label>
              <input
                id="salary_min"
                type="number"
                value={profile.salary_min || ""}
                onChange={(e) => setProfile({ ...profile, salary_min: Number(e.target.value) })}
                placeholder="例如：25000"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label htmlFor="salary_max" className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  最高期望薪资（月薪/元）
                </span>
              </label>
              <input
                id="salary_max"
                type="number"
                value={profile.salary_max || ""}
                onChange={(e) => setProfile({ ...profile, salary_max: Number(e.target.value) })}
                placeholder="例如：40000"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* 技能标签 */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-text-primary mb-4">
            技能标签
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 bg-accent-light text-accent rounded-full px-3 py-1 text-xs font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-accent-dark"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {profile.skills.length === 0 && (
              <p className="text-sm text-text-muted">暂无技能标签，请在下方输入添加。</p>
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
              className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-surface border border-border text-text-primary rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-secondary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 工作经验 */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary">
              工作经验
            </h2>
            <button
              type="button"
              onClick={handleAddExperience}
              className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark"
            >
              <Plus className="h-4 w-4" />
              添加经历
            </button>
          </div>

          {profile.experience.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">
              暂无工作经历，点击上方按钮添加。
            </p>
          ) : (
            <div className="space-y-4">
              {profile.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="border border-border rounded-lg p-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="absolute top-3 right-3 text-text-muted hover:text-error"
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
                        onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                        placeholder="例如：字节跳动"
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        职位名称
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                        placeholder="例如：前端工程师"
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        开始时间
                      </label>
                      <input
                        type="month"
                        value={exp.start_date}
                        onChange={(e) => handleUpdateExperience(exp.id, "start_date", e.target.value)}
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        结束时间
                      </label>
                      <input
                        type="month"
                        value={exp.end_date}
                        onChange={(e) => handleUpdateExperience(exp.id, "end_date", e.target.value)}
                        placeholder="留空表示至今"
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      />
                      <p className="text-xs text-text-muted mt-1">留空表示至今</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        工作描述
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)}
                        placeholder="简要描述你的工作职责和成就"
                        rows={2}
                        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 简历上传 */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-text-primary mb-4">
            基础简历
          </h2>

          {profile.resume_file_url ? (
            <div className="flex items-center gap-3 border border-border rounded-lg p-4">
              <FileText className="h-8 w-8 text-accent flex-shrink-0" />
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
                disabled={uploadingResume}
                className="text-sm font-medium text-accent hover:text-accent-dark disabled:opacity-50"
              >
                替换
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-secondary mb-1">
                {uploadingResume ? "上传中…" : "点击上传简历"}
              </p>
              <p className="text-xs text-text-muted mb-4">
                支持 PDF 格式，最大 10MB
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingResume}
                className="bg-surface border border-border text-text-primary rounded-md px-4 py-2 text-sm font-medium hover:bg-surface-secondary disabled:opacity-50"
              >
                选择文件
              </button>
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

        {/* 保存按钮 */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm text-success-foreground bg-success-light rounded-full px-3 py-1">
              保存成功
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="bg-accent text-accent-foreground rounded-md px-6 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {saving ? "保存中…" : "保存资料"}
          </button>
        </div>
      </form>
    </div>
  );
}
