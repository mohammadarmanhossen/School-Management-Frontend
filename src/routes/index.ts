import type { UserRole } from "@/types";

export const ROLE_ROUTE_PREFIX: Record<UserRole, string> = {
  super_admin: "/dashboard",
  school_admin: "/dashboard",
  teacher: "/dashboard",
  student: "/dashboard",
  parent: "/parent",
  librarian: "/library",
};

export const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
  super_admin: ["/dashboard"],
  school_admin: ["/dashboard"],
  teacher: ["/dashboard"],
  student: ["/dashboard"],
  parent: ["/parent"],
  librarian: ["/library"],
};

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/change-password",
];
