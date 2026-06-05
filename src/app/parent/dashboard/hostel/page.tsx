"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Home,
  Users,
  Bed,
  DoorOpen,
  Phone,
  Download,
} from "lucide-react";

import { toast } from "sonner";

export default function ParentHostelPage() {
  const hostelInfo = {
    hostelName: "Sunshine Boys Hostel",
    roomNo: "A-204",
    floor: "2nd Floor",
    bedType: "Single Bed",
    warden: "Mr. Rahman",
    wardenPhone: "+8801712345678",
    status: "Active",
  };

  const roommates = [
    { name: "Rahim Uddin", class: "Class 9" },
    { name: "Karim Hossain", class: "Class 9" },
    { name: "Student X", class: "Class 9" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Hostel Room"
        description="Hostel room details and living information"
        breadcrumbs={[
          { label: "Parent Portal", href: "/parent/dashboard" },
          { label: "Hostel Room" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Hostel report downloaded")
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Home className="mx-auto mb-2 h-6 w-6" />
            <p className="text-xl font-bold">
              {hostelInfo.hostelName}
            </p>
            <p className="text-sm text-muted-foreground">
              Hostel Name
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <DoorOpen className="mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">
              Room {hostelInfo.roomNo}
            </p>
            <p className="text-sm text-muted-foreground">
              Room Number
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Bed className="mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">
              {hostelInfo.bedType}
            </p>
            <p className="text-sm text-muted-foreground">
              Bed Type
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">
              {roommates.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Roommates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROOM DETAILS */}
      <Card>
        <CardHeader>
          <CardTitle>Room Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Floor</span>
            <Badge>{hostelInfo.floor}</Badge>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <Badge className="bg-green-500 text-white">
              {hostelInfo.status}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span>Warden</span>
            <span className="font-medium">
              {hostelInfo.warden}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Contact</span>
            <span className="text-sm text-muted-foreground">
              {hostelInfo.wardenPhone}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ROOMMATES */}
      <Card>
        <CardHeader>
          <CardTitle>Roommates</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {roommates.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-muted-foreground">
                  {r.class}
                </p>
              </div>

              <Badge variant="secondary">
                Student
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RULES / INFO */}
      <Card>
        <CardHeader>
          <CardTitle>Hostel Rules</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Lights off at 10:30 PM</p>
          <p>• Attendance mandatory every night</p>
          <p>• No unauthorized visitors allowed</p>
          <p>• Cleanliness must be maintained</p>
        </CardContent>
      </Card>

      {/* CONTACT */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>

        <CardContent>
          <Button className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            Call Hostel Warden
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}