"use client";

import {
  GraduationCap,
  Users,
  School,
  BookOpen,
  ClipboardCheck,
  Wallet,
  FileText,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/features/dashboard/chart-card";
import { RecentActivities } from "@/features/dashboard/recent-activities";
import { PageHeader } from "@/components/shared/page-header";
import {
  mockDashboardStats,
  mockAttendanceChart,
  mockRevenueChart,
  mockStudentGrowthChart,
  mockExamPerformanceChart,
} from "@/lib/mock-data";
import { useAuthStore } from "@/store";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName || "Admin"}!`}
        description="Here's what's happening at your school today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={GraduationCap} trend={{ value: 12, label: "from last month" }} variant="primary" />
        <StatCard title="Total Teachers" value={stats.totalTeachers} icon={Users} trend={{ value: 3, label: "from last month" }} variant="success" />
        <StatCard title="Total Classes" value={stats.totalClasses} icon={School} variant="default" />
        <StatCard title="Total Subjects" value={stats.totalSubjects} icon={BookOpen} variant="warning" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Monthly Attendance" value={`${stats.monthlyAttendance}%`} icon={ClipboardCheck} trend={{ value: 2.1, label: "improvement" }} variant="success" />
        <StatCard title="Fee Collection" value={stats.monthlyFeeCollection} icon={Wallet} isCurrency trend={{ value: 8, label: "from last month" }} variant="primary" />
        <StatCard title="Upcoming Exams" value={stats.upcomingExams} icon={FileText} variant="warning" />
        <StatCard title="Active Notices" value={5} icon={BookOpen} variant="default" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Monthly Attendance"
          data={mockAttendanceChart}
          type="area"
          dataKeys={[
            { key: "present", color: "#22c55e", name: "Present %" },
            { key: "absent", color: "#ef4444", name: "Absent %" },
          ]}
        />
        <ChartCard
          title="Fee Revenue"
          data={mockRevenueChart}
          type="bar"
          dataKeys={[
            { key: "revenue", color: "#3b82f6", name: "Revenue" },
            { key: "target", color: "#94a3b8", name: "Target" },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Student Growth"
          data={mockStudentGrowthChart}
          type="line"
          dataKeys={[{ key: "students", color: "#8b5cf6", name: "Students" }]}
        />
        <ChartCard
          title="Exam Performance by Class"
          data={mockExamPerformanceChart}
          type="bar"
          dataKeys={[{ key: "average", color: "#f59e0b", name: "Average Score" }]}
        />
      </div>

      <RecentActivities activities={stats.recentActivities} />
    </div>
  );
}
