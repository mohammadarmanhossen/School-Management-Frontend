"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { classSchema, type ClassFormData } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClassRoom, Teacher } from "@/types";

interface ClassFormProps {
  teachers: Teacher[];
  defaultValues?: Partial<ClassFormData>;
  onSubmit: (data: ClassFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export function ClassForm({
  teachers,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Class",
  isLoading = false,
}: ClassFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      academicYear: new Date().getFullYear().toString(),
      ...defaultValues,
    },
  });

  const teacherId = watch("teacherId");

  useEffect(() => {
    if (defaultValues) {
      reset({
        academicYear: new Date().getFullYear().toString(),
        ...defaultValues,
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Class Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" {...register("name")} placeholder="e.g. Class 10A" />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">
              Grade Level <span className="text-destructive">*</span>
            </Label>
            <Input id="grade" type="number" min={1} max={12} {...register("grade")} placeholder="1 – 12" />
            {errors.grade && (
              <p className="text-sm text-destructive">{errors.grade.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">
              Capacity <span className="text-destructive">*</span>
            </Label>
            <Input id="capacity" type="number" min={1} {...register("capacity")} placeholder="e.g. 40" />
            {errors.capacity && (
              <p className="text-sm text-destructive">{errors.capacity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">
              Academic Year <span className="text-destructive">*</span>
            </Label>
            <Input id="academicYear" {...register("academicYear")} placeholder="e.g. 2025-2026" />
            {errors.academicYear && (
              <p className="text-sm text-destructive">{errors.academicYear.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="teacherId">Class Teacher</Label>
            <Select
              value={teacherId || "none"}
              onValueChange={(val) =>
                setValue("teacherId", val === "none" ? undefined : val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="teacherId">
                <SelectValue placeholder="Select a teacher (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No teacher assigned</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.fullName} — {teacher.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting || isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function classToFormData(cls: ClassRoom): ClassFormData {
  return {
    name: cls.name,
    grade: cls.grade,
    capacity: cls.capacity,
    academicYear: cls.academicYear,
    teacherId: cls.teacherId,
  };
}
