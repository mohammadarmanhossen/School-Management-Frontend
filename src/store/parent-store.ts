import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ParentChildProfile,
  ParentChildAttendance,
  ParentChildExam,
  ParentChildResult,
  ParentChildFee,
  ParentChildRoutine,
  ParentNotice,
  ParentActivity,
} from "@/types/parent";

interface ParentStore {
  children: ParentChildProfile[];
  selectedChildId: string | null;
  attendance: Record<string, ParentChildAttendance[]>; // key: childId
  exams: Record<string, ParentChildExam[]>;
  results: Record<string, ParentChildResult[]>;
  fees: Record<string, ParentChildFee[]>;
  routines: Record<string, ParentChildRoutine[]>;
  notices: ParentNotice[];
  activities: Record<string, ParentActivity[]>;

  // Actions
  setSelectedChild: (childId: string) => void;
  markNoticeRead: (noticeId: string) => void;
}

// Initial Data
const initialChildren: ParentChildProfile[] = [
  {
    id: "child-1",
    name: "Alex Johnson",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    class: "10",
    section: "A",
    rollNumber: "12",
    academicYear: "2026-2027",
    studentId: "STU-2026-001",
    bloodGroup: "O+",
    classTeacher: "Mr. Smith",
  },
  {
    id: "child-2",
    name: "Emma Johnson",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    class: "8",
    section: "B",
    rollNumber: "05",
    academicYear: "2026-2027",
    studentId: "STU-2026-045",
    bloodGroup: "A+",
    classTeacher: "Ms. Davis",
  },
];

const initialAttendance: Record<string, ParentChildAttendance[]> = {
  "child-1": [
    { date: new Date().toISOString().split("T")[0], status: "present" },
    { date: new Date(Date.now() - 86400000).toISOString().split("T")[0], status: "present" },
    { date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], status: "absent", remarks: "Sick leave" },
  ],
  "child-2": [
    { date: new Date().toISOString().split("T")[0], status: "present" },
    { date: new Date(Date.now() - 86400000).toISOString().split("T")[0], status: "late" },
  ],
};

const initialExams: Record<string, ParentChildExam[]> = {
  "child-1": [
    { id: "ex-1", examName: "Mid Term Evaluation", subject: "Mathematics", date: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0], time: "10:00 AM", status: "upcoming", syllabus: "Chapters 1-5" },
    { id: "ex-2", examName: "Mid Term Evaluation", subject: "Physics", date: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0], time: "10:00 AM", status: "upcoming", syllabus: "Chapters 1-4" },
  ],
  "child-2": [
    { id: "ex-3", examName: "Mid Term Evaluation", subject: "Science", date: new Date(Date.now() + 86400000 * 6).toISOString().split("T")[0], time: "09:00 AM", status: "upcoming", syllabus: "Chapters 1-3" },
  ],
};

const initialResults: Record<string, ParentChildResult[]> = {
  "child-1": [
    { id: "res-1", examName: "First Term Exam", subject: "Mathematics", marksObtained: 85, totalMarks: 100, grade: "A", remarks: "Excellent", date: "2026-03-15" },
    { id: "res-2", examName: "First Term Exam", subject: "Physics", marksObtained: 78, totalMarks: 100, grade: "B+", remarks: "Good, needs focus on practicals", date: "2026-03-16" },
  ],
  "child-2": [
    { id: "res-3", examName: "First Term Exam", subject: "Science", marksObtained: 92, totalMarks: 100, grade: "A+", remarks: "Outstanding", date: "2026-03-15" },
  ],
};

const initialFees: Record<string, ParentChildFee[]> = {
  "child-1": [
    { id: "fee-1", feeType: "Tuition Fee - June", amount: 2500, dueDate: new Date(Date.now() - 86400000 * 10).toISOString().split("T")[0], status: "paid", paidDate: new Date(Date.now() - 86400000 * 12).toISOString().split("T")[0] },
    { id: "fee-2", feeType: "Tuition Fee - July", amount: 2500, dueDate: new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0], status: "pending" },
  ],
  "child-2": [
    { id: "fee-3", feeType: "Tuition Fee - June", amount: 2000, dueDate: new Date(Date.now() - 86400000 * 10).toISOString().split("T")[0], status: "paid", paidDate: new Date(Date.now() - 86400000 * 15).toISOString().split("T")[0] },
    { id: "fee-4", feeType: "Tuition Fee - July", amount: 2000, dueDate: new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0], status: "pending" },
  ],
};

const initialRoutines: Record<string, ParentChildRoutine[]> = {
  "child-1": [
    { day: "Monday", periods: [{ subject: "Mathematics", time: "09:00 - 09:45", teacher: "Mr. Smith", room: "Room 101" }, { subject: "Physics", time: "09:45 - 10:30", teacher: "Ms. Johnson", room: "Lab 1" }] },
    { day: "Tuesday", periods: [{ subject: "Chemistry", time: "09:00 - 09:45", teacher: "Mr. White", room: "Lab 2" }] },
  ],
  "child-2": [
    { day: "Monday", periods: [{ subject: "Science", time: "09:00 - 09:45", teacher: "Ms. Davis", room: "Room 205" }] },
  ],
};

const initialNotices: ParentNotice[] = [
  { id: "not-1", title: "Summer Vacation Announcement", content: "School will remain closed from July 1st to July 31st.", date: new Date().toISOString(), type: "general", isRead: false },
  { id: "not-2", title: "Upcoming Parent-Teacher Meeting", content: "PTM is scheduled for next Saturday. Please book your slots.", date: new Date(Date.now() - 86400000 * 2).toISOString(), type: "academic", isRead: true },
];

const initialActivities: Record<string, ParentActivity[]> = {
  "child-1": [
    { id: "act-1", title: "Fee Payment Received", description: "Tuition fee for June was successfully processed.", date: new Date(Date.now() - 86400000 * 12).toISOString(), type: "fee" },
    { id: "act-2", title: "Result Published", description: "First Term Exam results are now available.", date: "2026-03-20T10:00:00Z", type: "result" },
  ],
  "child-2": [
    { id: "act-3", title: "Marked Absent", description: "Emma was marked absent on " + new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], date: new Date(Date.now() - 86400000 * 2).toISOString(), type: "attendance" },
  ],
};

export const useParentStore = create<ParentStore>()(
  persist(
    (set) => ({
      children: initialChildren,
      selectedChildId: "child-1",
      attendance: initialAttendance,
      exams: initialExams,
      results: initialResults,
      fees: initialFees,
      routines: initialRoutines,
      notices: initialNotices,
      activities: initialActivities,

      setSelectedChild: (childId) => set({ selectedChildId: childId }),
      
      markNoticeRead: (noticeId) => set((state) => ({
        notices: state.notices.map((n) => n.id === noticeId ? { ...n, isRead: true } : n)
      })),
    }),
    {
      name: "parent-storage",
    }
  )
);
