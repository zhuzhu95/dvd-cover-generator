import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useDiscStore } from '@/store/useDiscStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, X, Loader2 } from 'lucide-react';
import { fetchMediaImages, getImageUrl } from '@/services/tmdb';

export default function DiscCoverArtEditor() {
  const { movieData, mediaType } = useStore();
  const { settings, updateSettings } = useDiscStore();
  const [posters, setPosters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch posters when movieData changes
  useEffect(() => {
    if (movieData?.id) {
      setLoading(true);
      fetchMediaImages(movieData.id, mediaType)
        .then((images) => setPosters(images.posters))
        .finally(() => setLoading(false));
    } else {
      setPosters([]);
    }
  }, [movieData?.id, mediaType]);

  const toggleArt = (url: string) => {
    updateSettings({ coverArt: settings.coverArt === url ? null : url });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateSettings({ coverArt: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  // Also show the main poster from movieData as first option
  const mainPoster = movieData?.posterPath
    ? `https://image.tmdb.org/t/p/original${movieData.posterPath}`
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">选择艺术图</h4>
        <div className="flex items-center gap-2">
          {settings.coverArt && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => updateSettings({ coverArt: null })}>
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
      <div className="flex items-center gap-2">
        <Label className="text-xs">缩放</Label>
        <Slider value={[settings.coverArtScale]} onValueChange={([v]) => updateSettings({ coverArtScale: v })} min={0.5} max={3} step={0.01} className="w-24" />
        <span className="text-xs text-slate-500">{settings.coverArtScale.toFixed(2)}x</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
      ) : posters.length > 0 || mainPoster ? (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {/* Main poster first */}
          {mainPoster && (
            <button
              onClick={() => toggleArt(mainPoster)}
              className={`aspect-[2/3] bg-slate-100 rounded-lg overflow-hidden border-2 transition-colors ${
                settings.coverArt === mainPoster ? 'border-sky-500 ring-2 ring-sky-200' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <span className="absolute top-0.5 left-0.5 bg-sky-500 text-white text-[7px] font-bold px-1 rounded z-10">主</span>
              <img src={getImageUrl(movieData?.posterPath || '', 'w185') || ''} alt="" className="w-full h-full object-cover" />
            </button>
          )}
          {/* Additional posters */}
          {posters.slice(0, 17).map((p, i) => {
            const fullUrl = getImageUrl(p, 'original');
            return (
              <button
                key={i}
                onClick={() => toggleArt(fullUrl || '')}
                className={`aspect-[2/3] bg-slate-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  settings.coverArt === fullUrl ? 'border-sky-500 ring-2 ring-sky-200' : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img src={getImageUrl(p, 'w185') || ''} alt="" className="w-full h-full object-cover" />
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
