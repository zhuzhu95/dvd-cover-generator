import { useDiscStore } from '@/store/useDiscStore';
import { Type, Image, Building2, Sticker, Wallpaper, Megaphone } from 'lucide-react';
import DiscTextEditor from './DiscTextEditor';
import DiscLogoEditor from './DiscLogoEditor';
import DiscCoverArtEditor from './DiscCoverArtEditor';
import DiscStudioEditor from './DiscStudioEditor';
import DiscDecalsEditor from './DiscDecalsEditor';
import DiscBackgroundEditor from './DiscBackgroundEditor';

const tabs = [
  { id: 'text' as const, label: '编辑文字', icon: Type },
  { id: 'logo' as const, label: '标志', icon: Megaphone },
  { id: 'coverArt' as const, label: '封面艺术', icon: Image },
  { id: 'studio' as const, label: '工作室', icon: Building2 },
  { id: 'decals' as const, label: '贴花', icon: Sticker },
  { id: 'background' as const, label: '自定义背景', icon: Wallpaper },
];

export default function DiscEditorPanel() {
  const { activeTab, setActiveTab } = useDiscStore();

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center border-b border-slate-200 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.id ? 'border-sky-500 text-sky-600 bg-sky-50' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'text' && <DiscTextEditor />}
        {activeTab === 'logo' && <DiscLogoEditor />}
        {activeTab === 'coverArt' && <DiscCoverArtEditor />}
        {activeTab === 'studio' && <DiscStudioEditor />}
        {activeTab === 'decals' && <DiscDecalsEditor />}
        {activeTab === 'background' && <DiscBackgroundEditor />}
      </div>
    </div>
  );
}
