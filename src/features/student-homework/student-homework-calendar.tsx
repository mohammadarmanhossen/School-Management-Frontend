"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { mockStudentHomework } from "@/lib/mock-student-homework";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function StudentHomeworkCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getHomeworkForDay = (date: Date) => {
    return mockStudentHomework.filter(hw => isSameDay(parseISO(hw.dueDate), date));
  };

  return (
    <Card className="dashboard-card border-white/[0.08]">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.05] pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-purple-400" />
          Assignment Calendar
        </CardTitle>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-white">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 border-white/[0.1] bg-transparent hover:bg-white/5 hover:text-white" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 border-white/[0.1] bg-transparent hover:bg-white/5 hover:text-white" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b border-white/[0.05]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {daysInMonth.map((date, idx) => {
            const hws = getHomeworkForDay(date);
            return (
              <div 
                key={date.toISOString()} 
                className={cn(
                  "border-b border-r border-white/[0.05] p-2 transition-colors hover:bg-white/[0.02]",
                  !isSameMonth(date, currentDate) && "opacity-30"
                )}
              >
                <span className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isSameDay(date, new Date()) ? "bg-blue-600 text-white font-bold" : "text-zinc-400"
                )}>
                  {format(date, "d")}
                </span>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[75px] scrollbar-hide">
                  {hws.map(hw => (
                    <div 
                      key={hw.id} 
                      className={cn(
                        "text-[10px] truncate px-1.5 py-1 rounded border",
                        hw.status === "submitted" || hw.status === "reviewed" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : hw.status === "overdue"
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      )}
                      title={hw.title}
                    >
                      {format(parseISO(hw.dueDate), "HH:mm")} - {hw.subject}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
