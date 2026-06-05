import { create } from "zustand";
import type { MenuItem } from "@/types";

interface MenuState {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: MenuItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  items: [],
  isLoading: true,
  error: null,
  setItems: (items) => set({ items, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clear: () => set({ items: [], isLoading: false, error: null }),
}));
