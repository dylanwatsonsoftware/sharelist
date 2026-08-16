import { Suggestion } from '../models/Suggestion';

const normalized = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

export function mergeSuggestions(groups: Suggestion[][]): Suggestion[] {
  const seen = new Set<string>();
  const merged: Suggestion[] = [];
  const maxGroupSize = Math.max(0, ...groups.map((group) => group.length));

  for (let index = 0; index < maxGroupSize && merged.length < 8; index += 1) {
    groups.forEach((group) => {
      const suggestion = group[index];
      if (!suggestion || merged.length >= 8) return;
      const key = `${normalized(suggestion.name)}:${suggestion.subtitle
        .split(' · ')[0]
        .toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(suggestion);
    });
  }

  return merged;
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
