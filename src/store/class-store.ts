import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClassFormData } from "@/schemas";
import type { ClassRoom } from "@/types";

interface ClassStore {
  classes: ClassRoom[];
  addClass: (data: ClassFormData) => ClassRoom;
  updateClass: (id: string, data: Partial<ClassFormData>) => ClassRoom | undefined;
  deleteClass: (id: string) => void;
  assignTeacher: (classId: string, teacherId: string) => ClassRoom | undefined;
  getClassById: (id: string) => ClassRoom | undefined;
}

function resolveTeacherName(teacherId?: string) {
  if (!teacherId) return undefined;
  try {
    const rawTeachers = localStorage.getItem("teachers_db");
    if (rawTeachers) {
      const teachers = JSON.parse(rawTeachers);
      return teachers.find((t: { id: string; fullName: string }) => t.id === teacherId)?.fullName;
    }
  } catch (e) {
    console.error("Failed to parse teachers from local storage");
  }
  return undefined;
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set, get) => ({
      classes: [],

      addClass: (data) => {
        const newClass: ClassRoom = {
          id: crypto.randomUUID?.() || `class-${Date.now()}`,
          name: data.name,
          grade: data.grade,
          capacity: data.capacity,
          academicYear: data.academicYear,
          teacherId: data.teacherId,
          teacherName: resolveTeacherName(data.teacherId),
          studentCount: 0,
        };
        set((state) => ({ classes: [...state.classes, newClass] }));
        return newClass;
      },

      updateClass: (id, data) => {
        let updated: ClassRoom | undefined;
        set((state) => ({
          classes: state.classes.map((cls) => {
            if (cls.id !== id) return cls;
            updated = {
              ...cls,
              ...data,
              teacherName:
                data.teacherId !== undefined
                  ? resolveTeacherName(data.teacherId)
                  : cls.teacherName,
            };
            return updated;
          }),
        }));
        return updated;
      },

      deleteClass: (id) => {
        set((state) => ({
          classes: state.classes.filter((cls) => cls.id !== id),
        }));
      },

      assignTeacher: (classId, teacherId) => {
        return get().updateClass(classId, { teacherId });
      },

      getClassById: (id) => get().classes.find((cls) => cls.id === id),
    }),
    {
      name: "classes-storage",
    }
  )
);

