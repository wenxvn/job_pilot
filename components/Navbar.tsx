"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";
import posthog from "posthog-js";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/insforge/auth-actions";

const NAV_ITEMS = [
  { href: "/jobs", label: "职位" },
  { href: "/resumes", label: "简历" },
  { href: "/applications", label: "投递记录" },
];

export function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-lg font-bold text-accent">
          JobPilot
        </Link>
        {user && (
          <nav className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => posthog.capture("nav_click", { destination: item.href })}
                  className={`text-sm font-medium ${
                    isActive ? "text-accent" : "text-text-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="h-8 w-8 rounded-full bg-surface-secondary animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className={`flex items-center gap-2 text-sm font-medium ${
                pathname === "/profile" ? "text-accent" : "text-text-secondary"
              }`}
            >
              <User className="h-4 w-4" />
              {user.name ?? user.email}
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                onClick={() => posthog.reset()}
                className="p-2 text-text-muted hover:text-text-secondary"
                title="退出登录"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-text-secondary"
            >
              登录
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-accent text-accent-foreground rounded-md px-4 py-2"
            >
              免费注册
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
