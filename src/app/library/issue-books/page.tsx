"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useLibraryStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookMarked, User } from "lucide-react";
import type { LibraryIssue } from "@/types/library";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function IssueBooksPage() {
  const [mounted, setMounted] = useState(false);
  const { books, members, issues, issueBook } = useLibraryStore();
  
  const [formData, setFormData] = useState({ bookId: "", memberId: "", issueDate: new Date().toISOString().split("T")[0], dueDate: "" });

  useEffect(() => {
    setMounted(true);
    // set default due date to 14 days from now
    const due = new Date();
    due.setDate(due.getDate() + 14);
    setFormData(prev => ({ ...prev, dueDate: due.toISOString().split("T")[0] }));
  }, []);

  if (!mounted) return null;

  const handleIssue = () => {
    if (!formData.bookId || !formData.memberId || !formData.dueDate) return;
    
    issueBook({
      bookId: formData.bookId,
      memberId: formData.memberId,
      issueDate: new Date(formData.issueDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString()
    });
    
    // reset form
    setFormData(prev => ({ ...prev, bookId: "", memberId: "" }));
  };

  const columns: ColumnDef<LibraryIssue>[] = [
    {
      accessorKey: "bookId",
      header: "Book",
      cell: ({ row }) => {
        const book = books.find(b => b.id === row.original.bookId);
        return <span className="font-medium text-white">{book?.title || "Unknown Book"}</span>;
      }
    },
    {
      accessorKey: "memberId",
      header: "Member",
      cell: ({ row }) => {
        const mem = members.find(m => m.id === row.original.memberId);
        return <span className="text-zinc-300">{mem?.name || "Unknown Member"}</span>;
      }
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
      cell: ({ row }) => <span className="text-zinc-400">{formatDate(row.original.issueDate)}</span>
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => <span className="text-zinc-400">{formatDate(row.original.dueDate)}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color = 
          status === "issued" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
          status === "returned" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          "bg-red-500/10 text-red-400 border-red-500/20";
        return (
          <Badge variant="outline" className={`capitalize ${color}`}>
            {status}
          </Badge>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issue Books"
        description="Issue books to library members."
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Issue Books" }]}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="dashboard-card border-blue-500/20 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-blue-400" /> Issue New Book
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Select Member</label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.memberId}
                onChange={e => setFormData({...formData, memberId: e.target.value})}
              >
                <option value="">-- Choose Member --</option>
                {members.filter(m => m.status === "active").map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Select Book</label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.bookId}
                onChange={e => setFormData({...formData, bookId: e.target.value})}
              >
                <option value="">-- Choose Book --</option>
                {books.filter(b => b.availableCopies > 0).map(b => (
                  <option key={b.id} value={b.id}>{b.title} (Available: {b.availableCopies})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Issue Date</label>
              <Input 
                type="date"
                value={formData.issueDate}
                onChange={e => setFormData({...formData, issueDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Due Date</label>
              <Input 
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4" onClick={handleIssue}>
              Issue Book
            </Button>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-white/5 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={issues.filter(i => i.status !== "returned").reverse()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
