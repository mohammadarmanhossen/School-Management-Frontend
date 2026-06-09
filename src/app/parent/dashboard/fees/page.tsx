"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useParentStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Wallet, CreditCard, Receipt } from "lucide-react";
import type { ParentChildFee } from "@/types/parent";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function FeesPage() {
  const [mounted, setMounted] = useState(false);
  const { children, selectedChildId, fees } = useParentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const child = children.find((c) => c.id === selectedChildId);
  if (!child) return null;

  const records = fees[child.id] || [];
  
  const totalPaid = records.filter(f => f.status === "paid").reduce((acc, curr) => acc + curr.amount, 0);
  const pendingFees = records.filter(f => f.status === "pending" || f.status === "overdue");
  const totalPending = pendingFees.reduce((acc, curr) => acc + curr.amount, 0);

  const columns: ColumnDef<ParentChildFee>[] = [
    {
      accessorKey: "feeType",
      header: "Fee Detail",
      cell: ({ row }) => <span className="font-medium text-white">{row.original.feeType}</span>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="text-zinc-300">{formatCurrency(row.original.amount)}</span>,
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => <span className="text-zinc-400">{formatDate(row.original.dueDate)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const color = 
          s === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          s === "overdue" ? "bg-red-500/10 text-red-400 border-red-500/20" :
          "bg-amber-500/10 text-amber-400 border-amber-500/20";
        return (
          <Badge variant="outline" className={`capitalize ${color}`}>
            {s}
          </Badge>
        );
      },
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        if (row.original.status === "paid") {
          return (
            <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
              <Receipt className="mr-2 h-4 w-4" /> Receipt
            </Button>
          );
        }
        return (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            Pay Now
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Payments"
        description={`Manage fee payments for ${child.name}.`}
        breadcrumbs={[{ label: "Parent Dashboard", href: "/parent/dashboard" }, { label: "Fees" }]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-rose-500/10 to-zinc-950">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20">
              <Wallet className="h-6 w-6 text-rose-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-400">Total Dues</p>
              <h3 className="text-3xl font-bold text-white">{formatCurrency(totalPending)}</h3>
            </div>
            {totalPending > 0 && (
              <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/25">
                <CreditCard className="mr-2 h-4 w-4" /> Pay All
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-emerald-500/10 to-zinc-950">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
              <Receipt className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Paid (This Year)</p>
              <h3 className="text-3xl font-bold text-white">{formatCurrency(totalPaid)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card border-white/5">
        <CardHeader>
          <CardTitle className="text-lg text-white">Fee Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={records} />
        </CardContent>
      </Card>
    </div>
  );
}
