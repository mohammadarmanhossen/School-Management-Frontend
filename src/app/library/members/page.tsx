"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useLibraryStore } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search, User } from "lucide-react";
import type { LibraryMember } from "@/types/library";

export default function LibraryMembersPage() {
  const [mounted, setMounted] = useState(false);
  const { members, addMember, updateMember, deleteMember } = useLibraryStore();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<LibraryMember, "id">>({ 
    name: "", role: "student", email: "", phone: "", joinDate: new Date().toISOString().split("T")[0], status: "active" 
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSave = () => {
    if (!formData.name || !formData.email) return;
    
    if (isEditing) {
      updateMember(isEditing, formData);
      setIsEditing(null);
    } else {
      addMember(formData);
      setIsAdding(false);
    }
    setFormData({ name: "", role: "student", email: "", phone: "", joinDate: new Date().toISOString().split("T")[0], status: "active" });
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnDef<LibraryMember>[] = [
    {
      accessorKey: "name",
      header: "Member Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-white">{row.original.name}</p>
            <p className="text-xs text-zinc-500">{row.original.email}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <span className="capitalize text-zinc-300">{row.original.role}</span>
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <span className="text-zinc-400">{row.original.phone || "—"}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${row.original.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {row.original.status}
        </span>
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
            onClick={() => deleteMember(row.original.id)}
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
        title="Library Members"
        description="Manage students and teachers who can borrow books."
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Members" }]}
      />

      {(isAdding || isEditing) && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              {isEditing ? "Edit Member" : "Add New Member"}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Input 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <Input 
                placeholder="Email Address" 
                type="email"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <Input 
                placeholder="Phone Number" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as "student" | "teacher"})}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as "active" | "suspended"})}
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Member</Button>
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
                placeholder="Search by name or email..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                setFormData({ name: "", role: "student", email: "", phone: "", joinDate: new Date().toISOString().split("T")[0], status: "active" });
                setIsAdding(true);
                setIsEditing(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>

          <DataTable columns={columns} data={filteredMembers} />
        </CardContent>
      </Card>
    </div>
  );
}
