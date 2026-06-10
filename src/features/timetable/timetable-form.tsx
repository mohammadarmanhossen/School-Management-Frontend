"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTimetableStore, useClassStore } from "@/store";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

const timetableSchema = z.object({
  subjectName: z.string().min(1, "Subject is required"),
  className: z.string().min(1, "Class is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  room: z.string().optional(),
  day: z.string().min(1, "Day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  type: z.enum(["Lecture", "Lab", "Practical", "Break"]).optional(),
}).refine((data) => {
  return data.startTime < data.endTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type TimetableFormData = z.infer<typeof timetableSchema>;

export function TimetableForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addEntry } = useTimetableStore();
  const classes = useClassStore((state) => state.classes);
  
  const teachers = [
    { id: "teacher-1", name: "Mohammad Karim" },
    { id: "teacher-2", name: "Sharmin Akter" },
    { id: "teacher-3", name: "Abdul Jabbar" },
    { id: "teacher-4", name: "Nusrat Jahan" },
    { id: "teacher-5", name: "Imran Hossain" },
  ];

  const [conflictError, setConflictError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TimetableFormData>({
    resolver: zodResolver(timetableSchema),
    defaultValues: { type: "Lecture" }
  });

  const onSubmit = (data: TimetableFormData) => {
    setConflictError(null);
    const teacherName = teachers.find(t => t.id === data.teacherId)?.name || "";
    
    const newEntry = {
      ...data,
      teacherName,
    };

    const result = addEntry(newEntry);
    
    if (!result.success && result.conflict) {
      setConflictError(result.conflict.message);
      return;
    }

    toast.success("Timetable entry added successfully");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {conflictError && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Scheduling Conflict Detected</h4>
            <p className="text-sm mt-1">{conflictError}</p>
          </div>
        </div>
      )}
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Subject Name</Label>
          <Input {...register("subjectName")} placeholder="e.g. Mathematics" className="bg-white/[0.04]" />
          {errors.subjectName && <p className="text-xs text-red-500">{errors.subjectName.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Class</Label>
          <Select onValueChange={(val) => setValue("className", val)}>
            <SelectTrigger className="bg-white/[0.04]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.length ? classes.map((c) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              )) : (
                <>
                  <SelectItem value="Class 9">Class 9</SelectItem>
                  <SelectItem value="Class 10">Class 10</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          {errors.className && <p className="text-xs text-red-500">{errors.className.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Teacher</Label>
          <Select onValueChange={(val) => setValue("teacherId", val)}>
            <SelectTrigger className="bg-white/[0.04]">
              <SelectValue placeholder="Select Teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teacherId && <p className="text-xs text-red-500">{errors.teacherId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Room / Lab</Label>
          <Input {...register("room")} placeholder="e.g. 101 or Lab 1" className="bg-white/[0.04]" />
        </div>

        <div className="space-y-2">
          <Label>Day</Label>
          <Select onValueChange={(val) => setValue("day", val)}>
            <SelectTrigger className="bg-white/[0.04]">
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sunday">Sunday</SelectItem>
              <SelectItem value="Monday">Monday</SelectItem>
              <SelectItem value="Tuesday">Tuesday</SelectItem>
              <SelectItem value="Wednesday">Wednesday</SelectItem>
              <SelectItem value="Thursday">Thursday</SelectItem>
            </SelectContent>
          </Select>
          {errors.day && <p className="text-xs text-red-500">{errors.day.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Session Type</Label>
          <Select onValueChange={(val: any) => setValue("type", val)} defaultValue="Lecture">
            <SelectTrigger className="bg-white/[0.04]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lecture">Lecture</SelectItem>
              <SelectItem value="Lab">Lab</SelectItem>
              <SelectItem value="Practical">Practical</SelectItem>
              <SelectItem value="Break">Break</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input type="time" {...register("startTime")} className="bg-white/[0.04]" />
          {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>End Time</Label>
          <Input type="time" {...register("endTime")} className="bg-white/[0.04]" />
          {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Add to Schedule</Button>
    </form>
  );
}
