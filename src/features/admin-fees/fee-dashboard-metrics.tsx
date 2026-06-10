"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, AlertCircle, TrendingUp, Receipt } from "lucide-react";
import { mockAdminFeeAnalytics } from "@/lib/mock-admin-fees";

export function FeeDashboardMetrics() {
  const { totalRevenue, totalOutstanding, collectionRate, pendingInvoicesCount } = mockAdminFeeAnalytics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="dashboard-card border-white/[0.08] relative overflow-hidden group">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-400">Total Revenue</p>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Wallet className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl text-zinc-500">৳</span>
            <h3 className="text-3xl font-bold text-white">{totalRevenue.toLocaleString()}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card border-white/[0.08] relative overflow-hidden group">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-red-500/10 blur-2xl transition-all group-hover:bg-red-500/20" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-400">Outstanding Dues</p>
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl text-zinc-500">৳</span>
            <h3 className="text-3xl font-bold text-white">{totalOutstanding.toLocaleString()}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card border-white/[0.08] relative overflow-hidden group">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-400">Collection Rate</p>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white">{collectionRate}%</h3>
        </CardContent>
      </Card>

      <Card className="dashboard-card border-white/[0.08] relative overflow-hidden group">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition-all group-hover:bg-amber-500/20" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-400">Pending Invoices</p>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Receipt className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white">{pendingInvoicesCount}</h3>
        </CardContent>
      </Card>
    </div>
  );
}
