import type { UserRole } from "@/types";
import { SIDEBAR_NAV } from "@/constants";

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export function getNavItems(role: UserRole) {
  return SIDEBAR_NAV[role] || SIDEBAR_NAV.school_admin;
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (role === "super_admin") return true;

  const navItems = getNavItems(role);
  const allowedPaths = navItems.map((item) => item.href);

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/settings")) {
    return true;
  }

  if (role === "parent") {
    return pathname.startsWith("/parent");
  }

  return allowedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function getDefaultDashboard(role: UserRole): string {
  if (role === "parent") return "/parent/dashboard";
  return "/dashboard";
}

export function calculateGrade(marks: number, total: number): { grade: string; gpa: number } {
  const percentage = (marks / total) * 100;
  if (percentage >= 80) return { grade: "A+", gpa: 5.0 };
  if (percentage >= 70) return { grade: "A", gpa: 4.0 };
  if (percentage >= 60) return { grade: "A-", gpa: 3.5 };
  if (percentage >= 50) return { grade: "B", gpa: 3.0 };
  if (percentage >= 40) return { grade: "C", gpa: 2.0 };
  if (percentage >= 33) return { grade: "D", gpa: 1.0 };
  return { grade: "F", gpa: 0.0 };
}
