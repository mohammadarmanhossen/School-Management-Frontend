"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/constants/query-keys";
import { classService, teacherService } from "@/services";
import { getErrorMessage } from "@/services/api-client";
import { useClassStore } from "@/store/class-store";
import type { ClassFormData } from "@/schemas";
import type { ClassRoom, Teacher } from "@/types";

async function fetchClasses(): Promise<ClassRoom[]> {
  try {
    const data = await classService.getAll();
    return data.results ?? [];
  } catch {
    return useClassStore.getState().classes;
  }
}

export function useClasses() {
  return useQuery({
    queryKey: queryKeys.classes.list(),
    queryFn: fetchClasses,
  });
}

export function useClass(id: string) {
  return useQuery({
    queryKey: queryKeys.classes.detail(id),
    queryFn: async () => {
      try {
        return await classService.getById(id);
      } catch {
        return useClassStore.getState().getClassById(id);
      }
    },
    enabled: !!id,
  });
}

export function useTeachersForSelect() {
  return useQuery({
    queryKey: queryKeys.teachers.list(),
    queryFn: async (): Promise<Teacher[]> => {
      try {
        const data = await teacherService.getAll();
        return data.results ?? [];
      } catch {
        try {
          const rawTeachers = localStorage.getItem("teachers_db");
          if (rawTeachers) {
            return JSON.parse(rawTeachers);
          }
        } catch (e) {
          console.error("Failed to parse teachers from local storage");
        }
        return [];
      }
    },
  });
}

export function useClassMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.classes.all });

  const create = useMutation({
    mutationFn: async (data: ClassFormData) => {
      try {
        return await classService.create(data);
      } catch {
        return useClassStore.getState().addClass(data);
      }
    },
    onSuccess: () => {
      toast.success("Class created successfully");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClassFormData> }) => {
      try {
        return await classService.update(id, data);
      } catch {
        const updated = useClassStore.getState().updateClass(id, data);
        if (!updated) throw new Error("Class not found");
        return updated;
      }
    },
    onSuccess: (_, { id }) => {
      toast.success("Class updated successfully");
      invalidate();
      qc.invalidateQueries({ queryKey: queryKeys.classes.detail(id) });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      try {
        await classService.delete(id);
      } catch {
        useClassStore.getState().deleteClass(id);
      }
    },
    onSuccess: () => {
      toast.success("Class deleted successfully");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const assignTeacher = useMutation({
    mutationFn: async ({ classId, teacherId }: { classId: string; teacherId: string }) => {
      try {
        return await classService.update(classId, { teacherId });
      } catch {
        const updated = useClassStore.getState().assignTeacher(classId, teacherId);
        if (!updated) throw new Error("Class not found");
        return updated;
      }
    },
    onSuccess: () => {
      toast.success("Teacher assigned successfully");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return { create, update, remove, assignTeacher };
}
