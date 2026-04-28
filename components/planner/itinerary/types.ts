export interface ItineraryNode {
  id: string;
  type: 'Travel' | 'Activity' | 'Stop';
  time: string;
  description: string;
  duration: string;
  cost: number;
  isFixed: boolean;
  isSelected: boolean;
}

export interface StayOption {
  id: string;
  name: string;
  level: 'Budget' | 'Mid-range' | 'Luxury';
  cost: number;
  rating: number;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  nodes: ItineraryNode[];
  stayOptions: StayOption[];
  selectedStayId?: string;
}

export interface TripItinerary {
  id: string;
  title: string;
  days: ItineraryDay[];
}
