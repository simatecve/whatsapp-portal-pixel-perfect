
import { useDashboardStats } from './useDashboardStats';
import { calculateResponseRate, calculateApiUsage } from '@/utils/dashboardUtils';
import { DashboardStats, DashboardMessage } from '@/types/dashboard';

export type { DashboardStats, DashboardMessage };

export const useDashboardData = (userId: string | null) => {
  const { 
    stats, 
    setStats, 
    recentMessages, 
    messagesPerDay, 
    isLoading, 
  } = useDashboardStats(userId);

  return { 
    stats, 
    setStats, 
    recentMessages, 
    messagesPerDay, 
    isLoading, 
    calculateResponseRate, 
    calculateApiUsage 
  };
};
