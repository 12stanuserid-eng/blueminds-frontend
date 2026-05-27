import { create } from 'zustand';
  import { persist } from 'zustand/middleware';
  import { supabase, signInWithEmail, signUpWithEmail, signOut as supabaseSignOut } from '../services/supabase';

  interface User { id: string; email: string; name: string; avatar?: string; }

  interface AuthStore {
    user: User | null;
    loading: boolean;
    initialize: () => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
  }

  export const useAuthStore = create<AuthStore>()(
    persist(
      (set, get) => ({
        user: null,
        loading: true,

        initialize: () => {
          // Restore from Supabase session
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              set({
                user: {
                  id: session.user.id,
                  email: session.user.email ?? '',
                  name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                  avatar: session.user.user_metadata?.avatar_url,
                },
                loading: false,
              });
            } else {
              set({ loading: false });
            }
          });

          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              set({
                user: {
                  id: session.user.id,
                  email: session.user.email ?? '',
                  name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                  avatar: session.user.user_metadata?.avatar_url,
                },
                loading: false,
              });
            } else {
              set({ user: null, loading: false });
            }
          });
        },

        login: async (email: string, password: string) => {
          const data = await signInWithEmail(email, password);
          if (data.user) {
            set({
              user: {
                id: data.user.id,
                email: data.user.email ?? '',
                name: data.user.user_metadata?.full_name || email.split('@')[0],
                avatar: data.user.user_metadata?.avatar_url,
              },
            });
          }
        },

        signup: async (email: string, password: string) => {
          const data = await signUpWithEmail(email, password);
          if (data.user) {
            set({
              user: {
                id: data.user.id,
                email: data.user.email ?? '',
                name: email.split('@')[0],
              },
            });
          }
        },

        signOut: async () => {
          await supabaseSignOut();
          set({ user: null });
          localStorage.removeItem('blueminds-chat');
        },
      }),
      {
        name: 'blueminds-auth',
        partialize: (state) => ({ user: state.user }),
      }
    )
  );
  