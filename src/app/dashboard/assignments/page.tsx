"use client";

import { useState, useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAssignmentsStorage } from "@/hooks/use-assignments-storage";
import type { Assignment } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AssignmentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { assignments, isLoaded, deleteAssignment } = useAssignmentsStorage();

  const filtered = useMemo(() =>
    assignments.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.className.toLowerCase().includes(search.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(search.toLowerCase())
    ), [assignments, search]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignment(id);
      toast.success("Assignment deleted successfully");
    }
  };

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
      cell: ({ row }) => {
        // Handle cases where totalStudents is not present, or handle standard 0/0
        const total = row.original.totalStudents || 0;
        return `${row.original.submissionCount || 0}/${total}`;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge>{row.original.status}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/assignments/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/assignments/edit/${row.original.id}`)}>
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
      <PageHeader title="Assignments" description="Create and track assignments" breadcrumbs={[{ label: "Assignments" }]}
        actions={
          <Button asChild>
            <Link href="/dashboard/assignments/create">
              <Plus className="mr-2 h-4 w-4" /> Create Assignment
            </Link>
          </Button>
        } />
      <SearchInput value={search} onChange={setSearch} placeholder="Search assignments..." className="sm:max-w-sm" />
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
