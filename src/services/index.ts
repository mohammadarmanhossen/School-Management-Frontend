import { api } from "./api-client";
import type {
  LoginResponse,
  User,
  PaginatedResponse,
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
  SchoolSettings,
} from "@/types";
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
  StudentFormData,
  TeacherFormData,
  ClassFormData,
  SubjectFormData,
  ExamFormData,
  NoticeFormData,
  FeeFormData,
  StudentAdmissionApplyFormData,
  TeacherApplyFormData,
} from "@/schemas";

export const authService = {
  login: (data: LoginFormData) =>
    api.post<LoginResponse>("/auth/login/", data).then((r) => r.data),
  register: (data: RegisterFormData) =>
    api.post<{ message: string }>("/auth/register/", data).then((r) => r.data),
  logout: (refresh: string) =>
    api.post("/auth/logout/", { refresh }).then((r) => r.data),
  refresh: (refresh: string) =>
    api.post<{ access: string }>("/auth/refresh/", { refresh }).then((r) => r.data),
  me: () => api.get<User>("/auth/me/").then((r) => r.data),
  forgotPassword: (data: ForgotPasswordFormData) =>
    api.post("/auth/forgot-password/", data).then((r) => r.data),
  resetPassword: (data: ResetPasswordFormData) =>
    api.post("/auth/reset-password/", data).then((r) => r.data),
  changePassword: (data: ChangePasswordFormData) =>
    api.post("/auth/change-password/", data).then((r) => r.data),
  verifyEmail: (token: string) =>
    api.post("/auth/verify-email/", { token }).then((r) => r.data),
};

export const dashboardService = {
  getStats: () => api.get<DashboardStats>("/dashboard/stats/").then((r) => r.data),
  getAdminDashboard: () =>
    api.get<import("@/types").AdminDashboardStats>("/dashboard/admin/").then((r) => r.data),
  getTeacherDashboard: () =>
    api.get<import("@/types").TeacherDashboardStats>("/dashboard/teacher/").then((r) => r.data),
  getStudentDashboard: () =>
    api.get<import("@/types").StudentDashboardStats>("/dashboard/student/").then((r) => r.data),
  getParentDashboard: () =>
    api.get<import("@/types").ParentDashboardStats>("/dashboard/parent/").then((r) => r.data),
  getLibrarianDashboard: () =>
    api.get<import("@/types").LibrarianDashboardStats>("/dashboard/librarian/").then((r) => r.data),
  getAttendanceChart: () =>
    api.get<ChartDataPoint[]>("/dashboard/charts/attendance/").then((r) => r.data),
  getRevenueChart: () =>
    api.get<ChartDataPoint[]>("/dashboard/charts/revenue/").then((r) => r.data),
  getStudentGrowthChart: () =>
    api.get<ChartDataPoint[]>("/dashboard/charts/student-growth/").then((r) => r.data),
  getExamPerformanceChart: () =>
    api.get<ChartDataPoint[]>("/dashboard/charts/exam-performance/").then((r) => r.data),
};

export const studentService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Student>>("/students/", { params }).then((r) => r.data),
  getById: (id: string) => api.get<Student>(`/students/${id}/`).then((r) => r.data),
  create: (data: StudentFormData) =>
    api.post<Student>("/students/", data).then((r) => r.data),
  update: (id: string, data: Partial<StudentFormData>) =>
    api.patch<Student>(`/students/${id}/`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/students/${id}/`).then((r) => r.data),
  bulkDelete: (ids: string[]) =>
    api.post("/students/bulk-delete/", { ids }).then((r) => r.data),
  export: (format: "csv" | "excel", params?: Record<string, unknown>) =>
    api.get(`/students/export/`, { params: { ...params, format }, responseType: "blob" }),
};

export const teacherService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Teacher>>("/teachers/", { params }).then((r) => r.data),
  getById: (id: string) => api.get<Teacher>(`/teachers/${id}/`).then((r) => r.data),
  create: (data: TeacherFormData) =>
    api.post<Teacher>("/teachers/", data).then((r) => r.data),
  update: (id: string, data: Partial<TeacherFormData>) =>
    api.patch<Teacher>(`/teachers/${id}/`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/teachers/${id}/`).then((r) => r.data),
};

export const classService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<ClassRoom>>("/classes/", { params }).then((r) => r.data),
  getById: (id: string) => api.get<ClassRoom>(`/classes/${id}/`).then((r) => r.data),
  getSections: (classId?: string) =>
    api
      .get<PaginatedResponse<Section>>("/sections/", { params: { class: classId } })
      .then((r) => r.data),
  create: (data: ClassFormData) =>
    api.post<ClassRoom>("/classes/", data).then((r) => r.data),
  update: (id: string, data: Partial<ClassFormData>) =>
    api.patch<ClassRoom>(`/classes/${id}/`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/classes/${id}/`).then((r) => r.data),
};

export const subjectService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Subject>>("/subjects/", { params }).then((r) => r.data),
  create: (data: SubjectFormData) =>
    api.post<Subject>("/subjects/", data).then((r) => r.data),
  update: (id: string, data: Partial<SubjectFormData>) =>
    api.patch<Subject>(`/subjects/${id}/`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/subjects/${id}/`).then((r) => r.data),
};

export const attendanceService = {
  getDaily: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<AttendanceRecord>>("/attendance/", { params })
      .then((r) => r.data),
  mark: (data: { studentId: string; date: string; status: string; classId: string }) =>
    api.post("/attendance/", data).then((r) => r.data),
  bulkMark: (records: Array<{ studentId: string; status: string }>, date: string, classId: string) =>
    api.post("/attendance/bulk/", { records, date, classId }).then((r) => r.data),
  getMonthlyReport: (params?: Record<string, unknown>) =>
    api.get("/attendance/monthly-report/", { params }).then((r) => r.data),
};

export const examService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Exam>>("/exams/", { params }).then((r) => r.data),
  getById: (id: string) => api.get<Exam>(`/exams/${id}/`).then((r) => r.data),
  create: (data: ExamFormData) => api.post<Exam>("/exams/", data).then((r) => r.data),
  update: (id: string, data: Partial<ExamFormData>) =>
    api.patch<Exam>(`/exams/${id}/`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/exams/${id}/`).then((r) => r.data),
};

export const resultService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<ExamResult>>("/results/", { params }).then((r) => r.data),
  publish: (examId: string) =>
    api.post(`/results/publish/`, { examId }).then((r) => r.data),
};

export const assignmentService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Assignment>>("/assignments/", { params }).then((r) => r.data),
  create: (data: FormData) =>
    api.post<Assignment>("/assignments/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),
};

export const feeService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Fee>>("/fees/", { params }).then((r) => r.data),
  create: (data: FeeFormData) => api.post<Fee>("/fees/", data).then((r) => r.data),
  collect: (id: string, data: { amount: number; method: string }) =>
    api.post(`/fees/${id}/collect/`, data).then((r) => r.data),
};

export const noticeService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Notice>>("/notices/", { params }).then((r) => r.data),
  create: (data: NoticeFormData) =>
    api.post<Notice>("/notices/", data).then((r) => r.data),
  update: (id: string, data: Partial<NoticeFormData>) =>
    api.patch<Notice>(`/notices/${id}/`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/notices/${id}/`).then((r) => r.data),
};

export const libraryService = {
  getDashboard: () =>
    api.get<import("@/types").LibrarianDashboardStats>("/dashboard/librarian/").then((r) => r.data),
  getBooks: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Book>>("/library/books/", { params }).then((r) => r.data),
  getBook: (id: string) => api.get<Book>(`/library/books/${id}/`).then((r) => r.data),
  createBook: (data: Omit<Book, "id">) =>
    api.post<Book>("/library/books/", data).then((r) => r.data),
  updateBook: (id: string, data: Partial<Book>) =>
    api.patch<Book>(`/library/books/${id}/`, data).then((r) => r.data),
  deleteBook: (id: string) => api.delete(`/library/books/${id}/`).then((r) => r.data),
  getIssues: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<import("@/types").BookIssue>>("/library/issue/", { params }).then((r) => r.data),
  issueBook: (data: {
    bookId: string;
    memberId: string;
    memberType: "student" | "teacher";
    issueDate: string;
    returnDate: string;
  }) => api.post("/library/issue/", data).then((r) => r.data),
  returnBook: (issueId: string, data?: { actualReturnDate?: string }) =>
    api.post(`/library/return/${issueId}/`, data).then((r) => r.data),
  getMembers: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<import("@/types").LibraryMember>>("/library/members/", { params }).then((r) => r.data),
  getFines: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<import("@/types").LibraryFine>>("/library/fines/", { params }).then((r) => r.data),
  payFine: (id: string) => api.post(`/library/fines/${id}/pay/`).then((r) => r.data),
};

export const transportService = {
  getVehicles: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Vehicle>>("/transport/vehicles/", { params }).then((r) => r.data),
};

export const timetableService = {
  getWeekly: (params?: Record<string, unknown>) =>
    api.get<TimetableEntry[]>("/timetable/", { params }).then((r) => r.data),
};

export const notificationService = {
  getAll: () => api.get<Notification[]>("/notifications/").then((r) => r.data),
  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read/`).then((r) => r.data),
  markAllAsRead: () => api.post("/notifications/read-all/").then((r) => r.data),
};

export const settingsService = {
  getSchool: () => api.get<SchoolSettings>("/settings/school/").then((r) => r.data),
  updateSchool: (data: Partial<SchoolSettings>) =>
    api.patch<SchoolSettings>("/settings/school/", data).then((r) => r.data),
  updateProfile: (data: Partial<User>) =>
    api.patch<User>("/settings/profile/", data).then((r) => r.data),
};

export const applicationService = {
  submitStudentAdmission: (data: StudentAdmissionApplyFormData) =>
    api.post<{ message: string }>("/admissions/", data).then((r) => r.data),
  submitTeacherApplication: (data: TeacherApplyFormData) =>
    api.post<{ message: string }>("/teacher-applications/", data).then((r) => r.data),
  getStudentAdmissions: () =>
    api
      .get<import("@/types").PaginatedResponse<import("@/types").StudentAdmissionRequest>>(
        "/admissions/"
      )
      .then((r) => r.data),
  getTeacherApplications: () =>
    api
      .get<import("@/types").PaginatedResponse<import("@/types").TeacherApplicationRequest>>(
        "/teacher-applications/"
      )
      .then((r) => r.data),
  reviewStudentAdmission: (
    id: string,
    data: { status: "accepted" | "rejected"; reviewNote?: string }
  ) =>
    api
      .patch<import("@/types").StudentAdmissionRequest>(`/admissions/${id}/`, data)
      .then((r) => r.data),
  reviewTeacherApplication: (
    id: string,
    data: { status: "accepted" | "rejected"; reviewNote?: string }
  ) =>
    api
      .patch<import("@/types").TeacherApplicationRequest>(`/teacher-applications/${id}/`, data)
      .then((r) => r.data),
};

export { menuService, getDemoMenus } from "./menu-service";
