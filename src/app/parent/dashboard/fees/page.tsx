"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CreditCard, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockFees, mockParentChildren } from "@/lib/mock-data";
import { PAYMENT_METHODS } from "@/constants";
import type { Fee } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ParentFeesPage() {
  const child = mockParentChildren[0];
  const totalDue = mockFees
    .filter((f) => f.status !== "paid")
    .reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
  const totalPaid = mockFees.reduce((sum, f) => sum + f.paidAmount, 0);

  const columns: ColumnDef<Fee>[] = [
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
          paid: "success",
          partial: "warning",
          pending: "secondary",
          overdue: "destructive",
        };
        return <Badge variant={variants[row.original.status]}>{row.original.status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        row.original.status !== "paid" ? (
          <Button size="sm" onClick={() => toast.success("Redirecting to payment gateway...")}>
            Pay Now
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => toast.success("Receipt downloaded")}>
            <FileText className="mr-1 h-3 w-3" /> Receipt
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Management"
        description={`Payment history and dues for ${child.name}`}
        breadcrumbs={[
          { label: "Parent Portal", href: "/parent/dashboard" },
          { label: "Fees" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Due</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(totalDue)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Paid</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalPaid)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Payment Methods</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {PAYMENT_METHODS.slice(0, 4).map((m) => (
                <Badge key={m.id} className={`${m.color} border-0 text-xs text-white`}>
                  {m.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Pay fees online</p>
              <p className="text-sm text-muted-foreground">Secure payment via bKash, Nagad, Rocket, or SSLCommerz</p>
            </div>
          </div>
          <Button size="lg" onClick={() => toast.success("Opening payment gateway...")}>
            Pay {formatCurrency(totalDue)}
          </Button>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={mockFees} />
    </div>
  );
}
