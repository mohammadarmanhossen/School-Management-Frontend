"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  FileText, Download, Printer, Eye, Filter, CheckCircle2,
  PieChart, BarChart2, TrendingUp, Calendar, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface ReportTemplate {
  id: string;
  title: string;
  category: "Attendance" | "Academic" | "Assignment" | "Class";
  description: string;
  icon: React.ElementType;
  lastGenerated?: string;
  format: "PDF" | "Excel" | "CSV";
}

const REPORTS: ReportTemplate[] = [
  { id: "r1", title: "Daily Attendance Report", category: "Attendance", description: "Detailed view of student attendance for the current day.", icon: Calendar, format: "PDF" },
  { id: "r2", title: "Low Attendance Students", category: "Attendance", description: "List of students with attendance below 75% in your classes.", icon: TrendingUp, format: "Excel" },
  { id: "r3", title: "Class Performance Report", category: "Academic", description: "Overall grade and subject performance for a specific class.", icon: BarChart2, format: "PDF" },
  { id: "r4", title: "Exam Result Report", category: "Academic", description: "Comprehensive results for mid-terms or final exams.", icon: PieChart, format: "PDF" },
  { id: "r5", title: "Missing Assignment Report", category: "Assignment", description: "Students who have not submitted recent assignments.", icon: FileText, format: "Excel" },
  { id: "r6", title: "Subject Wise Report", category: "Class", description: "Detailed breakdown of performance per subject.", icon: BookOpen, format: "PDF" },
];

export function TeacherReportsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const filteredReports = REPORTS.filter(report => {
    const searchMatch = !searchQuery || report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = categoryFilter === "All Categories" || report.category === categoryFilter;
    return searchMatch && catMatch;
  });

  const handleGenerate = (title: string) => {
    toast.success(`${title} generated successfully.`);
  };

  const handleExport = (title: string, format: string) => {
    toast.success(`Exporting ${title} as ${format}...`);
  };

  return (
    <Card className="dashboard-card border-white/[0.08] flex flex-col min-h-[500px]">
      {/* Toolbar */}
      <div className="p-4 border-b border-white/[0.08] flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/[0.01]">
        <div className="relative w-full sm:w-[350px]">
          <Input 
            placeholder="Search reports..." 
            className="bg-white/[0.02] border-white/[0.08]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white/[0.02] border-white/[0.08]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="Attendance">Attendance Reports</SelectItem>
              <SelectItem value="Academic">Academic Reports</SelectItem>
              <SelectItem value="Assignment">Assignment Reports</SelectItem>
              <SelectItem value="Class">Class Reports</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Report List */}
      <ScrollArea className="flex-1">
        <div className="p-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="flex flex-col p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white leading-tight">{report.title}</h3>
                        <p className="text-xs text-zinc-400 mt-1">{report.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-zinc-400 line-clamp-2 min-h-[40px]">
                    {report.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <Badge variant="outline" className="bg-white/[0.02] text-xs">
                      {report.format}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => handleGenerate(report.title)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => handleExport(report.title, report.format)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No reports found</h3>
              <p className="text-zinc-500">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
