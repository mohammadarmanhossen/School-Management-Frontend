"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useLibraryStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle } from "lucide-react";
import type { LibraryFine } from "@/types/library";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function FinesPage() {
  const [mounted, setMounted] = useState(false);
  const { fines, members, payFine } = useLibraryStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const columns: ColumnDef<LibraryFine>[] = [
    {
      accessorKey: "memberId",
      header: "Member",
      cell: ({ row }) => {
        const mem = members.find(m => m.id === row.original.memberId);
        return <span className="font-medium text-white">{mem?.name || "Unknown"}</span>;
      }
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => <span className="text-zinc-300">{row.original.reason}</span>
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="font-bold text-amber-400">{formatCurrency(row.original.amount)}</span>
    },
    {
      accessorKey: "date",
      header: "Generated On",
      cell: ({ row }) => <span className="text-zinc-400">{formatDate(row.original.date)}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant="outline" className={`capitalize ${status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {status}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        if (row.original.status === "paid") {
          return <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Paid on {formatDate(row.original.paidDate!)}</span>;
        }
        return (
          <Button 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => payFine(row.original.id)}
          >
            Mark as Paid
          </Button>
        );
      }
    }
  ];

  const totalCollected = fines.filter(f => f.status === "paid").reduce((acc, f) => acc + f.amount, 0);
  const totalPending = fines.filter(f => f.status === "unpaid").reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Fines"
        description="Manage overdue fines and payments."
        breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Fines" }]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-red-500/10 to-zinc-950">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
              <Wallet className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Pending Fines</p>
              <h3 className="text-3xl font-bold text-white">{formatCurrency(totalPending)}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-white/5 bg-gradient-to-br from-emerald-500/10 to-zinc-950">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Collected</p>
              <h3 className="text-3xl font-bold text-white">{formatCurrency(totalCollected)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card border-white/5">
        <CardHeader>
          <CardTitle className="text-lg text-white">Fine Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={fines.reverse()} />
        </CardContent>
      </Card>
    </div>
  );
}
