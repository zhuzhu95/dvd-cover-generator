import { useState } from 'react';
import { Share2, Download, Loader2, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiscStore } from '@/store/useDiscStore';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function DiscActionButtons() {
  const { settings } = useDiscStore();
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('title', settings.title);
    params.set('year', settings.year);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const capture = async (): Promise<string | null> => {
    const element = document.getElementById('disc-label');
    if (!element) return null;
    try {
      return await toPng(element, { pixelRatio: 4, cacheBust: true });
    } catch (err) {
      console.error('Capture failed:', err);
      return null;
    }
  };

  const handleExportImage = async (format: 'png' | 'jpeg') => {
    setIsExporting(true);
    try {
      const element = document.getElementById('disc-label');
      if (!element) return;
      let dataUrl: string;
      if (format === 'png') {
        dataUrl = await toPng(element, { pixelRatio: 4, cacheBust: true });
      } else {
        dataUrl = await toJpeg(element, { pixelRatio: 4, cacheBust: true, quality: 0.95, backgroundColor: '#ffffff' });
      }
      const link = document.createElement('a');
      link.download = `${settings.title || 'disc-label'}.${format === 'png' ? 'png' : 'jpg'}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出失败');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await capture();
      if (!dataUrl) return;
      const size = settings.discSize === 'standard' ? 120 : 80;
      const pdf = new jsPDF({ unit: 'mm', format: [size, size] });
      pdf.addImage(dataUrl, 'PNG', 0, 0, size, size);
      pdf.save(`${settings.title || 'disc-label'}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('导出失败');
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
      <Button variant="outline" onClick={() => handleExportImage('png')} disabled={isExporting} className="bg-white hover:bg-slate-50">
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
          <DialogHeader><DialogTitle>导出光盘标签</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button onClick={() => handleExportImage('png')} disabled={isExporting} variant="outline" className="justify-start"><Image className="w-4 h-4 mr-2" />导出为 PNG</Button>
            <Button onClick={() => handleExportImage('jpeg')} disabled={isExporting} variant="outline" className="justify-start"><Image className="w-4 h-4 mr-2" />导出为 JPEG</Button>
            <Button onClick={handleExportPDF} disabled={isExporting} variant="outline" className="justify-start"><FileText className="w-4 h-4 mr-2" />导出为 PDF</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
