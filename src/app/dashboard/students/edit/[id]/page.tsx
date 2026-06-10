"use client";

import { use, useEffect } from "react";
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
import { mockClasses, mockSections } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { useStudentsStorage } from "@/hooks/use-students-storage";

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getStudentById, updateStudent, isLoaded } = useStudentsStorage();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const student = getStudentById(id);

  useEffect(() => {
    if (student) {
      reset({
        studentId: student.studentId,
        rollNumber: student.rollNumber,
        fullName: student.fullName,
        gender: student.gender as "male" | "female" | "other",
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
        status: student.status as any,
      });
    }
  }, [student, reset]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!student) notFound();

  const onSubmit = async (data: StudentFormData) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      const classObj = mockClasses.find((c) => c.id === data.classId);
      const sectionObj = mockSections.find((s) => s.id === data.sectionId);
      
      updateStudent(id, {
        studentId: data.studentId,
        rollNumber: data.rollNumber,
        fullName: data.fullName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        bloodGroup: data.bloodGroup,
        email: data.email,
        phone: data.phone,
        address: data.address,
        admissionDate: data.admissionDate,
        classId: data.classId,
        className: classObj?.name || student?.className,
        sectionId: data.sectionId,
        sectionName: sectionObj?.name || student?.sectionName,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
        status: data.status,
      });
      toast.success("Student updated successfully");
      router.push(`/dashboard/students/${id}`);
    } catch (error) {
      toast.error("Failed to update student");
    }
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
