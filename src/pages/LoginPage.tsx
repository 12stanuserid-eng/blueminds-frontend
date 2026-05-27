import { useState } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { useAuthStore } from '../stores/authStore';
  import { useNavigate } from 'react-router-dom';

  export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login, signup } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      if (!email || !password) { setError('Email aur password dono bharein.'); return; }
      if (mode === 'signup' && password !== confirmPassword) { setError('Passwords match nahi kar rahe.'); return; }
      if (password.length < 6) { setError('Password kam se kam 6 characters ka hona chahiye.'); return; }

      setLoading(true);
      try {
        if (mode === 'login') {
          await login(email, password);
          navigate('/');
        } else {
          await signup(email, password);
          setSuccess('Account ban gaya! Apna email check karein aur verify karein, phir login karein.');
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } catch (err: any) {
        const msg = err?.message || 'Kuch galat ho gaya.';
        if (msg.includes('Invalid login credentials')) setError('Email ya password galat hai.');
        else if (msg.includes('User already registered')) setError('Yeh email pehle se registered hai. Login karein.');
        else if (msg.includes('Email not confirmed')) setError('Pehle email verify karein, phir login karein.');
        else setError(msg);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center px-4">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">BlueMinds AI</h1>
            <p className="text-sm text-white/40 mt-1">Your autonomous AI agent</p>
          </div>

          {/* Card */}
          <div className="bg-[#12121e] border border-white/8 rounded-2xl p-8 shadow-2xl">
            {/* Tab switcher */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              {(['login', 'signup'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setMode(tab); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === tab
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {tab === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="aapka@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-all"
                  required
                />
              </div>

              {/* Confirm Password (signup only) */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-all"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error / Success messages */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-2.5 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-400 text-sm">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {mode === 'login' ? 'Login ho raha hai...' : 'Account ban raha hai...'}
                  </span>
                ) : (
                  mode === 'login' ? 'Login Karein' : 'Account Banayein'
                )}
              </button>
            </form>

            <p className="text-center text-white/25 text-xs mt-6">
              {mode === 'login' ? 'Account nahi hai? ' : 'Pehle se account hai? '}
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                {mode === 'login' ? 'Sign Up karein' : 'Login karein'}
              </button>
            </p>
          </div>

          <p className="text-center text-white/20 text-xs mt-6">
            BlueMinds AI Agent • Powered by Kimi, Claude & GPT-4o
          </p>
        </motion.div>
      </div>
    );
  }
  