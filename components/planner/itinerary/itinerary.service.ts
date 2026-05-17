import {
  BackendFindRouteResponse,
  ItineraryDay,
  ItineraryNode,
  StayOption,
  TripItinerary
} from './types';

// Fuel Estimation Globals (To be replaced with backend/profile configurations later)
export const PETROL_PRICE = 410; // PKR per litre
export const FUEL_AVERAGE = 14;  // km per litre

// ─── Food Cost Configuration ────────────────────────────────────────────────
// Tier rates are per person per day in PKR.
// Children are counted at 0.5x adult rate. Infants are free.
// Adjust rates here when pricing needs to change.
export const FOOD_TIERS = {
  budget: {
    label: 'Budget Eats',
    description: 'Local dhabas, simple home-style meals',
    perPersonMin: 1000,
    perPersonMax: 1200,
    perPersonPerDay: 1100, // average of min and max
  },
  standard: {
    label: 'Standard Dining',
    description: 'Mix of local restaurants & roadside eateries',
    perPersonMin: 1650,
    perPersonMax: 2000,
    perPersonPerDay: 1825, // average of min and max
  },
  premium: {
    label: 'Premium Dining',
    description: 'Quality restaurants with varied menu ',
    perPersonMin: 2500,
    perPersonMax: 3000,
    perPersonPerDay: 2750, // average of min and max
  },
} as const;

export type FoodTier = keyof typeof FOOD_TIERS;
export const DEFAULT_FOOD_TIER: FoodTier = 'standard';

/**
 * Calculate estimated daily food cost for a group.
 * Infants are always free. Children cost 50% of the adult rate.
 */
export const calculateDailyFoodCost = (
  adults: number,
  children: number,
  tier: FoodTier = DEFAULT_FOOD_TIER,
): number => {
  const rate = FOOD_TIERS[tier].perPersonPerDay;
  return Math.round((adults + children * 0.5) * rate);
};

/** Build a standardised food cost node to append to each day's node list. */
export const buildFoodNode = (
  dayId: string | number,
  adults: number,
  children: number,
  tier: FoodTier = DEFAULT_FOOD_TIER,
): ItineraryNode => ({
  id: `d${dayId}-food`,
  type: 'Activity',
  time: '',
  title: `Daily Meals — ${FOOD_TIERS[tier].label}`,
  description: `${FOOD_TIERS[tier].description} (For ${adults} adults${children > 0 ? `, ${children} children` : ''})`,
  duration: 'All Day',
  cost: calculateDailyFoodCost(adults, children, tier),
  distance_km: 0,
  timeRequiredMin: 0,  // does not shift the timeline
  difficulty: 'Easy',
  isFixed: true,
  isOptional: false,
  isSelected: true,
  foodTier: tier,
  adults,
  children,
});
// ────────────────────────────────────────────────────────────────────────────

// ─── Stay Options Configuration ─────────────────────────────────────────────
// Per-night rate covers up to 4 persons. Adjust costs here as pricing evolves.
// In future, stayOptions per day will be fetched from API.
export const STAY_TIERS = {
  budget: {
    id: 'stay-budget',
    name: 'Budget Stay',
    level: 'Budget' as const,
    cost: 7000,
    rating: 3.6,
    description: 'Decent amenities and clean washrooms. No flashy items. Best for night stays.',
  },
  standard: {
    id: 'stay-standard',
    name: 'Standard Hotel',
    level: 'Mid-range' as const,
    cost: 13500, // midpoint of 12K–15K
    rating: 4.2,
    description: 'Includes luxuries like heating, AC, and hot water. Good for a full day stay.',
  },
  luxury: {
    id: 'stay-luxury',
    name: 'Luxury Hotel',
    level: 'Luxury' as const,
    cost: 25000,
    rating: 4.8,
    description: 'Premium brand-managed hotels. Recommended if staying mostly indoors. Iconic experiences.',
  },
} as const;

export const DEFAULT_STAY_ID = STAY_TIERS.budget.id;

/** Returns the 3 standardised stay options for any day. */
export const buildStayOptions = (): StayOption[] =>
  (Object.values(STAY_TIERS) as Array<typeof STAY_TIERS[keyof typeof STAY_TIERS]>).map(tier => ({
    id: tier.id,
    name: tier.name,
    level: tier.level,
    cost: tier.cost,
    rating: tier.rating,
    description: tier.description,
  }));
// ─────────────────────────────────────────────────────────────────────────────


export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours} hr ${mins} min`;
  if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${mins} min`;
};

export const formatTime = (totalMinutesPassed: number): string => {
  const totalHours = Math.floor(totalMinutesPassed / 60);
  const totalMins = totalMinutesPassed % 60;

  const ampm = totalHours >= 12 && totalHours < 24 ? 'PM' : 'AM';
  let formattedHour = totalHours % 12;
  formattedHour = formattedHour ? formattedHour : 12;

  const formattedMin = totalMins < 10 ? '0' + totalMins : totalMins;

  return `${formattedHour}:${formattedMin} ${ampm}`;
};

export const transformBackendResponse = (
  response: BackendFindRouteResponse,
  travelers?: { adults: number; children: number },
): TripItinerary => {
  // Default traveler counts for the dummy/fallback data path
  const adults = travelers?.adults ?? 2;
  const children = travelers?.children ?? 1;
  const startDate = new Date();

  const days: ItineraryDay[] = response.days.map((dayData) => {
    const departureTimeMin = 480; // Default 8:00 AM
    let currentDayMinutes = departureTimeMin;
    const nodes: ItineraryNode[] = [];

    let currentGroupItems: ItineraryNode[] = [];

    const flushGroup = () => {
      if (currentGroupItems.length > 0) {
        nodes.push({
          id: `d${dayData.day}-g${nodes.length}`,
          type: 'ActivityGroup',
          title: 'Optional Activities',
          time: currentGroupItems[0].time,
          description: '',
          duration: '',
          cost: 0,
          distance_km: 0,
          timeRequiredMin: 0, // group itself doesn't have inherent time
          isFixed: false,
          isOptional: false,
          isSelected: true,
          items: currentGroupItems,
          originalItems: JSON.parse(JSON.stringify(currentGroupItems)),
        });
        currentGroupItems = [];
      }
    };

    dayData.activities.forEach((act, actIndex) => {
      const timeStr = formatTime(currentDayMinutes);
      const durStr = formatDuration(act.time_required_min);

      const nodeTitle = act.type === 'travel' && act.from_location && act.to_location
        ? `${act.from_location} to ${act.to_location}`
        : act.title;

      let calculatedCost = act.cost;
      if (act.type === 'travel') {
        calculatedCost = Math.round(((act.distance_km || 0) / FUEL_AVERAGE) * PETROL_PRICE);
      }

      const node: ItineraryNode = {
        id: `d${dayData.day}-n${actIndex}`,
        type: act.type === 'travel' ? 'Travel' : 'Activity',
        time: timeStr,
        title: nodeTitle,
        description: act.description || '',
        duration: durStr,
        cost: calculatedCost,
        distance_km: act.distance_km,
        difficulty: act.difficulty,
        timeRequiredMin: act.time_required_min,
        toLocation: act.to_location,
        arrivalTime: formatTime(currentDayMinutes + act.time_required_min),
        isFixed: !act.is_editable,
        isOptional: act.is_editable,
        isSelected: !act.is_editable,
      };

      if (act.is_editable) {
        currentGroupItems.push(node);
      } else {
        flushGroup();
        nodes.push(node);
      }

      currentDayMinutes += act.time_required_min;
    });

    flushGroup();

    // Inject a daily food cost node at the end of each day
    nodes.push(buildFoodNode(dayData.day, adults, children));

    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayData.day - 1);

    return {
      id: `day-${dayData.day}`,
      dayNumber: dayData.day,
      date: currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      departureTimeMin,
      nodes,
      stayOptions: buildStayOptions(),
      selectedStayId: DEFAULT_STAY_ID,
    };
  });

  return {
    id: `trip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: 'Custom Expedition',
    days,
  };
};

const DUMMY_BACKEND_RESPONSE: BackendFindRouteResponse = {
  "status": "success",
  "total_duration_hours": 40.33,
  "total_distance_km": 1930,
  "total_cost": 100,
  "days": [
    {
      "day": 1,
      "activities": [
        {
          "type": "travel",
          "title": "Drive from Lahore to Islamabad",
          "is_editable": false,
          "description": null,
          "from_location": "Lahore",
          "to_location": "Islamabad",
          "distance_km": 375,
          "cost": 300,
          "time_required_min": 280,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Islamabad to Abbottabad",
          "is_editable": false,
          "description": null,
          "from_location": "Islamabad",
          "to_location": "Abbottabad",
          "distance_km": 120,
          "cost": 0,
          "time_required_min": 150,
          "difficulty": "normal"
        },
        {
          "type": "activity",
          "title": "Shimla Hill Walk",
          "is_editable": true,
          "description": "A popular local hill spot in Abbottabad offering panoramic views. An easy hike that has been a favorite for locals and travelers for decades.",
          "from_location": "Abbottabad",
          "to_location": "Abbottabad",
          "distance_km": 0,
          "cost": 0,
          "time_required_min": 60,
          "difficulty": "Easy"
        }
      ],
      "driving_time_hours": 7.17,
      "visited_locations": [
      ]
    },
    {
      "day": 2,
      "activities": [
        {
          "type": "travel",
          "title": "Drive from Abbottabad to Naran",
          "is_editable": false,
          "description": null,
          "from_location": "Abbottabad",
          "to_location": "Naran",
          "distance_km": 120,
          "cost": 0,
          "time_required_min": 210,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Naran to Chilas",
          "is_editable": false,
          "description": null,
          "from_location": "Naran",
          "to_location": "Chilas",
          "distance_km": 115,
          "cost": 0,
          "time_required_min": 240,
          "difficulty": "normal"
        }
      ],
      "driving_time_hours": 7.5,
      "visited_locations": [
      ]
    },
    {
      "day": 3,
      "activities": [
        {
          "type": "travel",
          "title": "Drive from Chilas to Gilgit",
          "is_editable": false,
          "description": null,
          "from_location": "Chilas",
          "to_location": "Gilgit",
          "distance_km": 130,
          "cost": 0,
          "time_required_min": 180,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Gilgit to Hunza",
          "is_editable": false,
          "description": null,
          "from_location": "Gilgit",
          "to_location": "Hunza",
          "distance_km": 100,
          "cost": 0,
          "time_required_min": 150,
          "difficulty": "normal"
        }
      ],
      "driving_time_hours": 5.5,
      "visited_locations": [
      ]
    },
    {
      "day": 4,
      "activities": [
        {
          "type": "stay",
          "title": "Stay and relax in Hunza",
          "is_editable": true,
          "description": null,
          "from_location": "Hunza",
          "to_location": "Hunza",
          "distance_km": 0,
          "cost": 0,
          "time_required_min": 1440,
          "difficulty": "normal"
        }
      ],
      "driving_time_hours": 0.0,
      "visited_locations": [
      ]
    },
    {
      "day": 5,
      "activities": [
        {
          "type": "travel",
          "title": "Drive from Hunza to Gilgit",
          "is_editable": false,
          "description": null,
          "from_location": "Hunza",
          "to_location": "Gilgit",
          "distance_km": 100,
          "cost": 0,
          "time_required_min": 150,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Gilgit to Chilas",
          "is_editable": false,
          "description": null,
          "from_location": "Gilgit",
          "to_location": "Chilas",
          "distance_km": 130,
          "cost": 0,
          "time_required_min": 180,
          "difficulty": "normal"
        }
      ],
      "driving_time_hours": 5.5,
      "visited_locations": [
      ]
    },
    {
      "day": 6,
      "activities": [
        {
          "type": "travel",
          "title": "Drive from Chilas to Naran",
          "is_editable": false,
          "description": null,
          "from_location": "Chilas",
          "to_location": "Naran",
          "distance_km": 115,
          "cost": 0,
          "time_required_min": 240,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Naran to Kaghan",
          "is_editable": false,
          "description": null,
          "from_location": "Naran",
          "to_location": "Kaghan",
          "distance_km": 25,
          "cost": 0,
          "time_required_min": 50,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Kaghan to Paras",
          "is_editable": false,
          "description": null,
          "from_location": "Kaghan",
          "to_location": "Paras",
          "distance_km": 15,
          "cost": 0,
          "time_required_min": 30,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Paras to Kiwai",
          "is_editable": false,
          "description": null,
          "from_location": "Paras",
          "to_location": "Kiwai",
          "distance_km": 10,
          "cost": 0,
          "time_required_min": 20,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Kiwai to Balakot",
          "is_editable": false,
          "description": null,
          "from_location": "Kiwai",
          "to_location": "Balakot",
          "distance_km": 20,
          "cost": 0,
          "time_required_min": 40,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Balakot to Mansehra",
          "is_editable": false,
          "description": null,
          "from_location": "Balakot",
          "to_location": "Mansehra",
          "distance_km": 40,
          "cost": 0,
          "time_required_min": 60,
          "difficulty": "normal"
        },
        {
          "type": "activity",
          "title": "Mansehra Public Park Leisure",
          "is_editable": true,
          "description": "A well-maintained park ideal for a relaxed afternoon walk. It serves as a central social hub for the local community and passing tourists.",
          "from_location": "Mansehra",
          "to_location": "Mansehra",
          "distance_km": 0,
          "cost": 100,
          "time_required_min": 60,
          "difficulty": "Easy"
        }
      ],
      "driving_time_hours": 7.33,
      "visited_locations": [
      ]
    },
    {
      "day": 7,
      "activities": [
        {
          "type": "travel",
          "title": "Drive from Mansehra to Islamabad",
          "is_editable": false,
          "description": null,
          "from_location": "Mansehra",
          "to_location": "Islamabad",
          "distance_km": 140,
          "cost": 0,
          "time_required_min": 160,
          "difficulty": "normal"
        },
        {
          "type": "travel",
          "title": "Drive from Islamabad to Lahore",
          "is_editable": false,
          "description": null,
          "from_location": "Islamabad",
          "to_location": "Lahore",
          "distance_km": 375,
          "cost": 0,
          "time_required_min": 280,
          "difficulty": "normal"
        }
      ],
      "driving_time_hours": 7.33,
      "visited_locations": [
      ]
    }
  ],
  "message": "Round trip generated for 7 days including 1 days of stay."
}
  ;

export const recalculatePlanFuelCosts = (plan: TripItinerary): { updatedPlan: TripItinerary, totalCost: number } => {
  let totalCost = 0;

  const updatedDays = plan.days.map(day => {
    const updatedNodes = day.nodes.map(node => {
      let cost = node.cost;
      if (node.type === 'Travel' && node.distance_km) {
        cost = Math.round((node.distance_km / FUEL_AVERAGE) * PETROL_PRICE);
      }

      // Sum up selected and unhidden costs
      if (node.type !== 'ActivityGroup') {
        if (node.isSelected && !node.isHidden) {
          totalCost += cost;
        }
      } else {
        // Group items (e.g. optional activities)
        const updatedGroupItems = node.items?.map(item => {
          let itemCost = item.cost;
          if (item.type === 'Travel' && item.distance_km) {
            itemCost = Math.round((item.distance_km / FUEL_AVERAGE) * PETROL_PRICE);
          }
          if (item.isSelected && !item.isHidden) {
            totalCost += itemCost;
          }
          return { ...item, cost: itemCost };
        });
        return { ...node, items: updatedGroupItems, cost };
      }

      return { ...node, cost };
    });

    return { ...day, nodes: updatedNodes };
  });

  return {
    updatedPlan: { ...plan, days: updatedDays },
    totalCost
  };
};

export const ItineraryService = {
  getItinerary: async (config?: any): Promise<TripItinerary> => {
    return new Promise((resolve) => setTimeout(() => resolve(transformBackendResponse(DUMMY_BACKEND_RESPONSE)), 500));
  }
};
