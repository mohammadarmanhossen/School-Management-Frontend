"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus, FileText, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFeeStore } from "@/store";
import { PAYMENT_METHODS } from "@/constants";
import type { Fee } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function FeesPage() {
  const fees = useFeeStore((state) => state.fees);
  const deleteFee = useFeeStore((state) => state.deleteFee);

  const columns: ColumnDef<Fee>[] = [
    { accessorKey: "studentName", header: "Student" },
    { accessorKey: "category", header: "Category" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "paidAmount",
      header: "Paid",
      cell: ({ row }) => formatCurrency(row.original.paidAmount),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => formatDate(row.original.dueDate),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const variants: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
          paid: "success", partial: "warning", pending: "secondary", overdue: "destructive",
        };
        return <Badge variant={variants[row.original.status]}>{row.original.status}</Badge>;
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => {
        const method = PAYMENT_METHODS.find((m) => m.id === row.original.paymentMethod);
        return method ? method.label : "-";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/fees/edit/${row.original.id}`}>
              <Edit className="h-4 w-4 text-blue-400" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Are you sure you want to delete this fee record?")) {
                deleteFee(row.original.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Fee Management" description="Track fees, invoices, and payments" breadcrumbs={[{ label: "Fees" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Generate Invoice</Button>
            <Button asChild>
              <Link href="/dashboard/fees/create">
                <Plus className="mr-2 h-4 w-4" /> Add Fee
              </Link>
            </Button>
          </div>
        } />
      <div className="flex flex-wrap gap-2">
        {PAYMENT_METHODS.map((m) => (
          <Badge key={m.id} className={`${m.color} text-white border-0`}>{m.label}</Badge>
        ))}
      </div>
      <DataTable columns={columns} data={fees} />
    </div>
  );
}
