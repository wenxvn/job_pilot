import type { MissingProfileField, ProfileCompletion, ProfileInput } from "@/types/profile";

const REQUIRED_FIELD_COUNT = 10;

export function calculateProfileCompletion(profile: ProfileInput): ProfileCompletion {
  const missingFields: MissingProfileField[] = [];

  if (!profile.full_name.trim()) {
    missingFields.push({ key: "full_name", label: "姓名", section: "个人信息" });
  }
  if (!profile.email.trim()) {
    missingFields.push({ key: "email", label: "邮箱", section: "个人信息" });
  }
  if (!profile.phone.trim()) {
    missingFields.push({ key: "phone", label: "手机号", section: "个人信息" });
  }
  if (!profile.location.trim()) {
    missingFields.push({ key: "location", label: "所在地", section: "个人信息" });
  }
  if (!profile.target_role.trim()) {
    missingFields.push({ key: "target_role", label: "目标职位", section: "专业信息" });
  }
  if (!profile.bio.trim()) {
    missingFields.push({ key: "bio", label: "个人简介", section: "专业信息" });
  }
  if (profile.skills.length < 3) {
    missingFields.push({ key: "skills", label: "技能标签（至少3项）", section: "专业信息" });
  }
  if (profile.experience.length === 0) {
    missingFields.push({ key: "experience", label: "工作经历", section: "工作经历" });
  }
  if (profile.education.length === 0) {
    missingFields.push({ key: "education", label: "教育经历", section: "教育经历" });
  }
  if (!profile.resume_file_url) {
    missingFields.push({ key: "resume", label: "上传简历", section: "简历" });
  }

  const completedFieldCount = REQUIRED_FIELD_COUNT - missingFields.length;
  const completionPercentage = Math.round((completedFieldCount / REQUIRED_FIELD_COUNT) * 100);

  return {
    isComplete: missingFields.length === 0,
    completionPercentage,
    missingFields,
  };
}
