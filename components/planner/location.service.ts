import { Config } from '@/constants/config';

export interface LocationSuggestion {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  description: string | null;
  popularity: number | null;
  tagline: string | null;
}

export const LocationService = {
  searchLocations: async (query: string, onlyDestinations: boolean = false, limit: number = 10): Promise<LocationSuggestion[]> => {
    if (!Config.USE_API || !query || query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${Config.API_BASE_URL}/locations/search?q=${encodeURIComponent(query)}&only_destinations=${onlyDestinations}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }
};
