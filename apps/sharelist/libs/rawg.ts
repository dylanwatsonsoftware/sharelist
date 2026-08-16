import { GameSearchResult, getGameArtwork } from './imageSearch';

export async function fetchRawgImage(
  name: string,
  apiKey: string
): Promise<string | undefined> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${encodeURIComponent(
        apiKey
      )}&search=${encodeURIComponent(name)}&search_exact=true&page_size=5`,
      { signal: controller.signal }
    );
    if (!response.ok) return undefined;
    return getGameArtwork((await response.json()) as GameSearchResult, name);
  } finally {
    clearTimeout(timeout);
  }
}
