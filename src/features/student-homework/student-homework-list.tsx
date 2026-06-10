"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format, isPast, parseISO } from "date-fns";
import { FileText, Search, Upload, Eye, Clock, Download, CheckCircle2, CloudUpload, File, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { StudentHomework, mockStudentHomework } from "@/lib/mock-student-homework";
import { cn } from "@/lib/utils";

export function StudentHomeworkList() {
  const [data, setData] = useState<StudentHomework[]>(mockStudentHomework);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [selectedHomework, setSelectedHomework] = useState<StudentHomework | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleUploadSubmit = () => {
    if (!selectedHomework) return;
    
    // Mock upload action
    setData(prev => prev.map(hw => 
      hw.id === selectedHomework.id ? { ...hw, status: "submitted", submittedDate: new Date().toISOString() } : hw
    ));
    toast.success("Homework submitted successfully!");
    setIsUploadOpen(false);
    setUploadFile(null);
  };

  const openDetails = (hw: StudentHomework) => {
    setSelectedHomework(hw);
    setIsDetailsOpen(true);
  };

  const openUpload = (hw: StudentHomework) => {
    setSelectedHomework(hw);
    setIsUploadOpen(true);
  };

  const columns: ColumnDef<StudentHomework>[] = [
    {
      accessorKey: "subject",
      header: "Subject & Teacher",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
            {row.original.subject.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white tracking-wide">{row.original.subject}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{row.original.teacher}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Assignment Details",
      cell: ({ row }) => (
        <div className="py-1 max-w-[250px]">
          <p className="font-medium text-zinc-200 line-clamp-1" title={row.original.title}>
            {row.original.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            {row.original.priority === "high" && (
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] px-1.5 py-0 uppercase tracking-wider font-semibold">Urgent</Badge>
            )}
            <span className="text-[11px] text-zinc-500 line-clamp-1">{row.original.description}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Dates",
      cell: ({ row }) => {
        const date = parseISO(row.original.dueDate);
        const isOverdue = row.original.status === "overdue" || (isPast(date) && row.original.status === "pending");
        
        return (
          <div className="flex flex-col gap-1.5 py-1">
            <div className="flex items-center gap-1.5">
              <Clock className={cn("w-3.5 h-3.5", isOverdue ? "text-red-400" : "text-zinc-400")} />
              <span className={cn("text-xs font-medium", isOverdue ? "text-red-400" : "text-zinc-300")}>
                Due: {format(date, "MMM dd, yyyy")}
              </span>
            </div>
            {row.original.submittedDate && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
                <span className="text-[11px] text-zinc-500">
                  Sub: {format(parseISO(row.original.submittedDate), "MMM dd")}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="outline"
            className={cn(
              "capitalize px-2.5 py-0.5 text-xs font-medium tracking-wide",
              status === "pending" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
              status === "submitted" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
              status === "reviewed" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              status === "overdue" && "bg-red-500/10 text-red-400 border-red-500/20"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "marks",
      header: "Score",
      cell: ({ row }) => (
        <div className="py-1">
          {row.original.status === "reviewed" ? (
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-emerald-400">{row.original.obtainedMarks}</span>
              <span className="text-xs text-zinc-500 font-medium">/ {row.original.totalMarks}</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-zinc-600">-</span>
              <span className="text-xs text-zinc-500 font-medium">/ {row.original.totalMarks}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const hw = row.original;
        const isPending = hw.status === "pending" || hw.status === "overdue";

        return (
          <div className="flex items-center gap-2 py-1 justify-end pr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10 shrink-0" title="View Details" onClick={() => openDetails(hw)}>
              <Eye className="h-4 w-4" />
            </Button>
            
            {isPending ? (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 h-8 px-3 shrink-0" onClick={() => openUpload(hw)}>
                <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="bg-white/[0.02] border-white/[0.08] text-zinc-300 hover:bg-white/10 hover:text-white h-8 px-3 shrink-0" onClick={() => openDetails(hw)}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> View
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const filteredData = data.filter((hw) => {
    const matchesSearch = 
      hw.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      hw.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || hw.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || hw.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <>
      <Card className="dashboard-card border-white/[0.08]">
        <CardContent className="p-4 border-none">
          <div className="flex flex-col lg:flex-row gap-4 mb-6 justify-between items-start lg:items-center">
            <div className="relative w-full lg:w-[350px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input 
                placeholder="Search assignments, subjects or teachers..." 
                className="pl-9 bg-white/[0.02] border-white/[0.08]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px] bg-white/[0.02] border-white/[0.08]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[150px] bg-white/[0.02] border-white/[0.08]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredData}
          />
        </CardContent>
      </Card>

      {/* Assignment Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#0a0a0a] border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              {selectedHomework?.title}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Assigned on {selectedHomework?.assignedDate && format(parseISO(selectedHomework.assignedDate), "MMM dd, yyyy")}
            </DialogDescription>
          </DialogHeader>

          {selectedHomework && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Subject</p>
                  <p className="font-medium text-zinc-200">{selectedHomework.subject}</p>
                </div>
                <div className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Teacher</p>
                  <p className="font-medium text-zinc-200">{selectedHomework.teacher}</p>
                </div>
                <div className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Due Date</p>
                  <p className={cn("font-medium", selectedHomework.status === "overdue" ? "text-red-400" : "text-zinc-200")}>
                    {format(parseISO(selectedHomework.dueDate), "MMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Total Marks</p>
                  <p className="font-medium text-zinc-200">{selectedHomework.totalMarks} Points</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Instructions</h4>
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm text-zinc-300 leading-relaxed">
                  {selectedHomework.description}
                </div>
              </div>

              {selectedHomework.status === "reviewed" && selectedHomework.feedback && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Teacher Feedback & Results
                  </h4>
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm">
                    <div className="flex justify-between items-start mb-3 pb-3 border-b border-emerald-500/10">
                      <div>
                        <p className="text-zinc-300">Marks Obtained</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">{selectedHomework.obtainedMarks} <span className="text-base text-emerald-400/60">/ {selectedHomework.totalMarks}</span></p>
                      </div>
                    </div>
                    <p className="text-zinc-300 italic">"{selectedHomework.feedback}"</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {(selectedHomework.status === "pending" || selectedHomework.status === "overdue") ? (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => {
                    setIsDetailsOpen(false);
                    openUpload(selectedHomework);
                  }}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Work Now
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full border-white/[0.08] hover:bg-white/[0.04]">
                    <Download className="mr-2 h-4 w-4" /> Download Submitted Files
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Homework Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Submit Assignment</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedHomework?.title} ({selectedHomework?.subject})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <label 
              htmlFor="homework-file-upload"
              className="block p-4 rounded-xl border border-dashed border-white/[0.2] hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors cursor-pointer text-center"
            >
              <CloudUpload className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-white mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-zinc-500">PDF, DOCX, PPTX, or ZIP (Max. 10MB)</p>
              
              <input 
                type="file" 
                className="hidden" 
                id="homework-file-upload" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadFile(file);
                  }
                }}
              />
              <div className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/[0.1] bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-3">
                Select File
              </div>
            </label>

            {uploadFile && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-500/10">
                    <File className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white line-clamp-1">{uploadFile.name}</p>
                    <p className="text-xs text-zinc-500">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400" onClick={() => setUploadFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Add a note to your teacher (Optional)</label>
              <textarea 
                className="w-full h-24 rounded-md border border-white/[0.08] bg-white/[0.02] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="E.g., I struggled a bit with question 4..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="border-white/[0.08]" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" disabled={!uploadFile} onClick={handleUploadSubmit}>
              Submit Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
