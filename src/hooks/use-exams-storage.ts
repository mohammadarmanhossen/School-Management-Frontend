import { useState, useEffect } from "react";
import type { Exam } from "@/types";

const STORAGE_KEY = "exams_db";

export function useExamsStorage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        setExams(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse exams from local storage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever exams change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    }
  }, [exams, isLoaded]);

  const addExam = (exam: Omit<Exam, "id">) => {
    const newExam: Exam = {
      ...exam,
      id: crypto.randomUUID(),
    };
    setExams((prev) => [...prev, newExam]);
    return newExam;
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === id ? { ...exam, ...updates } : exam
      )
    );
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  };

  const getExamById = (id: string) => {
    return exams.find((exam) => exam.id === id);
  };

  return {
    exams,
    isLoaded,
    addExam,
    updateExam,
    deleteExam,
    getExamById,
  };
}
