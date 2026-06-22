"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // 1. Import signOut
import { LayoutDashboard, Briefcase, CalendarDays, Settings, LogOut } from "lucide-react"; // 2. Import LogOut icon

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Job Openings", href: "/jobs", icon: Briefcase },
    { name: "Interviews", href: "/interviews", icon: CalendarDays },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight text-[#9E3E1A]">ROVE Hire</span>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mt-0.5">RECRUITMENT TOOL</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all relative group ${isActive
                  ? "text-[#9E3E1A] bg-[#9E3E1A]/5 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
            >
              {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#9E3E1A] rounded-r" />}
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#9E3E1A]" : "text-zinc-400 group-hover:text-zinc-500"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. Bottom Profile Spec Block with Logout Button */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-md overflow-hidden bg-zinc-200 shrink-0">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop')` }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-800 truncate">Sarah Jenkins</span>
              <span className="text-[10px] text-zinc-500 truncate">Senior Recruiter</span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 text-zinc-400 hover:text-[#9E3E1A] hover:bg-red-50 rounded-md transition-colors"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}