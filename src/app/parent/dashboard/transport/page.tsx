
"use client";

import { Bus, Download, Phone, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function ParentTransportPage() {
  const transportInfo = {
    busNo: "DHK-1234",
    route: "Route A-12",
    driver: "Abdul Karim",
    driverPhone: "+8801712345678",
    eta: "12 Minutes",
    pickupPoint: "Kaliganj Bazar",
    currentStop: "Chowrasta",
    destination: "School Campus",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transport"
        description="Track school bus and transport information"
        breadcrumbs={[
          { label: "Parent Portal", href: "/parent/dashboard" },
          { label: "Transport" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Transport report downloaded")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Bus className="mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">
              {transportInfo.busNo}
            </p>
            <p className="text-sm text-muted-foreground">
              Bus Number
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <MapPin className="mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">
              {transportInfo.route}
            </p>
            <p className="text-sm text-muted-foreground">
              Route
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Phone className="mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">
              Driver
            </p>
            <p className="text-sm text-muted-foreground">
              {transportInfo.driver}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">
              {transportInfo.eta}
            </p>
            <p className="text-sm text-muted-foreground">
              ETA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Map */}
      <Card>
        <CardHeader>
          <CardTitle>Live Bus Tracking</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <iframe
              title="Bus Tracking"
              src="https://maps.google.com/maps?q=23.8103,90.4125&z=14&output=embed"
              width="100%"
              height="400"
              loading="lazy"
              className="border-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Route + Driver */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Route Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Pickup Point</span>
              <Badge>{transportInfo.pickupPoint}</Badge>
            </div>

            <div className="flex justify-between">
              <span>Current Stop</span>
              <Badge variant="secondary">
                {transportInfo.currentStop}
              </Badge>
            </div>

            <div className="flex justify-between">
              <span>Destination</span>
              <Badge>{transportInfo.destination}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p>
              <strong>Name:</strong> {transportInfo.driver}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {transportInfo.driverPhone}
            </p>

            <p>
              <strong>License Status:</strong>{" "}
              <Badge className="bg-green-500 text-white">
                Valid
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Journey Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Timeline</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-md border p-3">
            ✅ Bus Started - 07:00 AM
          </div>

          <div className="rounded-md border p-3">
            ✅ Student Picked Up - 07:20 AM
          </div>

          <div className="rounded-md border p-3">
            🚌 Current Location - Chowrasta
          </div>

          <div className="rounded-md border p-3">
            ⏳ Expected Arrival - 07:45 AM
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>

        <CardContent>
          <Button className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            Call Transport Office
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


