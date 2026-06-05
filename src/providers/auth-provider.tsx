"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore, useMenuStore } from "@/store";
import { TOKEN_KEY } from "@/constants";
import { authService } from "@/services";
import { normalizeRole } from "@/utils/role-mapper";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setUser, setLoading, logout, tokens, user, isAuthenticated } = useAuthStore();
  const { clear: clearMenus } = useMenuStore();

  useEffect(() => {
    async function restoreSession() {
      const token = Cookies.get(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      if (token === "demo-access-token" && user) {
        setLoading(false);
        return;
      }

      if (isAuthenticated && user) {
        setLoading(false);
        return;
      }

      try {
        const me = await authService.me();
        const normalizedUser = {
          ...me,
          role: normalizeRole(me.role as never),
        };
        if (tokens) {
          setAuth(normalizedUser, tokens);
        } else {
          setUser(normalizedUser);
          setLoading(false);
        }
      } catch {
        logout();
        clearMenus();
      }
    }

    restoreSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
