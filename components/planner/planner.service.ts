import { Config } from '@/constants/config';
import { MyPlan, FeaturedPlan } from './types';

const DUMMY_MY_PLANS: MyPlan[] = [
  {
    id: 'm1',
    title: 'Skardu 7 day September',
    status: 'Saved',
    createdAt: '2024-04-20',
  },
  {
    id: 'm2',
    title: 'Mushkpuri 2 days weekend',
    status: 'Draft',
    createdAt: '2024-04-25',
  },
];

const DUMMY_FEATURED: FeaturedPlan[] = [
  {
    id: 'f1',
    title: '10 Day Ultimate North',
    duration: '10 Days',
    description: 'Comprehensive tour covering Hunza and Skardu.',
  },
  {
    id: 'f2',
    title: '3 Day Visit to Nathiagali',
    duration: '3 Days',
    description: 'Quick weekend getaway.',
  },
];

export const PlannerService = {
  getMyPlans: async (): Promise<MyPlan[]> => {
    if (Config.USE_API) return [];
    return new Promise((resolve) => setTimeout(() => resolve(DUMMY_MY_PLANS), 500));
  },
  getFeaturedPlans: async (): Promise<FeaturedPlan[]> => {
    if (Config.USE_API) return [];
    return new Promise((resolve) => setTimeout(() => resolve(DUMMY_FEATURED), 500));
  }
};
