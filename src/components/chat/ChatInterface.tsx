import { useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  { icon: '⚡', text: 'Build a REST API with Express and PostgreSQL' },
  { icon: '🚀', text: 'Deploy a Docker container to Render' },
  { icon: '🐙', text: 'Create a GitHub repo and push code automatically' },
  { icon: '🧠', text: 'Explain how async/await works in JavaScript' },
  { icon: '🛠️', text: 'Debug my Node.js application crash' },
  { icon: '📊', text: 'Create a data visualization dashboard' },
];

export default function ChatInterface() {
  const { messages, activeThread, isStreaming } = useChatStore();
  const { sendMessage } = useChatStore();

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {hasMessages ? (
        <div className="flex-1 overflow-hidden">
          <MessageList />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-blue-500/20 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">What can I help you with?</h2>
            <p className="text-[14px] text-white/35 max-w-sm">Code, deploy, automate — your AI workspace</p>
          </motion.div>

          {/* Suggestions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl mb-10">
            {SUGGESTIONS.map((s, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                onClick={() => sendMessage(s.text, 'base')}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.10] text-left transition-all group">
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <span className="text-[13px] text-white/55 group-hover:text-white/75 transition-colors leading-relaxed">{s.text}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <ChatInput />
      </div>
    </div>
  );
}
