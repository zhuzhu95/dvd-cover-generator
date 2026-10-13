import { create } from 'zustand';
import type { DiscLabelSettings, DiscDecalItem, DiscEditorTab } from '@/types/disc';

const defaultSettings: DiscLabelSettings = {
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
  website: 'texs.org',
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
  coverArt: null,
  coverArtScale: 1,
  selectedStudios: [],
  studioScale: 100,
  studioColorMode: 'original',
  studioX: 0,
  studioY: 55,
  decals: [],
  backgroundImage: null,
  backgroundTransparent: false,
  tintColor: '#cc0428',
  borderColor: '#000000',
  textColor: '#ffffff',
  bgColor: '#cc0428',
  useRainbow: true,
  selectedMediaBadge: '/badges/media-logo-09.png',
  mediaBadgeNoColor: false,
  showDolbyBadge: true,
  discSize: 'standard',
  synopsisSize: 5.5,
  metadataSize: 5.5,
};

interface DiscState {
  settings: DiscLabelSettings;
  activeTab: DiscEditorTab;
  showColorPanel: boolean;

  updateSettings: (s: Partial<DiscLabelSettings>) => void;
  setActiveTab: (t: DiscEditorTab) => void;
  toggleColorPanel: () => void;
  addDecal: (d: DiscDecalItem) => void;
  removeDecal: (id: string) => void;
  updateDecal: (id: string, u: Partial<DiscDecalItem>) => void;
}

export const useDiscStore = create<DiscState>((set) => ({
  settings: { ...defaultSettings },
  activeTab: 'text',
  showColorPanel: false,

  updateSettings: (s) =>
    set((state) => ({ settings: { ...state.settings, ...s } })),

  setActiveTab: (t) => set({ activeTab: t }),

  toggleColorPanel: () =>
    set((state) => ({ showColorPanel: !state.showColorPanel })),

  addDecal: (d) =>
    set((state) => ({
      settings: { ...state.settings, decals: [...state.settings.decals, d] },
    })),

  removeDecal: (id) =>
    set((state) => ({
      settings: {
        ...state.settings,
        decals: state.settings.decals.filter((x) => x.id !== id),
      },
    })),

  updateDecal: (id, u) =>
    set((state) => ({
      settings: {
        ...state.settings,
        decals: state.settings.decals.map((d) =>
          d.id === id ? { ...d, ...u } : d
        ),
      },
    })),
}));
