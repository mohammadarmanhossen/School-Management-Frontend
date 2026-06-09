import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LibraryBook,
  LibraryMember,
  LibraryCategory,
  LibraryIssue,
  LibraryFine,
  LibraryNotice,
  LibraryActivity,
} from "@/types/library";

interface LibraryStore {
  books: LibraryBook[];
  members: LibraryMember[];
  categories: LibraryCategory[];
  issues: LibraryIssue[];
  fines: LibraryFine[];
  notices: LibraryNotice[];
  activities: LibraryActivity[];

  // Books
  addBook: (book: Omit<LibraryBook, "id" | "availableCopies">) => void;
  updateBook: (id: string, book: Partial<LibraryBook>) => void;
  deleteBook: (id: string) => void;

  // Members
  addMember: (member: Omit<LibraryMember, "id">) => void;
  updateMember: (id: string, member: Partial<LibraryMember>) => void;
  deleteMember: (id: string) => void;

  // Categories
  addCategory: (category: Omit<LibraryCategory, "id">) => void;
  updateCategory: (id: string, category: Partial<LibraryCategory>) => void;
  deleteCategory: (id: string) => void;

  // Issues & Returns
  issueBook: (data: Omit<LibraryIssue, "id" | "status" | "returnDate">) => void;
  returnBook: (issueId: string) => void;

  // Fines
  payFine: (fineId: string) => void;

  // Notices
  addNotice: (notice: Omit<LibraryNotice, "id">) => void;
  toggleNoticeStatus: (id: string) => void;
  deleteNotice: (id: string) => void;
}

const initialCategories: LibraryCategory[] = [
  { id: "cat-1", name: "Science Fiction", description: "Sci-Fi and futuristic novels" },
  { id: "cat-2", name: "Mathematics", description: "Math textbooks and reference" },
  { id: "cat-3", name: "History", description: "World and local history" },
];

const initialBooks: LibraryBook[] = [
  { id: "bk-1", title: "Dune", author: "Frank Herbert", isbn: "978-0441172719", categoryId: "cat-1", totalCopies: 5, availableCopies: 4 },
  { id: "bk-2", title: "Calculus Early Transcendentals", author: "James Stewart", isbn: "978-1305272378", categoryId: "cat-2", totalCopies: 10, availableCopies: 10 },
  { id: "bk-3", title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0062316097", categoryId: "cat-3", totalCopies: 3, availableCopies: 2 },
];

const initialMembers: LibraryMember[] = [
  { id: "mem-1", name: "Alice Smith", role: "student", email: "alice@example.com", phone: "1234567890", joinDate: "2026-01-10", status: "active" },
  { id: "mem-2", name: "Bob Jones", role: "teacher", email: "bob@example.com", phone: "0987654321", joinDate: "2025-05-20", status: "active" },
];

const initialIssues: LibraryIssue[] = [
  { id: "iss-1", bookId: "bk-1", memberId: "mem-1", issueDate: new Date(Date.now() - 86400000 * 5).toISOString(), dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), status: "issued" },
  { id: "iss-2", bookId: "bk-3", memberId: "mem-2", issueDate: new Date(Date.now() - 86400000 * 15).toISOString(), dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), status: "overdue" },
];

const initialFines: LibraryFine[] = [
  { id: "fine-1", issueId: "iss-2", memberId: "mem-2", amount: 50, reason: "Late Return (1 Day)", date: new Date().toISOString(), status: "unpaid" },
];

const initialNotices: LibraryNotice[] = [
  { id: "not-1", title: "Library Closed for Maintenance", content: "The library will be closed this Friday for system upgrades.", date: new Date().toISOString(), isActive: true },
];

const initialActivities: LibraryActivity[] = [
  { id: "act-1", title: "Alice Smith borrowed Dune", date: new Date(Date.now() - 86400000 * 5).toISOString(), type: "issue" },
  { id: "act-2", title: "Bob Jones has an overdue book", date: new Date().toISOString(), type: "fine" },
];

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      books: initialBooks,
      members: initialMembers,
      categories: initialCategories,
      issues: initialIssues,
      fines: initialFines,
      notices: initialNotices,
      activities: initialActivities,

      // Books
      addBook: (data) => set((state) => {
        const newBook: LibraryBook = {
          ...data,
          id: `bk-${Date.now()}`,
          availableCopies: data.totalCopies,
        };
        const newActivity: LibraryActivity = {
          id: `act-${Date.now()}`,
          title: `New book added: ${data.title}`,
          date: new Date().toISOString(),
          type: "book_added"
        };
        return { 
          books: [...state.books, newBook],
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      updateBook: (id, data) => set((state) => ({
        books: state.books.map(b => {
          if (b.id !== id) return b;
          let newAvailable = b.availableCopies;
          if (data.totalCopies !== undefined) {
            const diff = data.totalCopies - b.totalCopies;
            newAvailable = Math.max(0, b.availableCopies + diff);
          }
          return { ...b, ...data, availableCopies: newAvailable };
        })
      })),
      deleteBook: (id) => set((state) => ({
        books: state.books.filter(b => b.id !== id)
      })),

      // Members
      addMember: (data) => set((state) => ({
        members: [...state.members, { ...data, id: `mem-${Date.now()}` }]
      })),
      updateMember: (id, data) => set((state) => ({
        members: state.members.map(m => m.id === id ? { ...m, ...data } : m)
      })),
      deleteMember: (id) => set((state) => ({
        members: state.members.filter(m => m.id !== id)
      })),

      // Categories
      addCategory: (data) => set((state) => ({
        categories: [...state.categories, { ...data, id: `cat-${Date.now()}` }]
      })),
      updateCategory: (id, data) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),

      // Issues & Returns
      issueBook: (data) => set((state) => {
        const book = state.books.find(b => b.id === data.bookId);
        const member = state.members.find(m => m.id === data.memberId);
        if (!book || book.availableCopies <= 0 || !member) return state;

        const newIssue: LibraryIssue = {
          ...data,
          id: `iss-${Date.now()}`,
          status: "issued"
        };
        
        const newActivity: LibraryActivity = {
          id: `act-${Date.now()}`,
          title: `${member.name} borrowed ${book.title}`,
          date: new Date().toISOString(),
          type: "issue"
        };

        return {
          issues: [...state.issues, newIssue],
          books: state.books.map(b => b.id === data.bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b),
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      returnBook: (issueId) => set((state) => {
        const issue = state.issues.find(i => i.id === issueId);
        if (!issue || issue.status === "returned") return state;

        const book = state.books.find(b => b.id === issue.bookId);
        const member = state.members.find(m => m.id === issue.memberId);
        
        const isOverdue = new Date() > new Date(issue.dueDate);
        const finesToAdd: LibraryFine[] = [];
        
        if (isOverdue) {
          const daysOverdue = Math.ceil((new Date().getTime() - new Date(issue.dueDate).getTime()) / (1000 * 3600 * 24));
          finesToAdd.push({
            id: `fine-${Date.now()}`,
            issueId,
            memberId: issue.memberId,
            amount: daysOverdue * 10, // $10 per day late
            reason: `Late Return (${daysOverdue} Days)`,
            date: new Date().toISOString(),
            status: "unpaid"
          });
        }

        const newActivity: LibraryActivity = {
          id: `act-${Date.now()}`,
          title: `${member?.name || 'A member'} returned ${book?.title || 'a book'}`,
          date: new Date().toISOString(),
          type: "return"
        };

        return {
          issues: state.issues.map(i => i.id === issueId ? { ...i, status: "returned", returnDate: new Date().toISOString() } : i),
          books: state.books.map(b => b.id === issue.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b),
          fines: [...state.fines, ...finesToAdd],
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),

      // Fines
      payFine: (fineId) => set((state) => ({
        fines: state.fines.map(f => f.id === fineId ? { ...f, status: "paid", paidDate: new Date().toISOString() } : f)
      })),

      // Notices
      addNotice: (data) => set((state) => ({
        notices: [...state.notices, { ...data, id: `not-${Date.now()}` }]
      })),
      toggleNoticeStatus: (id) => set((state) => ({
        notices: state.notices.map(n => n.id === id ? { ...n, isActive: !n.isActive } : n)
      })),
      deleteNotice: (id) => set((state) => ({
        notices: state.notices.filter(n => n.id !== id)
      }))
    }),
    {
      name: "library-system-storage",
    }
  )
);
