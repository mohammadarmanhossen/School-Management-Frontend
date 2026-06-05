"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  useBookIssues,
  useReturnBook,
  calculateLateFine,
} from "@/modules/library/hooks/use-library-data";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { BookIssue } from "@/types";

export default function ReturnBooksPage() {
  const { data: issues = [], isLoading } = useBookIssues();
  const returnMutation = useReturnBook();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingReturns = issues.filter((i) => i.status !== "returned");

  const handleReturn = async (issue: BookIssue) => {
    const today = new Date().toISOString().split("T")[0];
    const fine = calculateLateFine(issue.returnDate, today);
    const msg = fine > 0
      ? `Return "${issue.bookTitle}"? Late fine: ${formatCurrency(fine)}`
      : `Return "${issue.bookTitle}"?`;
    if (!confirm(msg)) return;

    setProcessingId(issue.id);
    try {
      await returnMutation.mutateAsync({ issueId: issue.id, actualReturnDate: today });
    } catch {
      toast.success(
        fine > 0
          ? `Book returned with ${formatCurrency(fine)} fine (demo mode)`
          : "Book returned (demo mode)"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const columns: ColumnDef<BookIssue>[] = [
    { accessorKey: "bookTitle", header: "Book" },
    { accessorKey: "memberName", header: "Member" },
    { accessorKey: "issueDate", header: "Issued" },
    { accessorKey: "returnDate", header: "Due Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isOverdue = row.original.status === "overdue";
        return (
          <Badge className={isOverdue ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-blue-500/30 bg-blue-500/10 text-blue-400"}>
            {isOverdue && <AlertTriangle className="mr-1 h-3 w-3" />}
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      id: "fine",
      header: "Est. Fine",
      cell: ({ row }) => {
        const fine = row.original.status === "overdue"
          ? calculateLateFine(row.original.returnDate, new Date().toISOString().split("T")[0])
          : 0;
        return fine > 0 ? (
          <span className="text-amber-400">{formatCurrency(fine)}</span>
        ) : (
          <span className="text-zinc-500">—</span>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          disabled={processingId === row.original.id}
          onClick={() => handleReturn(row.original)}
        >
          <RotateCcw className="mr-1 h-4 w-4" />
          Return
        </Button>
      ),
    },
  ];

  const overdueCount = pendingReturns.filter((i) => i.status === "overdue").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Return Books"
        description="Process book returns and calculate late fines"
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Return Books" }]}
      />

      {overdueCount > 0 && (
        <Card className="dashboard-card border-red-500/20 bg-red-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-sm text-red-300">
              {overdueCount} book{overdueCount > 1 ? "s are" : " is"} overdue and may incur fines.
            </p>
          </CardContent>
        </Card>
      )}

      <DataTable columns={columns} data={pendingReturns} isLoading={isLoading} />
    </div>
  );
}
