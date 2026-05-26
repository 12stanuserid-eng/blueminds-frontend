import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { syncUser } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        syncUser(session).then(() => navigate('/'));
      } else {
        navigate('/login');
      }
    });
  }, [navigate, syncUser]);

  return (
    <div className="flex items-center justify-center h-screen bg-surface-950">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-surface-400 text-sm">Completing sign-in...</p>
      </div>
    </div>
  );
}
