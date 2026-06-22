"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { insforge } from "@/lib/insforge/client";

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, refreshAuth: async () => {} });

/**
 * 通过本地 /api/auth/refresh 路由获取当前用户。
 *
 * 浏览器客户端的 getCurrentUser() 内部调用 refreshSession()，
 * 会将请求发送到远程 InsForge 后端（跨域），无法携带 httpOnly cookie。
 * 本地路由可以读取 cookie 并正确刷新 session。
 */
async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const body = await res.json();
    if (body?.accessToken) {
      insforge.setAccessToken(body.accessToken);
    }
    return body?.user ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    setLoading(true);
    const u = await fetchCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
