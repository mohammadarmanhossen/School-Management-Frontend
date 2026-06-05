"use client";

import { Clock, MapPin, User, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockStudentTodayClasses, mockStudentProfile } from "@/lib/mock-data";

export default function StudentTimetablePage() {
  const profile = mockStudentProfile;
  const classes = mockStudentTodayClasses;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Class Schedule"
        description={`Today's timetable for ${profile.name}`}
        breadcrumbs={[
          { label: "Student Portal", href: "/student/dashboard" },
          { label: "Timetable" },
        ]}
      />

      {/* Main Timetable View */}
      <Card className="border-white/[0.08] bg-zinc-950 shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-violet-500/5 to-transparent pointer-events-none" />
        
        <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-white">Daily Routine</CardTitle>
              <CardDescription className="text-zinc-400 mt-1">
                {profile.class} - {profile.section} ({profile.group})
              </CardDescription>
            </div>
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-white/[0.04] overflow-x-auto">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                <div 
                  key={day} 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${idx === 2 ? "bg-violet-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-white/[0.04]">
            {classes.map((cls) => (
              <div 
                key={cls.id} 
                className={`flex flex-col sm:flex-row p-6 gap-6 sm:gap-12 transition-colors hover:bg-white/[0.02] ${cls.status === 'ongoing' ? 'bg-violet-500/5 relative' : ''}`}
              >
                {cls.status === 'ongoing' && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                )}
                
                {/* Time Column */}
                <div className="sm:w-32 shrink-0">
                  <div className="flex items-center gap-2 text-zinc-300 font-medium mb-1">
                    <Clock className={`h-4 w-4 ${cls.status === 'ongoing' ? 'text-violet-400' : 'text-zinc-500'}`} />
                    {cls.time.split(' – ')[0]}
                  </div>
                  <div className="text-xs text-zinc-500 ml-6">
                    to {cls.time.split(' – ')[1]}
                  </div>
                </div>

                {/* Info Column */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`text-lg font-bold ${cls.status === 'ongoing' ? 'text-white' : 'text-zinc-200'}`}>
                          {cls.subject}
                        </h4>
                        {cls.status === 'ongoing' && (
                          <Badge variant="default" className="bg-violet-500 hover:bg-violet-600 animate-pulse border-0">Now</Badge>
                        )}
                        {cls.status === 'done' && (
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10 gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Completed
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <User className="h-4 w-4 text-zinc-500" />
                          {cls.teacher}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <MapPin className="h-4 w-4 text-zinc-500" />
                          Room {cls.room}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
