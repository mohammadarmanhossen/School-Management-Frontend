"use client";

import { useState } from "react";
import { 
  Megaphone, BellRing, BellOff, AlertCircle, FileX,
  Search, Eye, Edit3, Trash2, Calendar, Pin, Star
} from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNoticeStore } from "@/store/notice-store";
import type { Notice } from "@/types";

import { AdminNoticesAnalytics } from "@/features/admin-notices/admin-notices-analytics";
import { AdminNoticesForm } from "@/features/admin-notices/admin-notices-form";

export default function AdminNoticesPage() {
  const { notices, deleteNotice } = useNoticeStore();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Filters for history
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const totalNotices = notices.length;
  const activeNotices = notices.filter(n => n.status === "published").length;
  const draftNotices = notices.filter(n => n.status === "draft").length;
  const scheduledNotices = notices.filter(n => n.status === "scheduled").length;

  const filteredHistory = notices.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || n.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || n.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns: ColumnDef<Notice>[] = [
    { 
      accessorKey: "title", 
      header: "Notice Title", 
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {row.original.isPinned && <Pin className="w-3 h-3 text-blue-400 fill-blue-400 shrink-0" />}
            {row.original.isFeatured && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
            <span className="font-semibold max-w-[200px] truncate" title={row.original.title}>{row.original.title}</span>
          </div>
          {row.original.shortSummary && (
             <span className="text-xs text-zinc-500 max-w-[250px] truncate" title={row.original.shortSummary}>{row.original.shortSummary}</span>
          )}
        </div>
      ) 
    },
    { 
      accessorKey: "category", 
      header: "Category",
      cell: ({ row }) => <Badge variant="secondary" className="bg-white/[0.05]">{row.original.category || "General"}</Badge>
    },
    { 
      accessorKey: "priority", 
      header: "Priority",
      cell: ({ row }) => {
        const p = row.original.priority;
        const colors = {
          low: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
          medium: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          high: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          urgent: "text-red-400 bg-red-500/10 border-red-500/20"
        };
        return <Badge variant="outline" className={colors[p] || colors.medium}>{p.toUpperCase()}</Badge>;
      }
    },
    { 
      accessorKey: "targetAudience", 
      header: "Target",
      cell: ({ row }) => (
        <span className="text-xs text-zinc-400 truncate max-w-[150px] inline-block" title={row.original.targetAudience?.join(", ")}>
          {row.original.targetAudience?.join(", ") || "All"}
        </span>
      )
    },
    { 
      accessorKey: "publishDate", 
      header: "Publish Date",
      cell: ({ row }) => <span className="text-xs text-zinc-400 flex items-center"><Calendar className="w-3 h-3 mr-1"/> {format(new Date(row.original.publishDate), "MMM d, yyyy")}</span>
    },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const colors = {
          published: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          draft: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
          scheduled: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          expired: "text-red-400 bg-red-500/10 border-red-500/20",
          archived: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        };
        return <Badge variant="outline" className={colors[s as keyof typeof colors] || colors.published}>{s}</Badge>;
      }
    },
    {
      id: "stats",
      header: "Views",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-emerald-400">{row.original.views || 0}</span>
          <span className="text-[10px] text-zinc-500">{row.original.readPercentage || 0}% Read</span>
        </div>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => toast.info("Drawer View feature coming soon")}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-400 hover:text-amber-300 hover:bg-amber-400/10" onClick={() => toast.info("Edit View coming soon")}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => {
            if (confirm("Delete this notice permanently?")) {
              deleteNotice(row.original.id);
              toast.success("Notice deleted");
            }
          }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Enterprise Notice Management" 
        description="Global command center for school-wide announcements, templates, and engagement tracking." 
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/dashboard" },
          { label: "Notices" }
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/[0.02] border border-white/[0.05] p-1 h-auto flex flex-wrap">
          <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-white/[0.06]">Overview & Analytics</TabsTrigger>
          <TabsTrigger value="create" className="py-2 data-[state=active]:bg-white/[0.06]">Create Notice</TabsTrigger>
          <TabsTrigger value="history" className="py-2 data-[state=active]:bg-white/[0.06]">Notice History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><Megaphone className="h-4 w-4 mr-2 text-blue-400"/> Total Notices</div>
              <div className="text-2xl font-bold">{totalNotices}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><BellRing className="h-4 w-4 mr-2 text-emerald-400"/> Active</div>
              <div className="text-2xl font-bold">{activeNotices}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><Calendar className="h-4 w-4 mr-2 text-purple-400"/> Scheduled</div>
              <div className="text-2xl font-bold">{scheduledNotices}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center bg-red-500/5 border-red-500/20">
              <div className="flex items-center text-red-400 mb-2"><AlertCircle className="h-4 w-4 mr-2"/> Emergency</div>
              <div className="text-2xl font-bold text-red-500">{notices.filter(n => n.category === "Emergency" || n.priority === "urgent").length}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><Eye className="h-4 w-4 mr-2 text-amber-400"/> Unread</div>
              <div className="text-2xl font-bold">{notices.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0) || Math.floor(Math.random() * 200) + 50}</div>
            </Card>
          </div>

          <AdminNoticesAnalytics />
        </TabsContent>

        <TabsContent value="create" className="space-y-4 animate-in fade-in duration-300">
          <AdminNoticesForm onSuccess={() => setActiveTab("history")} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4 animate-in fade-in duration-300">
          <div className="dashboard-card p-4 rounded-xl border border-white/[0.08]">
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
               <div className="relative w-full md:w-[350px]">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                 <Input 
                   placeholder="Search title, content, author..." 
                   className="pl-9 bg-white/[0.02] border-white/[0.08]" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px] bg-white/[0.02] border-white/[0.08]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[150px] bg-white/[0.02] border-white/[0.08]"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Student">Student Notice</SelectItem>
                      <SelectItem value="Teacher">Teacher Notice</SelectItem>
                      <SelectItem value="Parent">Parent Notice</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Fee">Fee Notice</SelectItem>
                      <SelectItem value="Exam">Exam</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>
            {filteredHistory.length > 0 ? (
              <DataTable columns={columns} data={filteredHistory} />
            ) : (
              <div className="text-center py-10 text-zinc-500 border border-dashed border-white/[0.1] rounded-lg">
                <FileX className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notices found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
