"use client";

import { useTimetableStore } from "@/store/timetable-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock getting today's day
const TODAY = "Sunday"; // Using Sunday to match our mock data

export function TeacherTodaySchedule({ teacherId }: { teacherId: string }) {
  const { getTeacherSchedule } = useTimetableStore();
  const schedule = getTeacherSchedule(teacherId)
    .filter(s => s.day === TODAY)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getCurrentStatus = (startTime: string, endTime: string) => {
    // In a real app, we'd compare with current time.
    // For mock purposes, we'll just hardcode some logic based on time slots.
    if (startTime === "08:00") return "completed";
    if (startTime === "08:45") return "ongoing";
    return "upcoming";
  };

  return (
    <Card className="dashboard-card border-white/[0.08]">
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
        <CardDescription>Your classes for {TODAY}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l border-white/[0.08] space-y-8 mt-2">
          {schedule.length > 0 ? (
            schedule.map((entry, index) => {
              const status = getCurrentStatus(entry.startTime, entry.endTime);
              const isOngoing = status === "ongoing";
              const isCompleted = status === "completed";

              return (
                <div key={entry.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={cn(
                    "absolute -left-[31px] w-4 h-4 rounded-full border-4 border-[#0a0a0a]",
                    isOngoing ? "bg-blue-500 animate-pulse" : isCompleted ? "bg-emerald-500" : "bg-zinc-600"
                  )} />

                  <div className={cn(
                    "p-5 rounded-xl border transition-all",
                    isOngoing 
                      ? "bg-blue-500/10 border-blue-500/20" 
                      : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04]"
                  )}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2",
                          isOngoing ? "bg-blue-500/20 text-blue-400" : "bg-white/[0.05] text-zinc-300"
                        )}>
                          <Clock className="w-4 h-4" />
                          {entry.startTime} - {entry.endTime}
                        </div>
                        {isOngoing && <Badge className="bg-blue-500 text-white">Ongoing Now</Badge>}
                        {isCompleted && <Badge variant="outline" className="text-emerald-400 border-emerald-400/20">Completed</Badge>}
                      </div>
                      
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <MapPin className="w-4 h-4" /> Room {entry.room}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{entry.subjectName}</h4>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <BookOpen className="w-4 h-4" />
                          {entry.type} • {entry.subjectCode}
                        </div>
                      </div>
                      
                      <div className="sm:text-right flex flex-col sm:items-end justify-center">
                        <div className="font-medium text-white mb-1">
                          {entry.className} {entry.sectionName && `(Section ${entry.sectionName})`}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Users className="w-4 h-4" /> 40 Students
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-zinc-500">
              No classes scheduled for today.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
