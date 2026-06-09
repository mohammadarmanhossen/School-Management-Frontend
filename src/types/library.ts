export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  totalCopies: number;
  availableCopies: number;
}

export interface LibraryMember {
  id: string;
  name: string;
  role: "student" | "teacher";
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "suspended";
}

export interface LibraryCategory {
  id: string;
  name: string;
  description: string;
}

export interface LibraryIssue {
  id: string;
  bookId: string;
  memberId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "overdue";
}

export interface LibraryFine {
  id: string;
  issueId: string;
  memberId: string;
  amount: number;
  reason: string;
  date: string;
  status: "unpaid" | "paid";
  paidDate?: string;
}

export interface LibraryNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  isActive: boolean;
}

export interface LibraryActivity {
  id: string;
  title: string;
  date: string;
  type: "issue" | "return" | "fine" | "book_added";
}
