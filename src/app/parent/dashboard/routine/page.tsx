"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useParentStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function RoutinePage() {
  const [mounted, setMounted] = useState(false);
  const { children, selectedChildId, routines } = useParentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const child = children.find((c) => c.id === selectedChildId);
  if (!child) return null;

  const records = routines[child.id] || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Routine"
        description={`Weekly class schedule for ${child.name}.`}
        breadcrumbs={[{ label: "Parent Dashboard", href: "/parent/dashboard" }, { label: "Routine" }]}
      />

      <div className="grid gap-6 xl:grid-cols-5">
        {DAYS.map((day) => {
          const dayRoutine = records.find((r) => r.day === day)?.periods || [];
          const isToday = new Date().toLocaleDateString("en-US", { weekday: "long" }) === day;

          return (
            <Card 
              key={day} 
              className={`dashboard-card border-white/5 ${isToday ? 'bg-blue-500/5 border-blue-500/20' : ''}`}
            >
              <CardHeader className={`pb-3 ${isToday ? 'border-b border-blue-500/10' : 'border-b border-white/5'}`}>
                <CardTitle className={`text-base flex items-center gap-2 ${isToday ? 'text-blue-400' : 'text-zinc-300'}`}>
                  <CalendarDays className="h-4 w-4" />
                  {day} {isToday && <span className="ml-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400">Today</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {dayRoutine.length > 0 ? (
                  <div className="space-y-4">
                    {dayRoutine.map((period, idx) => (
                      <div key={idx} className="relative pl-4 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-blue-500/50">
                        <p className="font-medium text-white">{period.subject}</p>
                        <div className="mt-1 space-y-1 text-xs text-zinc-400">
                          <p className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {period.time}</p>
                          <p className="flex items-center gap-1.5"><User className="h-3 w-3" /> {period.teacher}</p>
                          <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {period.room}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-500">
                    <p className="text-sm">No classes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
