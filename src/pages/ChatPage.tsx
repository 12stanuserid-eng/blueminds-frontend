import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ChatInterface from '../components/chat/ChatInterface';
import TerminalPanel from '../components/layout/TerminalPanel';

export default function ChatPage() {
  const { user } = useAuthStore();
  const { fetchThreads } = useChatStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => { if (user) fetchThreads(); }, [user]);

  return (
    <div className="flex h-screen bg-[#0d0d14] overflow-hidden">
      {/* Sidebar */}
      <div className={`flex-shrink-0 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(s => !s)}
          terminalOpen={terminalOpen}
          onToggleTerminal={() => setTerminalOpen(t => !t)}
        />

        {/* Chat + Terminal split */}
        <div className="flex flex-1 min-h-0">
          <div className={`flex flex-col flex-1 min-w-0 ${terminalOpen ? 'w-1/2' : 'w-full'}`}>
            <ChatInterface />
          </div>
          {terminalOpen && (
            <div className="w-[420px] flex-shrink-0 border-l border-white/[0.06]">
              <TerminalPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
