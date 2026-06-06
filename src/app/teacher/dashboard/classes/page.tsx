"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Eye,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

const teacherClasses: TeacherClass[] = [
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
          <Button size="sm" variant="outline" asChild>
            <Link href={`/teacher/classes/${row.original.id}`}>
              <Eye className="mr-1 h-4 w-4" />
              View
            </Link>
          </Button>

          <Button size="sm">
            Attendance
          </Button>
        </div>
      ),
    },
  ];

  const totalClasses = teacherClasses.length;
  const totalStudents = teacherClasses.reduce(
    (sum, cls) => sum + cls.studentCount,
    0
  );

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
                Today's Classes
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
      <DataTable
        columns={columns}
        data={teacherClasses}
      />
    </div>
  );
}