import { Config } from '@/constants/config';
import { MyPlan, FeaturedPlan } from './types';
import { TripItinerary, ItineraryDay, ItineraryNode, BackendFindRouteResponse } from './itinerary/types';
import { TripConfig } from './create-plan/types';
import { PETROL_PRICE, FUEL_AVERAGE, buildFoodNode, buildStayOptions, DEFAULT_STAY_ID } from './itinerary/itinerary.service';

const DUMMY_FEATURED: FeaturedPlan[] = [
  { id: 'f1', title: '10 Day Ultimate North', duration: '10 Days', description: 'Comprehensive tour covering Hunza and Skardu.' },
  { id: 'f2', title: '3 Day Visit to Nathiagali', duration: '3 Days', description: 'Quick weekend getaway.' },
];

function minutesToTime(baseMinutes: number, offsetMin: number): string {
  const total = baseMinutes + offsetMin;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function mapResponseToItinerary(response: BackendFindRouteResponse, config: TripConfig): TripItinerary {
  const BASE_START_MIN = 8 * 60; // 8:00 AM

  const days: ItineraryDay[] = response.days.map((backendDay, dayIndex) => {
    let cursorMin = 0;
    const fixedNodes: ItineraryNode[] = [];
    const editableItems: ItineraryNode[] = [];

    backendDay.activities.forEach((act, actIndex) => {
      const startTime = minutesToTime(BASE_START_MIN, cursorMin);
      const endTime = minutesToTime(BASE_START_MIN, cursorMin + act.time_required_min);
      const durationStr = act.time_required_min >= 60
        ? `${Math.floor(act.time_required_min / 60)}h${act.time_required_min % 60 > 0 ? ` ${act.time_required_min % 60}m` : ''}`
        : `${act.time_required_min}m`;

      const calculatedCost = act.type === 'travel'
        ? Math.round(((act.distance_km || 0) / FUEL_AVERAGE) * PETROL_PRICE)
        : act.cost;

      const node: ItineraryNode = {
        id: `day${backendDay.day}-act${actIndex}`,
        type: act.type === 'travel' ? 'Travel' : act.type === 'stay' ? 'Stop' : 'Activity',
        time: startTime,
        arrivalTime: endTime,
        title: act.title,
        description: act.description || '',
        duration: durationStr,
        cost: calculatedCost,
        distance_km: act.distance_km,
        difficulty: act.difficulty,
        timeRequiredMin: act.time_required_min,
        toLocation: act.to_location,
        isFixed: !act.is_editable,
        isOptional: act.is_editable,
        isSelected: true,
      };

      if (act.is_editable) {
        // Editable activities go into the ActivityGroup as optional items
        editableItems.push(node);
      } else {
        // Fixed travel/stay nodes go directly onto the timeline
        fixedNodes.push(node);
        cursorMin += act.time_required_min;
      }
    });

    // Build final nodes: fixed nodes + one ActivityGroup for all editables
    const nodes: ItineraryNode[] = [...fixedNodes];
    if (editableItems.length > 0) {
      const group: ItineraryNode = {
        id: `day${backendDay.day}-activities`,
        type: 'ActivityGroup',
        time: minutesToTime(BASE_START_MIN, cursorMin),
        arrivalTime: '',
        title: 'Activities',
        description: '',
        duration: '',
        cost: editableItems.reduce((sum, i) => sum + i.cost, 0),
        timeRequiredMin: editableItems.reduce((sum, i) => sum + i.timeRequiredMin, 0),
        isFixed: false,
        isOptional: true,
        isSelected: true,
        items: editableItems,
        originalItems: JSON.parse(JSON.stringify(editableItems)), // backup for reset
      };
      nodes.push(group);
    }

    // Append a daily food cost node using real traveler counts from config
    nodes.push(buildFoodNode(
      backendDay.day,
      config.travelers.adults,
      config.travelers.children,
    ));

    const date = new Date(config.departureDate);
    date.setDate(date.getDate() + dayIndex);

    return {
      id: `day-${backendDay.day}`,
      dayNumber: backendDay.day,
      date: date.toLocaleDateString('en-PK', { weekday: 'short', day: '2-digit', month: 'short' }),
      departureTimeMin: BASE_START_MIN,
      nodes,
      stayOptions: buildStayOptions(),
      selectedStayId: DEFAULT_STAY_ID,
      notes: [],
    };
  });

  return {
    id: `trip-${Date.now()}`,
    title: `${config.sourceCity} → ${config.destinationCity}`,
    days,
  };
}

export const PlannerService = {
  getFeaturedPlans: async (): Promise<FeaturedPlan[]> => {
    if (Config.USE_API) return [];
    return new Promise((resolve) => setTimeout(() => resolve(DUMMY_FEATURED), 500));
  },

  findRoute: async (config: TripConfig): Promise<TripItinerary> => {
    const body = {
      source_name: config.sourceCity,
      destination_name: config.destinationCity,
      driving_hours_per_day: config.drivingHoursPerDay ?? 8,
      max_days: config.duration,
    };

    const response = await fetch(`${Config.API_BASE_URL}/planning/find-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Route API failed: ${err}`);
    }

    const data: BackendFindRouteResponse = await response.json();
    if (data.status === 'failed') {
      throw new Error(data.message || 'Failed to generate itinerary. Please try again.');
    }
    return mapResponseToItinerary(data, config);
  },
};
