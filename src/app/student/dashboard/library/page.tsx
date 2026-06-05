"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookMarked, Wallet, AlertCircle, Clock, Search, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockBookIssues, mockLibraryFines, mockStudentProfile } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function StudentLibraryPage() {
  const profile = mockStudentProfile;
  const myIssues = mockBookIssues.filter((issue) => issue.memberId === "student-1");
  const myFines = mockLibraryFines.filter((fine) => fine.memberId === "student-1");
  
  const totalIssued = myIssues.filter(i => i.status === "issued").length;
  const totalOverdue = myIssues.filter(i => i.status === "overdue").length;
  const totalFinesAmt = myFines.filter(f => f.status === "unpaid").reduce((acc, f) => acc + f.amount, 0);

  const columns: ColumnDef<typeof myIssues[0]>[] = [
    {
      accessorKey: "bookTitle",
      header: "Book Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <BookOpen className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-zinc-200">{row.original.bookTitle}</p>
            <p className="text-xs text-zinc-500">ID: {row.original.bookId}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-zinc-400">
          <Clock className="h-4 w-4" />
          <span>{formatDate(row.original.issueDate)}</span>
        </div>
      ),
    },
    {
      accessorKey: "returnDate",
      header: "Due Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <span className={row.original.status === "overdue" ? "text-red-400" : "text-zinc-300"}>
            {formatDate(row.original.returnDate)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={status === "returned" ? "success" : status === "overdue" ? "destructive" : "default"}
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: () => {
        return (
          <Button variant="ghost" size="sm" className="hover:bg-white/5">
            View Details
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Digital Library"
          description={`Welcome back, ${profile.name}. Explore your reading history and current issues.`}
          breadcrumbs={[
            { label: "Student Portal", href: "/student/dashboard" },
            { label: "Library" },
          ]}
        />
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input 
              placeholder="Search library catalog..." 
              className="w-full pl-9 bg-zinc-950/50 border-white/[0.06] focus-visible:ring-blue-500 sm:w-64 rounded-full"
            />
          </div>
          <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
            Browse Books
          </Button>
        </div>
      </div>

      {/* Premium Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-blue-500/10 via-zinc-950 to-zinc-950 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl transition-all group-hover:bg-blue-500/30" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 shadow-inner shadow-blue-500/20">
                <BookMarked className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Currently Issued</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">{totalIssued}</p>
                  <span className="text-xs font-medium text-blue-400">Books</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-red-500/10 via-zinc-950 to-zinc-950 transition-all duration-300 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1 group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-red-500/20 blur-2xl transition-all group-hover:bg-red-500/30" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 shadow-inner shadow-red-500/20">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Overdue Returns</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">{totalOverdue}</p>
                  <span className="text-xs font-medium text-red-400">Needs attention</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-950 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 group">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl transition-all group-hover:bg-amber-500/30" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 shadow-inner shadow-amber-500/20">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Pending Fines</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white"><span className="text-xl">৳</span>{totalFinesAmt}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/[0.08] bg-zinc-950 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
          <CardTitle className="text-lg font-semibold text-white">Reading History & Issues</CardTitle>
          <CardDescription className="text-zinc-400">Track all your current and past library activities</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 py-4">
            <DataTable columns={columns} data={myIssues} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

