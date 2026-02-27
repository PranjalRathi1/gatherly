import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* =========================================
   USER TYPE
========================================= */

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  penguinEnabled?: boolean;

  // ✅ Role system
  role: 'user' | 'creator' | 'admin';
  creatorRequestStatus: 'none' | 'pending' | 'approved' | 'rejected';
}

/* =========================================
   AUTH STATE
========================================= */

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
}

/* =========================================
   STORE
========================================= */

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      setAuthenticated: (isAuthenticated) =>
        set({ isAuthenticated }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      setError: (error) =>
        set({ error }),

      /* =========================================
         LOGIN (SAFE ROLE DEFAULTING)
      ========================================== */

      login: (user, token) =>
        set({
          user: {
            ...user,
            role: user.role ?? 'user',
            creatorRequestStatus:
              user.creatorRequestStatus ?? 'none'
          },
          token,
          isAuthenticated: true,
          error: null
        }),

      /* =========================================
         LOGOUT
      ========================================== */

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        }),

      clearError: () => set({ error: null })
    }),
    {
      name: 'gatherly-auth-storage',

      // Only persist what matters
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;