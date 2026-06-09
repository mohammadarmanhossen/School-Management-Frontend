"use client";

import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, ArrowLeft, Calendar, Clock, FileText } from "lucide-react";
import { useExamsStorage } from "@/hooks/use-exams-storage";
import { Badge } from "@/components/ui/badge";
import { EXAM_TYPES } from "@/constants";
import { formatDate } from "@/lib/utils";

export default function ExamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getExamById, isLoaded } = useExamsStorage();

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const exam = getExamById(id);

  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Exam Details"
          description={`View details for ${exam.name}`}
          breadcrumbs={[
            { label: "Exams", href: "/teacher/dashboard/exam" },
            { label: exam.name },
          ]}
          actions={
            <Button onClick={() => router.push(`/teacher/dashboard/exam/edit/${exam.id}`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Exam
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Exam Name</p>
              <p className="text-lg font-semibold">{exam.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Exam Type</p>
              <p className="text-lg">{EXAM_TYPES[exam.type]}</p>
            </div>
            <div className="flex gap-4 pt-2">
              <Badge variant={exam.status === "scheduled" ? "warning" : "success"}>
                {exam.status.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class & Subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned Class</p>
              <p className="text-lg">{exam.className || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned Subject</p>
              <p className="text-lg">{exam.subjectName || "Unknown"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg">{formatDate(exam.examDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time</p>
                <p className="text-lg">{exam.startTime} - {exam.endTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marks Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
                <p className="text-lg">{exam.totalMarks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-[52px]">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Passing Marks</p>
                <p className="text-lg text-emerald-600 font-medium">{exam.passMarks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
