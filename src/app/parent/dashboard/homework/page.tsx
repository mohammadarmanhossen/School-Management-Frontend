"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download, BookOpen, Calendar, CheckCircle2 } from "lucide-react";

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

import { toast } from "sonner";

type Homework = {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "overdue";
};

const homeworkData: Homework[] = [
  {
    id: "1",
    subject: "Mathematics",
    title: "Algebra Exercise 5",
    dueDate: "10 Aug 2026",
    status: "pending",
  },
  {
    id: "2",
    subject: "English",
    title: "Essay Writing",
    dueDate: "08 Aug 2026",
    status: "submitted",
  },
  {
    id: "3",
    subject: "Science",
    title: "Physics Chapter 3",
    dueDate: "05 Aug 2026",
    status: "overdue",
  },
  {
    id: "4",
    subject: "Bangla",
    title: "Grammar Practice",
    dueDate: "12 Aug 2026",
    status: "pending",
  },
];

export default function ParentHomeworkPage() {
  const pending = homeworkData.filter(
    (h) => h.status === "pending"
  ).length;

  const submitted = homeworkData.filter(
    (h) => h.status === "submitted"
  ).length;

  const overdue = homeworkData.filter(
    (h) => h.status === "overdue"
  ).length;

  const columns: ColumnDef<Homework>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "title",
      header: "Homework",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const config = {
          pending: "bg-yellow-500 text-white",
          submitted: "bg-green-500 text-white",
          overdue: "bg-red-500 text-white",
        };

        return (
          <Badge className={config[status]}>
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Homework"
        description="Track your child's assignments and submissions"
        breadcrumbs={[
          { label: "Parent Portal", href: "/parent/dashboard" },
          { label: "Homework" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Homework report downloaded")
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="mx-auto mb-2 h-6 w-6" />
            <p className="text-3xl font-bold">{pending}</p>
            <p className="text-sm text-muted-foreground">
              Pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6" />
            <p className="text-3xl font-bold">{submitted}</p>
            <p className="text-sm text-muted-foreground">
              Submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="mx-auto mb-2 h-6 w-6" />
            <p className="text-3xl font-bold">{overdue}</p>
            <p className="text-sm text-muted-foreground">
              Overdue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Homework Cards View */}
      <Card>
        <CardHeader>
          <CardTitle>Homework Overview</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {homeworkData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.subject} • Due: {item.dueDate}
                </p>
              </div>

              <Badge
                className={
                  item.status === "submitted"
                    ? "bg-green-500 text-white"
                    : item.status === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Table View */}
      <DataTable
        columns={columns}
        data={homeworkData}
      />
    </div>
  );
}