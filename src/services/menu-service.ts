import { api } from "./api-client";
import type { MenuItem, MenuResponse, UserRole } from "@/types";
import { toApiRole } from "@/utils/role-mapper";

/** Demo menu payloads — simulates Django `/api/menus/` when backend is offline */
export function getDemoMenus(role: UserRole): MenuItem[] {
  const menus: Record<UserRole, MenuItem[]> = {
    super_admin: [
      { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
      { label: "Schools", path: "/dashboard/schools", icon: "Building2" },
      { label: "Subscriptions", path: "/dashboard/subscriptions", icon: "CreditCard" },
      { label: "Analytics", path: "/dashboard/analytics", icon: "BarChart3" },
      { label: "Settings", path: "/dashboard/settings", icon: "Settings" },
    ],
    school_admin: [
      { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
      { label: "Students", path: "/dashboard/students", icon: "GraduationCap" },
      { label: "Teachers", path: "/dashboard/teachers", icon: "Users" },
      { label: "Classes", path: "/dashboard/classes", icon: "School" },
      { label: "Subjects", path: "/dashboard/subjects", icon: "BookOpen" },
      { label: "Attendance", path: "/dashboard/attendance", icon: "ClipboardCheck" },
      { label: "Exams", path: "/dashboard/exams", icon: "FileText" },
      { label: "Results", path: "/dashboard/results", icon: "Award" },
      { label: "Assignments", path: "/dashboard/assignments", icon: "PenLine" },
      { label: "Fees", path: "/dashboard/fees", icon: "Wallet" },
      { label: "Library", path: "/dashboard/library", icon: "Library" },
      { label: "Transport", path: "/dashboard/transport", icon: "Bus" },
      { label: "Timetable", path: "/dashboard/timetable", icon: "Calendar" },
      { label: "Notices", path: "/dashboard/notices", icon: "Bell" },
      { label: "Settings", path: "/dashboard/settings", icon: "Settings" },
    ],
    teacher: [
      { label: "Dashboard", path: "/teacher/dashboard", icon: "LayoutDashboard" },
      { label: "Profile", path: "/teacher/dashboard/profile", icon: "User" },
      { label: "My Classes", path: "/teacher/dashboard/classes", icon: "BookOpen" },
      { label: "Routine", path: "/teacher/dashboard/timetable", icon: "Calendar" },
      { label: "Attendance", path: "/teacher/dashboard/attendance", icon: "ClipboardCheck" },
      { label: "Homework", path: "/teacher/dashboard/homework", icon: "PenLine" },
      { label: "Lesson Plan", path: "/teacher/dashboard/lesson-plan", icon: "FileText" },
      { label: "Exams & Results", path: "/teacher/dashboard/results", icon: "Award" },
      { label: "Students", path: "/teacher/dashboard/students", icon: "Users" },
      { label: "Study Materials", path: "/teacher/dashboard/materials", icon: "Folder" },
      { label: "Messages", path: "/teacher/dashboard/messages", icon: "MessageSquare" },
      { label: "Notices", path: "/teacher/dashboard/notices", icon: "Bell" },
      { label: "Reports", path: "/teacher/dashboard/reports", icon: "BarChart" },
      { label: "Settings", path: "/teacher/dashboard/settings", icon: "Settings" },
      { label: "Performance", path: "/teacher/dashboard/performance", icon: "Performance" },
    ],
    student: [
      { label: "Dashboard", path: "/student/dashboard", icon: "LayoutDashboard" },
      { label: "Homework", path: "/student/dashboard/homework", icon: "BookOpen" },
      { label: "Attendance", path: "/student/dashboard/attendance", icon: "ClipboardCheck" },
      { label: "Exams & Results", path: "/student/dashboard/results", icon: "Award" },
      { label: "Library", path: "/student/dashboard/library", icon: "Library" },
      { label: "Fees", path: "/student/dashboard/fees", icon: "Wallet" },
      { label: "Transport", path: "/student/dashboard/transport", icon: "Bus" },
      { label: "Hostel", path: "/student/dashboard/hostel", icon: "Building" },
      { label: "Calendar", path: "/student/dashboard/timetable", icon: "Calendar" },
      { label: "Events", path: "/student/dashboard/events", icon: "Star" },
      { label: "Performance", path: "/student/dashboard/performance", icon: "TrendingUp" },
    ],
    parent: [
      { label: "Dashboard", path: "/parent/dashboard", icon: "LayoutDashboard" },
      { label: "Attendance", path: "/parent/dashboard/attendance", icon: "ClipboardCheck" },
      { label: "Results", path: "/parent/dashboard/results", icon: "Award" },
      { label: "Fees", path: "/parent/dashboard/fees", icon: "Wallet" },
      { label: "Homework", path: "/parent/dashboard/homework", icon: "PenLine" },
      { label: "Events", path: "/parent/dashboard/events", icon: "Calendar" },
      { label: "Transport", path: "/parent/dashboard/transport", icon: "Bus" },
      { label: "Notifications", path: "/parent/dashboard/notifications", icon: "Bell" },
      { label: "Syllabus", path: "/parent/dashboard/syllabus", icon: "FaRegFileAlt" },
      { label: "Hostel Rooms", path: "/parent/dashboard/hostel", icon: "FaRegFileAlt" },
    ],
    librarian: [
      { label: "Dashboard", path: "/library", icon: "LayoutDashboard" },
      { label: "Books", path: "/library/books", icon: "BookOpen" },
      { label: "Issue Books", path: "/library/issue-books", icon: "BookMarked" },
      { label: "Return Books", path: "/library/return-books", icon: "RotateCcw" },
      { label: "Members", path: "/library/members", icon: "Users" },
      { label: "Fines", path: "/library/fines", icon: "Wallet" },
      { label: "Report", path: "/library/report", icon: "Wallet" },
    ],
  };

  return menus[role] ?? menus.school_admin;
}

export function getDemoMenuResponse(role: UserRole): MenuResponse {
  return { role: toApiRole(role), menus: getDemoMenus(role) };
}

export const menuService = {
  getMenus: () => api.get<MenuResponse>("/menus/").then((r) => r.data),
};
