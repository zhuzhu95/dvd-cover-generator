import { useState } from 'react';
import { Share2, Download, Loader2, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ActionButtons() {
  const { coverSettings } = useStore();
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('title', coverSettings.title);
    params.set('year', coverSettings.year);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getExportOptions = () => ({
    pixelRatio: 4,
    cacheBust: true,
    skipFonts: false,
  });

  const handleExportImage = async (format: 'png' | 'jpeg') => {
    setIsExporting(true);
    try {
      const element = document.getElementById('dvd-cover');
      if (!element) return;

      const options = getExportOptions();
      let dataUrl: string;

      if (format === 'png') {
        dataUrl = await toPng(element, options);
      } else {
        dataUrl = await toJpeg(element, { pixelRatio: 4, cacheBust: true, quality: 0.95, backgroundColor: '#ffffff' });
      }

      const extension = format === 'png' ? 'png' : 'jpg';
      const link = document.createElement('a');
      link.download = `${coverSettings.title || 'dvd-cover'}.${extension}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出失败，请检查图片是否加载完成后再试');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('dvd-cover');
      if (!element) return;

      const dataUrl = await toPng(element, getExportOptions());

      const totalWidthMm = 273;
      const heightMm = 183;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [totalWidthMm, heightMm],
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, totalWidthMm, heightMm);
      pdf.save(`${coverSettings.title || 'dvd-cover'}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('导出失败，请检查图片是否加载完成后再试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      <Button variant="outline" onClick={handleShare} className="bg-white hover:bg-slate-50">
        <Share2 className="w-4 h-4 mr-1" />
        {copied ? '已复制!' : '分享'}
      </Button>

      <Button
        variant="outline"
        onClick={() => handleExportImage('png')}
        disabled={isExporting}
        className="bg-white hover:bg-slate-50"
      >
        {isExporting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Image className="w-4 h-4 mr-1" />}
        保存图片
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold">
            <Download className="w-4 h-4 mr-1" />
            导出
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导出 DVD 封面</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button onClick={() => handleExportImage('png')} disabled={isExporting} variant="outline" className="justify-start">
              <Image className="w-4 h-4 mr-2" />
              导出为 PNG (透明背景)
            </Button>
            <Button onClick={() => handleExportImage('jpeg')} disabled={isExporting} variant="outline" className="justify-start">
              <Image className="w-4 h-4 mr-2" />
              导出为 JPEG (高质量)
            </Button>
            <Button onClick={handleExportPDF} disabled={isExporting} variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              导出为 PDF (打印尺寸)
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            模板以高分辨率导出，可实现高清打印。
            <br />
            建议在打印设置中选择 "实际大小" 或 "100%" 以避免缩放问题。
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
