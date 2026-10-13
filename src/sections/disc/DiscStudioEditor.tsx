import { useStore } from '@/store/useStore';
import { useDiscStore } from '@/store/useDiscStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload } from 'lucide-react';

export default function DiscStudioEditor() {
  const { movieData } = useStore();
  const { settings, updateSettings } = useDiscStore();

  const toggleStudio = (logo: string) => {
    const curr = settings.selectedStudios;
    if (curr.includes(logo)) {
      updateSettings({ selectedStudios: curr.filter((s) => s !== logo) });
    } else if (curr.length < 4) {
      updateSettings({ selectedStudios: [...curr, logo] });
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (settings.selectedStudios.length < 4) {
        updateSettings({ selectedStudios: [...settings.selectedStudios, url] });
      }
    };
    reader.readAsDataURL(file);
  };

  // Get studio logos from movieData production companies
  const tmdbStudios = (movieData?.productionCompanies || [])
    .filter((c) => c.logoPath)
    .map((c) => ({
      id: c.id,
      name: c.name,
      thumb: `https://image.tmdb.org/t/p/w200${c.logoPath}`,
    }));

  const colorModes: { value: 'original' | 'white' | 'black'; label: string }[] = [
    { value: 'original', label: '本色' },
    { value: 'white', label: '白色' },
    { value: 'black', label: '黑色' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">工作室 ({settings.selectedStudios.length}/4)</h4>
        <label className="cursor-pointer">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
            <span><Upload className="w-3 h-3 mr-1" />上传</span>
          </Button>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-xs">缩放</Label>
        <Slider value={[settings.studioScale]} onValueChange={([v]) => updateSettings({ studioScale: v })} min={50} max={200} step={5} className="w-32" />
        <span className="text-xs text-slate-500">{settings.studioScale}%</span>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-xs whitespace-nowrap">颜色</Label>
        <div className="flex items-center gap-1">
          {colorModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => updateSettings({ studioColorMode: mode.value })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                settings.studioColorMode === mode.value
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        点击标志可选择最多四个。选择后可在盘面上调整大小和颜色。
      </p>

      {/* TMDB Studios from movie */}
      {tmdbStudios.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-slate-500">影片制作公司</p>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {tmdbStudios.map((studio) => (
              <button
                key={studio.id}
                onClick={() => toggleStudio(studio.thumb)}
                className={`aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 p-1 transition-colors ${
                  settings.selectedStudios.includes(studio.thumb)
                    ? 'border-sky-500 ring-2 ring-sky-200'
                    : 'border-transparent hover:border-slate-300'
                }`}
                title={studio.name}
              >
                <img src={studio.thumb} alt={studio.name} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected studios list */}
      {settings.selectedStudios.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-slate-500">已选择</p>
          <div className="flex flex-wrap gap-2">
            {settings.selectedStudios.map((logo, i) => (
              <div key={i} className="relative group">
                <img src={logo} alt="" className="h-8 object-contain bg-slate-100 rounded px-1" />
                <button
                  onClick={() => toggleStudio(logo)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] hidden group-hover:flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
