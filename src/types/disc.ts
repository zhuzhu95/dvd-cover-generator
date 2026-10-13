export interface DiscLabelSettings {
  // Text settings
  title: string;
  tagline: string;
  quote: string;
  quoteSource: string;
  synopsis: string;
  year: string;
  source: string;
  runtime: string;
  certification: string;
  workId: string;
  budget: string;
  revenue: string;
  website: string;
  cast: string[];
  director: string[];
  writer: string[];
  music: string[];
  producer: string[];
  showFbiWarning: boolean;
  hideAllText: boolean;
  hideRules: boolean;
  hideSpineInfo: boolean;

  // Logo settings
  selectedLogo: string | null;
  logoInvert: boolean;
  logoNoColor: boolean;

  // Cover art
  coverArt: string | null;
  coverArtScale: number;

  // Studio
  selectedStudios: string[];
  studioScale: number;
  studioColorMode: 'original' | 'white' | 'black';
  studioX: number;
  studioY: number;

  // Decals
  decals: DiscDecalItem[];

  // Background
  backgroundImage: string | null;
  backgroundTransparent: boolean;

  // Colors
  tintColor: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  useRainbow: boolean;

  // Media badges
  selectedMediaBadge: string | null;
  mediaBadgeNoColor: boolean;
  showDolbyBadge: boolean;

  // Layout
  discSize: 'standard' | 'mini';

  // Text sizes
  synopsisSize: number;
  metadataSize: number;
}

export interface DiscDecalItem {
  id: string;
  image: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type DiscEditorTab =
  | 'text'
  | 'logo'
  | 'coverArt'
  | 'studio'
  | 'decals'
  | 'background';
