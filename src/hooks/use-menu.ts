"use client";

import { useEffect } from "react";
import { useAuthStore, useMenuStore } from "@/store";
import { menuService, getDemoMenus } from "@/services/menu-service";

export function useMenu() {
  const { user, isAuthenticated, getAccessToken } = useAuthStore();
  const { items, isLoading, error, setItems, setLoading, setError, clear } = useMenuStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      clear();
      return;
    }

    let cancelled = false;

    async function fetchMenus() {
      setLoading(true);
      try {
        const token = getAccessToken();
        const isDemo = token === "demo-access-token";
        const response = isDemo
          ? { menus: getDemoMenus(user!.role) }
          : await menuService.getMenus();

        if (!cancelled) {
          setItems(response.menus);
        }
      } catch {
        if (!cancelled) {
          setItems(getDemoMenus(user!.role));
        }
      }
    }

    fetchMenus();
    return () => {
      cancelled = true;
    };
  }, [user, isAuthenticated, getAccessToken, setItems, setLoading, setError, clear]);

  return { items, isLoading, error };
}
