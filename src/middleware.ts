import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole } from "@/types";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const AUTH_ONLY_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const ROLE_DASHBOARDS: Record<UserRole, string> = {
  super_admin: "/dashboard",
  school_admin: "/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
  parent: "/parent/dashboard",
  librarian: "/library",
};

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sms_access_token")?.value;
  const role = request.cookies.get("sms_user_role")?.value as UserRole | undefined;

  const isAuthRoute = AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  if (!token && !isPublicRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthRoute) {
    const dashboard = role && ROLE_DASHBOARDS[role] ? ROLE_DASHBOARDS[role] : "/dashboard";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  if (token && role) {
    if (role === "parent" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/parent/dashboard", request.url));
    }
    if (role === "librarian" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/library", request.url));
    }
    if (role === "teacher" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
    }
    if (role === "student" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js).*)",
  ],
};
