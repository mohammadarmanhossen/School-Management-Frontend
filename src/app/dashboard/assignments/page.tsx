"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAssignments } from "@/lib/mock-data";
import type { Assignment } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AssignmentsPage() {
  const columns: ColumnDef<Assignment>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "subjectName", header: "Subject" },
    { accessorKey: "teacherName", header: "Teacher" },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => formatDate(row.original.dueDate),
    },
    {
      accessorKey: "submissionCount",
      header: "Submissions",
      cell: ({ row }) => `${row.original.submissionCount}/${row.original.totalStudents}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge>{row.original.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Create and track assignments" breadcrumbs={[{ label: "Assignments" }]}
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Create Assignment</Button>} />
      <DataTable columns={columns} data={mockAssignments} />
    </div>
  );
}
