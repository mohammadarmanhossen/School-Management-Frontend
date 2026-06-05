"use client";

import { Home, Users, Phone, BedDouble, ShieldCheck, Utensils, Wifi, Droplets, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockStudentProfile } from "@/lib/mock-data";

export default function StudentHostelPage() {
  const profile = mockStudentProfile;
  
  const hostelInfo = {
    block: "Block A - Boys Hostel",
    room: "204",
    type: "2 Seater Non-AC",
    floor: "2nd Floor",
    warden: "Mr. Shafiqul Islam",
    wardenPhone: "01711223344",
    roommate: "Kamrul Hasan",
    rentStatus: "Paid",
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hostel Accommodation"
        description={`Room and facility details for ${profile.name}`}
        breadcrumbs={[
          { label: "Student Portal", href: "/student/dashboard" },
          { label: "Hostel" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Room Card */}
        <Card className="lg:col-span-2 relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-cyan-500/10 via-zinc-950 to-zinc-950 group">
          <div className="absolute left-0 top-0 -ml-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl transition-all group-hover:bg-cyan-500/20" />
          
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/30 px-6 py-5 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Home className="h-6 w-6 text-cyan-500" /> 
                  My Room
                </CardTitle>
                <CardDescription className="text-zinc-400 mt-1">
                  {hostelInfo.block}
                </CardDescription>
              </div>
              <Badge variant="success" className="px-3 py-1">
                Allocated
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 relative z-10 grid gap-8 sm:grid-cols-2">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Room Details</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">{hostelInfo.room}</span>
                  <span className="text-sm text-cyan-400">{hostelInfo.floor}</span>
                </div>
                <p className="text-zinc-300 bg-white/5 px-3 py-1 rounded-md inline-block text-sm">
                  {hostelInfo.type}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Roommate</p>
                <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-white/[0.04]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                    <Users className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-200">{hostelInfo.roommate}</p>
                    <p className="text-xs text-zinc-500">Student</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Amenities</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <BedDouble className="h-4 w-4 text-cyan-500" /> Furnished Bed
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Wifi className="h-4 w-4 text-cyan-500" /> Free Wi-Fi
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Zap className="h-4 w-4 text-cyan-500" /> 24/7 Power
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Droplets className="h-4 w-4 text-cyan-500" /> Water Supply
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Warden Information</p>
                <div className="rounded-xl border border-white/[0.06] bg-cyan-950/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-zinc-200">{hostelInfo.warden}</p>
                      <p className="text-xs text-cyan-400">Hostel Supervisor</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20 text-cyan-300">
                    <Phone className="mr-2 h-3 w-3" /> Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <Card className="border-white/[0.08] bg-zinc-950 hover:border-white/[0.15] transition-colors">
            <CardHeader className="pb-3 border-b border-white/[0.06]">
              <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                <Utensils className="h-4 w-4 text-amber-500" /> Mess Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-zinc-300">Breakfast</p>
                <span className="text-sm text-zinc-500">07:00 - 08:30 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-zinc-300">Lunch</p>
                <span className="text-sm text-zinc-500">01:00 - 02:30 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-zinc-300">Dinner</p>
                <span className="text-sm text-zinc-500">08:00 - 09:30 PM</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-zinc-950">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <ShieldCheck className="h-6 w-6 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">Hostel Guidelines</p>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Curfew is at 9:00 PM strictly. Keep your rooms clean and respect quiet hours from 10 PM to 6 AM.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-cyan-400 text-xs">Read Full Rules →</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
