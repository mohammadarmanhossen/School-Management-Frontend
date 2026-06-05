"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download, Calendar, CheckCircle2, TrendingUp, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockStudentProfile, mockStudentSubjectResults, mockExams } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function StudentExamsResultsPage() {
  const profile = mockStudentProfile;
  const results = mockStudentSubjectResults;
  
  // Use mock exams, filter for upcoming
  const upcomingExams = mockExams.slice(0, 2);

  const resultColumns: ColumnDef<typeof results[0]>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
            <BookOpen className="h-5 w-5 text-indigo-500" />
          </div>
          <span className="font-medium text-zinc-200">{row.original.subject}</span>
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: "Marks (%)",
      cell: ({ row }) => {
        const val = row.original.total;
        const colorClass = val >= 80 ? "text-emerald-400" : val >= 60 ? "text-blue-400" : "text-rose-400";
        return (
          <div className="flex items-center gap-3">
            <span className={`font-bold ${colorClass}`}>{val}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => {
        const grade = row.original.grade;
        const isExcellent = grade.includes("A");
        return (
          <Badge 
            variant="outline" 
            className={`font-bold px-3 py-1 ${isExcellent ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-indigo-500/30 text-indigo-400 bg-indigo-500/10"}`}
          >
            {grade}
          </Badge>
        );
      },
    },
    {
      id: "remarks",
      header: "Teacher Remarks",
      cell: ({ row }) => {
        const val = row.original.total;
        const remark = val >= 80 ? "Excellent work!" : val >= 60 ? "Good effort." : "Needs improvement.";
        return (
          <span className="text-zinc-400 italic text-sm">{remark}</span>
        );
      }
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Exams & Results"
          description={`Academic records and upcoming assessments for ${profile.name}`}
          breadcrumbs={[
            { label: "Student Portal", href: "/student/dashboard" },
            { label: "Exams & Results" },
          ]}
        />
        <Button 
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 px-6"
          onClick={() => toast.success("Downloading official transcript...")}
        >
          <Download className="mr-2 h-4 w-4" /> Download Transcript
        </Button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-indigo-600/20 via-zinc-950 to-zinc-950 group md:col-span-2">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl transition-all group-hover:bg-indigo-500/20" />
          <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 mb-4 border-0">
                Term 1 Final Results
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-2">Excellent Performance!</h2>
              <p className="text-zinc-400 max-w-md">
                You have secured a top rank in your class this term. Keep up the consistent effort for the upcoming finals.
              </p>
            </div>
            
            <div className="flex gap-6 shrink-0">
              <div className="text-center p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.04] backdrop-blur-sm">
                <p className="text-sm text-zinc-500 mb-1 uppercase tracking-wider font-medium">CGPA</p>
                <p className="text-4xl font-black text-indigo-400">{profile.gpa.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.04] backdrop-blur-sm">
                <p className="text-sm text-zinc-500 mb-1 uppercase tracking-wider font-medium">Rank</p>
                <p className="text-4xl font-black text-emerald-400">#{profile.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Exams summary */}
        <Card className="border-white/[0.08] bg-zinc-950 hover:bg-zinc-900/80 transition-colors">
          <CardHeader className="pb-3 border-b border-white/[0.04]">
            <CardTitle className="text-base font-semibold text-zinc-200 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" /> Upcoming Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="relative pl-4 border-l-2 border-indigo-500/30">
                <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                <p className="font-medium text-sm text-zinc-200">{exam.name}</p>
                <p className="text-xs text-zinc-500 mt-1">{formatDate(exam.examDate)} • {exam.startTime} - {exam.endTime}</p>
              </div>
            ))}
            <Button variant="link" className="text-indigo-400 px-0 text-sm w-full justify-start mt-2">
              View full schedule &rarr;
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Results Data Table */}
        <Card className="lg:col-span-3 border-white/[0.08] bg-zinc-950 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-white">Subject Wise Report</CardTitle>
                <CardDescription className="text-zinc-400">Detailed breakdown of your latest term examinations</CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-6 py-4">
              <DataTable columns={resultColumns} data={results} />
            </div>
          </CardContent>
        </Card>
 
        {/* Grade Distribution or Insights */}
        <Card className="lg:col-span-1 border-white/[0.08] bg-gradient-to-br from-zinc-900 to-zinc-950">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" /> Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-300">Highest Score</span>
                <span className="font-bold text-emerald-400">95%</span>
              </div>
              <p className="text-xs text-zinc-500">Mathematics</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-300">Requires Focus</span>
                <span className="font-bold text-amber-400">65%</span>
              </div>
              <p className="text-xs text-zinc-500">History</p>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-sm font-medium text-zinc-300 mb-3">Overall Progress</p>
              <div className="space-y-2">
                <Progress value={85} className="h-2 bg-zinc-800 [&>div]:bg-indigo-500" />
                <p className="text-xs text-zinc-500 text-right">Top 5% of class</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
