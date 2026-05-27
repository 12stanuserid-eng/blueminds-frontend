import { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { supabase } from '../services/supabase';

  export default function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [msg, setMsg] = useState('Email verify ho raha hai...');

    useEffect(() => {
      const handleCallback = async () => {
        try {
          const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
          const queryParams = new URLSearchParams(window.location.search);

          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const tokenHash = queryParams.get('token_hash');
          const type = queryParams.get('type') || hashParams.get('type');
          const code = queryParams.get('code');

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            setStatus('success');
            setMsg('Email verify ho gaya! Login ho raha hai...');
            setTimeout(() => navigate('/', { replace: true }), 1500);
          } else if (tokenHash && type) {
            const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any });
            if (error) throw error;
            setStatus('success');
            setMsg('Email verify ho gaya! Login ho raha hai...');
            setTimeout(() => navigate('/', { replace: true }), 1500);
          } else if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;
            setStatus('success');
            setMsg('Email verify ho gaya! Login ho raha hai...');
            setTimeout(() => navigate('/', { replace: true }), 1500);
          } else {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              navigate('/', { replace: true });
            } else {
              setStatus('error');
              setMsg('Verification link expire ho gayi ya invalid hai. Dobara signup karein.');
            }
          }
        } catch (err: any) {
          console.error('Auth callback error:', err);
          setStatus('error');
          setMsg(err?.message || 'Verification fail ho gayi. Dobara try karein.');
        }
      };
      handleCallback();
    }, [navigate]);

    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative flex flex-col items-center gap-5 text-center max-w-sm">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${
            status === 'loading' ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/30 animate-pulse'
            : status === 'success' ? 'bg-gradient-to-br from-green-500 to-green-700 shadow-green-500/30'
            : 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/30'
          }`}>
            {status === 'loading' && (
              <svg className="animate-spin w-7 h-7 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {status === 'success' && (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            )}
          </div>
          <div>
            <h2 className={`text-xl font-bold mb-2 ${status === 'error' ? 'text-red-400' : 'text-white'}`}>
              {status === 'loading' ? 'Verify ho raha hai...' : status === 'success' ? 'Email Verified!' : 'Verification Failed'}
            </h2>
            <p className="text-white/50 text-sm">{msg}</p>
          </div>
          {status === 'error' && (
            <button onClick={() => navigate('/login', { replace: true })}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors">
              Login Page par Jaayein
            </button>
          )}
        </div>
      </div>
    );
  }
  