import { Navbar } from "@/components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}
