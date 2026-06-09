"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTransportStore } from "@/store";
import type { Vehicle } from "@/types";

export default function TransportPage() {
  const vehicles = useTransportStore((state) => state.vehicles);
  const deleteVehicle = useTransportStore((state) => state.deleteVehicle);

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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/transport/edit/${row.original.id}`}>
              <Edit className="h-4 w-4 text-blue-400" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Are you sure you want to delete this vehicle?")) {
                deleteVehicle(row.original.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      ),
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
      <DataTable columns={columns} data={vehicles} />
    </div>
  );
}
