// hooks/useDashboardStatistics.js
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const useDashboardStatistics = () => {
  return useQuery({
    queryKey: ['dashboard-statistics'],
    queryFn: dashboardService.getStatistics,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache for 30 minutes
    refetchOnWindowFocus: false,
  });
};