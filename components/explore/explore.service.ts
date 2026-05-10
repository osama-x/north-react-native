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
    tagline: 'The Gateway to the Giants',
    description: 'The gateway to the highest peaks of the world.',
    image: 'https://images.unsplash.com/photo-1581440620584-06c273896582?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Hunza',
    region: 'Gilgit-Baltistan',
    tagline: 'A Valley of Ancient Legends',
    description: 'Ancient culture and breathtaking valley views.',
    image: 'https://images.unsplash.com/photo-1615456241315-7798305c742c?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
  },
  {
    id: '3',
    name: 'Kalam',
    region: 'Swat Valley',
    tagline: 'Alpine Paradise in the East',
    description: 'Emerald waters and dense pine forests.',
    image: 'https://images.unsplash.com/photo-1627376378900-51c0989f666b?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Chitral',
    region: 'Khyber Pakhtunkhwa',
    tagline: 'Where Cultures Collide',
    description: 'Home to the unique Kalash culture.',
    image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Naran',
    region: 'Kaghan Valley',
    tagline: 'Jewel of the Kaghan',
    description: 'The starting point for the legendary Saif-ul-Malook lake.',
    image: 'https://images.unsplash.com/photo-1563292325-103362143003?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Fairy Meadows',
    region: 'Diamer',
    tagline: 'Under the Shadow of Nanga Parbat',
    description: 'Unmatched views of the killer mountain, Nanga Parbat.',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
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
