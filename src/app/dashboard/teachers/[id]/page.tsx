"use client";

import { use } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTeachersStorage } from "@/hooks/use-teachers-storage";
import { getInitials, formatCurrency, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getTeacherById, isLoaded } = useTeachersStorage();

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const teacher = getTeacherById(id);
  if (!teacher) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={teacher.fullName} description={teacher.employeeId}
        breadcrumbs={[{ label: "Teachers", href: "/dashboard/teachers" }, { label: teacher.fullName }]}
        actions={<Button asChild variant="outline"><Link href={`/dashboard/teachers/edit/${teacher.id}`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link></Button>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center pt-6">
            <Avatar className="h-24 w-24"><AvatarFallback className="text-2xl">{getInitials(teacher.fullName)}</AvatarFallback></Avatar>
            <h3 className="mt-4 text-xl font-semibold">{teacher.fullName}</h3>
            <Badge className="mt-2">{teacher.specialization}</Badge>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div><p className="text-sm text-muted-foreground">Qualification</p><p className="font-medium">{teacher.qualification}</p></div>
            <div><p className="text-sm text-muted-foreground">Salary</p><p className="font-medium">{formatCurrency(teacher.salary)}</p></div>
            <div><p className="text-sm text-muted-foreground">Joining Date</p><p className="font-medium">{formatDate(teacher.joiningDate)}</p></div>
            <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{teacher.phone}</p></div>
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{teacher.email}</p></div>
            <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{teacher.address}</p></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
