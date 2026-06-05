import type {
  Student,
  Teacher,
  ClassRoom,
  Section,
  Subject,
  AttendanceRecord,
  Exam,
  ExamResult,
  Assignment,
  Fee,
  Notice,
  Notification,
  DashboardStats,
  ChartDataPoint,
  Book,
  Vehicle,
  TimetableEntry,
  Activity,
  BookIssue,
  LibraryMember,
  LibraryFine,
  LibrarianDashboardStats,
} from "@/types";

export const mockDashboardStats: DashboardStats = {
  totalStudents: 1248,
  totalTeachers: 86,
  totalClasses: 42,
  totalSubjects: 28,
  monthlyAttendance: 94.2,
  monthlyFeeCollection: 2850000,
  upcomingExams: 12,
  recentActivities: mockActivities(),
};

function mockActivities(): Activity[] {
  return [
    { id: "1", type: "student", description: "New student admitted: Rahima Akter", user: "Admin", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: "2", type: "fee", description: "Fee payment received: BDT 15,000", user: "System", timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: "3", type: "exam", description: "Mid-term exam scheduled for Class 10", user: "Admin", timestamp: new Date(Date.now() - 10800000).toISOString() },
    { id: "4", type: "attendance", description: "Daily attendance marked for Class 8-A", user: "Mr. Karim", timestamp: new Date(Date.now() - 14400000).toISOString() },
    { id: "5", type: "notice", description: "Annual sports day notice published", user: "Admin", timestamp: new Date(Date.now() - 86400000).toISOString() },
  ];
}

export const mockAttendanceChart: ChartDataPoint[] = [
  { name: "Jan", present: 92, absent: 8 },
  { name: "Feb", present: 94, absent: 6 },
  { name: "Mar", present: 91, absent: 9 },
  { name: "Apr", present: 95, absent: 5 },
  { name: "May", present: 93, absent: 7 },
  { name: "Jun", present: 96, absent: 4 },
];

export const mockRevenueChart: ChartDataPoint[] = [
  { name: "Jan", revenue: 420000, target: 400000 },
  { name: "Feb", revenue: 380000, target: 400000 },
  { name: "Mar", revenue: 450000, target: 420000 },
  { name: "Apr", revenue: 510000, target: 450000 },
  { name: "May", revenue: 480000, target: 460000 },
  { name: "Jun", revenue: 520000, target: 480000 },
];

export const mockStudentGrowthChart: ChartDataPoint[] = [
  { name: "2020", students: 850 },
  { name: "2021", students: 920 },
  { name: "2022", students: 1050 },
  { name: "2023", students: 1150 },
  { name: "2024", students: 1200 },
  { name: "2025", students: 1248 },
];

export const mockExamPerformanceChart: ChartDataPoint[] = [
  { name: "Class 6", average: 78 },
  { name: "Class 7", average: 82 },
  { name: "Class 8", average: 75 },
  { name: "Class 9", average: 85 },
  { name: "Class 10", average: 88 },
  { name: "Class 11", average: 79 },
  { name: "Class 12", average: 91 },
];

export const mockStudents: Student[] = Array.from({ length: 20 }, (_, i) => ({
  id: `student-${i + 1}`,
  studentId: `STU-2025-${String(i + 1).padStart(4, "0")}`,
  rollNumber: String(i + 1).padStart(2, "0"),
  fullName: ["Rahim Ahmed", "Fatima Begum", "Karim Hassan", "Ayesha Rahman", "Tanvir Islam"][i % 5] + ` ${i + 1}`,
  gender: i % 2 === 0 ? "male" : "female",
  dateOfBirth: "2010-05-15",
  bloodGroup: ["A+", "B+", "O+", "AB+"][i % 4],
  email: `student${i + 1}@school.edu.bd`,
  phone: `017${String(10000000 + i).slice(0, 8)}`,
  address: `${i + 1}, Dhanmondi, Dhaka`,
  admissionDate: "2023-01-15",
  classId: `class-${(i % 5) + 6}`,
  className: `Class ${(i % 5) + 6}`,
  sectionId: `section-${i % 3 === 0 ? "a" : i % 3 === 1 ? "b" : "c"}`,
  sectionName: i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C",
  parentName: `Parent of Student ${i + 1}`,
  parentPhone: `018${String(10000000 + i).slice(0, 8)}`,
  parentEmail: `parent${i + 1}@email.com`,
  status: "active",
  createdAt: "2023-01-15T00:00:00Z",
}));

export const mockTeachers: Teacher[] = Array.from({ length: 10 }, (_, i) => ({
  id: `teacher-${i + 1}`,
  employeeId: `EMP-2020-${String(i + 1).padStart(3, "0")}`,
  fullName: ["Mohammad Karim", "Sharmin Akter", "Abdul Jabbar", "Nusrat Jahan", "Imran Hossain"][i % 5],
  gender: i % 2 === 0 ? "male" : "female",
  qualification: ["M.Sc", "B.Ed", "M.A", "Ph.D"][i % 4],
  specialization: ["Mathematics", "English", "Physics", "Chemistry", "Biology"][i % 5],
  phone: `019${String(10000000 + i).slice(0, 8)}`,
  email: `teacher${i + 1}@school.edu.bd`,
  salary: 35000 + i * 2000,
  joiningDate: "2020-06-01",
  address: `${i + 10}, Gulshan, Dhaka`,
  subjects: [["Mathematics"], ["English"], ["Physics"]][i % 3],
  status: "active",
  createdAt: "2020-06-01T00:00:00Z",
}));

export const mockClasses: ClassRoom[] = Array.from({ length: 7 }, (_, i) => ({
  id: `class-${i + 6}`,
  name: `Class ${i + 6}`,
  grade: i + 6,
  capacity: 40,
  teacherId: `teacher-${(i % 5) + 1}`,
  teacherName: mockTeachers[i % 5].fullName,
  studentCount: 35 + (i % 5),
  academicYear: "2024-2025",
}));

export const mockSections: Section[] = ["A", "B", "C"].flatMap((sec) =>
  mockClasses.slice(0, 3).map((cls, ci) => ({
    id: `section-${cls.id}-${sec.toLowerCase()}`,
    name: sec,
    classId: cls.id,
    className: cls.name,
    capacity: 40,
    studentCount: 30 + ci,
  }))
);

export const mockSubjects: Subject[] = [
  { id: "sub-1", code: "MATH101", name: "Mathematics", credits: 4, teacherId: "teacher-1", teacherName: "Mohammad Karim", classId: "class-10", className: "Class 10" },
  { id: "sub-2", code: "ENG101", name: "English", credits: 3, teacherId: "teacher-2", teacherName: "Sharmin Akter", classId: "class-10", className: "Class 10" },
  { id: "sub-3", code: "PHY101", name: "Physics", credits: 4, teacherId: "teacher-3", teacherName: "Abdul Jabbar", classId: "class-10", className: "Class 10" },
  { id: "sub-4", code: "CHE101", name: "Chemistry", credits: 4, teacherId: "teacher-4", teacherName: "Nusrat Jahan", classId: "class-10", className: "Class 10" },
  { id: "sub-5", code: "BIO101", name: "Biology", credits: 3, teacherId: "teacher-5", teacherName: "Imran Hossain", classId: "class-10", className: "Class 10" },
];

export const mockAttendance: AttendanceRecord[] = mockStudents.slice(0, 15).map((s, i) => ({
  id: `att-${i + 1}`,
  studentId: s.id,
  studentName: s.fullName,
  classId: s.classId,
  className: s.className,
  date: new Date().toISOString().split("T")[0],
  status: (["present", "present", "present", "absent", "late", "leave"] as const)[i % 6],
}));

export const mockExams: Exam[] = [
  { id: "exam-1", name: "Mid Term Examination", type: "mid_term", classId: "class-10", className: "Class 10", subjectId: "sub-1", subjectName: "Mathematics", examDate: "2025-06-15", startTime: "09:00", endTime: "12:00", totalMarks: 100, passMarks: 33, status: "scheduled" },
  { id: "exam-2", name: "Class Test 1", type: "class_test", classId: "class-9", className: "Class 9", subjectId: "sub-2", subjectName: "English", examDate: "2025-06-10", startTime: "10:00", endTime: "11:00", totalMarks: 20, passMarks: 8, status: "scheduled" },
  { id: "exam-3", name: "Final Examination", type: "final_exam", classId: "class-12", className: "Class 12", subjectId: "sub-3", subjectName: "Physics", examDate: "2025-07-01", startTime: "09:00", endTime: "12:00", totalMarks: 100, passMarks: 33, status: "scheduled" },
];

export const mockResults: ExamResult[] = mockStudents.slice(0, 10).map((s, i) => ({
  id: `result-${i + 1}`,
  studentId: s.id,
  studentName: s.fullName,
  examId: "exam-1",
  examName: "Mid Term Examination",
  marksObtained: 60 + (i % 35),
  totalMarks: 100,
  grade: ["A+", "A", "A-", "B", "C"][i % 5],
  gpa: [5.0, 4.0, 3.5, 3.0, 2.0][i % 5],
  position: i + 1,
}));

export const mockAssignments: Assignment[] = [
  { id: "asg-1", title: "Algebra Problem Set", description: "Complete exercises 1-20 from chapter 5", classId: "class-10", className: "Class 10", subjectId: "sub-1", subjectName: "Mathematics", teacherId: "teacher-1", teacherName: "Mohammad Karim", dueDate: "2025-06-15", maxMarks: 20, submissionCount: 28, totalStudents: 35, status: "published" },
  { id: "asg-2", title: "Essay Writing", description: "Write a 500-word essay on climate change", classId: "class-10", className: "Class 10", subjectId: "sub-2", subjectName: "English", teacherId: "teacher-2", teacherName: "Sharmin Akter", dueDate: "2025-06-20", maxMarks: 15, submissionCount: 15, totalStudents: 35, status: "published" },
];

export const mockFees: Fee[] = mockStudents.slice(0, 10).map((s, i) => ({
  id: `fee-${i + 1}`,
  studentId: s.id,
  studentName: s.fullName,
  category: i % 2 === 0 ? "Monthly Fee" : "Exam Fee",
  amount: i % 2 === 0 ? 5000 : 1500,
  paidAmount: i % 3 === 0 ? 0 : i % 2 === 0 ? 5000 : 1500,
  dueDate: "2025-06-30",
  status: i % 3 === 0 ? "pending" : i % 3 === 1 ? "paid" : "partial",
  paymentMethod: i % 3 === 1 ? "bkash" : undefined,
  invoiceNumber: `INV-2025-${String(i + 1).padStart(4, "0")}`,
}));

export const mockNotices: Notice[] = [
  { id: "notice-1", title: "Annual Sports Day 2025", content: "Annual sports day will be held on June 25, 2025. All students are requested to participate.", author: "Principal", targetRoles: ["student", "teacher", "parent"], publishDate: "2025-06-01", status: "published", priority: "high" },
  { id: "notice-2", title: "Mid-Term Exam Schedule", content: "Mid-term examinations will begin from June 10, 2025. Please check the timetable.", author: "Exam Controller", targetRoles: ["student", "teacher"], publishDate: "2025-05-28", status: "published", priority: "urgent" },
  { id: "notice-3", title: "Fee Payment Reminder", content: "Last date for June fee payment is June 30, 2025.", author: "Accounts Office", targetRoles: ["parent"], publishDate: "2025-06-05", status: "published", priority: "medium" },
];

export const mockNotifications: Notification[] = [
  { id: "notif-1", title: "New Assignment", message: "Algebra Problem Set has been assigned", type: "info", read: false, createdAt: new Date().toISOString() },
  { id: "notif-2", title: "Fee Due", message: "Monthly fee payment is due in 5 days", type: "warning", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "notif-3", title: "Exam Result Published", message: "Mid-term results are now available", type: "success", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const mockBooks: Book[] = [
  { id: "book-1", title: "Advanced Mathematics", author: "Dr. Khan", isbn: "978-984-33-1234-5", category: "Mathematics", totalCopies: 50, availableCopies: 35, barcode: "BK001" },
  { id: "book-2", title: "English Grammar", author: "Wren & Martin", isbn: "978-984-33-5678-9", category: "English", totalCopies: 40, availableCopies: 28, barcode: "BK002" },
  { id: "book-3", title: "Physics for HSC", author: "Dr. Haque", isbn: "978-984-33-9012-3", category: "Physics", totalCopies: 30, availableCopies: 12, barcode: "BK003" },
];

export const mockVehicles: Vehicle[] = [
  { id: "veh-1", registrationNumber: "DHK-GA-1234", model: "Toyota Coaster", capacity: 30, driverName: "Abdul Malek", driverPhone: "01712345678", routeName: "Route A - Dhanmondi", status: "active" },
  { id: "veh-2", registrationNumber: "DHK-GA-5678", model: "Hino Bus", capacity: 40, driverName: "Rafiqul Islam", driverPhone: "01812345678", routeName: "Route B - Gulshan", status: "active" },
];

export const mockTimetable: TimetableEntry[] = [
  { id: "tt-1", day: "Sunday", startTime: "08:00", endTime: "08:45", subjectName: "Mathematics", teacherName: "Mohammad Karim", className: "Class 10", room: "101" },
  { id: "tt-2", day: "Sunday", startTime: "08:45", endTime: "09:30", subjectName: "English", teacherName: "Sharmin Akter", className: "Class 10", room: "101" },
  { id: "tt-3", day: "Sunday", startTime: "09:45", endTime: "10:30", subjectName: "Physics", teacherName: "Abdul Jabbar", className: "Class 10", room: "Lab 1" },
  { id: "tt-4", day: "Monday", startTime: "08:00", endTime: "08:45", subjectName: "Chemistry", teacherName: "Nusrat Jahan", className: "Class 10", room: "Lab 2" },
  { id: "tt-5", day: "Monday", startTime: "08:45", endTime: "09:30", subjectName: "Biology", teacherName: "Imran Hossain", className: "Class 10", room: "102" },
];

export function paginate<T>(items: T[], page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  return {
    results: items.slice(start, start + pageSize),
    count: items.length,
    next: start + pageSize < items.length ? String(page + 1) : null,
    previous: page > 1 ? String(page - 1) : null,
  };
}

export function filterItems<T>(
  items: T[],
  search: string,
  keys: (keyof T)[]
): T[] {
  if (!search) return items;
  const lower = search.toLowerCase();
  return items.filter((item) =>
    keys.some((key) => String(item[key]).toLowerCase().includes(lower))
  );
}

export interface ParentChild {
  id: string;
  name: string;
  studentId: string;
  className: string;
  sectionName: string;
  rollNumber: string;
  attendanceRate: number;
  gpa: number;
  photo?: string;
}

export const mockParentChildren: ParentChild[] = [
  {
    id: "student-1",
    name: "Rahim Ahmed 1",
    studentId: "STU-2025-0001",
    className: "Class 10",
    sectionName: "A",
    rollNumber: "01",
    attendanceRate: 94,
    gpa: 4.5,
  },
  {
    id: "student-2",
    name: "Fatima Begum 2",
    studentId: "STU-2025-0002",
    className: "Class 8",
    sectionName: "B",
    rollNumber: "02",
    attendanceRate: 91,
    gpa: 4.0,
  },
];

export const mockParentNotifications: Notification[] = [
  { id: "pn-1", title: "Fee Payment Due", message: "Monthly fee for Rahim Ahmed is due on June 30", type: "warning", read: false, createdAt: new Date().toISOString(), link: "/parent/dashboard/fees" },
  { id: "pn-2", title: "Mid-Term Results Published", message: "Exam results for Class 10 are now available", type: "success", read: false, createdAt: new Date(Date.now() - 86400000).toISOString(), link: "/parent/dashboard/results" },
  { id: "pn-3", title: "Parent-Teacher Meeting", message: "Scheduled for July 5, 2025 at 10:00 AM", type: "info", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "pn-4", title: "Absence Alert", message: "Rahim Ahmed was marked absent on May 28", type: "error", read: true, createdAt: new Date(Date.now() - 259200000).toISOString(), link: "/parent/dashboard/attendance" },
  { id: "pn-5", title: "Assignment Due", message: "Algebra Problem Set due tomorrow", type: "info", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
];

// ─── Teacher Dashboard Mock Data ──────────────────────────────────────────────
export interface TeacherClass {
  id: string;
  className: string;
  section: string;
  subject: string;
  room: string;
  studentCount: number;
  avgAttendance: number;
  avgScore: number;
}

export interface TeacherScheduleEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  className: string;
  subject: string;
  room: string;
  type: "class" | "exam" | "meeting";
}

export interface TeacherLeaveRecord {
  id: string;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: "approved" | "pending" | "rejected";
  reason: string;
}

export const mockTeacherClasses: TeacherClass[] = [
  { id: "tc-1", className: "Class 10", section: "A", subject: "Mathematics", room: "101", studentCount: 38, avgAttendance: 93, avgScore: 76 },
  { id: "tc-2", className: "Class 10", section: "B", subject: "Mathematics", room: "102", studentCount: 35, avgAttendance: 91, avgScore: 72 },
  { id: "tc-3", className: "Class 9", section: "A", subject: "Mathematics", room: "103", studentCount: 40, avgAttendance: 95, avgScore: 80 },
  { id: "tc-4", className: "Class 9", section: "B", subject: "Mathematics", room: "201", studentCount: 36, avgAttendance: 88, avgScore: 69 },
];

export const mockTeacherSchedule: TeacherScheduleEntry[] = [
  { id: "ts-1", day: "Sunday", startTime: "08:00", endTime: "08:45", className: "Class 10", subject: "Mathematics", room: "101", type: "class" },
  { id: "ts-2", day: "Sunday", startTime: "09:30", endTime: "10:15", className: "Class 9", subject: "Mathematics", room: "103", type: "class" },
  { id: "ts-3", day: "Sunday", startTime: "11:00", endTime: "11:45", className: "Class 10", subject: "Mathematics", room: "102", type: "class" },
  { id: "ts-4", day: "Monday", startTime: "08:00", endTime: "08:45", className: "Class 9", subject: "Mathematics", room: "201", type: "class" },
  { id: "ts-5", day: "Monday", startTime: "10:00", endTime: "11:00", className: "Class 10", subject: "Mid-Term Exam", room: "Exam Hall", type: "exam" },
  { id: "ts-6", day: "Tuesday", startTime: "08:00", endTime: "08:45", className: "Class 10", subject: "Mathematics", room: "101", type: "class" },
  { id: "ts-7", day: "Tuesday", startTime: "09:30", endTime: "10:15", className: "Class 9", subject: "Mathematics", room: "103", type: "class" },
  { id: "ts-8", day: "Wednesday", startTime: "08:00", endTime: "09:00", className: "Staff Meeting", subject: "Weekly Meeting", room: "Conference", type: "meeting" },
  { id: "ts-9", day: "Wednesday", startTime: "10:00", endTime: "10:45", className: "Class 10", subject: "Mathematics", room: "102", type: "class" },
  { id: "ts-10", day: "Thursday", startTime: "09:00", endTime: "09:45", className: "Class 9", subject: "Mathematics", room: "201", type: "class" },
];

export const mockTeacherLeave: TeacherLeaveRecord[] = [
  { id: "tl-1", type: "Casual Leave", fromDate: "2025-06-10", toDate: "2025-06-10", days: 1, status: "approved", reason: "Personal work" },
  { id: "tl-2", type: "Medical Leave", fromDate: "2025-05-15", toDate: "2025-05-17", days: 3, status: "approved", reason: "Medical appointment" },
  { id: "tl-3", type: "Casual Leave", fromDate: "2025-07-01", toDate: "2025-07-02", days: 2, status: "pending", reason: "Family function" },
];

export const mockTeacherStats = {
  totalClasses: 4,
  totalStudents: 149,
  pendingAssignments: 3,
  upcomingExams: 2,
  attendanceMarkedToday: true,
  leaveDaysUsed: 4,
  leaveDaysTotal: 20,
  avgClassScore: 74.3,
  thisMonthClasses: 48,
  totalNotices: 2,
};

export const mockTeacherPerformanceChart: ChartDataPoint[] = [
  { name: "Class 10A", score: 76, attendance: 93 },
  { name: "Class 10B", score: 72, attendance: 91 },
  { name: "Class 9A", score: 80, attendance: 95 },
  { name: "Class 9B", score: 69, attendance: 88 },
];

export const mockTeacherAttendanceChart: ChartDataPoint[] = [
  { name: "Jan", present: 22, absent: 0 },
  { name: "Feb", present: 19, absent: 1 },
  { name: "Mar", present: 21, absent: 1 },
  { name: "Apr", present: 20, absent: 2 },
  { name: "May", present: 18, absent: 3 },
  { name: "Jun", present: 10, absent: 0 },
];

// ─── Extended Teacher Performance Mock Data ───────────────────────────────────

export const mockTeacherMonthlyScoreTrend: ChartDataPoint[] = [
  { name: "Jan", classAvg: 71, schoolAvg: 69 },
  { name: "Feb", classAvg: 74, schoolAvg: 70 },
  { name: "Mar", classAvg: 72, schoolAvg: 71 },
  { name: "Apr", classAvg: 76, schoolAvg: 72 },
  { name: "May", classAvg: 78, schoolAvg: 73 },
  { name: "Jun", classAvg: 74, schoolAvg: 72 },
];

export const mockTeacherAssignmentCompletion: ChartDataPoint[] = [
  { name: "Jan", submitted: 88, total: 100 },
  { name: "Feb", submitted: 92, total: 100 },
  { name: "Mar", submitted: 85, total: 100 },
  { name: "Apr", submitted: 94, total: 100 },
  { name: "May", submitted: 91, total: 100 },
  { name: "Jun", submitted: 96, total: 100 },
];

export const mockTeacherSubjectBreakdown = [
  { subject: "Algebra", avgScore: 78, passRate: 94, totalStudents: 73 },
  { subject: "Geometry", avgScore: 71, passRate: 89, totalStudents: 73 },
  { subject: "Trigonometry", avgScore: 65, passRate: 82, totalStudents: 73 },
  { subject: "Statistics", avgScore: 80, passRate: 96, totalStudents: 73 },
  { subject: "Calculus", avgScore: 68, passRate: 85, totalStudents: 76 },
];

export const mockTeacherTopStudents = [
  { id: "s1", name: "Rahim Ahmed", class: "Class 10A", score: 95, attendance: 100, trend: "up" as const },
  { id: "s2", name: "Fatima Begum", class: "Class 9A", score: 92, attendance: 98, trend: "up" as const },
  { id: "s3", name: "Tanvir Islam", class: "Class 10B", score: 89, attendance: 95, trend: "stable" as const },
  { id: "s4", name: "Ayesha Rahman", class: "Class 9B", score: 87, attendance: 97, trend: "up" as const },
  { id: "s5", name: "Karim Hassan", class: "Class 10A", score: 85, attendance: 93, trend: "down" as const },
];

export const mockTeacherGoals = [
  { id: "g1", label: "Avg Class Score Target", current: 74.3, target: 80, unit: "%" },
  { id: "g2", label: "Attendance Rate Target", current: 91.8, target: 95, unit: "%" },
  { id: "g3", label: "Assignment Submission Rate", current: 91, target: 95, unit: "%" },
  { id: "g4", label: "Classes Conducted (Month)", current: 48, target: 52, unit: " classes" },
];

export interface TeacherRadarData {
  subject: string;
  score: number;
  fullMark: number;
}

export const mockTeacherSkillRadar: TeacherRadarData[] = [
  { subject: "Student Engagement", score: 82, fullMark: 100 },
  { subject: "Curriculum Coverage", score: 90, fullMark: 100 },
  { subject: "Assessment Quality", score: 75, fullMark: 100 },
  { subject: "Feedback Speed", score: 68, fullMark: 100 },
  { subject: "Attendance Rate", score: 94, fullMark: 100 },
  { subject: "Avg Class Score", score: 74, fullMark: 100 },
];

export const mockTeacherExamResults = [
  { exam: "CT-1", classAvg: 72, highest: 95, lowest: 41, passRate: 88 },
  { exam: "Mid-Term", classAvg: 74, highest: 97, lowest: 38, passRate: 91 },
  { exam: "CT-2", classAvg: 71, highest: 93, lowest: 39, passRate: 86 },
  { exam: "Final", classAvg: 76, highest: 98, lowest: 44, passRate: 93 },
];

// ─── Student Dashboard Mock Data ──────────────────────────────────────────────
export interface StudentSubjectResult {
  id: string;
  subject: string;
  classTest: number;
  midTerm: number;
  finalExam: number;
  total: number;
  grade: string;
  gpa: number;
  teacher: string;
}

export interface StudentTodayClass {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  status: "upcoming" | "ongoing" | "done";
}

export interface StudentHomework {
  id: string;
  subject: string;
  title: string;
  teacher: string;
  dueDate: string;
  submitted: boolean;
  marks?: number;
}

export const mockStudentProfile = {
  id: "STU-2025-0001",
  name: "Rahim Ahmed",
  rollNumber: "01",
  class: "Class 10",
  section: "A",
  group: "Science",
  shift: "Morning",
  admissionDate: "2023-01-15",
  bloodGroup: "A+",
  phone: "01712345678",
  email: "rahim@student.school.edu.bd",
  attendanceRate: 94.2,
  gpa: 4.5,
  rank: 3,
  totalStudents: 38,
};

export const mockStudentSubjectResults: StudentSubjectResult[] = [
  { id: "sr-1", subject: "Mathematics", classTest: 18, midTerm: 42, finalExam: 88, total: 88, grade: "A+", gpa: 5.0, teacher: "Mohammad Karim" },
  { id: "sr-2", subject: "English", classTest: 15, midTerm: 38, finalExam: 79, total: 79, grade: "A", gpa: 4.0, teacher: "Sharmin Akter" },
  { id: "sr-3", subject: "Physics", classTest: 17, midTerm: 40, finalExam: 83, total: 83, grade: "A+", gpa: 5.0, teacher: "Abdul Jabbar" },
  { id: "sr-4", subject: "Chemistry", classTest: 14, midTerm: 36, finalExam: 75, total: 75, grade: "A", gpa: 4.0, teacher: "Nusrat Jahan" },
  { id: "sr-5", subject: "Biology", classTest: 16, midTerm: 39, finalExam: 81, total: 81, grade: "A+", gpa: 5.0, teacher: "Imran Hossain" },
  { id: "sr-6", subject: "ICT", classTest: 19, midTerm: 44, finalExam: 91, total: 91, grade: "A+", gpa: 5.0, teacher: "Farhan Uddin" },
];

export const mockStudentTodayClasses: StudentTodayClass[] = [
  { id: "stc-1", time: "08:00 – 08:45", subject: "Mathematics", teacher: "Mohammad Karim", room: "101", status: "done" },
  { id: "stc-2", time: "08:45 – 09:30", subject: "English", teacher: "Sharmin Akter", room: "101", status: "done" },
  { id: "stc-3", time: "09:45 – 10:30", subject: "Physics", teacher: "Abdul Jabbar", room: "Lab 1", status: "ongoing" },
  { id: "stc-4", time: "10:30 – 11:15", subject: "Chemistry", teacher: "Nusrat Jahan", room: "Lab 2", status: "upcoming" },
  { id: "stc-5", time: "11:30 – 12:15", subject: "Biology", teacher: "Imran Hossain", room: "102", status: "upcoming" },
];

export const mockStudentHomework: StudentHomework[] = [
  { id: "sh-1", subject: "Mathematics", title: "Algebra Problem Set (Ch. 5)", teacher: "Mohammad Karim", dueDate: "2025-06-15", submitted: false },
  { id: "sh-2", subject: "English", title: "Essay: Climate Change (500 words)", teacher: "Sharmin Akter", dueDate: "2025-06-20", submitted: true, marks: 14 },
  { id: "sh-3", subject: "Physics", title: "Lab Report: Optics Experiment", teacher: "Abdul Jabbar", dueDate: "2025-06-18", submitted: false },
  { id: "sh-4", subject: "Chemistry", title: "Periodic Table Quiz Prep", teacher: "Nusrat Jahan", dueDate: "2025-06-12", submitted: true, marks: 18 },
];

export const mockStudentAttendanceChart: ChartDataPoint[] = [
  { name: "Jan", present: 22, absent: 0, late: 0 },
  { name: "Feb", present: 18, absent: 1, late: 1 },
  { name: "Mar", present: 20, absent: 1, late: 1 },
  { name: "Apr", present: 21, absent: 0, late: 1 },
  { name: "May", present: 19, absent: 2, late: 0 },
  { name: "Jun", present: 10, absent: 0, late: 0 },
];

export const mockStudentGpaChart: ChartDataPoint[] = [
  { name: "CT-1", gpa: 4.2 },
  { name: "CT-2", gpa: 4.5 },
  { name: "Mid Term", gpa: 4.3 },
  { name: "CT-3", gpa: 4.7 },
  { name: "CT-4", gpa: 4.5 },
  { name: "Final", gpa: 4.75 },
];

export const mockStudentUpcomingExams = [
  { id: "sue-1", name: "Final Examination", subject: "Mathematics", date: "2025-07-01", time: "09:00 AM", room: "Exam Hall A", totalMarks: 100 },
  { id: "sue-2", name: "Final Examination", subject: "Physics", date: "2025-07-03", time: "09:00 AM", room: "Exam Hall B", totalMarks: 100 },
  { id: "sue-3", name: "Final Examination", subject: "English", date: "2025-07-05", time: "09:00 AM", room: "Exam Hall A", totalMarks: 100 },
];

export const mockStudentNotices = [
  { id: "sn-1", title: "Annual Sports Day 2025", date: "2025-06-01", priority: "high" as const, author: "Principal" },
  { id: "sn-2", title: "Final Exam Schedule Released", date: "2025-05-28", priority: "urgent" as const, author: "Exam Controller" },
  { id: "sn-3", title: "Library Book Return Reminder", date: "2025-06-05", priority: "medium" as const, author: "Librarian" },
];

// ─── Library Module Mock Data ─────────────────────────────────────────────────

export const mockLibrarianStats: LibrarianDashboardStats = {
  totalBooks: 1240,
  availableBooks: 892,
  issuedBooks: 348,
  overdueBooks: 23,
  activeMembers: 456,
  pendingFines: 8750,
};

export const mockBookIssues: BookIssue[] = [
  {
    id: "issue-1",
    bookId: "book-1",
    bookTitle: "Advanced Mathematics",
    memberId: "student-1",
    memberName: "Rahim Ahmed",
    memberType: "student",
    issueDate: "2025-05-15",
    returnDate: "2025-06-15",
    status: "issued",
  },
  {
    id: "issue-2",
    bookId: "book-2",
    bookTitle: "English Grammar",
    memberId: "student-2",
    memberName: "Fatima Begum",
    memberType: "student",
    issueDate: "2025-04-20",
    returnDate: "2025-05-20",
    status: "overdue",
    fineAmount: 150,
  },
  {
    id: "issue-3",
    bookId: "book-3",
    bookTitle: "Physics for HSC",
    memberId: "teacher-1",
    memberName: "Mohammad Karim",
    memberType: "teacher",
    issueDate: "2025-05-01",
    returnDate: "2025-06-01",
    actualReturnDate: "2025-06-02",
    status: "returned",
    fineAmount: 50,
  },
];

export const mockLibraryMembers: LibraryMember[] = [
  {
    id: "student-1",
    name: "Rahim Ahmed",
    memberType: "student",
    cardNumber: "LC-2025-0001",
    email: "student@school.edu.bd",
    phone: "01712345678",
    classOrDept: "Class 10 - A",
    booksIssued: 2,
    totalFines: 0,
    status: "active",
  },
  {
    id: "student-2",
    name: "Fatima Begum",
    memberType: "student",
    cardNumber: "LC-2025-0002",
    email: "fatima@school.edu.bd",
    phone: "01812345678",
    classOrDept: "Class 8 - B",
    booksIssued: 1,
    totalFines: 150,
    status: "active",
  },
  {
    id: "teacher-1",
    name: "Mohammad Karim",
    memberType: "teacher",
    cardNumber: "LC-2025-T001",
    email: "teacher@school.edu.bd",
    phone: "01912345678",
    classOrDept: "Mathematics Dept.",
    booksIssued: 0,
    totalFines: 0,
    status: "active",
  },
];

export const mockLibraryFines: LibraryFine[] = [
  {
    id: "fine-1",
    memberId: "student-2",
    memberName: "Fatima Begum",
    bookTitle: "English Grammar",
    issueId: "issue-2",
    amount: 150,
    reason: "Late return (5 days)",
    status: "unpaid",
    createdAt: "2025-05-25",
  },
  {
    id: "fine-2",
    memberId: "teacher-1",
    memberName: "Mohammad Karim",
    bookTitle: "Physics for HSC",
    issueId: "issue-3",
    amount: 50,
    reason: "Late return (1 day)",
    status: "paid",
    createdAt: "2025-06-02",
    paidAt: "2025-06-03",
  },
];

// ─── Extended Mock Data for Teacher Dashboard ───────────────────────────────

export interface LessonPlan {
  id: string;
  classId: string;
  className: string;
  subject: string;
  topic: string;
  date: string;
  objectives: string[];
  status: "pending" | "in_progress" | "completed";
}

export const mockLessonPlans: LessonPlan[] = [
  {
    id: "lp-1",
    classId: "class-10",
    className: "Class 10A",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    date: "2025-06-12",
    objectives: ["Understand standard form", "Solve using formula", "Graphing parabolas"],
    status: "in_progress"
  },
  {
    id: "lp-2",
    classId: "class-9",
    className: "Class 9B",
    subject: "Mathematics",
    topic: "Introduction to Trigonometry",
    date: "2025-06-14",
    objectives: ["Sine, Cosine, Tangent", "Right-angled triangles", "Basic identities"],
    status: "pending"
  },
  {
    id: "lp-3",
    classId: "class-10",
    className: "Class 10B",
    subject: "Mathematics",
    topic: "Linear Equations",
    date: "2025-06-08",
    objectives: ["Graphing lines", "Substitution method", "Elimination method"],
    status: "completed"
  }
];

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "doc";
  size: string;
  subject: string;
  className: string;
  uploadDate: string;
  downloads: number;
}

export const mockStudyMaterials: StudyMaterial[] = [
  {
    id: "sm-1",
    title: "Algebra Formulas Cheat Sheet",
    description: "Quick reference guide for all essential algebra formulas.",
    type: "pdf",
    size: "2.4 MB",
    subject: "Mathematics",
    className: "Class 10",
    uploadDate: "2025-06-01",
    downloads: 145
  },
  {
    id: "sm-2",
    title: "Trigonometry Basics Tutorial",
    description: "Recorded lecture explaining the basics of SOH CAH TOA.",
    type: "video",
    size: "156 MB",
    subject: "Mathematics",
    className: "Class 9",
    uploadDate: "2025-06-03",
    downloads: 89
  },
  {
    id: "sm-3",
    title: "Practice Worksheet: Geometry",
    description: "50 practice questions on circles and triangles.",
    type: "doc",
    size: "1.1 MB",
    subject: "Mathematics",
    className: "Class 10",
    uploadDate: "2025-06-05",
    downloads: 42
  }
];

export interface Message {
  id: string;
  sender: string;
  role: "student" | "parent" | "teacher" | "admin";
  avatar?: string;
  content: string;
  timestamp: string;
  unread: boolean;
}

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    sender: "Rahim Ahmed",
    role: "student",
    content: "Sir, I didn't quite understand the third step in today's algebra problem. Could you explain it again tomorrow?",
    timestamp: "10:30 AM",
    unread: true
  },
  {
    id: "msg-2",
    sender: "Mrs. Rahman",
    role: "parent",
    content: "Thank you for the update on Ayesha's progress. We will make sure she finishes the assignment this weekend.",
    timestamp: "Yesterday",
    unread: true
  },
  {
    id: "msg-3",
    sender: "Principal's Office",
    role: "admin",
    content: "Reminder: The monthly faculty meeting is scheduled for this Friday at 3:00 PM in the main hall.",
    timestamp: "Jun 02",
    unread: false
  },
  {
    id: "msg-4",
    sender: "Tanvir Islam",
    role: "student",
    content: "I have submitted the worksheet on the portal. Please let me know if there are any issues.",
    timestamp: "May 28",
    unread: false
  }
];
