import { useEffect, useRef, useState } from 'react';
import { Terminal as XTermLib } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { io, Socket } from 'socket.io-client';
import { X, Plus, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface Tab { id: string; name: string; }

export default function TerminalPanel() {
  const { user } = useAuthStore();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const terminalRefs = useRef<Map<string, { term: XTermLib; fit: FitAddon; div: HTMLDivElement | null }>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!user) return;
    const sock = io(`${SOCKET_URL}/terminal`, {
      auth: { userId: user.id },
      transports: ['websocket', 'polling']
    });
    sock.on('connect', () => { setSocket(sock); if (tabs.length === 0) createTab(sock); });
    sock.on('terminal:data', ({ sessionId, data }: any) => {
      const ref = terminalRefs.current.get(sessionId);
      if (ref) ref.term.write(data);
    });
    sock.on('terminal:ready', ({ sessionId }: any) => {
      const ref = terminalRefs.current.get(sessionId);
      if (ref) ref.fit.fit();
    });
    sock.on('terminal:error', ({ message }: any) => toast.error(`Terminal: ${message}`));
    return () => { sock.disconnect(); };
  }, [user]);

  const createTab = (sock?: Socket) => {
    const s = sock || socket;
    if (!s) return;
    const id = uuidv4();
    const name = `Terminal ${tabs.length + 1}`;
    setTabs(prev => [...prev, { id, name }]);
    setActiveTab(id);
    setTimeout(() => initTerminal(id, s), 100);
  };

  const initTerminal = (sessionId: string, sock: Socket) => {
    const div = document.getElementById(`term-${sessionId}`) as HTMLDivElement;
    if (!div) return;
    const term = new XTermLib({
      theme: { background: '#020617', foreground: '#f1f5f9', cursor: '#2563EB', selectionBackground: '#2563EB40' },
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 13,
      lineHeight: 1.4,
      cursorBlink: true,
      scrollback: 5000
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(div);
    fit.fit();
    term.onData(data => sock.emit('terminal:input', { sessionId, data }));
    term.onResize(({ cols, rows }) => sock.emit('terminal:resize', { sessionId, cols, rows }));
    terminalRefs.current.set(sessionId, { term, fit, div });
    sock.emit('terminal:create', { sessionId, cols: term.cols, rows: term.rows });
    const ro = new ResizeObserver(() => { try { fit.fit(); } catch(_) {} });
    ro.observe(div);
  };

  const closeTab = (id: string) => {
    const ref = terminalRefs.current.get(id);
    if (ref) { ref.term.dispose(); terminalRefs.current.delete(id); }
    socket?.emit('terminal:kill', { sessionId: id });
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
  };

  const clearTerminal = () => {
    if (!activeTab) return;
    terminalRefs.current.get(activeTab)?.term.clear();
  };

  return (
    <div className="flex flex-col h-full bg-surface-950 border-t border-surface-800">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-surface-800 bg-surface-900/50 flex-shrink-0">
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {tabs.map(tab => (
            <div key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('flex items-center gap-2 px-3 py-1 rounded-lg text-xs cursor-pointer transition-colors flex-shrink-0', activeTab === tab.id ? 'bg-surface-800 text-white' : 'text-surface-400 hover:text-white hover:bg-surface-800/50')}>
              <span>{tab.name}</span>
              <button onClick={e => { e.stopPropagation(); closeTab(tab.id); }} className="hover:text-red-400 ml-1">
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => createTab()} className="btn-ghost !p-1.5 text-surface-400" title="New terminal">
            <Plus size={14} />
          </button>
          <button onClick={clearTerminal} className="btn-ghost !p-1.5 text-surface-400" title="Clear">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Terminal area */}
      <div className="flex-1 relative overflow-hidden">
        {tabs.map(tab => (
          <div key={tab.id} id={`term-${tab.id}`} style={{ display: activeTab === tab.id ? 'block' : 'none' }}
            className="absolute inset-0 p-2" />
        ))}
        {tabs.length === 0 && (
          <div className="flex items-center justify-center h-full text-surface-500 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">$</div>
              <p className="text-xs">Click + to start a new terminal session</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
