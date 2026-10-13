import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Loader2, Maximize, Minimize, FlipHorizontal, X } from 'lucide-react';
import { fetchMediaImages, getImageUrl } from '@/services/tmdb';

export default function CoverArtEditor() {
  const { coverSettings, updateCoverSettings, movieData, mediaType } = useStore();
  const [posters, setPosters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movieData?.id) {
      setLoading(true);
      fetchMediaImages(movieData.id, mediaType)
        .then((images) => {
          setPosters(images.posters);
        })
        .finally(() => setLoading(false));
    }
  }, [movieData?.id, mediaType]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCoverSettings({ coverArt: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle cover art selection (click again to deselect)
  const toggleCoverArt = (url: string) => {
    if (coverSettings.coverArt === url) {
      updateCoverSettings({ coverArt: null });
    } else {
      updateCoverSettings({ coverArt: url });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">选择艺术图</h4>
        <div className="flex items-center gap-2">
          {coverSettings.coverArt && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => updateCoverSettings({ coverArt: null })}
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

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">缩放</Label>
          <Slider
            value={[coverSettings.coverArtScale]}
            onValueChange={([value]) => updateCoverSettings({ coverArtScale: value })}
            min={0.5}
            max={3}
            step={0.01}
            className="w-24"
          />
          <span className="text-xs text-slate-500 w-10">{coverSettings.coverArtScale.toFixed(2)}x</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={coverSettings.coverArtMode === 'fill' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateCoverSettings({ coverArtMode: 'fill' })}
            className="h-7 text-xs"
          >
            <Maximize className="w-3 h-3 mr-1" />
            填充
          </Button>
          <Button
            variant={coverSettings.coverArtMode === 'fit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateCoverSettings({ coverArtMode: 'fit' })}
            className="h-7 text-xs"
          >
            <Minimize className="w-3 h-3 mr-1" />
            适应
          </Button>
          <Button
            variant={coverSettings.coverArtMode === 'mirror' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateCoverSettings({ coverArtMode: 'mirror' })}
            className="h-7 text-xs"
          >
            <FlipHorizontal className="w-3 h-3 mr-1" />
            Mirror
          </Button>
        </div>
      </div>

      {/* Poster Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      ) : posters.length > 0 ? (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {posters.slice(0, 18).map((poster, index) => {
            const thumbUrl = getImageUrl(poster, 'w185');
            const fullUrl = getImageUrl(poster, 'original');
            return (
              <button
                key={index}
                onClick={() => toggleCoverArt(fullUrl || '')}
                className={`relative aspect-[2/3] bg-slate-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  coverSettings.coverArt === fullUrl
                    ? 'border-sky-500 ring-2 ring-sky-200'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img
                  src={thumbUrl || ''}
                  alt={`Poster ${index + 1}`}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-4">
          {movieData ? '未找到海报，请上传自定义图片' : '请先搜索并选择一部电影'}
        </p>
      )}
    </div>
  );
}
