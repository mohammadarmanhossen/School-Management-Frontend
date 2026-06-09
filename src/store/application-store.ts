"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Student = {
  id: string;
  full_name: string;
  class_name: string;
  phone: string;
  address: string;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
};

type Teacher = {
  id: string;
  full_name: string;
  subject: string;
  phone: string;
  email: string;
  address: string;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
};

type Store = {
  students: Student[];
  teachers: Teacher[];

  addStudentRequest: (data: Omit<Student, "id" | "status" | "submittedAt">) => void;
  addTeacherRequest: (data: Omit<Teacher, "id" | "status" | "submittedAt">) => void;

  updateStatus: (
    type: "student" | "teacher",
    id: string,
    status: "pending" | "accepted" | "rejected"
  ) => void;
};

export const useApplicationStore = create<Store>()(
  persist(
    (set, get) => ({
      students: [],
      teachers: [],

      addStudentRequest: (data) => {
        const newStudent: Student = {
          id: crypto.randomUUID(),
          ...data,
          status: "pending",
          submittedAt: new Date().toISOString(),
        };

        set({ students: [...get().students, newStudent] });
      },

      addTeacherRequest: (data) => {
        const newTeacher: Teacher = {
          id: crypto.randomUUID(),
          ...data,
          status: "pending",
          submittedAt: new Date().toISOString(),
        };

        set({ teachers: [...get().teachers, newTeacher] });
      },

      updateStatus: (type, id, status) => {
        if (type === "student") {
          set({
            students: get().students.map((s) =>
              s.id === id ? { ...s, status } : s
            ),
          });
        } else {
          set({
            teachers: get().teachers.map((t) =>
              t.id === id ? { ...t, status } : t
            ),
          });
        }
      },
    }),
    {
      name: "admission-storage",
    }
  )
);