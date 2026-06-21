import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 bg-zinc-50/40 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}