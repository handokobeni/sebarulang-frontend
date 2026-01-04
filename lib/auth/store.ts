/**
 * Auth Store (Zustand)
 * Global client state for authentication
 * 
 * ⚠️ Important: Tokens (access_token, refresh_token) are NOT stored here.
 * Tokens are stored in httpOnly cookies by the backend and cannot be accessed from JavaScript.
 * Only non-sensitive user data is stored in this store.
 */

import { create } from "zustand";

// User type (will be defined in types when auth feature is implemented)
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user: User) =>
    set({
      user,
      isAuthenticated: true,
    }),

  logout: () => {
    // ✅ Best Practice: Clear all state
    set({
      user: null,
      isAuthenticated: false,
    });

    // ✅ Best Practice: Clear session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("user");
      // Cookies will be cleared by backend
    }
  },
}));

