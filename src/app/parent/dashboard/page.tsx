"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useParentStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Users,
  ClipboardCheck,
  Award,
  CalendarDays,
  Wallet,
  Bell,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ParentDashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const {
    children,
    selectedChildId,
    setSelectedChild,
    attendance,
    results,
    exams,
    fees,
    routines,
    notices,
    activities,
  } = useParentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const child = children.find((c) => c.id === selectedChildId);
  if (!child) return null;

  const childAttendance = attendance[child.id] || [];
  const presentDays = childAttendance.filter((a) => a.status === "present" || a.status === "late").length;
  const attendancePercentage = childAttendance.length > 0 ? Math.round((presentDays / childAttendance.length) * 100) : 0;

  const childResults = results[child.id] || [];
  const latestResult = childResults[childResults.length - 1];

  const childExams = (exams[child.id] || []).filter((e) => e.status === "upcoming");
  
  const childFees = fees[child.id] || [];
  const pendingFees = childFees.filter((f) => f.status === "pending" || f.status === "overdue");
  const totalPendingFee = pendingFees.reduce((acc, curr) => acc + curr.amount, 0);

  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const childRoutine = (routines[child.id] || []).find((r) => r.day === todayStr)?.periods || [];

  const childActivities = (activities[child.id] || []).slice(0, 3);
  const recentNotices = notices.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Parent Dashboard"
          description={`Welcome back! Here's an overview for ${child.name}.`}
        />
        
        {/* Child Switcher */}
        {children.length > 1 && (
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/50 p-1">
            {children.map((c) => (
              <Button
                key={c.id}
                variant={selectedChildId === c.id ? "default" : "ghost"}
                size="sm"
                className={selectedChildId === c.id ? "bg-blue-600 hover:bg-blue-700" : "text-zinc-400"}
                onClick={() => setSelectedChild(c.id)}
              >
                {c.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Student Information */}
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
            <Avatar className="h-20 w-20 border-2 border-blue-500/20">
              <AvatarImage src={child.photoUrl} alt={child.name} />
              <AvatarFallback className="bg-blue-500/10 text-blue-500 text-xl font-bold">
                {child.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="w-full space-y-3">
              <div className="text-center">
                <h3 className="font-semibold text-white text-lg">{child.name}</h3>
                <p className="text-xs text-zinc-400">Student ID: {child.id}</p>
              </div>
              
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Class & Section:</span>
                  <span className="font-medium text-white">{child.class} - {child.section}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Roll Number:</span>
                  <span className="font-medium text-white">{child.rollNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Class Teacher:</span>
                  <span className="font-medium text-white">Mr. Smith</span>
                </div>
              </div>
            </div>
            <Link href="/parent/dashboard/my-child" className="w-full mt-2">
              <Button variant="outline" size="sm" className="w-full border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10">
                View Full Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Attendance Stat */}
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-emerald-500/10 to-zinc-950">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <ClipboardCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Attendance</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-white">{attendancePercentage}%</h3>
                  <span className="text-xs text-emerald-400 flex items-center"><TrendingUp className="mr-1 h-3 w-3"/> Good</span>
                </div>
              </div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-emerald-500/20">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${attendancePercentage}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Results Stat */}
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-blue-500/10 to-zinc-950">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <Award className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Latest Result</p>
                {latestResult ? (
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-white">{latestResult.grade}</h3>
                    <span className="text-xs text-zinc-400">({latestResult.marksObtained}/{latestResult.totalMarks})</span>
                  </div>
                ) : (
                  <h3 className="text-xl font-bold text-zinc-500">N/A</h3>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs text-zinc-400 truncate">
              {latestResult ? latestResult.examName : "No results published yet."}
            </p>
          </CardContent>
        </Card>

        {/* Fees Stat */}
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-rose-500/10 to-zinc-950">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20">
                <Wallet className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Pending Fees</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-white">{formatCurrency(totalPendingFee)}</h3>
                </div>
              </div>
            </div>
            <Link href="/parent/dashboard/fees" className="mt-4 block">
              <Button variant="ghost" size="sm" className="w-full justify-between px-0 text-rose-400 hover:bg-transparent hover:text-rose-300">
                <span>View Fee Details</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Routine */}
        <Card className="dashboard-card lg:col-span-1 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-white">Today's Classes</CardTitle>
            <CalendarDays className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            {childRoutine.length > 0 ? (
              <div className="space-y-4">
                {childRoutine.map((period, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-400">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{period.subject}</p>
                      <p className="text-xs text-zinc-400">{period.time} • {period.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <CalendarDays className="mb-2 h-8 w-8 text-zinc-600" />
                <p className="text-sm text-zinc-400">No classes scheduled for today.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card className="dashboard-card lg:col-span-1 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-white">Upcoming Exams</CardTitle>
            <FileText className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            {childExams.length > 0 ? (
              <div className="space-y-4">
                {childExams.map((exam) => (
                  <div key={exam.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{exam.subject}</p>
                        <p className="text-xs text-zinc-400">{exam.examName}</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                        {formatDate(exam.date)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <Award className="mb-2 h-8 w-8 text-zinc-600" />
                <p className="text-sm text-zinc-400">No upcoming exams.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities & Notices */}
        <Card className="dashboard-card lg:col-span-1 border-white/5 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white">Latest Updates</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notices</h4>
              {recentNotices.length > 0 ? recentNotices.map((notice) => (
                <div key={notice.id} className="flex gap-3">
                  <div className="mt-0.5 flex h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200 line-clamp-1">{notice.title}</p>
                    <p className="text-xs text-zinc-500">{formatDate(notice.date)}</p>
                  </div>
                </div>
              )) : <p className="text-xs text-zinc-500">No new notices.</p>}
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Activities</h4>
              {childActivities.length > 0 ? childActivities.map((act) => (
                <div key={act.id} className="flex gap-3">
                  <div className="mt-0.5 flex h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200 line-clamp-1">{act.title}</p>
                    <p className="text-xs text-zinc-500">{formatDate(act.date)}</p>
                  </div>
                </div>
              )) : <p className="text-xs text-zinc-500">No recent activities.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Temporary icon import fix since FileText wasn't imported at top
import { FileText } from "lucide-react";
