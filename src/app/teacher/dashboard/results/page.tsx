"use client";

import { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Globe, 
  GlobeLock, 
  Plus, 
  Edit3, 
  Search, 
  SlidersHorizontal, 
  GraduationCap,
  Trash2
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { useResultStore } from "@/store";
import type { ExamResult } from "@/types";

export default function TeacherResultsPage() {
  const { toast } = useToast();
  
  // Zustand Store
  const results = useResultStore((state) => state.results);
  const updateResult = useResultStore((state) => state.updateResult);
  const deleteResult = useResultStore((state) => state.deleteResult);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");

  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<ExamResult | null>(null);
  const [newMarks, setNewMarks] = useState<string>("");

  const handlePublish = async () => {
    try {
      setLoading(true);
      setPublished(!published); 
      toast({
        title: published ? "Status: Private" : "Status: Public",
        description: published ? "Results are hidden from students." : "Results are now live for parents and students.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
      toast({
        variant: "destructive",
        title: "Invalid Marks",
        description: `Marks must be between 0 and ${editingStudent.totalMarks}`,
      });
      return;
    }

    updateResult(editingStudent.id, { marksObtained: marks });

    setIsEditOpen(false);
    toast({
      title: "Marks Updated",
      description: `${editingStudent.studentName}'s marks updated to ${marks}.`,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this result?")) {
      deleteResult(id);
      toast({
        title: "Result Deleted",
        description: "The result has been successfully deleted.",
      });
    }
  };

  const filteredResults = useMemo(() => {
    return results.filter(item => {
      const matchesSearch = item.studentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === "all" || item.className === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [results, searchQuery, selectedClass]);

  const columns: ColumnDef<ExamResult>[] = [
    {
      accessorKey: "studentName",
      header: "Student Name",
      cell: ({ row }) => (
        <div className="font-medium text-slate-900 dark:text-slate-100">
          {row.original.studentName}
        </div>
      )
    },
    {
      accessorKey: "className",
      header: "Class",
      cell: ({ row }) => <Badge variant="secondary">{row.original.className || "Class 9"}</Badge>
    },
    {
      accessorKey: "examName",
      header: "Exam Title",
    },
    {
      accessorKey: "marksObtained",
      header: "Marks",
      cell: ({ row }) => (
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          {row.original.marksObtained} <span className="text-xs text-muted-foreground">/ {row.original.totalMarks}</span>
        </span>
      ),
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => {
        const isF = row.original.grade === "F";
        return (
          <Badge className={isF ? "bg-red-500/10 text-red-600 hover:bg-red-500/10 border-red-200" : "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 border-emerald-200"}>
            {row.original.grade}
          </Badge>
        );
      },
    },
    {
      accessorKey: "gpa",
      header: "GPA",
      cell: ({ row }) => <span className="font-mono font-medium">{row.original.gpa.toFixed(2)}</span>
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1 border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={() => openEditModal(row.original)}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6 p-1">
      <PageHeader
        title="Teacher Portal - Results Management"
        description="Review student marks, filter by class, and update grades instantly."
        breadcrumbs={[{ label: "Teacher" }, { label: "Results Management" }]}
        actions={
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="shadow-sm">
              <Link href="/teacher/dashboard/results/create">
                <Plus className="h-4 w-4 mr-2" />
                Add Result
              </Link>
            </Button>

            <Button
              onClick={handlePublish}
              disabled={loading}
              variant={published ? "destructive" : "default"}
              className="shadow-sm"
            >
              {published ? (
                <>
                  <GlobeLock className="h-4 w-4 mr-2" />
                  Make Private
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Publish Results
                </>
              )}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4">
        {published ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-700">
            <Globe className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium">
              <strong>Results are Live:</strong> Students and parents can access the report cards from their respective accounts.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-700">
            <GlobeLock className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm font-medium">
              <strong>Draft Mode:</strong> Results are currently private. Only teachers can view and edit these numbers.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border border-slate-100 bg-white p-4 rounded-xl shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search student by name..."
            className="pl-9 bg-slate-50/50 focus-visible:bg-white dark:bg-slate-950"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters:</span>
          </div>
          
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[160px] bg-slate-50/50 dark:bg-slate-950">
              <GraduationCap className="h-4 w-4 mr-2 text-slate-500" />
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="Class 8">Class 8</SelectItem>
              <SelectItem value="Class 9">Class 9</SelectItem>
              <SelectItem value="Class 10">Class 10</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <DataTable
          columns={columns}
          data={filteredResults}
        />
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-indigo-600" />
              Update Student Marks
            </DialogTitle>
          </DialogHeader>
          
          {editingStudent && (
            <div className="grid gap-4 py-4">
              <div className="rounded-lg bg-slate-50 p-3 space-y-1 dark:bg-slate-800">
                <div className="text-xs text-muted-foreground">Student Name</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{editingStudent.studentName}</div>
                <div className="text-xs text-muted-foreground mt-2">Exam</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{editingStudent.examName}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="marks" className="text-right font-medium">
                  Marks
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="marks"
                    type="number"
                    className="w-24 font-semibold text-base"
                    value={newMarks}
                    onChange={(e) => setNewMarks(e.target.value)}
                    max={editingStudent.totalMarks}
                    min={0}
                  />
                  <span className="text-sm text-muted-foreground">
                    out of {editingStudent.totalMarks}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMarks} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}