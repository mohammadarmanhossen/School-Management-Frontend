"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useStudentsStorage } from "@/hooks/use-students-storage";
import { getInitials } from "@/lib/utils";
import type { Student } from "@/types";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function StudentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { students, isLoaded, deleteStudent } = useStudentsStorage();

  const filtered = useMemo(() =>
    students.filter((s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase())
    ), [students, search]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(id);
      toast.success("Student deleted successfully");
    }
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "fullName",
      header: "Student",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(row.original.fullName)}</AvatarFallback></Avatar>
          <div>
            <p className="font-medium">{row.original.fullName}</p>
            <p className="text-xs text-muted-foreground">{row.original.studentId}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "sectionName", header: "Section" },
    { accessorKey: "rollNumber", header: "Roll" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'}>{row.original.status}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/students/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/students/edit/${row.original.id}`)}>
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
      <PageHeader title="Students" description="Manage student records" breadcrumbs={[{ label: "Students" }]}
        actions={<Button asChild><Link href="/dashboard/students/create"><Plus className="mr-2 h-4 w-4" /> Add Student</Link></Button>} />
      <SearchInput value={search} onChange={setSearch} placeholder="Search students..." className="sm:max-w-sm" />
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
