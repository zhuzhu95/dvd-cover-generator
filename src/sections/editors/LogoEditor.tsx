import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, X } from 'lucide-react';
import { fetchMediaLogos, getImageUrl } from '@/services/tmdb';

export default function LogoEditor() {
  const { coverSettings, updateCoverSettings, movieData, mediaType } = useStore();
  const [logos, setLogos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movieData?.id) {
      setLoading(true);
      fetchMediaLogos(movieData.id, mediaType)
        .then((logoPaths) => {
          setLogos(logoPaths);
        })
        .finally(() => setLoading(false));
    }
  }, [movieData?.id, mediaType]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCoverSettings({ selectedLogo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle logo selection (click again to deselect)
  const toggleLogo = (url: string) => {
    if (coverSettings.selectedLogo === url) {
      updateCoverSettings({ selectedLogo: null });
    } else {
      updateCoverSettings({ selectedLogo: url });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">选择标志</h4>
        <div className="flex items-center gap-2">
          {coverSettings.selectedLogo && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => updateCoverSettings({ selectedLogo: null })}
            >
              <X className="w-3 h-3 mr-1" />
              清除
            </Button>
          )}
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
              <span>
                <Upload className="w-3 h-3 mr-1" />
                上传自定义
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.logoInvert}
            onCheckedChange={(checked) => updateCoverSettings({ logoInvert: checked })}
          />
          <Label className="text-xs">反转标志颜色</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.logoNoColor}
            onCheckedChange={(checked) => updateCoverSettings({ logoNoColor: checked })}
          />
          <Label className="text-xs">不上色</Label>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      ) : logos.length > 0 ? (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {logos.map((logoPath, index) => {
            const thumbUrl = getImageUrl(logoPath, 'w300');
            const fullUrl = getImageUrl(logoPath, 'original');
            return (
              <button
                key={index}
                onClick={() => toggleLogo(fullUrl || '')}
                className={`relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  coverSettings.selectedLogo === fullUrl
                    ? 'border-sky-500 ring-2 ring-sky-200'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img
                  src={thumbUrl || ''}
                  alt={`Logo ${index + 1}`}
                  className="w-full h-full object-contain p-1"
                  crossOrigin="anonymous"
                />
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-4">
          {movieData
            ? '未找到标志，请上传自定义标志'
            : '请先搜索并选择一部电影'}
        </p>
      )}
    </div>
  );
}
