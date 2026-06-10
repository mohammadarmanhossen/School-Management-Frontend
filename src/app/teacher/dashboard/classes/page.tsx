"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TeacherClass = {
  id: string;
  className: string;
  section: string;
  subject: string;
  studentCount: number;
  room: string;
  schedule: string;
  status: "active" | "completed";
};

const initialClasses: TeacherClass[] = [
  {
    id: "1",
    className: "Grade 6",
    section: "A",
    subject: "Mathematics",
    studentCount: 35,
    room: "R-101",
    schedule: "09:00 AM",
    status: "active",
  },
  {
    id: "2",
    className: "Grade 7",
    section: "B",
    subject: "Science",
    studentCount: 42,
    room: "R-205",
    schedule: "11:00 AM",
    status: "active",
  },
  {
    id: "3",
    className: "Grade 8",
    section: "A",
    subject: "English",
    studentCount: 38,
    room: "R-302",
    schedule: "01:00 PM",
    status: "completed",
  },
];

export default function TeacherClassesPage() {
  const [classesList, setClassesList] = useState<TeacherClass[]>(initialClasses);

  const handleMarkComplete = (id: string) => {
    setClassesList(prev => prev.map(cls => 
      cls.id === id ? { ...cls, status: "completed" } : cls
    ));
    toast.success("Class marked as completed");
  };

  const columns: ColumnDef<TeacherClass>[] = [
    {
      accessorKey: "className",
      header: "Class",
    },
    {
      accessorKey: "section",
      header: "Section",
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "studentCount",
      header: "Students",
    },
    {
      accessorKey: "room",
      header: "Room",
    },
    {
      accessorKey: "schedule",
      header: "Schedule",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "active"
              ? "default"
              : "secondary"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">

          <Button size="sm">
            Attendance
          </Button>
          {row.original.status === "active" && (
            <Button size="sm" variant="outline" className="text-emerald-500 hover:text-emerald-400 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20" onClick={() => handleMarkComplete(row.original.id)}>
              Mark Complete
            </Button>
          )}
        </div>
      ),
    },
  ];

  const totalClasses = classesList.length;
  const totalStudents = classesList.reduce(
    (sum, cls) => sum + cls.studentCount,
    0
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredClasses = classesList.filter((cls) => {
    const matchesSearch = 
      cls.className.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || cls.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        description="Manage your assigned classes and students"
        breadcrumbs={[
          { label: "Teacher Dashboard", href: "/teacher/dashboard" },
          { label: "My Classes" },
        ]}
      />

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <BookOpen className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">
                Total Classes
              </p>
              <h3 className="text-2xl font-bold">
                {totalClasses}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">
                Total Students
              </p>
              <h3 className="text-2xl font-bold">
                {totalStudents}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <Calendar className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">
                Today&apos;s Classes
              </p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <ClipboardCheck className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Attendance
              </p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Table */}
      <Card>
        <CardContent className="p-4 border-none">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input 
                placeholder="Search class or subject..." 
                className="pl-9 bg-white/[0.02] border-white/[0.08]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-white/[0.02] border-white/[0.08]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredClasses}
          />
        </CardContent>
      </Card>
    </div>
  );
}