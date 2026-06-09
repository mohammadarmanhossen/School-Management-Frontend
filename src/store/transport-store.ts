import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VehicleFormData } from "@/schemas";
import type { Vehicle } from "@/types";

interface TransportStore {
  vehicles: Vehicle[];
  addVehicle: (data: VehicleFormData) => Vehicle;
  updateVehicle: (id: string, data: Partial<VehicleFormData>) => Vehicle | undefined;
  deleteVehicle: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
}

export const useTransportStore = create<TransportStore>()(
  persist(
    (set, get) => ({
      vehicles: [],

      addVehicle: (data) => {
        const newVehicle: Vehicle = {
          id: crypto.randomUUID?.() || `vehicle-${Date.now()}`,
          registrationNumber: data.registrationNumber,
          model: data.model,
          capacity: data.capacity,
          driverName: data.driverName,
          driverPhone: data.driverPhone,
          routeName: data.routeName,
          status: data.status,
        };
        set((state) => ({ vehicles: [...state.vehicles, newVehicle] }));
        return newVehicle;
      },

      updateVehicle: (id, data) => {
        let updated: Vehicle | undefined;
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) => {
            if (vehicle.id !== id) return vehicle;
            updated = {
              ...vehicle,
              ...data,
            };
            return updated;
          }),
        }));
        return updated;
      },

      deleteVehicle: (id) => {
        set((state) => ({
          vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
        }));
      },

      getVehicleById: (id) => get().vehicles.find((vehicle) => vehicle.id === id),
    }),
    {
      name: "transport-storage",
    }
  )
);
