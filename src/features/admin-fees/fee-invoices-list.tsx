"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Search, Receipt, CheckCircle2, AlertCircle, BellRing, Printer, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AdminFeeInvoice, mockAdminFeeInvoices } from "@/lib/mock-admin-fees";
import { cn } from "@/lib/utils";

export function FeeInvoicesList() {
  const [data, setData] = useState<AdminFeeInvoice[]>(mockAdminFeeInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleMarkAsPaid = (id: string) => {
    setData(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: "paid", paidDate: new Date().toISOString() } : inv
    ));
    toast.success(`Invoice ${id} marked as paid successfully!`);
  };

  const handleSendReminder = (id: string) => {
    toast.success(`Payment reminder sent for invoice ${id}`);
  };

  const columns: ColumnDef<AdminFeeInvoice>[] = [
    {
      accessorKey: "id",
      header: "Invoice",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <Receipt className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="font-medium text-white">{row.original.id}</p>
            <p className="text-xs text-zinc-400">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "studentName",
      header: "Student",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-zinc-200">{row.original.studentName}</p>
          <p className="text-xs text-zinc-500">{row.original.studentId} • {row.original.class}</p>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-bold text-white">৳{row.original.amount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Dates",
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-zinc-300">Due: {format(parseISO(row.original.dueDate), "MMM dd, yyyy")}</p>
          {row.original.paidDate && (
            <p className="text-xs text-emerald-400 mt-0.5">Paid: {format(parseISO(row.original.paidDate), "MMM dd, yyyy")}</p>
          )}
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
            variant="outline"
            className={cn(
              "capitalize px-3 py-1",
              status === "paid" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              status === "pending" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
              status === "overdue" && "bg-red-500/10 text-red-400 border-red-500/20"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const inv = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/[0.08] text-white w-48">
              {(inv.status === "pending" || inv.status === "overdue") && (
                <>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/[0.04] focus:bg-white/[0.04]" onClick={() => handleMarkAsPaid(inv.id)}>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" />
                    Mark as Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/[0.04] focus:bg-white/[0.04]" onClick={() => handleSendReminder(inv.id)}>
                    <BellRing className="mr-2 h-4 w-4 text-amber-400" />
                    Send Reminder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/[0.08]" />
                </>
              )}
              <DropdownMenuItem className="cursor-pointer hover:bg-white/[0.04] focus:bg-white/[0.04]" onClick={() => toast.success("Generating print preview...")}>
                <Printer className="mr-2 h-4 w-4 text-zinc-400" />
                Print Receipt
              </DropdownMenuItem>
              {inv.status === "overdue" && (
                <DropdownMenuItem className="cursor-pointer hover:bg-white/[0.04] focus:bg-white/[0.04] text-red-400">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Add Late Fine
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredData = data.filter((inv) => {
    const matchesSearch = 
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || inv.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <Card className="dashboard-card border-white/[0.08]">
      <CardHeader className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg">Recent Invoices</CardTitle>
          <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 text-white">
            <Receipt className="mr-2 h-4 w-4" /> Generate Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 border-none">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input 
              placeholder="Search invoice, student name or ID..." 
              className="pl-9 bg-white/[0.02] border-white/[0.08]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px] bg-white/[0.02] border-white/[0.08]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[150px] bg-white/[0.02] border-white/[0.08]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                <SelectItem value="Transport Fee">Transport Fee</SelectItem>
                <SelectItem value="Hostel Fee">Hostel Fee</SelectItem>
                <SelectItem value="Exam Fee">Exam Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
        />
      </CardContent>
    </Card>
  );
}
