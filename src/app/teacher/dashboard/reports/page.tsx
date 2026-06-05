"use client";

import {
  Users, Award, TrendingUp, Target, BookOpen,
  ClipboardCheck, Star, BarChart2
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  mockTeacherClasses,
  mockTeacherStats,
  mockTeacherPerformanceChart,
  mockTeacherAttendanceChart,
} from "@/lib/mock-data";
import { useAuthStore } from "@/store";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function TeacherPerformancePage() {
  const { user } = useAuthStore();

  const stats = mockTeacherStats;
  const classes = mockTeacherClasses;

  const CustomBarTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number; name: string; color: string }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-white/[0.1] p-3 rounded-lg shadow-xl text-sm">
          <p className="text-zinc-300 font-medium mb-2">{label}</p>
          {payload.map((p) => (
            <p key={p.name} style={{ color: p.color }}>
              {p.name}: <span className="font-bold">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getScoreColor = (val: number) => {
    if (val >= 80) return "[&>div]:bg-emerald-500";
    if (val >= 70) return "[&>div]:bg-blue-500";
    if (val >= 60) return "[&>div]:bg-amber-500";
    return "[&>div]:bg-rose-500";
  };

  const getAttendanceColor = (val: number) => {
    if (val >= 90) return "[&>div]:bg-emerald-500";
    if (val >= 80) return "[&>div]:bg-blue-500";
    return "[&>div]:bg-amber-500";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Teaching Performance"
        description={`Insights and analytics for ${user?.fullName || "Teacher"}`}
        breadcrumbs={[
          { label: "Teacher Portal", href: "/teacher/dashboard" },
          { label: "Performance" },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-white/[0.08] bg-zinc-950 group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Total Students</p>
                <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-white/[0.08] bg-zinc-950 group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Avg Class Score</p>
                <p className="text-2xl font-bold text-white">{stats.avgClassScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-white/[0.08] bg-zinc-950 group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl transition-all group-hover:bg-violet-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Classes This Month</p>
                <p className="text-2xl font-bold text-white">{stats.thisMonthClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-white/[0.08] bg-zinc-950 group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition-all group-hover:bg-amber-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Leave Remaining</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-white">{stats.leaveDaysTotal - stats.leaveDaysUsed}</p>
                  <p className="text-xs text-zinc-500">/ {stats.leaveDaysTotal} days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Class Score vs Attendance Bar Chart */}
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-500" /> Class Overview
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Score and attendance comparison across all classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockTeacherPerformanceChart}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                    formatter={(value) => <span style={{ color: "#9ca3af" }}>{value}</span>}
                  />
                  <Bar dataKey="score" name="Avg Score (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendance" name="Attendance (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* My Attendance Line Chart */}
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> My Attendance Trend
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Monthly classes conducted vs. absences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockTeacherAttendanceChart}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ stroke: "#ffffff20", strokeWidth: 1 }} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                    formatter={(value) => <span style={{ color: "#9ca3af" }}>{value}</span>}
                  />
                  <Line type="monotone" dataKey="present" name="Days Present" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="absent" name="Days Absent" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: "#f43f5e" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-Class Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/[0.08] bg-zinc-950 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-400" /> Class Score Breakdown
            </CardTitle>
            <CardDescription className="text-zinc-400">Average exam score per class</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {classes.map((cls) => (
              <div key={cls.id}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium text-zinc-200">{cls.className} - {cls.section}</span>
                    <span className="ml-2 text-xs text-zinc-500">({cls.subject})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{cls.avgScore}%</span>
                    <Badge
                      variant="outline"
                      className={`text-xs border-0 ${cls.avgScore >= 75 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                    >
                      {cls.avgScore >= 75 ? "Good" : "Needs Focus"}
                    </Badge>
                  </div>
                </div>
                <Progress value={cls.avgScore} className={`h-2 bg-zinc-800 ${getScoreColor(cls.avgScore)}`} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-zinc-950 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" /> Attendance Rate per Class
            </CardTitle>
            <CardDescription className="text-zinc-400">Student punctuality across your classes</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {classes.map((cls) => (
              <div key={cls.id}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium text-zinc-200">{cls.className} - {cls.section}</span>
                    <span className="ml-2 text-xs text-zinc-500">{cls.studentCount} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{cls.avgAttendance}%</span>
                    <Badge
                      variant="outline"
                      className={`text-xs border-0 ${cls.avgAttendance >= 90 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                    >
                      {cls.avgAttendance >= 90 ? "Excellent" : "Moderate"}
                    </Badge>
                  </div>
                </div>
                <Progress value={cls.avgAttendance} className={`h-2 bg-zinc-800 ${getAttendanceColor(cls.avgAttendance)}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


