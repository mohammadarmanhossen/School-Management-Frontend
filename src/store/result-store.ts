import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ExamResult } from "@/types";

interface ResultState {
  results: ExamResult[];
  addResult: (data: Omit<ExamResult, "id" | "gpa" | "grade"> & { gpa?: number, grade?: string }) => void;
  bulkAddResults: (dataList: Array<Omit<ExamResult, "id" | "gpa" | "grade"> & { gpa?: number, grade?: string }>) => void;
  updateResult: (id: string, data: Partial<ExamResult>) => void;
  deleteResult: (id: string) => void;
  getResultById: (id: string) => ExamResult | undefined;
}

const calculateGradeAndGPA = (marks: number, total: number) => {
  const percentage = (marks / total) * 100;
  if (percentage >= 80) return { grade: "A+", gpa: 5.0 };
  if (percentage >= 70) return { grade: "A", gpa: 4.0 };
  if (percentage >= 60) return { grade: "A-", gpa: 3.5 };
  if (percentage >= 50) return { grade: "B", gpa: 3.0 };
  if (percentage >= 40) return { grade: "C", gpa: 2.0 };
  if (percentage >= 33) return { grade: "D", gpa: 1.0 };
  return { grade: "F", gpa: 0.0 };
};

export const useResultStore = create<ResultState>()(
  persist(
    (set, get) => ({
      results: [],
      addResult: (data) => {
        const { grade, gpa } = calculateGradeAndGPA(data.marksObtained, data.totalMarks);
        const newResult: ExamResult = {
          ...data,
          id: crypto.randomUUID?.() || `res-${Date.now()}`,
          grade: data.grade || grade,
          gpa: data.gpa ?? gpa,
        };
        set((state) => ({ results: [...state.results, newResult] }));
      },
      bulkAddResults: (dataList) => {
        const newResults = dataList.map((data, index) => {
          const { grade, gpa } = calculateGradeAndGPA(data.marksObtained, data.totalMarks);
          return {
            ...data,
            id: crypto.randomUUID?.() || `res-${Date.now()}-${index}`,
            grade: data.grade || grade,
            gpa: data.gpa ?? gpa,
          };
        });
        set((state) => {
          // simple dedup by studentId + examName
          const existingMap = new Map(state.results.map(r => [`${r.studentId}-${r.examName}`, r]));
          newResults.forEach(r => existingMap.set(`${r.studentId}-${r.examName}`, r as ExamResult));
          return { results: Array.from(existingMap.values()) };
        });
      },
      updateResult: (id, data) =>
        set((state) => ({
          results: state.results.map((r) => {
            if (r.id === id) {
              const updated = { ...r, ...data };
              const { grade, gpa } = calculateGradeAndGPA(updated.marksObtained, updated.totalMarks);
              return { ...updated, grade, gpa };
            }
            return r;
          }),
        })),
      deleteResult: (id) =>
        set((state) => ({
          results: state.results.filter((r) => r.id !== id),
        })),
      getResultById: (id) => get().results.find((r) => r.id === id),
    }),
    {
      name: "sms-results-storage",
    }
  )
);
