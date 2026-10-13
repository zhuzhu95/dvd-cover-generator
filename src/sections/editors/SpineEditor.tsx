import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Upload, Loader2, X } from 'lucide-react';
import { fetchMediaImages, getImageUrl } from '@/services/tmdb';

// Media badge files copied from original website
const mediaBadgeFiles = [
  '/badges/media-logo-01.png',
  '/badges/media-logo-02.png',
  '/badges/media-logo-03.png',
  '/badges/media-logo-04.png',
  '/badges/media-logo-05.png',
  '/badges/media-logo-06.png',
  '/badges/media-logo-07.png',
  '/badges/media-logo-08.png',
  '/badges/media-logo-09.png',
  '/badges/media-logo-10.png',
  '/badges/media-logo-11.png',
  '/badges/media-logo-12.png',
  '/badges/media-logo-13.png',
];

export default function SpineEditor() {
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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCoverSettings({ spineWindow: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle media badge selection (click again to deselect)
  const toggleMediaBadge = (badgePath: string) => {
    if (coverSettings.selectedMediaBadge === badgePath) {
      updateCoverSettings({ selectedMediaBadge: null });
    } else {
      updateCoverSettings({ selectedMediaBadge: badgePath });
    }
  };

  // Toggle spine window (deselect)
  const toggleSpineWindow = (url: string) => {
    if (coverSettings.spineWindow === url) {
      updateCoverSettings({ spineWindow: null });
    } else {
      updateCoverSettings({ spineWindow: url });
    }
  };

  return (
    <div className="space-y-4">
      {/* Spine Label - editable studio label */}
      <div className="space-y-2 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">书脊标签</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={!coverSettings.hideSpineLabel}
              onCheckedChange={(checked) => updateCoverSettings({ hideSpineLabel: !checked })}
            />
            <Label className="text-xs">显示</Label>
          </div>
        </div>
        <Input
          value={coverSettings.spineLabel}
          onChange={(e) => updateCoverSettings({ spineLabel: e.target.value })}
          className="h-8 text-sm"
          placeholder="VHS"
        />
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.spineLogoRotate}
            onCheckedChange={(checked) => updateCoverSettings({ spineLogoRotate: checked })}
          />
          <Label className="text-xs">标志旋转90度</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">标志大小</Label>
          <Slider
            value={[coverSettings.spineLogoScale]}
            onValueChange={([v]) => updateCoverSettings({ spineLogoScale: v })}
            min={0.3}
            max={3}
            step={0.01}
            className="flex-1"
          />
          <span className="text-xs text-slate-500 w-10 text-right">{coverSettings.spineLogoScale.toFixed(2)}x</span>
        </div>
        <p className="text-[10px] text-slate-500">
          显示在书脊顶部，也会在背面年份后面显示
        </p>
      </div>

      {/* Spine Window */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">书脊窗口</h4>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                <span>
                  <Upload className="w-3 h-3 mr-1" />
                  上传
                </span>
              </Button>
            </label>
            {coverSettings.spineWindow && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => updateCoverSettings({ spineWindow: null })}
              >
                <X className="w-3 h-3 mr-1" />
                清除
              </Button>
            )}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'spineWindowScale' as const, label: '缩放', min: 0.5, max: 2, step: 0.01 },
            { key: 'spineWindowWidth' as const, label: '宽度', min: 20, max: 100, step: 1 },
            { key: 'spineWindowHeight' as const, label: '高度', min: 50, max: 150, step: 1 },
            { key: 'spineWindowRadius' as const, label: '半径', min: 0, max: 20, step: 1 },
            { key: 'spineWindowBorder' as const, label: '边框', min: 0, max: 10, step: 1 },
          ].map((control) => (
            <div key={control.key} className="flex items-center gap-2">
              <Label className="text-xs whitespace-nowrap w-8">{control.label}</Label>
              <Slider
                value={[Number(coverSettings[control.key])]}
                onValueChange={([value]) => updateCoverSettings({ [control.key]: value })}
                min={control.min}
                max={control.max}
                step={control.step}
                className="flex-1"
              />
              <span className="text-xs text-slate-500 w-8 text-right">
                {String(coverSettings[control.key])}
              </span>
            </div>
          ))}
        </div>

        {/* Backdrop Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : backdrops.length > 0 ? (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {backdrops.slice(0, 12).map((backdrop, index) => {
              const url = getImageUrl(backdrop, 'w300');
              return (
                <button
                  key={index}
                  onClick={() => toggleSpineWindow(url || '')}
                  className={`relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    coverSettings.spineWindow === url
                      ? 'border-sky-500 ring-2 ring-sky-200'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img
                    src={url || ''}
                    alt={`Backdrop ${index + 1}`}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Media Badges */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">媒体徽章</h4>
          <div className="flex items-center gap-2">
            {coverSettings.selectedMediaBadge && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => updateCoverSettings({ selectedMediaBadge: null })}
              >
                <X className="w-3 h-3 mr-1" />
                清除
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Switch
                checked={coverSettings.mediaBadgeNoColor}
                onCheckedChange={(checked) => updateCoverSettings({ mediaBadgeNoColor: checked })}
              />
              <Label className="text-xs">不上色</Label>
            </div>
          </div>
        </div>

        {/* Real media badges - show white by default, colored when noColor checked */}
        <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
          {mediaBadgeFiles.map((badgePath, index) => {
            const displayPath = coverSettings.mediaBadgeNoColor ? badgePath : badgePath.replace('.png', '-white.png');
            return (
              <button
                key={index}
                onClick={() => toggleMediaBadge(badgePath)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 p-1 transition-colors ${
                  coverSettings.selectedMediaBadge === badgePath
                    ? 'border-sky-500 ring-2 ring-sky-200'
                    : 'border-transparent hover:border-slate-300'
                }`}
                style={{ backgroundColor: coverSettings.mediaBadgeNoColor ? '#f8f8f8' : '#cc0428' }}
              >
                <img
                  src={displayPath}
                  alt={`Media badge ${index + 1}`}
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
