"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Download, Trash2, Eye, Pencil, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockStudents, filterItems, paginate } from "@/lib/mock-data";
import { getInitials, exportToCSV } from "@/lib/utils";
import type { Student } from "@/types";
import { toast } from "sonner";

export default function StudentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Student[]>([]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let items = filterItems(mockStudents, search, ["fullName", "studentId", "email", "className"]);
    if (statusFilter !== "all") {
      items = items.filter((s) => s.status === statusFilter);
    }
    return items;
  }, [search, statusFilter]);

  const paginated = paginate(filtered, page, 10);

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "studentId",
      header: "Student ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{getInitials(row.original.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.fullName}</p>
            <p className="text-xs text-muted-foreground">{row.original.studentId}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "rollNumber", header: "Roll" },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "sectionName", header: "Section" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "success" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/students/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/students/edit/${row.original.id}`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleExport = () => {
    exportToCSV(filtered, "students.csv", [
      { key: "studentId", label: "Student ID" },
      { key: "fullName", label: "Name" },
      { key: "className", label: "Class" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" },
    ]);
    toast.success("Exported to CSV");
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    toast.success(`Deleted ${selected.length} students`);
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage all student records"
        breadcrumbs={[{ label: "Students" }]}
        actions={
          <Button asChild>
            <Link href="/dashboard/students/create">
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search students..." className="sm:max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          {selected.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete ({selected.length})
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginated.results}
        enableSelection
        onSelectionChange={setSelected}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {paginated.results.length} of {paginated.count} students</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={!paginated.next} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
