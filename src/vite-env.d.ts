/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SOCKET_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'lucide-react' {
  import * as React from 'react';
  export interface IconProps extends React.SVGAttributes<SVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  export type Icon = React.FC<IconProps>;
  export const Search: Icon; export const Menu: Icon; export const X: Icon;
  export const Plus: Icon; export const Minus: Icon; export const Check: Icon;
  export const ChevronDown: Icon; export const ChevronUp: Icon; export const ChevronLeft: Icon; export const ChevronRight: Icon;
  export const ArrowLeft: Icon; export const ArrowRight: Icon; export const ArrowUp: Icon; export const ArrowDown: Icon;
  export const Send: Icon; export const Square: Icon; export const Paperclip: Icon; export const Mic: Icon;
  export const AtSign: Icon; export const Command: Icon; export const Copy: Icon; export const Download: Icon;
  export const Play: Icon; export const Pause: Icon; export const RefreshCw: Icon;
  export const Settings: Icon; export const User: Icon; export const Users: Icon; export const LogOut: Icon;
  export const Home: Icon; export const Folder: Icon; export const File: Icon; export const Code: Icon;
  export const Terminal: Icon; export const Maximize2: Icon; export const Minimize2: Icon;
  export const Trash2: Icon; export const Edit: Icon; export const Eye: Icon; export const EyeOff: Icon;
  export const Bot: Icon; export const Brain: Icon; export const Cpu: Icon; export const Zap: Icon;
  export const Star: Icon; export const Heart: Icon; export const MessageSquare: Icon; export const Bell: Icon;
  export const Moon: Icon; export const Sun: Icon; export const Globe: Icon; export const Link: Icon;
  export const ExternalLink: Icon; export const Share: Icon; export const Upload: Icon;
  export const AlertCircle: Icon; export const Info: Icon; export const CheckCircle: Icon; export const XCircle: Icon;
  export const Loader: Icon; export const Loader2: Icon; export const Sparkles: Icon; export const Wand2: Icon;
  export const Hash: Icon; export const List: Icon; export const Grid: Icon; export const Layout: Icon;
  export const Sidebar: Icon; export const Monitor: Icon; export const Smartphone: Icon; export const Tablet: Icon;
  export const Github: Icon; export const GitBranch: Icon; export const GitCommit: Icon; export const GitMerge: Icon;
  export const Database: Icon; export const Server: Icon; export const Cloud: Icon; export const Lock: Icon;
  export const Unlock: Icon; export const Key: Icon; export const Shield: Icon; export const Activity: Icon;
  export const BarChart: Icon; export const BarChart2: Icon; export const PieChart: Icon; export const TrendingUp: Icon;
  export const Package: Icon; export const Box: Icon; export const Archive: Icon; export const Bookmark: Icon;
  export const Tag: Icon; export const Filter: Icon; export const SortAsc: Icon; export const SortDesc: Icon;
  export const MoreHorizontal: Icon; export const MoreVertical: Icon;
  export const Clock: Icon; export const Calendar: Icon; export const Timer: Icon;
  export const Map: Icon; export const Navigation: Icon; export const Compass: Icon; export const MapPin: Icon;
  export const Image: Icon; export const Camera: Icon; export const Video: Icon; export const Music: Icon;
  export const Volume: Icon; export const Volume2: Icon; export const VolumeX: Icon;
  export const Pen: Icon; export const PenTool: Icon; export const Pencil: Icon; export const Eraser: Icon;
  export const Move: Icon; export const ZoomIn: Icon; export const ZoomOut: Icon; export const Crop: Icon;
  export const Layers: Icon; export const Sliders: Icon; export const Palette: Icon;
  export const Type: Icon; export const Bold: Icon; export const Italic: Icon; export const Underline: Icon;
  export const AlignLeft: Icon; export const AlignCenter: Icon; export const AlignRight: Icon;
  export const HelpCircle: Icon; export const MessageCircle: Icon; export const Mail: Icon; export const Phone: Icon;
  export const Wifi: Icon; export const Power: Icon; export const ToggleLeft: Icon; export const ToggleRight: Icon;
  [key: string]: Icon | any;
}
