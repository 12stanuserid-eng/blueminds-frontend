import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useUIStore } from '../stores/uiStore';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ChatInterface from '../components/chat/ChatInterface';
import TerminalPanel from '../components/layout/TerminalPanel';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

export default function ChatPage() {
  const { loadThreads } = useChatStore();
  const { sidebarOpen, terminalOpen } = useUIStore();

  useEffect(() => { loadThreads(); }, [loadThreads]);

  return (
    <div className="flex flex-col h-screen bg-surface-950 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-60 flex-shrink-0 border-r border-surface-800 overflow-y-auto">
            <Sidebar />
          </aside>
        )}
        <main className="flex-1 flex flex-col overflow-hidden">
          {terminalOpen ? (
            <PanelGroup direction="vertical">
              <Panel defaultSize={65} minSize={30}>
                <ChatInterface />
              </Panel>
              <PanelResizeHandle className="h-1 bg-surface-800 hover:bg-brand transition-colors cursor-row-resize" />
              <Panel defaultSize={35} minSize={20} maxSize={60}>
                <TerminalPanel />
              </Panel>
            </PanelGroup>
          ) : (
            <ChatInterface />
          )}
        </main>
      </div>
    </div>
  );
}
