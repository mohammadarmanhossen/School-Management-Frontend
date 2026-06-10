import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["school_admin", "teacher", "student", "parent"]),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const studentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  fullName: z.string().min(2, "Full name is required"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().min(1, "Section is required"),
  parentName: z.string().min(2, "Parent name is required"),
  parentPhone: z.string().min(10, "Parent phone is required"),
  parentEmail: z.string().email().optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "graduated", "transferred"]).default("active"),
});

export const teacherSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  fullName: z.string().min(2, "Full name is required"),
  gender: z.enum(["male", "female", "other"]),
  qualification: z.string().min(2, "Qualification is required"),
  specialization: z.string().min(2, "Specialization is required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Invalid email"),
  salary: z.coerce.number().min(0, "Salary must be positive"),
  joiningDate: z.string().min(1, "Joining date is required"),
  address: z.string().min(5, "Address is required"),
  subjectIds: z.array(z.string()).optional(),
});

export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  grade: z.coerce.number().min(1, "Grade must be between 1 and 12").max(12, "Grade must be between 1 and 12"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  teacherId: z.string().optional(),
  academicYear: z.string().min(4, "Academic year is required"),
});

export const subjectSchema = z.object({
  code: z.string().min(2, "Subject code is required"),
  name: z.string().min(2, "Subject name is required"),
  credits: z.coerce.number().min(1).max(10),
  teacherId: z.string().optional(),
  classId: z.string().optional(),
});

export const examSchema = z.object({
  name: z.string().min(2, "Exam name is required"),
  type: z.enum(["class_test", "mid_term", "final_exam", "practical"]),
  classId: z.string().min(1, "Class is required"),
  subjectId: z.string().min(1, "Subject is required"),
  examDate: z.string().min(1, "Exam date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  totalMarks: z.coerce.number().min(1),
  passMarks: z.coerce.number().min(0),
});

export const noticeSchema = z.object({
  title: z.string().min(3, "Title is required"),
  shortSummary: z.string().optional(),
  content: z.string().min(10, "Content is required"),
  category: z.enum(["Student", "Teacher", "Parent", "Academic", "Exam", "Assignment", "Meeting", "Event", "Emergency", "Holiday", "General", "Fee", "Library", "Transport", "Training", "Administration"]).default("General"),
  targetAudience: z.array(z.string()).min(1, "Select at least one target audience"),
  targetRoles: z
    .array(z.enum(["school_admin", "teacher", "student", "parent", "librarian"]))
    .optional(),
  tags: z.array(z.string()).optional(),
  publishDate: z.string().min(1, "Publish date is required"),
  expiryDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["published", "draft", "scheduled", "archived", "expired"]).default("published"),
  isPinned: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  attachments: z.any().optional(),
});

export const feeSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["paid", "partial", "pending", "overdue"]).default("pending"),
});

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(2, "Registration number is required"),
  model: z.string().min(2, "Model is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  driverName: z.string().min(2, "Driver name is required"),
  driverPhone: z.string().min(10, "Valid phone number required"),
  routeName: z.string().min(2, "Route name is required"),
  status: z.enum(["active", "maintenance", "inactive"]).default("active"),
});

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  classId: z.string().min(1, "Class is required"),
  subjectId: z.string().min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["published", "draft", "closed"]).default("published"),
});

export const bookSchema = z.object({
  title: z.string().min(2, "Title is required"),
  author: z.string().min(2, "Author is required"),
  isbn: z.string().min(5, "Valid ISBN is required"),
  category: z.string().min(2, "Category is required"),
  totalCopies: z.coerce.number().min(1, "Total copies must be at least 1"),
  barcode: z.string().min(2, "Barcode is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
export type TeacherFormData = z.infer<typeof teacherSchema>;
export type ClassFormData = z.infer<typeof classSchema>;
export type SubjectFormData = z.infer<typeof subjectSchema>;
export type ExamFormData = z.infer<typeof examSchema>;
export type NoticeFormData = z.infer<typeof noticeSchema>;
export type FeeFormData = z.infer<typeof feeSchema>;
export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type AssignmentFormData = z.infer<typeof assignmentSchema>;
export type BookFormData = z.infer<typeof bookSchema>;

export const studentAdmissionApplySchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { message: "Please select gender" }),
  class_name: z.string().min(1, "Class is required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
});

export const teacherApplySchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  qualification: z.string().min(2, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  subject: z.string().min(2, "Subject specialization is required"),
});

export type StudentAdmissionApplyFormData = z.infer<typeof studentAdmissionApplySchema>;
export type TeacherApplyFormData = z.infer<typeof teacherApplySchema>;



