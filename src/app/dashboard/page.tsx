"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  School,
  BookOpen,
  ClipboardCheck,
  FileText,
  Sparkles,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/features/dashboard/chart-card";
import { RecentActivities } from "@/features/dashboard/recent-activities";
import {
  mockDashboardStats,
  mockAttendanceChart,
  mockStudentGrowthChart,
  mockExamPerformanceChart,
} from "@/lib/mock-data";
import { useAuthStore } from "@/store";
import { formatDate } from "@/lib/utils";
import { getDefaultDashboard } from "@/utils/rbac";

function AdminDashboardContent() {
  const { user } = useAuthStore();
  const stats = mockDashboardStats;

  return (
    <div className="space-y-8">
      <div className="dashboard-card relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-widest">Admin Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Welcome back, {user?.firstName || "Admin"}!
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {formatDate(new Date(), { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              {" · "}School overview and reports
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{stats.monthlyAttendance}%</p>
              <p className="text-xs text-zinc-500">Attendance</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{stats.upcomingExams}</p>
              <p className="text-xs text-zinc-500">Exams</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Students" value={stats.totalStudents} icon={GraduationCap} trend={{ value: 12, label: "from last month" }} variant="primary" />
        <StatCard title="Total Teachers" value={stats.totalTeachers} icon={Users} trend={{ value: 3, label: "from last month" }} variant="success" />
        <StatCard title="Parents" value={892} icon={School} variant="default" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance" value={`${stats.monthlyAttendance}%`} icon={ClipboardCheck} trend={{ value: 2.1, label: "improvement" }} variant="success" />
        <StatCard title="Reports" value={24} icon={FileText} variant="warning" />
        <StatCard title="Total Classes" value={stats.totalClasses} icon={School} variant="default" />
        <StatCard title="Total Subjects" value={stats.totalSubjects} icon={BookOpen} variant="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly Attendance" data={mockAttendanceChart} type="area" dataKeys={[{ key: "present", color: "#34d399", name: "Present %" }, { key: "absent", color: "#f87171", name: "Absent %" }]} />
        <ChartCard title="Student Growth" data={mockStudentGrowthChart} type="line" dataKeys={[{ key: "students", color: "#a78bfa", name: "Students" }]} />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <ChartCard title="Exam Performance by Class" data={mockExamPerformanceChart} type="bar" dataKeys={[{ key: "average", color: "#fbbf24", name: "Average Score" }]} />
      </div>

      <RecentActivities activities={stats.recentActivities} />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    const target = getDefaultDashboard(user.role);
    if (user.role !== "school_admin" && target !== "/dashboard") {
      router.replace(target);
    }
  }, [user, router]);

  if (!user || user.role !== "school_admin") {
    return null;
  }

  return <AdminDashboardContent />;
}
