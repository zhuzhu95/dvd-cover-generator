import { useDiscStore } from '@/store/useDiscStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Plus, X } from 'lucide-react';

export default function DiscTextEditor() {
  const { settings, updateSettings } = useDiscStore();

  const addItem = (field: 'cast' | 'director' | 'writer' | 'music' | 'producer') => {
    updateSettings({ [field]: [...settings[field], ''] });
  };
  const updateItem = (field: 'cast' | 'director' | 'writer' | 'music' | 'producer', i: number, v: string) => {
    const arr = [...settings[field]];
    arr[i] = v;
    updateSettings({ [field]: arr });
  };
  const removeItem = (field: 'cast' | 'director' | 'writer' | 'music' | 'producer', i: number) => {
    updateSettings({ [field]: settings[field].filter((_, j) => j !== i) });
  };

  const renderList = (field: 'cast' | 'director' | 'writer' | 'music' | 'producer', label: string) => (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {settings[field].map((v, i) => (
        <div key={i} className="flex items-center gap-1">
          <Input value={v} onChange={(e) => updateItem(field, i, e.target.value)} className="h-7 text-xs" placeholder={`${label}${i + 1}`} />
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeItem(field, i)}><X className="w-3 h-3" /></Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => addItem(field)}><Plus className="w-3 h-3 mr-1" />添加</Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 pb-3 border-b border-slate-100">
        {[
          ['hideAllText', '隐藏全部'],
          ['hideRules', '隐藏规则'],
          ['hideSpineInfo', '隐藏书脊信息'],
          ['showDolbyBadge', 'Dolby徽章'],
          ['showFbiWarning', 'FBI警告'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <Switch checked={settings[key as keyof typeof settings] as boolean} onCheckedChange={(c) => updateSettings({ [key]: c })} />
            <Label className="text-xs">{label}</Label>
          </div>
        ))}
      </div>

      {/* Text size controls */}
      <div className="space-y-3 pb-3 border-b border-slate-100">
        <h4 className="text-sm font-semibold">文字大小</h4>
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap w-14">简介</Label>
          <Slider
            value={[settings.synopsisSize]}
            onValueChange={([v]) => updateSettings({ synopsisSize: v })}
            min={3}
            max={16}
            step={0.5}
            className="flex-1"
          />
          <span className="text-xs text-slate-500 w-12 text-right">{settings.synopsisSize}px</span>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap w-14">元数据</Label>
          <Slider
            value={[settings.metadataSize]}
            onValueChange={([v]) => updateSettings({ metadataSize: v })}
            min={3}
            max={14}
            step={0.5}
            className="flex-1"
          />
          <span className="text-xs text-slate-500 w-12 text-right">{settings.metadataSize}px</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs">影片标题</Label><Input value={settings.title} onChange={(e) => updateSettings({ title: e.target.value })} className="h-8 text-sm" /></div>
        <div className="space-y-1"><Label className="text-xs">宣传语</Label><Input value={settings.tagline} onChange={(e) => updateSettings({ tagline: e.target.value })} className="h-8 text-sm" /></div>
        <div className="space-y-1"><Label className="text-xs">引用</Label><Input value={settings.quote} onChange={(e) => updateSettings({ quote: e.target.value })} className="h-8 text-sm" /></div>
        <div className="space-y-1"><Label className="text-xs">引用来源</Label><Input value={settings.quoteSource} onChange={(e) => updateSettings({ quoteSource: e.target.value })} className="h-8 text-sm" /></div>
        <div className="space-y-1 md:col-span-2"><Label className="text-xs">简介</Label><Textarea value={settings.synopsis} onChange={(e) => updateSettings({ synopsis: e.target.value })} className="text-sm min-h-[60px]" /></div>
        <div className="space-y-1"><Label className="text-xs">年份</Label><Input value={settings.year} onChange={(e) => updateSettings({ year: e.target.value })} className="h-8 text-sm" /></div>
        <div className="space-y-1"><Label className="text-xs">来源</Label><Input value={settings.source} onChange={(e) => updateSettings({ source: e.target.value })} className="h-8 text-sm" placeholder="(JP)" /></div>
        <div className="space-y-1"><Label className="text-xs">片长(分钟)</Label><Input value={settings.runtime} onChange={(e) => updateSettings({ runtime: e.target.value })} className="h-8 text-sm" /></div>
        <div className="space-y-1"><Label className="text-xs">评分</Label><Input value={settings.certification} onChange={(e) => updateSettings({ certification: e.target.value })} className="h-8 text-sm" /></div>
        <div className="space-y-1"><Label className="text-xs">网站域名</Label><Input value={settings.website} onChange={(e) => updateSettings({ website: e.target.value })} className="h-8 text-sm" /></div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        {renderList('cast', '主演')}
        {renderList('director', '导演')}
        {renderList('writer', '编剧')}
        {renderList('music', '音乐')}
        {renderList('producer', '制片人')}
      </div>
    </div>
  );
}
