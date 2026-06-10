import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimetableEntry } from "@/types";
import { mockTimetable } from "@/lib/mock-data";

export interface TimetableConflict {
  type: "teacher" | "room" | "class";
  message: string;
  conflictingEntry: TimetableEntry;
}

interface TimetableStore {
  entries: TimetableEntry[];
  addEntry: (entry: Omit<TimetableEntry, "id">) => { success: boolean; conflict?: TimetableConflict; entry?: TimetableEntry };
  updateEntry: (id: string, updates: Partial<TimetableEntry>) => { success: boolean; conflict?: TimetableConflict; entry?: TimetableEntry };
  deleteEntry: (id: string) => void;
  getTeacherSchedule: (teacherId?: string) => TimetableEntry[];
  getClassRoutine: (className?: string) => TimetableEntry[];
  getRoomSchedule: (room?: string) => TimetableEntry[];
  checkConflicts: (entry: Omit<TimetableEntry, "id">, ignoreId?: string) => TimetableConflict | null;
}

function timeToMinutes(timeStr: string) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function isTimeOverlap(start1: string, end1: string, start2: string, end2: string) {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  // overlap if start1 is before end2 AND start2 is before end1
  return s1 < e2 && s2 < e1;
}

export const useTimetableStore = create<TimetableStore>()(
  persist(
    (set, get) => ({
      entries: mockTimetable,

      checkConflicts: (entry, ignoreId) => {
        const state = get();
        for (const existing of state.entries) {
          if (ignoreId && existing.id === ignoreId) continue;
          
          if (existing.day === entry.day && isTimeOverlap(entry.startTime, entry.endTime, existing.startTime, existing.endTime)) {
            // Check teacher conflict
            if (existing.teacherId && entry.teacherId && existing.teacherId === entry.teacherId) {
              return { type: "teacher", message: `Teacher ${existing.teacherName} is already scheduled for ${existing.subjectName} in Room ${existing.room}.`, conflictingEntry: existing };
            }
            if (!existing.teacherId && existing.teacherName === entry.teacherName) {
               return { type: "teacher", message: `Teacher ${existing.teacherName} is already scheduled for ${existing.subjectName}.`, conflictingEntry: existing };
            }
            
            // Check room conflict
            if (existing.room && entry.room && existing.room === entry.room) {
              return { type: "room", message: `Room ${existing.room} is already occupied by ${existing.className} (${existing.subjectName}).`, conflictingEntry: existing };
            }
            
            // Check class conflict
            if (existing.className === entry.className && existing.sectionName === entry.sectionName) {
              const sec = existing.sectionName ? ` Section ${existing.sectionName}` : '';
              return { type: "class", message: `Class ${existing.className}${sec} already has ${existing.subjectName} scheduled.`, conflictingEntry: existing };
            }
          }
        }
        return null;
      },

      addEntry: (entryData) => {
        const conflict = get().checkConflicts(entryData);
        if (conflict) {
          return { success: false, conflict };
        }
        
        const newEntry: TimetableEntry = {
          ...entryData,
          id: `tt-${Date.now()}`
        };
        
        set((state) => ({ entries: [...state.entries, newEntry] }));
        return { success: true, entry: newEntry };
      },

      updateEntry: (id, updates) => {
        const state = get();
        const existing = state.entries.find(e => e.id === id);
        if (!existing) return { success: false };

        const updatedData = { ...existing, ...updates };
        const conflict = get().checkConflicts(updatedData, id);
        
        if (conflict) {
          return { success: false, conflict };
        }

        set((state) => ({
          entries: state.entries.map((e) => e.id === id ? updatedData : e)
        }));
        
        return { success: true, entry: updatedData };
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id)
        }));
      },

      getTeacherSchedule: (teacherId) => {
        if (!teacherId) return get().entries;
        return get().entries.filter(e => e.teacherId === teacherId || e.teacherName === teacherId);
      },

      getClassRoutine: (className) => {
        if (!className) return get().entries;
        return get().entries.filter(e => e.className === className);
      },

      getRoomSchedule: (room) => {
        if (!room) return get().entries;
        return get().entries.filter(e => e.room === room);
      }
    }),
    {
      name: "timetable-storage"
    }
  )
);
