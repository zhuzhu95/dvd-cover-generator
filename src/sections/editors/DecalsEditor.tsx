import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, RotateCcw } from 'lucide-react';
import type { DecalItem } from '@/types';

// Sample decals - stickers and badges
const decalCategories: Record<string, string[]> = {
  热门: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/DVD_video_logo.png/80px-DVD_video_logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Blu-ray_Disc.svg/80px-Blu-ray_Disc.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/VHS_logo.svg/80px-VHS_logo.svg.png',
  ],
  标志: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/100px-Netflix_2015_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/100px-Disney%2B_logo.svg.png',
  ],
  评级: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDAwIi8+PHRleHQgeD0iMjAiIHk9IjI2IiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+Tkc8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDAwIi8+PHRleHQgeD0iMjAiIHk9IjI2IiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+Ukc8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDAwIi8+PHRleHQgeD0iMjAiIHk9IjI2IiBmb250LXNpemU9IjE2IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+UEMtMTM8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDAwIi8+PHRleHQgeD0iMjAiIHk9IjI2IiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+UjwvdGV4dD48L3N2Zz4=',
  ],
  贴纸: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzgiIGZpbGw9IiNmNTllMGIiLz48dGV4dCB4PSI0MCIgeT0iMzAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5MSU1JVEVEPC90ZXh0Pjx0ZXh0IHg9IjQwIiB5PSI1MCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPjE1dGg8L3RleHQ+PC90ZXh0Pjx0ZXh0IHg9IjQwIiB5PSI2NSIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QW5uaXZlcnNhcnk8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzgiIGZpbGw9IiNlZjQ0NDQiLz48dGV4dCB4PSI0MCIgeT0iMzUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5ERUxVWDwvdGV4dD48dGV4dCB4PSI0MCIgeT0iNTUiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjIgRElTQ1MgU0VUPC90ZXh0Pjwvc3ZnPg==',
  ],
};

export default function DecalsEditor() {
  const { coverSettings, addDecal, removeDecal, updateDecal } = useStore();
  const [category, setCategory] = useState('热门');
  // Selected decal state for future use
  useState<string | null>(null);

  const handleAddDecal = (image: string) => {
    const newDecal: DecalItem = {
      id: `decal-${Date.now()}`,
      image,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    };
    addDecal(newDecal);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleAddDecal(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">贴花</h4>
        <label className="cursor-pointer">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
            <span>
              <Upload className="w-3 h-3 mr-1" />
              上传图片
            </span>
          </Button>
        </label>
      </div>

      {/* Category Selector */}
      <div className="flex items-center gap-1 flex-wrap">
        {Object.keys(decalCategories).map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(cat)}
            className="h-7 text-xs"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Decal Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {decalCategories[category]?.map((decal, index) => (
          <button
            key={index}
            onClick={() => handleAddDecal(decal)}
            className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-slate-300 transition-colors p-1"
          >
            <img src={decal} alt={`Decal ${index + 1}`} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>

      {/* Active Decals */}
      {coverSettings.decals.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <h5 className="text-xs font-semibold mb-2">已添加的贴花</h5>
          <div className="space-y-2">
            {coverSettings.decals.map((decal) => (
              <div key={decal.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                <img src={decal.image} alt="" className="w-8 h-8 object-contain" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px]">X</Label>
                    <input
                      type="number"
                      value={decal.x}
                      onChange={(e) =>
                        updateDecal(decal.id, { x: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full h-6 text-xs border rounded px-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">Y</Label>
                    <input
                      type="number"
                      value={decal.y}
                      onChange={(e) =>
                        updateDecal(decal.id, { y: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full h-6 text-xs border rounded px-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">缩放</Label>
                    <input
                      type="number"
                      value={decal.scale}
                      onChange={(e) =>
                        updateDecal(decal.id, { scale: parseFloat(e.target.value) || 1 })
                      }
                      className="w-full h-6 text-xs border rounded px-1"
                      step={0.1}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">旋转</Label>
                    <input
                      type="number"
                      value={decal.rotation}
                      onChange={(e) =>
                        updateDecal(decal.id, { rotation: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full h-6 text-xs border rounded px-1"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeDecal(decal.id)}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
