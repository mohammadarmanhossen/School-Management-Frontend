"use client";

import {
  Users,
  Award,
  TrendingUp,
  Target,
  BookOpen,
  ClipboardCheck,
  Star,
  BarChart2,
  Flame,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Trophy,
  Zap,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockTeacherClasses,
  mockTeacherStats,
  mockTeacherPerformanceChart,
  mockTeacherAttendanceChart,
  mockTeacherMonthlyScoreTrend,
  mockTeacherAssignmentCompletion,
  mockTeacherSubjectBreakdown,
  mockTeacherTopStudents,
  mockTeacherGoals,
  mockTeacherSkillRadar,
  mockTeacherExamResults,
} from "@/lib/mock-data";
import { useAuthStore } from "@/store";
import { getInitials } from "@/lib/utils";
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// ─── Shared Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({
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
      <div className="rounded-xl border border-white/[0.1] bg-zinc-950 p-3 shadow-2xl text-sm">
        <p className="mb-2 font-semibold text-zinc-200">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-zinc-400">{p.name}:</span>
            <span className="font-bold" style={{ color: p.color }}>
              {p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Score Color Helpers ──────────────────────────────────────────────────────
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

const getScoreBadge = (val: number) => {
  if (val >= 80) return { label: "Excellent", cls: "bg-emerald-500/10 text-emerald-400 border-0" };
  if (val >= 70) return { label: "Good", cls: "bg-blue-500/10 text-blue-400 border-0" };
  if (val >= 60) return { label: "Average", cls: "bg-amber-500/10 text-amber-400 border-0" };
  return { label: "Needs Focus", cls: "bg-rose-500/10 text-rose-400 border-0" };
};

const getGoalProgress = (current: number, target: number) =>
  Math.min(Math.round((current / target) * 100), 100);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TeacherPerformancePage() {
  const { user } = useAuthStore();
  const stats = mockTeacherStats;
  const classes = mockTeacherClasses;

  const overallScore = Math.round(
    classes.reduce((acc, c) => acc + c.avgScore, 0) / classes.length
  );
  const overallAttendance = Math.round(
    classes.reduce((acc, c) => acc + c.avgAttendance, 0) / classes.length
  );

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

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-950/60 via-zinc-950 to-violet-950/40 p-6 md:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10">
              <AvatarFallback className="bg-blue-500/15 text-lg font-bold text-blue-400">
                {getInitials(user?.fullName || "Teacher")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="mb-1 flex items-center gap-2 text-blue-400">
                <Flame className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Performance Dashboard
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {user?.fullName || "Teacher"}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Mathematics Department · AY 2024–2025
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Avg Score", value: `${overallScore}%`, color: "text-blue-400" },
              { label: "Attendance", value: `${overallAttendance}%`, color: "text-emerald-400" },
              { label: "Classes", value: stats.totalClasses, color: "text-violet-400" },
              { label: "Students", value: stats.totalStudents, color: "text-amber-400" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center backdrop-blur"
              >
                <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                <p className="text-xs text-zinc-500">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Users,
            label: "Total Students",
            value: stats.totalStudents,
            sub: "Across all classes",
            color: "blue",
            bgGlow: "bg-blue-500/10",
            iconColor: "text-blue-400",
            iconBg: "bg-blue-500/20",
          },
          {
            icon: Award,
            label: "Avg Class Score",
            value: `${stats.avgClassScore}%`,
            sub: "+2.3% from last month",
            color: "emerald",
            bgGlow: "bg-emerald-500/10",
            iconColor: "text-emerald-400",
            iconBg: "bg-emerald-500/20",
          },
          {
            icon: ClipboardCheck,
            label: "Classes This Month",
            value: stats.thisMonthClasses,
            sub: `Target: 52 classes`,
            color: "violet",
            bgGlow: "bg-violet-500/10",
            iconColor: "text-violet-400",
            iconBg: "bg-violet-500/20",
          },
          {
            icon: Target,
            label: "Leave Remaining",
            value: `${stats.leaveDaysTotal - stats.leaveDaysUsed}`,
            sub: `of ${stats.leaveDaysTotal} days total`,
            color: "amber",
            bgGlow: "bg-amber-500/10",
            iconColor: "text-amber-400",
            iconBg: "bg-amber-500/20",
          },
        ].map((kpi) => (
          <Card
            key={kpi.label}
            className="group relative overflow-hidden border-white/[0.08] bg-zinc-950"
          >
            <div
              className={`absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full ${kpi.bgGlow} blur-2xl transition-all group-hover:scale-125`}
            />
            <CardContent className="relative z-10 p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.iconBg} ${kpi.iconColor}`}
                >
                  <kpi.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">{kpi.label}</p>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{kpi.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts Row 1: Score Trend + Radar ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Monthly Score Trend */}
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Monthly Score Trend
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Your class avg vs. school avg over the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockTeacherMonthlyScoreTrend}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="classGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="schoolGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} domain={[60, 90]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#ffffff15", strokeWidth: 1 }} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} formatter={(v) => <span style={{ color: "#9ca3af" }}>{v}</span>} />
                  <Area type="monotone" dataKey="classAvg" name="My Class Avg" stroke="#3b82f6" strokeWidth={2.5} fill="url(#classGrad)" dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Area type="monotone" dataKey="schoolAvg" name="School Avg" stroke="#a78bfa" strokeWidth={2} fill="url(#schoolGrad)" strokeDasharray="5 5" dot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Skill Radar */}
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Zap className="h-5 w-5 text-violet-400" />
              Teaching Effectiveness Radar
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Multi-dimensional view of your teaching metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mockTeacherSkillRadar} cx="50%" cy="50%">
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#71717a", fontSize: 10 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#52525b", fontSize: 9 }}
                    axisLine={false}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#60a5fa"
                    fill="#3b82f6"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Row 2: Class Overview + Assignment Completion ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Class Score vs Attendance Bar Chart */}
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              Class Overview
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Score and attendance comparison across all classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockTeacherPerformanceChart}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} formatter={(v) => <span style={{ color: "#9ca3af" }}>{v}</span>} />
                  <Bar dataKey="score" name="Avg Score (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendance" name="Attendance (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Submission Rate */}
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Assignment Submission Rate
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Monthly % of assignments submitted on time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockTeacherAssignmentCompletion}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} domain={[70, 100]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#ffffff20", strokeWidth: 1 }} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} formatter={(v) => <span style={{ color: "#9ca3af" }}>{v}</span>} />
                  <Line type="monotone" dataKey="submitted" name="Submission Rate (%)" stroke="#34d399" strokeWidth={2.5} dot={{ r: 4, fill: "#34d399", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Exam Results Table + Teacher Attendance ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Exam Results Table */}
        <Card className="overflow-hidden border-white/[0.08] bg-zinc-950 shadow-xl">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Activity className="h-4 w-4 text-amber-400" />
              Exam Result Summary
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Key metrics across all held exams
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-zinc-900/30">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Exam</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Avg</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Highest</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Lowest</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Pass%</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTeacherExamResults.map((row, i) => (
                    <tr
                      key={row.exam}
                      className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${i === mockTeacherExamResults.length - 1 ? "border-0" : ""}`}
                    >
                      <td className="px-5 py-3.5 font-medium text-zinc-200">{row.exam}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-semibold text-blue-400">{row.classAvg}%</span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-emerald-400 font-medium">{row.highest}</td>
                      <td className="px-4 py-3.5 text-right text-rose-400 font-medium">{row.lowest}</td>
                      <td className="px-4 py-3.5 text-right">
                        <Badge
                          variant="outline"
                          className={`text-xs border-0 ${row.passRate >= 90 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                        >
                          {row.passRate}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* My Attendance Line Chart */}
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              My Attendance Trend
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Monthly classes conducted vs. absences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockTeacherAttendanceChart}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#ffffff20", strokeWidth: 1 }} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} formatter={(v) => <span style={{ color: "#9ca3af" }}>{v}</span>} />
                  <Line type="monotone" dataKey="present" name="Days Present" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="absent" name="Days Absent" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Subject Breakdown + Top Students ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Subject Topic Breakdown */}
        <Card className="overflow-hidden border-white/[0.08] bg-zinc-950 shadow-xl">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BookOpen className="h-4 w-4 text-blue-400" />
              Subject Topic Breakdown
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Avg score and pass rate per topic
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {mockTeacherSubjectBreakdown.map((subj) => {
              const badge = getScoreBadge(subj.avgScore);
              return (
                <div key={subj.subject}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium text-zinc-200">{subj.subject}</span>
                      <span className="ml-2 text-xs text-zinc-500">{subj.totalStudents} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{subj.avgScore}%</span>
                      <Badge variant="outline" className={`text-xs ${badge.cls}`}>
                        {badge.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={subj.avgScore}
                      className={`h-2 flex-1 bg-zinc-800 ${getScoreColor(subj.avgScore)}`}
                    />
                    <span className="w-16 shrink-0 text-right text-xs text-zinc-400">
                      {subj.passRate}% pass
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Students Leaderboard */}
        <Card className="overflow-hidden border-white/[0.08] bg-zinc-950 shadow-xl">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Trophy className="h-4 w-4 text-amber-400" />
              Top Performing Students
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Your highest-scoring students this term
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-white/[0.04] px-6">
            {mockTeacherTopStudents.map((student, idx) => (
              <div key={student.id} className="flex items-center gap-4 py-4">
                {/* Rank */}
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold
                  ${idx === 0 ? "bg-amber-500/20 text-amber-400" : idx === 1 ? "bg-zinc-400/10 text-zinc-300" : idx === 2 ? "bg-orange-700/20 text-orange-400" : "bg-zinc-800 text-zinc-500"}`}>
                  {idx + 1}
                </div>
                {/* Avatar */}
                <Avatar className="h-9 w-9 border border-white/10">
                  <AvatarFallback className="bg-blue-500/10 text-xs text-blue-400">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-100">{student.name}</p>
                  <p className="text-xs text-zinc-500">{student.class}</p>
                </div>
                {/* Score + Trend */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-sm font-bold text-white">{student.score}%</span>
                    {student.trend === "up" && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />}
                    {student.trend === "down" && <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />}
                    {student.trend === "stable" && <Minus className="h-3.5 w-3.5 text-zinc-500" />}
                  </div>
                  <p className="text-xs text-zinc-500">{student.attendance}% att.</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Class-wise Score + Attendance Progress ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-white/[0.08] bg-zinc-950 shadow-xl">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Star className="h-4 w-4 text-blue-400" />
              Class Score Breakdown
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
                    <Badge variant="outline" className={`text-xs border-0 ${cls.avgScore >= 75 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {cls.avgScore >= 75 ? "Good" : "Needs Focus"}
                    </Badge>
                  </div>
                </div>
                <Progress value={cls.avgScore} className={`h-2 bg-zinc-800 ${getScoreColor(cls.avgScore)}`} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-white/[0.08] bg-zinc-950 shadow-xl">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ClipboardCheck className="h-4 w-4 text-emerald-400" />
              Attendance Rate per Class
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
                    <Badge variant="outline" className={`text-xs border-0 ${cls.avgAttendance >= 90 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
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

      {/* ── Goals & Targets ── */}
      <Card className="border-white/[0.08] bg-zinc-950 shadow-xl">
        <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Target className="h-4 w-4 text-violet-400" />
            Goals & Targets
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Track your progress against semester targets
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockTeacherGoals.map((goal) => {
            const pct = getGoalProgress(goal.current, goal.target);
            const isOnTrack = pct >= 85;
            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight text-zinc-300">{goal.label}</p>
                  <Badge
                    variant="outline"
                    className={`shrink-0 border-0 text-xs ${isOnTrack ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                  >
                    {isOnTrack ? "On Track" : "Behind"}
                  </Badge>
                </div>
                <div>
                  <div className="mb-1.5 flex items-baseline justify-between text-xs text-zinc-500">
                    <span>
                      <span className="text-base font-bold text-white">{goal.current}</span>
                      {goal.unit}
                    </span>
                    <span>Target: {goal.target}{goal.unit}</span>
                  </div>
                  <Progress
                    value={pct}
                    className={`h-2.5 bg-zinc-800 ${isOnTrack ? "[&>div]:bg-emerald-500" : "[&>div]:bg-amber-500"}`}
                  />
                  <p className="mt-1 text-right text-xs text-zinc-600">{pct}% achieved</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
