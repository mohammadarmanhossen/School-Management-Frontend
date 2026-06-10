"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

const mockSubjectAttendance = [
  { id: 1, subject: "Mathematics", teacher: "Mohammad Karim", totalClasses: 45, attended: 42, rate: 93.3, status: "good" },
  { id: 2, subject: "Physics", teacher: "Abdul Jabbar", totalClasses: 40, attended: 35, rate: 87.5, status: "warning" },
  { id: 3, subject: "Chemistry", teacher: "Nusrat Jahan", totalClasses: 42, attended: 40, rate: 95.2, status: "good" },
  { id: 4, subject: "Biology", teacher: "Imran Hossain", totalClasses: 38, attended: 36, rate: 94.7, status: "good" },
  { id: 5, subject: "English", teacher: "Sharmin Akter", totalClasses: 50, attended: 38, rate: 76.0, status: "critical" },
];

export function StudentSubjectAttendance() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockSubjectAttendance.map((sub) => (
        <Card key={sub.id} className="dashboard-card border-white/[0.08] relative overflow-hidden group hover:border-white/[0.15] transition-colors">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/[0.02] blur-2xl transition-all group-hover:bg-white/[0.05]" />
          
          <CardHeader className="pb-3 flex flex-row items-start justify-between border-b border-white/[0.05]">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                {sub.subject}
              </CardTitle>
              <p className="text-xs text-zinc-400 mt-2 font-medium">{sub.teacher}</p>
            </div>
            <Badge variant="outline" className={
              sub.status === 'critical' ? "bg-red-500/10 text-red-400 border-red-500/20 px-2 py-1 text-xs" :
              sub.status === 'warning' ? "bg-amber-500/10 text-amber-400 border-amber-500/20 px-2 py-1 text-xs" :
              "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-1 text-xs"
            }>
              {sub.rate}%
            </Badge>
          </CardHeader>
          
          <CardContent className="pt-4 space-y-5">
            <div className="flex justify-between items-end text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Attended</span>
                <span className="font-bold text-white text-base">{sub.attended} <span className="text-zinc-500 text-xs font-normal">/ {sub.totalClasses} classes</span></span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Missed</span>
                <span className="font-bold text-zinc-300 text-base">{sub.totalClasses - sub.attended}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/40 border border-white/[0.05]">
                <div
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${
                    sub.status === 'critical' ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 
                    sub.status === 'warning' ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 
                    'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                  }`}
                  style={{ width: `${sub.rate}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                <span>0%</span>
                <span className="text-zinc-600">80% Req.</span>
                <span>100%</span>
              </div>
            </div>
            
            {sub.status === 'critical' && (
              <div className="flex items-center gap-2 text-[11px] font-medium text-red-400 bg-red-500/10 p-2.5 rounded-md border border-red-500/20">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Attendance is below required minimum!</span>
              </div>
            )}
            {sub.status === 'good' && (
              <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 p-2.5 rounded-md border border-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>On track with excellent attendance.</span>
              </div>
            )}
            {sub.status === 'warning' && (
              <div className="flex items-center gap-2 text-[11px] font-medium text-amber-400 bg-amber-500/10 p-2.5 rounded-md border border-amber-500/20">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Getting close to the minimum limit.</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
