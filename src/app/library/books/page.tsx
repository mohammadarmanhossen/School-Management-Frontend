"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useLibraryStore } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search, Book } from "lucide-react";
import type { LibraryBook } from "@/types/library";

export default function LibraryBooksPage() {
  const [mounted, setMounted] = useState(false);
  const { books, categories, addBook, updateBook, deleteBook } = useLibraryStore();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Basic states for a custom inline form or a modal state
  // In a real app we would use shadcn Dialog, but for this component we'll keep it simple
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", isbn: "", categoryId: "", totalCopies: 1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSave = () => {
    if (!formData.title || !formData.author || !formData.isbn) return;
    
    if (isEditing) {
      updateBook(isEditing, formData);
      setIsEditing(null);
    } else {
      addBook(formData);
      setIsAdding(false);
    }
    setFormData({ title: "", author: "", isbn: "", categoryId: "", totalCopies: 1 });
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn.includes(searchTerm)
  );

  const columns: ColumnDef<LibraryBook>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <Book className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-white">{row.original.title}</p>
            <p className="text-xs text-zinc-500">{row.original.isbn}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <span className="text-zinc-300">{row.original.author}</span>
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => {
        const cat = categories.find(c => c.id === row.original.categoryId);
        return <span className="text-zinc-400">{cat?.name || "Uncategorized"}</span>;
      }
    },
    {
      accessorKey: "inventory",
      header: "Inventory",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{row.original.availableCopies} <span className="text-zinc-500 font-normal">/ {row.original.totalCopies}</span></span>
        </div>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            onClick={() => {
              setFormData({ ...row.original });
              setIsEditing(row.original.id);
              setIsAdding(false);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => deleteBook(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books Directory"
        description="Manage the library's book inventory."
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Books" }]}
      />

      {(isAdding || isEditing) && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              {isEditing ? "Edit Book" : "Add New Book"}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Input 
                placeholder="Book Title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <Input 
                placeholder="Author" 
                value={formData.author} 
                onChange={e => setFormData({...formData, author: e.target.value})}
              />
              <Input 
                placeholder="ISBN" 
                value={formData.isbn} 
                onChange={e => setFormData({...formData, isbn: e.target.value})}
              />
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <Input 
                type="number" 
                placeholder="Total Copies" 
                value={formData.totalCopies} 
                onChange={e => setFormData({...formData, totalCopies: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Book</Button>
              <Button variant="ghost" onClick={() => { setIsAdding(false); setIsEditing(null); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="dashboard-card border-white/5">
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input 
                placeholder="Search by title, author, ISBN..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                setFormData({ title: "", author: "", isbn: "", categoryId: "", totalCopies: 1 });
                setIsAdding(true);
                setIsEditing(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Button>
          </div>

          <DataTable columns={columns} data={filteredBooks} />
        </CardContent>
      </Card>
    </div>
  );
}
