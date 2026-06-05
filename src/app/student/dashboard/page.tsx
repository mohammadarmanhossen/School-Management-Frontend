"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  Award,
  Wallet,
  BookOpen,
  Calendar,
  FileText,
  Library,
  Bus,
  Building,
  Star,
  TrendingUp
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockStudentProfile,
  mockStudentTodayClasses,
  mockStudentHomework,
  mockStudentUpcomingExams,
  mockStudentNotices,
} from "@/lib/mock-data";
import { getInitials, formatDate } from "@/lib/utils";

const QUICK_LINKS = [
  { title: "Homework", href: "/student/dashboard/homework", icon: BookOpen, desc: "Your assignments" },
  { title: "Attendance", href: "/student/dashboard/attendance", icon: ClipboardCheck, desc: "Daily records" },
  { title: "Exams & Results", href: "/student/dashboard/results", icon: Award, desc: "Grades & GPA" },
  { title: "Library", href: "/student/dashboard/library", icon: Library, desc: "Issued books" },
  { title: "Fees", href: "/student/dashboard/fees", icon: Wallet, desc: "Payments" },
  { title: "Transport", href: "/student/dashboard/transport", icon: Bus, desc: "Bus schedule" },
  { title: "Hostel", href: "/student/dashboard/hostel", icon: Building, desc: "Room details" },
  { title: "Calendar", href: "/student/dashboard/timetable", icon: Calendar, desc: "Class schedule" },
  { title: "Events", href: "/student/dashboard/events", icon: Star, desc: "School activities" },
  { title: "Performance", href: "/student/dashboard/performance", icon: TrendingUp, desc: "Your stats" },
];

export default function StudentDashboardPage() {
  const profile = mockStudentProfile;
  const pendingHomework = mockStudentHomework.filter((h) => !h.submitted).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${profile.name}!`}
        description="View your academic progress, schedule, and assignments."
      />

      {/* Student Profile Card */}
      <Card className="dashboard-card overflow-hidden">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-violet-500/20">
              <AvatarFallback className="bg-violet-500/10 text-lg text-violet-500">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">
                Class {profile.class} · Section {profile.section} · Roll {profile.rollNumber}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge variant="success">Active</Badge>
                <Badge variant="secondary">{profile.group}</Badge>
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
        <StatCard title="Attendance Rate" value={`${profile.attendanceRate}%`} icon={ClipboardCheck} variant="success" trend={{ value: 2.1, label: "this month" }} />
        <StatCard title="Current GPA" value={profile.gpa.toFixed(1)} icon={Award} variant="primary" trend={{ value: 0.3, label: "from last term" }} />
        <StatCard title="Pending Homework" value={pendingHomework} icon={BookOpen} variant="warning" />
        <StatCard title="Upcoming Exams" value={mockStudentUpcomingExams.length} icon={FileText} variant="default" />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full border-white/[0.08] bg-[hsl(0,0%,6%)] transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                  <link.icon className="h-5 w-5 text-violet-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{link.title}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Today&apos;s Classes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/dashboard/timetable">View full</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockStudentTodayClasses.slice(0, 4).map((cls) => (
              <div key={cls.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{cls.subject}</p>
                  <p className="text-xs text-muted-foreground">{cls.time} · Room {cls.room}</p>
                </div>
                <Badge variant={cls.status === "ongoing" ? "success" : cls.status === "done" ? "secondary" : "outline"}>
                  {cls.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Homework */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Homework</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/dashboard/homework">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockStudentHomework.slice(0, 4).map((hw) => (
              <div key={hw.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{hw.title}</p>
                  <p className="text-xs text-muted-foreground">{hw.subject} · Due {formatDate(hw.dueDate)}</p>
                </div>
                <Badge variant={hw.submitted ? "success" : "warning"}>
                  {hw.submitted ? "Submitted" : "Pending"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exams & Notices */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Exams</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/dashboard/results">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockStudentUpcomingExams.slice(0, 3).map((exam) => (
              <div key={exam.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{exam.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(exam.date)} · {exam.time}</p>
                </div>
                <Badge variant="outline">{exam.totalMarks} Marks</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Notices</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/dashboard/events">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockStudentNotices.slice(0, 3).map((notice) => (
              <div key={notice.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{notice.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(notice.date)}</p>
                </div>
                <Badge variant={notice.priority === "urgent" ? "destructive" : "secondary"} className="capitalize">
                  {notice.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
