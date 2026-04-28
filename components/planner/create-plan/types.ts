export interface TripConfig {
  sourceCity: string;
  destinationCity: string;
  departureDate: Date;
  returnDate: Date;
  duration: number; // in days
  budget: number;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  transportMode: 'Car' | 'Bus' | 'Flight';
}
