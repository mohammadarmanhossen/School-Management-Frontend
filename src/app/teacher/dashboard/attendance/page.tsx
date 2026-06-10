"use client";

import { useState } from "react";
import { Download, Search, Users, UserCheck, UserX, Clock, FileBarChart, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAttendanceStore } from "@/store/attendance-store";
import type { AttendanceRecord, AttendanceStatus } from "@/types";

import { TeacherAttendanceAnalytics } from "@/features/teacher-attendance/teacher-attendance-analytics";
import { TeacherAttendanceForm } from "@/features/teacher-attendance/teacher-attendance-form";

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string }> = {
  present: { label: "Present", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  absent: { label: "Absent", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  late: { label: "Late", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  leave: { label: "Leave", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  half_day: { label: "Half Day", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  excused: { label: "Excused", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

export default function TeacherAttendancePage() {
  const { records, deleteRecord } = useAttendanceStore();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Filters for history
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const today = new Date().toISOString().split("T")[0];
  const todaysRecords = records.filter(r => r.date === today);

  // Stats
  const totalStudents = 149; // Mock total for teacher's classes
  const presentToday = todaysRecords.filter(r => ["present", "late", "half_day"].includes(r.status)).length;
  const absentToday = todaysRecords.filter(r => r.status === "absent").length;
  const lateToday = todaysRecords.filter(r => r.status === "late").length;
  const leaveToday = todaysRecords.filter(r => ["leave", "excused"].includes(r.status)).length;
  const attendanceRate = totalStudents ? Math.round((presentToday / totalStudents) * 100) : 0;
  const atRiskStudents = 3;

  const filteredHistory = records.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: ColumnDef<AttendanceRecord>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "studentName", header: "Student", cell: ({ row }) => <span className="font-semibold">{row.original.studentName}</span> },
    { accessorKey: "rollNumber", header: "Roll No" },
    { accessorKey: "className", header: "Class" },
    { 
      accessorKey: "status", 
      header: "Status", 
      cell: ({ row }) => {
        const conf = STATUS_CONFIG[row.original.status];
        return <Badge variant="outline" className={conf.color}>{conf.label}</Badge>;
      } 
    },
    { accessorKey: "remarks", header: "Remarks", cell: ({ row }) => row.original.remarks || "-" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => {
          if (confirm("Delete this attendance record?")) {
            deleteRecord(row.original.id);
            toast.success("Record deleted");
          }
        }}>
          Delete
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Attendance Management" 
        description="Mark, edit, and analyze student attendance across your classes." 
        breadcrumbs={[
          { label: "Teacher Dashboard", href: "/teacher/dashboard" },
          { label: "Attendance" }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/[0.02]" onClick={() => toast.success("Report Exported to Excel")}><Download className="mr-2 h-4 w-4" /> Export Report</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("mark")}><UserCheck className="mr-2 h-4 w-4" /> Mark Attendance</Button>
          </div>
        } 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/[0.02] border border-white/[0.05] p-1 h-auto flex flex-wrap">
          <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-white/[0.06]">Overview & Analytics</TabsTrigger>
          <TabsTrigger value="mark" className="py-2 data-[state=active]:bg-white/[0.06]">Mark Attendance</TabsTrigger>
          <TabsTrigger value="history" className="py-2 data-[state=active]:bg-white/[0.06]">History & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><Users className="h-4 w-4 mr-2 text-blue-400"/> Total Students</div>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><UserCheck className="h-4 w-4 mr-2 text-emerald-400"/> Present Today</div>
              <div className="text-2xl font-bold">{presentToday}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><UserX className="h-4 w-4 mr-2 text-red-400"/> Absent Today</div>
              <div className="text-2xl font-bold">{absentToday}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><Clock className="h-4 w-4 mr-2 text-amber-400"/> Late Students</div>
              <div className="text-2xl font-bold">{lateToday}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><FileBarChart className="h-4 w-4 mr-2 text-purple-400"/> Today's Rate</div>
              <div className="text-2xl font-bold">{attendanceRate}%</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center bg-red-500/5 border-red-500/20">
              <div className="flex items-center text-red-400 mb-2"><AlertTriangle className="h-4 w-4 mr-2"/> At Risk</div>
              <div className="text-2xl font-bold text-red-500">{atRiskStudents}</div>
            </Card>
          </div>

          <TeacherAttendanceAnalytics />
        </TabsContent>

        <TabsContent value="mark" className="space-y-4 animate-in fade-in duration-300">
          <TeacherAttendanceForm />
        </TabsContent>

        <TabsContent value="history" className="space-y-4 animate-in fade-in duration-300">
          <div className="dashboard-card p-4 rounded-xl border border-white/[0.08]">
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
               <div className="relative w-full md:w-[350px]">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                 <Input 
                   placeholder="Search student or class..." 
                   className="pl-9 bg-white/[0.02] border-white/[0.08]" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-white/[0.02] border-white/[0.08]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="half_day">Half Day</SelectItem>
                      <SelectItem value="excused">Excused</SelectItem>
                      <SelectItem value="leave">Leave</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>
            <DataTable columns={columns} data={filteredHistory} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
