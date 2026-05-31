"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockTeachers } from "@/lib/mock-data";
import { getInitials, formatCurrency } from "@/lib/utils";
import type { Teacher } from "@/types";
import { useState, useMemo } from "react";

export default function TeachersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() =>
    mockTeachers.filter((t) =>
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: "fullName",
      header: "Teacher",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(row.original.fullName)}</AvatarFallback></Avatar>
          <div>
            <p className="font-medium">{row.original.fullName}</p>
            <p className="text-xs text-muted-foreground">{row.original.employeeId}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "specialization", header: "Specialization" },
    { accessorKey: "qualification", header: "Qualification" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => formatCurrency(row.original.salary),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant="success">{row.original.status}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/teachers/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> View Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" description="Manage teaching staff" breadcrumbs={[{ label: "Teachers" }]}
        actions={<Button asChild><Link href="/dashboard/teachers/create"><Plus className="mr-2 h-4 w-4" /> Add Teacher</Link></Button>} />
      <SearchInput value={search} onChange={setSearch} placeholder="Search teachers..." className="sm:max-w-sm" />
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
