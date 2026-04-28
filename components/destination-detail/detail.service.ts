import { UpdatesService } from '../updates/updates.service';
import { DestinationDetail, StayOption } from './types';
import { ExploreService } from '../explore/explore.service';

const DUMMY_STAYS: StayOption[] = [
  {
    id: 's1',
    name: 'Shangrila Resort',
    type: 'Resort',
    priceRange: '$$$$',
    rating: 4.9,
    description: 'Iconic resort on the banks of Lower Kachura Lake.',
  },
  {
    id: 's2',
    name: 'Serena Hotel',
    type: 'Hotel',
    priceRange: '$$$$',
    rating: 4.8,
    description: 'Luxury combined with traditional heritage architecture.',
  },
  {
    id: 's3',
    name: 'Mountain View Guest House',
    type: 'Guest House',
    priceRange: '$$',
    rating: 4.2,
    description: 'Cozy stay with a perfect view of the peaks.',
  },
];

export const DestinationDetailService = {
  getDetail: async (id: string): Promise<DestinationDetail | null> => {
    // 1. Get destination basic info from ExploreService
    const destinations = await ExploreService.getDestinations();
    const destination = destinations.find(d => d.id === id);
    
    if (!destination) return null;

    // 2. Get related news from UpdatesService
    const allNews = await UpdatesService.getNews();
    const relatedNews = allNews.filter(n => 
      n.tags.some(t => t.toLowerCase() === destination.name.toLowerCase())
    );

    // 3. Construct detail object
    return {
      ...destination,
      summary: `${destination.name} is a stunning destination located in ${destination.region}, known for its ${destination.description.toLowerCase()}`,
      news: relatedNews,
      stays: DUMMY_STAYS, // Dummy for now
    };
  }
};
