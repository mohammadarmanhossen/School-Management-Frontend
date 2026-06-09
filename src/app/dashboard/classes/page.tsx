"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  GraduationCap,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AssignTeacherDialog,
  DeleteClassDialog,
} from "@/components/dashboard/class-dialogs";
import { useClasses, useClassMutations, useTeachersForSelect } from "@/hooks/use-classes-data";
import type { ClassRoom } from "@/types";

export default function ClassesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [assignTarget, setAssignTarget] = useState<ClassRoom | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClassRoom | null>(null);

  const { data: classes = [], isLoading } = useClasses();
  const { data: teachers = [] } = useTeachersForSelect();
  const { remove, assignTeacher } = useClassMutations();

  const filtered = useMemo(
    () =>
      classes.filter(
        (cls) =>
          cls.name.toLowerCase().includes(search.toLowerCase()) ||
          cls.teacherName?.toLowerCase().includes(search.toLowerCase()) ||
          cls.academicYear.includes(search)
      ),
    [classes, search]
  );

  const columns: ColumnDef<ClassRoom>[] = [
    {
      accessorKey: "name",
      header: "Class",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">Grade {row.original.grade}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "teacherName",
      header: "Class Teacher",
      cell: ({ row }) =>
        row.original.teacherName ? (
          <span>{row.original.teacherName}</span>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Unassigned
          </Badge>
        ),
    },
    {
      id: "enrollment",
      header: "Enrollment",
      cell: ({ row }) => {
        const pct = Math.round((row.original.studentCount / row.original.capacity) * 100);
        return (
          <div className="min-w-[120px] space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {row.original.studentCount} / {row.original.capacity}
              </span>
              <span>{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        );
      },
    },
    {
      accessorKey: "academicYear",
      header: "Academic Year",
      cell: ({ row }) => <Badge variant="secondary">{row.original.academicYear}</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/classes/edit/${row.original.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit Class
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAssignTarget(row.original)}>
              <UserPlus className="mr-2 h-4 w-4" /> Assign Teacher
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
        title="Classes"
        description="Create, update, and manage classes. Assign teachers to each class."
        breadcrumbs={[{ label: "Classes" }]}
        actions={
          <Button asChild>
            <Link href="/dashboard/classes/create">
              <Plus className="mr-2 h-4 w-4" /> Create Class
            </Link>
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search classes or teachers..."
        className="sm:max-w-sm"
      />

      <DataTable columns={columns} data={filtered} isLoading={isLoading} />

      <AssignTeacherDialog
        open={!!assignTarget}
        onOpenChange={(open) => !open && setAssignTarget(null)}
        classRoom={assignTarget}
        teachers={teachers}
        isLoading={assignTeacher.isPending}
        onAssign={async (classId, teacherId) => {
          await assignTeacher.mutateAsync({ classId, teacherId });
        }}
      />

      <DeleteClassDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        classRoom={deleteTarget}
        isLoading={remove.isPending}
        onConfirm={async () => {
          if (deleteTarget) await remove.mutateAsync(deleteTarget.id);
        }}
      />
    </div>
  );
}
