export interface ItineraryNode {
  id: string;
  type: 'Travel' | 'Activity' | 'Stop' | 'Rest' | 'ActivityGroup';
  time: string;
  title: string;
  description: string;
  summary?: string;
  duration: string;
  cost: number;
  isFixed: boolean;
  isOptional: boolean;
  isSelected: boolean;
  isHidden?: boolean;
  // For ActivityGroup type
  items?: ItineraryNode[];
  originalItems?: ItineraryNode[]; // Backup for restoration
}

export interface StayOption {
  id: string;
  name: string;
  level: 'Budget' | 'Mid-range' | 'Luxury';
  cost: number;
  rating: number;
  image?: string;
  description?: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string;
  nodes: ItineraryNode[];
  stayOptions: StayOption[];
  selectedStayId?: string;
}

export interface TripItinerary {
  id: string;
  title: string;
  days: ItineraryDay[];
}
