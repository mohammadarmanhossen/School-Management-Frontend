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
