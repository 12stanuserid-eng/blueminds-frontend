import { useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SidebarProps { onClose?: () => void; }

function timeAgo(date: string) {
  const d = new Date(date), now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
  return `${Math.floor(diff/1440)}d ago`;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { threads, activeThread, setActiveThread, createThread, deleteThread } = useChatStore();
  const { user } = useAuthStore();
  const [hovered, setHovered] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const grouped: Record<string, typeof threads> = { Today: [], Yesterday: [], Earlier: [] };
  const now = new Date();
  filtered.forEach(t => {
    const d = new Date(t.updatedAt || t.createdAt);
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) grouped.Today.push(t);
    else if (diff === 1) grouped.Yesterday.push(t);
    else grouped.Earlier.push(t);
  });

  return (
    <div className="flex flex-col h-full bg-[#0d0d14] border-r border-white/[0.05] w-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-[52px] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-[14px] font-semibold text-white/80">BlueMinds AI</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
      </div>

      {/* New chat button */}
      <div className="px-3 pb-3 flex-shrink-0">
        <button onClick={() => createThread()} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-white/60 hover:text-white/80 text-[13px] font-medium transition-all group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-200">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New conversation
        </button>
      </div>

      {/* Search */}
      {threads.length > 3 && (
        <div className="px-3 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/25 flex-shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="bg-transparent text-[12px] text-white/60 placeholder-white/20 outline-none w-full" />
          </div>
        </div>
      )}

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {Object.entries(grouped).map(([group, items]) => items.length > 0 && (
          <div key={group}>
            <p className="text-[10px] font-medium text-white/20 uppercase tracking-wider px-2 py-2">{group}</p>
            {items.map(thread => (
              <div key={thread.id} className="relative group"
                onMouseEnter={() => setHovered(thread.id)} onMouseLeave={() => setHovered(null)}>
                <button onClick={() => setActiveThread(thread.id)}
                  className={cn('w-full text-left px-3 py-2.5 rounded-xl transition-all',
                    activeThread === thread.id ? 'bg-white/[0.07] text-white' : 'hover:bg-white/[0.04] text-white/55 hover:text-white/80')}>
                  <p className="text-[13px] truncate pr-5">{thread.title}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{timeAgo(thread.updatedAt || thread.createdAt)}</p>
                </button>
                <AnimatePresence>
                  {hovered === thread.id && (
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={e => { e.stopPropagation(); deleteThread(thread.id); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/15 text-white/25 hover:text-red-400 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-white/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <p className="text-[12px]">No conversations yet</p>
          </div>
        )}
      </div>

      {/* User footer */}
      <div className="border-t border-white/[0.05] px-3 py-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> :
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white/70 truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-white/25 truncate">{user?.email}</p>
          </div>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" title="Online" />
        </div>
      </div>
    </div>
  );
}
