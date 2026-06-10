import type { UserRole } from "@/types";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "School Management System";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ROLES: Record<UserRole, { label: string; labelBn: string }> = {

  school_admin: { label: "School Admin", labelBn: "স্কুল অ্যাডমিন" },
  teacher: { label: "Teacher", labelBn: "শিক্ষক" },
  student: { label: "Student", labelBn: "শিক্ষার্থী" },
  parent: { label: "Parent", labelBn: "অভিভাবক" },
  librarian: { label: "Librarian", labelBn: "গ্রন্থাগারিক" },
};

export const ATTENDANCE_STATUS = {
  present: { label: "Present", color: "bg-green-500", textColor: "text-green-700" },
  absent: { label: "Absent", color: "bg-red-500", textColor: "text-red-700" },
  late: { label: "Late", color: "bg-yellow-500", textColor: "text-yellow-700" },
  leave: { label: "Leave", color: "bg-blue-500", textColor: "text-blue-700" },
  half_day: { label: "Half Day", color: "bg-orange-500", textColor: "text-orange-700" },
  excused: { label: "Excused", color: "bg-purple-500", textColor: "text-purple-700" },
} as const;

export const EXAM_TYPES = {
  class_test: "Class Test",
  mid_term: "Mid Term",
  final_exam: "Final Exam",
  practical: "Practical Exam",
} as const;

export const BD_GRADING = {
  "A+": 5.0,
  A: 4.0,
  "A-": 3.5,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
} as const;

export const PAYMENT_METHODS = [
  { id: "bkash", label: "bKash", color: "bg-pink-500" },
  { id: "nagad", label: "Nagad", color: "bg-orange-500" },
  { id: "rocket", label: "Rocket", color: "bg-purple-500" },
  { id: "sslcommerz", label: "SSLCommerz", color: "bg-blue-500" },
  { id: "bank_transfer", label: "Bank Transfer", color: "bg-gray-500" },
] as const;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export const SIDEBAR_NAV = {
  school_admin: [
    { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "Admissions", href: "/dashboard/admissions", icon: "ClipboardList" },
    { title: "Students", href: "/dashboard/students", icon: "GraduationCap" },
    { title: "Teachers", href: "/dashboard/teachers", icon: "Users" },
    { title: "Classes", href: "/dashboard/classes", icon: "School" },
    { title: "Subjects", href: "/dashboard/subjects", icon: "BookOpen" },
    { title: "Attendance", href: "/dashboard/attendance", icon: "ClipboardCheck" },
    { title: "Exams", href: "/dashboard/exams", icon: "FileText" },
    { title: "Results", href: "/dashboard/results", icon: "Award" },
    { title: "Assignments", href: "/dashboard/assignments", icon: "PenLine" },
    { title: "Fees", href: "/dashboard/fees", icon: "Wallet" },
    { title: "Library", href: "/dashboard/library", icon: "Library" },
    { title: "Transport", href: "/dashboard/transport", icon: "Bus" },
    { title: "Timetable", href: "/dashboard/timetable", icon: "Calendar" },
    { title: "Notices", href: "/dashboard/notices", icon: "Bell" },
    { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  teacher: [
    { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "Attendance", href: "/dashboard/attendance", icon: "ClipboardCheck" },
    { title: "Assignments", href: "/dashboard/assignments", icon: "PenLine" },
    { title: "Exams", href: "/dashboard/exams", icon: "FileText" },
    { title: "Results", href: "/dashboard/results", icon: "Award" },
    { title: "Timetable", href: "/dashboard/timetable", icon: "Calendar" },
    { title: "Notices", href: "/dashboard/notices", icon: "Bell" },
  ],
  student: [
    { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "Attendance", href: "/dashboard/attendance", icon: "ClipboardCheck" },
    { title: "Results", href: "/dashboard/results", icon: "Award" },
    { title: "Assignments", href: "/dashboard/assignments", icon: "PenLine" },
    { title: "Timetable", href: "/dashboard/timetable", icon: "Calendar" },
    { title: "Notices", href: "/dashboard/notices", icon: "Bell" },
  ],
  parent: [
    { title: "Dashboard", href: "/parent/dashboard", icon: "LayoutDashboard" },
    { title: "Attendance", href: "/parent/dashboard/attendance", icon: "ClipboardCheck" },
    { title: "Results", href: "/parent/dashboard/results", icon: "Award" },
    { title: "Fees", href: "/parent/dashboard/fees", icon: "Wallet" },
    { title: "Notifications", href: "/parent/dashboard/notifications", icon: "Bell" },
  ],
} as const;

export const PUBLIC_ROUTES = [
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

export const TOKEN_KEY = "sms_access_token";
export const REFRESH_TOKEN_KEY = "sms_refresh_token";
export const REMEMBER_ME_KEY = "sms_remember_me";
export const USER_ROLE_KEY = "sms_user_role";
