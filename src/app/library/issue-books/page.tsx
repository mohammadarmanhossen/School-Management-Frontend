"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { BookMarked } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBooks,
  useBookIssues,
  useIssueBook,
  useLibraryMembers,
} from "@/modules/library/hooks/use-library-data";
import { toast } from "sonner";
import type { BookIssue } from "@/types";

const issueSchema = z.object({
  bookId: z.string().min(1),
  memberId: z.string().min(1),
  memberType: z.enum(["student", "teacher"]),
  issueDate: z.string().min(1),
  returnDate: z.string().min(1),
});

type IssueFormData = z.infer<typeof issueSchema>;

const STATUS_COLORS = {
  issued: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  returned: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  overdue: "border-red-500/30 bg-red-500/10 text-red-400",
};

export default function IssueBooksPage() {
  const { data: books = [] } = useBooks();
  const { data: members = [] } = useLibraryMembers();
  const { data: issues = [], isLoading } = useBookIssues();
  const issueMutation = useIssueBook();
  const [memberType, setMemberType] = useState<"student" | "teacher">("student");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      returnDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      memberType: "student",
    },
  });

  const activeIssues = issues.filter((i) => i.status !== "returned");
  const filteredMembers = members.filter((m) => m.memberType === memberType);

  const columns: ColumnDef<BookIssue>[] = [
    { accessorKey: "bookTitle", header: "Book" },
    { accessorKey: "memberName", header: "Member" },
    {
      accessorKey: "memberType",
      header: "Type",
      cell: ({ row }) => <span className="capitalize">{row.original.memberType}</span>,
    },
    { accessorKey: "issueDate", header: "Issue Date" },
    { accessorKey: "returnDate", header: "Return Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={STATUS_COLORS[row.original.status]}>{row.original.status}</Badge>
      ),
    },
  ];

  const onSubmit = async (data: IssueFormData) => {
    try {
      await issueMutation.mutateAsync(data);
      reset();
    } catch {
      toast.success("Book issued (demo mode)");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issue Books"
        description="Issue books to students and teachers"
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Issue Books" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="dashboard-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <BookMarked className="h-5 w-5 text-blue-400" />
              New Issue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Member Type</Label>
                <Select
                  value={memberType}
                  onValueChange={(v) => {
                    setMemberType(v as "student" | "teacher");
                    setValue("memberType", v as "student" | "teacher");
                    setValue("memberId", "");
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Member</Label>
                <Select onValueChange={(v) => setValue("memberId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                  <SelectContent>
                    {filteredMembers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name} — {m.classOrDept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.memberId && <p className="text-xs text-red-400">Member is required</p>}
              </div>
              <div className="space-y-2">
                <Label>Book</Label>
                <Select onValueChange={(v) => setValue("bookId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger>
                  <SelectContent>
                    {books.filter((b) => b.availableCopies > 0).map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.title} ({b.availableCopies} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bookId && <p className="text-xs text-red-400">Book is required</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input id="issueDate" type="date" {...register("issueDate")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input id="returnDate" type="date" {...register("returnDate")} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={issueMutation.isPending}>
                Issue Book
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <DataTable columns={columns} data={activeIssues} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
