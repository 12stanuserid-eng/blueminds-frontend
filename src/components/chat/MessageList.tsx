import { useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { motion, AnimatePresence } from 'framer-motion';
import CodeBlock from './CodeBlock';
import { cn } from '../../utils/cn';

function parseContent(content: string) {
  const parts: Array<{ type: 'text' | 'code'; content: string; lang?: string }> = [];
  const codeRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0, match;
  while ((match = codeRegex.exec(content)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    parts.push({ type: 'code', lang: match[1] || 'bash', content: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) parts.push({ type: 'text', content: content.slice(lastIndex) });
  return parts;
}

function TextContent({ text }: { text: string }) {
  return (
    <div className="prose prose-invert max-w-none text-[14px] leading-relaxed">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i} className="text-[15px] font-semibold text-white mt-4 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-[16px] font-semibold text-white mt-5 mb-1">{line.slice(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="text-[18px] font-bold text-white mt-6 mb-2">{line.slice(2)}</h1>;
        if (line.startsWith('- ') || line.startsWith('* ')) return (
          <div key={i} className="flex items-start gap-2 my-0.5">
            <span className="text-blue-400 mt-[5px] flex-shrink-0 text-[8px]">●</span>
            <span className="text-white/75">{formatInline(line.slice(2))}</span>
          </div>
        );
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^(\d+)\. /)?.[1];
          return (
            <div key={i} className="flex items-start gap-2 my-0.5">
              <span className="text-blue-400 font-mono text-[12px] flex-shrink-0 w-5 text-right">{num}.</span>
              <span className="text-white/75">{formatInline(line.replace(/^\d+\. /, ''))}</span>
            </div>
          );
        }
        if (!line.trim()) return <div key={i} className="h-2" />;
        return <p key={i} className="text-white/75 my-0.5">{formatInline(line)}</p>;
      })}
    </div>
  );
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="bg-white/[0.08] text-blue-300 px-1.5 py-0.5 rounded text-[12.5px] font-mono">{part.slice(1,-1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-semibold text-white">{part.slice(2,-2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic">{part.slice(1,-1)}</em>;
    return part;
  });
}

export default function MessageList() {
  const { messages, isStreaming } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isStreaming]);

  return (
    <div className="h-full overflow-y-auto scroll-smooth">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div key={msg.id || idx}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={cn('flex gap-3', msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row')}>
              
              {/* Avatar */}
              {msg.role !== 'USER' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-700/30 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Bubble */}
              <div className={cn('max-w-[80%] space-y-2', msg.role === 'USER' ? 'items-end' : 'items-start', 'flex flex-col')}>
                {msg.role === 'USER' ? (
                  <div className="bg-blue-600/25 border border-blue-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] text-white/85 leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-2 w-full">
                    {parseContent(msg.content).map((part, pi) => (
                      part.type === 'code'
                        ? <CodeBlock key={pi} code={part.content} language={part.lang || 'bash'} />
                        : <TextContent key={pi} text={part.content} />
                    ))}
                    {isStreaming && idx === messages.length - 1 && (
                      <span className="inline-block w-1.5 h-4 bg-blue-400 rounded-sm animate-pulse ml-0.5" />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isStreaming && messages[messages.length - 1]?.role === 'USER' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-700/30 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex items-center gap-1 px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm">
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
