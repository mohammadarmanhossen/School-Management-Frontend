"use client";

import { useTheme } from "next-themes";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage school and account settings" breadcrumbs={[{ label: "Settings" }]} />
      <Tabs defaultValue="school">
        <TabsList>
          <TabsTrigger value="school">School Info</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Update your school details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>School Name</Label><Input defaultValue="Dhaka Model School" /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="info@school.edu.bd" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+880 1234-567890" /></div>
              <div className="space-y-2"><Label>Academic Year</Label><Input defaultValue="2024-2025" /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input defaultValue="123 Education Road, Dhanmondi, Dhaka" /></div>
              <Button onClick={() => toast.success("Settings saved")} className="sm:col-span-2 w-fit">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>First Name</Label><Input defaultValue={user?.firstName} /></div>
              <div className="space-y-2"><Label>Last Name</Label><Input defaultValue={user?.lastName} /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue={user?.email} disabled /></div>
              <div className="space-y-2"><Label>Phone</Label><Input defaultValue={user?.phone} /></div>
              <Button onClick={() => toast.success("Profile updated")} className="sm:col-span-2 w-fit">Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader><CardTitle>Theme Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div><Label>Dark Mode</Label><p className="text-sm text-muted-foreground">Toggle dark/light theme</p></div>
                <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">Bangla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" asChild>
                <a href="/change-password">Change Password</a>
              </Button>
              <div className="flex items-center justify-between">
                <div><Label>Two-Factor Authentication</Label><p className="text-sm text-muted-foreground">Add extra security</p></div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Email Notifications</Label><p className="text-sm text-muted-foreground">Receive email alerts</p></div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
