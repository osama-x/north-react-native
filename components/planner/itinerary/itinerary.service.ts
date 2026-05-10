import {
  BackendFindRouteResponse,
  ItineraryDay,
  ItineraryNode,
  StayOption,
  TripItinerary
} from './types';

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
];

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

export const transformBackendResponse = (response: BackendFindRouteResponse): TripItinerary => {
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

      const node: ItineraryNode = {
        id: `d${dayData.day}-n${actIndex}`,
        type: act.type === 'travel' ? 'Travel' : 'Activity',
        time: timeStr,
        title: nodeTitle,
        description: act.description || '',
        duration: durStr,
        cost: act.cost,
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

    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayData.day - 1);

    return {
      id: `day-${dayData.day}`,
      dayNumber: dayData.day,
      date: currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      departureTimeMin,
      nodes,
      stayOptions: DUMMY_STAYS, // Maintain mock stays for UI testing
      selectedStayId: DUMMY_STAYS[0].id,
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

export const ItineraryService = {
  getItinerary: async (config?: any): Promise<TripItinerary> => {
    return new Promise((resolve) => setTimeout(() => resolve(transformBackendResponse(DUMMY_BACKEND_RESPONSE)), 500));
  }
};
