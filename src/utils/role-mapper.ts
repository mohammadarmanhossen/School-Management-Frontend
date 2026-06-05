import type { ApiRole, UserRole } from "@/types";

const API_TO_APP: Record<ApiRole, UserRole> = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "school_admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
  LIBRARIAN: "librarian",
};

const APP_TO_API: Record<UserRole, ApiRole> = {
  super_admin: "SUPER_ADMIN",
  school_admin: "ADMIN",
  teacher: "TEACHER",
  student: "STUDENT",
  parent: "PARENT",
  librarian: "LIBRARIAN",
};

export function normalizeRole(role: ApiRole | UserRole): UserRole {
  if (role in API_TO_APP) return API_TO_APP[role as ApiRole];
  return role as UserRole;
}

export function toApiRole(role: UserRole): ApiRole {
  return APP_TO_API[role];
}
