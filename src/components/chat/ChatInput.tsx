import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const SLASH_COMMANDS = [
  { cmd: '/plan', desc: 'Create execution plan', icon: '📋' },
  { cmd: '/terminal', desc: 'Run terminal command', icon: '💻' },
  { cmd: '/debug', desc: 'Debug errors', icon: '🐛' },
  { cmd: '/deploy', desc: 'Deploy to Render', icon: '🚀' },
  { cmd: '/github', desc: 'GitHub operations', icon: '🐙' },
  { cmd: '/learn', desc: 'Educational mode', icon: '📚' },
];

export default function ChatInput() {
  const { sendMessage, isStreaming, stopStreaming, selectedModel } = useChatStore();
  const [value, setValue] = useState('');
  const [showCmds, setShowCmds] = useState(false);
  const [cmdFilter, setCmdFilter] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [value]);

  const handleChange = (v: string) => {
    setValue(v);
    const last = v.split('\n').pop()?.split(' ').pop() || '';
    if (last.startsWith('/')) { setShowCmds(true); setCmdFilter(last.slice(1)); }
    else setShowCmds(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === 'Escape') setShowCmds(false);
  };

  const handleSend = async () => {
    const msg = value.trim();
    if (!msg || isStreaming) return;
    setValue('');
    setShowCmds(false);
    let mode = 'base';
    if (msg.startsWith('/plan')) mode = 'plan';
    else if (msg.startsWith('/debug')) mode = 'debug';
    else if (msg.startsWith('/learn')) mode = 'learn';
    await sendMessage(msg, mode);
  };

  const insertCmd = (cmd: string) => {
    const lines = value.split('\n');
    const words = lines[lines.length - 1].split(' ');
    words[words.length - 1] = cmd;
    lines[lines.length - 1] = words.join(' ');
    setValue(lines.join('\n') + ' ');
    setShowCmds(false);
    textareaRef.current?.focus();
  };

  const filtered = SLASH_COMMANDS.filter(c => c.cmd.slice(1).startsWith(cmdFilter.toLowerCase()));
  const canSend = value.trim() && !isStreaming;

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Command popup */}
      <AnimatePresence>
        {showCmds && filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-[#16161f] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl z-50">
            <div className="px-3 py-2 border-b border-white/[0.05]">
              <p className="text-[11px] text-white/30 font-medium">Commands</p>
            </div>
            {filtered.map(c => (
              <button key={c.cmd} onClick={() => insertCmd(c.cmd)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors text-left">
                <span className="text-base">{c.icon}</span>
                <code className="text-blue-400 text-[13px] font-mono">{c.cmd}</code>
                <span className="text-white/30 text-[12px]">{c.desc}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input box */}
      <div className="bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] focus-within:border-blue-500/40 rounded-2xl transition-all overflow-hidden shadow-lg">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? 'AI is responding...' : 'Ask anything... (/ for commands, Shift+Enter for newline)'}
          rows={1}
          disabled={false}
          className="w-full bg-transparent px-4 pt-4 pb-2 text-[14px] text-white/85 placeholder-white/20 resize-none focus:outline-none leading-relaxed"
          style={{ maxHeight: '180px' }}
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <button onClick={() => { setValue(v => v + '/'); textareaRef.current?.focus(); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.05] text-[12px] transition-colors">
              <span className="font-mono font-bold text-[11px]">/</span>
              <span>Commands</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <button onClick={stopStreaming}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-red-500/15 text-white/50 hover:text-red-400 text-[12px] font-medium transition-colors">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                Stop
              </button>
            )}
            <button onClick={handleSend} disabled={!canSend}
              className={cn('w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                canSend ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white/[0.06] cursor-not-allowed')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={canSend ? 'white' : 'rgba(255,255,255,0.25)'} strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-white/15 text-[11px] mt-2">BlueMinds AI may make mistakes. Verify important outputs.</p>
    </div>
  );
}
