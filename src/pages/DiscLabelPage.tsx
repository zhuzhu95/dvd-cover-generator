import { useEffect } from 'react';
import { Disc3 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useDiscStore } from '@/store/useDiscStore';
import SearchBar from '@/sections/SearchBar';
import DiscLabelPreview from '@/sections/disc/DiscLabelPreview';
import DiscColorPanel from '@/sections/disc/DiscColorPanel';
import DiscEditorPanel from '@/sections/disc/DiscEditorPanel';
import DiscActionButtons from '@/sections/disc/DiscActionButtons';

const products = [
  { name: 'Betamax' },
  { name: 'VHS标签' },
  { name: 'Blockbuster' },
  { name: '套封' },
  { name: '蓝光封面' },
  { name: '卡带' },
  { name: '黑胶标签' },
  { name: 'CD' },
  { name: 'MD标签' },
  { name: '卡盒' },
];

export default function DiscLabelPage() {
  const { movieData } = useStore();
  const { updateSettings } = useDiscStore();

  // Sync movie data from global store to disc store when search results change
  useEffect(() => {
    if (movieData) {
      updateSettings({
        title: movieData.title || '',
        year: movieData.year || '',
        runtime: movieData.runtime ? `${movieData.runtime}` : '',
        certification: movieData.certification || 'NR',
        synopsis: movieData.overview || '',
        tagline: movieData.tagline || '',
        source: movieData.country || '',
        cast: movieData.cast.slice(0, 5).map((c) => c.name),
        director: movieData.crew.filter((c) => c.job === 'Director').map((c) => c.name),
        writer: movieData.crew.filter((c) => c.job === 'Screenplay' || c.job === 'Writer').map((c) => c.name),
        music: movieData.crew.filter((c) => c.job === 'Original Music Composer').map((c) => c.name),
        producer: movieData.crew.filter((c) => c.job === 'Producer').map((c) => c.name),
        coverArt: movieData.posterPath ? `https://image.tmdb.org/t/p/original${movieData.posterPath}` : null,
        selectedLogo: movieData.logoPath ? `https://image.tmdb.org/t/p/original${movieData.logoPath}` : null,
        selectedStudios: movieData.productionCompanies
          ?.filter((c) => c.logoPath)
          .map((c) => `https://image.tmdb.org/t/p/w200${c.logoPath}`) || [],
        budget: movieData.budget ? `$${(movieData.budget / 1000000).toFixed(1)}M` : '',
        revenue: movieData.revenue ? `$${(movieData.revenue / 1000000).toFixed(1)}M` : '',
      });
    }
  }, [movieData, updateSettings]);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: '#f5f0e8',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      {/* Hero */}
      <section className="w-full py-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl md:text-6xl font-black tracking-tight mb-2"
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(3px 3px 0px rgba(6,182,212,0.3))',
            }}
          >
            光盘标签生成器
          </h1>
          <p className="text-slate-500 text-sm mb-4">为DVD或Blu-ray光盘制作可打印标签</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {products.map((p) => (
              <button key={p.name} className="flex flex-col items-center gap-1 group transition-transform hover:scale-105">
                <div className="w-10 h-12 bg-gradient-to-b from-slate-700 to-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                  <Disc3 className="w-5 h-5 text-slate-300" />
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-slate-700">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pb-8 space-y-6">
        <SearchBar />
        <DiscColorPanel />
        <DiscLabelPreview />
        <DiscActionButtons />
        <DiscEditorPanel />
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 px-4 mt-8">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="text-xs text-slate-500">本项目使用 React 与 The Movie Database API 构建。</p>
          <p className="text-xs text-slate-400">仅供个人及非商业用途。请尊重版权。</p>
        </div>
      </footer>
    </div>
  );
}
