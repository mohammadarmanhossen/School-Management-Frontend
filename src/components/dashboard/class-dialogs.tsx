"use client";

import { useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassRoom, Teacher } from "@/types";

interface AssignTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classRoom: ClassRoom | null;
  teachers: Teacher[];
  onAssign: (classId: string, teacherId: string) => Promise<void>;
  isLoading?: boolean;
}

export function AssignTeacherDialog({
  open,
  onOpenChange,
  classRoom,
  teachers,
  onAssign,
  isLoading = false,
}: AssignTeacherDialogProps) {
  const [teacherId, setTeacherId] = useState("");

  useEffect(() => {
    if (open && classRoom) {
      setTeacherId(classRoom.teacherId ?? "");
    }
  }, [open, classRoom]);

  const handleAssign = async () => {
    if (!classRoom || !teacherId) return;
    await onAssign(classRoom.id, teacherId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Assign Class Teacher
          </DialogTitle>
          <DialogDescription>
            {classRoom
              ? `Select a teacher for ${classRoom.name} (Grade ${classRoom.grade}).`
              : "Select a teacher for this class."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label>Teacher</Label>
          <Select value={teacherId} onValueChange={setTeacherId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.fullName} — {teacher.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!teacherId || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign Teacher
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classRoom: ClassRoom | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteClassDialog({
  open,
  onOpenChange,
  classRoom,
  onConfirm,
  isLoading = false,
}: DeleteClassDialogProps) {
  const handleDelete = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Class</DialogTitle>
          <DialogDescription>
            {classRoom ? (
              <>
                Are you sure you want to delete <strong>{classRoom.name}</strong>? This action
                cannot be undone.
                {classRoom.studentCount > 0 && (
                  <span className="mt-2 block text-destructive">
                    Warning: This class has {classRoom.studentCount} enrolled students.
                  </span>
                )}
              </>
            ) : (
              "Are you sure you want to delete this class?"
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
