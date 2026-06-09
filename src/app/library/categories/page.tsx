"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useLibraryStore } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Tags } from "lucide-react";
import type { LibraryCategory } from "@/types/library";

export default function LibraryCategoriesPage() {
  const [mounted, setMounted] = useState(false);
  const { categories, addCategory, updateCategory, deleteCategory } = useLibraryStore();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<LibraryCategory, "id">>({ name: "", description: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSave = () => {
    if (!formData.name) return;
    
    if (isEditing) {
      updateCategory(isEditing, formData);
      setIsEditing(null);
    } else {
      addCategory(formData);
      setIsAdding(false);
    }
    setFormData({ name: "", description: "" });
  };

  const columns: ColumnDef<LibraryCategory>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <Tags className="h-5 w-5 text-blue-400" />
          </div>
          <span className="font-medium text-white">{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span className="text-zinc-400">{row.original.description || "—"}</span>
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
            onClick={() => deleteCategory(row.original.id)}
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
        title="Book Categories"
        description="Manage organization categories for library books."
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Categories" }]}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {(isAdding || isEditing) && (
          <Card className="border-blue-500/20 bg-blue-500/5 md:col-span-1 h-fit">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                {isEditing ? "Edit Category" : "Add New Category"}
              </h3>
              <div className="space-y-4">
                <Input 
                  placeholder="Category Name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <Input 
                  placeholder="Description" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save</Button>
                  <Button variant="ghost" onClick={() => { setIsAdding(false); setIsEditing(null); }}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className={`dashboard-card border-white/5 ${isAdding || isEditing ? 'md:col-span-2' : 'md:col-span-3'}`}>
          <CardContent className="p-6">
            <div className="mb-6 flex justify-end">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  setFormData({ name: "", description: "" });
                  setIsAdding(true);
                  setIsEditing(null);
                }}
                disabled={isAdding}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </div>

            <DataTable columns={columns} data={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
