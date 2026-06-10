"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download, CheckCircle, XCircle, Clock } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { mockAttendance, mockStudentProfile } from "@/lib/mock-data";
import { ATTENDANCE_STATUS } from "@/constants";
import type { AttendanceRecord, AttendanceStatus } from "@/types";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentSubjectAttendance } from "@/features/student-attendance/student-subject-attendance";
import { ListTodo, BookOpen } from "lucide-react";

export default function StudentAttendancePage() {
  const profile = mockStudentProfile;

  const present = mockAttendance.filter(
    (a) => a.status === "present"
  ).length;

  const absent = mockAttendance.filter(
    (a) => a.status === "absent"
  ).length;

  const late = mockAttendance.filter(
    (a) => a.status === "late"
  ).length;

  const total = mockAttendance.length;
  const rate = Math.round((present / total) * 100);

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "date",
      header: "Date & Day",
      cell: ({ row }) => {
        const dateObj = new Date(row.original.date);
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[10px] font-bold uppercase text-blue-400 leading-none mb-0.5">
                {dateObj.toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="text-sm font-bold text-white leading-none">
                {dateObj.getDate()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-zinc-200">{formatDate(row.original.date)}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{dateObj.toLocaleDateString('en-US', { weekday: 'long' })}</p>
            </div>
          </div>
        );
      },
    },
    { 
      accessorKey: "className", 
      header: "Class Information",
      cell: ({ row }) => (
        <div className="py-1">
          <p className="font-medium text-white">{row.original.className}</p>
          <p className="text-xs text-zinc-400 mt-0.5">Regular Session</p>
        </div>
      )
    },
    {
      accessorKey: "status",
      header: "Attendance Status",
      cell: ({ row }) => {
        const status = row.original.status as AttendanceStatus;
        const config = ATTENDANCE_STATUS[status];
        
        let icon = <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
        if (status === "absent") icon = <XCircle className="w-3.5 h-3.5 mr-1.5" />;
        if (status === "late") icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
        
        // Convert tailwind color class to a softer background variant
        const bgClass = config.color.replace("bg-", "bg-opacity-10 text-").replace("500", "400").replace("text-white", "");
        const customColor = status === "present" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                           status === "absent" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                           status === "late" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                           "bg-blue-500/10 text-blue-400 border-blue-500/20";

        return (
          <Badge variant="outline" className={cn("capitalize px-2.5 py-1 text-xs font-medium tracking-wide flex w-fit items-center", customColor)}>
            {icon}
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: "remarks",
      header: "Remarks / Time",
      cell: ({ row }) => {
        const status = row.original.status;
        let remarks = "Arrived on time";
        let time = "08:00 AM";
        
        if (status === "absent") {
          remarks = "No reason provided";
          time = "--:--";
        } else if (status === "late") {
          remarks = "Traffic delay";
          time = "08:45 AM";
        } else if (status === "leave") {
          remarks = "Pre-approved medical leave";
          time = "--:--";
        }

        return (
          <div className="py-1">
            <p className="text-sm text-zinc-300 font-medium">{time}</p>
            <p className="text-xs text-zinc-500 mt-0.5 italic">{remarks}</p>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="My Attendance"
        description={`Attendance report for ${profile.name}`}
        breadcrumbs={[
          {
            label: "Student Portal",
            href: "/student/dashboard",
          },
          { label: "Attendance" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Report downloaded")
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto mb-2 h-6 w-6 text-green-500" />
            <p className="text-3xl font-bold">{present}</p>
            <p className="text-sm text-muted-foreground">
              Present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <XCircle className="mx-auto mb-2 h-6 w-6 text-red-500" />
            <p className="text-3xl font-bold">{absent}</p>
            <p className="text-sm text-muted-foreground">
              Absent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
            <p className="text-3xl font-bold">{late}</p>
            <p className="text-sm text-muted-foreground">
              Late
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-3xl font-bold">
              {rate}%
            </p>

            <p className="mb-2 text-center text-sm text-muted-foreground">
              Attendance Rate
            </p>

            <Progress value={rate} />
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="bg-white/[0.02] border border-white/[0.05] p-1 mb-6">
          <TabsTrigger value="daily" className="data-[state=active]:bg-white/[0.05]">
            <ListTodo className="w-4 h-4 mr-2" /> Daily Log
          </TabsTrigger>
          <TabsTrigger value="subject" className="data-[state=active]:bg-white/[0.05]">
            <BookOpen className="w-4 h-4 mr-2" /> Subject-wise Class
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6 animate-in fade-in duration-300">
          {/* MONTHLY PROGRESS */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex h-32 items-end gap-3">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                  (m, i) => (
                    <div
                      key={m}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <div
                        className="w-full rounded-t bg-primary/80"
                        style={{
                          height: `${60 + i * 6}%`,
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {m}
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* TABLE */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>

            <CardContent>
              <DataTable
                columns={columns}
                data={mockAttendance}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subject" className="animate-in fade-in duration-300">
          <StudentSubjectAttendance />
        </TabsContent>
      </Tabs>
    </div>
  );
}
