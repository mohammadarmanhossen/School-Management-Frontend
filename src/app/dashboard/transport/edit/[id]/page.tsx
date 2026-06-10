"use client";

import { use, useEffect, useState } from "react";
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
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { useTransportStore } from "@/store";

export default function EditTransportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const getVehicleById = useTransportStore((state) => state.getVehicleById);
  const updateVehicle = useTransportStore((state) => state.updateVehicle);
  const [mounted, setMounted] = useState(false);

  const vehicle = getVehicleById(id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (vehicle) {
      reset({
        registrationNumber: vehicle.registrationNumber,
        model: vehicle.model,
        capacity: vehicle.capacity,
        driverName: vehicle.driverName,
        driverPhone: vehicle.driverPhone,
        routeName: vehicle.routeName,
        status: vehicle.status,
      });
      // Ensure the setValue is synced if we need it, though reset handles it
    }
  }, [vehicle, reset]);

  if (!mounted) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!vehicle) {
    notFound();
  }

  const onSubmit = async (data: VehicleFormData) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      updateVehicle(id, data);
      toast.success("Vehicle updated successfully");
      router.push("/dashboard/transport");
    } catch (error) {
      toast.error("Failed to update vehicle");
    }
  };

  const onError = (errors: FieldErrors<VehicleFormData>) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Vehicle"
        description={`Edit details for ${vehicle.registrationNumber}`}
        breadcrumbs={[
          { label: "Transport", href: "/dashboard/transport" },
          { label: "Edit Vehicle" },
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
              <Input type="number" {...register("capacity", { valueAsNumber: true })} placeholder="e.g. 40" />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue={vehicle.status} onValueChange={(v) => setValue("status", v as VehicleFormData["status"], { shouldValidate: true })}>
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
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
