"use client";

import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, ArrowLeft } from "lucide-react";
import { useSubjectsStorage } from "@/hooks/use-subjects-storage";

export default function SubjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getSubjectById, isLoaded } = useSubjectsStorage();

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const subject = getSubjectById(id);

  if (!subject) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Subject Details"
          description={`View details for ${subject.name}`}
          breadcrumbs={[
            { label: "Subjects", href: "/dashboard/subjects" },
            { label: subject.name },
          ]}
          actions={
            <Button onClick={() => router.push(`/dashboard/subjects/edit/${subject.id}`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Subject
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subject Code</p>
              <p className="text-lg font-semibold">{subject.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subject Name</p>
              <p className="text-lg">{subject.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Credits</p>
              <p className="text-lg">{subject.credits}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned Teacher</p>
              <p className="text-lg">{subject.teacherName || "Unassigned"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned Class</p>
              <p className="text-lg">{subject.className || "Unassigned"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
