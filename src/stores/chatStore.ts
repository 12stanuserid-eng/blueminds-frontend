import { create } from 'zustand';
import { apiService } from '../services/api';

interface Message { id: string; role: 'USER' | 'ASSISTANT'; content: string; createdAt: string; }
interface Thread { id: string; title: string; createdAt: string; updatedAt: string; modelUsed?: string; }

interface ChatStore {
  messages: Message[];
  threads: Thread[];
  activeThread: string | null;
  isStreaming: boolean;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  setActiveThread: (id: string) => void;
  fetchThreads: () => Promise<void>;
  fetchMessages: (threadId: string) => Promise<void>;
  sendMessage: (content: string, mode?: string) => Promise<void>;
  stopStreaming: () => void;
  createThread: () => void;
  deleteThread: (id: string) => Promise<void>;
}

let abortController: AbortController | null = null;

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  threads: [],
  activeThread: null,
  isStreaming: false,
  selectedModel: 'kimi-k2-5',

  setSelectedModel: (model) => set({ selectedModel: model }),

  setActiveThread: async (id) => {
    set({ activeThread: id, messages: [] });
    await get().fetchMessages(id);
  },

  fetchThreads: async () => {
    try {
      const data = await apiService.get('/api/chat/threads');
      set({ threads: data.threads || [] });
    } catch(_) {}
  },

  fetchMessages: async (threadId) => {
    try {
      const data = await apiService.get(`/api/chat/threads/${threadId}/messages`);
      set({ messages: data.messages || [] });
    } catch(_) {}
  },

  sendMessage: async (content, mode = 'base') => {
    const { activeThread, selectedModel, messages } = get();
    const userMsg: Message = { id: Date.now().toString(), role: 'USER', content, createdAt: new Date().toISOString() };
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ASSISTANT', content: '', createdAt: new Date().toISOString() };
    set({ messages: [...messages, userMsg, aiMsg], isStreaming: true });

    abortController = new AbortController();
    try {
      const token = await apiService.getToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/chat/completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: content, threadId: activeThread, model: selectedModel, stream: true, mode }),
        signal: abortController.signal
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      if (!res.body) throw new Error('No stream body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // After first chunk, update activeThread if needed
      let threadSet = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.threadId && !threadSet) {
              threadSet = true;
              set(s => ({ activeThread: parsed.threadId, threads: s.threads.some(t => t.id === parsed.threadId) ? s.threads : [{ id: parsed.threadId, title: content.slice(0, 50), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...s.threads] }));
            }
            if (parsed.content) {
              set(s => ({ messages: s.messages.map((m, i) => i === s.messages.length - 1 ? { ...m, content: m.content + parsed.content } : m) }));
            }
          } catch(_) {}
        }
      }
    } catch(err: any) {
      if (err.name !== 'AbortError') {
        set(s => ({ messages: s.messages.map((m, i) => i === s.messages.length - 1 ? { ...m, content: 'Sorry, something went wrong. Please check the backend connection and try again.' } : m) }));
      }
    } finally {
      set({ isStreaming: false });
      abortController = null;
      get().fetchThreads();
    }
  },

  stopStreaming: () => {
    abortController?.abort();
    set({ isStreaming: false });
  },

  createThread: () => set({ activeThread: null, messages: [] }),

  deleteThread: async (id) => {
    try {
      await apiService.delete(`/api/chat/threads/${id}`);
      const { threads, activeThread } = get();
      const newThreads = threads.filter(t => t.id !== id);
      set({ threads: newThreads, activeThread: activeThread === id ? null : activeThread, messages: activeThread === id ? [] : get().messages });
    } catch(_) {}
  }
}));
