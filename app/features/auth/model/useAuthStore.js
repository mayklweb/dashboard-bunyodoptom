import { create } from "zustand";
import { saveSession, logout as clearSession } from "@/lib/auth";

const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const useAuthStore = create((set) => ({
  token: storedToken,
  isAuthenticated: !!storedToken,

  login: (token) => {
    saveSession(token);
    set({ token, isAuthenticated: true });
  },

  signup: (token) => {
    saveSession(token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    clearSession();
    set({ token: null, isAuthenticated: false });
  },
}));