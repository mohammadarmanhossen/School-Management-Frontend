"use client";

import { Download } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTimetable } from "@/lib/mock-data";
import { toast } from "sonner";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="Weekly class and exam routines" breadcrumbs={[{ label: "Timetable" }]}
        actions={<Button variant="outline" onClick={() => toast.success("PDF exported")}><Download className="mr-2 h-4 w-4" /> Export PDF</Button>} />
      <Tabs defaultValue="class">
        <TabsList>
          <TabsTrigger value="class">Class Routine</TabsTrigger>
          <TabsTrigger value="teacher">Teacher Schedule</TabsTrigger>
          <TabsTrigger value="exam">Exam Routine</TabsTrigger>
        </TabsList>
        <TabsContent value="class" className="space-y-4">
          {DAYS.map((day) => {
            const entries = mockTimetable.filter((t) => t.day === day);
            if (entries.length === 0) return null;
            return (
              <Card key={day}>
                <CardHeader><CardTitle className="text-base">{day}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {entries.map((entry) => (
                      <div key={entry.id} className="rounded-lg border p-4">
                        <p className="font-medium">{entry.subjectName}</p>
                        <p className="text-sm text-muted-foreground">{entry.teacherName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{entry.startTime} - {entry.endTime} | Room {entry.room}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="teacher">
          <div className="rounded-xl border p-8 text-center text-muted-foreground">Teacher schedule view</div>
        </TabsContent>
        <TabsContent value="exam">
          <div className="rounded-xl border p-8 text-center text-muted-foreground">Exam routine view</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
