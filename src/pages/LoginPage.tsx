import { useState } from 'react';
import { supabase } from '../services/supabase';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-violet-600/6 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[80px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-sm px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center">
          
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-white tracking-tight">BlueMinds AI</h1>
              <p className="text-[13px] text-white/35 mt-1 font-light">Autonomous AI — Code, Deploy, Automate</p>
            </div>
          </div>

          {/* Card */}
          <div className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-[15px] font-medium text-white mb-1">Welcome back</h2>
            <p className="text-[13px] text-white/40 mb-6">Sign in to your AI workspace</p>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/95 text-gray-800 font-medium text-[14px] py-2.5 px-4 rounded-xl transition-all duration-150 disabled:opacity-60 shadow-sm"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <p className="text-center text-[11px] text-white/20 mt-5 leading-relaxed">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Features */}
          <div className="flex items-center gap-6 mt-8">
            {[
              { icon: '⚡', text: 'AI Models' },
              { icon: '🖥️', text: 'Live Terminal' },
              { icon: '🔗', text: 'GitHub & Deploy' }
            ].map(f => (
              <div key={f.text} className="flex flex-col items-center gap-1">
                <span className="text-lg">{f.icon}</span>
                <span className="text-[11px] text-white/25">{f.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
