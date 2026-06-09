"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  BookMarked,
  AlertTriangle,
  Users,
  Wallet,
  Library,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLibraryStore } from "@/store";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_COLORS = {
  issued: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  returned: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  overdue: "border-red-500/30 bg-red-500/10 text-red-400",
};

export default function LibrarianDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { books, issues, members, fines, activities } = useLibraryStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalBooks = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const availableBooks = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const issuedBooks = issues.filter(i => i.status === "issued" || i.status === "overdue").length;
  const overdueBooks = issues.filter(i => i.status === "overdue").length;
  const activeMembers = members.filter(m => m.status === "active").length;
  const pendingFines = fines.filter(f => f.status === "unpaid").reduce((acc, f) => acc + f.amount, 0);

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Dashboard"
        description="Complete overview of library operations and analytics."
        breadcrumbs={[{ label: "Library" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard className="xl:col-span-2" title="Total Books" value={totalBooks} icon={BookOpen} variant="primary" />
        <StatCard className="xl:col-span-2" title="Available Books" value={availableBooks} icon={Library} variant="success" />
        <StatCard className="xl:col-span-2" title="Active Members" value={activeMembers} icon={Users} variant="primary" />
        
        <StatCard className="xl:col-span-2" title="Issued Books" value={issuedBooks} icon={BookMarked} variant="default" />
        <StatCard className="xl:col-span-2" title="Overdue Books" value={overdueBooks} icon={AlertTriangle} variant="warning" />
        <StatCard
          className="xl:col-span-2"
          title="Pending Fines"
          value={pendingFines}
          icon={Wallet}
          isCurrency
          variant="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="dashboard-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-white">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-zinc-500">No recent activities</p>
            ) : (
              recentActivities.map((activity) => {
                let badgeColor = "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
                if (activity.type === "issue") badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                if (activity.type === "return") badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                if (activity.type === "fine") badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                if (activity.type === "book_added") badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{activity.title}</p>
                      <p className="text-xs text-zinc-500">{formatDate(activity.date)}</p>
                    </div>
                    <Badge variant="outline" className={`capitalize ${badgeColor}`}>
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base text-white">Quick Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-4 py-3">
              <span className="text-sm text-zinc-400">Overdue items</span>
              <span className="text-lg font-bold text-red-400">{overdueBooks}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-4 py-3">
              <span className="text-sm text-zinc-400">Total Unpaid Fines</span>
              <span className="text-lg font-bold text-amber-400">
                {formatCurrency(pendingFines)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-4 py-3">
              <span className="text-sm text-zinc-400">Today</span>
              <span className="text-sm text-zinc-300">
                {formatDate(new Date(), { weekday: "long", month: "short", day: "numeric" })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
