"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  User,
  Users,
  Bell,
  AlertCircle,
  AlertTriangle,
  BellRing,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  TimerIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockNotices } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const PRIORITY_CONFIG = {
  urgent: {
    variant: "destructive" as const,
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Urgent",
    description: "Requires immediate attention",
  },
  high: {
    variant: "warning" as const,
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "High Priority",
    description: "Important announcement",
  },
  medium: {
    variant: "secondary" as const,
    icon: <BellRing className="h-4 w-4" />,
    label: "Medium Priority",
    description: "General notice",
  },
  low: {
    variant: "default" as const,
    icon: <Info className="h-4 w-4" />,
    label: "Low Priority",
    description: "Informational notice",
  },
};

const STATUS_CONFIG = {
  published: {
    variant: "success" as const,
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: "Published",
  },
  draft: {
    variant: "secondary" as const,
    icon: <Clock className="h-4 w-4" />,
    label: "Draft",
  },
  scheduled: {
    variant: "warning" as const,
    icon: <TimerIcon className="h-4 w-4" />,
    label: "Scheduled",
  },
  expired: {
    variant: "destructive" as const,
    icon: <XCircle className="h-4 w-4" />,
    label: "Expired",
  },
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  school_admin: "School Admin",
  teacher: "Teachers",
  student: "Students",
  parent: "Parents",
  librarian: "Librarian",
};

export default function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);

  const notice = mockNotices.find((n) => n.id === id);

  if (!notice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Bell className="h-12 w-12 text-zinc-700" />
        <h2 className="text-xl font-semibold text-white">Notice Not Found</h2>
        <p className="text-zinc-500">
          The notice you are looking for does not exist.
        </p>
        <Button asChild>
          <Link href="/dashboard/notices">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notices
          </Link>
        </Button>
      </div>
    );
  }

  const priorityCfg = PRIORITY_CONFIG[notice.priority] ?? PRIORITY_CONFIG.low;
  const statusCfg =
    STATUS_CONFIG[notice.status] ?? STATUS_CONFIG.draft;

  const handleDelete = () => {
    toast.success(`Notice "${notice.title}" deleted`);
    router.push("/dashboard/notices");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notice Detail"
        description="View full notice information"
        breadcrumbs={[
          { label: "Notices", href: "/dashboard/notices" },
          { label: notice.title },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild id="edit-notice-btn">
              <Link href={`/dashboard/notices/${notice.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDelete(true)}
              id="delete-notice-btn"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        }
      />

      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div
          className={`h-2 ${
            notice.priority === "urgent"
              ? "bg-red-500"
              : notice.priority === "high"
              ? "bg-yellow-500"
              : notice.priority === "medium"
              ? "bg-blue-500"
              : "bg-zinc-500"
          }`}
        />
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap gap-2">
                <Badge variant={priorityCfg.variant} className="gap-1">
                  {priorityCfg.icon}
                  {priorityCfg.label}
                </Badge>
                <Badge variant={statusCfg.variant} className="gap-1">
                  {statusCfg.icon}
                  {statusCfg.label}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-white">{notice.title}</h2>
              <p className="text-sm text-zinc-500">{priorityCfg.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notice Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notice Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed text-base whitespace-pre-wrap">
                  {notice.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-400" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {notice.targetRoles.map((role) => (
                  <div
                    key={role}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-zinc-300">
                      {ROLE_LABELS[role] ?? role}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3">
                This notice is visible to {notice.targetRoles.length} audience
                group{notice.targetRoles.length > 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Metadata Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-zinc-500 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Author
                  </p>
                  <p className="text-sm font-medium text-zinc-200">
                    {notice.author}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-zinc-500 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Published Date
                  </p>
                  <p className="text-sm font-medium text-zinc-200">
                    {formatDate(notice.publishDate)}
                  </p>
                </div>
              </div>

              {notice.expiryDate && (
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-zinc-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">
                      Expiry Date
                    </p>
                    <p className="text-sm font-medium text-zinc-200">
                      {formatDate(notice.expiryDate)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Bell className="h-4 w-4 text-zinc-500 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Notice ID
                  </p>
                  <p className="text-sm font-mono text-zinc-400">{notice.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button
                className="w-full"
                asChild
                id="edit-btn-sidebar"
              >
                <Link href={`/dashboard/notices/${notice.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Notice
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href="/dashboard/notices">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Link>
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowDelete(true)}
                id="delete-btn-sidebar"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Notice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Notice</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-white">
              &quot;{notice.title}&quot;
            </span>
            ? This cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDelete(false)}
              id="cancel-delete-detail-btn"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              id="confirm-delete-detail-btn"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
