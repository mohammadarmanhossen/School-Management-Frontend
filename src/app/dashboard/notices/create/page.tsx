"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Bell,
  Calendar,
  Users,
  AlertCircle,
  FileText,
} from "lucide-react";
import { noticeSchema, type NoticeFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { UserRole } from "@/types";

const TARGET_ROLES: { value: UserRole; label: string }[] = [
  { value: "school_admin", label: "School Admin" },
  { value: "teacher", label: "Teachers" },
  { value: "student", label: "Students" },
  { value: "parent", label: "Parents" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "bg-zinc-500" },
  { value: "medium", label: "Medium", color: "bg-blue-500" },
  { value: "high", label: "High", color: "bg-yellow-500" },
  { value: "urgent", label: "Urgent", color: "bg-red-500" },
];

export default function CreateNoticePage() {
  const router = useRouter();
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      priority: "medium",
      status: "published",
      targetRoles: [],
      publishDate: new Date().toISOString().split("T")[0],
    },
  });

  const priority = watch("priority");
  const selectedPriority = PRIORITY_OPTIONS.find((p) => p.value === priority);

  const toggleRole = (role: UserRole) => {
    const updated = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    setSelectedRoles(updated);
    setValue("targetRoles", updated as NoticeFormData["targetRoles"], {
      shouldValidate: true,
    });
  };

  const selectAllRoles = () => {
    const all = TARGET_ROLES.map((r) => r.value);
    setSelectedRoles(all);
    setValue("targetRoles", all as NoticeFormData["targetRoles"], {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: NoticeFormData) => {
    await new Promise((r) => setTimeout(r, 800));
    console.log("Notice data:", data);
    toast.success("Notice created and published successfully!");
    router.push("/dashboard/notices");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Notice"
        description="Publish a new announcement for your school community"
        breadcrumbs={[
          { label: "Notices", href: "/dashboard/notices" },
          { label: "Create Notice" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Notice Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Notice Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Notice Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Annual Sports Day 2025"
                className="text-base"
              />
              {errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                {...register("content")}
                placeholder="Write the full notice content here..."
                className="min-h-[160px] resize-none"
              />
              {errors.content && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.content.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audience & Priority */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-zinc-400">
                  Select who can see this notice
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllRoles}
                  id="select-all-roles-btn"
                >
                  Select All
                </Button>
              </div>

              <div className="space-y-3">
                {TARGET_ROLES.map(({ value, label }) => (
                  <div
                    key={value}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedRoles.includes(value)
                        ? "border-blue-500/50 bg-blue-500/5"
                        : "border-white/[0.06] hover:border-white/[0.12]"
                    }`}
                    onClick={() => toggleRole(value)}
                  >
                    <Checkbox
                      id={`role-${value}`}
                      checked={selectedRoles.includes(value)}
                      onCheckedChange={() => toggleRole(value)}
                    />
                    <label
                      htmlFor={`role-${value}`}
                      className="cursor-pointer text-sm font-medium text-zinc-300 flex-1"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Zod error for targetRoles */}
              {errors.targetRoles && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.targetRoles.message}
                </p>
              )}

              {selectedRoles.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2 border-t border-white/[0.06]">
                  {selectedRoles.map((r) => (
                    <Badge key={r} variant="secondary" className="capitalize text-xs">
                      {r.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Priority & Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-400" />
                Priority &amp; Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Priority Level <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {PRIORITY_OPTIONS.map(({ value, label, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setValue("priority", value as NoticeFormData["priority"])
                      }
                      className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                        priority === value
                          ? "border-blue-500/50 bg-blue-500/10 text-white"
                          : "border-white/[0.06] text-zinc-400 hover:border-white/[0.12]"
                      }`}
                      id={`priority-${value}-btn`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                      {label}
                    </button>
                  ))}
                </div>
                {selectedPriority && (
                  <p className="text-xs text-zinc-500">
                    Selected:{" "}
                    <span className="text-white font-medium">
                      {selectedPriority.label}
                    </span>{" "}
                    priority
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishDate">
                  Publish Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="publishDate"
                    type="date"
                    {...register("publishDate")}
                    className="pl-9"
                  />
                </div>
                {errors.publishDate && (
                  <p className="text-sm text-destructive">
                    {errors.publishDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">
                  Expiry Date{" "}
                  <span className="text-zinc-500 text-xs">(optional)</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="expiryDate"
                    type="date"
                    {...register("expiryDate")}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Status — properly wired to form */}
              <div className="space-y-2">
                <Label htmlFor="status-select">Publish Status</Label>
                <Select
                  defaultValue="published"
                  onValueChange={(val) =>
                    setValue("status", val as NoticeFormData["status"])
                  }
                >
                  <SelectTrigger id="status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publish Now</SelectItem>
                    <SelectItem value="draft">Save as Draft</SelectItem>
                    <SelectItem value="scheduled">Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            id="cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            id="submit-notice-btn"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Publishing..." : "Publish Notice"}
          </Button>
        </div>
      </form>
    </div>
  );
}
