import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';

export default function CodeEditor() {
  const { coverSettings, layout } = useStore();
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const params = new URLSearchParams();
    params.set('title', coverSettings.title);
    params.set('year', coverSettings.year);
    params.set('color', coverSettings.useRainbow ? 'rainbow' : coverSettings.bgColor);
    params.set('text', coverSettings.textColor);
    params.set('border', coverSettings.borderColor);
    params.set('w', layout.width.toString());
    params.set('h', layout.height.toString());
    params.set('s', layout.spine.toString());
    if (coverSettings.coverArt) params.set('art', 'custom');
    if (coverSettings.selectedLogo) params.set('logo', 'custom');

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const code = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">代码</h4>
        <Button variant="outline" size="sm" onClick={handleCopy} className="h-7 text-xs">
          {copied ? (
            <Check className="w-3 h-3 mr-1" />
          ) : (
            <Copy className="w-3 h-3 mr-1" />
          )}
          {copied ? '已复制' : '复制链接'}
        </Button>
      </div>

      <Textarea
        value={code}
        readOnly
        className="text-xs font-mono min-h-[100px] bg-slate-50"
      />

      <div className="text-xs text-slate-500 space-y-1">
        <p>参数说明:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>title - 影片标题</li>
          <li>year - 年份</li>
          <li>color - 颜色方案 (rainbow 或 HEX)</li>
          <li>text - 文字颜色</li>
          <li>border - 边框颜色</li>
          <li>w, h, s - 宽度、高度、书脊</li>
        </ul>
      </div>
    </div>
  );
}
