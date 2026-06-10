"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "next-themes";
import {
  User,
  Mail,
  Phone,
  Camera,
  Shield,
  Building2,
  Palette,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store";
import { ROLES } from "@/constants";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileTab() {
  const { user, setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    if (user) {
      setUser({
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
      });
    }
    toast.success("Profile updated successfully");
    setIsSaving(false);
  };

  if (!user) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="dashboard-card border-white/[0.08] lg:col-span-1">
        <CardContent className="flex flex-col items-center pt-8 pb-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-blue-500/20 ring-offset-2 ring-offset-[#0a0a0a]">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-2xl text-white">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#141414] text-zinc-400 transition-colors hover:bg-blue-500 hover:text-white"
              onClick={() => toast.info("Photo upload coming soon")}
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-white">{user.fullName}</h3>
          <p className="text-sm text-zinc-500">{user.email}</p>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Badge className="border-blue-500/20 bg-blue-500/15 text-blue-400">
              {ROLES[user.role].label}
            </Badge>
            {user.isEmailVerified && (
              <Badge className="border-emerald-500/20 bg-emerald-500/15 text-emerald-400">
                Verified
              </Badge>
            )}
          </div>

          {user.schoolName && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-zinc-400">
              <Building2 className="h-3.5 w-3.5" />
              {user.schoolName}
            </div>
          )}

          <div className="mt-6 w-full space-y-2 border-t border-white/[0.06] pt-4 text-xs text-zinc-500">
            <div className="flex justify-between">
              <span>Member since</span>
              <span className="text-zinc-400">
                {new Date(user.createdAt).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>User ID</span>
              <span className="font-mono text-zinc-400">{user.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card border-white/[0.08] lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-blue-400" />
            Edit Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-zinc-400">First Name</Label>
                <Input
                  id="firstName"
                  className="border-white/[0.08] bg-white/[0.04] text-zinc-200 focus-visible:border-blue-500/50"
                  {...register("firstName")}
                />
                {errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-zinc-400">Last Name</Label>
                <Input
                  id="lastName"
                  className="border-white/[0.08] bg-white/[0.04] text-zinc-200 focus-visible:border-blue-500/50"
                  {...register("lastName")}
                />
                {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <Input id="email" value={user.email} disabled className="border-white/[0.08] bg-white/[0.02] pl-10 text-zinc-500" />
              </div>
              <p className="text-xs text-zinc-600">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-400">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <Input
                  id="phone"
                  placeholder="01XXXXXXXXX"
                  className="border-white/[0.08] bg-white/[0.04] pl-10 text-zinc-200 focus-visible:border-blue-500/50"
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Role</Label>
              <Input value={ROLES[user.role].label} disabled className="border-white/[0.08] bg-white/[0.02] text-zinc-500" />
            </div>

            <div className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
              <Button type="submit" disabled={isSaving || !isDirty} className="bg-blue-600 hover:bg-blue-700">
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/[0.08] bg-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                onClick={() => reset()}
                disabled={!isDirty}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsContent() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";
  const isAdmin = user?.role === "school_admin";

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and preferences" breadcrumbs={[{ label: "Settings" }]} />

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="h-auto flex-wrap gap-1 border border-white/[0.08] bg-white/[0.04] p-1">
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="school" className="gap-2 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400">
              <Building2 className="h-4 w-4" /> School
            </TabsTrigger>
          )}
          <TabsTrigger value="theme" className="gap-2 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400">
            <Palette className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile"><ProfileTab /></TabsContent>

        {isAdmin && (
          <TabsContent value="school">
            <Card className="dashboard-card border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white">School Information</CardTitle>
                <CardDescription>Update your school details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label className="text-zinc-400">School Name</Label><Input defaultValue="Dhaka Model School" className="border-white/[0.08] bg-white/[0.04] text-zinc-200" /></div>
                <div className="space-y-2"><Label className="text-zinc-400">School Code</Label><Input defaultValue="DMS-001" className="border-white/[0.08] bg-white/[0.04] text-zinc-200" /></div>
                <div className="space-y-2"><Label className="text-zinc-400">Principal Name</Label><Input defaultValue="Dr. Ahsan Habib" className="border-white/[0.08] bg-white/[0.04] text-zinc-200" /></div>
                <div className="space-y-2"><Label className="text-zinc-400">Established Year</Label><Input defaultValue="1995" className="border-white/[0.08] bg-white/[0.04] text-zinc-200" /></div>
                <div className="space-y-2"><Label className="text-zinc-400">Email</Label><Input defaultValue="info@school.edu.bd" className="border-white/[0.08] bg-white/[0.04] text-zinc-200" /></div>
                <div className="space-y-2"><Label className="text-zinc-400">Phone</Label><Input defaultValue="+880 1234-567890" className="border-white/[0.08] bg-white/[0.04] text-zinc-200" /></div>
                <div className="space-y-2 sm:col-span-2"><Label className="text-zinc-400">Academic Year</Label><Input defaultValue="2024-2025" className="border-white/[0.08] bg-white/[0.04] text-zinc-200" /></div>
                <div className="space-y-2 sm:col-span-2"><Label className="text-zinc-400">Address</Label><Input defaultValue="123 Education Road, Dhanmondi, Dhaka" className="border-white/[0.08] bg-white/[0.04] text-zinc-200" /></div>
                <Button onClick={() => toast.success("School settings saved")} className="sm:col-span-2 w-fit bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="theme">
          <Card className="dashboard-card border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Appearance</CardTitle>
              <CardDescription>Customize how the app looks outside the dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div>
                  <Label className="text-zinc-300">Dark Mode (Home & Auth pages)</Label>
                  <p className="text-sm text-zinc-500">Toggle theme for public pages</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={(c) => setTheme(c ? "dark" : "light")} />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[200px] border-white/[0.08] bg-white/[0.04] text-zinc-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-white/[0.08] bg-[#0a0a0a]">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">Bangla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="dashboard-card border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Security</CardTitle>
              <CardDescription>Protect your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div><Label className="text-zinc-300">Password</Label><p className="text-sm text-zinc-500">Change your account password</p></div>
                <Button variant="outline" asChild className="border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]"><a href="/change-password">Change Password</a></Button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div><Label className="text-zinc-300">Two-Factor Authentication</Label><p className="text-sm text-zinc-500">Add an extra layer of security</p></div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div><Label className="text-zinc-300">Email Notifications</Label><p className="text-sm text-zinc-500">Receive alerts via email</p></div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-zinc-500">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
