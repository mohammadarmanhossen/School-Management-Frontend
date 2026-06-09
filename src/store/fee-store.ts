import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FeeFormData } from "@/schemas";
import type { Fee } from "@/types";

interface FeeStore {
  fees: Fee[];
  addFee: (data: FeeFormData, studentName: string) => Fee;
  updateFee: (id: string, data: Partial<FeeFormData> & { studentName?: string }) => Fee | undefined;
  deleteFee: (id: string) => void;
  getFeeById: (id: string) => Fee | undefined;
}

export const useFeeStore = create<FeeStore>()(
  persist(
    (set, get) => ({
      fees: [],

      addFee: (data, studentName) => {
        const newFee: Fee = {
          id: crypto.randomUUID?.() || `fee-${Date.now()}`,
          studentId: data.studentId,
          studentName: studentName,
          category: data.category,
          amount: data.amount,
          paidAmount: data.status === "paid" ? data.amount : 0,
          dueDate: data.dueDate,
          status: data.status,
          paymentMethod: data.status === "paid" ? "cash" : undefined, // default or none
        };
        set((state) => ({ fees: [...state.fees, newFee] }));
        return newFee;
      },

      updateFee: (id, data) => {
        let updated: Fee | undefined;
        set((state) => ({
          fees: state.fees.map((fee) => {
            if (fee.id !== id) return fee;
            updated = {
              ...fee,
              ...data,
              studentName: data.studentName || fee.studentName,
              paidAmount: data.status === "paid" ? (data.amount || fee.amount) : fee.paidAmount,
            };
            return updated;
          }),
        }));
        return updated;
      },

      deleteFee: (id) => {
        set((state) => ({
          fees: state.fees.filter((fee) => fee.id !== id),
        }));
      },

      getFeeById: (id) => get().fees.find((fee) => fee.id === id),
    }),
    {
      name: "fees-storage",
    }
  )
);
