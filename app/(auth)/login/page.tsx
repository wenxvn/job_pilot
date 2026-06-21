"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/insforge/auth-actions";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);
    setLoading(false);

    if (result.error) {
      if (result.emailNotVerified) {
        setError("你的账户需要邮箱验证。请先去邮箱完成验证后再登录。");
      } else {
        setError(result.error.message ?? "登录失败，请检查你的邮箱和密码。");
      }
    } else {
      await refreshAuth();
      router.push("/");
    }
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary">欢迎回来</h1>
        <p className="text-sm text-text-secondary mt-2">登录你的 JobPilot 账户</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 rounded-md px-3 py-2">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-accent-foreground rounded-md px-4 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "登录中…" : "登录"}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        还没有账户？{" "}
        <Link href="/signup" className="text-accent font-medium">
          注册
        </Link>
      </p>
    </div>
  );
}
