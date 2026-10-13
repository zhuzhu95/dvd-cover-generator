import { create } from 'zustand';
import type { MovieData, CoverSettings, LayoutSettings, EditorTab, DecalItem, MediaType } from '@/types';

const defaultCoverSettings: CoverSettings = {
  title: '',
  tagline: '',
  quote: '',
  quoteSource: '',
  synopsis: '',
  year: '',
  source: '',
  runtime: '',
  certification: 'NR',
  workId: '',
  budget: '',
  revenue: '',
  cast: [],
  director: [],
  writer: [],
  music: [],
  producer: [],
  showFbiWarning: true,
  hideAllText: false,
  hideRules: false,
  hideSpineInfo: false,
  selectedLogo: null,
  logoInvert: false,
  logoNoColor: false,
  hideFrontLogo: false,
  coverArt: null,
  coverArtScale: 1,
  coverArtMode: 'fill',
  coverArtBorderWidth: 0,
  coverArtBorderRadius: 0,
  spineWindow: null,
  spineWindowPosition: 'top',
  spineWindowScale: 1.1,
  spineWindowWidth: 80,
  spineWindowHeight: 100,
  spineWindowRadius: 2,
  spineWindowBorder: 2,
  spineLogoRotate: true,
  spineLogoScale: 1,
  selectedMediaBadge: '/badges/media-logo-09.png',
  mediaBadgeNoColor: false,
  spineLabel: 'VHS',
  hideSpineLabel: false,
  backWindows: [],
  selectedStudios: [],
  studioScale: 100,
  studioColorMode: 'original',
  backWindowShowLogo: false,
  backWindowRadius: 4,
  backWindowBorder: 2,
  decals: [],
  selectedOverlay: null,
  overlayMultiple: false,
  backgroundImage: null,
  backgroundTransparent: false,
  tintColor: '#cc0428',
  borderColor: '#000000',
  textColor: '#ffffff',
  bgColor: '#cc0428',
  useRainbow: true,
};

const defaultLayout: LayoutSettings = {
  caseType: 'dvd',
  width: 5.08,
  height: 7.245,
  spine: 0.55,
  unit: 'in',
};

interface AppState {
  movieData: MovieData | null;
  coverSettings: CoverSettings;
  layout: LayoutSettings;
  activeTab: EditorTab;
  tmdbApiKey: string;
  showLayoutPanel: boolean;
  showColorPanel: boolean;
  searchQuery: string;
  isSearching: boolean;
  searchResults: MovieData[];
  mediaType: MediaType;

  // Actions
  setMovieData: (data: MovieData | null) => void;
  updateCoverSettings: (settings: Partial<CoverSettings>) => void;
  setLayout: (layout: Partial<LayoutSettings>) => void;
  setActiveTab: (tab: EditorTab) => void;
  setTmdbApiKey: (key: string) => void;
  toggleLayoutPanel: () => void;
  toggleColorPanel: () => void;
  setSearchQuery: (query: string) => void;
  setIsSearching: (searching: boolean) => void;
  setSearchResults: (results: MovieData[]) => void;
  setMediaType: (type: MediaType) => void;
  addDecal: (decal: DecalItem) => void;
  removeDecal: (id: string) => void;
  updateDecal: (id: string, updates: Partial<DecalItem>) => void;
  resetSettings: () => void;
}

export const useStore = create<AppState>((set) => ({
  movieData: null,
  coverSettings: { ...defaultCoverSettings },
  layout: { ...defaultLayout },
  activeTab: 'text',
  tmdbApiKey: localStorage.getItem('tmdb_api_key') || '',
  showLayoutPanel: false,
  showColorPanel: false,
  searchQuery: '',
  isSearching: false,
  searchResults: [],
  mediaType: 'movie',

  setMovieData: (data) => {
    if (data) {
      set((state) => ({
        movieData: data,
        coverSettings: {
          ...state.coverSettings,
          title: data.title || state.coverSettings.title,
          year: data.year || state.coverSettings.year,
          runtime: data.runtime ? `${data.runtime}` : state.coverSettings.runtime,
          certification: data.certification || state.coverSettings.certification,
          synopsis: data.overview || state.coverSettings.synopsis,
          tagline: data.tagline || state.coverSettings.tagline,
          source: data.country || state.coverSettings.source,
          cast: data.cast.slice(0, 5).map((c) => c.name),
          director: data.crew.filter((c) => c.job === 'Director').map((c) => c.name),
          writer: data.crew.filter((c) => c.job === 'Screenplay' || c.job === 'Writer').map((c) => c.name),
          music: data.crew.filter((c) => c.job === 'Original Music Composer').map((c) => c.name),
          producer: data.crew.filter((c) => c.job === 'Producer').map((c) => c.name),
          coverArt: data.posterPath ? `https://image.tmdb.org/t/p/original${data.posterPath}` : state.coverSettings.coverArt,
          selectedLogo: data.logoPath ? `https://image.tmdb.org/t/p/original${data.logoPath}` : state.coverSettings.selectedLogo,
          spineWindow: data.backdropPath ? `https://image.tmdb.org/t/p/w300${data.backdropPath}` : state.coverSettings.spineWindow,
          budget: data.budget ? `$${(data.budget / 1000000).toFixed(1)}M` : '',
          revenue: data.revenue ? `$${(data.revenue / 1000000).toFixed(1)}M` : '',
        },
      }));
    } else {
      set({ movieData: null });
    }
  },

  updateCoverSettings: (settings) =>
    set((state) => ({
      coverSettings: { ...state.coverSettings, ...settings },
    })),

  setLayout: (layout) =>
    set((state) => ({
      layout: { ...state.layout, ...layout },
    })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setTmdbApiKey: (key) => {
    localStorage.setItem('tmdb_api_key', key);
    set({ tmdbApiKey: key });
  },

  toggleLayoutPanel: () =>
    set((state) => ({
      showLayoutPanel: !state.showLayoutPanel,
      showColorPanel: false,
    })),

  toggleColorPanel: () =>
    set((state) => ({
      showColorPanel: !state.showColorPanel,
      showLayoutPanel: false,
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setIsSearching: (searching) => set({ isSearching: searching }),

  setSearchResults: (results) => set({ searchResults: results }),

  setMediaType: (type) => set({ mediaType: type }),

  addDecal: (decal) =>
    set((state) => ({
      coverSettings: {
        ...state.coverSettings,
        decals: [...state.coverSettings.decals, decal],
      },
    })),

  removeDecal: (id) =>
    set((state) => ({
      coverSettings: {
        ...state.coverSettings,
        decals: state.coverSettings.decals.filter((d) => d.id !== id),
      },
    })),

  updateDecal: (id, updates) =>
    set((state) => ({
      coverSettings: {
        ...state.coverSettings,
        decals: state.coverSettings.decals.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        ),
      },
    })),

  resetSettings: () =>
    set(() => ({
      coverSettings: { ...defaultCoverSettings },
      layout: { ...defaultLayout },
    })),
}));
