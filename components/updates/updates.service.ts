import { Config } from '@/constants/config';
import { NewsItem, RoadStatus } from './types';

const DUMMY_NEWS: NewsItem[] = [
  {
    id: '1',
    dateTime: '2024-04-28 10:30 AM',
    title: 'Cherry Blossom Season in Hunza Valley',
    content: 'The cherry blossoms are in full bloom across Hunza and Nagar valleys. Tourists are advised to book stays in advance as hotels are reaching capacity.',
    tags: ['Hunza', 'Tourism', 'Nature'],
  },
  {
    id: '2',
    dateTime: '2024-04-27 02:15 PM',
    title: 'New Flight Route to Skardu Announced',
    content: 'PIA has announced additional weekly flights from Karachi to Skardu to cater to the increasing summer rush.',
    tags: ['Skardu', 'Travel', 'Aviation'],
  },
  {
    id: '3',
    dateTime: '2024-04-26 09:00 AM',
    title: 'Kalam Festival Dates Finalized',
    content: 'The annual Kalam Summer Festival will be held from July 15th to July 20th, featuring local music, sports, and food stalls.',
    tags: ['Kalam', 'Festival', 'Culture'],
  },
  {
    id: '4',
    dateTime: '2024-04-25 11:45 AM',
    title: 'Sustainable Tourism Initiative in Chitral',
    content: 'A new community-led project has been launched in Chitral to promote eco-friendly trekking and waste management.',
    tags: ['Chitral', 'Eco-Tourism', 'Sustainability'],
  },
];

const DUMMY_ROADS: RoadStatus[] = [
  {
    id: '1',
    location: 'Karakoram Highway (KKH)',
    status: 'Open',
    lastUpdated: '2 hours ago',
    details: 'Road is clear. Traffic moving normally between Besham and Chilas.',
    tags: ['KKH', 'Besham', 'Chilas'],
  },
  {
    id: '2',
    location: 'Babusar Top',
    status: 'Closed',
    lastUpdated: '1 day ago',
    details: 'Closed due to heavy snow accumulation. Expected to open by late May.',
    tags: ['Babusar', 'Naran', 'Snow'],
  },
  {
    id: '3',
    location: 'Lowari Tunnel',
    status: 'Open',
    lastUpdated: '30 mins ago',
    details: 'Operational for all types of vehicles. No major delays reported.',
    tags: ['Chitral', 'Dir', 'Tunnel'],
  },
  {
    id: '4',
    location: 'Naran-Kaghan Road',
    status: 'Caution',
    lastUpdated: '5 hours ago',
    details: 'Open up to Naran. Road work in progress near Kaghan; expect minor delays.',
    tags: ['Naran', 'Kaghan', 'Construction'],
  },
];

export const UpdatesService = {
  getNews: async (): Promise<NewsItem[]> => {
    if (Config.USE_API) {
      try {
        const response = await fetch(`${Config.API_BASE_URL}/news`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching news:', error);
        return DUMMY_NEWS; // Fallback
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(DUMMY_NEWS), 500); // Simulate network delay
    });
  },

  getRoadStatus: async (): Promise<RoadStatus[]> => {
    if (Config.USE_API) {
      try {
        const response = await fetch(`${Config.API_BASE_URL}/roads`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching roads:', error);
        return DUMMY_ROADS; // Fallback
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(DUMMY_ROADS), 500);
    });
  },
};
