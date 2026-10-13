import { useStore } from '@/store/useStore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Texture overlays
const overlays = [
  {
    name: 'Wild America',
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSI1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbHRlcj0idXJsKCNnKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+',
  },
  {
    name: 'Grain',
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJ0dXJidWxlbmNlIiBiYXNlRnJlcXVlbmN5PSIwLjUiIG51bU9jdGF2ZXM9IjMiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsdGVyPSJ1cmwoI2cpIiBvcGFjaXR5PSIwLjE1Ii8+PC9zdmc+',
  },
  {
    name: 'Scratches',
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJ0dXJidWxlbmNlIiBiYXNlRnJlcXVlbmN5PSIwLjAyIiBudW1PY3RhdmVzPSI1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbHRlcj0idXJsKCNnKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==',
  },
];

export default function OverlayEditor() {
  const { coverSettings, updateCoverSettings } = useStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">叠加</h4>
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.overlayMultiple}
            onCheckedChange={(checked) =>
              updateCoverSettings({ overlayMultiple: checked })
            }
          />
          <Label className="text-xs">允许多个</Label>
        </div>
      </div>

      <p className="text-xs text-slate-500">选择叠加层以添加纹理</p>

      <div className="grid grid-cols-3 gap-3">
        {overlays.map((overlay) => (
          <button
            key={overlay.name}
            onClick={() =>
              updateCoverSettings({
                selectedOverlay:
                  coverSettings.selectedOverlay === overlay.url ? null : overlay.url,
              })
            }
            className={`relative aspect-video bg-slate-800 rounded-lg overflow-hidden border-2 transition-colors ${
              coverSettings.selectedOverlay === overlay.url
                ? 'border-sky-500 ring-2 ring-sky-200'
                : 'border-transparent hover:border-slate-300'
            }`}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${overlay.url})`,
                backgroundSize: 'cover',
              }}
            />
            <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 px-1 rounded">
              {overlay.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
