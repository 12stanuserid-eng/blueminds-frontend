import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  terminalOpen: boolean;
  terminalHeight: number;
  activeRightTab: 'files' | 'terminal' | 'settings';
  activeSidebarTab: 'chats' | 'files' | 'tools' | 'apikeys';
  settingsOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  setRightPanelOpen: (v: boolean) => void;
  setTerminalOpen: (v: boolean) => void;
  setTerminalHeight: (h: number) => void;
  setActiveRightTab: (tab: 'files' | 'terminal' | 'settings') => void;
  setActiveSidebarTab: (tab: 'chats' | 'files' | 'tools' | 'apikeys') => void;
  setSettingsOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  toggleTerminal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  rightPanelOpen: false,
  terminalOpen: false,
  terminalHeight: 280,
  activeRightTab: 'files',
  activeSidebarTab: 'chats',
  settingsOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setRightPanelOpen: (v) => set({ rightPanelOpen: v }),
  setTerminalOpen: (v) => set({ terminalOpen: v }),
  setTerminalHeight: (h) => set({ terminalHeight: h }),
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setSettingsOpen: (v) => set({ settingsOpen: v }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  toggleTerminal: () => set(s => ({ terminalOpen: !s.terminalOpen }))
}));
