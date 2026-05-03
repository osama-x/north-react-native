import { TripItinerary, ItineraryDay, StayOption, ItineraryNode } from './types';

const DUMMY_STAYS: StayOption[] = [
  { 
    id: 's1', 
    name: 'Standard Guest House', 
    level: 'Budget', 
    cost: 3500, 
    rating: 3.5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
  },
  { 
    id: 's2', 
    name: 'River View Hotel', 
    level: 'Mid-range', 
    cost: 8500, 
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
  },
  { 
    id: 's3', 
    name: 'Lux Continental', 
    level: 'Luxury', 
    cost: 18000, 
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
  },
];

const createActivityGroup = (id: string, title: string, items: ItineraryNode[]): ItineraryNode => ({
  id,
  type: 'ActivityGroup',
  title,
  time: '',
  description: '',
  duration: '',
  cost: 0,
  isFixed: false,
  isOptional: false,
  isSelected: true,
  items: JSON.parse(JSON.stringify(items)),
  originalItems: JSON.parse(JSON.stringify(items)),
});

const DUMMY_ITINERARY: TripItinerary = {
  id: 'it1',
  title: 'Chitral Expedition',
  days: [
    {
      id: 'd1',
      dayNumber: 1,
      date: '21st May, 2026',
      nodes: [
        { 
          id: 'n1', 
          type: 'Travel', 
          time: '09:00 AM', 
          title: 'Travel from Lahore -> Islamabad',
          description: 'Departure via M2 Motorway', 
          summary: 'A smooth drive through the salt range with scenic views.',
          duration: '4 hrs', 
          cost: 5000, 
          isFixed: true, 
          isOptional: false,
          isSelected: true,
        },
        createActivityGroup('g1', 'Enroute Activities', [
          { 
            id: 'n1-s1', 
            type: 'Stop', 
            time: '11:00 AM', 
            title: 'Stop at Bhera',
            description: 'Refreshments and Rest', 
            summary: 'Quick break for tea and snacks at Bhera service area.',
            duration: '0.5-1 hr', 
            cost: 1500, 
            isFixed: false, 
            isOptional: true,
            isSelected: false 
          },
          { 
            id: 'n1-s2', 
            type: 'Stop', 
            time: '12:30 PM', 
            title: 'Kallar Kahar View',
            description: 'Photography and Sightseeing', 
            summary: 'Enjoy the panoramic view of the lake.',
            duration: '0.5 hr', 
            cost: 500, 
            isFixed: false, 
            isOptional: true,
            isSelected: false 
          },
        ]),
        { 
          id: 'n4', 
          type: 'Travel', 
          time: '02:00 PM', 
          title: 'Islamabad -> Chitral',
          description: 'Flight to Chitral Valley', 
          summary: 'Breathtaking aerial views of the Hindu Kush range.',
          duration: '1 hr', 
          cost: 12000, 
          isFixed: true, 
          isOptional: false,
          isSelected: true,
        },
        createActivityGroup('g2', 'Chitral Activities', [
          { 
            id: 'n4-s1', 
            type: 'Activity', 
            time: '05:00 PM', 
            title: 'Visit Chitral Bazaar',
            description: 'Local Craft and Dinner', 
            summary: 'Explore the traditional market and try local trout.',
            duration: '2 hrs', 
            cost: 2500, 
            isFixed: false, 
            isOptional: true,
            isSelected: true 
          },
        ]),
      ],
      stayOptions: DUMMY_STAYS,
      selectedStayId: 's2',
    },
    {
      id: 'd2',
      dayNumber: 2,
      date: '22nd May, 2026',
      nodes: [
        { 
          id: 'n6', 
          type: 'Activity', 
          time: '06:00 AM', 
          title: 'Sunrise at Terich Mir',
          description: 'Early morning peak views', 
          summary: 'Experience the first light hitting the highest peak.',
          duration: '2 hrs', 
          cost: 0, 
          isFixed: true, 
          isOptional: false,
          isSelected: true,
        },
        createActivityGroup('g3', 'Day 2 Sightseeing', [
          { 
            id: 'n6-s1', 
            type: 'Activity', 
            time: '10:00 AM', 
            title: 'Shahi Mosque & Fort',
            description: 'Historical Sightseeing', 
            summary: 'Guided tour of the 17th century mosque.',
            duration: '1.5 hrs', 
            cost: 1000, 
            isFixed: false, 
            isOptional: true,
            isSelected: false 
          },
        ]),
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
