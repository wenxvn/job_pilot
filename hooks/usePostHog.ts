"use client";

import { usePostHog as usePH } from "posthog-js/react";

export function usePostHog() {
  const posthog = usePH();

  /** 识别已登录用户 */
  function identify(userId: string, properties?: Record<string, unknown>) {
    posthog.identify(userId, properties);
  }

  /** 登出时重置 */
  function reset() {
    posthog.reset();
  }

  /** 追踪自定义事件 */
  function track(event: string, properties?: Record<string, unknown>) {
    posthog.capture(event, properties);
  }

  return { identify, reset, track };
}
