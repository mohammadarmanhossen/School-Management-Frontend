"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useParentStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Award, Target, Trophy } from "lucide-react";
import type { ParentChildResult } from "@/types/parent";
import { formatDate } from "@/lib/utils";

export default function ResultsPage() {
  const [mounted, setMounted] = useState(false);
  const { children, selectedChildId, results } = useParentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const child = children.find((c) => c.id === selectedChildId);
  if (!child) return null;

  const records = results[child.id] || [];

  const columns: ColumnDef<ParentChildResult>[] = [
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
      accessorKey: "marks",
      header: "Marks",
      cell: ({ row }) => (
        <span>
          {row.original.marksObtained} <span className="text-zinc-500">/ {row.original.totalMarks}</span>
        </span>
      ),
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => {
        const isA = row.original.grade.includes("A");
        const color = isA ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20";
        return (
          <Badge variant="outline" className={color}>
            {row.original.grade}
          </Badge>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Published On",
      cell: ({ row }) => <span className="text-zinc-400">{formatDate(row.original.date)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Results"
        description={`View exam results and report cards for ${child.name}.`}
        breadcrumbs={[{ label: "Parent Dashboard", href: "/parent/dashboard" }, { label: "Results" }]}
      />

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-indigo-500/10 to-zinc-950">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
              <Trophy className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Exams Taken</p>
              <h3 className="text-2xl font-bold text-white">{records.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-emerald-500/10 to-zinc-950">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
              <Award className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Highest Grade</p>
              <h3 className="text-2xl font-bold text-white">
                {records.length > 0 ? records.map(r => r.grade).sort()[0] : "N/A"}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-blue-500/10 to-zinc-950">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Avg. Score</p>
              <h3 className="text-2xl font-bold text-white">
                {records.length > 0 ? Math.round(records.reduce((acc, curr) => acc + (curr.marksObtained/curr.totalMarks)*100, 0) / records.length) : 0}%
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card border-white/5">
        <CardHeader>
          <CardTitle className="text-lg text-white">Detailed Results</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={records} />
        </CardContent>
      </Card>
    </div>
  );
}
