"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useBookStore } from "@/store";
import type { Book } from "@/types";

export default function LibraryPage() {
  const books = useBookStore((state) => state.books);
  const deleteBook = useBookStore((state) => state.deleteBook);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.isbn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<Book>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "isbn", header: "ISBN" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "totalCopies", header: "Total" },
    {
      accessorKey: "availableCopies",
      header: "Available",
      cell: ({ row }) => (
        <Badge variant={row.original.availableCopies > 0 ? "success" : "destructive"}>
          {row.original.availableCopies}
        </Badge>
      ),
    },
    { accessorKey: "barcode", header: "Barcode" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/library/edit/${row.original.id}`}>
              <Edit className="h-4 w-4 text-blue-400" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Are you sure you want to delete this book?")) {
                deleteBook(row.original.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Library" description="Book catalog, issue, and return management" breadcrumbs={[{ label: "Library" }]}
        actions={
          <Button asChild>
            <Link href="/dashboard/library/create">
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Link>
          </Button>
        } />
      <div className="flex justify-start mb-4">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input 
            placeholder="Search books, author, or ISBN..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredBooks} />
    </div>
  );
}
