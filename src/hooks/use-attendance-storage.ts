import { useState, useEffect } from "react";
import type { AttendanceRecord } from "@/types";

const STORAGE_KEY = "attendance_db";

const dummyAttendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    studentId: "s1",
    studentName: "John Doe",
    rollNumber: "101",
    classId: "c1",
    className: "Class 10",
    sectionName: "A",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    remarks: ""
  },
  {
    id: "2",
    studentId: "s2",
    studentName: "Jane Smith",
    rollNumber: "102",
    classId: "c1",
    className: "Class 10",
    sectionName: "A",
    date: new Date().toISOString().split("T")[0],
    status: "absent",
    remarks: "Sick leave"
  },
  {
    id: "3",
    studentId: "s3",
    studentName: "Michael Johnson",
    rollNumber: "103",
    classId: "c1",
    className: "Class 10",
    sectionName: "A",
    date: new Date().toISOString().split("T")[0],
    status: "late",
    remarks: "Traffic"
  },
  {
    id: "4",
    studentId: "s4",
    studentName: "Emily Davis",
    rollNumber: "104",
    classId: "c2",
    className: "Class 9",
    sectionName: "B",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    remarks: ""
  },
  {
    id: "5",
    studentId: "s5",
    studentName: "William Brown",
    rollNumber: "105",
    classId: "c2",
    className: "Class 9",
    sectionName: "B",
    date: new Date().toISOString().split("T")[0],
    status: "leave",
    remarks: "Family trip"
  }
];

export function useAttendanceStorage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data && data !== "[]") {
      try {
        setAttendanceRecords(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse attendance from local storage:", error);
        setAttendanceRecords(dummyAttendanceRecords);
      }
    } else {
      setAttendanceRecords(dummyAttendanceRecords);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceRecords));
    }
  }, [attendanceRecords, isLoaded]);

  // Save new attendance records (override existing ones for the same student on the same date)
  const saveAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendanceRecords((prev) => {
      const filteredPrev = prev.filter(
        (record) => !newRecords.some(
          (newRec) => newRec.studentId === record.studentId && newRec.date === record.date
        )
      );
      return [...filteredPrev, ...newRecords];
    });
  };

  const deleteAttendance = (id: string) => {
    setAttendanceRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const updateAttendance = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
    );
  };

  const getAttendanceByClassAndDate = (classId: string, date: string) => {
    return attendanceRecords.filter(
      (record) => record.classId === classId && record.date === date
    );
  };

  const getDashboardStats = (date?: string) => {
    const targetDate = date || new Date().toISOString().split("T")[0];
    const todayRecords = attendanceRecords.filter((r) => r.date === targetDate);
    
    const present = todayRecords.filter((r) => r.status === "present").length;
    const absent = todayRecords.filter((r) => r.status === "absent").length;
    const late = todayRecords.filter((r) => r.status === "late").length;
    const leave = todayRecords.filter((r) => r.status === "leave").length;
    const total = todayRecords.length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return { total, present, absent, late, leave, percentage };
  };

  const getFilteredRecords = (filters: { date?: string; classId?: string; status?: string; search?: string }) => {
    return attendanceRecords.filter((record) => {
      if (filters.date && record.date !== filters.date) return false;
      if (filters.classId && filters.classId !== "all" && record.classId !== filters.classId) return false;
      if (filters.status && filters.status !== "all" && record.status !== filters.status) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          record.studentName.toLowerCase().includes(searchLower) ||
          record.rollNumber?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  };

  const bulkUpdateAttendance = (recordIds: string[], status: "present" | "absent" | "late" | "leave") => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        recordIds.includes(record.id) ? { ...record, status } : record
      )
    );
  };

  return {
    attendanceRecords,
    isLoaded,
    saveAttendance,
    deleteAttendance,
    updateAttendance,
    getAttendanceByClassAndDate,
    getDashboardStats,
    getFilteredRecords,
    bulkUpdateAttendance,
  };
}
