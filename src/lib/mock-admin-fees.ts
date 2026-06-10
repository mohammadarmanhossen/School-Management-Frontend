export type FeeStatus = "paid" | "pending" | "overdue";

export interface AdminFeeInvoice {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  category: "Tuition Fee" | "Transport Fee" | "Library Fine" | "Exam Fee" | "Hostel Fee";
  amount: number;
  dueDate: string;
  status: FeeStatus;
  paidDate?: string;
}

export const mockAdminFeeAnalytics = {
  totalRevenue: 2450000,
  totalOutstanding: 450000,
  collectionRate: 84.5,
  pendingInvoicesCount: 145,
  revenueByCategory: [
    { name: "Tuition Fee", value: 1800000 },
    { name: "Transport Fee", value: 350000 },
    { name: "Hostel Fee", value: 200000 },
    { name: "Library Fine", value: 50000 },
    { name: "Exam Fee", value: 50000 },
  ],
  monthlyTrend: [
    { month: "Jan", collected: 400000, pending: 50000 },
    { month: "Feb", collected: 380000, pending: 60000 },
    { month: "Mar", collected: 420000, pending: 40000 },
    { month: "Apr", collected: 350000, pending: 100000 },
    { month: "May", collected: 450000, pending: 50000 },
    { month: "Jun", collected: 450000, pending: 150000 },
  ]
};

export const mockAdminFeeInvoices: AdminFeeInvoice[] = [
  {
    id: "INV-2026-001",
    studentName: "Aarav Sharma",
    studentId: "STU-2023-001",
    class: "Grade 10",
    category: "Tuition Fee",
    amount: 15000,
    dueDate: "2026-06-05T23:59:00Z",
    status: "paid",
    paidDate: "2026-06-02T10:30:00Z"
  },
  {
    id: "INV-2026-002",
    studentName: "Priya Patel",
    studentId: "STU-2023-045",
    class: "Grade 10",
    category: "Transport Fee",
    amount: 3500,
    dueDate: "2026-06-15T23:59:00Z",
    status: "pending"
  },
  {
    id: "INV-2026-003",
    studentName: "Rahul Verma",
    studentId: "STU-2024-112",
    class: "Grade 8",
    category: "Tuition Fee",
    amount: 12000,
    dueDate: "2026-05-30T23:59:00Z",
    status: "overdue"
  },
  {
    id: "INV-2026-004",
    studentName: "Ananya Singh",
    studentId: "STU-2022-089",
    class: "Grade 12",
    category: "Hostel Fee",
    amount: 25000,
    dueDate: "2026-06-10T23:59:00Z",
    status: "pending"
  },
  {
    id: "INV-2026-005",
    studentName: "Ishaan Kumar",
    studentId: "STU-2025-033",
    class: "Grade 6",
    category: "Library Fine",
    amount: 500,
    dueDate: "2026-06-01T23:59:00Z",
    status: "overdue"
  },
  {
    id: "INV-2026-006",
    studentName: "Riya Gupta",
    studentId: "STU-2024-067",
    class: "Grade 9",
    category: "Tuition Fee",
    amount: 14000,
    dueDate: "2026-06-05T23:59:00Z",
    status: "paid",
    paidDate: "2026-06-04T14:15:00Z"
  },
  {
    id: "INV-2026-007",
    studentName: "Vikram Das",
    studentId: "STU-2023-142",
    class: "Grade 11",
    category: "Exam Fee",
    amount: 2000,
    dueDate: "2026-06-20T23:59:00Z",
    status: "pending"
  }
];
