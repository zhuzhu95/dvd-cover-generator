export interface MovieData {
  id: number;
  title: string;
  originalTitle?: string;
  year: string;
  runtime: number;
  rating: string;
  overview: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  posterPath?: string;
  backdropPath?: string;
  logoPath?: string;
  cast: CastMember[];
  crew: CrewMember[];
  productionCompanies: ProductionCompany[];
  genre?: string;
  country?: string;
  certification?: string;
  isbn?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profilePath?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath?: string;
}

export interface CoverSettings {
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
  hideFrontLogo: boolean;

  // Cover art
  coverArt: string | null;
  coverArtScale: number;
  coverArtMode: 'fill' | 'fit' | 'mirror';
  coverArtBorderWidth: number;
  coverArtBorderRadius: number;

  // Spine settings
  spineWindow: string | null;
  spineWindowPosition: 'top' | 'bottom';
  spineWindowScale: number;
  spineWindowWidth: number;
  spineWindowHeight: number;
  spineWindowRadius: number;
  spineWindowBorder: number;
  spineLogoRotate: boolean;
  spineLogoScale: number;
  selectedMediaBadge: string | null;
  mediaBadgeNoColor: boolean;
  spineLabel: string;
  hideSpineLabel: boolean;

  // Studio settings
  selectedStudios: string[];
  studioScale: number;
  studioColorMode: 'original' | 'white' | 'black';

  // Back settings
  backWindows: string[];
  backWindowShowLogo: boolean;
  backWindowRadius: number;
  backWindowBorder: number;

  // Decals
  decals: DecalItem[];

  // Overlay
  selectedOverlay: string | null;
  overlayMultiple: boolean;

  // Background
  backgroundImage: string | null;
  backgroundTransparent: boolean;

  // Colors
  tintColor: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  useRainbow: boolean;
}

export interface DecalItem {
  id: string;
  image: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface LayoutSettings {
  caseType: 'dvd' | 'slim_dvd' | 'blu_ray' | 'criterion' | 'multi_disc' | '5.5_box' | 'cd_jewel';
  width: number;
  height: number;
  spine: number;
  unit: 'in' | 'mm';
}

export type EditorTab =
  | 'text'
  | 'logo'
  | 'coverArt'
  | 'spine'
  | 'studio'
  | 'back'
  | 'decals'
  | 'overlay'
  | 'background'
  | 'code';

export type MediaType = 'movie' | 'tv';
