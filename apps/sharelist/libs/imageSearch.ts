export interface PodcastSearchResult {
  results?: Array<{
    collectionName?: string;
    trackName?: string;
    artworkUrl600?: string;
  }>;
}

export const podcastSearchUrl = (name: string) =>
  `https://itunes.apple.com/search?term=${encodeURIComponent(
    name
  )}&media=podcast&entity=podcast&limit=5`;

const normalizeName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, '');

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
