"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Award,
  PenLine,
  Wallet,
  Library,
  Bus,
  Calendar,
  Bell,
  Settings,
  Building2,
  CreditCard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  RotateCcw,
  Building,
  Star,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore, useUIStore } from "@/store";
import { useMenu } from "@/hooks/use-menu";
import { getDefaultDashboard } from "@/utils/rbac";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Award,
  PenLine,
  Wallet,
  Library,
  Bus,
  Calendar,
  Bell,
  Settings,
  Building2,
  CreditCard,
  BarChart3,
  BookMarked,
  RotateCcw,
  Building,
  Star,
  TrendingUp,
};

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const { items: navItems, isLoading } = useMenu();

  const homeHref = user ? getDefaultDashboard(user.role) : "/dashboard";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06] bg-[#050505] transition-all duration-300",
        sidebarCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b border-white/[0.06] px-4">
        <Link href={homeHref} className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/25">
            <School className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <span className="block truncate text-sm font-bold text-white">SMS</span>
              <span className="block truncate text-[10px] text-zinc-500">School Portal</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {!sidebarCollapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Menu
          </p>
        )}
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className={cn("rounded-xl", sidebarCollapsed ? "mx-1 h-10" : "mx-0 h-10")} />
            ))
          : navItems.map((item) => {
              const Icon = iconMap[item.icon || "LayoutDashboard"] || LayoutDashboard;
              const isActive =
                pathname === item.path ||
                (item.path !== "/dashboard" &&
                  item.path !== "/parent/dashboard" &&
                  item.path !== "/library" &&
                  pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-500/15 text-blue-400 shadow-inner shadow-blue-500/5"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
                  )}
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        {!sidebarCollapsed && user && (
          <Link
            href={
              user.role === "parent"
                ? "/parent/dashboard"
                : user.role === "librarian"
                  ? "/library"
                  : "/dashboard/settings?tab=profile"
            }
            className="mb-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">
              {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-200">{user.fullName}</p>
              <p className="truncate text-[10px] capitalize text-zinc-500">{user.role.replace("_", " ")}</p>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
          onClick={toggleSidebarCollapsed}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
