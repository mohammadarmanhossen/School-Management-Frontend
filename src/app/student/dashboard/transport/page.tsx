"use client";

import { Bus, PhoneCall, User, Clock, Route as RouteIcon, Info } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockVehicles, mockStudentProfile } from "@/lib/mock-data";

export default function StudentTransportPage() {
  const profile = mockStudentProfile;
  // Assume the student is assigned to the first vehicle for demo purposes
  const myVehicle = mockVehicles[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Transport Details"
        description={`Bus schedule and routing for ${profile.name}`}
        breadcrumbs={[
          { label: "Student Portal", href: "/student/dashboard" },
          { label: "Transport" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Assigned Vehicle Card */}
        <Card className="lg:col-span-2 relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-indigo-500/10 via-zinc-950 to-zinc-950 group">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl transition-all group-hover:bg-indigo-500/20" />
          
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/30 px-6 py-5 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Bus className="h-6 w-6 text-indigo-500" /> 
                  Assigned Transport
                </CardTitle>
                <CardDescription className="text-zinc-400 mt-1">
                  Your daily commute information
                </CardDescription>
              </div>
              <Badge variant={myVehicle.status === "active" ? "success" : "warning"} className="px-3 py-1 text-sm">
                {myVehicle.status === "active" ? "Running on time" : "Delayed"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 relative z-10 grid gap-8 sm:grid-cols-2">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">Vehicle Info</p>
                <p className="text-lg font-semibold text-zinc-200">{myVehicle.model}</p>
                <p className="text-indigo-400 font-mono mt-1 px-3 py-1 bg-indigo-500/10 rounded-md inline-block">
                  {myVehicle.registrationNumber}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Driver Details</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                    <User className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-200">{myVehicle.driverName}</p>
                    <p className="text-sm text-zinc-500">Professional Driver</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-3 w-full border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] hover:text-indigo-400">
                  <PhoneCall className="mr-2 h-4 w-4" /> Call Driver ({myVehicle.driverPhone})
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Route Details</p>
                <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <RouteIcon className="h-5 w-5 text-indigo-500" />
                    <p className="font-medium text-zinc-200">{myVehicle.routeName}</p>
                  </div>
                  
                  <div className="relative pl-4 border-l-2 border-indigo-500/30 space-y-4 ml-2 mt-4">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-indigo-500 border-2 border-zinc-950" />
                      <p className="text-sm font-medium text-zinc-300">Start Point</p>
                      <p className="text-xs text-zinc-500">07:00 AM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-zinc-600 border-2 border-zinc-950" />
                      <p className="text-sm font-medium text-zinc-300">Your Stop (Dhanmondi)</p>
                      <p className="text-xs text-zinc-500">07:30 AM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-zinc-950" />
                      <p className="text-sm font-medium text-zinc-300">School Campus</p>
                      <p className="text-xs text-zinc-500">08:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <Card className="border-white/[0.08] bg-zinc-950 hover:border-white/[0.15] transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Pick-up & Drop-off
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Morning Pick-up</p>
                    <p className="text-xs text-zinc-500">From home</p>
                  </div>
                  <Badge variant="outline" className="bg-white/[0.02]">07:30 AM</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Afternoon Drop-off</p>
                    <p className="text-xs text-zinc-500">From school</p>
                  </div>
                  <Badge variant="outline" className="bg-white/[0.02]">02:15 PM</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-gradient-to-br from-zinc-900 to-zinc-950">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Info className="h-6 w-6 text-blue-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-200 mb-1">Important Instruction</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Please ensure you are at your designated stop at least 5 minutes before the scheduled arrival time. The bus will wait a maximum of 2 minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}