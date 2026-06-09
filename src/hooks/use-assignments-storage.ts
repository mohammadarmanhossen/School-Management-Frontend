import { useState, useEffect } from "react";
import type { Assignment } from "@/types";

const STORAGE_KEY = "assignments_db";

export function useAssignmentsStorage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        setAssignments(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse assignments from local storage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever assignments change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    }
  }, [assignments, isLoaded]);

  const addAssignment = (assignment: Omit<Assignment, "id" | "submissionCount">) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
      submissionCount: 0,
    };
    setAssignments((prev) => [...prev, newAssignment]);
    return newAssignment;
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id ? { ...assignment, ...updates } : assignment
      )
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
  };

  const getAssignmentById = (id: string) => {
    return assignments.find((assignment) => assignment.id === id);
  };

  return {
    assignments,
    isLoaded,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
  };
}
