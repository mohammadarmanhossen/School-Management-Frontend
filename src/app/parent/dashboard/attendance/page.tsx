"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useParentStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ParentChildAttendance } from "@/types/parent";

export default function AttendancePage() {
  const [mounted, setMounted] = useState(false);
  const { children, selectedChildId, attendance } = useParentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const child = children.find((c) => c.id === selectedChildId);
  if (!child) return null;

  const records = attendance[child.id] || [];
  
  const presentCount = records.filter(r => r.status === "present").length;
  const absentCount = records.filter(r => r.status === "absent").length;
  const lateCount = records.filter(r => r.status === "late").length;
  const totalDays = records.length;
  const attendancePercentage = totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 100) : 0;

  const columns: ColumnDef<ParentChildAttendance>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <span className="font-medium text-white">{formatDate(row.original.date)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color = 
          status === "present" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          status === "absent" ? "bg-red-500/10 text-red-400 border-red-500/20" :
          "bg-amber-500/10 text-amber-400 border-amber-500/20";
        return (
          <Badge variant="outline" className={`capitalize ${color}`}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: ({ row }) => <span className="text-zinc-400">{row.original.remarks || "—"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Records"
        description={`View attendance history for ${child.name}.`}
        breadcrumbs={[{ label: "Parent Dashboard", href: "/parent/dashboard" }, { label: "Attendance" }]}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-emerald-500/10 to-zinc-950">
          <CardContent className="p-6 text-center">
            <ClipboardCheck className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
            <p className="text-sm font-medium text-zinc-400">Present</p>
            <h3 className="text-3xl font-bold text-white">{presentCount}</h3>
          </CardContent>
        </Card>
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-red-500/10 to-zinc-950">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-400" />
            <p className="text-sm font-medium text-zinc-400">Absent</p>
            <h3 className="text-3xl font-bold text-white">{absentCount}</h3>
          </CardContent>
        </Card>
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-amber-500/10 to-zinc-950">
          <CardContent className="p-6 text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-amber-400" />
            <p className="text-sm font-medium text-zinc-400">Late</p>
            <h3 className="text-3xl font-bold text-white">{lateCount}</h3>
          </CardContent>
        </Card>
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-blue-500/10 to-zinc-950">
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
              <span className="text-sm font-bold text-blue-400">%</span>
            </div>
            <p className="text-sm font-medium text-zinc-400">Overall</p>
            <h3 className="text-3xl font-bold text-white">{attendancePercentage}%</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card border-white/5">
        <CardHeader>
          <CardTitle className="text-lg text-white">Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={records} />
        </CardContent>
      </Card>
    </div>
  );
}
