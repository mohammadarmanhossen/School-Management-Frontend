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
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

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

        return (
          <Badge className={`${config.color} text-white`}>
            {config.label}
          </Badge>
        );
      },
    },
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
    </div>
  );
}
