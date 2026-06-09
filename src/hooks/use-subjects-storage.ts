import { useState, useEffect } from "react";
import type { Subject } from "@/types";

const STORAGE_KEY = "subjects_db";

export function useSubjectsStorage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        setSubjects(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse subjects from local storage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever subjects change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    }
  }, [subjects, isLoaded]);

  const addSubject = (subject: Omit<Subject, "id">) => {
    const newSubject: Subject = {
      ...subject,
      id: crypto.randomUUID(),
    };
    setSubjects((prev) => [...prev, newSubject]);
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id ? { ...subject, ...updates } : subject
      )
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id));
  };

  const getSubjectById = (id: string) => {
    return subjects.find((subject) => subject.id === id);
  };

  return {
    subjects,
    isLoaded,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
  };
}
