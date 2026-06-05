"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CalendarDays,
  Download,
  MapPin,
  Users,
} from "lucide-react";

import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EventRecord = {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  status: "Registered" | "Upcoming" | "Completed";
};

const upcomingEvents: EventRecord[] = [
  {
    id: "1",
    title: "Annual Science Fair",
    category: "Academic",
    date: "15 Aug 2026",
    location: "School Auditorium",
    status: "Upcoming",
  },
  {
    id: "2",
    title: "Sports Day",
    category: "Sports",
    date: "22 Aug 2026",
    location: "School Field",
    status: "Registered",
  },
  {
    id: "3",
    title: "Cultural Program",
    category: "Cultural",
    date: "30 Aug 2026",
    location: "Main Hall",
    status: "Upcoming",
  },
];

export default function ParentEventsPage() {
  const columns: ColumnDef<EventRecord>[] = [
    {
      accessorKey: "title",
      header: "Event",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Badge
            className={
              status === "Completed"
                ? "bg-green-500 text-white"
                : status === "Registered"
                ? "bg-blue-500 text-white"
                : "bg-orange-500 text-white"
            }
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="School events and participation history"
        breadcrumbs={[
          {
            label: "Parent Portal",
            href: "/parent/dashboard",
          },
          {
            label: "Events",
          },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Event report downloaded")
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* Summary Cards */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Upcoming Events",
            value: "5",
          },
          {
            label: "This Month",
            value: "8",
          },
          {
            label: "Registered",
            value: "3",
          },
          {
            label: "Completed",
            value: "12",
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">
                {item.value}
              </p>

              <p className="text-sm text-muted-foreground">
                {item.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Event */}

      <Card>
        <CardContent className="p-6">
          <Badge>Featured Event</Badge>

          <h2 className="mt-3 text-2xl font-bold">
            Annual Science Fair 2026
          </h2>

          <p className="mt-2 text-muted-foreground">
            Participate in the biggest science exhibition
            of the year and showcase innovative projects.
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              15 Aug 2026
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              School Auditorium
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Open for Registration
            </div>
          </div>

          <Button className="mt-5">
            Register Now
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Events */}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <Badge>{event.category}</Badge>

                <h3 className="mt-3 font-semibold">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {event.date}
                </p>

                <p className="text-sm text-muted-foreground">
                  {event.location}
                </p>

                <Button
                  size="sm"
                  className="mt-4 w-full"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Event Calendar Placeholder */}

      <Card>
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex h-72 items-center justify-center rounded-lg border border-dashed">
            Calendar Component Here
          </div>
        </CardContent>
      </Card>

      {/* Gallery */}

      <Card>
        <CardHeader>
          <CardTitle>Recent Event Gallery</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="aspect-video rounded-lg bg-muted"
            />
          ))}
        </CardContent>
      </Card>

      {/* Registration History */}

      <Card>
        <CardHeader>
          <CardTitle>
            Event Registration History
          </CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={upcomingEvents}
          />
        </CardContent>
      </Card>
    </div>
  );
}


