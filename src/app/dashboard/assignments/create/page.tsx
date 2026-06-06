"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { mockClasses, mockSubjects, mockTeachers } from "@/lib/mock-data";

export default function CreateAssignmentPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { status: "active" },
  });

  const onSubmit = async (data: AssignmentFormData) => {
    console.log("Submitting assignment data:", data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Assignment created successfully!");
    router.push("/dashboard/assignments");
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Assignment"
        description="Assign a new task to a class"
        breadcrumbs={[
          { label: "Assignments", href: "/dashboard/assignments" },
          { label: "Create Assignment" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g. Chapter 4 Math Homework"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the assignment..."
                className="min-h-[120px]"
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="classId">
                  Class <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(val) =>
                    setValue("classId", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="classId">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} (Grade {cls.grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.classId && (
                  <p className="text-sm text-destructive">{errors.classId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectId">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(val) =>
                    setValue("subjectId", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="subjectId">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSubjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subjectId && (
                  <p className="text-sm text-destructive">{errors.subjectId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherId">
                  Teacher <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(val) =>
                    setValue("teacherId", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="teacherId">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.teacherId && (
                  <p className="text-sm text-destructive">{errors.teacherId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  Due Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate")}
                />
                {errors.dueDate && (
                  <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  defaultValue="active"
                  onValueChange={(val) =>
                    setValue("status", val as AssignmentFormData["status"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Create Assignment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
