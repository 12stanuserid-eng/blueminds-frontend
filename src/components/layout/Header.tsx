import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const MODELS = [
  { id: 'kimi-k2-5', name: 'Kimi 2.6', color: '#7c6eff', badge: 'K' },
  { id: 'claude-opus-4-5', name: 'Claude Opus 4.7', color: '#d97706', badge: 'O' },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.6', color: '#d97706', badge: 'S' },
  { id: 'gpt-4o', name: 'GPT-4o', color: '#10b981', badge: 'G' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', color: '#3b82f6', badge: 'G' }
];

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  terminalOpen: boolean;
  onToggleTerminal: () => void;
}

export default function Header({ sidebarOpen, onToggleSidebar, terminalOpen, onToggleTerminal }: HeaderProps) {
  const { user, signOut } = useAuthStore();
  const { selectedModel, setSelectedModel } = useChatStore();
  const [modelOpen, setModelOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  return (
    <header className="h-[52px] flex items-center justify-between px-4 border-b border-white/[0.05] flex-shrink-0 bg-[#0d0d14]/80 backdrop-blur-sm">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {sidebarOpen ? <path d="M3 12h18M3 6h18M3 18h18"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
          </svg>
        </button>
        {!sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-[13px] font-medium text-white/70">BlueMinds AI</span>
          </div>
        )}
      </div>

      {/* Center — model picker */}
      <div className="relative">
        <button onClick={() => { setModelOpen(o => !o); setUserOpen(false); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] transition-colors group">
          <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: currentModel.color + '30', color: currentModel.color }}>
            {currentModel.badge}
          </div>
          <span className="text-[13px] font-medium text-white/70 group-hover:text-white/90 transition-colors">{currentModel.name}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-white/30 transition-transform ${modelOpen ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        <AnimatePresence>
          {modelOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.97, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-[#16161f] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl z-50">
              {MODELS.map(m => (
                <button key={m.id} onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                  className={cn('w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/[0.05] transition-colors', selectedModel === m.id && 'bg-white/[0.04]')}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ backgroundColor: m.color + '20', color: m.color }}>{m.badge}</div>
                  <span className="text-[13px] text-white/75">{m.name}</span>
                  {selectedModel === m.id && <svg className="ml-auto" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button onClick={onToggleTerminal}
          className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors',
            terminalOpen ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/[0.06] text-white/40 hover:text-white/70')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
          <span className="hidden sm:block">Terminal</span>
        </button>

        {/* User */}
        <div className="relative ml-1">
          <button onClick={() => { setUserOpen(o => !o); setModelOpen(false); }}
            className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/10 hover:ring-white/25 transition-all">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> :
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[11px] font-semibold text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>}
          </button>
          <AnimatePresence>
            {userOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.97, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-2 w-52 bg-[#16161f] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl z-50">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-[13px] font-medium text-white">{user?.name}</p>
                  <p className="text-[11px] text-white/35 mt-0.5 truncate">{user?.email}</p>
                </div>
                <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] text-left transition-colors text-red-400/80 hover:text-red-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                  <span className="text-[13px]">Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
