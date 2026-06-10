"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { examSchema, type ExamFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { EXAM_TYPES } from "@/constants";
import { useExamsStorage } from "@/hooks/use-exams-storage";
import { useClassStore } from "@/store/class-store";
import { useSubjectsStorage } from "@/hooks/use-subjects-storage";

export default function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { getExamById, updateExam, isLoaded: examsLoaded } = useExamsStorage();
  const classes = useClassStore((state) => state.classes);
  const { subjects, isLoaded: subjectsLoaded } = useSubjectsStorage();
  const [mounted, setMounted] = useState(false);

  const exam = getExamById(id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (exam) {
      reset({
        name: exam.name,
        type: exam.type,
        classId: exam.classId,
        subjectId: exam.subjectId,
        examDate: exam.examDate,
        startTime: exam.startTime,
        endTime: exam.endTime,
        totalMarks: exam.totalMarks,
        passMarks: exam.passMarks,
      });
    }
  }, [exam, reset]);

  if (!mounted || !examsLoaded || !subjectsLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!exam) {
    notFound();
  }

  const onSubmit = async (data: ExamFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const className = classes.find(c => c.id === data.classId)?.name || "";
      const subjectName = subjects.find(s => s.id === data.subjectId)?.name || "";

      updateExam(id, {
        name: data.name,
        type: data.type,
        classId: data.classId,
        className: className,
        subjectId: data.subjectId,
        subjectName: subjectName,
        examDate: data.examDate,
        startTime: data.startTime,
        endTime: data.endTime,
        totalMarks: data.totalMarks,
        passMarks: data.passMarks,
      });

      toast.success("Exam updated successfully!");
      router.push("/dashboard/exams");
    } catch (error) {
      toast.error("Failed to update exam");
    }
  };

  const onError = (errors: FieldErrors<ExamFormData>) => {
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Exam"
        description={`Edit details for ${exam.name}`}
        breadcrumbs={[
          { label: "Exams", href: "/dashboard/exams" },
          { label: "Edit Exam" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Exam Name <span className="text-destructive">*</span></Label>
              <Input id="name" {...register("name")} placeholder="e.g. Mid Term Exam 2024" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Exam Type <span className="text-destructive">*</span></Label>
              <Select defaultValue={exam.type} onValueChange={(val) => setValue("type", val as ExamFormData["type"], { shouldValidate: true })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXAM_TYPES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">Class <span className="text-destructive">*</span></Label>
              <Select defaultValue={exam.classId} onValueChange={(val) => setValue("classId", val, { shouldValidate: true })}>
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
              <Select defaultValue={exam.subjectId} onValueChange={(val) => setValue("subjectId", val, { shouldValidate: true })}>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule & Marks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date <span className="text-destructive">*</span></Label>
              <Input id="examDate" type="date" {...register("examDate")} />
              {errors.examDate && <p className="text-sm text-destructive">{errors.examDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time <span className="text-destructive">*</span></Label>
              <Input id="startTime" type="time" {...register("startTime")} />
              {errors.startTime && <p className="text-sm text-destructive">{errors.startTime.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time <span className="text-destructive">*</span></Label>
              <Input id="endTime" type="time" {...register("endTime")} />
              {errors.endTime && <p className="text-sm text-destructive">{errors.endTime.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks <span className="text-destructive">*</span></Label>
              <Input id="totalMarks" type="number" {...register("totalMarks", { valueAsNumber: true })} placeholder="100" />
              {errors.totalMarks && <p className="text-sm text-destructive">{errors.totalMarks.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passMarks">Pass Marks <span className="text-destructive">*</span></Label>
              <Input id="passMarks" type="number" {...register("passMarks", { valueAsNumber: true })} placeholder="40" />
              {errors.passMarks && <p className="text-sm text-destructive">{errors.passMarks.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
