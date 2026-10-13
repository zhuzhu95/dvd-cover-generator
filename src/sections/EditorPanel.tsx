import { useStore } from '@/store/useStore';
import type { EditorTab } from '@/types';
import {
  Type,
  Image,
  BookMarked,
  Building2,
  PanelLeft,
  Sticker,
  Layers,
  Wallpaper,
  Code,
  Megaphone,
} from 'lucide-react';
import TextEditor from './editors/TextEditor';
import LogoEditor from './editors/LogoEditor';
import CoverArtEditor from './editors/CoverArtEditor';
import SpineEditor from './editors/SpineEditor';
import StudioEditor from './editors/StudioEditor';
import BackEditor from './editors/BackEditor';
import DecalsEditor from './editors/DecalsEditor';
import OverlayEditor from './editors/OverlayEditor';
import BackgroundEditor from './editors/BackgroundEditor';
import CodeEditor from './editors/CodeEditor';

const tabs: { id: EditorTab; label: string; icon: React.ElementType }[] = [
  { id: 'text', label: '编辑文字', icon: Type },
  { id: 'logo', label: '标志', icon: Megaphone },
  { id: 'coverArt', label: '封面艺术', icon: Image },
  { id: 'spine', label: '书脊', icon: BookMarked },
  { id: 'studio', label: '工作室', icon: Building2 },
  { id: 'back', label: '封底', icon: PanelLeft },
  { id: 'decals', label: '贴花', icon: Sticker },
  { id: 'overlay', label: '叠加', icon: Layers },
  { id: 'background', label: '自定义背景', icon: Wallpaper },
  { id: 'code', label: '代码', icon: Code },
];

export default function EditorPanel() {
  const { activeTab, setActiveTab } = useStore();

  const renderEditor = () => {
    switch (activeTab) {
      case 'text':
        return <TextEditor />;
      case 'logo':
        return <LogoEditor />;
      case 'coverArt':
        return <CoverArtEditor />;
      case 'spine':
        return <SpineEditor />;
      case 'studio':
        return <StudioEditor />;
      case 'back':
        return <BackEditor />;
      case 'decals':
        return <DecalsEditor />;
      case 'overlay':
        return <OverlayEditor />;
      case 'background':
        return <BackgroundEditor />;
      case 'code':
        return <CodeEditor />;
      default:
        return <TextEditor />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center gap-0 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-sky-500 text-sky-600 bg-sky-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {renderEditor()}
      </div>
    </div>
  );
}
