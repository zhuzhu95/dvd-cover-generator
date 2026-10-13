import { useStore } from '@/store/useStore';
import { useDiscStore } from '@/store/useDiscStore';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

export default function DiscLogoEditor() {
  const { movieData } = useStore();
  const { settings, updateSettings } = useDiscStore();

  const toggleLogo = (url: string) => {
    updateSettings({ selectedLogo: settings.selectedLogo === url ? null : url });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateSettings({ selectedLogo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  // Use logo from movieData if available
  const logoUrl = movieData?.logoPath
    ? `https://image.tmdb.org/t/p/w300${movieData.logoPath}`
    : null;
  const fullLogoUrl = movieData?.logoPath
    ? `https://image.tmdb.org/t/p/original${movieData.logoPath}`
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">选择标志</h4>
        <div className="flex items-center gap-2">
          {settings.selectedLogo && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => updateSettings({ selectedLogo: null })}>
              <X className="w-3 h-3 mr-1" />清除
            </Button>
          )}
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
              <span><Upload className="w-3 h-3 mr-1" />上传</span>
            </Button>
          </label>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={settings.logoInvert} onCheckedChange={(c) => updateSettings({ logoInvert: c })} />
          <Label className="text-xs">反转颜色</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={settings.logoNoColor} onCheckedChange={(c) => updateSettings({ logoNoColor: c })} />
          <Label className="text-xs">不上色</Label>
        </div>
      </div>

      {logoUrl ? (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          <button
            onClick={() => toggleLogo(fullLogoUrl || '')}
            className={`aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 p-1 transition-colors ${
              settings.selectedLogo === fullLogoUrl ? 'border-sky-500 ring-2 ring-sky-200' : 'border-transparent hover:border-slate-300'
            }`}
          >
            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-4">
          {movieData ? '该影片没有标志，请上传自定义' : '请先搜索并选择一部电影'}
        </p>
      )}
    </div>
  );
}
