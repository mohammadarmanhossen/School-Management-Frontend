"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeacherReportsAnalytics } from "@/features/teacher-reports/teacher-reports-analytics";
import { TeacherReportsList } from "@/features/teacher-reports/teacher-reports-list";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, BookOpen, CheckSquare, GraduationCap, TrendingUp, AlertTriangle } from "lucide-react";
import { mockTeacherStats } from "@/lib/mock-data";

export default function TeacherReportsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Reports & Analytics" 
        description="Monitor class performance, track attendance, and generate professional academic reports." 
        breadcrumbs={[
          { label: "Teacher Dashboard", href: "/teacher/dashboard" },
          { label: "Reports" }
        ]}
      />

      {/* Top Stat Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-zinc-400 mb-2"><Users className="h-4 w-4 mr-2 text-blue-400"/> Total Students</div>
          <div className="text-2xl font-bold">{mockTeacherStats.totalStudents}</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-zinc-400 mb-2"><UserCheck className="h-4 w-4 mr-2 text-emerald-400"/> Avg Attendance</div>
          <div className="text-2xl font-bold text-emerald-400">92.4%</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-zinc-400 mb-2"><GraduationCap className="h-4 w-4 mr-2 text-purple-400"/> Avg Class GPA</div>
          <div className="text-2xl font-bold">4.2</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-zinc-400 mb-2"><CheckSquare className="h-4 w-4 mr-2 text-amber-400"/> Assignments Done</div>
          <div className="text-2xl font-bold text-amber-400">91%</div>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="bg-white/[0.02] border border-white/[0.05] p-1 mb-6">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white/[0.05]">Performance Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white/[0.05]">Generate Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6 animate-in fade-in duration-300">
          <TeacherReportsAnalytics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 animate-in fade-in duration-300">
          <TeacherReportsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
