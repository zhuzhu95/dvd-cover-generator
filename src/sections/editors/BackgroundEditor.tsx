import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Droplets } from 'lucide-react';
import { fetchMediaImages, getImageUrl } from '@/services/tmdb';

// Default background options
const defaultBackgrounds = [
  '#cc0428', // Red
  '#1e3a5f', // Navy
  '#0f172a', // Dark slate
  '#064e3b', // Dark green
  '#4c0519', // Dark red
  '#312e81', // Indigo
  '#111827', // Gray 900
  '#3f0e5f', // Purple
];

export default function BackgroundEditor() {
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
        updateCoverSettings({
          backgroundImage: event.target?.result as string,
          backgroundTransparent: false,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">自定义背景</h4>
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
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              updateCoverSettings({
                backgroundImage: null,
                backgroundTransparent: !coverSettings.backgroundTransparent,
              });
            }}
          >
            <Droplets className="w-3 h-3 mr-1" />
            {coverSettings.backgroundTransparent ? '不透明' : '设为透明'}
          </Button>
        </div>
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-8 gap-2">
        {defaultBackgrounds.map((color) => (
          <button
            key={color}
            onClick={() =>
              updateCoverSettings({
                bgColor: color,
                backgroundImage: null,
                backgroundTransparent: false,
                useRainbow: false,
              })
            }
            className={`aspect-square rounded-lg border-2 transition-transform hover:scale-110 ${
              coverSettings.bgColor === color && !coverSettings.useRainbow
                ? 'border-sky-500 ring-2 ring-sky-200'
                : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Rainbow option */}
      <button
        onClick={() => updateCoverSettings({ useRainbow: true, backgroundImage: null })}
        className={`w-full h-8 rounded-lg border-2 transition-colors ${
          coverSettings.useRainbow
            ? 'border-sky-500 ring-2 ring-sky-200'
            : 'border-transparent'
        }`}
        style={{
          background:
            'linear-gradient(135deg, #dc2626 0%, #ea580c 20%, #ca8a04 40%, #16a34a 60%, #2563eb 80%, #9333ea 100%)',
        }}
      >
        <span className="text-xs text-white font-bold drop-shadow">彩虹渐变</span>
      </button>

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
                onClick={() =>
                  updateCoverSettings({
                    backgroundImage: coverSettings.backgroundImage === url ? null : url,
                    backgroundTransparent: false,
                  })
                }
                className={`relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  coverSettings.backgroundImage === url
                    ? 'border-sky-500 ring-2 ring-sky-200'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img
                  src={url || ''}
                  alt={`Background ${index + 1}`}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
