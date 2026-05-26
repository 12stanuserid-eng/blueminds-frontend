import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, signInWithGoogle, signOut } from '../services/supabase';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  syncUser: (session: any) => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          await signInWithGoogle();
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      syncUser: async (session) => {
        if (!session?.access_token) return;
        try {
          const res = await api.post('/api/auth/google', {
            access_token: session.access_token,
            user: session.user
          });
          const { user, token } = res.data;
          localStorage.setItem('bm_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err) {
          console.error('Sync error:', err);
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await signOut();
        localStorage.removeItem('bm_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) localStorage.setItem('bm_token', token);
        else localStorage.removeItem('bm_token');
        set({ token });
      }
    }),
    { name: 'bm-auth', partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);
