"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { mockSections } from "@/lib/mock-data";
import type { Section } from "@/types";

export default function SectionsPage() {
  const columns: ColumnDef<Section>[] = [
    { accessorKey: "name", header: "Section" },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "studentCount", header: "Students" },
    { accessorKey: "capacity", header: "Capacity" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Sections" description="Manage class sections" breadcrumbs={[{ label: "Classes", href: "/dashboard/classes" }, { label: "Sections" }]}
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Create Section</Button>} />
      <DataTable columns={columns} data={mockSections} />
    </div>
  );
}
