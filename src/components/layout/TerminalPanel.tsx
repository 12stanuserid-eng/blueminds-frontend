import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';
import { v4 as uuidv4 } from 'uuid';

interface Tab { id: string; name: string; }

export default function TerminalPanel() {
  const { user } = useAuthStore();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const terminalRefs = useRef<Map<string, { term: any; fit: any }>>(new Map());
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!user) return;
    const sock = io(`${SOCKET_URL}/terminal`, { auth: { userId: user.id }, transports: ['websocket'] });
    sock.on('connect', () => { setSocket(sock); createTab(sock); });
    sock.on('terminal:data', ({ sessionId, data }: any) => {
      terminalRefs.current.get(sessionId)?.term?.write(data);
    });
    sock.on('terminal:error', ({ message }: any) => console.error('Terminal error:', message));
    return () => { sock.disconnect(); };
  }, [user]);

  const createTab = (sock?: Socket) => {
    const s = sock || socket;
    if (!s) return;
    const id = uuidv4();
    const name = `bash`;
    setTabs(prev => [...prev, { id, name }]);
    setActiveTab(id);
    setTimeout(() => initTerminal(id, s), 150);
  };

  const initTerminal = async (sessionId: string, sock: Socket) => {
    try {
      const { Terminal } = await import('xterm');
      const { FitAddon } = await import('xterm-addon-fit');
      const div = document.getElementById(`term-${sessionId}`);
      if (!div) return;
      const term = new Terminal({
        theme: { background: '#08080f', foreground: '#e2e8f0', cursor: '#3b82f6', selectionBackground: '#3b82f620' },
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: 12.5,
        lineHeight: 1.45,
        cursorBlink: true,
        scrollback: 5000
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(div as HTMLDivElement);
      fit.fit();
      term.onData(data => sock.emit('terminal:input', { sessionId, data }));
      term.onResize(({ cols, rows }) => sock.emit('terminal:resize', { sessionId, cols, rows }));
      terminalRefs.current.set(sessionId, { term, fit });
      sock.emit('terminal:create', { sessionId, cols: term.cols, rows: term.rows });
      const ro = new ResizeObserver(() => { try { fit.fit(); } catch(_) {} });
      ro.observe(div);
    } catch(e) { console.error('Terminal init error:', e); }
  };

  const closeTab = (id: string) => {
    const ref = terminalRefs.current.get(id);
    if (ref) { ref.term?.dispose(); terminalRefs.current.delete(id); }
    socket?.emit('terminal:kill', { sessionId: id });
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
  };

  return (
    <div className="flex flex-col h-full bg-[#08080f]">
      {/* Tab bar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.06] bg-[#0d0d14] flex-shrink-0">
        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {tabs.map(tab => (
            <div key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-colors group flex-shrink-0',
                activeTab === tab.id ? 'bg-white/[0.08] text-white/80' : 'text-white/30 hover:text-white/55 hover:bg-white/[0.04]')}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400/60">
                <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
              </svg>
              <span className="font-mono">{tab.name}</span>
              <button onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all ml-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => createTab()}
          className="ml-1 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-white/25 hover:text-white/55 transition-colors flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>

      {/* Terminal area */}
      <div className="flex-1 relative overflow-hidden">
        {tabs.map(tab => (
          <div key={tab.id} id={`term-${tab.id}`}
            className="absolute inset-0 p-1.5"
            style={{ display: activeTab === tab.id ? 'block' : 'none' }} />
        ))}
        {tabs.length === 0 && (
          <div className="flex items-center justify-center h-full text-white/20 font-mono text-[13px]">
            <div className="text-center">
              <p className="text-2xl mb-2 text-green-400/40">$_</p>
              <p>Click + to start a terminal session</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
