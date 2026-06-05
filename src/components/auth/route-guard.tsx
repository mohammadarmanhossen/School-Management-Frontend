"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { useMenu } from "@/hooks/use-menu";
import { canAccessRoute, getDefaultDashboard } from "@/utils/rbac";
import { Skeleton } from "@/components/ui/skeleton";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: import("@/types").UserRole[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { items: menuItems, isLoading: menuLoading } = useMenu();

  useEffect(() => {
    if (isLoading || menuLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(getDefaultDashboard(user.role));
      return;
    }

    if (!canAccessRoute(user.role, pathname, menuItems)) {
      router.replace(getDefaultDashboard(user.role));
    }
  }, [
    isAuthenticated,
    isLoading,
    menuLoading,
    user,
    pathname,
    menuItems,
    allowedRoles,
    router,
  ]);

  if (isLoading || menuLoading || !user) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return <>{children}</>;
}
