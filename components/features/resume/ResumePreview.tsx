"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import posthog from "posthog-js";

interface ResumePreviewProps {
  fullName: string;
}

export function ResumePreview({ fullName }: ResumePreviewProps) {
  const [previewVersion, setPreviewVersion] = useState(() => Date.now());
  const previewUrl = `/api/resumes/pdf?disposition=inline&v=${previewVersion}`;

  function handleRefresh() {
    setPreviewVersion(Date.now());
    posthog.capture("resume_preview_refreshed");
  }

  function handleDownload() {
    posthog.capture("resume_downloaded", { resume_type: "base" });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">PDF 简历预览</h2>
          <p className="mt-1 text-xs text-text-muted">
            当前预览来自已保存的个人资料
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            <RefreshCw className="h-4 w-4" />
            刷新预览
          </button>
          <a
            href="/api/resumes/pdf?disposition=attachment"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-all hover:brightness-110 hover:shadow-md hover:shadow-accent/20"
          >
            <Download className="h-4 w-4" />
            下载 PDF
          </a>
        </div>
      </div>
      <iframe
        key={previewVersion}
        src={previewUrl}
        title={`${fullName || "个人"}的 PDF 简历预览`}
        className="h-[75vh] min-h-[640px] w-full bg-surface-secondary"
      />
    </div>
  );
}
