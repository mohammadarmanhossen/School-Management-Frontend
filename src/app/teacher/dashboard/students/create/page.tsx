"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { studentSchema, type StudentFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BLOOD_GROUPS, GENDERS } from "@/constants";
import { mockClasses, mockSections } from "@/lib/mock-data";
import { toast } from "sonner";

export default function CreateStudentPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: { status: "active", gender: "male" },
  });

  const classId = watch("classId");

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Student created successfully");
    router.push("/dashboard/students");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Student"
        description="Register a new student"
        breadcrumbs={[
          { label: "Students", href: "/dashboard/students" },
          { label: "Add Student" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Student ID</Label>
              <Input {...register("studentId")} placeholder="STU-2025-0001" />
              {errors.studentId && <p className="text-sm text-destructive">{errors.studentId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Roll Number</Label>
              <Input {...register("rollNumber")} />
              {errors.rollNumber && <p className="text-sm text-destructive">{errors.rollNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input {...register("fullName")} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(v) => setValue("gender", v as StudentFormData["gender"])} defaultValue="male">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" {...register("dateOfBirth")} />
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select onValueChange={(v) => setValue("bloodGroup", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
              <Label>Address</Label>
              <Input {...register("address")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Academic Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Admission Date</Label>
              <Input type="date" {...register("admissionDate")} />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select onValueChange={(v) => setValue("classId", v)}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {mockClasses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select onValueChange={(v) => setValue("sectionId", v)} disabled={!classId}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  {mockSections.filter((s) => !classId || s.classId === classId).map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Parent Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Parent Name</Label>
              <Input {...register("parentName")} />
            </div>
            <div className="space-y-2">
              <Label>Parent Phone</Label>
              <Input {...register("parentPhone")} />
            </div>
            <div className="space-y-2">
              <Label>Parent Email</Label>
              <Input type="email" {...register("parentEmail")} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Student
          </Button>
        </div>
      </form>
    </div>
  );
}
