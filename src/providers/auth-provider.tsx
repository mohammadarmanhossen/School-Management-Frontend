"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/constants";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setLoading, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    if (token && isAuthenticated && user) {
      setLoading(false);
    } else if (!token) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [setLoading, isAuthenticated, user]);

  return <>{children}</>;
}
