"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClassStore } from "@/store/class-store";
import { useStudentsStorage } from "@/hooks/use-students-storage";
import { useAttendanceStorage } from "@/hooks/use-attendance-storage";
import type { AttendanceStatus, AttendanceRecord } from "@/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function TakeAttendancePage() {
  const router = useRouter();
  const classes = useClassStore((state) => state.classes);
  const { students, isLoaded: studentsLoaded } = useStudentsStorage();
  const { saveAttendance, getAttendanceByClassAndDate, isLoaded: attendanceLoaded } = useAttendanceStorage();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [classId, setClassId] = useState("");
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus | "">("");

  // When class or date changes, load existing or initialize
  useEffect(() => {
    if (!classId || !date || !attendanceLoaded || !studentsLoaded) return;
    const existingRecords = getAttendanceByClassAndDate(classId, date);
    const classStudents = students.filter(s => s.classId === classId);
    
    const newAttendanceData: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach(student => {
      const existing = existingRecords.find(r => r.studentId === student.id);
      newAttendanceData[student.id] = {
        status: existing ? existing.status : "present", // default present
        remarks: existing?.remarks || "",
      };
    });
    setAttendanceData(newAttendanceData);
  }, [classId, date, students, attendanceLoaded, studentsLoaded, getAttendanceByClassAndDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const handleBulkMark = () => {
    if (!bulkStatus) return;
    setAttendanceData(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(studentId => {
        next[studentId] = { ...next[studentId], status: bulkStatus as AttendanceStatus };
      });
      return next;
    });
  };

  const handleSave = async () => {
    if (!classId || !date) return;
    setIsSaving(true);
    try {
      const classObj = classes.find(c => c.id === classId);
      if (!classObj) return;

      const records: AttendanceRecord[] = Object.keys(attendanceData).map(studentId => {
        const student = students.find(s => s.id === studentId)!;
        return {
          id: crypto.randomUUID(),
          studentId,
          studentName: student.fullName,
          rollNumber: student.rollNumber,
          classId,
          className: classObj.name,
          sectionName: student.sectionName,
          date,
          status: attendanceData[studentId].status,
          remarks: attendanceData[studentId].remarks,
        };
      });

      saveAttendance(records);
      toast.success("Attendance saved successfully");
      router.push("/dashboard/attendance");
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  const classStudents = classId ? students.filter(s => s.classId === classId) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Take Attendance"
        description="Record daily attendance and reasons for absence"
        breadcrumbs={[
          { label: "Attendance", href: "/dashboard/attendance" },
          { label: "Take Attendance" },
        ]}
      />

      <div className="dashboard-card space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Select Class</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {classId && classStudents.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Students List</h3>
              <div className="flex items-center gap-2">
                <Select value={bulkStatus} onValueChange={(val: any) => setBulkStatus(val)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Bulk Mark" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">All Present</SelectItem>
                    <SelectItem value="absent">All Absent</SelectItem>
                    <SelectItem value="late">All Late</SelectItem>
                    <SelectItem value="leave">All Leave</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="secondary" onClick={handleBulkMark} disabled={!bulkStatus}>
                  Apply
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border border-white/[0.1] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.02]">
                  <tr>
                    <th className="p-4 text-left font-medium text-zinc-400">Student Name</th>
                    <th className="p-4 text-left font-medium text-zinc-400">Roll No</th>
                    <th className="p-4 text-left font-medium text-zinc-400">Status</th>
                    <th className="p-4 text-left font-medium text-zinc-400">Excuse / Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {classStudents.map(student => {
                    const data = attendanceData[student.id];
                    if (!data) return null;
                    return (
                      <tr key={student.id}>
                        <td className="p-4">{student.fullName}</td>
                        <td className="p-4">{student.rollNumber}</td>
                        <td className="p-4">
                          <Select
                            value={data.status}
                            onValueChange={(val: AttendanceStatus) => handleStatusChange(student.id, val)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">Present</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="late">Late</SelectItem>
                              <SelectItem value="leave">Leave</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <Input
                            placeholder="Reason for leave/absence..."
                            value={data.remarks}
                            onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                            className="max-w-[300px]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Attendance
              </Button>
            </div>
          </div>
        )}

        {classId && classStudents.length === 0 && (
          <div className="py-8 text-center text-zinc-500">
            No students found in this class.
          </div>
        )}
      </div>
    </div>
  );
}
