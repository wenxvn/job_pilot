"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/insforge/auth-actions";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signUp(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "注册失败，请重试。");
    } else if (result.requireEmailVerification) {
      setNeedsVerification(true);
    } else {
      await refreshAuth();
      router.push("/");
    }
  }

  if (needsVerification) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">请验证邮箱</h1>
        <p className="text-sm text-text-secondary mb-6">
          我们已向你的邮箱发送了验证链接，点击链接激活账户后即可登录。
        </p>
        <Link
          href="/login"
          className="inline-block bg-accent text-accent-foreground rounded-md px-6 py-2.5 text-sm font-medium"
        >
          前往登录
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary">创建账户</h1>
        <p className="text-sm text-text-secondary mt-2">开始更聪明的求职之旅</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
            姓名
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="张三"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>

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
            minLength={6}
            placeholder="••••••••"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
          <p className="text-xs text-text-muted mt-1">至少 6 个字符</p>
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
          {loading ? "创建中…" : "创建账户"}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        已有账户？{" "}
        <Link href="/login" className="text-accent font-medium">
          登录
        </Link>
      </p>
    </div>
  );
}
