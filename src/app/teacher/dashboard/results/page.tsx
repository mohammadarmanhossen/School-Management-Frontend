"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockResults } from "@/lib/mock-data";
import type { ExamResult } from "@/types";

export default function ResultsPage() {
  const columns: ColumnDef<ExamResult>[] = [
    { accessorKey: "studentName", header: "Student" },
    { accessorKey: "examName", header: "Exam" },
    {
      accessorKey: "marksObtained",
      header: "Marks",
      cell: ({ row }) => `${row.original.marksObtained}/${row.original.totalMarks}`,
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => <Badge variant="success">{row.original.grade}</Badge>,
    },
    { accessorKey: "gpa", header: "GPA" },
    { accessorKey: "position", header: "Position" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Results" description="Exam results with Bangladesh grading system" breadcrumbs={[{ label: "Results" }]}
        actions={<Button>Publish Results</Button>} />
      <DataTable columns={columns} data={mockResults} />
    </div>
  );
}
