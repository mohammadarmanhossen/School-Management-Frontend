"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, AlertCircle, Clock, PieChart, Activity, Calendar as CalendarIcon, BellRing, ArrowRight } from "lucide-react";
import { StudentHomeworkList } from "@/features/student-homework/student-homework-list";
import { StudentHomeworkAnalytics } from "@/features/student-homework/student-homework-analytics";
import { StudentHomeworkCalendar } from "@/features/student-homework/student-homework-calendar";
import { mockHomeworkAnalytics, mockStudentHomework } from "@/lib/mock-student-homework";
import { format, parseISO, isPast, isToday, isThisWeek } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function StudentHomeworkPage() {
  const pendingHw = mockStudentHomework.filter(hw => hw.status === "pending");
  const todayDue = pendingHw.filter(hw => isToday(parseISO(hw.dueDate)));
  const thisWeekDue = pendingHw.filter(hw => isThisWeek(parseISO(hw.dueDate)) && !isToday(parseISO(hw.dueDate)));

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Homework & Assignments" 
        description="Track your assignments, submit your work, and view teacher feedback." 
        breadcrumbs={[
          { label: "Student Dashboard", href: "/student/dashboard" },
          { label: "Homework" }
        ]}
      />

      {/* Top Stat Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-400"/> Total</div>
          <div className="text-xl sm:text-2xl font-bold">45</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-16 w-16 rounded-full bg-amber-500/10 blur-xl transition-all group-hover:bg-amber-500/20" />
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-amber-400"/> Pending</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">2</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-16 w-16 rounded-full bg-emerald-500/10 blur-xl transition-all group-hover:bg-emerald-500/20" />
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-emerald-400"/> Submitted</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">42</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-16 w-16 rounded-full bg-red-500/10 blur-xl transition-all group-hover:bg-red-500/20" />
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-red-400"/> Overdue</div>
          <div className="text-xl sm:text-2xl font-bold text-red-400">1</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
          <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 mb-2"><Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-purple-400"/> Next Deadline</div>
          <div className="text-sm font-bold text-purple-400 line-clamp-1">Tomorrow</div>
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center text-[10px] sm:text-xs text-blue-400 mb-2"><PieChart className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"/> Completion Rate</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-400">{mockHomeworkAnalytics.completionRate}%</div>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="bg-white/[0.02] border border-white/[0.05] p-1 mb-6 flex-wrap h-auto justify-start">
              <TabsTrigger value="list" className="data-[state=active]:bg-white/[0.05]"><FileText className="w-4 h-4 mr-2" /> List View</TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-white/[0.05]"><CalendarIcon className="w-4 h-4 mr-2" /> Calendar View</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white/[0.05]"><Activity className="w-4 h-4 mr-2" /> Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6 animate-in fade-in duration-300">
              <StudentHomeworkList />
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6 animate-in fade-in duration-300">
              <StudentHomeworkCalendar />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 animate-in fade-in duration-300">
              <StudentHomeworkAnalytics />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar / Upcoming Deadlines */}
        <div className="space-y-6">
          <Card className="dashboard-card border-white/[0.08]">
            <CardHeader className="pb-3 border-b border-white/[0.05]">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BellRing className="h-4 w-4 text-amber-400" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Due Today</h4>
                {todayDue.length > 0 ? todayDue.map(hw => (
                  <div key={hw.id} className="p-3 mb-2 rounded-lg border border-red-500/20 bg-red-500/5 group cursor-pointer transition-colors hover:bg-red-500/10">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-medium text-white line-clamp-1">{hw.title}</p>
                      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] px-1 py-0 uppercase">Urgent</Badge>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">{hw.subject}</p>
                    <div className="flex items-center text-xs font-medium text-red-400">
                      <Clock className="h-3 w-3 mr-1" /> {format(parseISO(hw.dueDate), "hh:mm a")}
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-zinc-500 italic">No assignments due today.</p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">This Week</h4>
                {thisWeekDue.length > 0 ? thisWeekDue.map(hw => (
                  <div key={hw.id} className="p-3 mb-2 rounded-lg border border-white/[0.08] bg-white/[0.02] group cursor-pointer transition-colors hover:bg-white/[0.04]">
                    <p className="text-sm font-medium text-white line-clamp-1 mb-1">{hw.title}</p>
                    <p className="text-xs text-zinc-400 mb-2">{hw.subject}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-300">
                        {format(parseISO(hw.dueDate), "MMM dd")}
                      </span>
                      <ArrowRight className="h-3 w-3 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-zinc-500 italic">No more assignments this week.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card border-white/[0.08]">
            <CardHeader className="pb-3 border-b border-white/[0.05]">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Recent Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mockStudentHomework.filter(hw => hw.status === "reviewed").slice(0, 2).map(hw => (
                <div key={hw.id} className="p-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5">
                  <p className="text-xs text-emerald-400 font-medium mb-1">{hw.subject}</p>
                  <p className="text-sm text-white font-medium line-clamp-1 mb-2">{hw.title}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] text-zinc-400 italic line-clamp-2 pr-2">"{hw.feedback}"</p>
                    <span className="text-sm font-bold text-emerald-400 shrink-0">{hw.obtainedMarks}/{hw.totalMarks}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
