import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ugujwkdtepgaahdrydhi.supabase.co';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KFtTFS2xpNj88erByVA7yA_cPBEZBA0';

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);

  export async function signUpWithEmail(email: string, password: string) {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) throw error;
    return data;
  }

  export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  