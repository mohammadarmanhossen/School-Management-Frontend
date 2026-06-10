"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { subjectSchema, type SubjectFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSubjectsStorage } from "@/hooks/use-subjects-storage";
import { useTeachersStorage } from "@/hooks/use-teachers-storage";
import { useClassStore } from "@/store/class-store";
import { notFound } from "next/navigation";

export default function EditSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getSubjectById, updateSubject, isLoaded: subjectsLoaded } = useSubjectsStorage();
  const { teachers, isLoaded: teachersLoaded } = useTeachersStorage();
  const classes = useClassStore((state) => state.classes);
  const [mounted, setMounted] = useState(false);

  const subject = getSubjectById(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  useEffect(() => {
    if (subject) {
      reset({
        code: subject.code,
        name: subject.name,
        credits: subject.credits,
        teacherId: subject.teacherId,
        classId: subject.classId,
      });
    }
  }, [subject, reset]);

  if (!mounted || !teachersLoaded || !subjectsLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!subject) {
    notFound();
  }

  const onSubmit = async (data: SubjectFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const teacherName = teachers.find(t => t.id === data.teacherId)?.fullName;
      const className = classes.find(c => c.id === data.classId)?.name;

      updateSubject(id, {
        code: data.code,
        name: data.name,
        credits: data.credits,
        teacherId: data.teacherId,
        teacherName: teacherName,
        classId: data.classId,
        className: className,
      });

      toast.success("Subject updated successfully!");
      router.push("/dashboard/subjects");
    } catch (error) {
      toast.error("Failed to update subject");
    }
  };

  const onError = (errors: FieldErrors<SubjectFormData>) => {
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Subject"
        description={`Edit information for ${subject.name}`}
        breadcrumbs={[
          { label: "Subjects", href: "/dashboard/subjects" },
          { label: "Edit Subject" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="code">Subject Code <span className="text-destructive">*</span></Label>
              <Input id="code" {...register("code")} placeholder="e.g. MAT101" />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Subject Name <span className="text-destructive">*</span></Label>
              <Input id="name" {...register("name")} placeholder="e.g. Mathematics" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Credits <span className="text-destructive">*</span></Label>
              <Input id="credits" type="number" {...register("credits", { valueAsNumber: true })} placeholder="e.g. 3" />
              {errors.credits && <p className="text-sm text-destructive">{errors.credits.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="teacherId">Assigned Teacher</Label>
              <Select defaultValue={subject.teacherId} onValueChange={(val) => setValue("teacherId", val, { shouldValidate: true })}>
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
              <Label htmlFor="classId">Assigned Class</Label>
              <Select defaultValue={subject.classId} onValueChange={(val) => setValue("classId", val, { shouldValidate: true })}>
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
