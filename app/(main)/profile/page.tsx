"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { ConnectedAccounts } from "@/components/features/profile/ConnectedAccounts";
import { ProfileAttentionBanner } from "@/components/features/profile/ProfileAttentionBanner";
import { ProfileForm } from "@/components/features/profile/ProfileForm";
import { ResumeSection } from "@/components/features/profile/ResumeSection";
import {
  extractResumeProfile,
  getProfile,
  upsertProfile,
  uploadResume,
} from "@/actions/profile";
import { useAuth } from "@/hooks/useAuth";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import type { Profile, ProfileInput, ResumeProfileExtract } from "@/types/profile";

const EMPTY_PROFILE: ProfileInput = {
  full_name: "",
  email: "",
  phone: "",
  bio: "",
  target_role: "",
  salary_min: 0,
  salary_max: 0,
  location: "",
  linkedin_url: "",
  skills: [],
  experience: [],
  education: [],
  job_preferences: {
    work_type: "",
    remote_preference: "",
    preferred_locations: [],
    industries: [],
  },
  resume_file_url: "",
  resume_file_key: "",
};

function toProfileInput(profile: Profile | null): ProfileInput {
  if (!profile) return EMPTY_PROFILE;

  return {
    full_name: profile.full_name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
    target_role: profile.target_role ?? "",
    salary_min: profile.salary_min ?? 0,
    salary_max: profile.salary_max ?? 0,
    location: profile.location ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    skills: profile.skills ?? [],
    experience: profile.experience ?? [],
    education: profile.education ?? [],
    job_preferences: {
      work_type: profile.job_preferences?.work_type ?? "",
      remote_preference: profile.job_preferences?.remote_preference ?? "",
      preferred_locations:
        profile.job_preferences?.preferred_locations ?? [],
      industries: profile.job_preferences?.industries ?? [],
    },
    resume_file_url: profile.resume_file_url ?? "",
    resume_file_key: profile.resume_file_key ?? "",
  };
}

function toPreviewProfile(profile: ProfileInput): Profile {
  const completion = calculateProfileCompletion(profile);

  return {
    id: "preview",
    user_id: "preview",
    ...profile,
    is_complete: completion.isComplete,
    completion_percentage: completion.completionPercentage,
    missing_fields: completion.missingFields,
    created_at: "",
    updated_at: "",
  };
}

function applyExtractedProfile(
  current: ProfileInput,
  extracted: ResumeProfileExtract
): ProfileInput {
  return {
    ...current,
    full_name: extracted.full_name || current.full_name,
    phone: extracted.phone || current.phone,
    bio: extracted.bio || current.bio,
    target_role: extracted.target_role || current.target_role,
    location: extracted.location || current.location,
    skills: extracted.skills?.length ? extracted.skills : current.skills,
    experience: extracted.experience?.length
      ? extracted.experience
      : current.experience,
    education: extracted.education?.length
      ? extracted.education
      : current.education,
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileInput>(EMPTY_PROFILE);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const { profile: data, error: err } = await getProfile();

    if (err) {
      setError(err);
    } else {
      setProfile(toProfileInput(data));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (user?.email && !profile.email) {
      setProfile((current) => ({ ...current, email: user.email ?? "" }));
    }
  }, [profile.email, user]);

  async function handleResumeUpload(
    file: File
  ): Promise<{ url: string; key: string } | null> {
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadResume(formData);

    if (result) {
      posthog.capture("resume_uploaded", {
        file_type: file.type,
        file_size: file.size,
      });
    }

    return result;
  }

  function handleGenerateResume() {
    posthog.capture("resume_generate_clicked", { source: "profile" });
    router.push("/resumes");
  }

  async function handleExtractResumeProfile() {
    const startedAt = performance.now();
    setExtracting(true);
    setSaved(false);
    setError(null);
    setInfo(null);

    const {
      profile: extractedProfile,
      error: err,
      source,
    } = await extractResumeProfile();
    setExtracting(false);

    if (err || !extractedProfile) {
      posthog.capture("resume_profile_extract_failed", {
        reason: err ?? "empty_result",
        duration_ms: Math.round(performance.now() - startedAt),
      });
      setError(err ?? "AI 识别失败，请稍后重试");
      return;
    }

    setProfile((current) => applyExtractedProfile(current, extractedProfile));
    setBannerVisible(true);
    setInfo("已读取 PDF 简历并填充资料，请检查后保存。");
    posthog.capture("resume_profile_extracted", {
      skills_count: extractedProfile.skills?.length ?? 0,
      experience_count: extractedProfile.experience?.length ?? 0,
      education_count: extractedProfile.education?.length ?? 0,
      source: source ?? "unknown",
      duration_ms: Math.round(performance.now() - startedAt),
    });
    setTimeout(() => setInfo(null), 5000);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    setInfo(null);

    const { error: err } = await upsertProfile(profile);
    setSaving(false);

    if (err) {
      setError(err);
      return;
    }

    setSaved(true);
    setBannerVisible(true);
    posthog.capture("profile_saved", {
      skills_count: profile.skills.length,
      experience_count: profile.experience.length,
      education_count: profile.education.length,
      has_resume: !!profile.resume_file_url,
    });
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 rounded-full bg-surface-secondary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-info/[0.06] blur-2xl" />

        <div className="relative">
          <div className="animate-fade-in-up stagger-1 mb-3 inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium text-accent">
              个人资料中心
            </span>
          </div>
          <h1 className="animate-fade-in-up stagger-2 text-2xl font-bold text-text-primary sm:text-3xl">
            你好，{profile.full_name || "求职者"}
          </h1>
          <p className="animate-fade-in-up stagger-3 mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
            完整的个人资料会成为职位匹配、简历生成和申请跟踪的基础。
          </p>
        </div>
      </div>

      {bannerVisible && (
        <ProfileAttentionBanner
          profile={toPreviewProfile(profile)}
          onDismiss={() => setBannerVisible(false)}
        />
      )}

      {error && (
        <div className="rounded-md border border-error/20 bg-error/10 px-4 py-3 animate-fade-in">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {info && (
        <div className="rounded-md border border-info/20 bg-info-light px-4 py-3 animate-fade-in">
          <p className="text-sm text-info-foreground">{info}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <ProfileForm
              profile={profile}
              skillInput={skillInput}
              onProfileChange={setProfile}
              onSkillInputChange={setSkillInput}
            />
          </div>

          <aside className="space-y-6">
            <ConnectedAccounts
              linkedinUrl={profile.linkedin_url}
              onLinkedInUrlChange={(linkedinUrl) =>
                setProfile((current) => ({
                  ...current,
                  linkedin_url: linkedinUrl,
                }))
              }
            />
            <ResumeSection
              resumeUrl={profile.resume_file_url}
              onUpload={handleResumeUpload}
              onExtract={handleExtractResumeProfile}
              onGenerate={handleGenerateResume}
              extracting={extracting}
              onResumeChange={(url, key) =>
                setProfile((current) => ({
                  ...current,
                  resume_file_url: url,
                  resume_file_key: key,
                }))
              }
            />
          </aside>
        </div>

        <div className="animate-fade-in-up stagger-6 flex items-center justify-between rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-3">
            {saved && (
              <span className="rounded-full bg-success-light px-3 py-1 text-sm text-success-foreground animate-fade-in">
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
            className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-all hover:brightness-110 hover:shadow-md hover:shadow-accent/20 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存资料"}
          </button>
        </div>
      </form>
    </div>
  );
}
