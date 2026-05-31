"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

export default function CreateTeacherPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { gender: "male" },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Teacher created successfully");
    router.push("/dashboard/teachers");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Teacher" breadcrumbs={[{ label: "Teachers", href: "/dashboard/teachers" }, { label: "Add" }]} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Teacher Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2"><Label>Employee ID</Label><Input {...register("employeeId")} /></div>
            <div className="space-y-2"><Label>Full Name</Label><Input {...register("fullName")} /></div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(v) => setValue("gender", v as TeacherFormData["gender"])} defaultValue="male">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GENDERS.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Qualification</Label><Input {...register("qualification")} /></div>
            <div className="space-y-2"><Label>Specialization</Label><Input {...register("specialization")} /></div>
            <div className="space-y-2"><Label>Salary</Label><Input type="number" {...register("salary")} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input {...register("phone")} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" {...register("email")} /></div>
            <div className="space-y-2"><Label>Joining Date</Label><Input type="date" {...register("joiningDate")} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input {...register("address")} /></div>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Teacher</Button>
        </div>
      </form>
    </div>
  );
}
