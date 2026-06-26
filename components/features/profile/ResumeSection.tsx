"use client";

import { useRef, useState } from "react";
import { Upload, FileText, Wand2, X } from "lucide-react";

interface ResumeSectionProps {
  resumeUrl: string;
  onResumeChange: (url: string, key: string) => void;
  onUpload: (file: File) => Promise<{ url: string; key: string } | null>;
  onGenerate?: () => void;
}

export function ResumeSection({
  resumeUrl,
  onResumeChange,
  onUpload,
  onGenerate,
}: ResumeSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("仅支持 PDF 格式");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("文件大小不能超过 10MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await onUpload(file);

      if (result) {
        onResumeChange(result.url, result.key);
      } else {
        setError("上传失败，请重试");
      }
    } catch {
      setError("上传失败，请重试");
    }

    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-4">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-info via-accent to-info opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-light transition-transform group-hover:scale-105">
            <FileText className="h-4 w-4 text-info-foreground" />
          </span>
          简历管理
        </h2>
        {onGenerate && (
          <button
            type="button"
            onClick={onGenerate}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition-all hover:brightness-110 hover:shadow-md hover:shadow-accent/20"
          >
            <Wand2 className="h-3.5 w-3.5" />
            AI 生成简历
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 rounded-md bg-error/10 border border-error/20 px-3 py-2 animate-fade-in">
          <p className="text-xs text-error">{error}</p>
        </div>
      )}

      {resumeUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-accent/30">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-light">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">已上传简历</p>
              <a
                href="/api/profile/resume/view"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                查看文件
              </a>
            </div>
            <button
              type="button"
              onClick={() => onResumeChange("", "")}
              className="p-1.5 text-text-muted hover:text-error transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 上传区域 — 替换 */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-accent bg-accent/[0.05]"
                : "border-border hover:border-accent/40 hover:bg-accent/[0.02]"
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                <span className="text-sm text-text-secondary">上传中...</span>
              </div>
            ) : (
              <p className="text-xs text-text-muted">拖放或点击替换简历</p>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-accent bg-accent/[0.05]"
              : "border-border hover:border-accent/40 hover:bg-accent/[0.02]"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              <p className="text-sm text-text-secondary">上传中...</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-secondary mb-1">拖放简历到此处，或点击上传</p>
              <p className="text-xs text-text-muted">支持 PDF 格式，最大 10MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
