"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { classSchema, type ClassFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { mockTeachers } from "@/lib/mock-data";

export default function CreateClassPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      academicYear: new Date().getFullYear().toString(),
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    console.log("Submitting class data:", data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Class created successfully!");
    router.push("/dashboard/classes");
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Class"
        description="Create a new class for the academic year"
        breadcrumbs={[
          { label: "Classes", href: "/dashboard/classes" },
          { label: "Add Class" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Class Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g. Class 10A"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">
                Grade Level <span className="text-destructive">*</span>
              </Label>
              <Input
                id="grade"
                type="number"
                {...register("grade")}
                placeholder="1 - 12"
              />
              {errors.grade && (
                <p className="text-sm text-destructive">{errors.grade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">
                Capacity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="capacity"
                type="number"
                {...register("capacity")}
                placeholder="e.g. 40"
              />
              {errors.capacity && (
                <p className="text-sm text-destructive">{errors.capacity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">
                Academic Year <span className="text-destructive">*</span>
              </Label>
              <Input
                id="academicYear"
                {...register("academicYear")}
                placeholder="e.g. 2024-2025"
              />
              {errors.academicYear && (
                <p className="text-sm text-destructive">{errors.academicYear.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="teacherId">Class Teacher</Label>
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
            {isSubmitting ? "Saving..." : "Add Class"}
          </Button>
        </div>
      </form>
    </div>
  );
}
