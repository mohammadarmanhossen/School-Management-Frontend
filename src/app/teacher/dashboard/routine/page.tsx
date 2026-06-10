"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, BookOpen, UserCheck, FlaskConical, Users, FileSignature, Activity } from "lucide-react";
import { TeacherWeeklyGrid } from "@/features/teacher-routine/teacher-weekly-grid";
import { TeacherTodaySchedule } from "@/features/teacher-routine/teacher-today-schedule";
import { TeacherDutiesList } from "@/features/teacher-routine/teacher-duties-list";
import { TeacherWorkloadAnalytics } from "@/features/teacher-routine/teacher-workload-analytics";

// Hardcoded for mock purposes
const TEACHER_ID = "teacher-1";

export default function TeacherRoutinePage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="My Routine & Work Schedule" 
        description="Manage your daily classes, lab sessions, meetings, duties, and workload analytics in one place." 
        breadcrumbs={[
          { label: "Teacher Dashboard", href: "/teacher/dashboard" },
          { label: "Routine & Schedule" }
        ]}
      />

      {/* Top Stat Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-400"/> Today's Classes</div>
          <div className="text-xl sm:text-2xl font-bold">3</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-emerald-400"/> Weekly Hours</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">18</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-zinc-400"/> Free Periods</div>
          <div className="text-xl sm:text-2xl font-bold text-zinc-300">12</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><FlaskConical className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-cyan-400"/> Lab Sessions</div>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400">4</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-purple-400"/> Meetings</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-400">3</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><FileSignature className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-amber-400"/> Other Duties</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">5</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center text-[10px] sm:text-xs text-blue-400 mb-2"><Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"/> Next Up</div>
          <div className="text-sm sm:text-base font-bold text-blue-400 line-clamp-1" title="Class 10 Physics Lab">Physics Lab</div>
        </Card>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="bg-white/[0.02] border border-white/[0.05] p-1 mb-6 flex-wrap h-auto justify-start">
          <TabsTrigger value="today" className="data-[state=active]:bg-white/[0.05]"><Clock className="w-4 h-4 mr-2" /> Today's Agenda</TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-white/[0.05]"><CalendarIcon className="w-4 h-4 mr-2" /> Weekly Routine</TabsTrigger>
          <TabsTrigger value="duties" className="data-[state=active]:bg-white/[0.05]"><FileSignature className="w-4 h-4 mr-2" /> Labs, Duties & Meetings</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white/[0.05]"><Activity className="w-4 h-4 mr-2" /> Workload Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TeacherTodaySchedule teacherId={TEACHER_ID} />
            </div>
            <div className="space-y-6">
              <Card className="dashboard-card border-white/[0.08]">
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Administrative Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg border border-white/[0.08] bg-white/[0.02] flex justify-between items-center">
                    <div>
                      <h5 className="font-medium text-sm text-white">Marks Entry</h5>
                      <p className="text-xs text-zinc-400">Class 10 Mid-Term</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">Pending</Badge>
                  </div>
                  <div className="p-3 rounded-lg border border-white/[0.08] bg-white/[0.02] flex justify-between items-center">
                    <div>
                      <h5 className="font-medium text-sm text-white">Assignment Review</h5>
                      <p className="text-xs text-zinc-400">Class 9 Physics</p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Completed</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4 animate-in fade-in duration-300">
          <TeacherWeeklyGrid teacherId={TEACHER_ID} />
        </TabsContent>

        <TabsContent value="duties" className="space-y-4 animate-in fade-in duration-300">
          <TeacherDutiesList />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 animate-in fade-in duration-300">
          <TeacherWorkloadAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
