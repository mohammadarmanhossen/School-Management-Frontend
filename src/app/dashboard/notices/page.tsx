"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Bell,
  BellRing,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockNotices, filterItems } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Notice } from "@/types";
import { toast } from "sonner";

const PRIORITY_CONFIG: Record<
  string,
  {
    variant: "destructive" | "warning" | "secondary" | "default";
    icon: React.ReactNode;
    label: string;
  }
> = {
  urgent: {
    variant: "destructive",
    icon: <AlertCircle className="h-3 w-3" />,
    label: "Urgent",
  },
  high: {
    variant: "warning",
    icon: <AlertTriangle className="h-3 w-3" />,
    label: "High",
  },
  medium: {
    variant: "secondary",
    icon: <BellRing className="h-3 w-3" />,
    label: "Medium",
  },
  low: {
    variant: "default",
    icon: <Info className="h-3 w-3" />,
    label: "Low",
  },
};

const STATUS_VARIANT: Record<
  string,
  "success" | "secondary" | "warning" | "destructive" | "default"
> = {
  published: "success",
  draft: "secondary",
  scheduled: "warning",
  expired: "destructive",
};

export default function NoticesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  const filtered = useMemo(() => {
    let items = filterItems(notices, search, ["title", "author", "content"]);
    if (priorityFilter !== "all")
      items = items.filter((n) => n.priority === priorityFilter);
    if (statusFilter !== "all")
      items = items.filter((n) => n.status === statusFilter);
    return items;
  }, [notices, search, priorityFilter, statusFilter]);

  const handleDelete = (notice: Notice) => {
    setNotices((prev) => prev.filter((n) => n.id !== notice.id));
    setDeleteTarget(null);
    toast.success(`Notice "${notice.title}" deleted successfully`);
  };

  const columns: ColumnDef<Notice>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-[280px]">
          <p className="font-medium text-white truncate">{row.original.title}</p>
          <p className="text-xs text-zinc-500 truncate mt-0.5">
            {row.original.content}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-400">
              {row.original.author.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-zinc-300">{row.original.author}</span>
        </div>
      ),
    },
    {
      accessorKey: "targetRoles",
      header: "Audience",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.targetRoles.slice(0, 2).map((role) => (
            <Badge key={role} variant="outline" className="text-xs capitalize px-1.5 py-0">
              {role.replace("_", " ")}
            </Badge>
          ))}
          {row.original.targetRoles.length > 2 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              +{row.original.targetRoles.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const cfg = PRIORITY_CONFIG[row.original.priority] ?? PRIORITY_CONFIG.low;
        return (
          <Badge variant={cfg.variant} className="gap-1">
            {cfg.icon}
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "publishDate",
      header: "Published",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-400">
          {formatDate(row.original.publishDate)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status] ?? "default"} className="capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" id={`notice-action-${row.original.id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/notices/${row.original.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/notices/${row.original.id}/edit`)
              }
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteTarget(row.original)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notices"
        description="Create and manage school announcements"
        breadcrumbs={[{ label: "Notices" }]}
        actions={
          <Button asChild id="create-notice-btn">
            <Link href="/dashboard/notices/create">
              <Plus className="mr-2 h-4 w-4" /> Create Notice
            </Link>
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total Notices",
            value: notices.length,
            icon: Bell,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Published",
            value: notices.filter((n) => n.status === "published").length,
            icon: BellRing,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
          {
            label: "Urgent",
            value: notices.filter((n) => n.priority === "urgent").length,
            icon: AlertCircle,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
          {
            label: "Drafts",
            value: notices.filter((n) => n.status === "draft").length,
            icon: Info,
            color: "text-zinc-400",
            bg: "bg-zinc-500/10",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="dashboard-card flex items-center gap-3 p-4"
          >
            <div className={`rounded-lg p-2 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search notices..."
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]" id="priority-filter">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]" id="status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {notices.length} notices
      </p>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Notice</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">
              &quot;{deleteTarget?.title}&quot;
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              id="cancel-delete-btn"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              id="confirm-delete-btn"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
