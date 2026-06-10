export type UserRole =
  | "school_admin"
  | "teacher"
  | "student"
  | "parent"
  | "librarian";

export type ApiRole =
  | "ADMIN"
  | "TEACHER"
  | "STUDENT"
  | "PARENT"
  | "LIBRARIAN";

export interface MenuItem {
  label: string;
  path: string;
  icon?: string;
}

export interface MenuResponse {
  role: ApiRole | UserRole;
  menus: MenuItem[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  schoolId?: string;
  schoolName?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface Student {
  id: string;
  studentId: string;
  rollNumber: string;
  fullName: string;
  photo?: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  bloodGroup?: string;
  email: string;
  phone: string;
  address: string;
  admissionDate: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  status: "active" | "inactive" | "graduated" | "transferred";
  createdAt: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  fullName: string;
  photo?: string;
  gender: "male" | "female" | "other";
  qualification: string;
  specialization: string;
  phone: string;
  email: string;
  salary: number;
  joiningDate: string;
  address: string;
  subjects: string[];
  status: "active" | "inactive" | "on_leave";
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: number;
  capacity: number;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  academicYear: string;
}

export interface Section {
  id: string;
  name: string;
  classId: string;
  className: string;
  capacity: number;
  studentCount: number;
}

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface StudentAdmissionRequest {
  id: string;
  full_name: string;
  dob: string;
  gender: "male" | "female" | "other";
  class_name: string;
  phone: string;
  address: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface TeacherApplicationRequest {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  experience: string;
  subject: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  teacherId?: string;
  teacherName?: string;
  classId?: string;
  className?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "leave" | "half_day" | "excused";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  photo?: string;
  rollNumber: string;
  classId: string;
  className: string;
  sectionName?: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export type ExamType = "class_test" | "mid_term" | "final_exam" | "practical";

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passMarks: number;
  status: "scheduled" | "ongoing" | "completed" | "published";
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  examName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  gpa: number;
  position?: number;
  remarks?: string;
  className: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  maxMarks: number;
  attachments?: string[];
  submissionCount: number;
  totalStudents: number;
  status: "draft" | "published" | "closed";
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  category: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: "pending" | "partial" | "paid" | "overdue";
  paymentMethod?: string;
  invoiceNumber?: string;
}

export interface Notice {
  id: string;
  title: string;
  shortSummary?: string;
  content: string;
  category: "Student" | "Teacher" | "Parent" | "Academic" | "Exam" | "Assignment" | "Meeting" | "Event" | "Emergency" | "Holiday" | "General" | "Fee" | "Library" | "Transport" | "Training" | "Administration";
  author: string;
  targetAudience: string[]; // e.g., ["All Students", "Specific Class", "Specific Section", "All Teachers", "Specific Teachers", "All Parents", "Library Staff", "Transport Staff", "All Users"]
  targetRoles: UserRole[]; // keeping this for backward compatibility
  attachments?: string[];
  tags?: string[];
  publishDate: string;
  expiryDate?: string;
  status: "draft" | "scheduled" | "published" | "expired" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  isPinned?: boolean;
  isFeatured?: boolean;
  isSaved?: boolean; // Gmail-style save for later
  isRead?: boolean;  // Gmail-style read status
  views?: number;
  readPercentage?: number;
  readCount?: number;
  unreadCount?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  monthlyAttendance: number;
  monthlyFeeCollection: number;
  upcomingExams: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  barcode?: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  memberType: "student" | "teacher";
  issueDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: "issued" | "returned" | "overdue";
  fineAmount?: number;
}

export interface LibraryMember {
  id: string;
  name: string;
  memberType: "student" | "teacher";
  cardNumber: string;
  email: string;
  phone: string;
  classOrDept: string;
  booksIssued: number;
  totalFines: number;
  status: "active" | "suspended";
}

export interface LibraryFine {
  id: string;
  memberId: string;
  memberName: string;
  bookTitle: string;
  issueId: string;
  amount: number;
  reason: string;
  status: "paid" | "unpaid";
  createdAt: string;
  paidAt?: string;
}

export interface LibrarianDashboardStats {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  overdueBooks: number;
  activeMembers: number;
  pendingFines: number;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  revenue: number;
  attendance: number;
  reports: number;
}

export interface TeacherDashboardStats {
  totalClasses: number;
  attendanceRate: number;
  pendingMarks: number;
  activeAssignments: number;
}

export interface StudentDashboardStats {
  attendanceRate: number;
  gpa: number;
  pendingAssignments: number;
  pendingFees: number;
  borrowedBooks: number;
}

export interface ParentDashboardStats {
  childrenCount: number;
  attendanceRate: number;
  pendingFees: number;
  unreadNotifications: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  routeName: string;
  status: "active" | "maintenance" | "inactive";
}

export interface TimetableEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  subjectCode?: string;
  teacherName: string;
  teacherId?: string;
  className: string;
  sectionName?: string;
  room?: string;
  type?: "Lecture" | "Lab" | "Practical" | "Break";
  color?: string;
}

export interface SchoolSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  website?: string;
  academicYear: string;
  timezone: string;
  language: "en" | "bn";
  principalName?: string;
  establishedYear?: string;
  schoolCode?: string;
  currency?: string;
  dateFormat?: string;
  theme?: "light" | "dark" | "system";
}


