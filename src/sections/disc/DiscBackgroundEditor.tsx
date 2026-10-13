import { useDiscStore } from '@/store/useDiscStore';
import { Button } from '@/components/ui/button';

const colors = ['#cc0428', '#1e3a5f', '#0f172a', '#064e3b', '#4c0519', '#312e81', '#111827', '#3f0e5f'];

export default function DiscBackgroundEditor() {
  const { settings, updateSettings } = useDiscStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">背景色</h4>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { updateSettings({ backgroundImage: null, backgroundTransparent: !settings.backgroundTransparent }); }}>
          {settings.backgroundTransparent ? '不透明' : '透明'}
        </Button>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {colors.map((c) => (
          <button key={c} onClick={() => updateSettings({ bgColor: c, useRainbow: false, backgroundImage: null })} className={`aspect-square rounded-lg border-2 ${settings.bgColor === c && !settings.useRainbow ? 'border-sky-500 ring-2 ring-sky-200' : 'border-transparent'}`} style={{ backgroundColor: c }} />
        ))}
      </div>
      <button onClick={() => { updateSettings({ useRainbow: true, backgroundImage: null }); }} className={`w-full h-8 rounded-lg border-2 ${settings.useRainbow ? 'border-sky-500 ring-2 ring-sky-200' : 'border-transparent'}`} style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c, #ca8a04, #16a34a, #2563eb, #9333ea)' }}>
        <span className="text-xs text-white font-bold drop-shadow">彩虹渐变</span>
      </button>
    </div>
  );
}
