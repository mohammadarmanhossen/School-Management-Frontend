"use client";

import Link from "next/link";
import {
  Users,
  ClipboardCheck,
  Award,
  Bell,
  ChevronRight,
  School,
  PenLine,
  FileText,
  Calendar,
  TrendingUp
} from "lucide-react";

import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockTeacherStats,
  mockTeacherClasses,
  mockTeacherSchedule,
  mockNotices,
} from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store";

const QUICK_LINKS = [
  { title: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck, desc: "Mark daily attendance" },
  { title: "Assignments", href: "/dashboard/assignments", icon: PenLine, desc: "Create & grade tasks" },
  { title: "Results", href: "/dashboard/results", icon: Award, desc: "Manage student grades" },
  { title: "Timetable", href: "/dashboard/timetable", icon: Calendar, desc: "View class schedule" },
  { title: "Notices", href: "/dashboard/notices", icon: Bell, desc: "School announcements" },
  { title: "Performance", href: "/teacher/dashboard/performance", icon: TrendingUp, desc: "Teaching analytics" },
];

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const stats = mockTeacherStats;
  const todaySchedule = mockTeacherSchedule.filter((s) => s.day === "Sunday");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.firstName || "Teacher"}!`}
        description="Manage your classes, track attendance, and grade assignments."
      />

      {/* Teacher Profile Card */}
      <Card className="dashboard-card overflow-hidden">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-blue-500/20">
              <AvatarFallback className="bg-blue-500/10 text-lg text-blue-500">
                {getInitials(user?.fullName || "Teacher User")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user?.fullName || "Teacher Name"}</h2>
              <p className="text-sm text-muted-foreground">
                Mathematics Department · ID: EMP-2020-001
              </p>
              <div className="mt-2 flex gap-2">
                <Badge variant={stats.attendanceMarkedToday ? "success" : "warning"}>
                  {stats.attendanceMarkedToday ? "Attendance Marked" : "Attendance Pending"}
                </Badge>
                <Badge variant="secondary">2024-2025</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/settings">View Profile</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Classes" value={stats.totalClasses} icon={School} variant="primary" />
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} variant="success" trend={{ value: 3, label: "from last month" }} />
        <StatCard title="Pending Assignments" value={stats.pendingAssignments} icon={PenLine} variant="warning" />
        <StatCard title="Upcoming Exams" value={stats.upcomingExams} icon={FileText} variant="default" />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full border-white/[0.08] bg-[hsl(0,0%,6%)] transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <link.icon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{link.title}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Classes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/classes">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTeacherClasses.slice(0, 4).map((cls) => (
              <div key={cls.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{cls.className} - {cls.section}</p>
                  <p className="text-xs text-muted-foreground">{cls.subject}</p>
                </div>
                <Badge variant={cls.avgAttendance >= 80 ? "success" : "warning"}>
                  {cls.avgAttendance}% Att
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/timetable">View full</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaySchedule.slice(0, 4).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{entry.className} · Room {entry.room}</p>
                  <p className="text-xs text-muted-foreground">{entry.startTime} - {entry.endTime}</p>
                </div>
                <Badge variant="default" className="capitalize">{entry.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Notices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Notices</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/notices">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockNotices.slice(0, 3).map((notice) => (
            <div key={notice.id} className="rounded-lg border px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium line-clamp-1">{notice.title}</p>
                <Badge variant={notice.priority === "urgent" ? "destructive" : "secondary"} className="text-[10px] capitalize">
                  {notice.priority}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{notice.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
