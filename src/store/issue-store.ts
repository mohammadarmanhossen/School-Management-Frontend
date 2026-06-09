import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookIssue } from "@/types";

interface IssueFormData {
  bookId: string;
  memberId: string;
  memberType: "student" | "teacher";
  issueDate: string;
  returnDate: string;
}

interface IssueStore {
  issues: BookIssue[];
  issueBook: (data: IssueFormData & { bookTitle: string; memberName: string }) => BookIssue;
  returnBook: (issueId: string) => void;
  getIssuesByMember: (memberId: string) => BookIssue[];
}

export const useIssueStore = create<IssueStore>()(
  persist(
    (set, get) => ({
      issues: [],

      issueBook: (data) => {
        const newIssue: BookIssue = {
          id: crypto.randomUUID?.() || `issue-${Date.now()}`,
          bookId: data.bookId,
          bookTitle: data.bookTitle,
          memberId: data.memberId,
          memberName: data.memberName,
          memberType: data.memberType,
          issueDate: data.issueDate,
          returnDate: data.returnDate,
          status: "issued",
        };
        set((state) => ({ issues: [...state.issues, newIssue] }));
        return newIssue;
      },

      returnBook: (issueId) => {
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === issueId ? { ...issue, status: "returned" as const } : issue
          ),
        }));
      },

      getIssuesByMember: (memberId) => get().issues.filter((issue) => issue.memberId === memberId),
    }),
    {
      name: "issues-storage",
    }
  )
);
