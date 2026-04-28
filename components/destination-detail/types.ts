import { NewsItem } from '../updates/types';

export interface StayOption {
  id: string;
  name: string;
  type: string; // Hotel, Resort, Guest House
  priceRange: string;
  rating: number;
  description: string;
  link?: string;
}

export interface DestinationDetail {
  id: string;
  name: string;
  region: string;
  summary: string;
  description: string;
  rating: number;
  news: NewsItem[];
  stays: StayOption[];
}
