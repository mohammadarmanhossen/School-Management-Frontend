"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Check, X, Clock, UserMinus, UserX, Info, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAttendanceStore } from "@/store/attendance-store";
import { mockStudents, mockTeacherClasses } from "@/lib/mock-data";
import type { AttendanceStatus, AttendanceRecord } from "@/types";

export function TeacherAttendanceForm() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const { addRecord, bulkAddRecords, getRecordsByClassAndDate, records } = useAttendanceStore();

  const classStudents = mockStudents.filter(
    (s) => selectedClass && s.className === mockTeacherClasses.find(c => c.id === selectedClass)?.className
  );

  const existingRecords = getRecordsByClassAndDate(
    mockTeacherClasses.find(c => c.id === selectedClass)?.className || "", 
    date
  );

  // Local state for the current session's marks
  const [marks, setMarks] = useState<Record<string, { status: AttendanceStatus, remarks: string, checkIn: string, checkOut: string }>>({});

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        remarks: prev[studentId]?.remarks || "",
        checkIn: prev[studentId]?.checkIn || "08:00",
        checkOut: prev[studentId]?.checkOut || "14:00"
      }
    }));
  };

  const handleRemark = (studentId: string, remarks: string) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMarks: typeof marks = {};
    classStudents.forEach(s => {
      newMarks[s.id] = { status, remarks: "", checkIn: "08:00", checkOut: "14:00" };
    });
    setMarks(newMarks);
    toast.success(`All marked as ${status}`);
  };

  const handleSubmit = (final: boolean) => {
    const newRecords: AttendanceRecord[] = Object.entries(marks).map(([studentId, data]) => {
      const student = mockStudents.find(s => s.id === studentId)!;
      return {
        id: `att-${Date.now()}-${studentId}`,
        studentId,
        studentName: student.fullName,
        rollNumber: student.rollNumber,
        classId: student.classId,
        className: student.className,
        date,
        status: data.status,
        remarks: data.remarks,
        checkInTime: data.checkIn,
        checkOutTime: data.checkOut
      };
    });

    bulkAddRecords(newRecords);
    if (final) {
      toast.success("Final attendance submitted successfully!");
      setMarks({});
    } else {
      toast.success("Draft saved successfully.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 dashboard-card p-4 rounded-xl border border-white/[0.08]">
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
          <Label>Date</Label>
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="bg-white/[0.02] border-white/[0.08]"
          />
        </div>
      </div>

      {selectedClass && classStudents.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap gap-2 justify-between items-center bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
            <div className="text-sm text-zinc-400 pl-2">Bulk Actions:</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-emerald-500 hover:text-emerald-400" onClick={() => handleMarkAll("present")}>
                <Check className="w-4 h-4 mr-2" /> All Present
              </Button>
              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-400" onClick={() => handleMarkAll("absent")}>
                <X className="w-4 h-4 mr-2" /> All Absent
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/[0.02] border-b border-white/[0.08]">
                  <tr>
                    <th className="p-4 font-medium text-zinc-400">Roll</th>
                    <th className="p-4 font-medium text-zinc-400">Student Name</th>
                    <th className="p-4 font-medium text-zinc-400">Status</th>
                    <th className="p-4 font-medium text-zinc-400 min-w-[200px]">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {classStudents.map(student => {
                    const currentStatus = marks[student.id]?.status || existingRecords.find(r => r.studentId === student.id)?.status;
                    const currentRemarks = marks[student.id]?.remarks || existingRecords.find(r => r.studentId === student.id)?.remarks || "";
                    return (
                      <tr key={student.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 text-zinc-400">{student.rollNumber}</td>
                        <td className="p-4 font-medium">{student.fullName}</td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            <Button 
                              size="sm" 
                              variant={currentStatus === "present" ? "default" : "outline"}
                              className={currentStatus === "present" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-white/[0.02]"}
                              onClick={() => handleMark(student.id, "present")}
                            >
                              <Check className="w-3 h-3 mr-1" /> P
                            </Button>
                            <Button 
                              size="sm" 
                              variant={currentStatus === "absent" ? "default" : "outline"}
                              className={currentStatus === "absent" ? "bg-red-600 hover:bg-red-700" : "bg-white/[0.02]"}
                              onClick={() => handleMark(student.id, "absent")}
                            >
                              <X className="w-3 h-3 mr-1" /> A
                            </Button>
                            <Button 
                              size="sm" 
                              variant={currentStatus === "late" ? "default" : "outline"}
                              className={currentStatus === "late" ? "bg-amber-600 hover:bg-amber-700" : "bg-white/[0.02]"}
                              onClick={() => handleMark(student.id, "late")}
                            >
                              <Clock className="w-3 h-3 mr-1" /> L
                            </Button>
                            <Button 
                              size="sm" 
                              variant={currentStatus === "half_day" ? "default" : "outline"}
                              className={currentStatus === "half_day" ? "bg-purple-600 hover:bg-purple-700" : "bg-white/[0.02]"}
                              onClick={() => handleMark(student.id, "half_day")}
                              title="Half Day"
                            >
                              <UserMinus className="w-3 h-3 mr-1" /> HD
                            </Button>
                            <Button 
                              size="sm" 
                              variant={currentStatus === "excused" ? "default" : "outline"}
                              className={currentStatus === "excused" ? "bg-zinc-600 hover:bg-zinc-700" : "bg-white/[0.02]"}
                              onClick={() => handleMark(student.id, "excused")}
                              title="Excused Absence"
                            >
                              <UserX className="w-3 h-3 mr-1" /> E
                            </Button>
                          </div>
                        </td>
                        <td className="p-4">
                          <Input 
                            placeholder="Add note..." 
                            value={currentRemarks}
                            onChange={(e) => handleRemark(student.id, e.target.value)}
                            className="bg-white/[0.02] border-white/[0.08] h-8 text-xs"
                          />
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
              <Send className="w-4 h-4 mr-2" /> Submit Final
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
