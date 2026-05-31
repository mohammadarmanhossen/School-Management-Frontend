export type UserRole =
  | "super_admin"
  | "school_admin"
  | "teacher"
  | "student"
  | "parent";

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

export type AttendanceStatus = "present" | "absent" | "late" | "leave";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  status: AttendanceStatus;
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
  content: string;
  author: string;
  targetRoles: UserRole[];
  attachments?: string[];
  publishDate: string;
  expiryDate?: string;
  status: "draft" | "scheduled" | "published" | "expired";
  priority: "low" | "medium" | "high" | "urgent";
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
  teacherName: string;
  className: string;
  room?: string;
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
}
