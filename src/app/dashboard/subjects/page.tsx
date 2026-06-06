"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { mockSubjects } from "@/lib/mock-data";
import type { Subject } from "@/types";

export default function SubjectsPage() {
  const columns: ColumnDef<Subject>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Subject Name" },
    { accessorKey: "credits", header: "Credits" },
    { accessorKey: "teacherName", header: "Teacher" },
    { accessorKey: "className", header: "Class" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Subjects" description="Manage subjects and teacher assignments" breadcrumbs={[{ label: "Subjects" }]}
        actions={
          <Button asChild>
            <Link href="/dashboard/subjects/create">
              <Plus className="mr-2 h-4 w-4" /> Add Subject
            </Link>
          </Button>
        } />
      <DataTable columns={columns} data={mockSubjects} />
    </div>
  );
}
