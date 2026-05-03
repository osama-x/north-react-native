export interface NewsItem {
  id: string;
  dateTime: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  thumbnail?: string;
  image?: string;
}

export interface RoadStatus {
  id: string;
  location: string;
  status: 'Open' | 'Closed' | 'Caution';
  lastUpdated: string;
  details: string;
  tags: string[];
  thumbnail?: string;
}

export type UpdateView = 'News' | 'Roads';
