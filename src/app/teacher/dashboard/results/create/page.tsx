"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResultStore } from "@/store";
import { useExamsStorage } from "@/hooks/use-exams-storage";
import { mockStudents } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function CreateResultPage() {
  const router = useRouter();
  const addResult = useResultStore((state) => state.addResult);
  const { exams } = useExamsStorage();

  const [examId, setExamId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [marksObtained, setMarksObtained] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId || !studentId || !marksObtained) {
      toast.error("Please fill all fields");
      return;
    }

    const exam = exams.find((ex) => ex.id === examId);
    const student = mockStudents.find((s) => s.id === studentId);

    if (!exam || !student) {
      toast.error("Invalid selection");
      return;
    }

    const marks = Number(marksObtained);
    if (marks > exam.totalMarks || marks < 0) {
      toast.error(`Marks must be between 0 and ${exam.totalMarks}`);
      return;
    }

    addResult({
      studentId: student.id,
      studentName: student.fullName,
      examId: exam.id,
      examName: exam.name,
      marksObtained: marks,
      totalMarks: exam.totalMarks,
      className: student.className,
      remarks: "",
    });

    toast.success("Result created successfully!");
    router.push("/teacher/dashboard/results");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Exam Result"
        description="Enter new student marks"
        breadcrumbs={[
          { label: "Teacher" },
          { label: "Results", href: "/teacher/dashboard/results" },
          { label: "Add" },
        ]}
      />

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Exam</Label>
              <Select value={examId} onValueChange={setExamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name} ({exam.className})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName} ({student.className})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Marks Obtained</Label>
              <Input
                type="number"
                value={marksObtained}
                onChange={(e) => setMarksObtained(e.target.value)}
                min="0"
                placeholder="Enter marks"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">Save Result</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/teacher/dashboard/results")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
