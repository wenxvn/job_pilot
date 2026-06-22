import { AuthProvider } from "@/hooks/useAuth";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

export const metadata = {
  title: "JobPilot — AI 智能求职与匹配",
  description: "自动化职位发现、AI 匹配评分、简历定制，一站式技术求职工具。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-background text-text-primary font-sans antialiased">
        <PostHogProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
