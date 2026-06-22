"use client"; // Must be a client component to use hooks

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if the current route starts with '/apply'
  const isApplyPage = pathname.startsWith("/apply");

  return (
    <div className="flex w-full min-h-screen">
      {/* Only render Sidebar if it is NOT the apply page */}
      {!isApplyPage && <Sidebar />}
      
      <main className={`flex-1 min-w-0 bg-zinc-50/40 overflow-y-auto ${isApplyPage ? 'p-0' : ''}`}>
        {children}
      </main>
    </div>
  );
}