"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAssignmentsStorage } from "@/hooks/use-assignments-storage";
import { ArrowLeft, Edit, FileText, Calendar, BookOpen, Users, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AssignmentViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getAssignmentById, isLoaded } = useAssignmentsStorage();

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const assignment = getAssignmentById(id);

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <FileText className="h-12 w-12 text-zinc-400" />
        <h2 className="text-xl font-semibold">Assignment Not Found</h2>
        <Button onClick={() => router.push("/dashboard/assignments")}>Back to Assignments</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignment Details"
        description={assignment.title}
        breadcrumbs={[
          { label: "Assignments", href: "/dashboard/assignments" },
          { label: "View Assignment" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/assignments")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={() => router.push(`/dashboard/assignments/edit/${id}`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Assignment
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{assignment.title}</CardTitle>
                  <CardDescription className="mt-2">
                    Created by {assignment.teacherName}
                  </CardDescription>
                </div>
                <Badge variant={assignment.status === "published" ? "success" : assignment.status === "draft" ? "secondary" : "destructive"}>
                  {assignment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="whitespace-pre-wrap text-zinc-300">{assignment.description}</p>
              </div>
              
              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {assignment.attachments.map((attachment, idx) => (
                      <li key={idx} className="text-blue-400 hover:underline cursor-pointer">
                        {attachment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-sm text-zinc-400">Class & Subject</p>
                  <p className="font-medium">{assignment.className} - {assignment.subjectName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-sm text-zinc-400">Due Date</p>
                  <p className="font-medium">{formatDate(assignment.dueDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-zinc-400">Maximum Marks</p>
                  <p className="font-medium">{assignment.maxMarks}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-zinc-400">Submissions</p>
                  <p className="font-medium">{assignment.submissionCount} / {assignment.totalStudents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
