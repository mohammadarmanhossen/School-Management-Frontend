"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useParentStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Droplet, User, GraduationCap, School } from "lucide-react";

export default function MyChildPage() {
  const [mounted, setMounted] = useState(false);
  const { children, selectedChildId } = useParentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const child = children.find((c) => c.id === selectedChildId);
  if (!child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Profile"
        description="Detailed information about your child."
        breadcrumbs={[{ label: "Parent Dashboard", href: "/parent/dashboard" }, { label: "Student" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-zinc-900 to-zinc-950 lg:col-span-1">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Avatar className="mb-4 h-32 w-32 border-4 border-blue-500/20">
              <AvatarImage src={child.photoUrl} alt={child.name} />
              <AvatarFallback className="bg-blue-500/10 text-4xl text-blue-500">
                {child.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-white">{child.name}</h2>
            <Badge variant="outline" className="mt-2 bg-blue-500/10 text-blue-400 border-blue-500/20">
              Student ID: {child.studentId}
            </Badge>
          </CardContent>
        </Card>

        {/* Academic Details */}
        <Card className="dashboard-card border-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-400" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <School className="h-4 w-4" /> Class
              </div>
              <p className="font-medium text-white">{child.class}</p>
            </div>
            <div className="space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Users className="h-4 w-4" /> Section
              </div>
              <p className="font-medium text-white">{child.section}</p>
            </div>
            <div className="space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <User className="h-4 w-4" /> Roll Number
              </div>
              <p className="font-medium text-white">{child.rollNumber}</p>
            </div>
            <div className="space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <CalendarDays className="h-4 w-4" /> Academic Year
              </div>
              <p className="font-medium text-white">{child.academicYear}</p>
            </div>
            <div className="space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Droplet className="h-4 w-4" /> Blood Group
              </div>
              <p className="font-medium text-white">{child.bloodGroup}</p>
            </div>
            <div className="space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <User className="h-4 w-4" /> Class Teacher
              </div>
              <p className="font-medium text-white">{child.classTeacher}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { CalendarDays } from "lucide-react";
