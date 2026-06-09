"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useParentStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Clock, FileText } from "lucide-react";
import type { ParentChildExam } from "@/types/parent";
import { formatDate } from "@/lib/utils";

export default function ExamsPage() {
  const [mounted, setMounted] = useState(false);
  const { children, selectedChildId, exams } = useParentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const child = children.find((c) => c.id === selectedChildId);
  if (!child) return null;

  const records = exams[child.id] || [];

  const columns: ColumnDef<ParentChildExam>[] = [
    {
      accessorKey: "examName",
      header: "Exam Name",
      cell: ({ row }) => <span className="font-medium text-white">{row.original.examName}</span>,
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-500" />
          <span className="text-zinc-300">{formatDate(row.original.date)} at {row.original.time}</span>
        </div>
      ),
    },
    {
      accessorKey: "syllabus",
      header: "Syllabus",
      cell: ({ row }) => <span className="text-zinc-400">{row.original.syllabus || "—"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isUpcoming = row.original.status === "upcoming";
        const color = isUpcoming ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        return (
          <Badge variant="outline" className={`capitalize ${color}`}>
            {row.original.status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upcoming Exams"
        description={`View exam schedules and syllabus for ${child.name}.`}
        breadcrumbs={[{ label: "Parent Dashboard", href: "/parent/dashboard" }, { label: "Exams" }]}
      />

      <Card className="dashboard-card border-white/5">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Exam Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={records} />
        </CardContent>
      </Card>
    </div>
  );
}
