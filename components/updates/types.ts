export interface NewsItem {
  id: string;
  dateTime: string;
  title: string;
  content: string;
  tags: string[];
}

export interface RoadStatus {
  id: string;
  location: string;
  status: 'Open' | 'Closed' | 'Caution';
  lastUpdated: string;
  details: string;
  tags: string[];
}

export type UpdateView = 'News' | 'Roads';
