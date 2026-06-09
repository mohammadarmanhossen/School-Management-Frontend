import { useState, useEffect } from "react";
import type { Teacher } from "@/types";

const STORAGE_KEY = "teachers_db";

export function useTeachersStorage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        setTeachers(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse teachers from local storage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever teachers change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
    }
  }, [teachers, isLoaded]);

  const addTeacher = (teacher: Omit<Teacher, "id" | "createdAt">) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTeachers((prev) => [...prev, newTeacher]);
    return newTeacher;
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === id ? { ...teacher, ...updates } : teacher
      )
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
  };

  const getTeacherById = (id: string) => {
    return teachers.find((teacher) => teacher.id === id);
  };

  return {
    teachers,
    isLoaded,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
  };
}
