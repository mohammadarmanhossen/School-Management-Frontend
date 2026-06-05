"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Download, QrCode } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAttendance, mockClasses } from "@/lib/mock-data";
import { ATTENDANCE_STATUS } from "@/constants";
import type { AttendanceRecord, AttendanceStatus } from "@/types";
import { toast } from "sonner";

export default function AttendancePage() {
  const [classFilter, setClassFilter] = useState("all");

  const filtered = classFilter === "all"
    ? mockAttendance
    : mockAttendance.filter((a) => a.classId === classFilter);

  const columns: ColumnDef<AttendanceRecord>[] = [
    { accessorKey: "studentName", header: "Student" },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "date", header: "Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as AttendanceStatus;
        const config = ATTENDANCE_STATUS[status];
        return <Badge className={`${config.color} text-white border-0`}>{config.label}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Daily and monthly attendance management" breadcrumbs={[{ label: "Attendance" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><QrCode className="mr-2 h-4 w-4" /> QR Attendance</Button>
            <Button variant="outline" onClick={() => toast.success("Report exported")}><Download className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        } />
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-4">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by class" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {mockClasses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <DataTable columns={columns} data={filtered} />
        </TabsContent>
        <TabsContent value="monthly">
          <div className="rounded-xl border p-8 text-center text-muted-foreground">
            Monthly attendance report with charts will display here when connected to the API.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
