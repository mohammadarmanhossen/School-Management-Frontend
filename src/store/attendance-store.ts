import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AttendanceRecord } from "@/types";

interface AttendanceState {
  records: AttendanceRecord[];
  addRecord: (record: AttendanceRecord) => void;
  updateRecord: (id: string, record: Partial<AttendanceRecord>) => void;
  deleteRecord: (id: string) => void;
  bulkAddRecords: (records: AttendanceRecord[]) => void;
  getRecordsByClassAndDate: (classId: string, date: string) => AttendanceRecord[];
  getRecordsByStudent: (studentId: string) => AttendanceRecord[];
}

// Initial mock data based on existing ones
const initialRecords: AttendanceRecord[] = [
  {
    id: "att-1",
    studentId: "1",
    studentName: "Rahim Uddin",
    rollNumber: "101",
    classId: "class-10",
    className: "Class 10",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    checkInTime: "08:00",
  },
  {
    id: "att-2",
    studentId: "2",
    studentName: "Fatema Khatun",
    rollNumber: "102",
    classId: "class-10",
    className: "Class 10",
    date: new Date().toISOString().split("T")[0],
    status: "absent",
    remarks: "Sick leave",
  },
];

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: initialRecords,

      addRecord: (record) => {
        set((state) => ({ records: [...state.records, record] }));
      },

      updateRecord: (id, updatedFields) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...updatedFields } : r
          ),
        }));
      },

      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }));
      },

      bulkAddRecords: (newRecords) => {
        set((state) => {
          // Prevent duplicates by checking studentId + date
          const existingMap = new Map(
            state.records.map((r) => [`${r.studentId}-${r.date}`, r])
          );
          newRecords.forEach((r) => existingMap.set(`${r.studentId}-${r.date}`, r));
          return { records: Array.from(existingMap.values()) };
        });
      },

      getRecordsByClassAndDate: (classId, date) => {
        return get().records.filter(
          (r) => r.classId === classId && r.date === date
        );
      },

      getRecordsByStudent: (studentId) => {
        return get().records.filter((r) => r.studentId === studentId);
      },
    }),
    {
      name: "attendance-storage",
    }
  )
);
