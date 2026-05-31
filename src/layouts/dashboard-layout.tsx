"use client";

import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn("transition-all duration-300", sidebarCollapsed ? "ml-[72px]" : "ml-64")}
      >
        <Header />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
