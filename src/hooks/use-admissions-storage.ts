"use client";

import { useEffect, useState } from "react";
import {
  getData,
  setData,
  initAdmissions,
  StudentAdmissionRequest,
  TeacherApplicationRequest
} from "@/lib/admissions-storage";

export function useAdmissionsStorage() {
  const [students, setStudents] = useState<StudentAdmissionRequest[]>([]);
  const [teachers, setTeachers] = useState<TeacherApplicationRequest[]>([]);

  useEffect(() => {
    initAdmissions();

    setStudents(getData("students"));
    setTeachers(getData("teachers"));
  }, []);

  // UPDATE STATUS (MAIN SAVE FUNCTION)
  const updateStatus = (
    type: "student" | "teacher",
    id: string,
    status: "accepted" | "rejected"
  ) => {
    const key = type === "student" ? "students" : "teachers";

    const data = getData(key);

    const updated = data.map((item: StudentAdmissionRequest | TeacherApplicationRequest) =>
      item.id === id ? { ...item, status } : item
    );

    setData(key, updated);

    if (type === "student") setStudents(updated);
    else setTeachers(updated);
  };

  return {
    students,
    teachers,
    updateStatus,
  };
}