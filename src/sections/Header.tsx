import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

export default function Header() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('tmdb_api_key') || '');

  const handleSaveApiKey = () => {
    localStorage.setItem('tmdb_api_key', apiKey);
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>设置 TMDB API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">TMDB API Key</Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入你的 TMDB API Key"
            />
            <p className="text-xs text-slate-500">
              在 themoviedb.org 获取免费的 API Key
            </p>
          </div>
          <Button onClick={handleSaveApiKey} className="w-full">
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
