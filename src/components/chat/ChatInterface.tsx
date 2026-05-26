import { useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { motion } from 'framer-motion';

export default function ChatInterface() {
  const { currentThread, messages } = useChatStore();

  return (
    <div className="flex flex-col h-full">
      {!currentThread && messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
            <div className="w-16 h-16 bg-brand/20 border border-brand/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
                <path d="M7 16C7 11.029 11.029 7 16 7s9 4.029 9 9-4.029 9-9 9-9-4.029-9-9z" fill="#2563EB" fillOpacity="0.3"/>
                <path d="M11 13.5h10M11 16.5h10M11 19.5h7" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">BlueMinds AI Agent</h2>
            <p className="text-surface-400 mb-8 leading-relaxed">Your autonomous AI that codes, deploys, and manages projects. Ask anything or use commands to get started.</p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                { cmd: '/plan', desc: 'Create execution plan for complex tasks' },
                { cmd: '/github create-repo my-app', desc: 'Create a GitHub repository' },
                { cmd: '/deploy', desc: 'Deploy current project to Render' },
                { cmd: '/debug', desc: 'Analyze and fix the last error' }
              ].map(s => (
                <div key={s.cmd} className="bg-surface-900 border border-surface-800 rounded-xl p-3 hover:border-brand/40 transition-colors cursor-pointer group">
                  <code className="text-brand text-xs font-mono group-hover:text-brand-light transition-colors">{s.cmd}</code>
                  <p className="text-surface-400 text-xs mt-1 leading-tight">{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <MessageList />
        </div>
      )}
      <div className="flex-shrink-0 border-t border-surface-800 p-4">
        <ChatInput />
      </div>
    </div>
  );
}
