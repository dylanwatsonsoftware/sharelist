export interface Suggestion {
  id: string;
  name: string;
  subtitle: string;
  image?: string;
  url?: string;
  source: 'tmdb' | 'apple' | 'rawg' | 'boardgameatlas';
}
