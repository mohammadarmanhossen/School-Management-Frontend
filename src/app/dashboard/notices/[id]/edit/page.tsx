"use client";

import { use, useState, useEffect } from "react";
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
  ArrowLeft,
  SaveAll,
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
import { mockNotices } from "@/lib/mock-data";
import { toast } from "sonner";
import type { UserRole } from "@/types";
import Link from "next/link";

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

export default function EditNoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const notice = mockNotices.find((n) => n.id === id);

  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(
    notice?.targetRoles ?? []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: notice?.title ?? "",
      content: notice?.content ?? "",
      priority: notice?.priority ?? "medium",
      status: (notice?.status === "expired" ? "published" : notice?.status) ?? "published",
      targetRoles: (notice?.targetRoles ?? []) as NoticeFormData["targetRoles"],
      publishDate: notice?.publishDate ?? new Date().toISOString().split("T")[0],
      expiryDate: notice?.expiryDate ?? "",
    },
  });

  useEffect(() => {
    if (notice) {
      reset({
        title: notice.title,
        content: notice.content,
        priority: notice.priority,
        status: (notice.status === "expired" ? "published" : notice.status) as NoticeFormData["status"],
        targetRoles: notice.targetRoles as NoticeFormData["targetRoles"],
        publishDate: notice.publishDate,
        expiryDate: notice.expiryDate ?? "",
      });
      setSelectedRoles(notice.targetRoles);
    }
  }, [notice, reset]);

  const priority = watch("priority");

  if (!notice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Bell className="h-12 w-12 text-zinc-700" />
        <h2 className="text-xl font-semibold text-white">Notice Not Found</h2>
        <p className="text-zinc-500">
          The notice you are trying to edit does not exist.
        </p>
        <Button asChild>
          <Link href="/dashboard/notices">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notices
          </Link>
        </Button>
      </div>
    );
  }

  const toggleRole = (role: UserRole) => {
    const updated = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    setSelectedRoles(updated);
    setValue("targetRoles", updated as NoticeFormData["targetRoles"], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const selectAllRoles = () => {
    const all = TARGET_ROLES.map((r) => r.value);
    setSelectedRoles(all);
    setValue("targetRoles", all as NoticeFormData["targetRoles"], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: NoticeFormData) => {
    await new Promise((r) => setTimeout(r, 800));
    console.log("Updated notice data:", { id, ...data });
    toast.success("Notice updated successfully!");
    router.push(`/dashboard/notices/${id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Notice"
        description={`Editing: ${notice.title}`}
        breadcrumbs={[
          { label: "Notices", href: "/dashboard/notices" },
          { label: notice.title, href: `/dashboard/notices/${id}` },
          { label: "Edit" },
        ]}
        actions={
          <Button variant="outline" asChild id="view-notice-btn">
            <Link href={`/dashboard/notices/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> View Notice
            </Link>
          </Button>
        }
      />

      {isDirty && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          You have unsaved changes. Don&apos;t forget to save before leaving.
        </div>
      )}

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
              <Label htmlFor="edit-title">
                Notice Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-title"
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
              <Label htmlFor="edit-content">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="edit-content"
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
                  id="select-all-edit-btn"
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
                      id={`edit-role-${value}`}
                      checked={selectedRoles.includes(value)}
                      onCheckedChange={() => toggleRole(value)}
                    />
                    <label
                      htmlFor={`edit-role-${value}`}
                      className="cursor-pointer text-sm font-medium text-zinc-300 flex-1"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-400" />
                Priority & Schedule
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
                        setValue(
                          "priority",
                          value as NoticeFormData["priority"],
                          { shouldDirty: true }
                        )
                      }
                      className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                        priority === value
                          ? "border-blue-500/50 bg-blue-500/10 text-white"
                          : "border-white/[0.06] text-zinc-400 hover:border-white/[0.12]"
                      }`}
                      id={`edit-priority-${value}-btn`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-publishDate">
                  Publish Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="edit-publishDate"
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
                <Label htmlFor="edit-expiryDate">
                  Expiry Date{" "}
                  <span className="text-zinc-500 text-xs">(optional)</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    {...register("expiryDate")}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  defaultValue={(notice.status === "expired" ? "published" : notice.status) ?? "published"}
                  onValueChange={(val) =>
                    setValue("status", val as NoticeFormData["status"], {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger id="edit-status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
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
            id="cancel-edit-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            id="save-notice-btn"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SaveAll className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
