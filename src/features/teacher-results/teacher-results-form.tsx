"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Send, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResultStore } from "@/store/result-store";
import { mockStudents, mockTeacherClasses, mockExams } from "@/lib/mock-data";

export function TeacherResultsForm() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [examName, setExamName] = useState<string>("Mid Term Examination");
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [passMarks, setPassMarks] = useState<number>(33);
  
  const { bulkAddResults } = useResultStore();

  const classInfo = mockTeacherClasses.find(c => c.id === selectedClass);
  const classStudents = mockStudents.filter(
    (s) => selectedClass && s.className === classInfo?.className
  );

  // Local state for the current session's marks
  const [marks, setMarks] = useState<Record<string, number | "">>({});

  const handleMarkChange = (studentId: string, value: string) => {
    const num = value === "" ? "" : Number(value);
    setMarks(prev => ({ ...prev, [studentId]: num }));
  };

  const handleMarkAll = (value: number) => {
    const newMarks: typeof marks = {};
    classStudents.forEach(s => {
      newMarks[s.id] = value;
    });
    setMarks(newMarks);
    toast.success(`All marks set to ${value}`);
  };

  const handleSubmit = (publish: boolean) => {
    const dataToSubmit = classStudents.map(student => {
      const studentMarks = marks[student.id];
      const obtained = typeof studentMarks === "number" ? studentMarks : 0;
      return {
        studentId: student.id,
        studentName: student.fullName,
        classId: student.classId,
        className: student.className,
        examId: `ex-${Date.now()}`,
        examName,
        marksObtained: obtained,
        totalMarks,
      };
    });

    bulkAddResults(dataToSubmit);
    
    if (publish) {
      toast.success("Marks saved and published!");
    } else {
      toast.success("Draft marks saved successfully.");
    }
    setMarks({});
  };

  return (
    <div className="space-y-6">
      {/* Configuration Row */}
      <div className="flex flex-col lg:flex-row gap-4 dashboard-card p-4 rounded-xl border border-white/[0.08]">
        <div className="space-y-2 flex-1">
          <Label>Select Class</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="bg-white/[0.02]">
              <SelectValue placeholder="Choose a class..." />
            </SelectTrigger>
            <SelectContent>
              {mockTeacherClasses.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.className} - Sec {c.section} ({c.subject})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex-1">
          <Label>Exam Name</Label>
          <Select value={examName} onValueChange={setExamName}>
            <SelectTrigger className="bg-white/[0.02]">
              <SelectValue placeholder="Select Exam" />
            </SelectTrigger>
            <SelectContent>
              {mockExams.map(e => (
                <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>
              ))}
              <SelectItem value="Class Test 1">Class Test 1</SelectItem>
              <SelectItem value="Class Test 2">Class Test 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 w-full lg:w-32">
          <Label>Total Marks</Label>
          <Input 
            type="number" 
            value={totalMarks} 
            onChange={(e) => setTotalMarks(Number(e.target.value))}
            className="bg-white/[0.02] border-white/[0.08]"
          />
        </div>
        <div className="space-y-2 w-full lg:w-32">
          <Label>Pass Marks</Label>
          <Input 
            type="number" 
            value={passMarks} 
            onChange={(e) => setPassMarks(Number(e.target.value))}
            className="bg-white/[0.02] border-white/[0.08]"
          />
        </div>
      </div>

      {selectedClass && classStudents.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap gap-2 justify-between items-center bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
            <div className="flex items-center text-sm text-zinc-400 pl-2">
              <Settings2 className="w-4 h-4 mr-2" /> Bulk Actions:
            </div>
            <div className="flex gap-2 items-center">
              <Button size="sm" variant="outline" className="text-zinc-300 hover:text-white" onClick={() => handleMarkAll(totalMarks)}>
                Set All to Full Marks ({totalMarks})
              </Button>
              <Button size="sm" variant="outline" className="text-zinc-300 hover:text-white" onClick={() => handleMarkAll(0)}>
                Set All to 0
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/[0.02] border-b border-white/[0.08]">
                  <tr>
                    <th className="p-4 font-medium text-zinc-400 w-24">Roll No</th>
                    <th className="p-4 font-medium text-zinc-400">Student Name</th>
                    <th className="p-4 font-medium text-zinc-400 w-48 text-right">Marks Obtained</th>
                    <th className="p-4 font-medium text-zinc-400 w-24">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {classStudents.map(student => {
                    const studentMarks = marks[student.id];
                    let previewGrade = "-";
                    if (typeof studentMarks === "number") {
                      const pct = (studentMarks / totalMarks) * 100;
                      if (pct >= 80) previewGrade = "A+";
                      else if (pct >= 70) previewGrade = "A";
                      else if (pct >= 60) previewGrade = "A-";
                      else if (pct >= 50) previewGrade = "B";
                      else if (pct >= 40) previewGrade = "C";
                      else if (pct >= 33) previewGrade = "D";
                      else previewGrade = "F";
                    }

                    return (
                      <tr key={student.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 text-zinc-400">{student.rollNumber}</td>
                        <td className="p-4 font-medium">{student.fullName}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Input 
                              type="number"
                              min={0}
                              max={totalMarks}
                              className="w-20 text-right bg-white/[0.02] border-white/[0.08] font-bold text-blue-400"
                              value={studentMarks === undefined ? "" : studentMarks}
                              onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            />
                            <span className="text-zinc-500">/ {totalMarks}</span>
                          </div>
                        </td>
                        <td className="p-4">
                           <span className={`font-bold ${previewGrade === "F" ? "text-red-400" : previewGrade === "-" ? "text-zinc-600" : "text-emerald-400"}`}>
                             {previewGrade}
                           </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" className="border-white/[0.1] bg-white/[0.02]" onClick={() => handleSubmit(false)}>
              <Save className="w-4 h-4 mr-2" /> Save Draft
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSubmit(true)}>
              <Send className="w-4 h-4 mr-2" /> Submit Final Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
