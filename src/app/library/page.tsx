"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import { useLibrarianDashboard, useBookIssues } from "@/modules/library/hooks/use-library-data";
import { useAuthStore } from "@/store";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_COLORS = {
  issued: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  returned: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  overdue: "border-red-500/30 bg-red-500/10 text-red-400",
};

export default function LibrarianDashboardPage() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading } = useLibrarianDashboard();
  const { data: issues, isLoading: issuesLoading } = useBookIssues();

  const recentIssues = issues?.slice(0, 5) ?? [];
  const overdueCount = issues?.filter((i) => i.status === "overdue").length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.firstName || "Librarian"}!`}
        description="Library management overview and activity"
        breadcrumbs={[{ label: "Library Dashboard" }]}
      />

      {statsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Books" value={stats.totalBooks} icon={BookOpen} variant="primary" />
          <StatCard title="Available Books" value={stats.availableBooks} icon={Library} variant="success" />
          <StatCard title="Issued Books" value={stats.issuedBooks} icon={BookMarked} variant="default" />
          <StatCard title="Overdue Books" value={stats.overdueBooks} icon={AlertTriangle} variant="warning" />
          <StatCard title="Active Members" value={stats.activeMembers} icon={Users} variant="primary" />
          <StatCard
            title="Pending Fines"
            value={stats.pendingFines}
            icon={Wallet}
            isCurrency
            variant="warning"
          />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-base text-white">Recent Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {issuesLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)
            ) : recentIssues.length === 0 ? (
              <p className="text-sm text-zinc-500">No recent issues</p>
            ) : (
              recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{issue.bookTitle}</p>
                    <p className="text-xs text-zinc-500">{issue.memberName}</p>
                  </div>
                  <Badge className={STATUS_COLORS[issue.status]}>{issue.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-base text-white">Quick Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-4 py-3">
              <span className="text-sm text-zinc-400">Overdue items requiring action</span>
              <span className="text-lg font-bold text-red-400">{overdueCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-4 py-3">
              <span className="text-sm text-zinc-400">Pending fine collection</span>
              <span className="text-lg font-bold text-amber-400">
                {stats ? formatCurrency(stats.pendingFines) : "—"}
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
