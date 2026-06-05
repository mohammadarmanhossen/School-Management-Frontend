"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/constants/query-keys";
import { libraryService } from "@/services";
import { getErrorMessage } from "@/services/api-client";
import {
  mockLibrarianStats,
  mockBooks,
  mockBookIssues,
  mockLibraryMembers,
  mockLibraryFines,
} from "@/lib/mock-data";
import type { Book, BookIssue, LibraryMember, LibraryFine } from "@/types";

async function withMockFallback<T>(apiCall: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await apiCall();
  } catch {
    return fallback;
  }
}

export function useLibrarianDashboard() {
  return useQuery({
    queryKey: queryKeys.library.dashboard,
    queryFn: () => withMockFallback(() => libraryService.getDashboard(), mockLibrarianStats),
  });
}

export function useBooks() {
  return useQuery({
    queryKey: queryKeys.library.books(),
    queryFn: async () => {
      try {
        const data = await libraryService.getBooks();
        return data.results ?? data;
      } catch {
        return mockBooks;
      }
    },
  });
}

export function useBookMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.library.all });

  const create = useMutation({
    mutationFn: (data: Omit<Book, "id">) => libraryService.createBook(data),
    onSuccess: () => { toast.success("Book added"); invalidate(); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Book> }) =>
      libraryService.updateBook(id, data),
    onSuccess: () => { toast.success("Book updated"); invalidate(); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => libraryService.deleteBook(id),
    onSuccess: () => { toast.success("Book deleted"); invalidate(); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return { create, update, remove };
}

export function useBookIssues() {
  return useQuery({
    queryKey: queryKeys.library.issues(),
    queryFn: async () => {
      try {
        const data = await libraryService.getIssues();
        return (data.results ?? data) as BookIssue[];
      } catch {
        return mockBookIssues;
      }
    },
  });
}

export function useIssueBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: libraryService.issueBook,
    onSuccess: () => {
      toast.success("Book issued successfully");
      qc.invalidateQueries({ queryKey: queryKeys.library.all });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useReturnBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ issueId, actualReturnDate }: { issueId: string; actualReturnDate?: string }) =>
      libraryService.returnBook(issueId, { actualReturnDate }),
    onSuccess: () => {
      toast.success("Book returned successfully");
      qc.invalidateQueries({ queryKey: queryKeys.library.all });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useLibraryMembers() {
  return useQuery({
    queryKey: queryKeys.library.members(),
    queryFn: async () => {
      try {
        const data = await libraryService.getMembers();
        return (data.results ?? data) as LibraryMember[];
      } catch {
        return mockLibraryMembers;
      }
    },
  });
}

export function useLibraryFines() {
  return useQuery({
    queryKey: queryKeys.library.fines(),
    queryFn: async () => {
      try {
        const data = await libraryService.getFines();
        return (data.results ?? data) as LibraryFine[];
      } catch {
        return mockLibraryFines;
      }
    },
  });
}

export function usePayFine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => libraryService.payFine(id),
    onSuccess: () => {
      toast.success("Fine marked as paid");
      qc.invalidateQueries({ queryKey: queryKeys.library.fines() });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function calculateLateFine(returnDate: string, actualDate: string, ratePerDay = 10): number {
  const due = new Date(returnDate);
  const actual = new Date(actualDate);
  const diffDays = Math.ceil((actual.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * ratePerDay : 0;
}
