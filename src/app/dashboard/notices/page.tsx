"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockNotices } from "@/lib/mock-data";
import type { Notice } from "@/types";
import { formatDate } from "@/lib/utils";

export default function NoticesPage() {
  const columns: ColumnDef<Notice>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "author", header: "Author" },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const variants: Record<string, "destructive" | "warning" | "secondary" | "default"> = {
          urgent: "destructive", high: "warning", medium: "secondary", low: "default",
        };
        return <Badge variant={variants[row.original.priority]}>{row.original.priority}</Badge>;
      },
    },
    {
      accessorKey: "publishDate",
      header: "Published",
      cell: ({ row }) => formatDate(row.original.publishDate),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant="success">{row.original.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Notices" description="Create and publish school notices" breadcrumbs={[{ label: "Notices" }]}
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Create Notice</Button>} />
      <DataTable columns={columns} data={mockNotices} />
    </div>
  );
}
