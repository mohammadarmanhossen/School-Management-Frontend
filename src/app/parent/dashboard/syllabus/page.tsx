"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAttendance } from "@/lib/mock-data";
import { ATTENDANCE_STATUS } from "@/constants";
import type { AttendanceRecord, AttendanceStatus } from "@/types";
import { formatDate } from "@/lib/utils";


import { Progress } from "@/components/ui/progress";

export default function ParentAttendancePage() {


  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.date),
    },
    { accessorKey: "className", header: "Class" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as AttendanceStatus;
        const config = ATTENDANCE_STATUS[status];
        return <Badge className={`${config.color} border-0 text-white`}>{config.label}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Syllabus Status</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">Overall Completion</span>
              <span className="font-bold">75%</span>
            </div>
            <Progress value={75} />
          </div>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">34</p>
              <p className="text-sm text-muted-foreground">
                Completed Chapters
              </p>
            </div>

            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">
                Remaining Chapters
              </p>
            </div>

            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-muted-foreground">
                Upcoming Topics
              </p>
            </div>
          </div>

          {/* Subject Progress */}
          <div className="space-y-4">
            {[
              { subject: "Mathematics", progress: 85 },
              { subject: "English", progress: 75 },
              { subject: "Science", progress: 92 },
              { subject: "Bangla", progress: 68 },
              { subject: "ICT", progress: 55 },
            ].map((item) => (
              <div key={item.subject}>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium">
                    {item.subject}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.progress}%
                  </span>
                </div>

                <Progress value={item.progress} />
              </div>
            ))}
          </div>

          {/* Upcoming Chapters */}
          <div>
            <h4 className="mb-3 font-semibold">
              Upcoming Chapters
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md border p-3">
                <span>Mathematics - Trigonometry</span>
                <Badge>Next Week</Badge>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <span>Science - Electricity</span>
                <Badge>In Progress</Badge>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <span>English - Report Writing</span>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <DataTable columns={columns} data={mockAttendance} />
    </div>
  );
}
