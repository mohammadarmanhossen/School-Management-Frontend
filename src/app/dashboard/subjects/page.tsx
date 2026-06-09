"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useSubjectsStorage } from "@/hooks/use-subjects-storage";
import type { Subject } from "@/types";
import { toast } from "sonner";

export default function SubjectsPage() {
  const router = useRouter();
  const { subjects, isLoaded, deleteSubject } = useSubjectsStorage();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      deleteSubject(id);
      toast.success("Subject deleted successfully");
    }
  };

  const columns: ColumnDef<Subject>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Subject Name" },
    { accessorKey: "credits", header: "Credits" },
    { accessorKey: "teacherName", header: "Teacher" },
    { accessorKey: "className", header: "Class" },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/subjects/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/subjects/edit/${row.original.id}`)}>
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
      <PageHeader title="Subjects" description="Manage subjects and teacher assignments" breadcrumbs={[{ label: "Subjects" }]}
        actions={
          <Button asChild>
            <Link href="/dashboard/subjects/create">
              <Plus className="mr-2 h-4 w-4" /> Add Subject
            </Link>
          </Button>
        } />
      <DataTable columns={columns} data={subjects} />
    </div>
  );
}
