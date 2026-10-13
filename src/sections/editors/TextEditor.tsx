import { useStore } from '@/store/useStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export default function TextEditor() {
  const { coverSettings, updateCoverSettings } = useStore();

  const addListItem = (field: 'cast' | 'director' | 'writer' | 'music' | 'producer') => {
    updateCoverSettings({
      [field]: [...coverSettings[field], ''],
    });
  };

  const updateListItem = (
    field: 'cast' | 'director' | 'writer' | 'music' | 'producer',
    index: number,
    value: string
  ) => {
    const newList = [...coverSettings[field]];
    newList[index] = value;
    updateCoverSettings({ [field]: newList });
  };

  const removeListItem = (
    field: 'cast' | 'director' | 'writer' | 'music' | 'producer',
    index: number
  ) => {
    const newList = coverSettings[field].filter((_, i) => i !== index);
    updateCoverSettings({ [field]: newList });
  };

  const renderListField = (
    field: 'cast' | 'director' | 'writer' | 'music' | 'producer',
    label: string
  ) => (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="space-y-1">
        {coverSettings[field].map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <Input
              value={item}
              onChange={(e) => updateListItem(field, index, e.target.value)}
              className="h-7 text-xs"
              placeholder={`${label} ${index + 1}`}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => removeListItem(field, index)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addListItem(field)}
          className="h-7 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          添加
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Toggle Switches */}
      <div className="flex flex-wrap items-center gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.hideAllText}
            onCheckedChange={(checked) => updateCoverSettings({ hideAllText: checked })}
          />
          <Label className="text-xs">隐藏全部</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.hideRules}
            onCheckedChange={(checked) => updateCoverSettings({ hideRules: checked })}
          />
          <Label className="text-xs">隐藏规则</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.hideSpineInfo}
            onCheckedChange={(checked) => updateCoverSettings({ hideSpineInfo: checked })}
          />
          <Label className="text-xs">隐藏书脊信息</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={coverSettings.hideFrontLogo}
            onCheckedChange={(checked) => updateCoverSettings({ hideFrontLogo: checked })}
          />
          <Label className="text-xs">隐藏正面标志</Label>
        </div>
      </div>

      {/* Text Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">影片标题</Label>
          <Input
            value={coverSettings.title}
            onChange={(e) => updateCoverSettings({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">宣传语</Label>
          <Input
            value={coverSettings.tagline}
            onChange={(e) => updateCoverSettings({ tagline: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">引用</Label>
          <Input
            value={coverSettings.quote}
            onChange={(e) => updateCoverSettings({ quote: e.target.value })}
            className="h-8 text-sm"
            placeholder="Movie of the Century"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">引用来源</Label>
          <Input
            value={coverSettings.quoteSource}
            onChange={(e) => updateCoverSettings({ quoteSource: e.target.value })}
            className="h-8 text-sm"
            placeholder="The New York Times"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">简介</Label>
          <Textarea
            value={coverSettings.synopsis}
            onChange={(e) => updateCoverSettings({ synopsis: e.target.value })}
            className="text-sm min-h-[80px]"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">年份</Label>
          <Input
            value={coverSettings.year}
            onChange={(e) => updateCoverSettings({ year: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">来源</Label>
          <Input
            value={coverSettings.source}
            onChange={(e) => updateCoverSettings({ source: e.target.value })}
            className="h-8 text-sm"
            placeholder="(JP)"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">片长 (分钟)</Label>
          <Input
            value={coverSettings.runtime}
            onChange={(e) => updateCoverSettings({ runtime: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">评分</Label>
          <Input
            value={coverSettings.certification}
            onChange={(e) => updateCoverSettings({ certification: e.target.value })}
            className="h-8 text-sm"
            placeholder="NR, PG-13, R..."
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">作品ID</Label>
          <Input
            value={coverSettings.workId}
            onChange={(e) => updateCoverSettings({ workId: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">预算</Label>
          <Input
            value={coverSettings.budget}
            onChange={(e) => updateCoverSettings({ budget: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">收入</Label>
          <Input
            value={coverSettings.revenue}
            onChange={(e) => updateCoverSettings({ revenue: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Cast & Crew */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        {renderListField('cast', '主演')}
        {renderListField('director', '导演')}
        {renderListField('writer', '编剧')}
        {renderListField('music', '音乐')}
        {renderListField('producer', '制片人')}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Switch
          checked={coverSettings.showFbiWarning}
          onCheckedChange={(checked) => updateCoverSettings({ showFbiWarning: checked })}
        />
        <Label className="text-xs">FBI 警告标签</Label>
      </div>
    </div>
  );
}
