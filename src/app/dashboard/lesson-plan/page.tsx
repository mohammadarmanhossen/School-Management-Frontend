"use client";

import { useState } from "react";
import { BookOpen, Calendar, Plus, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockLessonPlans } from "@/lib/mock-data";

export default function LessonPlanPage() {
  const [plans] = useState(mockLessonPlans);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500/10 text-emerald-400 border-0";
      case "in_progress": return "bg-blue-500/10 text-blue-400 border-0";
      default: return "bg-amber-500/10 text-amber-400 border-0";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "in_progress": return "In Progress";
      default: return "Pending";
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Lesson Planner"
        description="Organize your syllabus, track topics, and manage daily teaching plans."
        breadcrumbs={[
          { label: "Dashboard", href: "/teacher/dashboard" },
          { label: "Lesson Plan" },
        ]}
        actions={
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Syllabus Progress */}
        <Card className="lg:col-span-1 border-white/[0.08] bg-zinc-950 h-fit">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50">
            <CardTitle className="text-base">Syllabus Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-white">Class 10 Mathematics</span>
                <span className="text-emerald-400">65%</span>
              </div>
              <Progress value={65} className="h-2 bg-zinc-800 [&>div]:bg-emerald-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-white">Class 9 Mathematics</span>
                <span className="text-blue-400">42%</span>
              </div>
              <Progress value={42} className="h-2 bg-zinc-800 [&>div]:bg-blue-500" />
            </div>
            
            <div className="pt-4 border-t border-white/[0.06]">
              <h4 className="text-sm font-medium text-zinc-400 mb-4">Weekly Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-zinc-900 p-4 border border-white/[0.04]">
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-xs text-zinc-500 mt-1">Topics Covered</p>
                </div>
                <div className="rounded-lg bg-zinc-900 p-4 border border-white/[0.04]">
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-xs text-zinc-500 mt-1">Pending Plans</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lesson Plans List */}
        <Card className="lg:col-span-2 border-white/[0.08] bg-zinc-950 shadow-xl">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50">
            <CardTitle className="text-base font-semibold">Upcoming & Recent Plans</CardTitle>
            <CardDescription className="text-zinc-400">Your scheduled teaching topics across all classes.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/[0.04]">
              {plans.map((plan) => (
                <div key={plan.id} className="p-6 transition-colors hover:bg-white/[0.02]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg text-white">{plan.topic}</h3>
                        <Badge variant="outline" className={getStatusColor(plan.status)}>
                          {getStatusLabel(plan.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-blue-400" />
                          <span>{plan.className} • {plan.subject}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-amber-400" />
                          <span>{new Date(plan.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Objectives</p>
                        <ul className="space-y-1">
                          {plan.objectives.map((obj, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                              <CheckCircle className="h-3.5 w-3.5 text-zinc-500" />
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="shrink-0 pt-2 sm:pt-0 flex gap-2">
                      <Button variant="outline" size="sm" className="bg-zinc-900 border-white/[0.1]">Edit</Button>
                      {plan.status !== "completed" && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Mark Done</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
