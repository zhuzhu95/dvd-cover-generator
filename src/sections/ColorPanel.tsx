import { useStore } from '@/store/useStore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ColorPanel() {
  const { coverSettings, updateCoverSettings, showColorPanel } = useStore();

  if (!showColorPanel) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">颜色控制</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            updateCoverSettings({
              tintColor: '#cc0428',
              borderColor: '#000000',
              textColor: '#ffffff',
              bgColor: '#cc0428',
              useRainbow: true,
            });
          }}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          重置
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.useRainbow}
            onCheckedChange={(checked) => updateCoverSettings({ useRainbow: checked })}
          />
          <Label className="text-xs">彩虹渐变</Label>
        </div>

        {!coverSettings.useRainbow && (
          <>
            <div className="space-y-1">
              <Label className="text-xs">背景色</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={coverSettings.bgColor}
                  onChange={(e) => updateCoverSettings({ bgColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                />
                <span className="text-xs text-slate-500">{coverSettings.bgColor}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">上色</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={coverSettings.tintColor}
                  onChange={(e) => updateCoverSettings({ tintColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                />
                <span className="text-xs text-slate-500">{coverSettings.tintColor}</span>
              </div>
            </div>
          </>
        )}

        <div className="space-y-1">
          <Label className="text-xs">边框色</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={coverSettings.borderColor}
              onChange={(e) => updateCoverSettings({ borderColor: e.target.value })}
              className="w-8 h-8 rounded border-0 cursor-pointer"
            />
            <span className="text-xs text-slate-500">{coverSettings.borderColor}</span>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">文字色</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={coverSettings.textColor}
              onChange={(e) => updateCoverSettings({ textColor: e.target.value })}
              className="w-8 h-8 rounded border-0 cursor-pointer"
            />
            <span className="text-xs text-slate-500">{coverSettings.textColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
