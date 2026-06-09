"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useLibraryStore } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Bell } from "lucide-react";
import type { LibraryNotice } from "@/types/library";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function LibraryNoticesPage() {
  const [mounted, setMounted] = useState(false);
  const { notices, addNotice, toggleNoticeStatus, deleteNotice } = useLibraryStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<LibraryNotice, "id">>({ title: "", content: "", date: new Date().toISOString(), isActive: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSave = () => {
    if (!formData.title || !formData.content) return;
    
    addNotice({ ...formData, date: new Date().toISOString() });
    setIsAdding(false);
    setFormData({ title: "", content: "", date: new Date().toISOString(), isActive: true });
  };

  const columns: ColumnDef<LibraryNotice>[] = [
    {
      accessorKey: "title",
      header: "Notice",
      cell: ({ row }) => (
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <Bell className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-white">{row.original.title}</p>
            <p className="mt-1 text-sm text-zinc-400 max-w-md line-clamp-2">{row.original.content}</p>
            <p className="mt-2 text-xs text-zinc-500">{formatDate(row.original.date)}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className={row.original.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}>
          {row.original.isActive ? "Active" : "Archived"}
        </Badge>
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
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            onClick={() => toggleNoticeStatus(row.original.id)}
          >
            Toggle Status
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => deleteNotice(row.original.id)}
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
        title="Library Notices"
        description="Publish announcements and rules for library members."
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Notices" }]}
      />

      {isAdding && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Publish New Notice</h3>
            <div className="space-y-4">
              <Input 
                placeholder="Notice Title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Notice Content..."
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Publish Notice</Button>
                <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="dashboard-card border-white/5">
        <CardContent className="p-6">
          <div className="mb-6 flex justify-end">
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => { setIsAdding(true); }}
            >
              <Plus className="mr-2 h-4 w-4" /> New Notice
            </Button>
          </div>

          <DataTable columns={columns} data={notices.reverse()} />
        </CardContent>
      </Card>
    </div>
  );
}
