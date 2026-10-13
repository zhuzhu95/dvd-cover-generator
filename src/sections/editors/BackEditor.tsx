import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Upload, Loader2, X } from 'lucide-react';
import { fetchMediaImages, getImageUrl } from '@/services/tmdb';

export default function BackEditor() {
  const { coverSettings, updateCoverSettings, movieData, mediaType } = useStore();
  const [backdrops, setBackdrops] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movieData?.id) {
      setLoading(true);
      fetchMediaImages(movieData.id, mediaType)
        .then((images) => {
          setBackdrops(images.backdrops);
        })
        .finally(() => setLoading(false));
    }
  }, [movieData?.id, mediaType]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 4 - coverSettings.backWindows.length;
    const toAdd = Math.min(files.length, remaining);
    for (let i = 0; i < toAdd; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCoverSettings({
          backWindows: [...coverSettings.backWindows, event.target?.result as string],
        });
      };
      reader.readAsDataURL(files[i]);
    }
  };

  // Toggle back window selection (click to add/remove, max 4)
  const toggleBackWindow = (url: string) => {
    const current = coverSettings.backWindows;
    if (current.includes(url)) {
      updateCoverSettings({ backWindows: current.filter((u) => u !== url) });
    } else if (current.length < 4) {
      updateCoverSettings({ backWindows: [...current, url] });
    }
  };

  const clearAll = () => {
    updateCoverSettings({ backWindows: [] });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          背面窗口 ({coverSettings.backWindows.length}/4)
        </h4>
        <div className="flex items-center gap-2">
          {coverSettings.backWindows.length < 4 && (
            <label className="cursor-pointer">
              <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
              <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                <span>
                  <Upload className="w-3 h-3 mr-1" />
                  上传
                </span>
              </Button>
            </label>
          )}
          {coverSettings.backWindows.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={clearAll}
            >
              <X className="w-3 h-3 mr-1" />
              清除
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.backWindowShowLogo}
            onCheckedChange={(checked) =>
              updateCoverSettings({ backWindowShowLogo: checked })
            }
          />
          <Label className="text-xs">在窗口上方显示标志</Label>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">圆角半径</Label>
          <Slider
            value={[coverSettings.backWindowRadius]}
            onValueChange={([value]) => updateCoverSettings({ backWindowRadius: value })}
            min={0}
            max={20}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-slate-500 w-8">{coverSettings.backWindowRadius}px</span>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">边框粗细</Label>
          <Slider
            value={[coverSettings.backWindowBorder]}
            onValueChange={([value]) => updateCoverSettings({ backWindowBorder: value })}
            min={0}
            max={10}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-slate-500 w-8">{coverSettings.backWindowBorder}px</span>
        </div>
      </div>

      {/* Selected windows preview */}
      {coverSettings.backWindows.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {coverSettings.backWindows.map((bw, i) => (
            <div key={i} className="relative w-16 h-10 rounded overflow-hidden border border-slate-200">
              <img src={bw} alt={`Selected ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => toggleBackWindow(bw)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-bl text-[8px] w-3.5 h-3.5 flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Backdrop Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      ) : backdrops.length > 0 ? (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {backdrops.slice(0, 12).map((backdrop, index) => {
            const thumbUrl = getImageUrl(backdrop, 'w300');
            const fullUrl = getImageUrl(backdrop, 'original');
            const isSelected = coverSettings.backWindows.includes(fullUrl || '');
            return (
              <button
                key={index}
                onClick={() => toggleBackWindow(fullUrl || '')}
                className={`relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-200'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img
                  src={thumbUrl || ''}
                  alt={`Backdrop ${index + 1}`}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                {isSelected && (
                  <div className="absolute top-0.5 right-0.5 bg-sky-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold">
                    {coverSettings.backWindows.indexOf(fullUrl || '') + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-4">
          {movieData ? '未找到背景图，请上传自定义图片' : '请先搜索并选择一部电影'}
        </p>
      )}
    </div>
  );
}
