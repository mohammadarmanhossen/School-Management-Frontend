"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { assignmentSchema, type AssignmentFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAssignmentsStorage } from "@/hooks/use-assignments-storage";
import { useClassStore } from "@/store/class-store";
import { useSubjectsStorage } from "@/hooks/use-subjects-storage";
import { useTeachersStorage } from "@/hooks/use-teachers-storage";
import { notFound } from "next/navigation";

export default function EditAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { getAssignmentById, updateAssignment, isLoaded: assignmentsLoaded } = useAssignmentsStorage();
  const classes = useClassStore((state) => state.classes);
  const { subjects, isLoaded: subjectsLoaded } = useSubjectsStorage();
  const { teachers, isLoaded: teachersLoaded } = useTeachersStorage();
  
  const [mounted, setMounted] = useState(false);
  const assignment = getAssignmentById(id);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
  });

  useEffect(() => {
    if (assignment) {
      reset({
        title: assignment.title,
        description: assignment.description,
        classId: assignment.classId,
        subjectId: assignment.subjectId,
        teacherId: assignment.teacherId,
        dueDate: assignment.dueDate,
        status: assignment.status as "draft" | "published" | "closed",
      });
    }
  }, [assignment, reset]);

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const className = classes.find(c => c.id === data.classId)?.name || "";
      const subjectName = subjects.find(s => s.id === data.subjectId)?.name || "";
      const teacherName = teachers.find(t => t.id === data.teacherId)?.fullName || "";

      updateAssignment(id, {
        title: data.title,
        description: data.description,
        classId: data.classId,
        className: className,
        subjectId: data.subjectId,
        subjectName: subjectName,
        teacherId: data.teacherId,
        teacherName: teacherName,
        dueDate: data.dueDate,
        status: data.status,
      });

      toast.success("Assignment updated successfully!");
      router.push("/dashboard/assignments");
    } catch (error) {
      toast.error("Failed to update assignment");
    }
  };

  const onError = (errors: FieldErrors<AssignmentFormData>) => {
    toast.error("Please fill in all required fields correctly.");
  };

  if (!mounted || !subjectsLoaded || !teachersLoaded || !assignmentsLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!assignment) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Assignment"
        description={`Update information for ${assignment.title}`}
        breadcrumbs={[
          { label: "Assignments", href: "/dashboard/assignments" },
          { label: "Edit Assignment" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input id="title" {...register("title")} placeholder="e.g. Chapter 4 Math Homework" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea id="description" {...register("description")} placeholder="Describe the assignment..." className="min-h-[120px]" />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="classId">Class <span className="text-destructive">*</span></Label>
                <Select defaultValue={assignment.classId} onValueChange={(val) => setValue("classId", val, { shouldValidate: true })}>
                  <SelectTrigger id="classId">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.length === 0 ? (
                      <SelectItem value="none" disabled>No classes found</SelectItem>
                    ) : (
                      classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name} (Grade {cls.grade})</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.classId && <p className="text-sm text-destructive">{errors.classId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectId">Subject <span className="text-destructive">*</span></Label>
                <Select defaultValue={assignment.subjectId} onValueChange={(val) => setValue("subjectId", val, { shouldValidate: true })}>
                  <SelectTrigger id="subjectId">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.length === 0 ? (
                      <SelectItem value="none" disabled>No subjects found</SelectItem>
                    ) : (
                      subjects.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name} ({sub.code})</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.subjectId && <p className="text-sm text-destructive">{errors.subjectId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherId">Teacher <span className="text-destructive">*</span></Label>
                <Select defaultValue={assignment.teacherId} onValueChange={(val) => setValue("teacherId", val, { shouldValidate: true })}>
                  <SelectTrigger id="teacherId">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.length === 0 ? (
                      <SelectItem value="none" disabled>No teachers found</SelectItem>
                    ) : (
                      teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>{teacher.fullName}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.teacherId && <p className="text-sm text-destructive">{errors.teacherId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date <span className="text-destructive">*</span></Label>
                <Input id="dueDate" type="date" {...register("dueDate")} />
                {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={assignment.status} onValueChange={(val) => setValue("status", val as AssignmentFormData["status"], { shouldValidate: true })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
