"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useLibraryStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { BarChart3, AlertTriangle, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function LibraryReportsPage() {
  const [mounted, setMounted] = useState(false);
  const { books, issues, members } = useLibraryStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Most Issued Books Logic
  const issueCounts = issues.reduce((acc, issue) => {
    acc[issue.bookId] = (acc[issue.bookId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularBooksData = Object.keys(issueCounts).map(bookId => {
    const book = books.find(b => b.id === bookId);
    return {
      title: book?.title || "Unknown Book",
      author: book?.author || "Unknown",
      count: issueCounts[bookId]
    };
  }).sort((a, b) => b.count - a.count).slice(0, 5); // top 5

  const popularColumns: ColumnDef<any>[] = [
    { accessorKey: "title", header: "Book Title", cell: ({ row }) => <span className="font-medium text-white">{row.original.title}</span> },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "count", header: "Times Issued", cell: ({ row }) => <span className="font-bold text-blue-400">{row.original.count}</span> }
  ];

  // Overdue List Logic
  const overdueIssues = issues.filter(i => i.status === "overdue");
  const overdueColumns: ColumnDef<any>[] = [
    { 
      accessorKey: "member", 
      header: "Member", 
      cell: ({ row }) => {
        const mem = members.find(m => m.id === row.original.memberId);
        return <span className="font-medium text-white">{mem?.name || "Unknown"}</span>;
      }
    },
    { 
      accessorKey: "book", 
      header: "Book", 
      cell: ({ row }) => {
        const book = books.find(b => b.id === row.original.bookId);
        return <span className="text-zinc-300">{book?.title || "Unknown"}</span>;
      }
    },
    { 
      accessorKey: "dueDate", 
      header: "Due Date", 
      cell: ({ row }) => <span className="font-medium text-red-400">{formatDate(row.original.dueDate)}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Analytics & Reports"
        description="Insights, popular books, and overdue tracking."
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Reports" }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="dashboard-card border-white/5">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" /> Most Popular Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            {popularBooksData.length > 0 ? (
              <DataTable columns={popularColumns} data={popularBooksData} />
            ) : (
              <p className="text-sm text-zinc-500 py-4 text-center">No issuance data available.</p>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card border-white/5">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" /> Critical Overdue List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueIssues.length > 0 ? (
              <DataTable columns={overdueColumns} data={overdueIssues} />
            ) : (
              <p className="text-sm text-zinc-500 py-4 text-center">No overdue books at the moment! 🎉</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
