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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore, useUIStore } from "@/store";
import { getNavItems } from "@/utils/rbac";
import { APP_NAME } from "@/constants";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  BookOpen,
  ClipboardCheck,
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
};

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();

  const navItems = user ? getNavItems(user.role) : [];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        sidebarCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <School className="h-5 w-5" />
          </div>
          {!sidebarCollapsed && (
            <span className="truncate text-sm font-bold">{APP_NAME}</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              title={sidebarCollapsed ? item.title : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
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
