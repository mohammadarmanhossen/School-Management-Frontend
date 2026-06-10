"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileSignature, MapPin, Clock, CalendarDays, FlaskConical } from "lucide-react";
import { mockTeacherMeetings, mockTeacherDuties, mockTeacherLabs } from "@/lib/teacher-extended-mock";
import { cn } from "@/lib/utils";

export function TeacherDutiesList() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Labs */}
      <Card className="dashboard-card border-white/[0.08]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FlaskConical className="w-5 h-5 text-cyan-400" /> Lab Sessions</CardTitle>
          <CardDescription>Upcoming practical sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockTeacherLabs.map(lab => (
            <div key={lab.id} className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{lab.subject}</Badge>
                <span className="text-xs text-zinc-500 font-medium">{lab.date}</span>
              </div>
              <h4 className="font-semibold text-white mb-1">{lab.labName}</h4>
              <p className="text-sm text-zinc-400 mb-3">{lab.class} - Sec {lab.section}</p>
              
              <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/[0.08] pt-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lab.startTime} ({lab.duration})</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lab.room}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meetings */}
      <Card className="dashboard-card border-white/[0.08]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" /> Meetings & Events</CardTitle>
          <CardDescription>Scheduled staff and parent meetings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockTeacherMeetings.map(meeting => (
            <div key={meeting.id} className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">{meeting.type}</Badge>
                <span className="text-xs text-zinc-500 font-medium">{meeting.date}</span>
              </div>
              <h4 className="font-semibold text-white mb-3">{meeting.title}</h4>
              
              <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/[0.08] pt-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meeting.startTime} - {meeting.endTime}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {meeting.location}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Duties */}
      <Card className="dashboard-card border-white/[0.08]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileSignature className="w-5 h-5 text-amber-400" /> Assigned Duties</CardTitle>
          <CardDescription>Administrative and school tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockTeacherDuties.map(duty => (
            <div key={duty.id} className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden">
              <div className={cn("absolute left-0 top-0 bottom-0 w-1", duty.status === "pending" ? "bg-amber-500" : "bg-emerald-500")} />
              <div className="flex items-center justify-between mb-2 pl-2">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">{duty.type}</Badge>
                <span className="text-xs text-zinc-500 font-medium">{duty.date}</span>
              </div>
              <h4 className="font-semibold text-white mb-3 pl-2">{duty.title}</h4>
              
              <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/[0.08] pt-3 pl-2">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {duty.startTime} - {duty.endTime}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {duty.location}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
