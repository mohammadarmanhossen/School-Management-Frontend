"use client";

import { use } from "react";
import Link from "next/link";
import { Pencil, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockStudents } from "@/lib/mock-data";
import { getInitials, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = mockStudents.find((s) => s.id === id);
  if (!student) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={student.fullName}
        description={student.studentId}
        breadcrumbs={[
          { label: "Students", href: "/dashboard/students" },
          { label: student.fullName },
        ]}
        actions={
          <Button asChild>
            <Link href={`/dashboard/students/edit/${student.id}`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{getInitials(student.fullName)}</AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-xl font-semibold">{student.fullName}</h3>
            <p className="text-muted-foreground">{student.studentId}</p>
            <Badge className="mt-2" variant={student.status === "active" ? "success" : "secondary"}>
              {student.status}
            </Badge>
            <div className="mt-6 w-full space-y-3 text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{student.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{student.phone}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{student.address}</div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />DOB: {formatDate(student.dateOfBirth)}</div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Academic Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><p className="text-sm text-muted-foreground">Class</p><p className="font-medium">{student.className}</p></div>
              <div><p className="text-sm text-muted-foreground">Section</p><p className="font-medium">{student.sectionName}</p></div>
              <div><p className="text-sm text-muted-foreground">Roll Number</p><p className="font-medium">{student.rollNumber}</p></div>
              <div><p className="text-sm text-muted-foreground">Admission Date</p><p className="font-medium">{formatDate(student.admissionDate)}</p></div>
              <div><p className="text-sm text-muted-foreground">Blood Group</p><p className="font-medium">{student.bloodGroup}</p></div>
              <div><p className="text-sm text-muted-foreground">Gender</p><p className="font-medium capitalize">{student.gender}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Parent Information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{student.parentName}</p></div>
              <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{student.parentPhone}</p></div>
              <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{student.parentEmail || "N/A"}</p></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
