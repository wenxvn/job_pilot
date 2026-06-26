"use client";

import { Link as LinkIcon, ExternalLink, CheckCircle2 } from "lucide-react";

interface ConnectedAccountsProps {
  linkedinUrl: string;
  onLinkedInUrlChange: (url: string) => void;
}

export function ConnectedAccounts({ linkedinUrl, onLinkedInUrlChange }: ConnectedAccountsProps) {
  const isConnected = !!linkedinUrl?.trim();

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-2">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-info via-accent to-info opacity-0 transition-opacity group-hover:opacity-100" />

      <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-light transition-transform group-hover:scale-105">
          <LinkIcon className="h-4 w-4 text-info-foreground" />
        </span>
        关联账户
      </h2>

      {/* LinkedIn 行 */}
      <div className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/30">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info-light">
          <LinkIcon className="h-5 w-5 text-info-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-text-primary">LinkedIn</span>
            {isConnected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2 py-0.5 text-xs font-medium text-success-foreground">
                <CheckCircle2 className="h-3 w-3" />
                已关联
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted">
            {isConnected ? "用于职位搜索和资料同步" : "关联 LinkedIn 获取更多职位推荐"}
          </p>
        </div>

        {isConnected ? (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-text-primary hover:bg-surface-secondary transition-colors"
          >
            查看
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
      </div>

      {/* LinkedIn URL 输入 */}
      <div className="mt-3">
        <input
          type="url"
          value={linkedinUrl}
          onChange={(e) => onLinkedInUrlChange(e.target.value)}
          placeholder="https://linkedin.com/in/your-profile"
          className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
        />
      </div>
    </div>
  );
}
