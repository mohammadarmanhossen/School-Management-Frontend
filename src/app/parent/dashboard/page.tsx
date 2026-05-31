"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  Award,
  Wallet,
  Bell,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockAttendance,
  mockResults,
  mockFees,
  mockParentChildren,
  mockParentNotifications,
  mockAssignments,
} from "@/lib/mock-data";
import { getInitials, formatDate, formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { ATTENDANCE_STATUS } from "@/constants";

const QUICK_LINKS = [
  { title: "Attendance", href: "/parent/dashboard/attendance", icon: ClipboardCheck, desc: "View daily records" },
  { title: "Results", href: "/parent/dashboard/results", icon: Award, desc: "Exam grades & GPA" },
  { title: "Fees", href: "/parent/dashboard/fees", icon: Wallet, desc: "Payments & invoices" },
  { title: "Notifications", href: "/parent/dashboard/notifications", icon: Bell, desc: "Alerts & updates" },
];

export default function ParentDashboardPage() {
  const { user } = useAuthStore();
  const child = mockParentChildren[0];
  const unread = mockParentNotifications.filter((n) => !n.read).length;
  const pendingFees = mockFees.filter((f) => f.status !== "paid").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${user?.firstName || "Parent"}!`}
        description="Track your children's academic progress and school updates."
      />

      {/* Child profile card */}
      <Card className="dashboard-card overflow-hidden">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-lg text-primary">
                {getInitials(child.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{child.name}</h2>
              <p className="text-sm text-muted-foreground">
                {child.studentId} · {child.className} - Section {child.sectionName} · Roll {child.rollNumber}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge variant="success">Active</Badge>
                <Badge variant="secondary">2024-2025</Badge>
              </div>
            </div>
          </div>
          {mockParentChildren.length > 1 && (
            <Button variant="outline" size="sm">
              Switch Child ({mockParentChildren.length})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance Rate" value={`${child.attendanceRate}%`} icon={ClipboardCheck} variant="success" trend={{ value: 2.1, label: "this month" }} />
        <StatCard title="Current GPA" value={child.gpa.toFixed(1)} icon={Award} variant="primary" />
        <StatCard title="Pending Fees" value={pendingFees} icon={Wallet} variant="warning" />
        <StatCard title="Unread Alerts" value={unread} icon={Bell} variant="default" />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full border-white/[0.08] bg-[hsl(0,0%,6%)] transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{link.title}</p>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent attendance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Attendance</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/parent/dashboard/attendance">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAttendance.slice(0, 6).map((a) => {
              const config = ATTENDANCE_STATUS[a.status];
              return (
                <div key={a.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <span className="text-sm">{formatDate(a.date)}</span>
                  <Badge className={`${config.color} border-0 text-white`}>{config.label}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Exam results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Exam Results</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/parent/dashboard/results">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockResults.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{r.examName}</p>
                  <p className="text-xs text-muted-foreground">{r.marksObtained}/{r.totalMarks} marks</p>
                </div>
                <Badge variant="success">{r.grade} · GPA {r.gpa}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fee status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Fee Status</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/parent/dashboard/fees">Pay now</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockFees.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{f.category}</p>
                  <p className="text-xs text-muted-foreground">Due {formatDate(f.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(f.amount)}</p>
                  <Badge variant={f.status === "paid" ? "success" : "warning"} className="mt-1">
                    {f.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Notifications</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/parent/dashboard/notifications">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockParentNotifications.slice(0, 4).map((n) => (
              <div
                key={n.id}
                className={`rounded-lg border px-3 py-2 ${!n.read ? "border-primary/30 bg-primary/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{n.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Assignments due */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-5 w-5" />
            Upcoming Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {mockAssignments.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.subjectName} · Due {formatDate(a.dueDate)}</p>
                </div>
                <Badge variant="warning">Due soon</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
