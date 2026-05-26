import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { Send, Square, Paperclip, Mic, AtSign, Command } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const COMMANDS = [
  { cmd: '/plan', desc: 'Create execution plan' },
  { cmd: '/terminal', desc: 'Run terminal command' },
  { cmd: '/code', desc: 'Generate code' },
  { cmd: '/debug', desc: 'Debug last error' },
  { cmd: '/learn', desc: 'Educational mode' },
  { cmd: '/deploy', desc: 'Deploy current project' },
  { cmd: '/github', desc: 'GitHub operations' },
  { cmd: '/render', desc: 'Render operations' }
];

const MENTIONS = [
  { name: '@github', desc: 'GitHub integration' },
  { name: '@render', desc: 'Render deployment' },
  { name: '@terminal', desc: 'Terminal commands' },
  { name: '@planner', desc: 'Task planning' }
];

export default function ChatInput() {
  const { sendMessage, isStreaming, stopStreaming } = useChatStore();
  const [value, setValue] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [filterStr, setFilterStr] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleChange = (v: string) => {
    setValue(v);
    const lastWord = v.split(' ').pop() || '';
    if (lastWord.startsWith('/')) { setShowCommands(true); setShowMentions(false); setFilterStr(lastWord.slice(1)); }
    else if (lastWord.startsWith('@')) { setShowMentions(true); setShowCommands(false); setFilterStr(lastWord.slice(1)); }
    else { setShowCommands(false); setShowMentions(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === 'Escape') { setShowCommands(false); setShowMentions(false); }
  };

  const handleSend = async () => {
    const msg = value.trim();
    if (!msg || isStreaming) return;
    setValue('');
    setShowCommands(false);
    setShowMentions(false);

    let mode = 'base';
    if (msg.startsWith('/plan')) mode = 'plan';
    else if (msg.startsWith('/debug')) mode = 'debug';
    else if (msg.startsWith('/learn')) mode = 'learn';

    await sendMessage(msg, mode);
  };

  const insertSuggestion = (text: string) => {
    const words = value.split(' ');
    words[words.length - 1] = text;
    setValue(words.join(' ') + ' ');
    setShowCommands(false);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const filteredCommands = COMMANDS.filter(c => c.cmd.slice(1).startsWith(filterStr.toLowerCase()));
  const filteredMentions = MENTIONS.filter(m => m.name.slice(1).startsWith(filterStr.toLowerCase()));

  return (
    <div className="relative max-w-4xl mx-auto w-full">
      {/* Command/mention popup */}
      <AnimatePresence>
        {(showCommands && filteredCommands.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-surface-800 border border-surface-700 rounded-xl overflow-hidden shadow-2xl z-50">
            <div className="px-3 py-1.5 border-b border-surface-700 flex items-center gap-2">
              <Command size={12} className="text-surface-400" />
              <span className="text-xs text-surface-400 font-medium">Commands</span>
            </div>
            {filteredCommands.map(c => (
              <button key={c.cmd} onClick={() => insertSuggestion(c.cmd)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-700 text-left transition-colors">
                <code className="text-brand text-sm font-mono">{c.cmd}</code>
                <span className="text-surface-400 text-xs">{c.desc}</span>
              </button>
            ))}
          </motion.div>
        )}
        {(showMentions && filteredMentions.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-surface-800 border border-surface-700 rounded-xl overflow-hidden shadow-2xl z-50">
            <div className="px-3 py-1.5 border-b border-surface-700 flex items-center gap-2">
              <AtSign size={12} className="text-surface-400" />
              <span className="text-xs text-surface-400 font-medium">Mentions</span>
            </div>
            {filteredMentions.map(m => (
              <button key={m.name} onClick={() => insertSuggestion(m.name)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-700 text-left transition-colors">
                <code className="text-purple-400 text-sm font-mono">{m.name}</code>
                <span className="text-surface-400 text-xs">{m.desc}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden focus-within:border-brand/50 transition-colors shadow-lg">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message BlueMinds AI... (/ for commands, @ for tools)"
          rows={1}
          className="w-full bg-transparent px-4 pt-3.5 pb-2 text-sm text-white placeholder-surface-500 resize-none focus:outline-none leading-relaxed"
          style={{ maxHeight: '200px' }}
          disabled={isStreaming}
        />
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          <div className="flex items-center gap-1">
            <button className="btn-ghost !p-1.5 text-surface-500 hover:text-surface-300" title="Attach file">
              <Paperclip size={15} />
            </button>
            <button className="btn-ghost !p-1.5 text-surface-500 hover:text-surface-300" title="Voice">
              <Mic size={15} />
            </button>
            <button onClick={() => handleChange(value + '/')} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-surface-500 hover:text-surface-300 hover:bg-surface-700 transition-colors">
              <Command size={11} /> <span>Commands</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <button onClick={stopStreaming} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors">
                <Square size={11} fill="currentColor" /> Stop
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={!value.trim() || isStreaming}
              className={cn('flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all', value.trim() && !isStreaming ? 'bg-brand hover:bg-brand-dark text-white shadow-lg shadow-brand/20' : 'bg-surface-700 text-surface-500 cursor-not-allowed')}
            >
              <Send size={14} />
              <span className="hidden sm:block">Send</span>
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-surface-600 text-xs mt-2">BlueMinds AI can make mistakes. Verify important decisions.</p>
    </div>
  );
}
