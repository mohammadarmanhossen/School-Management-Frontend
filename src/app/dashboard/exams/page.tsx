"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockExams } from "@/lib/mock-data";
import { EXAM_TYPES } from "@/constants";
import type { Exam } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ExamsPage() {
  const columns: ColumnDef<Exam>[] = [
    { accessorKey: "name", header: "Exam Name" },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => EXAM_TYPES[row.original.type],
    },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "subjectName", header: "Subject" },
    {
      accessorKey: "examDate",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.examDate),
    },
    { accessorKey: "totalMarks", header: "Total Marks" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={row.original.status === "scheduled" ? "warning" : "success"}>{row.original.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Exams" description="Create and manage examinations" breadcrumbs={[{ label: "Exams" }]}
        actions={
          <Button asChild>
            <Link href="/dashboard/exams/create">
              <Plus className="mr-2 h-4 w-4" /> Create Exam
            </Link>
          </Button>
        } />
      <DataTable columns={columns} data={mockExams} />
    </div>
  );
}
