export interface GameResult {
  games?: Game[];
}

interface Game {
  name: string;
  images: { small: string };
}
