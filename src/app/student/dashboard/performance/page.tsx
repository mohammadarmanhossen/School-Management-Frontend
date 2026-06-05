"use client";

import { Award, TrendingUp, Target, BookOpen, GraduationCap, Medal } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockStudentProfile, mockStudentSubjectResults, mockStudentGpaChart } from "@/lib/mock-data";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function StudentPerformancePage() {
  const profile = mockStudentProfile;
  const results = mockStudentSubjectResults;
  
  // Custom tooltip for recharts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-white/[0.1] p-3 rounded-lg shadow-xl">
          <p className="text-zinc-300 text-sm mb-1">{label}</p>
          <p className="text-rose-400 font-bold text-lg">GPA: {payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const getProgressColor = (val: number) => {
    if (val >= 80) return "[&>div]:bg-emerald-500";
    if (val >= 70) return "[&>div]:bg-blue-500";
    if (val >= 60) return "[&>div]:bg-amber-500";
    return "[&>div]:bg-rose-500";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Academic Performance"
        description={`Analytics and grading overview for ${profile.name}`}
        breadcrumbs={[
          { label: "Student Portal", href: "/student/dashboard" },
          { label: "Performance" },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-white/[0.08] bg-zinc-950 group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl transition-all group-hover:bg-rose-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Current GPA</p>
                <p className="text-2xl font-bold text-white">{profile.gpa.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-white/[0.08] bg-zinc-950 group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl transition-all group-hover:bg-orange-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                <Medal className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Class Rank</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-white">{profile.rank}</p>
                  <p className="text-xs text-zinc-500">/ {profile.totalStudents}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-white/[0.08] bg-zinc-950 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Attendance</p>
                <p className="text-2xl font-bold text-white">{profile.attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-white/[0.08] bg-zinc-950 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Subjects Passed</p>
                <p className="text-2xl font-bold text-white">6 <span className="text-sm font-normal text-zinc-500">/ 6</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* GPA Trend Chart */}
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-rose-500" /> GPA Progression
            </CardTitle>
            <CardDescription>Your performance trend over the academic year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockStudentGpaChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 5]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="gpa" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" activeDot={{ r: 6, fill: "#f43f5e", stroke: "#000", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject-wise Performance */}
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-orange-500" /> Subject Excellence
            </CardTitle>
            <CardDescription>Latest exam scores breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2">
              {results.slice(0, 5).map((res) => (
                <div key={res.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-zinc-200">{res.subject}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{res.total}%</span>
                      <Badge variant="outline" className="w-10 justify-center bg-white/5 border-0">{res.grade}</Badge>
                    </div>
                  </div>
                  <Progress value={res.total} className={`h-2 bg-zinc-800 ${getProgressColor(res.total)}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
