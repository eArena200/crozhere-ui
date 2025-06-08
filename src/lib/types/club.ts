import { StationType } from "./station";

export interface Club {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  totalReviews: number;
  imageUrl: string;
  distance?: string;
  availableGames: StationType[];
  priceRange: string;
  description: string;
  phone: string;
  operatingHours: {
    open: string;
    close: string;
  };
  amenities: string[];
}

export interface SearchFilters {
  query: string;
  gameType?: StationType;
  city?: string;
  priceRange?: string;
} 