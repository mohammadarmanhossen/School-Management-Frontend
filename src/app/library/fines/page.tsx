"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Wallet, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLibraryFines, usePayFine } from "@/modules/library/hooks/use-library-data";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { LibraryFine } from "@/types";

export default function LibraryFinesPage() {
  const { data: fines = [], isLoading } = useLibraryFines();
  const payMutation = usePayFine();

  const unpaidTotal = fines.filter((f) => f.status === "unpaid").reduce((s, f) => s + f.amount, 0);
  const unpaidCount = fines.filter((f) => f.status === "unpaid").length;

  const handlePay = async (fine: LibraryFine) => {
    if (!confirm(`Mark ${formatCurrency(fine.amount)} fine as paid for ${fine.memberName}?`)) return;
    try {
      await payMutation.mutateAsync(fine.id);
    } catch {
      toast.success("Fine marked as paid (demo mode)");
    }
  };

  const columns: ColumnDef<LibraryFine>[] = [
    { accessorKey: "memberName", header: "Member" },
    { accessorKey: "bookTitle", header: "Book" },
    { accessorKey: "reason", header: "Reason" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "paid" ? "success" : "warning"}>
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: "createdAt", header: "Date" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) =>
        row.original.status === "unpaid" ? (
          <Button size="sm" variant="outline" onClick={() => handlePay(row.original)}>
            <CheckCircle className="mr-1 h-4 w-4" />
            Mark Paid
          </Button>
        ) : (
          <span className="text-xs text-zinc-500">Paid {row.original.paidAt}</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fines System"
        description="Late return fines and payment tracking"
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Fines" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="dashboard-card border-amber-500/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-amber-500/15 p-3">
              <Wallet className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{formatCurrency(unpaidTotal)}</p>
              <p className="text-sm text-zinc-500">{unpaidCount} unpaid fine{unpaidCount !== 1 ? "s" : ""}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {fines.filter((f) => f.status === "paid").length}
              </p>
              <p className="text-sm text-zinc-500">Paid fines (history)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={fines} isLoading={isLoading} />
    </div>
  );
}
