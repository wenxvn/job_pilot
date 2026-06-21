import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
