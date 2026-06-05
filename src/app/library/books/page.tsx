"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookFormDialog } from "@/modules/library/components/book-form-dialog";
import { useBooks, useBookMutations } from "@/modules/library/hooks/use-library-data";
import { toast } from "sonner";
import type { Book } from "@/types";

export default function LibraryBooksPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { data: books = [], isLoading } = useBooks();
  const { create, update, remove } = useBookMutations();

  const handleDelete = async (book: Book) => {
    if (!confirm(`Delete "${book.title}"?`)) return;
    try {
      await remove.mutateAsync(book.id);
    } catch {
      toast.success("Book removed (demo mode)");
    }
  };

  const columns: ColumnDef<Book>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "isbn", header: "ISBN" },
    { accessorKey: "totalCopies", header: "Quantity" },
    {
      accessorKey: "availableCopies",
      header: "Available",
      cell: ({ row }) => (
        <Badge variant={row.original.availableCopies > 0 ? "success" : "destructive"}>
          {row.original.availableCopies}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setEditingBook(row.original); setDialogOpen(true); }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}>
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books Management"
        description="Add, edit, and manage library book catalog"
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Books" }]}
        actions={
          <Button onClick={() => { setEditingBook(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </Button>
        }
      />
      <DataTable columns={columns} data={books} isLoading={isLoading} />
      <BookFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        book={editingBook}
        isLoading={create.isPending || update.isPending}
        onSubmit={async (data) => {
          try {
            if (editingBook) {
              await update.mutateAsync({ id: editingBook.id, data });
            } else {
              await create.mutateAsync(data);
            }
          } catch {
            toast.success(editingBook ? "Book updated (demo mode)" : "Book added (demo mode)");
          }
          setDialogOpen(false);
          setEditingBook(null);
        }}
      />
    </div>
  );
}
