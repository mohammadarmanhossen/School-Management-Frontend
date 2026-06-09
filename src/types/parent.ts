export interface ParentChildProfile {
  id: string;
  name: string;
  photoUrl: string;
  class: string;
  section: string;
  rollNumber: string;
  academicYear: string;
  studentId: string;
  bloodGroup: string;
  classTeacher: string;
}

export interface ParentChildAttendance {
  date: string; // YYYY-MM-DD
  status: "present" | "absent" | "late" | "half_day";
  remarks?: string;
}

export interface ParentChildExam {
  id: string;
  examName: string;
  subject: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "ongoing";
  syllabus?: string;
}

export interface ParentChildResult {
  id: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks: string;
  date: string;
}

export interface ParentChildFee {
  id: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
}

export interface ParentChildRoutine {
  day: string;
  periods: {
    subject: string;
    time: string;
    teacher: string;
    room: string;
  }[];
}

export interface ParentNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "general" | "academic" | "event" | "fee";
  isRead: boolean;
}

export interface ParentActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "attendance" | "exam" | "fee" | "result";
}
