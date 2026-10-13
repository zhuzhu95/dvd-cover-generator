import type { MovieData, CastMember, CrewMember, ProductionCompany, MediaType } from '@/types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function getApiKey(): string {
  const key = localStorage.getItem('tmdb_api_key') || '';
  return key;
}

export function setApiKey(key: string): void {
  localStorage.setItem('tmdb_api_key', key);
}

export function getImageUrl(path: string | null, size: string = 'original'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export async function searchMedia(query: string, mediaType: MediaType): Promise<MovieData[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Please set your TMDB API key first');
  }

  const endpoint = mediaType === 'tv' ? 'tv' : 'movie';
  const response = await fetch(
    `${TMDB_BASE_URL}/search/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=zh-CN&page=1&include_adult=true`
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid TMDB API key');
    }
    throw new Error('Failed to search');
  }

  const data = await response.json();

  return Promise.all(
    data.results.slice(0, 10).map(async (item: any): Promise<MovieData> => {
      const details = await fetchMediaDetails(item.id, mediaType);
      return details;
    })
  );
}

/** @deprecated use searchMedia instead */
export async function searchMovies(query: string): Promise<MovieData[]> {
  return searchMedia(query, 'movie');
}

export async function fetchMediaDetails(mediaId: number, mediaType: MediaType): Promise<MovieData> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Please set your TMDB API key first');
  }

  const endpoint = mediaType === 'tv' ? 'tv' : 'movie';

  // For TV, we use different endpoints for ratings and credits
  const isTV = mediaType === 'tv';

  const [detailsResponse, creditsResponse, imagesResponse, ratingResponse] = await Promise.all([
    fetch(`${TMDB_BASE_URL}/${endpoint}/${mediaId}?api_key=${apiKey}&language=zh-CN`),
    fetch(`${TMDB_BASE_URL}/${endpoint}/${mediaId}/${isTV ? 'aggregate_credits' : 'credits'}?api_key=${apiKey}&language=zh-CN`),
    fetch(`${TMDB_BASE_URL}/${endpoint}/${mediaId}/images?api_key=${apiKey}`),
    isTV
      ? fetch(`${TMDB_BASE_URL}/tv/${mediaId}/content_ratings?api_key=${apiKey}`)
      : fetch(`${TMDB_BASE_URL}/movie/${mediaId}/release_dates?api_key=${apiKey}`),
  ]);

  if (!detailsResponse.ok) {
    throw new Error('Failed to fetch details');
  }

  const details = await detailsResponse.json();
  const credits = await creditsResponse.json();
  const images = await imagesResponse.json();
  const ratingData = await ratingResponse.json();

  // Parse certification/rating
  let certification = 'NR';
  if (isTV) {
    // TV content ratings - find US rating
    const usRating = ratingData.results?.find((r: any) => r.iso_3166_1 === 'US');
    certification = usRating?.rating || 'NR';
  } else {
    // Movie release dates - find US certification
    const usReleases = ratingData.results?.find((r: any) => r.iso_3166_1 === 'US');
    certification = usReleases?.release_dates?.[0]?.certification || 'NR';
  }

  // Get logos
  const logos = images.logos || [];
  const logoPath = logos.length > 0 ? logos[0].file_path : null;

  // Parse cast (aggregate_credits for TV has .cast with roles[])
  const castList = credits.cast || [];
  const cast: CastMember[] = castList.slice(0, 10).map((c: any) => ({
    id: c.id,
    name: c.name,
    character: c.character || c.roles?.[0]?.character || '',
    profilePath: c.profile_path,
  }));

  // Parse crew (aggregate_credits for TV has .crew with jobs[])
  const crewList = credits.crew || [];
  const crew: CrewMember[] = crewList.map((c: any) => ({
    id: c.id,
    name: c.name,
    job: c.job || c.jobs?.[0]?.job || '',
  }));

  // Production companies / networks
  let productionCompanies: ProductionCompany[];
  if (isTV) {
    // For TV, use networks as production companies
    const networks = (details.networks || []).map(
      (n: any) => ({
        id: n.id,
        name: n.name,
        logoPath: n.logo_path,
      })
    );
    const prodCos = (details.production_companies || []).map(
      (c: any) => ({
        id: c.id,
        name: c.name,
        logoPath: c.logo_path,
      })
    );
    productionCompanies = [...networks, ...prodCos];
  } else {
    productionCompanies = (details.production_companies || []).map(
      (c: any) => ({
        id: c.id,
        name: c.name,
        logoPath: c.logo_path,
      })
    );
  }

  // Handle field name differences between movie and TV
  const title = isTV ? (details.name || details.original_name) : (details.title || details.original_title);
  const originalTitle = isTV ? details.original_name : details.original_title;
  const dateField = isTV ? details.first_air_date : details.release_date;
  const year = dateField ? dateField.split('-')[0] : '';
  const runtime = isTV
    ? (details.episode_run_time?.[0] || details.type === 'Miniseries' ? 60 : 45)
    : (details.runtime || 0);

  return {
    id: details.id,
    title,
    originalTitle,
    year,
    runtime,
    rating: certification,
    overview: details.overview || '',
    tagline: isTV ? '' : (details.tagline || ''),
    budget: isTV ? 0 : (details.budget || 0),
    revenue: isTV ? 0 : (details.revenue || 0),
    posterPath: details.poster_path,
    backdropPath: details.backdrop_path,
    logoPath,
    cast,
    crew,
    productionCompanies,
    genre: details.genres?.[0]?.name || '',
    country: isTV
      ? (details.origin_country?.[0] || '')
      : (details.origin_country?.[0] || ''),
    certification,
    isbn: `978-0-${String(details.id).padStart(6, '0')}-0-4`,
  };
}

/** @deprecated use fetchMediaDetails instead */
export async function fetchMovieDetails(movieId: number): Promise<MovieData> {
  return fetchMediaDetails(movieId, 'movie');
}

export async function fetchMediaImages(mediaId: number, mediaType: MediaType): Promise<{
  posters: string[];
  backdrops: string[];
  logos: string[];
}> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { posters: [], backdrops: [], logos: [] };
  }

  const endpoint = mediaType === 'tv' ? 'tv' : 'movie';

  const response = await fetch(
    `${TMDB_BASE_URL}/${endpoint}/${mediaId}/images?api_key=${apiKey}`
  );

  if (!response.ok) {
    return { posters: [], backdrops: [], logos: [] };
  }

  const data = await response.json();

  return {
    posters: (data.posters || []).map((p: any) => p.file_path),
    backdrops: (data.backdrops || []).map((b: any) => b.file_path),
    logos: (data.logos || []).map((l: any) => l.file_path),
  };
}

/** @deprecated use fetchMediaImages instead */
export async function fetchMovieImages(movieId: number): Promise<{
  posters: string[];
  backdrops: string[];
  logos: string[];
}> {
  return fetchMediaImages(movieId, 'movie');
}

export async function fetchMediaLogos(mediaId: number, mediaType: MediaType): Promise<string[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return [];
  }

  const endpoint = mediaType === 'tv' ? 'tv' : 'movie';

  const response = await fetch(
    `${TMDB_BASE_URL}/${endpoint}/${mediaId}/images?api_key=${apiKey}`
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return (data.logos || []).map((l: any) => l.file_path);
}

/** @deprecated use fetchMediaLogos instead */
export async function fetchMovieLogos(movieId: number): Promise<string[]> {
  return fetchMediaLogos(movieId, 'movie');
}
