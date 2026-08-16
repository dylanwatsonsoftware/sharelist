export interface PodcastSearchResult {
  results?: Array<{
    collectionName?: string;
    trackName?: string;
    artworkUrl600?: string;
  }>;
}

export interface MovieSearchResult {
  results?: Array<{
    name?: string;
    title?: string;
    poster_path?: string;
    vote_count?: number;
  }>;
}

export interface GameSearchResult {
  results?: Array<{
    name?: string;
    background_image?: string;
  }>;
}

export const podcastSearchUrl = (name: string) =>
  `https://itunes.apple.com/search?term=${encodeURIComponent(
    name
  )}&media=podcast&entity=podcast&limit=5`;

const normalizeName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, '');

export function getGameArtwork(
  result: GameSearchResult | undefined,
  itemName: string
): string | undefined {
  const normalizedItemName = normalizeName(itemName);
  return result?.results?.find(
    (candidate) =>
      candidate.background_image &&
      normalizeName(candidate.name || '') === normalizedItemName
  )?.background_image;
}

export function getMovieArtwork(
  result: MovieSearchResult | undefined,
  itemName: string,
  size: 'w92' | 'w500'
): string | undefined {
  const normalizedItemName = normalizeName(itemName);
  const match = result?.results?.find((candidate) => {
    if (!candidate.poster_path) return false;
    const normalizedResultName = normalizeName(
      candidate.name || candidate.title || ''
    );
    return (
      normalizedResultName &&
      (normalizedResultName.includes(normalizedItemName) ||
        normalizedItemName.includes(normalizedResultName))
    );
  });

  return match?.poster_path
    ? `https://image.tmdb.org/t/p/${size}${match.poster_path}`
    : undefined;
}

export function getPodcastArtwork(
  result: PodcastSearchResult | undefined,
  itemName: string
): string | undefined {
  const normalizedItemName = normalizeName(itemName);
  const podcast = result?.results?.find((candidate) => {
    const name = candidate.collectionName || candidate.trackName || '';
    const normalizedResultName = normalizeName(name);
    return (
      normalizedResultName &&
      (normalizedResultName.includes(normalizedItemName) ||
        normalizedItemName.includes(normalizedResultName))
    );
  });

  return podcast?.artworkUrl600;
}
