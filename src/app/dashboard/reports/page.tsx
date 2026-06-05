"use client";

import { useState } from "react";
import { Download, FileText, Filter, Printer, TrendingUp, Users, Award, AlertTriangle, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockTeacherExamResults, mockTeacherClasses } from "@/lib/mock-data";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("academic");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Class Reports & Analytics"
        description="Generate, view, and export detailed performance and attendance reports."
        breadcrumbs={[
          { label: "Dashboard", href: "/teacher/dashboard" },
          { label: "Reports" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-zinc-900 border-white/[0.1]">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Quick Report Summaries */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/[0.08] bg-zinc-950">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-zinc-400">Total Students</p>
                <p className="text-3xl font-bold text-white mt-1">149</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-emerald-400 font-medium">+2%</span>
              <span className="text-zinc-500 ml-2">from last term</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-zinc-950">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-zinc-400">Avg. Pass Rate</p>
                <p className="text-3xl font-bold text-white mt-1">89.5%</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-emerald-400 font-medium">+4.1%</span>
              <span className="text-zinc-500 ml-2">from last exam</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-zinc-950">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-zinc-400">Avg. Attendance</p>
                <p className="text-3xl font-bold text-white mt-1">91.7%</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-violet-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-rose-400 font-medium">-1.2%</span>
              <span className="text-zinc-500 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-zinc-950">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-zinc-400">At Risk Students</p>
                <p className="text-3xl font-bold text-white mt-1">12</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-zinc-400">Need immediate attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tables Section */}
      <Card className="border-white/[0.08] bg-zinc-950 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-6">
          <div>
            <CardTitle className="text-base font-semibold">Detailed Reports</CardTitle>
            <CardDescription className="text-zinc-400">Select a report type to view detailed metrics.</CardDescription>
          </div>
          <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-white/[0.05]">
            <Button 
              variant={activeTab === "academic" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setActiveTab("academic")}
              className={`h-8 ${activeTab === "academic" ? "bg-zinc-800 text-white" : "text-zinc-400"}`}
            >
              Academic
            </Button>
            <Button 
              variant={activeTab === "attendance" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setActiveTab("attendance")}
              className={`h-8 ${activeTab === "attendance" ? "bg-zinc-800 text-white" : "text-zinc-400"}`}
            >
              Attendance
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b border-white/[0.04] flex flex-wrap gap-3 bg-zinc-900/20">
            <Button variant="outline" size="sm" className="bg-zinc-950 border-white/[0.1] gap-2 text-zinc-300">
              <Filter className="h-3 w-3" /> Class 10
            </Button>
            <Button variant="outline" size="sm" className="bg-zinc-950 border-white/[0.1] gap-2 text-zinc-300">
              <Filter className="h-3 w-3" /> All Sections
            </Button>
            <Button variant="outline" size="sm" className="bg-zinc-950 border-white/[0.1] gap-2 text-zinc-300">
              <Calendar className="h-3 w-3" /> Mid-Term
            </Button>
          </div>

          <div className="overflow-x-auto">
            {activeTab === "academic" ? (
              <div className="w-full text-sm text-left text-zinc-400">
                <div className="bg-zinc-900/40 border-b border-white/[0.05] flex text-zinc-400 font-medium p-4">
                  <div className="flex-1">Exam Name</div>
                  <div className="w-24 text-center">Class Avg</div>
                  <div className="w-24 text-center">Highest Mark</div>
                  <div className="w-24 text-center">Lowest Mark</div>
                  <div className="w-24 text-right">Pass Rate</div>
                </div>
                <div>
                  {mockTeacherExamResults.map((result, i) => (
                    <div key={i} className="flex border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors p-4 items-center">
                      <div className="flex-1 font-medium text-zinc-200">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          {result.exam}
                        </div>
                      </div>
                      <div className="w-24 text-center text-zinc-300">{result.classAvg}%</div>
                      <div className="w-24 text-center text-emerald-400">{result.highest}%</div>
                      <div className="w-24 text-center text-rose-400">{result.lowest}%</div>
                      <div className="w-24 text-right">
                        <Badge variant="outline" className={`border-0 ${result.passRate >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {result.passRate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full text-sm text-left text-zinc-400">
                <div className="bg-zinc-900/40 border-b border-white/[0.05] flex text-zinc-400 font-medium p-4">
                  <div className="flex-1">Class & Section</div>
                  <div className="flex-1">Subject</div>
                  <div className="w-32 text-center">Total Students</div>
                  <div className="w-32 text-right">Avg Attendance</div>
                </div>
                <div>
                  {mockTeacherClasses.map((cls, i) => (
                    <div key={i} className="flex border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors p-4 items-center">
                      <div className="flex-1 font-medium text-zinc-200">{cls.className} - {cls.section}</div>
                      <div className="flex-1 text-zinc-400">{cls.subject}</div>
                      <div className="w-32 text-center text-zinc-300">{cls.studentCount}</div>
                      <div className="w-32 text-right">
                        <Badge variant="outline" className={`border-0 ${cls.avgAttendance >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {cls.avgAttendance}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
