export interface MyPlan {
  id: string;
  title: string;
  status: 'Draft' | 'Saved' | 'Completed';
  createdAt: string;
}

export interface FeaturedPlan {
  id: string;
  title: string;
  duration: string;
  description: string;
}
