"use client";

import {
  Briefcase,
  Building2,
  Circle,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  MapPin,
  Plus,
  Sparkles,
  User,
  X,
} from "lucide-react";
import type {
  Education,
  Experience,
  JobPreferences,
  ProfileInput,
} from "@/types/profile";

interface ProfileFormProps {
  profile: ProfileInput;
  skillInput: string;
  onProfileChange: (profile: ProfileInput) => void;
  onSkillInputChange: (value: string) => void;
}

interface ProgressItem {
  label: string;
  done: boolean;
}

function SectionProgress({ items }: { items: ProgressItem[] }) {
  const doneCount = items.filter((item) => item.done).length;
  const percent = Math.round((doneCount / items.length) * 100);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="flex items-center gap-2 animate-fade-in-up"
          style={{ animationDelay: `${index * 60 + 400}ms` }}
        >
          {item.done ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          ) : (
            <Circle className="h-4 w-4 shrink-0 text-text-muted" />
          )}
          <span
            className={`text-xs ${
              item.done
                ? "font-medium text-text-primary"
                : "text-text-muted"
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-secondary">
          <div
            className="h-full rounded-full bg-accent animate-[progress-in_1s_ease-out_forwards] opacity-0"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-text-muted">
          {doneCount}/{items.length}
        </span>
      </div>
    </div>
  );
}

function createExperience(): Experience {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    start_date: "",
    end_date: "",
    description: "",
  };
}

function createEducation(): Education {
  return {
    id: crypto.randomUUID(),
    school: "",
    degree: "",
    major: "",
    start_date: "",
    end_date: "",
  };
}

export function ProfileForm({
  profile,
  skillInput,
  onProfileChange,
  onSkillInputChange,
}: ProfileFormProps) {
  const personalItems = [
    { label: "姓名", done: !!profile.full_name.trim() },
    { label: "手机号", done: !!profile.phone.trim() },
    { label: "所在地", done: !!profile.location.trim() },
  ];
  const professionalItems = [
    { label: "目标职位", done: !!profile.target_role.trim() },
    { label: "个人简介", done: !!profile.bio.trim() },
    { label: "至少 3 项技能", done: profile.skills.length >= 3 },
  ];
  const experienceItems = [
    { label: "至少 1 段经历", done: profile.experience.length >= 1 },
    {
      label: "经历描述完整",
      done: profile.experience.some(
        (item) =>
          !!item.company.trim() &&
          !!item.role.trim() &&
          !!item.description.trim()
      ),
    },
  ];
  const educationItems = [
    { label: "至少 1 段教育", done: profile.education.length >= 1 },
    {
      label: "学校和专业",
      done: profile.education.some(
        (item) => !!item.school.trim() && !!item.major.trim()
      ),
    },
  ];
  const preferenceItems = [
    {
      label: "工作类型",
      done: !!profile.job_preferences.work_type.trim(),
    },
    {
      label: "远程偏好",
      done: !!profile.job_preferences.remote_preference.trim(),
    },
    {
      label: "偏好城市",
      done: profile.job_preferences.preferred_locations.length > 0,
    },
  ];

  function patchProfile(patch: Partial<ProfileInput>) {
    onProfileChange({ ...profile, ...patch });
  }

  function patchPreferences(patch: Partial<JobPreferences>) {
    patchProfile({
      job_preferences: {
        ...profile.job_preferences,
        ...patch,
      },
    });
  }

  function addSkill() {
    const skill = skillInput.trim();
    if (!skill || profile.skills.includes(skill)) return;
    patchProfile({ skills: [...profile.skills, skill] });
    onSkillInputChange("");
  }

  function removeSkill(skill: string) {
    patchProfile({
      skills: profile.skills.filter((item) => item !== skill),
    });
  }

  function updateExperience(
    id: string,
    field: keyof Experience,
    value: string
  ) {
    patchProfile({
      experience: profile.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  }

  function updateEducation(
    id: string,
    field: keyof Education,
    value: string
  ) {
    patchProfile({
      education: profile.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  }

  function parseListInput(value: string): string[] {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return (
    <div className="space-y-6">
      <section className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-1">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-info to-accent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light transition-transform group-hover:scale-105">
              <User className="h-4 w-4 text-accent" />
            </span>
            个人信息
          </h2>
          <div className="hidden w-48 md:block">
            <SectionProgress items={personalItems} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="full_name"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              姓名
            </label>
            <input
              id="full_name"
              type="text"
              value={profile.full_name}
              onChange={(event) => patchProfile({ full_name: event.target.value })}
              placeholder="请输入姓名"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              邮箱
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="w-full cursor-not-allowed rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-text-muted"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              手机号
            </label>
            <input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(event) => patchProfile({ phone: event.target.value })}
              placeholder="请输入手机号"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
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
              onChange={(event) => patchProfile({ location: event.target.value })}
              placeholder="例如：上海、北京"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      </section>

      <section className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-2">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-info via-accent to-info opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-light transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4 text-info-foreground" />
            </span>
            职业信息
          </h2>
          <div className="hidden w-48 md:block">
            <SectionProgress items={professionalItems} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="target_role"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              目标职位
            </label>
            <input
              id="target_role"
              type="text"
              value={profile.target_role}
              onChange={(event) =>
                patchProfile({ target_role: event.target.value })
              }
              placeholder="例如：前端工程师"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="salary_min"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                最低期望薪资
              </span>
            </label>
            <input
              id="salary_min"
              type="number"
              value={profile.salary_min || ""}
              onChange={(event) =>
                patchProfile({ salary_min: Number(event.target.value) })
              }
              placeholder="例如：25000"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="salary_max"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                最高期望薪资
              </span>
            </label>
            <input
              id="salary_max"
              type="number"
              value={profile.salary_max || ""}
              onChange={(event) =>
                patchProfile({ salary_max: Number(event.target.value) })
              }
              placeholder="例如：40000"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="bio"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              个人简介
            </label>
            <textarea
              id="bio"
              value={profile.bio}
              onChange={(event) => patchProfile({ bio: event.target.value })}
              placeholder="用几句话介绍你的核心经验、优势和求职方向"
              rows={3}
              className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="md:col-span-3">
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              技能标签
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="transition-colors hover:text-accent-dark"
                    aria-label={`删除技能 ${skill}`}
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
                onChange={(event) => onSkillInputChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="输入技能名称，按 Enter 添加"
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="button"
                onClick={addSkill}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                aria-label="添加技能"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-3">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-success to-accent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light transition-transform group-hover:scale-105">
              <Briefcase className="h-4 w-4 text-accent" />
            </span>
            工作经历
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden w-48 md:block">
              <SectionProgress items={experienceItems} />
            </div>
            <button
              type="button"
              onClick={() =>
                patchProfile({
                  experience: [...profile.experience, createExperience()],
                })
              }
              className="flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
            >
              <Plus className="h-4 w-4" />
              添加经历
            </button>
          </div>
        </div>

        {profile.experience.length === 0 ? (
          <div className="py-12 text-center">
            <Briefcase className="mx-auto mb-3 h-10 w-10 text-text-muted/40" />
            <p className="text-sm text-text-muted">
              暂无工作经历，点击上方按钮添加。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.experience.map((experience, index) => (
              <div
                key={experience.id}
                className="relative rounded-lg border border-border p-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <button
                  type="button"
                  onClick={() =>
                    patchProfile({
                      experience: profile.experience.filter(
                        (item) => item.id !== experience.id
                      ),
                    })
                  }
                  className="absolute right-3 top-3 text-text-muted transition-colors hover:text-error"
                  aria-label="删除工作经历"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      公司名称
                    </label>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "company",
                          event.target.value
                        )
                      }
                      placeholder="例如：字节跳动"
                      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      职位名称
                    </label>
                    <input
                      type="text"
                      value={experience.role}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "role",
                          event.target.value
                        )
                      }
                      placeholder="例如：前端工程师"
                      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      开始时间
                    </label>
                    <input
                      type="month"
                      value={experience.start_date}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "start_date",
                          event.target.value
                        )
                      }
                      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      结束时间
                    </label>
                    <input
                      type="month"
                      value={experience.end_date}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "end_date",
                          event.target.value
                        )
                      }
                      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <p className="mt-1 text-xs text-text-muted">
                      留空表示至今
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      工作描述
                    </label>
                    <textarea
                      value={experience.description}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "description",
                          event.target.value
                        )
                      }
                      placeholder="简要描述你的工作职责和成就"
                      rows={2}
                      className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-4">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-info via-success to-info opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-light transition-transform group-hover:scale-105">
              <GraduationCap className="h-4 w-4 text-info-foreground" />
            </span>
            教育经历
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden w-48 md:block">
              <SectionProgress items={educationItems} />
            </div>
            <button
              type="button"
              onClick={() =>
                patchProfile({
                  education: [...profile.education, createEducation()],
                })
              }
              className="flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
            >
              <Plus className="h-4 w-4" />
              添加教育
            </button>
          </div>
        </div>

        {profile.education.length === 0 ? (
          <div className="py-12 text-center">
            <GraduationCap className="mx-auto mb-3 h-10 w-10 text-text-muted/40" />
            <p className="text-sm text-text-muted">
              暂无教育经历，点击上方按钮添加。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.education.map((education, index) => (
              <div
                key={education.id}
                className="relative rounded-lg border border-border p-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <button
                  type="button"
                  onClick={() =>
                    patchProfile({
                      education: profile.education.filter(
                        (item) => item.id !== education.id
                      ),
                    })
                  }
                  className="absolute right-3 top-3 text-text-muted transition-colors hover:text-error"
                  aria-label="删除教育经历"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      学校名称
                    </label>
                    <input
                      type="text"
                      value={education.school}
                      onChange={(event) =>
                        updateEducation(
                          education.id,
                          "school",
                          event.target.value
                        )
                      }
                      placeholder="例如：复旦大学"
                      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      学位
                    </label>
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(event) =>
                        updateEducation(
                          education.id,
                          "degree",
                          event.target.value
                        )
                      }
                      placeholder="例如：本科、硕士"
                      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      专业
                    </label>
                    <input
                      type="text"
                      value={education.major}
                      onChange={(event) =>
                        updateEducation(
                          education.id,
                          "major",
                          event.target.value
                        )
                      }
                      placeholder="例如：计算机科学与技术"
                      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                        开始时间
                      </label>
                      <input
                        type="month"
                        value={education.start_date}
                        onChange={(event) =>
                          updateEducation(
                            education.id,
                            "start_date",
                            event.target.value
                          )
                        }
                        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                        结束时间
                      </label>
                      <input
                        type="month"
                        value={education.end_date}
                        onChange={(event) =>
                          updateEducation(
                            education.id,
                            "end_date",
                            event.target.value
                          )
                        }
                        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-5">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-success via-accent to-success opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-light transition-transform group-hover:scale-105">
              <Building2 className="h-4 w-4 text-success-foreground" />
            </span>
            求职偏好
          </h2>
          <div className="hidden w-48 md:block">
            <SectionProgress items={preferenceItems} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="work_type"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              工作类型
            </label>
            <select
              id="work_type"
              value={profile.job_preferences.work_type}
              onChange={(event) =>
                patchPreferences({ work_type: event.target.value })
              }
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">请选择</option>
              <option value="full_time">全职</option>
              <option value="contract">合同</option>
              <option value="internship">实习</option>
              <option value="freelance">自由职业</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="remote_preference"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              远程偏好
            </label>
            <select
              id="remote_preference"
              value={profile.job_preferences.remote_preference}
              onChange={(event) =>
                patchPreferences({ remote_preference: event.target.value })
              }
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">请选择</option>
              <option value="onsite">现场办公</option>
              <option value="hybrid">混合办公</option>
              <option value="remote">远程办公</option>
              <option value="flexible">都可以</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="preferred_locations"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              偏好城市
            </label>
            <input
              id="preferred_locations"
              type="text"
              value={profile.job_preferences.preferred_locations.join(", ")}
              onChange={(event) =>
                patchPreferences({
                  preferred_locations: parseListInput(event.target.value),
                })
              }
              placeholder="例如：上海, 杭州, 远程"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="mt-1 text-xs text-text-muted">用英文逗号分隔多项</p>
          </div>

          <div>
            <label
              htmlFor="industries"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              偏好行业
            </label>
            <input
              id="industries"
              type="text"
              value={profile.job_preferences.industries.join(", ")}
              onChange={(event) =>
                patchPreferences({
                  industries: parseListInput(event.target.value),
                })
              }
              placeholder="例如：AI, SaaS, 金融科技"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-shadow focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="mt-1 text-xs text-text-muted">用英文逗号分隔多项</p>
          </div>
        </div>
      </section>
    </div>
  );
}
