"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockTeachers } from "@/lib/mock-data";

export default function ProfilePage() {
  // Using the first teacher as the active profile
  const [profile, setProfile] = useState(mockTeachers[0]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and account settings."
        breadcrumbs={[
          { label: "Dashboard", href: "/teacher/dashboard" },
          { label: "Profile" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Sidebar */}
        <Card className="md:col-span-1 border-white/[0.08] bg-zinc-950">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 border-4 border-blue-500/20 mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.fullName}`} />
              <AvatarFallback className="bg-blue-500/10 text-4xl text-blue-500">
                {profile.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-white mb-1">{profile.fullName}</h2>
            <p className="text-zinc-400 mb-4">{profile.specialization} Teacher</p>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-0 mb-6">
              Active Employee
            </Badge>

            <div className="w-full space-y-4 text-left border-t border-white/[0.06] pt-6 text-sm">
              <div className="flex items-center gap-3 text-zinc-400">
                <Briefcase className="h-4 w-4 text-blue-400" />
                <span>{profile.employeeId}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>{profile.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="md:col-span-2 border-white/[0.08] bg-zinc-950">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50">
            <CardTitle className="text-base">Personal Information</CardTitle>
            <CardDescription className="text-zinc-400">Update your contact details and personal information.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                <Input defaultValue={profile.fullName} className="bg-zinc-900 border-white/[0.1] focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                <Input defaultValue={profile.email} type="email" className="bg-zinc-900 border-white/[0.1] focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Phone Number</label>
                <Input defaultValue={profile.phone} className="bg-zinc-900 border-white/[0.1] focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Qualification</label>
                <Input defaultValue={profile.qualification} disabled className="bg-zinc-900 border-white/[0.1] opacity-50 cursor-not-allowed" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-300">Address</label>
                <Input defaultValue={profile.address} className="bg-zinc-900 border-white/[0.1] focus-visible:ring-blue-500" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>

          <CardHeader className="border-b border-t border-white/[0.06] bg-zinc-900/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Current Password</label>
                <Input type="password" placeholder="••••••••" className="bg-zinc-900 border-white/[0.1] focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">New Password</label>
                <Input type="password" placeholder="••••••••" className="bg-zinc-900 border-white/[0.1] focus-visible:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="outline" className="gap-2 bg-zinc-900 border-white/[0.1] hover:bg-zinc-800">
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
