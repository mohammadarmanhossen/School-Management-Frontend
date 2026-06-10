"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { teacherSchema, type TeacherFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GENDERS } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTeachersStorage } from "@/hooks/use-teachers-storage";
import { notFound } from "next/navigation";

export default function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { getTeacherById, updateTeacher, isLoaded } = useTeachersStorage();
  const [mounted, setMounted] = useState(false);

  const teacher = getTeacherById(id);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (teacher) {
      reset({
        employeeId: teacher.employeeId,
        fullName: teacher.fullName,
        gender: teacher.gender as "male" | "female" | "other",
        qualification: teacher.qualification,
        specialization: teacher.specialization,
        phone: teacher.phone,
        email: teacher.email,
        salary: teacher.salary,
        joiningDate: teacher.joiningDate,
        address: teacher.address,
        subjectIds: teacher.subjects,
      });
    }
  }, [teacher, reset]);

  if (!mounted || !isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!teacher) {
    notFound();
  }

  const onSubmit = async (data: TeacherFormData) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      
      updateTeacher(id, {
        employeeId: data.employeeId,
        fullName: data.fullName,
        gender: data.gender,
        qualification: data.qualification,
        specialization: data.specialization,
        phone: data.phone,
        email: data.email,
        salary: data.salary,
        joiningDate: data.joiningDate,
        address: data.address,
        subjects: data.subjectIds || [],
      });

      toast.success("Teacher updated successfully");
      router.push("/dashboard/teachers");
    } catch (error) {
      toast.error("Failed to update teacher");
    }
  };

  const onError = (errors: FieldErrors<TeacherFormData>) => {
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Teacher" description={`Editing details for ${teacher.fullName}`} breadcrumbs={[{ label: "Teachers", href: "/dashboard/teachers" }, { label: "Edit" }]} />
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Card>
          <CardHeader><CardTitle>Teacher Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Employee ID <span className="text-destructive">*</span></Label>
              <Input {...register("employeeId")} />
              {errors.employeeId && <p className="text-sm text-destructive">{errors.employeeId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input {...register("fullName")} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Gender <span className="text-destructive">*</span></Label>
              <Select defaultValue={teacher.gender} onValueChange={(v) => setValue("gender", v as TeacherFormData["gender"], { shouldValidate: true })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GENDERS.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Qualification <span className="text-destructive">*</span></Label>
              <Input {...register("qualification")} />
              {errors.qualification && <p className="text-sm text-destructive">{errors.qualification.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Specialization <span className="text-destructive">*</span></Label>
              <Input {...register("specialization")} />
              {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Salary <span className="text-destructive">*</span></Label>
              <Input type="number" {...register("salary", { valueAsNumber: true })} />
              {errors.salary && <p className="text-sm text-destructive">{errors.salary.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Phone <span className="text-destructive">*</span></Label>
              <Input {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Joining Date <span className="text-destructive">*</span></Label>
              <Input type="date" {...register("joiningDate")} />
              {errors.joiningDate && <p className="text-sm text-destructive">{errors.joiningDate.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address <span className="text-destructive">*</span></Label>
              <Input {...register("address")} />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
