// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { Download } from "lucide-react";
// import { PageHeader } from "@/components/shared/page-header";
// import { DataTable } from "@/components/shared/data-table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { mockAttendance, mockParentChildren } from "@/lib/mock-data";
// import { ATTENDANCE_STATUS } from "@/constants";
// import type { AttendanceRecord, AttendanceStatus } from "@/types";
// import { formatDate } from "@/lib/utils";
// import { toast } from "sonner";

// export default function ParentAttendancePage() {
//   const child = mockParentChildren[0];
//   const present = mockAttendance.filter((a) => a.status === "present").length;
//   const total = mockAttendance.length;
//   const rate = Math.round((present / total) * 100);

//   const columns: ColumnDef<AttendanceRecord>[] = [
//     {
//       accessorKey: "date",
//       header: "Date",
//       cell: ({ row }) => formatDate(row.original.date),
//     },
//     { accessorKey: "className", header: "Class" },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const status = row.original.status as AttendanceStatus;
//         const config = ATTENDANCE_STATUS[status];
//         return <Badge className={`${config.color} border-0 text-white`}>{config.label}</Badge>;
//       },
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Attendance"
//         description={`Attendance history for ${child.name}`}
//         breadcrumbs={[
//           { label: "Parent Portal", href: "/parent/dashboard" },
//           { label: "Attendance" },
//         ]}
//         actions={
//           <Button variant="outline" size="sm" onClick={() => toast.success("Report downloaded")}>
//             <Download className="mr-2 h-4 w-4" /> Export Report
//           </Button>
//         }
//       />

//       <div className="grid gap-4 sm:grid-cols-4">
//         {[
//           { label: "Attendance Rate", value: `${rate}%` },
//           { label: "Present", value: present },
//           { label: "Absent", value: mockAttendance.filter((a) => a.status === "absent").length },
//           { label: "Late", value: mockAttendance.filter((a) => a.status === "late").length },
//         ].map((s) => (
//           <Card key={s.label}>
//             <CardContent className="pt-6 text-center">
//               <p className="text-2xl font-bold">{s.value}</p>
//               <p className="text-sm text-muted-foreground">{s.label}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-base">Monthly Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex h-32 items-end gap-2">
//             {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
//               <div key={m} className="flex flex-1 flex-col items-center gap-1">
//                 <div
//                   className="w-full rounded-t bg-primary/80 transition-all"
//                   style={{ height: `${75 + i * 4}%` }}
//                 />
//                 <span className="text-xs text-muted-foreground">{m}</span>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       <DataTable columns={columns} data={mockAttendance} />
//     </div>
//   );
// }



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

import { mockAttendance, mockParentChildren } from "@/lib/mock-data";
import { ATTENDANCE_STATUS } from "@/constants";
import type { AttendanceRecord, AttendanceStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ParentAttendancePage() {
  const child = mockParentChildren[0];

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
        title="Attendance"
        description={`Attendance report of ${child.name}`}
        breadcrumbs={[
          {
            label: "Parent Portal",
            href: "/parent/dashboard",
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