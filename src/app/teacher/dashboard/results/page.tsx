"use client";

import { useState } from "react";
import { 
  Download, Search, GraduationCap, 
  FileText, CheckCircle, XCircle, TrendingUp,
  Globe, GlobeLock, Plus, Edit3, Trash2, SlidersHorizontal
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useResultStore } from "@/store/result-store";
import type { ExamResult } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { TeacherResultsAnalytics } from "@/features/teacher-results/teacher-results-analytics";
import { TeacherResultsForm } from "@/features/teacher-results/teacher-results-form";

export default function TeacherResultsPage() {
  const { results, deleteResult, updateResult } = useResultStore();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Filters for history
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [published, setPublished] = useState(false);

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<ExamResult | null>(null);
  const [newMarks, setNewMarks] = useState<string>("");

  // Stats
  const totalStudents = new Set(results.map(r => r.studentId)).size || 149; // Default if empty
  const totalExams = new Set(results.map(r => r.examName)).size || 0;
  const passed = results.filter(r => r.grade !== "F").length;
  const failed = results.filter(r => r.grade === "F").length;
  const totalResults = results.length;
  
  const passRate = totalResults ? Math.round((passed / totalResults) * 100) : 0;
  const failRate = totalResults ? Math.round((failed / totalResults) * 100) : 0;
  const avgGPA = totalResults ? (results.reduce((acc, r) => acc + r.gpa, 0) / totalResults).toFixed(2) : "0.00";

  const handlePublish = () => {
    setPublished(!published);
    if (!published) {
      toast.success("Results Published successfully!");
    } else {
      toast.info("Results are now private.");
    }
  };

  const openEditModal = (student: ExamResult) => {
    setEditingStudent(student);
    setNewMarks(student.marksObtained.toString());
    setIsEditOpen(true);
  };

  const handleSaveMarks = () => {
    if (!editingStudent || isNaN(Number(newMarks))) return;

    const marks = Number(newMarks);
    if (marks > editingStudent.totalMarks || marks < 0) {
      toast.error(`Marks must be between 0 and ${editingStudent.totalMarks}`);
      return;
    }

    updateResult(editingStudent.id, { marksObtained: marks });
    setIsEditOpen(false);
    toast.success("Marks Updated!");
  };

  const filteredHistory = results.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.examName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || r.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const columns: ColumnDef<ExamResult>[] = [
    { accessorKey: "studentName", header: "Student", cell: ({ row }) => <span className="font-semibold">{row.original.studentName}</span> },
    { accessorKey: "className", header: "Class", cell: ({ row }) => <Badge variant="secondary" className="bg-white/[0.05]">{row.original.className}</Badge> },
    { accessorKey: "examName", header: "Exam" },
    { 
      accessorKey: "marksObtained", 
      header: "Marks", 
      cell: ({ row }) => (
        <span className="font-bold text-blue-400">
          {row.original.marksObtained} <span className="text-xs text-zinc-500 font-normal">/ {row.original.totalMarks}</span>
        </span>
      ) 
    },
    { 
      accessorKey: "grade", 
      header: "Grade",
      cell: ({ row }) => {
        const isFail = row.original.grade === "F";
        return (
          <Badge variant="outline" className={isFail ? "text-red-500 border-red-500/30 bg-red-500/10" : "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"}>
            {row.original.grade}
          </Badge>
        );
      }
    },
    { accessorKey: "gpa", header: "GPA", cell: ({ row }) => <span className="font-mono">{row.original.gpa.toFixed(2)}</span> },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => openEditModal(row.original)}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => {
            if (confirm("Delete this result?")) {
              deleteResult(row.original.id);
              toast.success("Result deleted");
            }
          }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Result Management" 
        description="Calculate GPA, publish grades, and analyze class performance." 
        breadcrumbs={[
          { label: "Teacher Dashboard", href: "/teacher/dashboard" },
          { label: "Results" }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/[0.02]" onClick={() => toast.success("PDF Exported successfully")}><Download className="mr-2 h-4 w-4" /> Export All</Button>
            <Button 
              onClick={handlePublish}
              variant={published ? "destructive" : "default"}
              className={published ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
            >
              {published ? (
                 <><GlobeLock className="h-4 w-4 mr-2" /> Make Private</>
              ) : (
                 <><Globe className="h-4 w-4 mr-2" /> Publish Results</>
              )}
            </Button>
          </div>
        } 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/[0.02] border border-white/[0.05] p-1 h-auto flex flex-wrap">
          <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-white/[0.06]">Overview & Analytics</TabsTrigger>
          <TabsTrigger value="entry" className="py-2 data-[state=active]:bg-white/[0.06]">Marks Entry</TabsTrigger>
          <TabsTrigger value="history" className="py-2 data-[state=active]:bg-white/[0.06]">Results History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><GraduationCap className="h-4 w-4 mr-2 text-blue-400"/> Total Students</div>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><FileText className="h-4 w-4 mr-2 text-purple-400"/> Total Exams</div>
              <div className="text-2xl font-bold">{totalExams}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><TrendingUp className="h-4 w-4 mr-2 text-indigo-400"/> Average GPA</div>
              <div className="text-2xl font-bold">{avgGPA}</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><CheckCircle className="h-4 w-4 mr-2 text-emerald-400"/> Pass Rate</div>
              <div className="text-2xl font-bold text-emerald-400">{passRate}%</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><XCircle className="h-4 w-4 mr-2 text-red-400"/> Fail Rate</div>
              <div className="text-2xl font-bold text-red-400">{failRate}%</div>
            </Card>
            <Card className="dashboard-card border-white/[0.08] p-4 flex flex-col justify-center">
              <div className="flex items-center text-zinc-400 mb-2"><Globe className="h-4 w-4 mr-2 text-amber-400"/> Status</div>
              <div className="text-xl font-bold text-amber-500">{published ? "Published" : "Draft"}</div>
            </Card>
          </div>

          <TeacherResultsAnalytics />
        </TabsContent>

        <TabsContent value="entry" className="space-y-4 animate-in fade-in duration-300">
          <TeacherResultsForm />
        </TabsContent>

        <TabsContent value="history" className="space-y-4 animate-in fade-in duration-300">
          <div className="dashboard-card p-4 rounded-xl border border-white/[0.08]">
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
               <div className="relative w-full md:w-[350px]">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                 <Input 
                   placeholder="Search student or exam..." 
                   className="pl-9 bg-white/[0.02] border-white/[0.08]" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               <div className="flex gap-2">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[150px] bg-white/[0.02] border-white/[0.08]"><SelectValue placeholder="Class" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="Class 8">Class 8</SelectItem>
                      <SelectItem value="Class 9">Class 9</SelectItem>
                      <SelectItem value="Class 10">Class 10</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>
            <DataTable columns={columns} data={filteredHistory} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#09090b] border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-blue-500" />
              Update Marks
            </DialogTitle>
          </DialogHeader>
          
          {editingStudent && (
            <div className="grid gap-4 py-4">
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3 space-y-1">
                <div className="text-xs text-zinc-400">Student Name</div>
                <div className="font-semibold">{editingStudent.studentName}</div>
                <div className="text-xs text-zinc-400 mt-2">Exam</div>
                <div className="text-sm">{editingStudent.examName}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="marks" className="text-right font-medium">
                  Marks
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="marks"
                    type="number"
                    className="w-24 font-semibold text-base bg-white/[0.02] border-white/[0.08]"
                    value={newMarks}
                    onChange={(e) => setNewMarks(e.target.value)}
                    max={editingStudent.totalMarks}
                    min={0}
                  />
                  <span className="text-sm text-zinc-400">
                    out of {editingStudent.totalMarks}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" className="bg-white/[0.02] border-white/[0.08]" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMarks} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}