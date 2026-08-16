import { Suggestion } from '../models/Suggestion';

const normalized = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

export function mergeSuggestions(groups: Suggestion[][]): Suggestion[] {
  const seen = new Set<string>();
  return groups
    .flat()
    .filter((suggestion) => {
      const key = `${normalized(suggestion.name)}:${suggestion.subtitle
        .split(' · ')[0]
        .toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

export async function fetchJson<T>(
  url: string,
  timeoutMs = 1800
): Promise<T | undefined> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.ok ? ((await response.json()) as T) : undefined;
  } catch (error) {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}
