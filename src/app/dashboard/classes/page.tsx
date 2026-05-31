"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockClasses } from "@/lib/mock-data";
import type { ClassRoom } from "@/types";

export default function ClassesPage() {
  const columns: ColumnDef<ClassRoom>[] = [
    { accessorKey: "name", header: "Class Name" },
    { accessorKey: "grade", header: "Grade" },
    { accessorKey: "teacherName", header: "Class Teacher" },
    { accessorKey: "studentCount", header: "Students" },
    { accessorKey: "capacity", header: "Capacity" },
    {
      accessorKey: "academicYear",
      header: "Academic Year",
      cell: ({ row }) => <Badge variant="secondary">{row.original.academicYear}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description="Manage classes and sections" breadcrumbs={[{ label: "Classes" }]}
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Create Class</Button>} />
      <DataTable columns={columns} data={mockClasses} />
    </div>
  );
}
