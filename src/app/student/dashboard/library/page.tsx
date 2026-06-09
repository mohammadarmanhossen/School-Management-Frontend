"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  BookMarked,
  Wallet,
  AlertCircle,
  Clock,
  Search,
  BookOpen,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  mockBookIssues,
  mockLibraryFines,
  mockStudentProfile,
} from "@/lib/mock-data";

import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useBookStore, useIssueStore } from "@/store";

export default function StudentLibraryPage() {
  const profile = mockStudentProfile;
  const issues = useIssueStore((state) => state.issues);
  const issueBook = useIssueStore((state) => state.issueBook);
  const books = useBookStore((state) => state.books);
  const updateBook = useBookStore((state) => state.updateBook);

  const [openBorrow, setOpenBorrow] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const myIssues = issues.filter(
    (issue) => issue.memberId === "student-1"
  );

  const myFines = mockLibraryFines.filter(
    (fine) => fine.memberId === "student-1"
  );

  const totalIssued = myIssues.filter(
    (i) => i.status === "issued"
  ).length;

  const totalOverdue = myIssues.filter(
    (i) => i.status === "overdue"
  ).length;

  const totalFinesAmt = myFines
    .filter((f) => f.status === "unpaid")
    .reduce((acc, f) => acc + f.amount, 0);

  const handleBorrowBook = (bookTitle: string) => {
    setSelectedBook(bookTitle);
    setOpenBorrow(true);
  };

  const columns: ColumnDef<(typeof myIssues)[0]>[] = [
    {
      accessorKey: "bookTitle",
      header: "Book Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <BookOpen className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-white">
              {row.original.bookTitle}
            </p>
            <p className="text-xs text-zinc-500">
              ID: {row.original.bookId}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-zinc-400">
          <Clock className="h-4 w-4" />
          {formatDate(row.original.issueDate)}
        </div>
      ),
    },
    {
      accessorKey: "returnDate",
      header: "Due Date",
      cell: ({ row }) => (
        <span
          className={
            row.original.status === "overdue"
              ? "text-red-400 font-medium"
              : "text-zinc-300"
          }
        >
          {formatDate(row.original.returnDate)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === "returned"
              ? "bg-green-500"
              : row.original.status === "overdue"
              ? "bg-red-500"
              : "bg-blue-500"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            handleBorrowBook(row.original.bookTitle)
          }
        >
          Borrow Again
        </Button>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Digital Library"
          description={`Welcome back, ${profile.name}`}
          breadcrumbs={[
            {
              label: "Student Portal",
              href: "/student/dashboard",
            },
            { label: "Library" },
          ]}
        />

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search books..."
              className="pl-9 w-64"
            />
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() =>
              toast.success("Browse opened")
            }
          >
            Browse Books
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BookMarked className="text-blue-500" />
              <div>
                <p className="text-sm text-zinc-400">
                  Issued Books
                </p>
                <p className="text-2xl font-bold text-white">
                  {totalIssued}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" />
              <div>
                <p className="text-sm text-zinc-400">
                  Overdue
                </p>
                <p className="text-2xl font-bold text-white">
                  {totalOverdue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Wallet className="text-yellow-500" />
              <div>
                <p className="text-sm text-zinc-400">
                  Pending Fines
                </p>
                <p className="text-2xl font-bold text-white">
                  ৳{totalFinesAmt}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>My Books</CardTitle>
          <CardDescription>
            Current issued and past library history
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={myIssues}
          />
        </CardContent>
      </Card>

      {/* BORROW MODAL */}
      {openBorrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white">
              Borrow Book
            </h2>

            <p className="text-zinc-400 mt-2">
              Do you want to borrow:
            </p>

            <p className="text-blue-400 font-medium mt-1">
              {selectedBook}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setOpenBorrow(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  const book = books.find(b => b.title === selectedBook);
                  if (!book) {
                    toast.error("Book not found in store. Please browse and select a valid book.");
                    return;
                  }
                  if (book.availableCopies <= 0) {
                    toast.error("Book is currently out of stock.");
                    return;
                  }

                  issueBook({
                    bookId: book.id,
                    bookTitle: book.title,
                    memberId: "student-1",
                    memberName: profile.name,
                    memberType: "student",
                    issueDate: new Date().toISOString().split("T")[0],
                    returnDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
                  });

                  updateBook(book.id, {
                    totalCopies: book.totalCopies,
                    availableCopies: book.availableCopies - 1,
                  } as any);

                  setOpenBorrow(false);
                  toast.success(
                    "Book borrowed successfully"
                  );
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}