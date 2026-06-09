import type { MenuItem, UserRole } from "@/types";

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export function getDefaultDashboard(role: UserRole): string {
  switch (role) {
    case "parent":
      return "/parent/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "student":
      return "/student/dashboard";
    case "librarian":
      return "/library";

    default:
      return "/dashboard";
  }
}

export function getRoleRoutePrefix(role: UserRole): string {
  switch (role) {
    case "parent":
      return "/parent";
    case "student":
      return "/student";
    case "teacher":
      return "/teacher";
    case "librarian":
      return "/library";
    default:
      return "/dashboard";
  }
}

export function canAccessRoute(
  role: UserRole,
  pathname: string,
  menuItems: MenuItem[]
): boolean {
  if (role === "school_admin") return true;

  const allowedPaths = menuItems.map((item) => item.path);
  const defaultDashboard = getDefaultDashboard(role);

  if (pathname === defaultDashboard) return true;

  if (role === "parent") {
    return pathname.startsWith("/parent");
  }

  if (role === "student") {
    return pathname.startsWith("/student");
  }

  if (role === "teacher") {
    return pathname.startsWith("/teacher");
  }

  if (role === "librarian") {
    return pathname.startsWith("/library");
  }

  return allowedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
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
