import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Minus, Plus, X } from 'lucide-react';

const casePresets = [
  { id: 'dvd', label: 'DVD', width: 5.125, height: 7.25, spine: 0.5 },
  { id: 'slim_dvd', label: 'Slim DVD', width: 5.125, height: 7.25, spine: 0.28 },
  { id: 'blu_ray', label: 'Blu-ray', width: 5.375, height: 6.75, spine: 0.55 },
  { id: 'criterion', label: 'Criterion', width: 5.375, height: 6.75, spine: 0.3 },
  { id: 'multi_disc', label: 'Multi-Disc', width: 5.375, height: 6.75, spine: 1.0 },
  { id: '5.5_box', label: '5.5" Box', width: 5.5, height: 7.5, spine: 1.0 },
  { id: 'cd_jewel', label: 'CD Jewel', width: 4.75, height: 4.75, spine: 0.4 },
];

export default function LayoutPanel() {
  const { layout, setLayout, showLayoutPanel, toggleLayoutPanel } = useStore();

  if (!showLayoutPanel) return null;

  const adjustValue = (key: 'width' | 'height' | 'spine', delta: number) => {
    setLayout({ [key]: Math.round((layout[key] + delta) * 1000) / 1000 });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Case Size</h3>
        <Button variant="ghost" size="sm" onClick={toggleLayoutPanel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Case Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        {casePresets.map((preset) => (
          <Button
            key={preset.id}
            variant={layout.caseType === preset.id ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setLayout({
                caseType: preset.id as any,
                width: preset.width,
                height: preset.height,
                spine: preset.spine,
              })
            }
            className="text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: 'width' as const, label: 'Width' },
          { key: 'height' as const, label: 'Height' },
          { key: 'spine' as const, label: 'Spine' },
        ].map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs">{label}</Label>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => adjustValue(key, -0.05)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <input
                type="number"
                value={layout[key]}
                onChange={(e) => setLayout({ [key]: parseFloat(e.target.value) || 0 })}
                className="flex-1 h-7 text-center text-xs border rounded"
                step={0.01}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => adjustValue(key, 0.05)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Physical case dimensions used for print sizing
      </p>
    </div>
  );
}
