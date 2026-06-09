"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, ClipboardCheck, Users } from "lucide-react";

export default function TeacherDashboardRoutine() {
  const todayClasses = [
    {
      id: 1,
      className: "Class 10",
      subject: "Mathematics",
      time: "09:00 AM",
      status: "upcoming",
    },
    {
      id: 2,
      className: "Class 9",
      subject: "Physics",
      time: "11:00 AM",
      status: "completed",
    },
    {
      id: 3,
      className: "Class 8",
      subject: "Chemistry",
      time: "01:00 PM",
      status: "upcoming",
    },
  ];

  const homework = [
    { id: 1, title: "Algebra Exercise", class: "Class 10", status: "pending" },
    { id: 2, title: "Motion Problems", class: "Class 9", status: "checked" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Teacher Daily Routine"
        description="Manage your daily teaching activities"
        breadcrumbs={[
          { label: "Teacher Dashboard", href: "/teacher/dashboard" },
          { label: "Routine" },
        ]}
      />

      {/* TOP CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">120</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Today Classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <ClipboardCheck className="mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-muted-foreground">Pending Homework</p>
          </CardContent>
        </Card>
      </div>

      {/* TODAY CLASSES */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Classes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {todayClasses.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between border p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">
                  {c.className} - {c.subject}
                </p>
                <p className="text-sm text-muted-foreground">
                  Time: {c.time}
                </p>
              </div>

              <Badge
                className={
                  c.status === "completed"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-yellow-500/10 text-yellow-500"
                }
              >
                {c.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* HOMEWORK */}
      <Card>
        <CardHeader>
          <CardTitle>Homework Routine</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {homework.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between border p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">{h.title}</p>
                <p className="text-sm text-muted-foreground">
                  {h.class}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  className={
                    h.status === "checked"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-amber-500/10 text-amber-500"
                  }
                >
                  {h.status}
                </Badge>

                {h.status === "pending" && (
                  <Button size="sm">Review</Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-3 flex-wrap">
          <Button>
            <BookOpen className="mr-2 h-4 w-4" />
            Create Lesson Plan
          </Button>

          <Button variant="outline">
            Take Attendance
          </Button>

          <Button variant="outline">
            Add Homework
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

