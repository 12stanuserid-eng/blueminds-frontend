import { useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useUIStore } from '../../stores/uiStore';
import { MessageSquare, Plus, Trash2, Edit2, Search, Github, Server, Key, Wrench } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { threads, currentThread, selectThread, deleteThread, renameThread, createThread } = useChatStore();
  const { activeSidebarTab, setActiveSidebarTab } = useUIStore();
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filtered = threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { id: 'chats' as const, icon: MessageSquare, label: 'Chats' },
    { id: 'tools' as const, icon: Wrench, label: 'Tools' },
    { id: 'apikeys' as const, icon: Key, label: 'Keys' }
  ];

  return (
    <div className="h-full flex flex-col bg-surface-900/30">
      {/* Tab bar */}
      <div className="flex border-b border-surface-800 px-2 pt-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSidebarTab(t.id)}
            className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-t transition-colors',
              activeSidebarTab === t.id ? 'text-white border-b-2 border-brand' : 'text-surface-400 hover:text-white')}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {activeSidebarTab === 'chats' && (
        <div className="flex flex-col flex-1 overflow-hidden p-2 gap-2">
          <button onClick={createThread} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-brand/10 hover:bg-brand/20 text-brand text-sm font-medium transition-colors border border-brand/20">
            <Plus size={14} /> New Chat
          </button>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats..." className="input !py-1.5 !pl-8 text-xs w-full" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5">
            {filtered.map(thread => (
              <div key={thread.id} className={cn('group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all', currentThread?.id === thread.id ? 'bg-surface-800 text-white' : 'text-surface-300 hover:bg-surface-800/50 hover:text-white')}
                onClick={() => selectThread(thread)}>
                <MessageSquare size={13} className="flex-shrink-0 text-surface-400" />
                {editId === thread.id ? (
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                    onBlur={() => { renameThread(thread.id, editTitle); setEditId(null); }}
                    onKeyDown={e => e.key === 'Enter' && (renameThread(thread.id, editTitle), setEditId(null))}
                    className="flex-1 bg-transparent border-b border-brand outline-none text-xs" autoFocus
                    onClick={e => e.stopPropagation()} />
                ) : (
                  <span className="flex-1 truncate text-xs">{thread.title}</span>
                )}
                <div className="hidden group-hover:flex items-center gap-1">
                  <button onClick={e => { e.stopPropagation(); setEditId(thread.id); setEditTitle(thread.title); }} className="p-0.5 hover:text-white text-surface-400">
                    <Edit2 size={11} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteThread(thread.id); }} className="p-0.5 hover:text-red-400 text-surface-400">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-surface-500 text-xs text-center py-8">No chats yet</p>}
          </div>
        </div>
      )}

      {activeSidebarTab === 'tools' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <p className="text-surface-400 text-xs font-medium uppercase tracking-wider">Integrations</p>
          {[
            { icon: Github, label: 'GitHub', desc: 'Repos, push, branches', color: 'text-white' },
            { icon: Server, label: 'Render', desc: 'Deploy & manage services', color: 'text-green-400' },
          ].map(tool => (
            <div key={tool.label} className="flex items-center gap-3 p-3 rounded-lg bg-surface-800 border border-surface-700">
              <tool.icon size={18} className={tool.color} />
              <div>
                <p className="text-white text-sm font-medium">{tool.label}</p>
                <p className="text-surface-400 text-xs">{tool.desc}</p>
              </div>
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {activeSidebarTab === 'apikeys' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <p className="text-surface-400 text-xs font-medium uppercase tracking-wider">API Keys</p>
          {[
            { name: 'GitHub', masked: 'ghp_****k8qc', valid: true },
            { name: 'Render', masked: 'rnd_****qL', valid: true },
            { name: 'BlueMinds', masked: 'Set in Render env', valid: false }
          ].map(key => (
            <div key={key.name} className="flex items-center gap-3 p-3 rounded-lg bg-surface-800 border border-surface-700">
              <Key size={14} className="text-surface-400" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium">{key.name}</p>
                <p className="text-surface-500 text-xs font-mono truncate">{key.masked}</p>
              </div>
              <div className={cn('w-2 h-2 rounded-full', key.valid ? 'bg-green-400' : 'bg-yellow-400')} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
