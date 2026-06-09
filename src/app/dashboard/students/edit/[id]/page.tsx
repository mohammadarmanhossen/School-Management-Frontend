"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { studentSchema, type StudentFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStudents } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { toast } from "sonner";

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const student = mockStudents.find((s) => s.id === id);
  if (!student) notFound();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: student.studentId,
      rollNumber: student.rollNumber,
      fullName: student.fullName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      bloodGroup: student.bloodGroup,
      email: student.email,
      phone: student.phone,
      address: student.address,
      admissionDate: student.admissionDate,
      classId: student.classId,
      sectionId: student.sectionId,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      status: student.status,
    },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Student updated successfully");
    router.push(`/dashboard/students/${id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Student"
        description={student.fullName}
        breadcrumbs={[
          { label: "Students", href: "/dashboard/students" },
          { label: student.fullName, href: `/dashboard/students/${id}` },
          { label: "Edit" },
        ]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Student Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2"><Label>Student ID</Label><Input {...register("studentId")} /></div>
            <div className="space-y-2"><Label>Roll Number</Label><Input {...register("rollNumber")} /></div>
            <div className="space-y-2"><Label>Full Name</Label><Input {...register("fullName")} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" {...register("email")} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input {...register("phone")} /></div>
            <div className="space-y-2"><Label>Address</Label><Input {...register("address")} /></div>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end gap-3">
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


