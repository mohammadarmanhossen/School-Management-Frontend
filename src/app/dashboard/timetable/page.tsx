"use client";

import { useState } from "react";
import { Download, Plus, Search, BookOpen, Clock, Calendar as CalendarIcon, Hash } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useTimetableStore } from "@/store";
import type { TimetableEntry } from "@/types";

import { TimetableCalendar } from "@/features/timetable/timetable-calendar";
import { TimetableAnalytics } from "@/features/timetable/timetable-analytics";
import { TimetableForm } from "@/features/timetable/timetable-form";

export default function TimetablePage() {
  const { entries, deleteEntry } = useTimetableStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Simple stats
  const totalClasses = entries.length;
  // Assume today is 'Monday' for mock purposes
  const todaysClasses = entries.filter(e => e.day === "Monday").length;
  const teachingHours = entries.reduce((acc, e) => {
    const start = new Date(`1970-01-01T${e.startTime}:00`);
    const end = new Date(`1970-01-01T${e.endTime}:00`);
    return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  const filteredEntries = entries.filter((e) => 
    e.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.teacherName && e.teacherName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    e.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<TimetableEntry>[] = [
    { accessorKey: "day", header: "Day" },
    { accessorKey: "startTime", header: "Start" },
    { accessorKey: "endTime", header: "End" },
    { accessorKey: "subjectName", header: "Subject", cell: ({ row }) => <span className="font-semibold">{row.original.subjectName}</span> },
    { accessorKey: "teacherName", header: "Teacher", cell: ({ row }) => row.original.teacherName || "Unassigned" },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "room", header: "Room", cell: ({ row }) => row.original.room || "-" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => {
          if (confirm("Delete this entry?")) {
            deleteEntry(row.original.id);
            toast.success("Entry deleted");
          }
        }}>
          Delete
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Timetable Management" 
        description="Comprehensive schedule, analytics, and conflict management" 
        breadcrumbs={[{ label: "Timetable" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/[0.02]" onClick={() => toast.success("Routine Exported to PDF")}><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" /> Add Schedule</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader><DialogTitle>Add Timetable Entry</DialogTitle></DialogHeader>
                <TimetableForm onSuccess={() => setIsCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        } 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/[0.02] border border-white/[0.05] p-1 h-auto">
          <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-white/[0.06]">Overview</TabsTrigger>
          <TabsTrigger value="calendar" className="py-2 data-[state=active]:bg-white/[0.06]">Calendar View</TabsTrigger>
          <TabsTrigger value="list" className="py-2 data-[state=active]:bg-white/[0.06]">List & Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><BookOpen className="h-4 w-4 mr-2 text-blue-400"/> Total Classes</div>
              <div className="text-2xl font-bold">{totalClasses}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><CalendarIcon className="h-4 w-4 mr-2 text-emerald-400"/> Today's Classes</div>
              <div className="text-2xl font-bold">{todaysClasses}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><Clock className="h-4 w-4 mr-2 text-purple-400"/> Teaching Hours</div>
              <div className="text-2xl font-bold">{teachingHours.toFixed(1)} hrs</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><Hash className="h-4 w-4 mr-2 text-orange-400"/> Free Periods (Avg)</div>
              <div className="text-2xl font-bold">12</div>
            </Card>
          </div>

          <TimetableAnalytics />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4 animate-in fade-in duration-300">
          <TimetableCalendar />
        </TabsContent>

        <TabsContent value="list" className="space-y-4 animate-in fade-in duration-300">
          <div className="dashboard-card p-4 rounded-xl border border-white/[0.08]">
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
               <div className="relative w-full md:w-[350px]">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                 <Input 
                   placeholder="Search subject, teacher, or class..." 
                   className="pl-9 bg-white/[0.02] border-white/[0.08]" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px] bg-white/[0.02] border-white/[0.08]"><SelectValue placeholder="Day" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Days</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>
            <DataTable columns={columns} data={filteredEntries} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
