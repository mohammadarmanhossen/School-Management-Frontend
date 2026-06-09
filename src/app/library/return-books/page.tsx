"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useLibraryStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw, Search } from "lucide-react";
import type { LibraryIssue } from "@/types/library";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ReturnBooksPage() {
  const [mounted, setMounted] = useState(false);
  const { books, members, issues, returnBook } = useLibraryStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Only show active issues (not returned)
  const activeIssues = issues.filter(i => i.status !== "returned");

  const filteredIssues = activeIssues.filter(i => {
    const book = books.find(b => b.id === i.bookId);
    const mem = members.find(m => m.id === i.memberId);
    const term = searchTerm.toLowerCase();
    return (
      book?.title.toLowerCase().includes(term) ||
      mem?.name.toLowerCase().includes(term) ||
      i.id.toLowerCase().includes(term)
    );
  });

  const columns: ColumnDef<LibraryIssue>[] = [
    {
      accessorKey: "memberId",
      header: "Member",
      cell: ({ row }) => {
        const mem = members.find(m => m.id === row.original.memberId);
        return (
          <div>
            <p className="font-medium text-white">{mem?.name || "Unknown Member"}</p>
            <p className="text-xs text-zinc-500 capitalize">{mem?.role}</p>
          </div>
        );
      }
    },
    {
      accessorKey: "bookId",
      header: "Book Details",
      cell: ({ row }) => {
        const book = books.find(b => b.id === row.original.bookId);
        return (
          <div>
            <p className="font-medium text-zinc-300">{book?.title || "Unknown Book"}</p>
            <p className="text-xs text-zinc-500">ISBN: {book?.isbn}</p>
          </div>
        );
      }
    },
    {
      accessorKey: "issueDate",
      header: "Issued On",
      cell: ({ row }) => <span className="text-zinc-400">{formatDate(row.original.issueDate)}</span>
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const isOverdue = new Date() > new Date(row.original.dueDate);
        return (
          <span className={`font-medium ${isOverdue ? "text-red-400" : "text-zinc-300"}`}>
            {formatDate(row.original.dueDate)}
          </span>
        );
      }
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button 
          size="sm" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => returnBook(row.original.id)}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Return Book
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Return Books"
        description="Process returned books and calculate fines."
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Return Books" }]}
      />

      <Card className="dashboard-card border-white/5">
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input 
                placeholder="Search by member name, book title..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <DataTable columns={columns} data={filteredIssues} />
        </CardContent>
      </Card>
    </div>
  );
}
