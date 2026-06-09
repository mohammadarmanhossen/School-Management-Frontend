"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookOpen, CheckCircle2, Upload } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { mockStudentHomework } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function StudentHomeworkPage() {
  const pending = mockStudentHomework.filter(
    (h) => !h.submitted
  ).length;

  const submitted = mockStudentHomework.filter(
    (h) => h.submitted
  ).length;

  const columns: ColumnDef<typeof mockStudentHomework[0]>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "title",
      header: "Homework",
    },
    {
      accessorKey: "teacher",
      header: "Teacher",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => formatDate(row.original.dueDate)
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isSubmitted = row.original.submitted;

        return (
          <Badge variant={isSubmitted ? "success" : "warning"}>
            {isSubmitted ? "Submitted" : "Pending"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "marks",
      header: "Marks",
      cell: ({ row }) => {
        if (!row.original.submitted) return <span className="text-muted-foreground">-</span>;
        if (row.original.marks === undefined) return <Badge variant="secondary">Not Graded</Badge>;
        return <span className="font-semibold">{row.original.marks}</span>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return row.original.submitted ? (
          <Button variant="outline" size="sm" disabled>Submitted</Button>
        ) : (
          <Button variant="default" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Submit
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="My Homework"
        description="Track and submit your assignments"
        breadcrumbs={[
          { label: "Student Portal", href: "/student/dashboard" },
          { label: "Homework" },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
            <p className="text-3xl font-bold">{pending}</p>
            <p className="text-sm text-muted-foreground">
              Pending Assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-green-500" />
            <p className="text-3xl font-bold">{submitted}</p>
            <p className="text-sm text-muted-foreground">
              Submitted Assignments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Homework Cards View */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {mockStudentHomework.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.subject} ({item.teacher}) • Due: {formatDate(item.dueDate)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Badge
                  variant={item.submitted ? "success" : "warning"}
                >
                  {item.submitted ? "Submitted" : "Pending"}
                </Badge>
                {!item.submitted && (
                  <Button size="sm">Submit</Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Table View */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockStudentHomework}
          />
        </CardContent>
      </Card>
    </div>
  );
}

