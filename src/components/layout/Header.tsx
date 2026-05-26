import { useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Plus, Settings, ChevronDown, Menu, Terminal, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';
import { useEffect } from 'react';

const MODELS = [
  { id: 'kimi-k2-5', name: 'Kimi 2.6', badge: '🌊' },
  { id: 'claude-opus-4-5', name: 'Claude Opus 4.7', badge: '🎭' },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.6', badge: '🎵' },
  { id: 'gpt-4o', name: 'GPT-4o', badge: '🤖' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', badge: '✨' }
];

export default function Header() {
  const { selectedModel, setModel, createThread } = useChatStore();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, toggleTerminal, terminalOpen, setSettingsOpen } = useUIStore();
  const [modelOpen, setModelOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  return (
    <header className="h-12 border-b border-surface-800 bg-surface-900/50 backdrop-blur flex items-center px-3 gap-2 flex-shrink-0 z-20">
      <button onClick={toggleSidebar} className="btn-ghost !p-2 text-surface-400">
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-2 mr-auto">
        <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M5 12C5 8.134 8.134 5 12 5s7 3.134 7 7-3.134 7-7 7-7-3.134-7-7z" fill="white" fillOpacity="0.3"/>
            <path d="M8.5 10h7M8.5 12.5h7M8.5 15h5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-semibold text-white text-sm hidden sm:block">BlueMinds AI</span>
      </div>

      {/* Model picker */}
      <div className="relative">
        <button
          onClick={() => setModelOpen(!modelOpen)}
          className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-lg px-3 py-1.5 text-sm text-white transition-all"
        >
          <span>{currentModel.badge}</span>
          <span className="hidden sm:block">{currentModel.name}</span>
          <ChevronDown size={14} className={`text-surface-400 transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
        </button>
        {modelOpen && (
          <div className="absolute top-full mt-1 right-0 w-52 bg-surface-800 border border-surface-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            {MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => { setModel(m.id); setModelOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-700 transition-colors text-left ${m.id === selectedModel ? 'text-brand bg-surface-700/50' : 'text-white'}`}
              >
                <span>{m.badge}</span>
                <span>{m.name}</span>
                {m.id === selectedModel && <span className="ml-auto text-brand text-xs">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={createThread} className="btn-ghost !p-2 text-surface-400" title="New chat">
        <Plus size={18} />
      </button>
      <button onClick={toggleTerminal} className={`btn-ghost !p-2 transition-colors ${terminalOpen ? 'text-brand' : 'text-surface-400'}`} title="Toggle terminal">
        <Terminal size={18} />
      </button>
      <button onClick={() => setSettingsOpen(true)} className="btn-ghost !p-2 text-surface-400" title="Settings">
        <Settings size={18} />
      </button>

      {/* User menu */}
      <div className="relative">
        <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 btn-ghost !p-1">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 bg-brand/20 rounded-full flex items-center justify-center">
              <User size={14} className="text-brand" />
            </div>
          )}
        </button>
        {userMenuOpen && (
          <div className="absolute top-full mt-1 right-0 w-48 bg-surface-800 border border-surface-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-700">
              <p className="text-white text-sm font-medium truncate">{user?.name || user?.email}</p>
              <p className="text-surface-400 text-xs truncate">{user?.email}</p>
            </div>
            <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-surface-300 hover:text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
