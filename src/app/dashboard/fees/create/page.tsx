"use client";

import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { feeSchema, type FeeFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { mockStudents } from "@/lib/mock-data";
import { useFeeStore } from "@/store";

export default function CreateFeePage() {
  const router = useRouter();
  const addFee = useFeeStore((state) => state.addFee);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues: { status: "pending" },
  });

  const onSubmit = async (data: FeeFormData) => {
    const student = mockStudents.find((s) => s.id === data.studentId);
    addFee(data, student?.fullName || "Unknown Student");
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Fee record created successfully!");
    router.push("/dashboard/fees");
  };

  const onError = (errors: FieldErrors<FeeFormData>) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Fee"
        description="Create a new fee record for a student"
        breadcrumbs={[
          { label: "Fees", href: "/dashboard/fees" },
          { label: "Add Fee" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Fee Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studentId">
                Student <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  setValue("studentId", val, { shouldValidate: true })
                }
              >
                <SelectTrigger id="studentId">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName} ({student.rollNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studentId && (
                <p className="text-sm text-destructive">{errors.studentId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Fee Category <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  setValue("category", val, { shouldValidate: true })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                  <SelectItem value="Library Fee">Library Fee</SelectItem>
                  <SelectItem value="Transport Fee">Transport Fee</SelectItem>
                  <SelectItem value="Exam Fee">Exam Fee</SelectItem>
                  <SelectItem value="Hostel Fee">Hostel Fee</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                {...register("amount")}
                placeholder="e.g. 500"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate")}
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue="pending"
                onValueChange={(val) =>
                  setValue("status", val as FeeFormData["status"], { shouldValidate: true })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Create Fee Record"}
          </Button>
        </div>
      </form>
    </div>
  );
}
