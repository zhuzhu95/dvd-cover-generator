import { useState } from 'react';
import { Search, Unlock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { searchMedia, getImageUrl } from '@/services/tmdb';
import type { MovieData } from '@/types';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { setMovieData, setIsSearching, isSearching, tmdbApiKey, mediaType, setMediaType } = useStore();
  const [results, setResults] = useState<MovieData[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    if (!tmdbApiKey) {
      setError('请先设置 TMDB API Key (点击右上角设置按钮)');
      return;
    }

    setError('');
    setIsSearching(true);
    setShowResults(true);

    try {
      const items = await searchMedia(query, mediaType);
      setResults(items);
    } catch (err: any) {
      setError(err.message || '搜索失败');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectItem = (item: MovieData) => {
    setMovieData(item);
    setShowResults(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 shadow-sm p-1">
        {/* Media Type Selector */}
        <select
          value={mediaType}
          onChange={(e) => {
            setMediaType(e.target.value as 'movie' | 'tv');
            setResults([]);
            setShowResults(false);
          }}
          className="shrink-0 h-8 px-2 text-xs font-medium rounded-md border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-300"
        >
          <option value="movie">电影</option>
          <option value="tv">剧集</option>
        </select>

        <div className="w-px h-6 bg-slate-200 shrink-0" />

        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder={mediaType === 'tv' ? '搜索电视剧...' : '搜索电影...'}
          className="border-0 focus-visible:ring-0 text-sm flex-1"
        />
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 shrink-0">
          <Unlock className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-slate-800 hover:bg-slate-900 text-white shrink-0"
          size="sm"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4 mr-1" />
              搜索
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-2 px-2">{error}</p>
      )}

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-slate-200 shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.length === 0 && !isSearching && !error && (
            <p className="p-4 text-sm text-slate-500 text-center">未找到结果</p>
          )}
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
            >
              {item.posterPath ? (
                <img
                  src={getImageUrl(item.posterPath, 'w92') || ''}
                  alt={item.title}
                  className="w-10 h-14 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-14 bg-slate-200 rounded flex items-center justify-center">
                  <span className="text-slate-400 text-xs">无图</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.year} {item.runtime ? `· ${item.runtime}分钟` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
