import { useDiscStore } from '@/store/useDiscStore';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function DiscColorPanel() {
  const { settings, updateSettings, showColorPanel } = useDiscStore();
  if (!showColorPanel) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-4">
      <h3 className="text-sm font-semibold mb-3">颜色控制</h3>
      <div className="flex items-center gap-2 mb-3">
        <Switch checked={settings.useRainbow} onCheckedChange={(c) => updateSettings({ useRainbow: c })} />
        <Label className="text-xs">彩虹渐变</Label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {!settings.useRainbow && (
          <div className="space-y-1">
            <Label className="text-xs">背景色</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.bgColor} onChange={(e) => updateSettings({ bgColor: e.target.value })} className="w-8 h-8 rounded border-0 cursor-pointer" />
              <span className="text-xs text-slate-500">{settings.bgColor}</span>
            </div>
          </div>
        )}
        <div className="space-y-1">
          <Label className="text-xs">边框色</Label>
          <div className="flex items-center gap-2">
            <input type="color" value={settings.borderColor} onChange={(e) => updateSettings({ borderColor: e.target.value })} className="w-8 h-8 rounded border-0 cursor-pointer" />
            <span className="text-xs text-slate-500">{settings.borderColor}</span>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">文字色</Label>
          <div className="flex items-center gap-2">
            <input type="color" value={settings.textColor} onChange={(e) => updateSettings({ textColor: e.target.value })} className="w-8 h-8 rounded border-0 cursor-pointer" />
            <span className="text-xs text-slate-500">{settings.textColor}</span>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">上色</Label>
          <div className="flex items-center gap-2">
            <input type="color" value={settings.tintColor} onChange={(e) => updateSettings({ tintColor: e.target.value })} className="w-8 h-8 rounded border-0 cursor-pointer" />
            <span className="text-xs text-slate-500">{settings.tintColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
