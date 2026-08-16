import { mergeSuggestions } from '../libs/suggestions';

describe('suggestion aggregation', () => {
  it('deduplicates equivalent results and limits the combined list', () => {
    const repeated = {
      id: 'tmdb:1',
      name: 'The Matrix',
      subtitle: 'Movie · 1999',
      source: 'tmdb' as const,
    };
    const unique = Array.from({ length: 10 }, (_, index) => ({
      id: `rawg:${index}`,
      name: `Game ${index}`,
      subtitle: 'Video game',
      source: 'rawg' as const,
    }));

    const result = mergeSuggestions([[repeated], [repeated, ...unique]]);

    expect(result).toHaveLength(8);
    expect(result.filter((item) => item.name === 'The Matrix')).toHaveLength(1);
  });
});
