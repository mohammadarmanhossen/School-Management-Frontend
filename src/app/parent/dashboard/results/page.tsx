"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Award, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockResults, mockParentChildren } from "@/lib/mock-data";
import type { ExamResult } from "@/types";
import { BD_GRADING } from "@/constants";

export default function ParentResultsPage() {
  const child = mockParentChildren[0];
  const avgGpa =
    mockResults.reduce((sum, r) => sum + r.gpa, 0) / mockResults.length;

  const columns: ColumnDef<ExamResult>[] = [
    { accessorKey: "examName", header: "Exam" },
    {
      accessorKey: "marksObtained",
      header: "Marks",
      cell: ({ row }) => `${row.original.marksObtained} / ${row.original.totalMarks}`,
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => <Badge variant="success">{row.original.grade}</Badge>,
    },
    { accessorKey: "gpa", header: "GPA" },
    { accessorKey: "position", header: "Position" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Results"
        description={`Academic performance for ${child.name}`}
        breadcrumbs={[
          { label: "Parent Portal", href: "/parent/dashboard" },
          { label: "Results" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average GPA</p>
              <p className="text-2xl font-bold">{avgGpa.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Class Rank</p>
              <p className="text-2xl font-bold">#{mockResults[0]?.position || 5}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-3 text-sm font-medium">Bangladesh Grading Scale</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(BD_GRADING).map(([grade, gpa]) => (
                <Badge key={grade} variant="secondary" className="text-xs">
                  {grade} = {gpa.toFixed(2)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject-wise Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { subject: "Mathematics", marks: 85, grade: "A+" },
            { subject: "English", marks: 78, grade: "A" },
            { subject: "Physics", marks: 72, grade: "A" },
            { subject: "Chemistry", marks: 68, grade: "A-" },
            { subject: "Biology", marks: 80, grade: "A+" },
          ].map((s) => (
            <div key={s.subject} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{s.subject}</span>
                <span className="font-medium">{s.grade} ({s.marks}%)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${s.marks}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <DataTable columns={columns} data={mockResults} />
    </div>
  );
}
