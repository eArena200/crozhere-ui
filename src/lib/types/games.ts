import { StationType } from "./station";

export interface Game {
  id: string;
  name: string;
  type: StationType;
  description: string;
  imageUrl: string;
  playersCount: string;
  avgDuration: string;
  priceRange: string;
}

export interface GameCategory {
  category: string;
  games: Game[];
} 