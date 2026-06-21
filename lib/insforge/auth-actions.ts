"use server";

import { cookies } from "next/headers";
import { createAuthActions } from "@insforge/sdk/ssr";

export async function signIn(formData: FormData) {
  const auth = createAuthActions({ cookies: await cookies() });
  const { data, error } = await auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });

  return {
    user: data?.user ?? null,
    emailNotVerified: error?.statusCode === 403,
    error,
  };
}

export async function signUp(formData: FormData) {
  const auth = createAuthActions({ cookies: await cookies() });
  const { data, error } = await auth.signUp({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    name: String(formData.get("name")),
    redirectTo: new URL("/login", process.env.NEXT_PUBLIC_APP_URL).toString(),
  });

  return { user: data?.user ?? null, requireEmailVerification: data?.requireEmailVerification ?? false, error };
}

export async function signOut(): Promise<void> {
  const auth = createAuthActions({ cookies: await cookies() });
  await auth.signOut();
}
