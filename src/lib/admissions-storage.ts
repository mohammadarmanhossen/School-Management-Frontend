export type ApplicationStatus = "pending" | "accepted" | "rejected";

export type StudentAdmissionRequest = {
  id: string;
  full_name: string;
  class_name: string;
  status: ApplicationStatus;
  submittedAt: string;
};

export type TeacherApplicationRequest = {
  id: string;
  full_name: string;
  subject: string;
  status: ApplicationStatus;
  submittedAt: string;
};

const STUDENT_KEY = "students";
const TEACHER_KEY = "teachers";

// generic get
export const getData = (key: string) => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(key) || "[]");
};

// generic save
export const setData = <T,>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// init demo data (first time)
export const initAdmissions = () => {
  if (!localStorage.getItem(STUDENT_KEY)) {
    setData(STUDENT_KEY, [
      {
        id: "1",
        full_name: "Rahim Uddin",
        class_name: "Class 10",
        status: "pending",
        submittedAt: new Date().toISOString(),
      },
    ]);
  }

  if (!localStorage.getItem(TEACHER_KEY)) {
    setData(TEACHER_KEY, [
      {
        id: "t1",
        full_name: "Mr. Karim",
        subject: "Mathematics",
        status: "pending",
        submittedAt: new Date().toISOString(),
      },
    ]);
  }
};