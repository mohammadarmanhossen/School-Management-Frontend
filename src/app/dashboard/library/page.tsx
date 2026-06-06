"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockBooks } from "@/lib/mock-data";
import type { Book } from "@/types";

export default function LibraryPage() {
  const columns: ColumnDef<Book>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "isbn", header: "ISBN" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "totalCopies", header: "Total" },
    {
      accessorKey: "availableCopies",
      header: "Available",
      cell: ({ row }) => (
        <Badge variant={row.original.availableCopies > 0 ? "success" : "destructive"}>
          {row.original.availableCopies}
        </Badge>
      ),
    },
    { accessorKey: "barcode", header: "Barcode" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Library" description="Book catalog, issue, and return management" breadcrumbs={[{ label: "Library" }]}
        actions={
          <Button asChild>
            <Link href="/dashboard/library/create">
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Link>
          </Button>
        } />
      <DataTable columns={columns} data={mockBooks} />
    </div>
  );
}
