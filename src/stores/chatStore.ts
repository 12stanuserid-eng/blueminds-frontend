import { create } from 'zustand';
import api from '../services/api';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  modelUsed: string;
  updatedAt: string;
  _count?: { messages: number };
}

interface ChatState {
  threads: Thread[];
  currentThread: Thread | null;
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  selectedModel: string;
  loadThreads: () => Promise<void>;
  loadMessages: (threadId: string) => Promise<void>;
  sendMessage: (content: string, mode?: string) => Promise<void>;
  createThread: () => void;
  selectThread: (thread: Thread) => void;
  deleteThread: (id: string) => Promise<void>;
  renameThread: (id: string, title: string) => Promise<void>;
  setModel: (model: string) => void;
  stopStreaming: () => void;
}

let streamAbortController: AbortController | null = null;

export const useChatStore = create<ChatState>((set, get) => ({
  threads: [],
  currentThread: null,
  messages: [],
  isStreaming: false,
  streamingContent: '',
  selectedModel: 'kimi-k2-5',

  loadThreads: async () => {
    try {
      const res = await api.get('/api/chat/threads');
      set({ threads: res.data.threads });
    } catch (err) { console.error(err); }
  },

  loadMessages: async (threadId) => {
    try {
      const res = await api.get(`/api/chat/threads/${threadId}/messages`);
      const msgs = res.data.messages.map((m: any) => ({
        id: m.id, role: m.role.toLowerCase() as 'user' | 'assistant', content: m.content, createdAt: m.createdAt
      }));
      set({ messages: msgs });
    } catch (err) { console.error(err); }
  },

  sendMessage: async (content, mode = 'base') => {
    const { currentThread, selectedModel, messages } = get();
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, createdAt: new Date().toISOString() };
    set({ messages: [...messages, userMsg], isStreaming: true, streamingContent: '' });

    streamAbortController = new AbortController();
    const token = localStorage.getItem('bm_token');
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${apiBase}/api/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: content, threadId: currentThread?.id, model: selectedModel, stream: true, mode }),
        signal: streamAbortController.signal
      });

      const threadId = response.headers.get('X-Thread-Id');
      if (threadId && !currentThread) {
        set(s => ({ currentThread: { id: threadId, title: content.slice(0, 50), modelUsed: selectedModel, updatedAt: new Date().toISOString() } }));
      }

      let fullContent = '';
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'delta' && data.content) {
                fullContent += data.content;
                set({ streamingContent: fullContent });
              }
              if (data.type === 'done') {
                const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: fullContent, createdAt: new Date().toISOString() };
                set(s => ({ messages: [...s.messages, aiMsg], isStreaming: false, streamingContent: '' }));
                get().loadThreads();
              }
            } catch (_) {}
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: `Error: ${err.message}`, createdAt: new Date().toISOString() };
        set(s => ({ messages: [...s.messages, errMsg], isStreaming: false, streamingContent: '' }));
      }
    }
  },

  createThread: () => set({ currentThread: null, messages: [] }),
  selectThread: (thread) => { set({ currentThread: thread }); get().loadMessages(thread.id); },
  deleteThread: async (id) => {
    await api.delete(`/api/chat/threads/${id}`);
    set(s => ({ threads: s.threads.filter(t => t.id !== id), currentThread: s.currentThread?.id === id ? null : s.currentThread }));
  },
  renameThread: async (id, title) => {
    await api.patch(`/api/chat/threads/${id}`, { title });
    set(s => ({ threads: s.threads.map(t => t.id === id ? { ...t, title } : t) }));
  },
  setModel: (model) => set({ selectedModel: model }),
  stopStreaming: () => { streamAbortController?.abort(); set({ isStreaming: false, streamingContent: '' }); }
}));
