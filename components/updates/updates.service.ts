import { NewsItem, RoadStatus } from './types';

const DUMMY_NEWS: NewsItem[] = [
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
  {
    id: 'n3',
    dateTime: '1 day ago',
    title: 'Karakoram Highway Expansion Complete',
    summary: 'The section between Gilgit and Hunza is now a dual carriageway, significantly reducing travel time for commuters and tourists alike.',
    content: 'The multi-year project to expand the KKH is finally complete. The new dual carriageway significantly improves safety and reduces the drive from Gilgit to Hunza by 45 minutes. Expect smooth roads and improved signage.',
    tags: ['Roads', 'KKH', 'Infrastructure'],
    // REMOVED THUMBNAIL TO TEST NO-IMAGE SCENARIO
  }
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
    // NO IMAGE
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

export const UpdatesService = {
  getNews: async (): Promise<NewsItem[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(DUMMY_NEWS), 800));
  },
  getRoads: async (): Promise<RoadStatus[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(DUMMY_ROADS), 800));
  }
};
