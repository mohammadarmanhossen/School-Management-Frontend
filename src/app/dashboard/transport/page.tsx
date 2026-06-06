"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockVehicles } from "@/lib/mock-data";
import type { Vehicle } from "@/types";

export default function TransportPage() {
  const columns: ColumnDef<Vehicle>[] = [
    { accessorKey: "registrationNumber", header: "Registration" },
    { accessorKey: "model", header: "Model" },
    { accessorKey: "capacity", header: "Capacity" },
    { accessorKey: "driverName", header: "Driver" },
    { accessorKey: "driverPhone", header: "Driver Phone" },
    { accessorKey: "routeName", header: "Route" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={row.original.status === "active" ? "success" : "warning"}>{row.original.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Transport" description="Vehicle, route, and driver management" breadcrumbs={[{ label: "Transport" }]}
        actions={
          <Button asChild>
            <Link href="/dashboard/transport/create">
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Link>
          </Button>
        } />
      <DataTable columns={columns} data={mockVehicles} />
    </div>
  );
}
