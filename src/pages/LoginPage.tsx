import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function LoginPage() {
  const { isAuthenticated, isLoading, loginWithGoogle } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFlMjkzYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-2xl mb-4 shadow-lg shadow-brand/30"
          >
            <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
              <path d="M8 16C8 11.582 11.582 8 16 8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" fill="white" fillOpacity="0.3"/>
              <path d="M11 13h10M11 16.5h10M11 20h7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">BlueMinds AI</h1>
          <p className="text-surface-400 text-sm">Autonomous AI Agent — Code, Deploy, Automate</p>
        </div>

        {/* Card */}
        <div className="bg-surface-900/80 backdrop-blur border border-surface-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
            <p className="text-surface-400 text-sm">Sign in to continue to your AI workspace</p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-surface-500 text-xs">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[['🤖', 'AI Agent', 'Writes & deploys code'],['⚡', 'Real-time', 'Live terminal & streaming'],['🔧', 'Integrations', 'GitHub, Render, n8n']].map(([icon, title, desc]) => (
            <div key={title} className="bg-surface-900/40 border border-surface-800/50 rounded-xl p-3">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-white text-xs font-medium">{title}</div>
              <div className="text-surface-500 text-xs mt-0.5">{desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
