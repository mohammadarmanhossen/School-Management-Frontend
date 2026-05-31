"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { getDefaultDashboard } from "@/utils/rbac";
import type { UserRole } from "@/types";

export function useAuth(requiredRoles?: UserRole[]) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      router.push(getDefaultDashboard(user.role));
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router]);

  return { user, isAuthenticated, isLoading };
}

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
