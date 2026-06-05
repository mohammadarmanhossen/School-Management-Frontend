"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Wallet, CreditCard, Receipt, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockFees, mockStudentProfile } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function StudentFeesPage() {
  const profile = mockStudentProfile;
  const myFees = mockFees.filter((fee) => fee.studentId === profile.id || fee.studentId === "student-1");
  
  const totalPaid = myFees.reduce((acc, fee) => acc + fee.paidAmount, 0);
  const totalAmount = myFees.reduce((acc, fee) => acc + fee.amount, 0);
  const totalDue = totalAmount - totalPaid;
  const paymentProgress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 100;

  const pendingFees = myFees.filter(f => f.status === "pending" || f.status === "partial");

  const columns: ColumnDef<typeof myFees[0]>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <Receipt className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="font-medium text-zinc-200">{row.original.invoiceNumber}</p>
            <p className="text-xs text-zinc-500">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-zinc-400">
          <Clock className="h-4 w-4" />
          <span className={row.original.status !== "paid" ? "text-amber-400" : ""}>{formatDate(row.original.dueDate)}</span>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium text-zinc-200">
          ৳{row.original.amount.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={status === "paid" ? "success" : status === "pending" ? "destructive" : "warning"}
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="ghost" size="sm" className="hover:bg-white/5 text-blue-400">
            {row.original.status === "paid" ? "View Receipt" : "Pay Now"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Fee Management"
          description={`Payment dashboard for ${profile.name}`}
          breadcrumbs={[
            { label: "Student Portal", href: "/student/dashboard" },
            { label: "Fees" },
          ]}
        />
        <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 px-6">
          <CreditCard className="mr-2 h-4 w-4" /> Pay Outstanding Due
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-emerald-500/10 via-zinc-950 to-zinc-950 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 group col-span-2">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl transition-all group-hover:bg-emerald-500/20" />
          <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2 text-zinc-400">
                <Wallet className="h-5 w-5 text-emerald-500" />
                <h3 className="font-medium">Total Balance Due</h3>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl text-zinc-500">৳</span>
                <p className="text-5xl font-bold text-white tracking-tight">{totalDue.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Payment Progress ({Math.round(paymentProgress)}%)</span>
                <span className="text-zinc-400">Total: ৳{totalAmount.toLocaleString()}</span>
              </div>
              <Progress value={paymentProgress} className="h-2 bg-zinc-800 [&>div]:bg-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="border-white/[0.08] bg-zinc-950/50 hover:bg-zinc-900/80 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total Paid</p>
                <p className="text-xl font-semibold text-white">৳{totalPaid.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/[0.08] bg-zinc-950/50 hover:bg-zinc-900/80 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Pending Invoices</p>
                <p className="text-xl font-semibold text-white">{pendingFees.length} <span className="text-sm font-normal text-zinc-500">awaiting</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-white/[0.08] bg-zinc-950 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50 px-6 py-5">
          <CardTitle className="text-lg font-semibold text-white">Fee History & Invoices</CardTitle>
          <CardDescription className="text-zinc-400">View your payment history and download receipts</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 py-4">
            <DataTable columns={columns} data={myFees} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}