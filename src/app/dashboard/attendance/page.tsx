"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Download, QrCode, MoreHorizontal, Pencil, Trash2, Search, UserCheck, UserX, Clock, CalendarOff, Users } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ATTENDANCE_STATUS } from "@/constants";
import type { AttendanceRecord, AttendanceStatus } from "@/types";
import { useAttendanceStorage } from "@/hooks/use-attendance-storage";
import { useClassStore } from "@/store/class-store";
import { ChartCard } from "@/features/dashboard/chart-card";
import { toast } from "sonner";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { isLoaded, deleteAttendance, updateAttendance, getDashboardStats, getFilteredRecords } = useAttendanceStorage();
  const classes = useClassStore((state) => state.classes);
  
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editForm, setEditForm] = useState({ status: "present" as AttendanceStatus, remarks: "" });
  const [showQrScanner, setShowQrScanner] = useState(false);

  // Compute stats
  const stats = getDashboardStats(filterDate);

  const filtered = getFilteredRecords({
    date: filterDate,
    classId: classFilter,
    status: statusFilter,
    search: searchQuery
  });

  const monthlyData = [
    { name: "Week 1", present: 450, absent: 20, late: 15 },
    { name: "Week 2", present: 460, absent: 15, late: 10 },
    { name: "Week 3", present: 440, absent: 25, late: 20 },
    { name: "Week 4", present: 470, absent: 10, late: 5 },
  ];

  const columns: ColumnDef<AttendanceRecord>[] = [
    { accessorKey: "studentName", header: "Student Name" },
    { accessorKey: "rollNumber", header: "Roll No." },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "sectionName", header: "Section", cell: ({row}) => row.original.sectionName || "N/A" },
    { accessorKey: "date", header: "Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as AttendanceStatus;
        const config = ATTENDANCE_STATUS[status] || { label: status, color: "bg-gray-500" };
        return <Badge className={`${config.color} text-white border-0`}>{config.label}</Badge>;
      },
    },
    { accessorKey: "remarks", header: "Remarks" },
    {
      id: "actions",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setEditingRecord(record);
                setEditForm({ status: record.status, remarks: record.remarks || "" });
              }}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                if (window.confirm("Delete this attendance record?")) {
                  deleteAttendance(record.id);
                  toast.success("Record deleted");
                }
              }} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleEditSubmit = () => {
    if (editingRecord) {
      updateAttendance(editingRecord.id, editForm);
      toast.success("Attendance updated successfully");
      setEditingRecord(null);
    }
  };

  const exportData = (type: string) => {
    toast.success(`Report exported as ${type.toUpperCase()}`);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Attendance Management" 
        description="Monitor, track, and manage student attendance." 
        breadcrumbs={[{ label: "Attendance" }]}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">

            </Button>
            <Button variant="outline" onClick={() => setShowQrScanner(true)}>
              <QrCode className="mr-2 h-4 w-4" /> QR Scanner
            </Button>
          </div>
        } 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/[0.02] border border-white/[0.05]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="reports">Reports & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
             <div className="dashboard-card p-4 space-y-2 col-span-2 lg:col-span-1">
                <div className="flex items-center text-zinc-400"><Users className="h-4 w-4 mr-2"/> Total</div>
                <div className="text-2xl font-bold">{stats.total}</div>
             </div>
             <div className="dashboard-card p-4 space-y-2 col-span-2 lg:col-span-1">
                <div className="flex items-center text-emerald-400"><UserCheck className="h-4 w-4 mr-2"/> Present</div>
                <div className="text-2xl font-bold">{stats.present}</div>
             </div>
             <div className="dashboard-card p-4 space-y-2 col-span-2 lg:col-span-1">
                <div className="flex items-center text-red-400"><UserX className="h-4 w-4 mr-2"/> Absent</div>
                <div className="text-2xl font-bold">{stats.absent}</div>
             </div>
             <div className="dashboard-card p-4 space-y-2 col-span-2 lg:col-span-1">
                <div className="flex items-center text-yellow-400"><Clock className="h-4 w-4 mr-2"/> Late</div>
                <div className="text-2xl font-bold">{stats.late}</div>
             </div>
             <div className="dashboard-card p-4 space-y-2 col-span-2 lg:col-span-1">
                <div className="flex items-center text-blue-400"><CalendarOff className="h-4 w-4 mr-2"/> Leave</div>
                <div className="text-2xl font-bold">{stats.leave}</div>
             </div>
             <div className="dashboard-card p-4 space-y-2 col-span-2 lg:col-span-1">
                <div className="flex items-center text-indigo-400">% Rate</div>
                <div className="text-2xl font-bold">{stats.percentage}%</div>
             </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard
              title="Monthly Attendance Trend"
              type="area"
              data={monthlyData}
              dataKeys={[
                { key: "present", color: "#22c55e", name: "Present" },
                { key: "absent", color: "#ef4444", name: "Absent" },
                { key: "late", color: "#eab308", name: "Late" }
              ]}
            />
            <ChartCard
              title="Absence Trend by Week"
              type="bar"
              data={monthlyData}
              dataKeys={[
                { key: "absent", color: "#ef4444", name: "Absent" }
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <div className="dashboard-card p-4">
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
               <div className="flex flex-col md:flex-row gap-2">
                 <Input 
                   type="date" 
                   value={filterDate} 
                   onChange={(e) => setFilterDate(e.target.value)} 
                   className="w-[150px]"
                 />
                 <Select value={classFilter} onValueChange={setClassFilter}>
                   <SelectTrigger className="w-[150px]"><SelectValue placeholder="Class" /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Classes</SelectItem>
                     {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                   </SelectContent>
                 </Select>
                 <Select value={statusFilter} onValueChange={setStatusFilter}>
                   <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Status</SelectItem>
                     <SelectItem value="present">Present</SelectItem>
                     <SelectItem value="absent">Absent</SelectItem>
                     <SelectItem value="late">Late</SelectItem>
                     <SelectItem value="leave">Leave</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                 <Input 
                   placeholder="Search students..." 
                   className="pl-9 w-full md:w-[250px]" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
             </div>
             <DataTable columns={columns} data={filtered} />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
             <div className="dashboard-card p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Daily Report</h3>
                <p className="text-sm text-zinc-400">Generate attendance report for a specific day across all classes or a specific class.</p>
                <div className="pt-4 flex flex-col gap-2">
                  <Button variant="secondary" onClick={() => exportData('pdf')}><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
                  <Button variant="outline" onClick={() => exportData('csv')}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
                </div>
             </div>
             <div className="dashboard-card p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Monthly Report</h3>
                <p className="text-sm text-zinc-400">Comprehensive view of attendance rates over a month period for analytics.</p>
                <div className="pt-4 flex flex-col gap-2">
                  <Button variant="secondary" onClick={() => exportData('pdf')}><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
                  <Button variant="outline" onClick={() => exportData('excel')}><Download className="h-4 w-4 mr-2" /> Export Excel</Button>
                </div>
             </div>
             <div className="dashboard-card p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Student Wise Report</h3>
                <p className="text-sm text-zinc-400">Detailed attendance history for individual students across the term.</p>
                <div className="pt-4 flex flex-col gap-2">
                  <Button variant="secondary" onClick={() => exportData('pdf')}><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
                  <Button variant="outline" onClick={() => exportData('excel')}><Download className="h-4 w-4 mr-2" /> Export Excel</Button>
                </div>
             </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Input disabled value={editingRecord?.studentName || ""} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.status} onValueChange={(val: AttendanceStatus) => setEditForm(prev => ({ ...prev, status: val }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input 
                value={editForm.remarks} 
                onChange={(e) => setEditForm(prev => ({ ...prev, remarks: e.target.value }))}
                placeholder="Reason for leave/absence..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRecord(null)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showQrScanner} onOpenChange={setShowQrScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Attendance Scanner</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="relative h-64 w-64 overflow-hidden rounded-lg border-2 border-dashed border-indigo-500/50 flex items-center justify-center bg-indigo-500/5">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent animate-pulse"></div>
              <QrCode className="h-16 w-16 text-indigo-500/50" />
            </div>
            <p className="text-sm text-zinc-400 text-center">
              Point your camera at the student's ID card QR code
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => setShowQrScanner(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("Student scanned successfully (Mock)");
              setShowQrScanner(false);
            }}>Mock Scan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
