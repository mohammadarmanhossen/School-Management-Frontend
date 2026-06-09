"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
  BookOpen,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn, formatDate, getInitials } from "@/lib/utils";
import type {
  ApplicationStatus,
  StudentAdmissionRequest,
  TeacherApplicationRequest,
} from "@/types";

type ApplicationItem =
  | { type: "student"; data: StudentAdmissionRequest }
  | { type: "teacher"; data: TeacherApplicationRequest };

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; variant: "warning" | "success" | "destructive" }
> = {
  pending: { label: "Pending", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
};

interface ApplicationReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationItem | null;
  onReview: (
    id: string,
    status: "accepted" | "rejected",
    reviewNote?: string
  ) => Promise<void>;
  isLoading?: boolean;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
        <Icon className="h-4 w-4 text-zinc-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

export function ApplicationReviewDialog({
  open,
  onOpenChange,
  application,
  onReview,
  isLoading = false,
}: ApplicationReviewDialogProps) {
  const [reviewNote, setReviewNote] = useState("");
  const [pendingAction, setPendingAction] = useState<"accepted" | "rejected" | null>(null);

  const handleReview = async (status: "accepted" | "rejected") => {
    if (!application) return;
    setPendingAction(status);
    await onReview(application.data.id, status, reviewNote || undefined);
    setReviewNote("");
    setPendingAction(null);
    onOpenChange(false);
  };

  if (!application) return null;

  const { data } = application;
  const statusCfg = STATUS_CONFIG[data.status];
  const isPending = data.status === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0a0a0a] sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold",
                application.type === "student"
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-emerald-500/15 text-emerald-400"
              )}
            >
              {getInitials(data.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-left text-xl text-white">
                {data.full_name}
              </DialogTitle>
              <DialogDescription className="text-left">
                {application.type === "student" ? "Student admission" : "Teacher application"}{" "}
                · Submitted {formatDate(data.submittedAt)}
              </DialogDescription>
              <Badge variant={statusCfg.variant} className="mt-2">
                {statusCfg.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          {application.type === "student" ? (
            <>
              <DetailRow
                icon={GraduationCap}
                label="Class applying for"
                value={(application.data as StudentAdmissionRequest).class_name}
              />
              <DetailRow
                icon={Calendar}
                label="Date of birth"
                value={formatDate((application.data as StudentAdmissionRequest).dob)}
              />
              <DetailRow
                icon={User}
                label="Gender"
                value={
                  (application.data as StudentAdmissionRequest).gender.charAt(0).toUpperCase() +
                  (application.data as StudentAdmissionRequest).gender.slice(1)
                }
              />
              <DetailRow icon={Phone} label="Phone" value={application.data.phone} />
              <DetailRow icon={MapPin} label="Address" value={application.data.address} />
            </>
          ) : (
            <>
              <DetailRow
                icon={Briefcase}
                label="Subject"
                value={(application.data as TeacherApplicationRequest).subject}
              />
              <DetailRow
                icon={BookOpen}
                label="Qualification"
                value={(application.data as TeacherApplicationRequest).qualification}
              />
              <DetailRow
                icon={Calendar}
                label="Experience"
                value={(application.data as TeacherApplicationRequest).experience}
              />
              <DetailRow icon={Phone} label="Phone" value={application.data.phone} />
              <DetailRow
                icon={Mail}
                label="Email"
                value={(application.data as TeacherApplicationRequest).email}
              />
              <DetailRow icon={MapPin} label="Address" value={application.data.address} />
            </>
          )}
        </div>

        {data.reviewedAt && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs text-zinc-500">
              Reviewed on {formatDate(data.reviewedAt)}
            </p>
            {data.reviewNote && (
              <p className="mt-1 text-sm text-zinc-300">{data.reviewNote}</p>
            )}
          </div>
        )}

        {isPending && (
          <div className="space-y-4 border-t border-white/[0.06] pt-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Review note (optional)</Label>
              <Textarea
                placeholder="Add a note for rejection or internal reference..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="min-h-[80px] border-white/10 bg-white/[0.03] text-zinc-200"
              />
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.04]"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isLoading}
                onClick={() => handleReview("rejected")}
              >
                {pendingAction === "rejected" && isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Reject
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-600/90"
                disabled={isLoading}
                onClick={() => handleReview("accepted")}
              >
                {pendingAction === "accepted" && isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Accept
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export type { ApplicationItem };
