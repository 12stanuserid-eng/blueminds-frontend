import { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { Bot, User } from 'lucide-react';

export default function MessageList() {
  const { messages, isStreaming, streamingContent } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamingContent]);

  return (
    <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto w-full">
      {messages.map((msg, i) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-brand' : 'bg-surface-800 border border-surface-700'}`}>
            {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-brand" />}
          </div>
          <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
            {msg.role === 'user' ? (
              <div className="bg-brand/20 border border-brand/30 rounded-2xl rounded-tr-sm px-4 py-2.5 text-white text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>
            ) : (
              <div className="bg-surface-900 border border-surface-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-surface-100 leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const isBlock = (props as any).inline === false || (String(children).includes('\n'));
                      if (match && isBlock) {
                        return <CodeBlock code={String(children).replace(/\n$/, '')} language={match[1]} />;
                      }
                      return <code className="bg-surface-800 text-brand px-1.5 py-0.5 rounded font-mono text-xs" {...props}>{children}</code>;
                    },
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="text-surface-200">{children}</li>,
                    h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-semibold text-white mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold text-white mb-1">{children}</h3>,
                    blockquote: ({ children }) => <blockquote className="border-l-2 border-brand pl-3 text-surface-400 italic">{children}</blockquote>,
                    table: ({ children }) => <div className="overflow-x-auto my-2"><table className="min-w-full text-xs border border-surface-700 rounded">{children}</table></div>,
                    th: ({ children }) => <th className="border border-surface-700 px-3 py-1.5 bg-surface-800 text-white font-medium text-left">{children}</th>,
                    td: ({ children }) => <td className="border border-surface-700 px-3 py-1.5 text-surface-300">{children}</td>,
                    a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{children}</a>,
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {isStreaming && streamingContent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center">
            <Bot size={14} className="text-brand" />
          </div>
          <div className="bg-surface-900 border border-surface-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-surface-100 max-w-[85%]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingContent}</ReactMarkdown>
            <span className="streaming-cursor inline-block w-0.5 h-4 bg-brand ml-0.5 align-middle" />
          </div>
        </motion.div>
      )}

      {isStreaming && !streamingContent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center">
            <Bot size={14} className="text-brand" />
          </div>
          <div className="flex items-center gap-1.5 bg-surface-900 border border-surface-800 rounded-2xl rounded-tl-sm px-4 py-3">
            {[0, 0.2, 0.4].map(d => (
              <motion.div key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: d }}
                className="w-1.5 h-1.5 bg-surface-400 rounded-full" />
            ))}
          </div>
        </motion.div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
