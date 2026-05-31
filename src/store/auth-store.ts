import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthTokens } from "@/types";
import { TOKEN_KEY, REFRESH_TOKEN_KEY, REMEMBER_ME_KEY } from "@/constants";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  setAuth: (user: User, tokens: AuthTokens, rememberMe?: boolean) => void;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      rememberMe: false,

      setAuth: (user, tokens, rememberMe = false) => {
        const cookieOptions = rememberMe ? { expires: 30 } : undefined;
        Cookies.set(TOKEN_KEY, tokens.access, cookieOptions);
        Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh, cookieOptions);
        Cookies.set(REMEMBER_ME_KEY, String(rememberMe), cookieOptions);
        set({ user, tokens, isAuthenticated: true, isLoading: false, rememberMe });
      },

      setUser: (user) => set({ user }),

      setTokens: (tokens) => {
        const rememberMe = get().rememberMe;
        const cookieOptions = rememberMe ? { expires: 30 } : undefined;
        Cookies.set(TOKEN_KEY, tokens.access, cookieOptions);
        Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh, cookieOptions);
        set({ tokens });
      },

      logout: () => {
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
        Cookies.remove(REMEMBER_ME_KEY);
        set({ user: null, tokens: null, isAuthenticated: false, isLoading: false, rememberMe: false });
      },

      setLoading: (isLoading) => set({ isLoading }),

      getAccessToken: () => get().tokens?.access ?? Cookies.get(TOKEN_KEY) ?? null,
      getRefreshToken: () => get().tokens?.refresh ?? Cookies.get(REFRESH_TOKEN_KEY) ?? null,
    }),
    {
      name: "sms-auth-storage",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
      }),
    }
  )
);
