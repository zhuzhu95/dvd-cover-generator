import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload } from 'lucide-react';

export default function StudioEditor() {
  const { coverSettings, updateCoverSettings, movieData } = useStore();

  const toggleStudio = (logo: string) => {
    const current = coverSettings.selectedStudios;
    if (current.includes(logo)) {
      updateCoverSettings({ selectedStudios: current.filter((s) => s !== logo) });
    } else if (current.length < 4) {
      updateCoverSettings({ selectedStudios: [...current, logo] });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (coverSettings.selectedStudios.length < 4) {
          updateCoverSettings({
            selectedStudios: [...coverSettings.selectedStudios, url],
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const colorModes: { value: 'original' | 'white' | 'black'; label: string }[] = [
    { value: 'original', label: '本色' },
    { value: 'white', label: '白色' },
    { value: 'black', label: '黑色' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          制作公司标志 ({coverSettings.selectedStudios.length}/4)
        </h4>
        <label className="cursor-pointer">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
            <span>
              <Upload className="w-3 h-3 mr-1" />
              上传
            </span>
          </Button>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-xs whitespace-nowrap">缩放</Label>
        <Slider
          value={[coverSettings.studioScale]}
          onValueChange={([value]) => updateCoverSettings({ studioScale: value })}
          min={50}
          max={200}
          step={5}
          className="w-32"
        />
        <span className="text-xs text-slate-500">{coverSettings.studioScale}%</span>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-xs whitespace-nowrap">颜色</Label>
        <div className="flex items-center gap-1">
          {colorModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => updateCoverSettings({ studioColorMode: mode.value })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                coverSettings.studioColorMode === mode.value
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
        点击标志可选择最多四个。第一个标志会显示在封脊和最左侧面板。
      </p>

      {/* TMDB Studios */}
      {movieData?.productionCompanies && movieData.productionCompanies.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {movieData.productionCompanies.map((company) =>
            company.logoPath ? (
              <button
                key={company.id}
                onClick={() => toggleStudio(`https://image.tmdb.org/t/p/w200${company.logoPath}`)}
                className={`relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 p-1 transition-colors ${
                  coverSettings.selectedStudios.includes(
                    `https://image.tmdb.org/t/p/w200${company.logoPath}`
                  )
                    ? 'border-sky-500 ring-2 ring-sky-200'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${company.logoPath}`}
                  alt={company.name}
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
              </button>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
