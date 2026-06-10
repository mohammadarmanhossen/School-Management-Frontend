export interface StudentHomework {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: string;
  assignedDate: string;
  totalMarks: number;
  obtainedMarks?: number;
  status: "pending" | "submitted" | "reviewed" | "overdue";
  priority: "high" | "medium" | "low";
  description: string;
  feedback?: string;
  submittedDate?: string;
}

export const mockStudentHomework: StudentHomework[] = [
  {
    id: "hw-1",
    title: "Algebra Equations Worksheet",
    subject: "Mathematics",
    teacher: "Mohammad Karim",
    dueDate: "2026-06-12T23:59:00Z",
    assignedDate: "2026-06-08T09:00:00Z",
    totalMarks: 50,
    status: "pending",
    priority: "high",
    description: "Complete all 20 algebraic equations on page 45 of the textbook. Show all your working steps clearly.",
  },
  {
    id: "hw-2",
    title: "Photosynthesis Essay",
    subject: "Science",
    teacher: "Sarah Johnson",
    dueDate: "2026-06-15T17:00:00Z",
    assignedDate: "2026-06-05T10:00:00Z",
    totalMarks: 100,
    status: "submitted",
    priority: "medium",
    description: "Write a 500-word essay explaining the process of photosynthesis, including the light-dependent and light-independent reactions.",
    submittedDate: "2026-06-09T14:30:00Z"
  },
  {
    id: "hw-3",
    title: "World War II Timeline",
    subject: "History",
    teacher: "David Smith",
    dueDate: "2026-06-01T23:59:00Z",
    assignedDate: "2026-05-25T08:00:00Z",
    totalMarks: 30,
    obtainedMarks: 28,
    status: "reviewed",
    priority: "medium",
    description: "Create a visual timeline of the major events during WWII from 1939 to 1945.",
    submittedDate: "2026-05-30T16:00:00Z",
    feedback: "Excellent visual representation! Next time, try to include a bit more detail on the Pacific theater."
  },
  {
    id: "hw-4",
    title: "Programming Logic Practice",
    subject: "Computer Science",
    teacher: "Alex Wong",
    dueDate: "2026-06-05T23:59:00Z",
    assignedDate: "2026-06-01T10:00:00Z",
    totalMarks: 50,
    status: "overdue",
    priority: "high",
    description: "Complete the 5 coding challenges on the school coding platform regarding loops and conditionals."
  },
  {
    id: "hw-5",
    title: "Poetry Analysis",
    subject: "English",
    teacher: "Emily White",
    dueDate: "2026-06-20T23:59:00Z",
    assignedDate: "2026-06-10T09:00:00Z",
    totalMarks: 40,
    status: "pending",
    priority: "low",
    description: "Analyze the use of imagery and metaphor in Robert Frost's 'The Road Not Taken'."
  }
];

export const mockHomeworkAnalytics = {
  completionRate: 75,
  subjectPerformance: [
    { subject: "Mathematics", score: 85 },
    { subject: "Science", score: 92 },
    { subject: "English", score: 78 },
    { subject: "History", score: 95 },
    { subject: "Computer Science", score: 88 }
  ],
  monthlyTrend: [
    { month: "Jan", submitted: 15, overdue: 2 },
    { month: "Feb", submitted: 18, overdue: 1 },
    { month: "Mar", submitted: 20, overdue: 0 },
    { month: "Apr", submitted: 17, overdue: 3 },
    { month: "May", submitted: 22, overdue: 1 },
    { month: "Jun", submitted: 12, overdue: 2 }
  ]
};
