"use client";

import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="dashboard-theme dark min-h-screen">
      <Sidebar />
      <div
        className={cn(
          "dashboard-bg relative min-h-screen transition-all duration-300",
          sidebarCollapsed ? "ml-[72px]" : "ml-64"
        )}
      >
        {/* Subtle grid overlay */}
        <div className="dashboard-grid-pattern pointer-events-none fixed inset-0 ml-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
