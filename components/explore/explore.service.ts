import { Config } from '@/constants/config';
import { FeaturedPlan, Destination } from './types';

const DUMMY_PLANS: FeaturedPlan[] = [
  {
    id: '1',
    title: '10 Day Ultimate North',
    duration: '10 Days',
    description: 'Comprehensive tour covering Hunza, Skardu, and Fairy Meadows.',
    image: '',
  },
  {
    id: '2',
    title: '3 Day Quick Visit to Nathiagali',
    duration: '3 Days',
    description: 'A perfect weekend getaway to the lush green Galiyat.',
    image: '',
  },
  {
    id: '3',
    title: '5 Day Swat & Kalam Adventure',
    duration: '5 Days',
    description: 'Explore the Switzerland of the East and its alpine lakes.',
    image: '',
  },
];

const DUMMY_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Skardu',
    region: 'Gilgit-Baltistan',
    description: 'The gateway to the highest peaks of the world.',
    image: '',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Hunza',
    region: 'Gilgit-Baltistan',
    description: 'Ancient culture and breathtaking valley views.',
    image: '',
    rating: 5.0,
  },
  {
    id: '3',
    name: 'Kalam',
    region: 'Swat Valley',
    description: 'Emerald waters and dense pine forests.',
    image: '',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Chitral',
    region: 'Khyber Pakhtunkhwa',
    description: 'Home to the unique Kalash culture.',
    image: '',
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Naran',
    region: 'Kaghan Valley',
    description: 'The starting point for the legendary Saif-ul-Malook lake.',
    image: '',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Fairy Meadows',
    region: 'Diamer',
    description: 'Unmatched views of the killer mountain, Nanga Parbat.',
    image: '',
    rating: 5.0,
  },
];

export const ExploreService = {
  getFeaturedPlans: async (): Promise<FeaturedPlan[]> => {
    if (Config.USE_API) {
      // API implementation
      return DUMMY_PLANS;
    }
    return new Promise((resolve) => setTimeout(() => resolve(DUMMY_PLANS), 500));
  },

  getDestinations: async (search?: string): Promise<Destination[]> => {
    if (Config.USE_API) {
      // API implementation
      return DUMMY_DESTINATIONS;
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!search) {
          resolve(DUMMY_DESTINATIONS);
        } else {
          const filtered = DUMMY_DESTINATIONS.filter(d => 
            d.name.toLowerCase().includes(search.toLowerCase()) || 
            d.region.toLowerCase().includes(search.toLowerCase())
          );
          resolve(filtered);
        }
      }, 500);
    });
  },
};
