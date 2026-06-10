"use client";

import { PageHeader } from "@/components/shared/page-header";
import { FeeDashboardMetrics } from "@/features/admin-fees/fee-dashboard-metrics";
import { FeeCollectionChart } from "@/features/admin-fees/fee-collection-chart";
import { FeeInvoicesList } from "@/features/admin-fees/fee-invoices-list";

export default function AdminFeesPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Fee Collection & Management"
        description="Monitor school revenue, track pending dues, and process student fee payments."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Fees Management" },
        ]}
      />

      <div className="animate-in fade-in duration-500 slide-in-from-bottom-4 space-y-6">
        {/* Top KPI Cards */}
        <FeeDashboardMetrics />

        {/* Charts & Analytics */}
        <FeeCollectionChart />

        {/* Data Table */}
        <FeeInvoicesList />
      </div>
    </div>
  );
}
