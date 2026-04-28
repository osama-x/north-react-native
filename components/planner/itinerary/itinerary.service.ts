import { TripItinerary, ItineraryDay, StayOption } from './types';

const DUMMY_STAYS: StayOption[] = [
  { id: 's1', name: 'Standard Guest House', level: 'Budget', cost: 3500, rating: 3.5 },
  { id: 's2', name: 'River View Hotel', level: 'Mid-range', cost: 8500, rating: 4.2 },
  { id: 's3', name: 'Lux Continental', level: 'Luxury', cost: 18000, rating: 4.8 },
];

const DUMMY_ITINERARY: TripItinerary = {
  id: 'it1',
  title: 'Skardu Expedition',
  days: [
    {
      id: 'd1',
      dayNumber: 1,
      nodes: [
        { id: 'n1', type: 'Travel', time: '09:00 AM', description: 'Travel from Islamabad -> Besham', duration: '6.5 hrs', cost: 5000, isFixed: true, isSelected: true },
        { id: 'n2', type: 'Stop', time: '01:00 PM', description: 'Lunch Break at Abbottabad', duration: '1 hr', cost: 1500, isFixed: false, isSelected: true },
        { id: 'n3', type: 'Activity', time: '04:00 PM', description: 'Besham Riverside Walk', duration: '1.5 hrs', cost: 500, isFixed: false, isSelected: false },
      ],
      stayOptions: DUMMY_STAYS,
      selectedStayId: 's2',
    },
    {
      id: 'd2',
      dayNumber: 2,
      nodes: [
        { id: 'n4', type: 'Travel', time: '08:00 AM', description: 'Besham -> Chilas', duration: '6 hrs', cost: 4000, isFixed: true, isSelected: true },
        { id: 'n5', type: 'Stop', time: '12:00 PM', description: 'Sightseeing at Nanga Parbat View Point', duration: '45 mins', cost: 200, isFixed: false, isSelected: true },
        { id: 'n6', type: 'Activity', time: '05:00 PM', description: 'Local Chilas Market Exploration', duration: '2 hrs', cost: 0, isFixed: false, isSelected: true },
      ],
      stayOptions: DUMMY_STAYS,
      selectedStayId: 's1',
    },
  ],
};

export const ItineraryService = {
  getItinerary: async (config?: any): Promise<TripItinerary> => {
    return new Promise((resolve) => setTimeout(() => resolve(DUMMY_ITINERARY), 500));
  }
};
