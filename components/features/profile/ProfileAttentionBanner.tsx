"use client";

import { useMemo } from "react";
import { AlertCircle, X } from "lucide-react";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import type { Profile } from "@/types/profile";

interface ProfileAttentionBannerProps {
  profile: Profile;
  onDismiss?: () => void;
}

function CompletionRing({ percent }: { percent: number }) {
  const size = 72;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const getColor = (p: number) => {
    if (p >= 80) return "var(--color-success)";
    if (p >= 50) return "var(--color-info)";
    if (p >= 25) return "var(--color-warning)";
    return "var(--color-accent)";
  };

  return (
    <div className="relative shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-secondary)"
          strokeWidth={strokeWidth}
        />
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
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold text-text-primary">{percent}%</span>
      </div>
    </div>
  );
}

export function ProfileAttentionBanner({ profile, onDismiss }: ProfileAttentionBannerProps) {
  const { percent, missingFields } = useMemo(() => {
    const completion = calculateProfileCompletion(profile);

    return {
      percent: completion.completionPercentage,
      missingFields: completion.missingFields,
    };
  }, [profile]);

  if (percent === 100) return null;

  return (
    <div className="animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm">
      {/* 装饰光晕 */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-accent/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-warning/[0.05] blur-2xl" />

      <div className="relative flex items-center gap-5">
        {/* 完成度环 */}
        <CompletionRing percent={percent} />

        {/* 文字内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-warning shrink-0" />
            <h3 className="text-sm font-semibold text-text-primary">
              完善你的个人资料
            </h3>
            <span className="inline-flex items-center rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
              {100 - percent}% 未完成
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            完善资料可以帮助 AI 更精准地为你匹配职位
          </p>

          {/* 缺失字段标签 */}
          <div className="flex flex-wrap gap-1.5">
            {missingFields.slice(0, 6).map((field, idx) => (
              <span
                key={field.key}
                className="inline-flex items-center gap-1 rounded-full bg-surface-secondary border border-border px-2.5 py-0.5 text-xs font-medium text-text-secondary animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <span className="text-text-muted">{field.section}</span>
                {field.label}
              </span>
            ))}
            {missingFields.length > 6 && (
              <span className="inline-flex items-center rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-text-muted">
                +{missingFields.length - 6} 项
              </span>
            )}
          </div>
        </div>

        {/* 关闭按钮 */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-1 right-1 p-1.5 text-text-muted hover:text-text-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
