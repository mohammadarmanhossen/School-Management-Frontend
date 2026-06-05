"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Users, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLibraryMembers, useBookIssues } from "@/modules/library/hooks/use-library-data";
import { formatCurrency } from "@/lib/utils";
import type { LibraryMember } from "@/types";

export default function LibraryMembersPage() {
  const { data: members = [], isLoading } = useLibraryMembers();
  const { data: issues = [] } = useBookIssues();

  const columns: ColumnDef<LibraryMember>[] = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "memberType",
      header: "Type",
      cell: ({ row }) => <span className="capitalize">{row.original.memberType}</span>,
    },
    {
      accessorKey: "cardNumber",
      header: "Library Card",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-blue-400" />
          <span className="font-mono text-sm">{row.original.cardNumber}</span>
        </div>
      ),
    },
    { accessorKey: "classOrDept", header: "Class / Dept." },
    { accessorKey: "booksIssued", header: "Books Issued" },
    {
      accessorKey: "totalFines",
      header: "Fines",
      cell: ({ row }) =>
        row.original.totalFines > 0 ? (
          <span className="text-amber-400">{formatCurrency(row.original.totalFines)}</span>
        ) : (
          <span className="text-zinc-500">—</span>
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "success" : "destructive"}>
          {row.original.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Members"
        description="Students and teachers with library membership"
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Members" }]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="dashboard-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-blue-500/15 p-3">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{members.length}</p>
              <p className="text-xs text-zinc-500">Total Members</p>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div>
              <p className="text-2xl font-bold text-white">
                {members.filter((m) => m.memberType === "student").length}
              </p>
              <p className="text-xs text-zinc-500">Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div>
              <p className="text-2xl font-bold text-white">
                {members.filter((m) => m.memberType === "teacher").length}
              </p>
              <p className="text-xs text-zinc-500">Teachers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={members} isLoading={isLoading} />

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-base text-white">Recent Borrow History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {issues.slice(0, 8).map((issue) => (
            <div
              key={issue.id}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] px-4 py-2.5 text-sm"
            >
              <span className="text-zinc-300">{issue.memberName}</span>
              <span className="text-zinc-500">{issue.bookTitle}</span>
              <Badge className="capitalize">{issue.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
