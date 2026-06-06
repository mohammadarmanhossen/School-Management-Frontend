"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { mockTeachers, mockClasses } from "@/lib/mock-data";

export default function CreateSubjectPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  const onSubmit = async (data: SubjectFormData) => {
    console.log("Submitting subject data:", data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Subject created successfully!");
    router.push("/dashboard/subjects");
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Subject"
        description="Create a new subject and assign it to a teacher and class"
        breadcrumbs={[
          { label: "Subjects", href: "/dashboard/subjects" },
          { label: "Add Subject" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="code">
                Subject Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                {...register("code")}
                placeholder="e.g. MAT101"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Subject Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g. Mathematics"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">
                Credits <span className="text-destructive">*</span>
              </Label>
              <Input
                id="credits"
                type="number"
                {...register("credits")}
                placeholder="e.g. 3"
              />
              {errors.credits && (
                <p className="text-sm text-destructive">{errors.credits.message}</p>
              )}
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
              <Label htmlFor="classId">Assigned Class</Label>
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
            {isSubmitting ? "Saving..." : "Add Subject"}
          </Button>
        </div>
      </form>
    </div>
  );
}
