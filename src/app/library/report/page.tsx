"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  BookOpen,
  Users,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { useLibraryMembers, useBookIssues } from "@/modules/library/hooks/use-library-data";

export default function LibraryReportPage() {
  const { data: members = [] } = useLibraryMembers();
  const { data: issues = [] } = useBookIssues();

  const totalMembers = members.length;
  const students = members.filter((m) => m.memberType === "student").length;
  const teachers = members.filter((m) => m.memberType === "teacher").length;

  const totalIssues = issues.length;
  const returned = issues.filter((i) => i.status === "returned").length;
  const issued = issues.filter((i) => i.status === "issued").length;
  const overdue = issues.filter((i) => i.status === "overdue").length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Library Report"
        description="Analytics and activity overview of library system"
        breadcrumbs={[
          { label: "Library", href: "/library" },
          { label: "Report" },
        ]}
      />

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-5 text-center">
            <Users className="mx-auto mb-2 h-5 w-5 text-blue-400" />
            <p className="text-2xl font-bold">{totalMembers}</p>
            <p className="text-sm text-muted-foreground">
              Total Members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <BookOpen className="mx-auto mb-2 h-5 w-5 text-green-400" />
            <p className="text-2xl font-bold">{totalIssues}</p>
            <p className="text-sm text-muted-foreground">
              Total Issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-emerald-400" />
            <p className="text-2xl font-bold">{returned}</p>
            <p className="text-sm text-muted-foreground">
              Returned Books
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <AlertCircle className="mx-auto mb-2 h-5 w-5 text-red-400" />
            <p className="text-2xl font-bold">{overdue}</p>
            <p className="text-sm text-muted-foreground">
              Overdue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MEMBER BREAKDOWN */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-white">
              {students}
            </p>
            <p className="text-sm text-muted-foreground">
              Students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-white">
              {teachers}
            </p>
            <p className="text-sm text-muted-foreground">
              Teachers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <TrendingUp className="mx-auto mb-2 h-5 w-5 text-yellow-400" />
            <p className="text-3xl font-bold text-white">
              {Math.round((returned / totalIssues) * 100) || 0}%
            </p>
            <p className="text-sm text-muted-foreground">
              Return Rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ACTIVITY INSIGHT */}
      <Card>
        <CardHeader>
          <CardTitle>Library Activity Insight</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Total Issued Books</span>
            <Badge>{issued}</Badge>
          </div>

          <div className="flex justify-between">
            <span>Returned Books</span>
            <Badge className="bg-green-500 text-white">
              {returned}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span>Overdue Books</span>
            <Badge className="bg-red-500 text-white">
              {overdue}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* RECENT ACTIVITY */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Library Activity</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {issues.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="flex justify-between rounded-lg border border-white/10 p-3 text-sm"
            >
              <span>{item.memberName}</span>
              <span className="text-muted-foreground">
                {item.bookTitle}
              </span>
              <Badge className="capitalize">
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}