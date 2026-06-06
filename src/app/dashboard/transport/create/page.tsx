"use client";

import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { vehicleSchema, type VehicleFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CreateTransportPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { status: "active" },
  });

  const onSubmit = async (data: VehicleFormData) => {
    console.log("Submitting data:", data);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Vehicle created successfully");
    router.push("/dashboard/transport");
  };

  const onError = (errors: FieldErrors<VehicleFormData>) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Vehicle"
        description="Register a new vehicle for school transport"
        breadcrumbs={[
          { label: "Transport", href: "/dashboard/transport" },
          { label: "Add Vehicle" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Vehicle Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Registration Number <span className="text-destructive">*</span></Label>
              <Input {...register("registrationNumber")} placeholder="e.g. DHK-GA-1234" />
              {errors.registrationNumber && <p className="text-sm text-destructive">{errors.registrationNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Model <span className="text-destructive">*</span></Label>
              <Input {...register("model")} placeholder="e.g. Toyota Coaster" />
              {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Capacity <span className="text-destructive">*</span></Label>
              <Input type="number" {...register("capacity")} placeholder="e.g. 40" />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select onValueChange={(v) => setValue("status", v as VehicleFormData["status"], { shouldValidate: true })} defaultValue="active">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Driver & Route Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Driver Name <span className="text-destructive">*</span></Label>
              <Input {...register("driverName")} placeholder="Driver's full name" />
              {errors.driverName && <p className="text-sm text-destructive">{errors.driverName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Driver Phone <span className="text-destructive">*</span></Label>
              <Input {...register("driverPhone")} placeholder="Driver's phone number" />
              {errors.driverPhone && <p className="text-sm text-destructive">{errors.driverPhone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Route Name <span className="text-destructive">*</span></Label>
              <Input {...register("routeName")} placeholder="e.g. Route A - Dhanmondi" />
              {errors.routeName && <p className="text-sm text-destructive">{errors.routeName.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Vehicle
          </Button>
        </div>
      </form>
    </div>
  );
}
