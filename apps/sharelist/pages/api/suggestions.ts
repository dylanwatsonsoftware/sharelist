import type { NextApiRequest, NextApiResponse } from 'next';
import { mergeSuggestions, fetchJson } from '../../libs/suggestions';
import { Suggestion } from '../../models/Suggestion';

interface TmdbResponse {
  results?: Array<{
    id: number;
    media_type?: 'movie' | 'tv' | 'person';
    name?: string;
    title?: string;
    poster_path?: string;
    release_date?: string;
    first_air_date?: string;
  }>;
}

interface AppleResponse {
  results?: Array<{
    collectionId?: number;
    collectionName?: string;
    artistName?: string;
    artworkUrl600?: string;
    collectionViewUrl?: string;
  }>;
}

interface RawgResponse {
  results?: Array<{
    id: number;
    name: string;
    released?: string;
    background_image?: string;
    slug?: string;
  }>;
}

interface BoardGameResponse {
  games?: Array<{
    id: string;
    name: string;
    year_published?: number;
    url?: string;
    images?: { small?: string };
  }>;
}

const year = (date?: string) => (date ? date.slice(0, 4) : '');
const withYear = (kind: string, date?: string) =>
  [kind, year(date)].filter(Boolean).join(' · ');

async function tmdbSuggestions(query: string): Promise<Suggestion[]> {
  const key = process.env.TMDB_API_KEY || 'fff3eb2aeadd24e26460b0f96ea7b056';
  const data = await fetchJson<TmdbResponse>(
    `https://api.themoviedb.org/3/search/multi?api_key=${encodeURIComponent(
      key
    )}&language=en-US&query=${encodeURIComponent(query)}&page=1`,
    5500
  );
  return (data?.results || [])
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .slice(0, 4)
    .map((item) => ({
      id: `tmdb:${item.media_type}:${item.id}`,
      name: item.title || item.name || query,
      subtitle: withYear(
        item.media_type === 'movie' ? 'Movie' : 'TV show',
        item.release_date || item.first_air_date
      ),
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
        : undefined,
      url: `https://www.themoviedb.org/${item.media_type}/${item.id}`,
      source: 'tmdb' as const,
    }));
}

async function appleSuggestions(query: string): Promise<Suggestion[]> {
  const data = await fetchJson<AppleResponse>(
    `https://itunes.apple.com/search?term=${encodeURIComponent(
      query
    )}&media=podcast&entity=podcast&limit=4`,
    2500
  );
  return (data?.results || []).map((item) => ({
    id: `apple:${item.collectionId || item.collectionName}`,
    name: item.collectionName || query,
    subtitle: ['Podcast', item.artistName].filter(Boolean).join(' · '),
    image: item.artworkUrl600,
    url: item.collectionViewUrl,
    source: 'apple' as const,
  }));
}

async function rawgSuggestions(query: string): Promise<Suggestion[]> {
  if (!process.env.RAWG_API_KEY) return [];
  const data = await fetchJson<RawgResponse>(
    `https://api.rawg.io/api/games?key=${encodeURIComponent(
      process.env.RAWG_API_KEY
    )}&search=${encodeURIComponent(query)}&search_precise=true&page_size=4`,
    1200
  );
  return (data?.results || []).map((item) => ({
    id: `rawg:${item.id}`,
    name: item.name,
    subtitle: withYear('Video game', item.released),
    image: item.background_image,
    url: item.slug ? `https://rawg.io/games/${item.slug}` : undefined,
    source: 'rawg' as const,
  }));
}

async function boardGameSuggestions(query: string): Promise<Suggestion[]> {
  const key = process.env.NEXT_PUBLIC_BOARDGAME_CLIENT_ID;
  if (!key) return [];
  const data = await fetchJson<BoardGameResponse>(
    `https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&limit=4&client_id=${encodeURIComponent(
      key
    )}&name=${encodeURIComponent(query)}`
  );
  return (data?.games || []).map((item) => ({
    id: `boardgameatlas:${item.id}`,
    name: item.name,
    subtitle: [
      'Board game',
      item.year_published ? String(item.year_published) : '',
    ]
      .filter(Boolean)
      .join(' · '),
    image: item.images?.small,
    url: item.url,
    source: 'boardgameatlas' as const,
  }));
}

export default async function suggestions(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const queryValue = Array.isArray(request.query.q)
    ? request.query.q[0]
    : request.query.q;
  const query = queryValue?.trim() || '';
  if (query.length < 3) {
    response.status(200).json({ suggestions: [] });
    return;
  }

  const results = await Promise.all([
    tmdbSuggestions(query),
    rawgSuggestions(query),
    appleSuggestions(query),
    boardGameSuggestions(query),
  ]);
  response.setHeader(
    'Cache-Control',
    's-maxage=86400, stale-while-revalidate=604800'
  );
  response.status(200).json({ suggestions: mergeSuggestions(results) });
}
