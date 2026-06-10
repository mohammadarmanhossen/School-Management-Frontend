"use client";

import { useTimetableStore } from "@/store/timetable-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const TIME_SLOTS = [
  "08:00 - 08:45",
  "08:45 - 09:30",
  "09:30 - 09:45", // Break
  "09:45 - 10:30",
  "10:30 - 11:15",
  "11:15 - 12:00",
];

export function TeacherWeeklyGrid({ teacherId }: { teacherId: string }) {
  const { getTeacherSchedule } = useTimetableStore();
  const schedule = getTeacherSchedule(teacherId);

  // Helper to find class at specific time and day
  const getClass = (day: string, timeString: string) => {
    const [start] = timeString.split(" - ");
    return schedule.find(s => s.day === day && s.startTime === start);
  };

  return (
    <Card className="dashboard-card border-white/[0.08]">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <CardTitle>Weekly Timetable</CardTitle>
          <CardDescription>Your complete teaching schedule</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white/[0.02] border-white/[0.08]">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="outline" size="sm" className="bg-white/[0.02] border-white/[0.08]">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-6 border-b border-white/[0.08] bg-white/[0.02]">
            <div className="p-4 text-center font-semibold text-zinc-400 border-r border-white/[0.08]">Time</div>
            {DAYS.map(day => (
              <div key={day} className="p-4 text-center font-semibold text-zinc-300 border-r border-white/[0.08] last:border-0">
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {TIME_SLOTS.map((slot, i) => {
            const isBreak = slot.includes("09:30");
            
            if (isBreak) {
              return (
                <div key={slot} className="grid grid-cols-6 border-b border-white/[0.08] bg-white/[0.01]">
                  <div className="p-3 text-center text-xs text-zinc-500 font-medium border-r border-white/[0.08] flex items-center justify-center">
                    {slot}
                  </div>
                  <div className="col-span-5 p-3 text-center text-sm font-medium text-amber-400/80 tracking-widest uppercase">
                    Tea Break
                  </div>
                </div>
              );
            }

            return (
              <div key={slot} className="grid grid-cols-6 border-b border-white/[0.08] last:border-0">
                <div className="p-3 text-center text-xs text-zinc-500 font-medium border-r border-white/[0.08] flex items-center justify-center bg-white/[0.01]">
                  {slot}
                </div>
                
                {DAYS.map(day => {
                  const classEntry = getClass(day, slot);
                  return (
                    <div key={`${day}-${slot}`} className="p-2 border-r border-white/[0.08] last:border-0 relative min-h-[90px]">
                      {classEntry ? (
                        <div className={cn(
                          "absolute inset-1 rounded-md p-2 flex flex-col justify-center border",
                          classEntry.color || "bg-blue-500/10 border-blue-500/20 text-blue-100"
                        )}>
                          <div className="font-semibold text-sm line-clamp-1">{classEntry.subjectName}</div>
                          <div className="text-xs opacity-80 mt-1">{classEntry.className} • {classEntry.sectionName && `Sec ${classEntry.sectionName}`}</div>
                          <div className="text-xs opacity-60 mt-0.5">Room {classEntry.room}</div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 font-medium">
                          Free
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
