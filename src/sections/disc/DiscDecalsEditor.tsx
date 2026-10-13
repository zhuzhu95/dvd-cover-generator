import { useState } from 'react';
import { useDiscStore } from '@/store/useDiscStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import type { DiscDecalItem } from '@/types/disc';

const decals = [
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjMwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iOCIgZm9udC13ZWlnaHQ9ImJvbGQiPjE1dGg8L3RleHQ+PHRleHQgeD0iMzAiIHk9IjM4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI2Ij5Bbm5pdmVyc2FyeTwvdGV4dD48L3N2Zz4=',
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIGZpbGw9IiNlZjQ0NDQiLz48dGV4dCB4PSIzMCIgeT0iMjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCI+REVMVVg8L3RleHQ+PHRleHQgeD0iMzAiIHk9IjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI3Ij4yIERJU0NTPC90ZXh0Pjwvc3ZnPg==',
];

export default function DiscDecalsEditor() {
  const { settings, addDecal, removeDecal, updateDecal } = useDiscStore();
  const [cat, setCat] = useState('贴纸');

  const add = (img: string) => {
    const d: DiscDecalItem = { id: `d-${Date.now()}`, image: img, x: 50, y: 50, scale: 1, rotation: 0 };
    addDecal(d);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {['贴纸', '评级'].map((c) => (
          <Button key={c} variant={cat === c ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setCat(c)}>{c}</Button>
        ))}
        <label className="cursor-pointer ml-auto">
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => add(ev.target?.result as string); r.readAsDataURL(f); } }} className="hidden" />
          <Button variant="outline" size="sm" className="h-7 text-xs" asChild><span><Upload className="w-3 h-3 mr-1" />上传</span></Button>
        </label>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {decals.map((d, i) => (
          <button key={i} onClick={() => add(d)} className="aspect-square bg-slate-100 rounded-lg border-2 border-transparent hover:border-slate-300 p-1"><img src={d} alt="" className="w-full h-full object-contain" /></button>
        ))}
      </div>
      {settings.decals.length > 0 && (
        <div className="pt-2 space-y-1">
          {settings.decals.map((d) => (
            <div key={d.id} className="flex items-center gap-1 bg-slate-50 p-1 rounded">
              <img src={d.image} alt="" className="w-6 h-6 object-contain" />
              <div className="flex-1 grid grid-cols-4 gap-1">
                {['x', 'y', 'scale', 'rotation'].map((k) => (
                  <div key={k} className="flex items-center gap-0.5">
                    <Label className="text-[8px] w-6">{k}</Label>
                    <input type="number" value={d[k as keyof DiscDecalItem] as number} onChange={(e) => updateDecal(d.id, { [k]: parseFloat(e.target.value) || 0 })} className="w-full h-5 text-[9px] border rounded px-0.5" step={k === 'scale' ? 0.1 : 1} />
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="h-5 text-[9px] px-1" onClick={() => removeDecal(d.id)}>删除</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
