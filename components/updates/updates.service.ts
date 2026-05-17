import { Config } from '@/constants/config';
import { NewsItem, RoadStatus } from './types';

const DUMMY_NEWS: NewsItem[] = [
  // ... existing dummy data preserved for fallback
  {
    id: 'n1',
    dateTime: '2 hrs ago',
    title: 'Snowfall Alert: Lowari Tunnel to Chitral',
    summary: 'Heavy snowfall expected in the next 24 hours. Travelers advised to use snow chains.',
    content: 'The meteorological department has issued a high-level alert for the Lowari Tunnel and surrounding areas. Expect up to 2 feet of snow. Road clearance teams are on standby, but visibility is low. Essential travel only is recommended for the next two days.',
    tags: ['Weather', 'Chitral', 'Alert'],
    thumbnail: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=200',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800',
  },
  {
    id: 'n2',
    dateTime: '5 hrs ago',
    title: 'New Luxury Resort Opens in Skardu',
    summary: 'The Shangri-La Pearl offers panoramic views of the Kachura Lake and high-end amenities.',
    content: 'Tourism in Skardu gets a major boost with the opening of Shangri-La Pearl. The resort features 50 suites, an infinity pool overlooking the lake, and world-class dining. Bookings are now open for the summer season starting June.',
    tags: ['Tourism', 'Skardu', 'Luxury'],
    thumbnail: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=200',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800',
  },
];

const DUMMY_ROADS: RoadStatus[] = [
  {
    id: 'r1',
    location: 'Lowari Tunnel',
    status: 'Caution',
    lastUpdated: '15 mins ago',
    details: 'One-way traffic due to maintenance. Expect 30 min delay.',
    tags: ['N45', 'Tunnel'],
    thumbnail: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=200',
  },
  {
    id: 'r2',
    location: 'Babusar Top',
    status: 'Closed',
    lastUpdated: '1 hr ago',
    details: 'Closed for winter. Will reopen in June 2026.',
    tags: ['N15', 'HighPass'],
  },
  {
    id: 'r3',
    location: 'Gilgit-Skardu Road',
    status: 'Open',
    lastUpdated: '45 mins ago',
    details: 'Road clear. Smooth traffic flow.',
    tags: ['S1', 'Skardu'],
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200',
  }
];

const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return 'Just now';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

let newsCache: { timestamp: number; data: NewsItem[] } | null = null;
let roadsCache: { timestamp: number; data: RoadStatus[] } | null = null;
let tagsCache: { timestamp: number; data: string[] } | null = null;

const CACHE_DURATION_MS = 60 * 1000; // 1 minute

export const UpdatesService = {
  getNews: async (page = 1, pageSize = 10, bypassCache = false): Promise<NewsItem[]> => {
    if (page === 1 && !bypassCache && newsCache && (Date.now() - newsCache.timestamp < CACHE_DURATION_MS)) {
      return newsCache.data;
    }

    if (!Config.USE_API) {
      const dummyRes = await new Promise<NewsItem[]>((resolve) => setTimeout(() => resolve(DUMMY_NEWS), 800));
      if (page === 1) {
        newsCache = { timestamp: Date.now(), data: dummyRes };
      }
      return dummyRes;
    }

    try {
      const response = await fetch(`${Config.API_BASE_URL}/news/?page=${page}&page_size=${pageSize}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      // Map API items to our NewsItem interface
      const mapped = (data.items || []).map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(),
        title: item.title,
        content: item.content,
        summary: item.summary || item.content.substring(0, 100) + '...',
        dateTime: formatTimeAgo(item.created_at || item.published_at || item.date || item.timestamp),
        tags: item.tags || [],
        thumbnail: item.thumbnail_url || item.image_url,
        image: item.image_url || item.thumbnail_url,
      }));

      if (page === 1) {
        newsCache = { timestamp: Date.now(), data: mapped };
      }
      return mapped;
    } catch (error) {
      console.error('Error fetching news:', error);
      return DUMMY_NEWS;
    }
  },

  getRoads: async (bypassCache = false): Promise<RoadStatus[]> => {
    if (!bypassCache && roadsCache && (Date.now() - roadsCache.timestamp < CACHE_DURATION_MS)) {
      return roadsCache.data;
    }

    const res = await new Promise<RoadStatus[]>((resolve) => setTimeout(() => resolve(DUMMY_ROADS), 800));
    roadsCache = { timestamp: Date.now(), data: res };
    return res;
  },

  getTopTags: async (limit = 10, bypassCache = false): Promise<string[]> => {
    if (!bypassCache && tagsCache && (Date.now() - tagsCache.timestamp < CACHE_DURATION_MS)) {
      return tagsCache.data;
    }

    if (!Config.USE_API) {
      const dummyRes = ['All', 'Weather', 'Skardu', 'Roads', 'Tourism', 'Alert'];
      tagsCache = { timestamp: Date.now(), data: dummyRes };
      return dummyRes;
    }

    try {
      const response = await fetch(`${Config.API_BASE_URL}/news/tags/top?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const mapped = ['All', ...data.map((item: any) => item.tag)];
      tagsCache = { timestamp: Date.now(), data: mapped };
      return mapped;
    } catch (error) {
      console.error('Error fetching top tags:', error);
      return ['All', 'Weather', 'Skardu', 'Roads'];
    }
  },

  getTagSuggestions: async (query: string, limit = 5): Promise<string[]> => {
    if (!Config.USE_API || !query) {
      return [];
    }

    try {
      const response = await fetch(`${Config.API_BASE_URL}/news/tags/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // The API returns a simple array of strings [ "tag1", "tag2" ]
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching tag suggestions:', error);
      return [];
    }
  }
};
