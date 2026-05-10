// Backend Schema Types
export interface BackendActivity {
  type: string;
  title: string;
  is_editable: boolean;
  description?: string;
  from_location?: string;
  to_location?: string;
  distance_km: number;
  cost: number;
  time_required_min: number;
  difficulty: string;
}

export interface BackendDayItinerary {
  day: number;
  activities: BackendActivity[];
  driving_time_hours: number;
  visited_locations: string[];
}

export interface BackendFindRouteResponse {
  status: string;
  total_duration_hours: number;
  total_distance_km: number;
  total_cost: number;
  days: BackendDayItinerary[];
  message: string;
}

// UI Schema Types
export interface ItineraryNode {
  id: string;
  type: 'Travel' | 'Activity' | 'Stop' | 'Rest' | 'ActivityGroup';
  time: string; // Synthesized absolute time
  title: string;
  description: string;
  summary?: string;
  duration: string; // Synthesized friendly duration
  cost: number;
  
  // Backend specifics
  distance_km?: number;
  difficulty?: string;
  timeRequiredMin: number; // For dynamic timeline recalculation
  toLocation?: string;
  arrivalTime?: string; // Formatted arrival time
  
  // UI State
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
  departureTimeMin: number; // e.g., 480 for 8:00 AM
  nodes: ItineraryNode[];
  stayOptions: StayOption[];
  selectedStayId?: string;
}

export interface TripItinerary {
  id: string;
  title: string;
  days: ItineraryDay[];
}
