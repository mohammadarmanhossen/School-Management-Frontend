"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useExamsStorage } from "@/hooks/use-exams-storage";
import { EXAM_TYPES } from "@/constants";
import type { Exam } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ExamsPage() {
  const router = useRouter();
  const { exams, isLoaded, deleteExam } = useExamsStorage();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      deleteExam(id);
      toast.success("Exam deleted successfully");
    }
  };

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
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/exams/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/exams/edit/${row.original.id}`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950 dark:focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

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
      <DataTable columns={columns} data={exams} />
    </div>
  );
}
