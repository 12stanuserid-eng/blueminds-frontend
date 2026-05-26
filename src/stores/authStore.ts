import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface User { id: string; email: string; name: string; avatar?: string; }

interface AuthStore {
  user: User | null;
  loading: boolean;
  initialize: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatar: session.user.user_metadata?.avatar_url
          },
          loading: false
        });
      } else {
        set({ user: null, loading: false });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatar: session.user.user_metadata?.avatar_url
          },
          loading: false
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  }
}));
